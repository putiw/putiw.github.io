# Mobile panorama assets

This directory contains the guided mobile gallery and its generated cubemap assets. The panorama generator renders the existing full Three.js gallery through a deliberately narrow capture API; it does not add a runtime dependency to the website.

## Prerequisites

- Node.js 22 or newer (the script uses Node's built-in WebSocket client)
- Google Chrome
- ImageMagick 7 (`magick`; ImageMagick 6 `convert` is also accepted)
- WebP tools (`cwebp`)

On macOS, ImageMagick and WebP tools can be installed with `brew install imagemagick webp`. The usual macOS and Linux Chrome locations are detected. Set `CHROME_PATH`, `MAGICK_PATH`, or `CWEBP_PATH` to an executable when it is installed elsewhere. The artwork thumbnail verifier also accepts `IDENTIFY_PATH` for an ImageMagick 6 `identify` executable that is not beside `convert`.

Run from the website repository root (`putiw.github.io`):

```sh
node gallery/mobile/scripts/generate-panoramas.mjs
```

The default command captures all 18 audited nodes and six faces per node at 2560×2560. For a Main/App vertical slice:

```sh
node gallery/mobile/scripts/generate-panoramas.mjs --nodes main-intro,app-mid
```

`--nodes` creates a complete, internally consistent slice and replaces the generated panorama directory with only those nodes. It is not an incremental update. Regenerate without `--nodes` before publishing.

Verify every listed file, byte count, SHA-256 digest, WebP dimension, aggregate count, and the absence of unlisted WebPs with:

```sh
node gallery/mobile/scripts/generate-panoramas.mjs --verify
```

## Capture contract

The script starts a loopback-only static server at the website root and opens `/?gallery=full&gallery-capture=1`. That page must expose:

```js
window.__galleryCapture = {
  ready: Promise,
  nodeIds: Array,
  captureFace(nodeId, face, size) // Promise<data:image/png;base64,...>
};
```

`nodeIds` must contain the 18 IDs defined in the generator. Faces are `px`, `nx`, `py`, `ny`, `pz`, and `nz`. `ready` must resolve only after the capture scene is stable. Capture mode must suppress analytics, speculative/background loading, and all audio/video requests. The generator blocks media as a second line of defense and fails on media attempts or bytes, failed requests, HTTP errors, browser console errors, missing faces, invalid dimensions, or blank faces.

## Output

Generated output is replaced as one marked directory only after capture, conversion, and verification succeed:

```text
gallery/mobile/panoramas/
  .generated-by-generate-panoramas
  manifest.json
  <node-id>/
    base/<face>.webp
    2048/<face>/0-0.webp
    2048/<face>/0-1.webp
    ...
    2048/<face>/3-3.webp
    2560/<face>/0-0.webp
    ...
    2560/<face>/4-4.webp
```

The six 512px `base` faces form the always-complete safety cubemap. The 2048 and 2560 levels use 4×4 and 5×5 grids of 512px tiles. Tile names are `<row>-<column>.webp`.

The runtime keeps at most two complete 512px base cubemaps for transitions and refines only the three most visible faces of the current view with 2D textures. It selects 2560 when `MAX_TEXTURE_SIZE` permits, otherwise 2048, and otherwise remains on the complete base. Peak panorama texture memory is 87 MiB at 2560 (75 MiB detail plus 12 MiB bases) or 60 MiB at 2048. Every detail face starts as an upscaled base face before its tiles arrive, so turning quickly cannot expose an empty texture.

The art-wall overview follows the collections visibly baked into each physical wall composite. It includes a complete-wall preview for uncatalogued supporting imagery plus generated 360px thumbnails for every cataloged work, so selecting a wall shows all of its content without decoding every full-size image. Regenerate and verify those thumbnails from the repository root with:

```sh
node gallery/mobile/scripts/generate-art-thumbnails.mjs
node gallery/mobile/scripts/generate-art-thumbnails.mjs --verify
```

The original artwork asset is requested only after the visitor selects an individual work.

The visitor-facing Science room uses only `main-intro`, the existing central cubemap, with hotspots for every poster, résumé page, contact page, figure sheet, and film around the room. `main-science` and `main-resume` remain hidden capture-only nodes so the deterministic 18-node panorama contract and existing generated asset layout stay intact.

The visitor-facing Clinical App room uses only the central `app-mid` cubemap, with hotspots for all 12 videos and both image displays around the room. `app-north` and `app-south` remain hidden capture-only nodes for the same panorama-contract reason. The schematic map, featured route, and every doorway resolve to `app-mid`.

The guided view keeps only Map and Résumé as persistent navigation. Map opens a seven-room schematic for Art, MRI, PhD, App, Game, Video, and Science; movement within and between connected viewpoints continues through the panorama markers.

Automatically detected mobile visitors see a persistent “Best viewed on desktop” label in the top-left, aligned with the Map and Résumé controls. It recommends the complete walk-through 3D experience without linking phones into the full renderer. Ordinary desktop browsers always retain the full 3D gallery regardless of viewport width or pointer type; `?gallery=guided` remains available for explicit testing.

Video details keep the poster as the primary visual and place a compact circular Play control directly over it. The MP4 source is not attached until Play. MRI video planes use small static `previewImage` assets that are baked into the panoramas and shown in the detail view. The cortical-surface hotspot opens the standalone touch viewer in the same tab, so its meshes and 3D renderer are also loaded only after explicit selection.

Video detail copy is limited to text that is also visibly authored beside that work in the gallery. Videos without an explicit wall caption show no description; the shared project descriptions remain unchanged for the full 3D renderer.

The generator refuses to replace an existing `panoramas` directory unless it contains the exact generated marker. It builds beside the target and uses rename-based replacement, restoring the previous directory if the new rename fails.

## Determinism and budgets

Chrome runs with a fresh profile, fixed 1280×720 viewport, DPR 1, `en-US` locale, UTC timezone, sRGB color profile, a fixed V8 random seed, and SwiftShader WebGL. Faces and nodes are captured in a fixed order. Image conversion uses one ImageMagick thread, fixed Lanczos resizing, stripped metadata, and fixed `cwebp` parameters. No timestamp is written to the manifest.

Pixel output can still change across Chrome/SwiftShader, operating-system font, ImageMagick, or `cwebp` releases. The command prints the detected versions and records them in `manifest.json`; use the same recorded toolchain when byte-for-byte regeneration matters.

Each node is rejected if its complete 512px base exceeds 2 MiB or either refinement level exceeds 4 MiB. The runtime's separate acceptance budgets remain: initial UI/preview at most 0.5 MB, first usable viewpoint at most 2 MB transferred, current-node visible refinement at most 4 MB additional, and zero video/audio bytes before an explicit Play action. The generator validates panorama asset budgets and zero media during capture; runtime network tests must validate the UI and interaction budgets.
