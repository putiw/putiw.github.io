import { FEATURED_ROUTE, NODE_BY_ID, ROOM_LABELS, TOUR_NODES } from './tour-manifest.js?v=20260722-app-center-device1';
import { WORKS_BY_ID } from '../project-data.js?v=20260722-app-center-device1';

const FACES = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
const FACE_TARGETS = [
  'TEXTURE_CUBE_MAP_POSITIVE_X',
  'TEXTURE_CUBE_MAP_NEGATIVE_X',
  'TEXTURE_CUBE_MAP_POSITIVE_Y',
  'TEXTURE_CUBE_MAP_NEGATIVE_Y',
  'TEXTURE_CUBE_MAP_POSITIVE_Z',
  'TEXTURE_CUBE_MAP_NEGATIVE_Z'
];
const DEG = Math.PI / 180;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cacheLimit = 2;
const detailFaceLimit = 3;
const nodeLookup = NODE_BY_ID instanceof Map ? NODE_BY_ID : new Map(Object.entries(NODE_BY_ID));
const workLookup = WORKS_BY_ID instanceof Map ? WORKS_BY_ID : new Map(Object.entries(WORKS_BY_ID));
const MAP_ROOMS = Object.freeze({
  art: Object.freeze({ label: 'Art', target: 'art-salon', ariaLabel: 'Open the Art room' }),
  mri: Object.freeze({ label: 'MRI', target: 'mri-brain', ariaLabel: 'Open the MRI room' }),
  phd: Object.freeze({ label: 'PhD', target: 'defense', ariaLabel: 'Open the PhD defense room' }),
  app: Object.freeze({ label: 'App', target: 'app-mid', ariaLabel: 'Open the Clinical App room' }),
  game: Object.freeze({ label: 'Game', target: 'game', ariaLabel: 'Open the Game room' }),
  video: Object.freeze({ label: 'Video', target: 'videos', ariaLabel: 'Open the Video room' }),
  science: Object.freeze({ label: 'Science', target: 'main-intro', ariaLabel: 'Open the Science room' })
});
// These are the only video-copy fields visibly rendered beside the same work
// in the gallery. Video details without an entry intentionally show no copy.
const VIDEO_WALL_COPY_FIELDS = Object.freeze({
  'cbh-film': 'meta',
  'cvs-mask-review': 'description',
  'cvs-rapid-navigation': 'description',
  'cvs-prl-review': 'description',
  'lesion-segmentation': 'description',
  'lesion-comparison': 'description',
  'lesion-verification': 'description',
  'myphysio-app-welcome': 'description',
  'myphysio-daily-exercise': 'description',
  'myphysio-workout-tracker': 'description',
  'myphysio-pain-diary': 'description',
  'myphysio-rom-diary': 'description',
  'myphysio-program-manager': 'description',
  'game-echoing-end': 'description',
  'game-shrimp': 'description'
});
const VIDEO_WALL_COPY_OVERRIDES = Object.freeze({
  'mri-afqview': 'A small web app | built for AFQ post-processing',
  'mri-functional': 'Localize cortical areas with functions'
});

document.querySelector('.gallery-app')?.setAttribute('hidden', '');
const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = './mobile/style.css?v=20260722-desktop-note2';
document.head.append(stylesheet);

const root = document.createElement('main');
root.className = 'mobile-tour';
root.innerHTML = `
  <canvas class="tour-canvas" aria-label="Guided 360 degree gallery view"></canvas>
  <div class="tour-shade" aria-hidden="true"></div>
  <header class="tour-header">
    <p class="tour-desktop-note" aria-label="Best viewed on desktop for the full interactive 3D gallery" hidden>Best viewed on desktop</p>
    <nav class="tour-top-actions" aria-label="Portfolio links">
      <a class="tour-resume" href="/resume/" target="puti-resume" rel="noopener">Résumé</a>
      <button class="tour-map-trigger" type="button" data-action="map">Map</button>
    </nav>
  </header>
  <section class="tour-place" aria-live="polite">
    <p class="tour-room"></p>
    <h1 class="tour-node-title"></h1>
    <p class="tour-instruction">Drag to look · Pinch to zoom · Tap a marker to move</p>
  </section>
  <div class="tour-hotspots" aria-label="Viewpoints and works in this view"></div>
  <section class="tour-loading" aria-live="polite">
    <span class="tour-loading-mark" aria-hidden="true"></span>
    <p>Opening the guided gallery…</p>
    <div class="tour-loading-actions" hidden>
      <button class="tour-loading-primary" type="button" data-loading-retry>Try again</button>
      <button class="tour-loading-secondary" type="button" data-loading-map>Open map</button>
    </div>
  </section>
  <dialog class="tour-sheet tour-map-sheet" aria-labelledby="map-title">
    <header><div><p>Choose a room</p><h2 id="map-title">Gallery map</h2></div><button type="button" data-close aria-label="Close map">Close</button></header>
    <nav class="tour-map" aria-label="Gallery rooms"></nav>
  </dialog>
  <dialog class="tour-detail" aria-labelledby="detail-title">
    <header><div><p class="detail-category"></p><h2 id="detail-title"></h2></div><div class="detail-header-actions"><button type="button" data-wall-back aria-label="Back to artwork wall" hidden>Back</button><button type="button" data-close aria-label="Close detail">Close</button></div></header>
    <div class="detail-media"></div>
    <div class="detail-copy"><p></p><div class="detail-actions"></div></div>
  </dialog>
  <p class="tour-status" aria-live="polite"></p>
`;
document.body.append(root);

const canvas = root.querySelector('.tour-canvas');
const hotspotsLayer = root.querySelector('.tour-hotspots');
const loading = root.querySelector('.tour-loading');
const loadingCopy = loading.querySelector('p');
const loadingMark = loading.querySelector('.tour-loading-mark');
const loadingActions = loading.querySelector('.tour-loading-actions');
const loadingRetryButton = loading.querySelector('[data-loading-retry]');
const loadingMapButton = loading.querySelector('[data-loading-map]');
const roomLabel = root.querySelector('.tour-room');
const nodeTitle = root.querySelector('.tour-node-title');
const mapButton = root.querySelector('[data-action="map"]');
const mapSheet = root.querySelector('.tour-map-sheet');
const detailDialog = root.querySelector('.tour-detail');
const detailWallBackButton = detailDialog.querySelector('[data-wall-back]');
const mapRoot = root.querySelector('.tour-map');
const status = root.querySelector('.tour-status');
const desktopNote = root.querySelector('.tour-desktop-note');
const desktopNoteEligible = window.__PUTI_MOBILE_BY_AGENT__ === true
  || new URLSearchParams(window.location.search).get('gallery') === 'guided';

