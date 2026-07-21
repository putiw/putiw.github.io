#!/usr/bin/env python3
"""Create lighter FreeSurfer brain surfaces and matching annotations.

Run this script from a Python environment with NumPy, SciPy, and NiBabel. It
launches Blender in background mode for topology-aware mesh decimation, then
remaps each atlas annotation onto the remaining vertices.
"""

from __future__ import annotations

import argparse
import json
import struct
import subprocess
import sys
from pathlib import Path


DEFAULT_BLENDER = Path("/Applications/Blender.app/Contents/MacOS/Blender")


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--ratio", type=float, default=0.2)
    parser.add_argument("--blender", type=Path, default=DEFAULT_BLENDER)
    parser.add_argument("--blender-stage", action="store_true")
    return parser.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else None)


def read_surface(path: Path):
    import numpy as np

    with path.open("rb") as stream:
        if stream.read(3) != b"\xff\xff\xfe":
            raise ValueError(f"Unsupported FreeSurfer surface: {path}")
        stream.readline()
        stream.readline()
        vertex_count, face_count = struct.unpack(">ii", stream.read(8))
        vertices = np.frombuffer(stream.read(vertex_count * 12), dtype=">f4").astype("f4")
        faces = np.frombuffer(stream.read(face_count * 12), dtype=">i4").astype("i4")
    return vertices.reshape((-1, 3)), faces.reshape((-1, 3))


def write_surface(path: Path, vertices, faces) -> None:
    import numpy as np

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as stream:
        stream.write(b"\xff\xff\xfe")
        stream.write(b"Created by optimize_brain_surfaces.py\n\n")
        stream.write(struct.pack(">ii", len(vertices), len(faces)))
        stream.write(np.asarray(vertices, dtype=">f4").tobytes())
        stream.write(np.asarray(faces, dtype=">i4").tobytes())


def blender_stage(options: argparse.Namespace) -> None:
    import bpy
    import numpy as np

    if not 0 < options.ratio <= 1:
        raise ValueError("--ratio must be greater than 0 and at most 1")
    options.output_dir.mkdir(parents=True, exist_ok=True)

    for hemisphere in ("lh", "rh"):
        source_path = options.source_dir / f"{hemisphere}.pial"
        output_path = options.output_dir / f"{hemisphere}.optimized.pial"
        vertices, faces = read_surface(source_path)

        mesh = bpy.data.meshes.new(f"{hemisphere}_optimized")
        mesh.from_pydata(vertices.tolist(), [], faces.tolist())
        mesh.update()

        obj = bpy.data.objects.new(f"{hemisphere}_optimized", mesh)
        bpy.context.collection.objects.link(obj)
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        modifier = obj.modifiers.new(name="Web performance decimation", type="DECIMATE")
        modifier.decimate_type = "COLLAPSE"
        modifier.ratio = options.ratio
        modifier.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=modifier.name)

        optimized_mesh = obj.data
        optimized_mesh.calc_loop_triangles()
        optimized_vertices = np.empty(len(optimized_mesh.vertices) * 3, dtype=np.float32)
        optimized_mesh.vertices.foreach_get("co", optimized_vertices)
        optimized_vertices = optimized_vertices.reshape((-1, 3))

        optimized_faces = np.empty(len(optimized_mesh.loop_triangles) * 3, dtype=np.int32)
        optimized_mesh.loop_triangles.foreach_get("vertices", optimized_faces)
        optimized_faces = optimized_faces.reshape((-1, 3))

        write_surface(output_path, optimized_vertices, optimized_faces)

        print(
            f"{hemisphere}: {len(vertices):,} -> {len(optimized_vertices):,} vertices; "
            f"{len(faces):,} -> {len(optimized_faces):,} triangles"
        )
        bpy.data.objects.remove(obj, do_unlink=True)
        bpy.data.meshes.remove(mesh)


def remap_annotations(options: argparse.Namespace) -> dict:
    import nibabel.freesurfer.io as fsio
    import numpy as np
    from scipy.spatial import cKDTree

    report = {"ratio": options.ratio, "hemispheres": {}}
    for hemisphere in ("lh", "rh"):
        source_surface = options.source_dir / f"{hemisphere}.pial"
        optimized_surface = options.output_dir / f"{hemisphere}.optimized.pial"
        source_annotation = options.source_dir / f"{hemisphere}.aparc.DKTatlas.annot"
        optimized_annotation = options.output_dir / f"{hemisphere}.aparc.DKTatlas.optimized.annot"

        source_vertices, source_faces = fsio.read_geometry(source_surface)
        optimized_vertices, optimized_faces = fsio.read_geometry(optimized_surface)
        labels, color_table, names = fsio.read_annot(source_annotation)
        distances, source_indices = cKDTree(source_vertices).query(optimized_vertices)
        mapped_labels = labels[source_indices]
        fsio.write_annot(optimized_annotation, mapped_labels, color_table, names)

        report["hemispheres"][hemisphere] = {
            "source_vertices": int(len(source_vertices)),
            "optimized_vertices": int(len(optimized_vertices)),
            "source_triangles": int(len(source_faces)),
            "optimized_triangles": int(len(optimized_faces)),
            "source_bytes": source_surface.stat().st_size + source_annotation.stat().st_size,
            "optimized_bytes": optimized_surface.stat().st_size + optimized_annotation.stat().st_size,
            "nearest_source_distance_mm_p95": float(np.percentile(distances, 95)),
            "nearest_source_distance_mm_max": float(distances.max()),
        }
    return report


def host_stage(options: argparse.Namespace) -> None:
    if not options.blender.is_file():
        raise FileNotFoundError(f"Blender executable not found: {options.blender}")
    if not 0 < options.ratio <= 1:
        raise ValueError("--ratio must be greater than 0 and at most 1")

    options.source_dir = options.source_dir.resolve()
    options.output_dir = options.output_dir.resolve()
    options.output_dir.mkdir(parents=True, exist_ok=True)

    command = [
        str(options.blender),
        "--background",
        "--python",
        str(Path(__file__).resolve()),
        "--",
        "--blender-stage",
        "--source-dir",
        str(options.source_dir),
        "--output-dir",
        str(options.output_dir),
        "--ratio",
        str(options.ratio),
    ]
    subprocess.run(command, check=True)
    report = remap_annotations(options)

    report_path = options.output_dir / "brain-optimization-report.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    parsed = arguments()
    if parsed.blender_stage:
        blender_stage(parsed)
    else:
        host_stage(parsed)
