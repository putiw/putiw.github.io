import * as THREE from './gallery/vendor/three.module.min.js';

const viewer = document.getElementById('viewer');
const loadState = document.getElementById('load-state');
const stateDot = document.querySelector('.state-dot');
const viewerError = document.getElementById('viewer-error');
const meshStats = document.getElementById('mesh-stats');
const showLeft = document.getElementById('show-left');
const showRight = document.getElementById('show-right');
const surfaceStyle = document.getElementById('surface-style');
const resetViewButton = document.getElementById('reset-view');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#071117');

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 5000);
camera.position.set(0, 42, 250);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
viewer.appendChild(renderer.domElement);
renderer.domElement.tabIndex = 0;

const orbitTarget = new THREE.Vector3();
const orbitSpherical = new THREE.Spherical();
const orbitOffset = new THREE.Vector3();
const panRight = new THREE.Vector3();
const panUp = new THREE.Vector3();
const orbitPointers = new Map();
let orbitGesture = null;
let orbitMinDistance = 15;
let orbitMaxDistance = 900;

function syncOrbitFromCamera() {
  orbitOffset.copy(camera.position).sub(orbitTarget);
  orbitSpherical.setFromVector3(orbitOffset);
  orbitSpherical.makeSafe();
}

function applyOrbit() {
  orbitSpherical.radius = THREE.MathUtils.clamp(
    orbitSpherical.radius,
    orbitMinDistance,
    orbitMaxDistance
  );
  orbitSpherical.phi = THREE.MathUtils.clamp(orbitSpherical.phi, 0.08, Math.PI - 0.08);
  orbitOffset.setFromSpherical(orbitSpherical);
  camera.position.copy(orbitTarget).add(orbitOffset);
  camera.lookAt(orbitTarget);
}

function pointerCenter(points) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length
  };
}

function pointerSeparation(points) {
  return points.length < 2
    ? 0
    : Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

function beginOrbitGesture(event = null) {
  const points = [...orbitPointers.values()];
  if (!points.length) {
    orbitGesture = null;
    viewer.classList.remove('is-dragging');
    return;
  }
  orbitGesture = {
    center: pointerCenter(points),
    distance: pointerSeparation(points),
    phi: orbitSpherical.phi,
    radius: orbitSpherical.radius,
    target: orbitTarget.clone(),
    theta: orbitSpherical.theta,
    pan: Boolean(event?.shiftKey || event?.button === 1 || event?.button === 2)
  };
  viewer.classList.add('is-dragging');
}

function panOrbit(deltaX, deltaY, startTarget = orbitTarget) {
  const worldPerPixel = (
    2 * orbitSpherical.radius * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
  ) / Math.max(1, renderer.domElement.clientHeight);
  panRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  panUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
  orbitTarget.copy(startTarget)
    .addScaledVector(panRight, -deltaX * worldPerPixel)
    .addScaledVector(panUp, deltaY * worldPerPixel);
}

renderer.domElement.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  orbitPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  renderer.domElement.setPointerCapture(event.pointerId);
  beginOrbitGesture(event);
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!orbitPointers.has(event.pointerId) || !orbitGesture) return;
  orbitPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const points = [...orbitPointers.values()];
  const center = pointerCenter(points);
  const deltaX = center.x - orbitGesture.center.x;
  const deltaY = center.y - orbitGesture.center.y;
  if (points.length >= 2 && orbitGesture.distance > 0) {
    orbitSpherical.radius = orbitGesture.radius
      * orbitGesture.distance / Math.max(1, pointerSeparation(points));
    applyOrbit();
    panOrbit(deltaX, deltaY, orbitGesture.target);
  } else if (orbitGesture.pan) {
    panOrbit(deltaX, deltaY, orbitGesture.target);
  } else {
    orbitSpherical.theta = orbitGesture.theta - deltaX * 0.008;
    orbitSpherical.phi = orbitGesture.phi - deltaY * 0.008;
  }
  applyOrbit();
});

function finishOrbitPointer(event) {
  orbitPointers.delete(event.pointerId);
  if (renderer.domElement.hasPointerCapture(event.pointerId)) {
    renderer.domElement.releasePointerCapture(event.pointerId);
  }
  beginOrbitGesture();
}

renderer.domElement.addEventListener('pointerup', finishOrbitPointer);
renderer.domElement.addEventListener('pointercancel', finishOrbitPointer);
renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
renderer.domElement.addEventListener('wheel', (event) => {
  event.preventDefault();
  orbitSpherical.radius *= Math.exp(event.deltaY * 0.0012);
  applyOrbit();
}, { passive: false });

scene.add(new THREE.HemisphereLight(0xa7e5ed, 0x071017, 2.15));

const keyLight = new THREE.DirectionalLight(0xd9f9ff, 3.6);
keyLight.position.set(-120, 160, 210);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x5382b7, 2.25);
rimLight.position.set(180, -30, -170);
scene.add(rimLight);

const surfaceGroup = new THREE.Group();
scene.add(surfaceGroup);

const hemisphereMeshes = {
  left: null,
  right: null
};

const startCameraPosition = new THREE.Vector3();
const startTarget = new THREE.Vector3();