function maybeShowDesktopNote() {
  if (desktopNoteEligible) desktopNote.hidden = false;
}

const gl = canvas.getContext('webgl', {
  antialias: false,
  alpha: false,
  depth: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false
});

if (!gl) {
  loadingMark.hidden = true;
  loadingCopy.textContent = 'This browser cannot display the panorama. The résumé is still available.';
  const resumeLink = document.createElement('a');
  resumeLink.href = '../resume/';
  resumeLink.textContent = 'View résumé';
  resumeLink.className = 'tour-fallback-link';
  loading.append(resumeLink);
  throw new Error('WebGL is unavailable for the guided gallery.');
}

const maxCubeMapSize = Number(gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)) || 0;
const maxTextureSize = Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 0;

const vertexSource = `
  attribute vec2 position;
  varying vec2 screenPosition;
  void main() {
    screenPosition = position;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;
const fragmentSource = `
  precision highp float;
  varying vec2 screenPosition;
  uniform samplerCube currentPanorama;
  uniform samplerCube previousPanorama;
  uniform sampler2D detailTexture0;
  uniform sampler2D detailTexture1;
  uniform sampler2D detailTexture2;
  uniform int detailFace0;
  uniform int detailFace1;
  uniform int detailFace2;
  uniform int detailOwner;
  uniform float yaw;
  uniform float pitch;
  uniform float tanHalfFov;
  uniform float aspect;
  uniform float blendAmount;
  void cubeFaceUv(vec3 direction, out int face, out vec2 uv) {
    vec3 magnitude = abs(direction);
    float sc;
    float tc;
    float major;
    if (magnitude.x >= magnitude.y && magnitude.x >= magnitude.z) {
      if (direction.x > 0.0) {
        face = 0;
        sc = -direction.z;
        tc = -direction.y;
      } else {
        face = 1;
        sc = direction.z;
        tc = -direction.y;
      }
      major = magnitude.x;
    } else if (magnitude.y >= magnitude.x && magnitude.y >= magnitude.z) {
      if (direction.y > 0.0) {
        face = 2;
        sc = direction.x;
        tc = direction.z;
      } else {
        face = 3;
        sc = direction.x;
        tc = -direction.z;
      }
      major = magnitude.y;
    } else {
      if (direction.z > 0.0) {
        face = 4;
        sc = direction.x;
        tc = -direction.y;
      } else {
        face = 5;
        sc = -direction.x;
        tc = -direction.y;
      }
      major = magnitude.z;
    }
    uv = clamp(vec2(sc, tc) / major * 0.5 + 0.5, 0.0, 0.999999);
  }
  vec4 applyFaceDetail(vec4 baseColor, vec3 direction) {
    int face;
    vec2 uv;
    cubeFaceUv(direction, face, uv);
    if (face == detailFace0) return texture2D(detailTexture0, uv);
    if (face == detailFace1) return texture2D(detailTexture1, uv);
    if (face == detailFace2) return texture2D(detailTexture2, uv);
    return baseColor;
  }
  void main() {
    float cy = cos(yaw);
    float sy = sin(yaw);
    float cp = cos(pitch);
    float sp = sin(pitch);
    vec3 forward = vec3(sy * cp, sp, -cy * cp);
    vec3 right = vec3(cy, 0.0, sy);
    vec3 up = vec3(-sy * sp, cp, cy * sp);
    vec3 direction = normalize(
      forward
      + right * screenPosition.x * aspect * tanHalfFov
      + up * screenPosition.y * tanHalfFov
    );
    vec4 currentColor = textureCube(currentPanorama, direction);
    vec4 previousColor = textureCube(previousPanorama, direction);
    if (detailOwner == 0) currentColor = applyFaceDetail(currentColor, direction);
    if (detailOwner == 1) previousColor = applyFaceDetail(previousColor, direction);
    gl_FragColor = mix(previousColor, currentColor, blendAmount);
  }
`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Panorama shader failed to compile.');
  }
  return shader;
}

const program = gl.createProgram();
gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program) || 'Panorama shader failed to link.');
}
gl.useProgram(program);
const triangle = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
const uniforms = {
  current: gl.getUniformLocation(program, 'currentPanorama'),
  previous: gl.getUniformLocation(program, 'previousPanorama'),
  detailTextures: [0, 1, 2].map((index) => gl.getUniformLocation(program, `detailTexture${index}`)),
  detailFaces: [0, 1, 2].map((index) => gl.getUniformLocation(program, `detailFace${index}`)),
  detailOwner: gl.getUniformLocation(program, 'detailOwner'),
  yaw: gl.getUniformLocation(program, 'yaw'),
  pitch: gl.getUniformLocation(program, 'pitch'),
  tanHalfFov: gl.getUniformLocation(program, 'tanHalfFov'),
  aspect: gl.getUniformLocation(program, 'aspect'),
  blend: gl.getUniformLocation(program, 'blendAmount')
};
gl.uniform1i(uniforms.current, 0);
gl.uniform1i(uniforms.previous, 1);
uniforms.detailTextures.forEach((location, index) => gl.uniform1i(location, index + 2));

const emptyDetailTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, emptyDetailTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  1,
  1,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 0, 255])
);

let currentNode = null;
let currentRecord = null;
let previousRecord = null;
let yaw = 0;
let pitch = 0;
let fov = 78;
let blend = 1;
let renderFrame = 0;
let transitionFrame = 0;
let navigationSerial = 0;
let navigationController = null;
let prefetchController = null;
let refinementController = null;
let refinementTimer = 0;
let refinementPromise = Promise.resolve();
let mapBuilt = false;
let lastFocusedElement = null;
let failedNodeId = null;
const pointers = new Map();
const textureCache = new Map();
const prefetchedBases = new Map();
const debugState = {
  renders: 0,
  requests: 0,
  transferredBytes: 0,
  tileRequests: 0,
  baseRequests: 0,
  evictions: 0,
  detailEvictions: 0,
  contextLosses: 0,
  nodeChanges: 0,
  videoSourcesAttached: 0
};

canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  debugState.contextLosses += 1;
  status.textContent = 'The panorama renderer paused. Reload to continue.';
});
canvas.addEventListener('webglcontextrestored', () => {
  status.textContent = 'Restoring the panorama renderer…';
  window.location.reload();
});

function normalizeAngle(value) {
  let result = value;
  while (result > Math.PI) result -= Math.PI * 2;
  while (result < -Math.PI) result += Math.PI * 2;
  return result;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2.25);
  const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
  if (canvas.width === width && canvas.height === height) return;
  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
}

function cameraBasis() {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return {
    forward: [sy * cp, sp, -cy * cp],
    right: [cy, 0, sy],
    up: [-sy * sp, cp, cy * sp]
  };
}

function worldRay(screenX, screenY) {
  const { forward, right, up } = cameraBasis();
  const tangent = Math.tan((fov * DEG) / 2);
  const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
  const x = screenX * aspect * tangent;
  const y = screenY * tangent;
  const ray = [
    forward[0] + right[0] * x + up[0] * y,
    forward[1] + right[1] * x + up[1] * y,
    forward[2] + right[2] * x + up[2] * y
  ];
  const length = Math.hypot(...ray) || 1;
  return ray.map((component) => component / length);
}

function directionForAngles(degreesYaw, degreesPitch) {
  const longitude = degreesYaw * DEG;
  const latitude = degreesPitch * DEG;
  return [
    Math.sin(longitude) * Math.cos(latitude),
    Math.sin(latitude),
    -Math.cos(longitude) * Math.cos(latitude)
  ];
}

function dot(left, right) {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function positionHotspot(button, hotspotYaw, hotspotPitch) {
  const direction = directionForAngles(hotspotYaw, hotspotPitch);
  const { forward, right, up } = cameraBasis();
  const depth = dot(direction, forward);
  if (depth <= 0.06) {
    button.hidden = true;
    return;
  }
  const tangent = Math.tan((fov * DEG) / 2);
  const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
  const x = dot(direction, right) / (depth * tangent * aspect);
  const y = dot(direction, up) / (depth * tangent);
  if (Math.abs(x) > 1.18 || Math.abs(y) > 1.18) {
    button.hidden = true;
    return;
  }
  button.hidden = false;
  button.style.left = `${(x * 0.5 + 0.5) * 100}%`;
  button.style.top = `${(0.5 - y * 0.5) * 100}%`;
}

function updateHotspotPositions() {
  hotspotsLayer.querySelectorAll('[data-yaw]').forEach((button) => {
    positionHotspot(button, Number(button.dataset.yaw), Number(button.dataset.pitch));
  });
}

function render() {
  renderFrame = 0;
  if (!currentRecord) return;
  resizeCanvas();
  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, currentRecord.texture);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, (previousRecord || currentRecord).texture);
  const detailRecord = previousRecord?.detailFaces.size ? previousRecord : currentRecord;
  const details = detailRecord ? [...detailRecord.detailFaces.values()] : [];
  for (let index = 0; index < detailFaceLimit; index += 1) {
    const detail = details[index];
    gl.activeTexture(gl.TEXTURE0 + index + 2);
    gl.bindTexture(gl.TEXTURE_2D, detail?.texture || emptyDetailTexture);
    gl.uniform1i(uniforms.detailFaces[index], detail ? FACES.indexOf(detail.face) : -1);
  }
  gl.uniform1i(
    uniforms.detailOwner,
    details.length ? (detailRecord === previousRecord ? 1 : 0) : -1
  );
  gl.uniform1f(uniforms.yaw, yaw);
  gl.uniform1f(uniforms.pitch, pitch);
  gl.uniform1f(uniforms.tanHalfFov, Math.tan((fov * DEG) / 2));
  gl.uniform1f(uniforms.aspect, canvas.width / Math.max(1, canvas.height));
  gl.uniform1f(uniforms.blend, blend);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  debugState.renders += 1;
  updateHotspotPositions();
}

function requestRender() {
  if (!renderFrame) renderFrame = window.requestAnimationFrame(render);
}

async function fetchBlob(url, signal, type) {
  debugState.requests += 1;
  if (type === 'base') debugState.baseRequests += 1;
  if (type === 'tile') debugState.tileRequests += 1;
  const response = await fetch(url, { signal, cache: 'force-cache', credentials: 'same-origin' });
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status}).`);
  const blob = await response.blob();
  debugState.transferredBytes += blob.size;
  return blob;
}

async function decodeBlob(blob) {
  if ('createImageBitmap' in window) return createImageBitmap(blob);
  const image = new Image();
  const objectUrl = URL.createObjectURL(blob);
  image.decoding = 'async';
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('An image could not be decoded.'));
      image.src = objectUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function releaseImage(image) {
  if (typeof image.close === 'function') image.close();
}

function panoramaPath(node, suffix) {
  const base = node.panorama.basePath || `./mobile/panoramas/${node.id}`;
  return `${base}/${suffix}?v=${encodeURIComponent(node.panorama.version)}`;
}

function touchCache(record) {
  textureCache.delete(record.nodeId);
  textureCache.set(record.nodeId, record);
}

function disposeDetailFace(record, face) {
  const detail = record?.detailFaces?.get(face);
  if (!detail) return;
  gl.deleteTexture(detail.texture);
  record.detailFaces.delete(face);
  record.gpuBytes -= detail.gpuBytes;
}

function disposeDetailFaces(record) {
  if (!record?.detailFaces) return;
  [...record.detailFaces.keys()].forEach((face) => disposeDetailFace(record, face));
}

function disposeInactiveDetailFaces(preservedRecord) {
  textureCache.forEach((record) => {
    if (record !== preservedRecord) disposeDetailFaces(record);
  });
}

function disposeRecord(record) {
  if (!record || record.disposed) return;
  record.disposed = true;
  disposeDetailFaces(record);
  gl.deleteTexture(record.texture);
}

function enforceCacheLimit(limit = cacheLimit, preservedRecord = null) {
  while (textureCache.size > limit) {
    const candidate = [...textureCache.values()].find((record) => (
      record !== currentRecord && record !== previousRecord && record !== preservedRecord
    ));
    if (!candidate) return;
    textureCache.delete(candidate.nodeId);
    disposeRecord(candidate);
    debugState.evictions += 1;
  }
}