function setStatus(message, type = 'loading') {
  loadState.textContent = message;
  stateDot.className = `state-dot ${type === 'ready' ? 'ready' : type === 'error' ? 'error' : ''}`;
}

function readFreeSurferSurface(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0xff || bytes[1] !== 0xff || bytes[2] !== 0xfe) {
    throw new Error('Unsupported surface format');
  }

  let offset = 3;
  const readLine = () => {
    const start = offset;
    while (offset < bytes.length && bytes[offset] !== 10) offset += 1;
    const line = new TextDecoder().decode(bytes.subarray(start, offset));
    offset += 1;
    return line;
  };

  readLine();
  readLine();

  const data = new DataView(buffer);
  const vertexCount = data.getInt32(offset, false);
  offset += 4;
  const faceCount = data.getInt32(offset, false);
  offset += 4;

  const positions = new Float32Array(vertexCount * 3);
  for (let i = 0; i < positions.length; i += 1) {
    positions[i] = data.getFloat32(offset, false);
    offset += 4;
  }

  const indices = new Uint32Array(faceCount * 3);
  for (let i = 0; i < indices.length; i += 1) {
    indices[i] = data.getInt32(offset, false);
    offset += 4;
  }

  return { positions, indices, vertexCount, faceCount };
}

function createSurfaceMesh(surface, color) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(surface.positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(surface.indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    metalness: 0.03,
    side: THREE.DoubleSide,
    wireframe: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = surface.name;
  return mesh;
}

function centerAndFrame() {
  const bounds = new THREE.Box3().setFromObject(surfaceGroup);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  surfaceGroup.position.sub(center);

  camera.near = Math.max(maxSize / 10000, 0.01);
  camera.far = Math.max(maxSize * 12, 1000);
  camera.position.set(maxSize * 0.98, maxSize * 0.34, maxSize * 1.42);
  orbitTarget.set(0, 0, 0);
  orbitMinDistance = maxSize * 0.32;
  orbitMaxDistance = maxSize * 5;
  syncOrbitFromCamera();
  applyOrbit();

  startCameraPosition.copy(camera.position);
  startTarget.copy(orbitTarget);
}

function resetView() {
  camera.position.copy(startCameraPosition);
  orbitTarget.copy(startTarget);
  syncOrbitFromCamera();
  applyOrbit();
}

function updateVisibility() {
  if (hemisphereMeshes.left) hemisphereMeshes.left.visible = showLeft.checked;
  if (hemisphereMeshes.right) hemisphereMeshes.right.visible = showRight.checked;
}

function updateSurfaceStyle() {
  const wireframe = surfaceStyle.value === 'wireframe';
  Object.values(hemisphereMeshes).forEach((mesh) => {
    if (mesh) mesh.material.wireframe = wireframe;
  });
}

function resize() {
  const width = viewer.clientWidth;
  const height = viewer.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

async function loadSurface(path, name, color) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  const surface = readFreeSurferSurface(await response.arrayBuffer());
  surface.name = name;
  return createSurfaceMesh(surface, color);
}

async function init() {
  try {
    setStatus('Loading left hemisphere…');
    const [left, right] = await Promise.all([
      loadSurface('mri/lh.optimized.pial', 'Left hemisphere', 0x51bfd1),
      loadSurface('mri/rh.optimized.pial', 'Right hemisphere', 0xe89a87)
    ]);

    hemisphereMeshes.left = left;
    hemisphereMeshes.right = right;
    surfaceGroup.add(left, right);
    centerAndFrame();
    updateVisibility();
    updateSurfaceStyle();

    const totalVertices = left.geometry.attributes.position.count + right.geometry.attributes.position.count;
    const totalFaces = (left.geometry.index.count + right.geometry.index.count) / 3;
    meshStats.textContent = `${totalVertices.toLocaleString()} vertices · ${totalFaces.toLocaleString()} triangles`;
    setStatus('Ready', 'ready');
    resize();
  } catch (error) {
    console.error(error);
    setStatus('Surface load failed', 'error');
    viewerError.hidden = false;
    meshStats.textContent = 'Mesh data unavailable';
  }
}

showLeft.addEventListener('change', updateVisibility);
showRight.addEventListener('change', updateVisibility);
surfaceStyle.addEventListener('change', updateSurfaceStyle);
resetViewButton.addEventListener('click', resetView);
window.addEventListener('resize', resize);
renderer.domElement.addEventListener('keydown', (event) => {
  const rotationStep = THREE.MathUtils.degToRad(8);
  if (event.key === 'ArrowLeft') orbitSpherical.theta += rotationStep;
  else if (event.key === 'ArrowRight') orbitSpherical.theta -= rotationStep;
  else if (event.key === 'ArrowUp') orbitSpherical.phi -= rotationStep;
  else if (event.key === 'ArrowDown') orbitSpherical.phi += rotationStep;
  else if (event.key === '+' || event.key === '=') orbitSpherical.radius *= 0.88;
  else if (event.key === '-' || event.key === '_') orbitSpherical.radius *= 1.12;
  else if (event.key.toLowerCase() === 'r' || event.key === '0') {
    resetView();
    event.preventDefault();
    return;
  } else return;
  event.preventDefault();
  applyOrbit();
});

if ('ResizeObserver' in window) {
  new ResizeObserver(resize).observe(viewer);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

resize();
animate();
init();