async function loadPanorama(node, signal) {
  const cached = textureCache.get(node.id);
  if (cached && !cached.disposed) {
    touchCache(cached);
    return cached;
  }
  const prefetched = prefetchedBases.get(node.id);
  const blobs = await Promise.all(FACES.map((face) => (
    prefetched?.get(face)
      ? prefetched.get(face)
      : fetchBlob(panoramaPath(node, `base/${face}.webp`), signal, 'base')
  )));
  if (signal.aborted) throw new DOMException('Navigation changed.', 'AbortError');
  prefetchedBases.delete(node.id);
  const images = await Promise.all(blobs.map(decodeBlob));
  if (signal.aborted) {
    images.forEach(releaseImage);
    throw new DOMException('Navigation changed.', 'AbortError');
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const faceSize = Math.min(node.panorama.baseSize, maxCubeMapSize);
  if (faceSize < 1) throw new Error('This device cannot allocate a panorama cubemap.');
  const detailLevel = node.panorama.levels.reduce((selected, level) => (
    level <= maxTextureSize ? Math.max(selected, level) : selected
  ), 0);
  const scratch = document.createElement('canvas');
  scratch.width = faceSize;
  scratch.height = faceSize;
  const context = scratch.getContext('2d', { alpha: false });
  images.forEach((image, index) => {
    context.clearRect(0, 0, scratch.width, scratch.height);
    context.drawImage(image, 0, 0, scratch.width, scratch.height);
    gl.texImage2D(
      gl[FACE_TARGETS[index]],
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      scratch
    );
    releaseImage(image);
  });
  scratch.width = 1;
  scratch.height = 1;
  const record = {
    nodeId: node.id,
    texture,
    faceSize,
    baseBlobs: new Map(FACES.map((face, index) => [face, blobs[index]])),
    detailLevel,
    detailFaces: new Map(),
    refinementSupported: detailLevel > 0,
    gpuBytes: FACES.length * faceSize * faceSize * 4,
    disposed: false
  };
  textureCache.set(node.id, record);
  return record;
}

function cubeFaceUv([x, y, z]) {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const az = Math.abs(z);
  let face;
  let sc;
  let tc;
  let magnitude;
  if (ax >= ay && ax >= az) {
    if (x > 0) { face = 'px'; sc = -z; tc = -y; magnitude = ax; }
    else { face = 'nx'; sc = z; tc = -y; magnitude = ax; }
  } else if (ay >= ax && ay >= az) {
    if (y > 0) { face = 'py'; sc = x; tc = z; magnitude = ay; }
    else { face = 'ny'; sc = x; tc = -z; magnitude = ay; }
  } else if (z > 0) {
    face = 'pz'; sc = x; tc = -y; magnitude = az;
  } else {
    face = 'nz'; sc = -x; tc = -y; magnitude = az;
  }
  return {
    face,
    u: clamp((sc / magnitude + 1) / 2, 0, 0.999999),
    v: clamp((tc / magnitude + 1) / 2, 0, 0.999999)
  };
}

function visibleTileGroups(level, tileSize) {
  const divisions = Math.ceil(level / tileSize);
  const xSamples = Math.max(8, divisions * 4);
  const ySamples = Math.max(6, divisions * 4);
  const groups = new Map();
  for (let yIndex = 0; yIndex <= ySamples; yIndex += 1) {
    for (let xIndex = 0; xIndex <= xSamples; xIndex += 1) {
      const sampleX = -1 + (xIndex / xSamples) * 2;
      const sampleY = 1 - (yIndex / ySamples) * 2;
      const { face, u, v } = cubeFaceUv(worldRay(sampleX, sampleY));
      const column = Math.min(divisions - 1, Math.floor((u * level) / tileSize));
      const row = Math.min(divisions - 1, Math.floor((v * level) / tileSize));
      if (!groups.has(face)) groups.set(face, { face, keys: new Set(), score: 0 });
      const group = groups.get(face);
      group.keys.add(`${level}:${face}:${row}:${column}`);
      group.score += 1 / (1 + sampleX * sampleX + sampleY * sampleY);
    }
  }
  return [...groups.values()].sort((left, right) => right.score - left.score);
}

function touchDetailFace(record, detail) {
  record.detailFaces.delete(detail.face);
  record.detailFaces.set(detail.face, detail);
}

async function ensureDetailFace(record, node, face, wantedFaces, signal) {
  const cached = record.detailFaces.get(face);
  if (cached) {
    touchDetailFace(record, cached);
    return cached;
  }
  const baseBlob = record.baseBlobs.get(face);
  if (!baseBlob || signal.aborted || record.disposed || currentRecord !== record) return null;
  const image = await decodeBlob(baseBlob);
  if (signal.aborted || record.disposed || currentRecord !== record || previousRecord) {
    releaseImage(image);
    return null;
  }
  while (record.detailFaces.size >= detailFaceLimit) {
    const candidate = [...record.detailFaces.values()].find((detail) => !wantedFaces.has(detail.face))
      || record.detailFaces.values().next().value;
    disposeDetailFace(record, candidate.face);
    debugState.detailEvictions += 1;
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const scratch = document.createElement('canvas');
  scratch.width = record.detailLevel;
  scratch.height = record.detailLevel;
  scratch.getContext('2d', { alpha: false }).drawImage(image, 0, 0, scratch.width, scratch.height);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scratch);
  releaseImage(image);
  scratch.width = 1;
  scratch.height = 1;
  const detail = {
    face,
    texture,
    loadedTiles: new Set(),
    gpuBytes: record.detailLevel * record.detailLevel * 4
  };
  record.detailFaces.set(face, detail);
  record.gpuBytes += detail.gpuBytes;
  requestRender();
  return detail;
}

async function uploadTile(record, node, detail, key, signal) {
  if (detail.loadedTiles.has(key) || record.disposed || !record.refinementSupported) return;
  const [levelText, face, rowText, columnText] = key.split(':');
  const level = Number(levelText);
  const row = Number(rowText);
  const column = Number(columnText);
  const url = panoramaPath(node, `${level}/${face}/${row}-${column}.webp`);
  const blob = await fetchBlob(url, signal, 'tile');
  const image = await decodeBlob(blob);
  if (signal.aborted || record.disposed || currentRecord !== record
    || record.detailFaces.get(face) !== detail) {
    releaseImage(image);
    return;
  }
  gl.bindTexture(gl.TEXTURE_2D, detail.texture);
  gl.texSubImage2D(
    gl.TEXTURE_2D,
    0,
    column * node.panorama.tileSize,
    row * node.panorama.tileSize,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image
  );
  releaseImage(image);
  detail.loadedTiles.add(key);
  requestRender();
}

async function refineCurrentView(signal) {
  if (!currentNode || !currentRecord || previousRecord || signal.aborted) return;
  const node = currentNode;
  const record = currentRecord;
  if (!record.refinementSupported) return;
  const groups = visibleTileGroups(record.detailLevel, node.panorama.tileSize)
    .slice(0, detailFaceLimit);
  const wantedFaces = new Set(groups.map((group) => group.face));
  const queue = [];
  for (const group of groups) {
    if (signal.aborted || currentRecord !== record || previousRecord) return;
    const detail = await ensureDetailFace(record, node, group.face, wantedFaces, signal);
    if (!detail) return;
    group.keys.forEach((key) => {
      if (!detail.loadedTiles.has(key)) queue.push({ detail, key });
    });
  }
  let cursor = 0;
  const worker = async () => {
    while (cursor < queue.length && !signal.aborted && currentRecord === record && !previousRecord) {
      const item = queue[cursor];
      cursor += 1;
      try {
        await uploadTile(record, node, item.detail, item.key, signal);
      } catch (error) {
        if (error.name !== 'AbortError') console.warn(error);
      }
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}

function scheduleRefinement(delay = 100) {
  window.clearTimeout(refinementTimer);
  refinementController?.abort();
  const controller = new AbortController();
  refinementController = controller;
  refinementTimer = window.setTimeout(() => {
    refinementPromise = refinementPromise
      .catch(() => {})
      .then(() => {
        if (controller.signal.aborted || controller !== refinementController) return;
        return refineCurrentView(controller.signal);
      });
  }, delay);
}

function buildHotspots(node) {
  hotspotsLayer.replaceChildren();
  node.links.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `tour-hotspot tour-hotspot-${entry.kind || 'arrow'}`;
    button.dataset.yaw = entry.yaw;
    button.dataset.pitch = entry.pitch;
    button.innerHTML = `<i aria-hidden="true"></i><span>${entry.label}</span>`;
    button.addEventListener('click', () => navigateTo(entry.target));
    hotspotsLayer.append(button);
  });
  node.hotspots.forEach((entry) => {
    const work = entry.workId ? workLookup.get(entry.workId) : null;
    if (entry.workId && !work) return;
    const control = document.createElement(entry.href ? 'a' : 'button');
    if (control instanceof HTMLButtonElement) control.type = 'button';
    control.className = 'tour-hotspot tour-hotspot-work';
    control.dataset.yaw = entry.yaw;
    control.dataset.pitch = entry.pitch;
    control.innerHTML = `<i aria-hidden="true">+</i><span>${entry.label || work?.title || 'View work'}</span>`;
    if (entry.href) {
      control.href = entry.href;
    } else {
      control.addEventListener('click', () => {
        if (entry.artWall) {
          openArtworkWall(entry.artWall);
          return;
        }
        openDetail(work);
      });
    }
    hotspotsLayer.append(control);
  });
  updateHotspotPositions();
}

function updateNavigationUi() {
  roomLabel.textContent = ROOM_LABELS[currentNode.room] || currentNode.room;
  nodeTitle.textContent = currentNode.label;
  document.title = `${currentNode.label} — Puti Wen`;
  buildHotspots(currentNode);
}

function animateTransition() {
  window.cancelAnimationFrame(transitionFrame);
  if (!previousRecord || reducedMotion.matches) {
    const outgoingRecord = previousRecord;
    blend = 1;
    previousRecord = null;
    if (outgoingRecord && outgoingRecord !== currentRecord) disposeDetailFaces(outgoingRecord);
    requestRender();
    enforceCacheLimit();
    scheduleRefinement(80);
    return;
  }
  const startedAt = performance.now();
  const tick = (now) => {
    blend = Math.min(1, (now - startedAt) / 240);
    render();
    if (blend < 1) {
      transitionFrame = window.requestAnimationFrame(tick);
      return;
    }
    const outgoingRecord = previousRecord;
    previousRecord = null;
    if (outgoingRecord && outgoingRecord !== currentRecord) disposeDetailFaces(outgoingRecord);
    enforceCacheLimit();
    requestRender();
    scheduleRefinement(80);
  };
  transitionFrame = window.requestAnimationFrame(tick);
}

function likelyAdjacentNode(node) {
  const routeIndex = FEATURED_ROUTE.indexOf(node.id);
  if (routeIndex >= 0 && routeIndex < FEATURED_ROUTE.length - 1) {
    return nodeLookup.get(FEATURED_ROUTE[routeIndex + 1]);
  }
  return nodeLookup.get(node.links[0]?.target);
}

function prefetchAdjacentBase(node) {
  const adjacent = likelyAdjacentNode(node);
  if (!adjacent || textureCache.has(adjacent.id) || prefetchedBases.has(adjacent.id)) return;
  prefetchController?.abort();
  const controller = new AbortController();
  prefetchController = controller;
  const run = async () => {
    try {
      const pairs = await Promise.all(FACES.map(async (face) => [
        face,
        await fetchBlob(panoramaPath(adjacent, `base/${face}.webp`), controller.signal, 'base')
      ]));
      if (controller.signal.aborted || controller !== prefetchController || currentNode?.id !== node.id) return;
      prefetchedBases.clear();
      prefetchedBases.set(adjacent.id, new Map(pairs));
    } catch (error) {
      if (error.name !== 'AbortError') console.warn(error);
    }
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1500 });
  else window.setTimeout(run, 500);
}

async function navigateTo(nodeId) {
  const node = nodeLookup.get(nodeId);
  if (!node) return;
  const serial = ++navigationSerial;
  navigationController?.abort();
  navigationController = new AbortController();
  refinementController?.abort();
  window.clearTimeout(refinementTimer);
  prefetchController?.abort();
  prefetchController = null;
  if (!prefetchedBases.has(nodeId)) prefetchedBases.clear();
  window.cancelAnimationFrame(transitionFrame);
  transitionFrame = 0;
  const interruptedPrevious = previousRecord;
  previousRecord = null;
  if (interruptedPrevious && interruptedPrevious !== currentRecord) {
    disposeDetailFaces(interruptedPrevious);
  }
  disposeInactiveDetailFaces(currentRecord);
  blend = 1;
  enforceCacheLimit(Math.max(1, cacheLimit - 1), textureCache.get(nodeId));
  loading.hidden = false;
  loadingMark.hidden = false;
  loadingActions.hidden = true;
  loadingCopy.textContent = `Opening ${node.label}…`;
  try {
    const record = await loadPanorama(node, navigationController.signal);
    if (serial !== navigationSerial || navigationController.signal.aborted) return;
    previousRecord = record === currentRecord ? null : currentRecord;
    currentRecord = record;
    currentNode = node;
    touchCache(record);
    enforceCacheLimit();
    yaw = node.initialYaw * DEG;
    pitch = node.initialPitch * DEG;
    fov = clamp(node.initialFov, 45, 82);
    blend = previousRecord ? 0 : 1;
    debugState.nodeChanges += 1;
    updateNavigationUi();
    failedNodeId = null;
    loading.hidden = true;
    maybeShowDesktopNote();
    animateTransition();
    prefetchAdjacentBase(node);
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error(error);
    failedNodeId = node.id;
    loading.hidden = false;
    loadingMark.hidden = true;
    loadingActions.hidden = false;
    loadingCopy.textContent = 'This viewpoint could not load. Choose another room or try again.';
    loadingRetryButton.focus();
  }
}

function openSheet(dialog) {
  lastFocusedElement = document.activeElement;
  dialog.showModal();
}

function closeSheet(dialog) {
  dialog.close();
  lastFocusedElement?.focus?.();
}

function makeMapRoom(roomId) {
  const room = MAP_ROOMS[roomId];
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `tour-map-room tour-map-${roomId}`;
  button.textContent = room.label;
  button.setAttribute('aria-label', room.ariaLabel);
  button.addEventListener('click', () => {
    closeSheet(mapSheet);
    navigateTo(room.target);
  });
  return button;
}

function buildMap() {
  if (mapBuilt) return;
  mapRoot.replaceChildren();
  const researchRooms = document.createElement('div');
  researchRooms.className = 'tour-map-research';
  researchRooms.append(makeMapRoom('mri'), makeMapRoom('phd'));

  const mediaRooms = document.createElement('div');
  mediaRooms.className = 'tour-map-media';
  mediaRooms.append(makeMapRoom('game'), makeMapRoom('video'));

  mapRoot.append(
    makeMapRoom('art'),
    researchRooms,
    makeMapRoom('app'),
    mediaRooms,
    makeMapRoom('science')
  );
  mapBuilt = true;
}

let detailGestureCleanup = null;
let detailZoomReset = null;
let artworkWallLoadToken = 0;
let artWorksPromise = null;
let artworkWallScrollTop = 0;
let artworkWallActiveWorkId = '';

function clearDetailGesture() {
  detailGestureCleanup?.();
  detailGestureCleanup = null;
  detailZoomReset = null;
}

function resetDetailZoom() {
  detailZoomReset?.();
}

function enableDetailPinch(container, image) {
  clearDetailGesture();
  const detailPointers = new Map();
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let startScale = 1;
  let startDistance = 0;
  let startCenter = { x: 0, y: 0 };
  let startOffset = { x: 0, y: 0 };

  const midpoint = (points) => ({
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2
  });
  const clampOffsets = () => {
    if (scale <= 1) {
      offsetX = 0;
      offsetY = 0;
      return;
    }
    const maxX = Math.max(0, (image.clientWidth * scale - container.clientWidth) / 2);
    const maxY = Math.max(0, (image.clientHeight * scale - container.clientHeight) / 2);
    offsetX = clamp(offsetX, -maxX, maxX);
    offsetY = clamp(offsetY, -maxY, maxY);
  };
  const update = () => {
    clampOffsets();
    image.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
  };
  const beginGesture = () => {
    const points = [...detailPointers.values()];
    startScale = scale;
    startOffset = { x: offsetX, y: offsetY };
    if (points.length >= 2) {
      startDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      startCenter = midpoint(points);
    } else if (points.length === 1) {
      startDistance = 0;
      startCenter = { ...points[0] };
    } else {
      startDistance = 0;
      container.classList.remove('is-gesturing');
    }
  };
  const pointerDown = (event) => {
    if (event.target instanceof Element && event.target.closest('button, a')) return;
    detailPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    container.setPointerCapture(event.pointerId);
    container.classList.add('is-gesturing');
    beginGesture();
  };
  const pointerMove = (event) => {
    if (!detailPointers.has(event.pointerId)) return;
    detailPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...detailPointers.values()];
    if (points.length >= 2 && startDistance > 0) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const center = midpoint(points);
      scale = clamp(startScale * (distance / startDistance), 1, 5);
      const ratio = scale / startScale;
      const bounds = container.getBoundingClientRect();
      const containerCenterX = bounds.left + bounds.width / 2;
      const containerCenterY = bounds.top + bounds.height / 2;
      offsetX = (center.x - startCenter.x)
        + (1 - ratio) * (startCenter.x - containerCenterX)
        + ratio * startOffset.x;
      offsetY = (center.y - startCenter.y)
        + (1 - ratio) * (startCenter.y - containerCenterY)
        + ratio * startOffset.y;
      update();
    } else if (points.length === 1 && scale > 1) {
      offsetX = startOffset.x + points[0].x - startCenter.x;
      offsetY = startOffset.y + points[0].y - startCenter.y;
      update();
    }
  };
  const finish = (event) => {
    detailPointers.delete(event.pointerId);
    if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
    beginGesture();
  };
  const doubleClick = () => {
    scale = scale > 1 ? 1 : 2.5;
    if (scale === 1) {
      offsetX = 0;
      offsetY = 0;
    }
    update();
  };
  const imageLoad = () => update();

  container.addEventListener('pointerdown', pointerDown);
  container.addEventListener('pointermove', pointerMove);
  container.addEventListener('pointerup', finish);
  container.addEventListener('pointercancel', finish);
  container.addEventListener('dblclick', doubleClick);
  image.addEventListener('load', imageLoad, { once: true });
  detailZoomReset = () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    update();
  };
  detailGestureCleanup = () => {
    container.removeEventListener('pointerdown', pointerDown);
    container.removeEventListener('pointermove', pointerMove);
    container.removeEventListener('pointerup', finish);
    container.removeEventListener('pointercancel', finish);
    container.removeEventListener('dblclick', doubleClick);
    image.removeEventListener('load', imageLoad);
    detailPointers.clear();
    container.classList.remove('is-gesturing');
  };
}

function attachVideo(work, mediaRoot) {
  clearDetailGesture();
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = work.mediaSource;
  video.poster = work.previewImage || work.posterImage || '';
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-label', `${work.title} video`);
  video.tabIndex = 0;
  mediaRoot.replaceChildren(video);
  video.focus({ preventScroll: true });
  debugState.videoSourcesAttached += 1;
  video.play().catch(() => {});
}

function renderArtworkWall(wall, works, restoreScroll = false) {
  resetDetailZoom();
  clearDetailGesture();
  const category = detailDialog.querySelector('.detail-category');
  const title = detailDialog.querySelector('#detail-title');
  const description = detailDialog.querySelector('.detail-copy > p');
  const mediaRoot = detailDialog.querySelector('.detail-media');
  const actions = detailDialog.querySelector('.detail-actions');
  category.textContent = 'Selected wall';
  title.textContent = wall.label;
  const collectionCopy = wall.categories.length > 1
    ? ` from ${wall.categories.length} collections`
    : '';
  description.textContent = `${works.length} artworks on this wall${collectionCopy}. Tap an artwork to view it full size.`;
  actions.replaceChildren();
  detailWallBackButton.hidden = true;
  detailWallBackButton.onclick = null;
  mediaRoot.classList.remove('is-video-preview');
  mediaRoot.classList.add('is-wall-gallery');

  const overview = document.createElement('button');
  overview.type = 'button';
  overview.className = 'detail-wall-overview';
  overview.dataset.workId = `wall-${wall.id}`;
  overview.setAttribute('aria-label', `View the complete ${wall.label} wall`);
  const overviewImage = new Image();
  overviewImage.alt = '';
  overviewImage.decoding = 'async';
  overviewImage.src = `./mobile/art-thumbs/wall-${wall.id}.webp?v=20260722-art-walls2`;
  const overviewLabel = document.createElement('span');
  overviewLabel.textContent = 'View complete wall';
  overview.append(overviewImage, overviewLabel);
  overview.addEventListener('click', () => {
    artworkWallScrollTop = detailDialog.scrollTop;
    artworkWallActiveWorkId = overview.dataset.workId;
    renderArtworkFromWall(wall, works, {
      id: overview.dataset.workId,
      title: wall.label,
      category: 'Complete wall',
      note: 'The complete physical wall, including supporting presentation imagery.',
      image: wall.image
    });
  });

  const grid = document.createElement('div');
  grid.className = 'detail-wall-grid';
  works.forEach((work) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'detail-wall-item';
    button.dataset.workId = work.id;
    button.setAttribute('aria-label', `View ${work.title}`);
    const image = new Image();
    image.alt = '';
    image.decoding = 'async';
    image.loading = 'lazy';
    image.src = `./mobile/art-thumbs/${work.id}.webp?v=20260722-art-walls2`;
    const label = document.createElement('span');
    label.textContent = work.title;
    button.append(image, label);
    if (wall.categories.length > 1) {
      const collection = document.createElement('small');
      collection.textContent = work.category;
      button.append(collection);
    }
    button.addEventListener('click', () => {
      artworkWallScrollTop = detailDialog.scrollTop;
      artworkWallActiveWorkId = work.id;
      renderArtworkFromWall(wall, works, work);
    });
    grid.append(button);
  });
  mediaRoot.replaceChildren(overview, grid);
  requestAnimationFrame(() => {
    if (!detailDialog.open) return;
    detailDialog.scrollTop = restoreScroll ? artworkWallScrollTop : 0;
    if (restoreScroll) {
      [overview, ...grid.children]
        .find((button) => button.dataset.workId === artworkWallActiveWorkId)
        ?.focus({ preventScroll: true });
    }
  });
}

function renderArtworkFromWall(wall, works, work) {
  resetDetailZoom();
  clearDetailGesture();
  const category = detailDialog.querySelector('.detail-category');
  const title = detailDialog.querySelector('#detail-title');
  const description = detailDialog.querySelector('.detail-copy > p');
  const mediaRoot = detailDialog.querySelector('.detail-media');
  const actions = detailDialog.querySelector('.detail-actions');
  category.textContent = work.category;
  title.textContent = work.title;
  description.textContent = work.note || '';
  detailWallBackButton.hidden = false;
  detailWallBackButton.onclick = () => renderArtworkWall(wall, works, true);
  mediaRoot.classList.remove('is-wall-gallery', 'is-video-preview');
  actions.replaceChildren();

  const image = new Image();
  image.className = 'detail-zoom-image';
  image.alt = work.title;
  image.decoding = 'async';
  image.src = work.image;
  mediaRoot.replaceChildren(image);
  detailDialog.scrollTop = 0;
  enableDetailPinch(mediaRoot, image);
  detailWallBackButton.focus({ preventScroll: true });
}

async function openArtworkWall(wall) {
  lastFocusedElement = document.activeElement;
  const loadToken = ++artworkWallLoadToken;
  artworkWallScrollTop = 0;
  artworkWallActiveWorkId = '';
  const category = detailDialog.querySelector('.detail-category');
  const title = detailDialog.querySelector('#detail-title');
  const description = detailDialog.querySelector('.detail-copy > p');
  const mediaRoot = detailDialog.querySelector('.detail-media');
  const actions = detailDialog.querySelector('.detail-actions');
  resetDetailZoom();
  clearDetailGesture();
  category.textContent = 'Selected wall';
  title.textContent = wall.label;
  description.textContent = 'Loading the artworks on this wall…';
  actions.replaceChildren();
  detailWallBackButton.hidden = true;
  detailWallBackButton.onclick = null;
  mediaRoot.classList.remove('is-video-preview');
  mediaRoot.classList.add('is-wall-gallery');
  const loadingMessage = document.createElement('p');
  loadingMessage.className = 'detail-wall-loading';
  loadingMessage.textContent = 'Loading artworks…';
  mediaRoot.replaceChildren(loadingMessage);
  detailDialog.showModal();

  try {
    artWorksPromise ||= import('../art/works.js?v=20260722-art-walls2')
      .then((module) => module.artWorks)
      .catch((error) => {
        artWorksPromise = null;
        throw error;
      });
    const allWorks = await artWorksPromise;
    if (loadToken !== artworkWallLoadToken || !detailDialog.open) return;
    const wallWorks = allWorks
      .filter((work) => wall.categories.includes(work.category))
      .sort((left, right) => (
        wall.categories.indexOf(left.category) - wall.categories.indexOf(right.category)
        || left.index - right.index
      ));
    if (!wallWorks.length) throw new Error(`No artworks found for wall ${wall.id}.`);
    renderArtworkWall(wall, wallWorks);
  } catch (error) {
    if (loadToken !== artworkWallLoadToken || !detailDialog.open) return;
    console.error(error);
    description.textContent = 'The artworks on this wall could not be loaded. Please close this view and try again.';
    loadingMessage.textContent = 'Unable to load this wall.';
  }
}

function openDetail(work) {
  artworkWallLoadToken += 1;
  lastFocusedElement = document.activeElement;
  const category = detailDialog.querySelector('.detail-category');
  const title = detailDialog.querySelector('#detail-title');
  const description = detailDialog.querySelector('.detail-copy > p');
  const copyRoot = detailDialog.querySelector('.detail-copy');
  const mediaRoot = detailDialog.querySelector('.detail-media');
  const actions = detailDialog.querySelector('.detail-actions');
  category.textContent = work.category || 'Selected work';
  title.textContent = work.title;
  const wallCopyField = work.kind === 'video' ? VIDEO_WALL_COPY_FIELDS[work.id] : null;
  const detailCopy = work.kind === 'video'
    ? (VIDEO_WALL_COPY_OVERRIDES[work.id] || (wallCopyField ? work[wallCopyField] || '' : ''))
    : (work.description || work.meta || '');
  description.textContent = detailCopy;
  description.hidden = work.kind === 'video' && !detailCopy;
  copyRoot.hidden = false;
  detailWallBackButton.hidden = true;
  detailWallBackButton.onclick = null;
  mediaRoot.classList.remove('is-wall-gallery');
  mediaRoot.classList.toggle('is-video-preview', work.kind === 'video');
  mediaRoot.replaceChildren();
  actions.replaceChildren();
  const imageSource = work.kind === 'video'
    ? (work.previewImage || work.posterImage)
    : (work.detailImage || work.posterImage);
  if (imageSource) {
    const image = new Image();
    image.className = 'detail-zoom-image';
    image.alt = work.title;
    image.decoding = 'async';
    image.src = imageSource;
    mediaRoot.append(image);
    enableDetailPinch(mediaRoot, image);
  }
  if (work.kind === 'video' && work.mediaSource) {
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'detail-video-play';
    play.setAttribute('aria-label', `Play video: ${work.title}`);
    play.addEventListener('click', () => attachVideo(work, mediaRoot), { once: true });
    mediaRoot.append(play);
  }
  if (work.href) {
    const link = document.createElement('a');
    link.href = work.href;
    link.className = work.kind === 'link' ? 'detail-primary' : 'detail-secondary';
    link.textContent = work.kind === 'link' ? 'Open' : 'Visit project';
    if (/^https?:/i.test(work.href)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    actions.append(link);
  }
  if (work.kind === 'video' && !detailCopy && !actions.childElementCount) {
    copyRoot.hidden = true;
  }
  detailDialog.showModal();
}

function closeDetail() {
  artworkWallLoadToken += 1;
  const video = detailDialog.querySelector('video');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  resetDetailZoom();
  clearDetailGesture();
  detailWallBackButton.hidden = true;
  detailWallBackButton.onclick = null;
  detailDialog.close();
  const mediaRoot = detailDialog.querySelector('.detail-media');
  mediaRoot.classList.remove('is-wall-gallery', 'is-video-preview');
  mediaRoot.replaceChildren();
  const copyRoot = detailDialog.querySelector('.detail-copy');
  copyRoot.hidden = false;
  copyRoot.querySelector('p').hidden = false;
  lastFocusedElement?.focus?.();
}

function pointerDistance() {
  const points = [...pointers.values()];
  if (points.length < 2) return 0;
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

let pinchStartDistance = 0;
let pinchStartFov = 0;
canvas.addEventListener('pointerdown', (event) => {
  pointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY
  });
  canvas.setPointerCapture(event.pointerId);
  if (pointers.size === 2) {
    pinchStartDistance = pointerDistance();
    pinchStartFov = fov;
  }
});

canvas.addEventListener('pointermove', (event) => {
  const pointer = pointers.get(event.pointerId);
  if (!pointer) return;
  const previousX = pointer.lastX;
  const previousY = pointer.lastY;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.lastX = event.clientX;
  pointer.lastY = event.clientY;
  if (pointers.size === 1) {
    yaw = normalizeAngle(yaw - (event.clientX - previousX) * 0.0052);
    pitch = clamp(pitch + (event.clientY - previousY) * 0.0046, -80 * DEG, 80 * DEG);
  } else if (pointers.size === 2 && pinchStartDistance > 0) {
    fov = clamp(pinchStartFov * (pinchStartDistance / pointerDistance()), 45, 82);
  }
  requestRender();
  scheduleRefinement(180);
});

function finishPointer(event) {
  pointers.delete(event.pointerId);
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  if (pointers.size < 2) pinchStartDistance = 0;
  const remaining = [...pointers.values()][0];
  if (remaining) {
    remaining.lastX = remaining.x;
    remaining.lastY = remaining.y;
  }
  scheduleRefinement(80);
}
canvas.addEventListener('pointerup', finishPointer);
canvas.addEventListener('pointercancel', finishPointer);

loadingRetryButton.addEventListener('click', () => {
  if (failedNodeId) navigateTo(failedNodeId);
});

function openMap() {
  try {
    buildMap();
  } catch (error) {
    console.error(error);
    mapRoot.textContent = 'The map could not load. Close it and try again.';
  }
  openSheet(mapSheet);
}

loadingMapButton.addEventListener('click', openMap);
mapButton.addEventListener('click', openMap);
root.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = button.closest('dialog');
    if (dialog === detailDialog) closeDetail();
    else closeSheet(dialog);
  });
});
detailDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDetail();
});
mapSheet.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeSheet(mapSheet);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && detailDialog.open) {
    event.preventDefault();
    closeDetail();
    return;
  }
  if (mapSheet.open || detailDialog.open) return;
  if (event.key === 'ArrowLeft') {
    yaw = normalizeAngle(yaw - 8 * DEG);
    requestRender();
    scheduleRefinement();
  }
  if (event.key === 'ArrowRight') {
    yaw = normalizeAngle(yaw + 8 * DEG);
    requestRender();
    scheduleRefinement();
  }
  if (event.key === 'ArrowUp') {
    pitch = clamp(pitch + 6 * DEG, -80 * DEG, 80 * DEG);
    requestRender();
    scheduleRefinement();
  }
  if (event.key === 'ArrowDown') {
    pitch = clamp(pitch - 6 * DEG, -80 * DEG, 80 * DEG);
    requestRender();
    scheduleRefinement();
  }
});

window.addEventListener('resize', () => {
  requestRender();
  scheduleRefinement(160);
}, { passive: true });
window.addEventListener('orientationchange', () => {
  requestRender();
  scheduleRefinement(220);
}, { passive: true });
window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  navigationController?.abort();
  prefetchController?.abort();
  refinementController?.abort();
  window.clearTimeout(refinementTimer);
  textureCache.forEach(disposeRecord);
  gl.deleteTexture(emptyDetailTexture);
});

window.__mobileTourDebug = {
  getStats() {
    return {
      ...debugState,
      currentNode: currentNode?.id || null,
      cacheEntries: [...textureCache.keys()],
      cacheLimit,
      maxCubeMapSize,
      maxTextureSize,
      currentTextureFaceSize: currentRecord?.faceSize || 0,
      currentDetailLevel: currentRecord?.detailLevel || 0,
      detailFaces: currentRecord ? [...currentRecord.detailFaces.keys()] : [],
      refinementSupported: currentRecord?.refinementSupported || false,
      estimatedTextureMiB: Number((
        [...textureCache.values()].reduce((sum, record) => sum + record.gpuBytes, 0)
        / 1024 / 1024
      ).toFixed(1)),
      loadedTiles: currentRecord
        ? [...currentRecord.detailFaces.values()].reduce((sum, detail) => sum + detail.loadedTiles.size, 0)
        : 0,
      activeRequestsAborted: navigationController?.signal.aborted || false
    };
  },
  navigateTo,
  nodeIds: TOUR_NODES.map((node) => node.id)
};

navigateTo(FEATURED_ROUTE[0]);
