import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';
import {
  MAIN_ROOM,
  APP_ROOM,
  SCREENING_ROOM,
  BRAIN_ROOM,
  GAME_ROOM,
  VIDEOS_ROOM,
  EMPTY_GAME_ROOM,
  ART_ROOM,
  BRAIN_HALL_CENTER_Z,
  BRAIN_HALL_WIDTH,
  ROOM_WALL_THICKNESS
} from './wall-map-layout.js?v=20260718-all-door-headers-labels-contrast1-map-path1';

const MODEL_URL = './models/childhood-house-new-grouped.glb';
const ART_LEFT = ART_ROOM.centerX - ART_ROOM.halfWidth;
const ART_RIGHT = ART_ROOM.centerX + ART_ROOM.halfWidth;
const ART_NORTH_WEST_LENGTH = ART_ROOM.halfWidth + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2;
const ART_NORTH_WEST_CENTER_X = ART_LEFT + ART_NORTH_WEST_LENGTH / 2;
const ART_CENTER_Z = (ART_ROOM.nearZ + ART_ROOM.farZ) / 2;
const RAIN_POSTER_URL = './media/house-in-rain-poster.jpg';
const STATIC_IMAGE_URL = './placement-assets/img-0168.jpg';
const RAIN_SCREEN_WIDTH = 2.35;
const RAIN_SCREEN_HEIGHT = RAIN_SCREEN_WIDTH / (16 / 9);
const RAIN_PHOTO_WIDTH = 1.06;
const RAIN_PHOTO_HEIGHT = RAIN_PHOTO_WIDTH / (4 / 3);
const ART_WALL_SHEETS = [
  { image: './art/walls/home.png?v=20260717-1915', aspect: 4631 / 1867, side: 'near-left' },
  { image: './art/walls/others-apartment-updated.png?v=20260718-apartment-pdf-transparent', aspect: 7478 / 1867, side: 'left' },
  { image: './art/walls/art-south-updated.png?v=20260719-art-south-artboard3-transparent6', aspect: 8068 / 1494, side: 'far' },
  { image: './art/walls/sick-black-and-white.png?v=20260717-1915', aspect: 7478 / 1867, side: 'right' },
  { image: './art/walls/final-wall.png?v=20260717-1915', aspect: 4631 / 1867, side: 'near-right' }
];

const SEMANTIC_HOUSE_GROUPS = [
  { key: 'metal', name: 'Metal frames' },
  { key: 'glass', name: 'Glasses' },
  { key: 'wood', name: 'Wood' },
  { key: 'roof', name: 'Roof' },
  { key: 'stone', name: 'White stone' },
  { key: 'baseStone', name: 'Base stone' }
];

const PHOTO_SEMANTIC_PALETTE = {
  metal: '#6f797b',
  glass: '#a9d6dc',
  wood: '#75523d',
  roof: '#536b78',
  stone: '#c7c3bb',
  baseStone: '#b7b1a7'
};

const canvas = document.querySelector('#preview');
const status = document.querySelector('#status');
const walkButton = document.querySelector('#walk');
const componentColorList = document.querySelector('#component-color-list');
const resetHouseColorsButton = document.querySelector('#reset-house-colors');
const copyHouseColorsButton = document.querySelector('#copy-house-colors');
const componentSearch = document.querySelector('#component-search');
const applyPhotoPaletteButton = document.querySelector('#apply-photo-palette');
const selectionSummary = document.querySelector('#selection-summary');
const HOUSE_COLOR_STORAGE_KEY = 'putiw-gallery-house-colors-v4';
const HOUSE_COLOR_PRESET = {
  metal: '#8d949a',
  glass: '#dfded8',
  wood: '#ffcb8f',
  roof: '#666d70',
  stone: '#e8e7de',
  baseStone: '#d2cec6'
};
const HOUSE_BASE_STONE_COMPONENTS = new Set([
  'circle_wall', 'Cylinder', 'kitchen', 'Plane001', 'Plane002', 'Plane003', 'Plane004',
  'Plane005', 'Plane012', 'Plane018', 'Plane019', 'Plane020', 'Plane021', 'Plane022',
  'Plane023', 'Plane024', 'Plane043', 'ROOF_TOP_FLOOR', 'Cube', 'Cube003', 'Cube004',
  'Cube005', 'Cube008', 'Cube010', 'Cube011', 'Cube012', 'Cube015', 'Plane081',
  'Plane083', 'Plane084', 'Plane085', 'cut_long_wall_top_window', 'front_wall_right_side',
  'leftwall', 'middlefrontwall', 'middlefrontwall001', 'middlefrontwall004', 'midwall1',
  'midwall1002', 'midwall1027', 'midwall1028', 'right_middle_wall', 'roomfloor',
  'midwall1015', 'midwall1016', 'midwall1017', 'midwall1018', 'midwall1019',
  'midwall1020', 'midwall1021', 'midwall1022', 'midwall1023', 'midwall1024',
  'midwall1025', 'midwall1026', 'Plane', 'Plane014', 'Plane015', 'Plane039', 'Plane074', 'Plane126'
].map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd7d4cd);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 180);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.shadowMap.enabled = false;
renderer.setClearColor(0xe5e4e0, 1);
scene.fog = new THREE.Fog(0xe5e4e0, 22, 78);
const controls = new PointerLockControls(camera, canvas);
controls.pointerSpeed = 0.82;
controls.minPolarAngle = Math.PI * 0.22;
controls.maxPolarAngle = Math.PI * 0.78;
const pressedKeys = new Set();
const WALK_EYE_HEIGHT = MAIN_ROOM.height / 2;
const WALK_SPEED = 4.2;

scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b5ad, 2.25));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(1.5, 5, 3);
scene.add(keyLight);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeae2, roughness: 0.98, metalness: 0 });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaa397, roughness: 1, metalness: 0 });
const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x737978, roughness: 0.9 });

function addBox(width, height, depth, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

function createArtRoomShell() {
  const width = ART_ROOM.halfWidth * 2;
  const depth = ART_ROOM.farZ - ART_ROOM.nearZ;
  const wallY = ART_ROOM.height / 2;
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf2eee7, roughness: 1, metalness: 0 });
  const doorLeft = ART_ROOM.centerX + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2;
  const doorRight = ART_ROOM.centerX + ART_ROOM.doorOffsetX + ART_ROOM.doorWidth / 2;
  const wallThickness = 0.18;

  addBox(width, 0.1, depth, ART_ROOM.centerX, -0.05, ART_CENTER_Z, floorMaterial);
  addBox(width, 0.1, depth, ART_ROOM.centerX, ART_ROOM.height + 0.05, ART_CENTER_Z, ceilingMaterial);
  addBox(wallThickness, ART_ROOM.height, depth, ART_LEFT - wallThickness / 2, wallY, ART_CENTER_Z, wallMaterial);
  addBox(wallThickness, ART_ROOM.height, depth, ART_RIGHT + wallThickness / 2, wallY, ART_CENTER_Z, wallMaterial);
  addBox(width, ART_ROOM.height, wallThickness, ART_ROOM.centerX, wallY, ART_ROOM.farZ + wallThickness / 2, wallMaterial);

  addBox(doorLeft - ART_LEFT, ART_ROOM.height, wallThickness, (ART_LEFT + doorLeft) / 2, wallY, ART_ROOM.nearZ - wallThickness / 2, wallMaterial);
  addBox(ART_RIGHT - doorRight, ART_ROOM.height, wallThickness, (doorRight + ART_RIGHT) / 2, wallY, ART_ROOM.nearZ - wallThickness / 2, wallMaterial);
  addBox(ART_ROOM.doorWidth, ART_ROOM.height - ART_ROOM.doorHeight, wallThickness, (doorLeft + doorRight) / 2, ART_ROOM.doorHeight + (ART_ROOM.height - ART_ROOM.doorHeight) / 2, ART_ROOM.nearZ - wallThickness / 2, wallMaterial);

  const grid = new THREE.GridHelper(Math.max(width, depth), 40, 0x858984, 0xa8a59e);
  grid.position.set(ART_ROOM.centerX, 0.006, ART_CENTER_Z);
  grid.scale.set(width / Math.max(width, depth), 1, depth / Math.max(width, depth));
  grid.material.opacity = 0.18;
  grid.material.transparent = true;
  scene.add(grid);

  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xfff9ec });
  for (let z = ART_ROOM.nearZ + 2; z < ART_ROOM.farZ - 0.8; z += 4) {
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(22, 0.025, 0.08), lightMaterial);
    lightStrip.position.set(ART_ROOM.centerX, ART_ROOM.height - 0.08, z);
    scene.add(lightStrip);
  }

  const northWestMarker = addBox(ART_NORTH_WEST_LENGTH, 0.05, 0.055, ART_NORTH_WEST_CENTER_X, 0.03, ART_ROOM.nearZ + 0.04, trimMaterial);
  northWestMarker.name = 'ART-NORTH-WEST length marker';
}

function addArtWallSheet(sheet, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = ART_ROOM.height;
  const width = height * sheet.aspect;
  const wallSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.015,
      depthWrite: false,
      toneMapped: false
    })
  );
  wallSheet.position.y = height / 2;

  const group = new THREE.Group();
  const roomLeft = ART_LEFT;
  const roomRight = ART_RIGHT;
  if (sheet.side === 'left') {
    group.position.set(roomLeft + 0.075, 0, ART_CENTER_Z);
    group.rotation.y = Math.PI / 2;
  } else if (sheet.side === 'right') {
    group.position.set(roomRight - 0.075, 0, ART_CENTER_Z);
    group.rotation.y = -Math.PI / 2;
  } else if (sheet.side === 'far') {
    group.position.set(ART_ROOM.centerX, 0, ART_ROOM.farZ - 0.075);
    group.rotation.y = Math.PI;
  } else if (sheet.side === 'near-right') {
    const doorRight = ART_ROOM.centerX + ART_ROOM.doorOffsetX + ART_ROOM.doorWidth / 2;
    group.position.set((doorRight + roomRight) / 2, 0, ART_ROOM.nearZ + 0.075);
  } else {
    const doorLeft = ART_ROOM.centerX + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2;
    group.position.set((roomLeft + doorLeft) / 2, 0, ART_ROOM.nearZ + 0.075);
  }
  group.add(wallSheet);
  scene.add(group);
}

function loadArtWallContent() {
  const textureLoader = new THREE.TextureLoader();
  ART_WALL_SHEETS.forEach((sheet) => {
    textureLoader.load(sheet.image, (texture) => addArtWallSheet(sheet, texture));
  });
}

const state = {
  x: -15.67,
  y: -0.14,
  z: 41.63,
  scale: 0.56,
  rotationY: 29
};
const rainState = {
  x: -11.79,
  y: -1,
  z: 42.55,
  scale: 1,
  tiltX: -63,
  tiltY: 0,
  tiltZ: 0,
  rotationY: 89
};
const imageState = {
  x: -10.79,
  y: 0.25,
  z: 42.56,
  scale: 0.24,
  rotationX: -89,
  rotationY: 28,
  rotationZ: 90
};
const miniatureState = {
  x: ART_ROOM.centerX - (-5.5 * 0.06),
  y: 0.02,
  z: 58,
  scale: 0.06,
  rotationY: 0
};
let initialState = null;
let initialRainState = null;
let initialImageState = null;
let initialMiniatureState = null;
let housePivot = null;
let rainPivot = null;
let miniaturePivot = null;
let staticImageTexture = null;
let houseColorEntries = [];
let houseColorGroups = [];
let selectedHouseTarget = null;
let selectedHouseEntry = null;
let selectedHouseGroup = null;
let selectionHelper = null;
const houseRaycaster = new THREE.Raycaster();
const housePointer = new THREE.Vector2();
let baseModelScale = 1;
let baseModelDepth = 0;

function houseHierarchyLabel(child) {
  const names = [];
  let current = child;
  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }
  return names.join(' ').toLowerCase();
}

function prepareHouseGlassMaterial(material, child) {
  const label = `${material.name || ''} ${houseHierarchyLabel(child)}`.toLowerCase();
  const isOpaqueWall = /cut[ _]long[ _]wall[ _]top[ _]window/.test(label);
  if (isOpaqueWall) {
    material.transparent = false;
    material.opacity = 1;
    material.depthWrite = true;
    material.side = THREE.FrontSide;
    return;
  }
  const isDarkVerticalWindow = material.name === 'Material.011'
    || /middlefrontwall\.001/.test(label);
  if (!/(window|missingglass)/.test(label) && !isDarkVerticalWindow) return;
  material.color.set(HOUSE_COLOR_PRESET.glass);
  material.transparent = true;
  material.opacity = 0.34;
  material.depthWrite = false;
  material.side = THREE.DoubleSide;
  material.roughness = 0.08;
  material.metalness = 0;
  if ('transmission' in material) material.transmission = 0.55;
  if ('thickness' in material) material.thickness = 0.04;
  if ('ior' in material) material.ior = 1.45;
}

function prepareHouseModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) return;
    if (/^plane[._]?016$/i.test(child.name || '')) {
      child.visible = false;
      return;
    }
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const clonedMaterials = materials.map((material) => material?.clone ? material.clone() : material);
    child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
    child.castShadow = false;
    child.receiveShadow = false;
    clonedMaterials.filter(Boolean).forEach((material) => {
      material.roughness = material.roughness ?? 0.88;
      material.metalness = 0;
      prepareHouseGlassMaterial(material, child);
      material.needsUpdate = true;
    });
  });

  model.updateMatrixWorld(true);
  const originalBox = new THREE.Box3().setFromObject(model);
  const originalSize = originalBox.getSize(new THREE.Vector3());
  baseModelScale = ART_NORTH_WEST_LENGTH / originalSize.x;
  model.scale.setScalar(baseModelScale);
  model.updateMatrixWorld(true);

  const scaledBox = new THREE.Box3().setFromObject(model);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  baseModelDepth = scaledBox.max.z - scaledBox.min.z;
  model.position.x -= scaledCenter.x;
  model.position.z -= scaledCenter.z;
  model.position.y -= scaledBox.min.y;
}

function addHouseLightRig(model, parent) {
  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const warm = 0xffe7c4;
  const lampColor = 0xffd29b;
  const lights = [
    { name: 'house light', color: warm, intensity: 3.8, distance: Math.max(size.x, size.z) * 1.25, position: [center.x - size.x * 0.18, bounds.max.y * 0.78, center.z - size.z * 0.18] },
    { name: 'hallway light', color: warm, intensity: 3, distance: Math.max(size.x, size.z) * 0.95, position: [center.x + size.x * 0.26, bounds.max.y * 0.7, center.z + size.z * 0.22] },
    { name: 'stair lamp west', color: lampColor, intensity: 0.85, distance: size.x * 0.24, position: [center.x + size.x * 0.34, 2.05, center.z + size.z * 0.43] },
    { name: 'stair lamp east', color: lampColor, intensity: 0.85, distance: size.x * 0.24, position: [center.x + size.x * 0.49, 2.05, center.z + size.z * 0.43] }
  ];
  lights.forEach(({ name, color, intensity, distance, position }) => {
    const light = new THREE.PointLight(color, intensity, distance, 2);
    light.name = name;
    light.position.set(...position);
    parent.add(light);
  });
}

function getHouseGroupNode(mesh, model) {
  let current = mesh;
  while (current.parent && current.parent !== model) current = current.parent;
  return current.parent === model && !current.isMesh ? current : null;
}

function colorHex(color) {
  return `#${color.getHexString()}`;
}

function setHouseEntryColor(entry, hex) {
  entry.material.color.set(hex);
  entry.input.value = hex;
  entry.value.textContent = hex;
  entry.material.needsUpdate = true;
}

function refreshHouseGroupColor(group) {
  if (group.entries.length) group.input.value = colorHex(group.entries[0].material.color);
}

function applyHouseGroupColor(group, hex) {
  group.entries.forEach((entry) => setHouseEntryColor(entry, hex));
  refreshHouseGroupColor(group);
}

function getHouseColorSnapshot() {
  return {
    version: 1,
    groups: houseColorGroups.map((group) => ({
      key: group.key,
      name: group.name,
      color: group.entries.length ? colorHex(group.entries[0].material.color) : null
    })),
    components: houseColorEntries.map((entry) => ({
      group: entry.group.key,
      name: entry.label,
      material: entry.materialName,
      color: colorHex(entry.material.color)
    }))
  };
}

function saveHouseColors() {
  try {
    localStorage.setItem(HOUSE_COLOR_STORAGE_KEY, JSON.stringify(getHouseColorSnapshot()));
  } catch {
    // Clipboard export remains available if browser storage is unavailable.
  }
}

async function restoreHouseColors() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(HOUSE_COLOR_STORAGE_KEY) || 'null');
  } catch {
    saved = null;
  }
  const isAutomaticPhotoPalette = saved?.components?.length
    && saved.components.every((entry) => PHOTO_SEMANTIC_PALETTE[entry.group] === entry.color);
  if (isAutomaticPhotoPalette) saved = null;
  if (!saved?.components?.length) {
    saved = {
      components: houseColorEntries.map((entry) => ({
        group: entry.group.key,
        name: entry.label,
        material: entry.materialName,
        color: HOUSE_COLOR_PRESET[entry.group.key]
      }))
    };
  }
  const savedByComponent = new Map(saved.components.map((entry) => [
    `${entry.group || ''}|${entry.name}|${entry.material || ''}`,
    entry.color
  ]));
  const savedByName = new Map(saved.components.map((entry) => [entry.name, entry.color]));
  let restored = 0;
  houseColorEntries.forEach((entry) => {
    const color = savedByComponent.get(`${entry.group.key}|${entry.label}|${entry.materialName}`)
      || savedByName.get(entry.label);
    if (!color) return;
    setHouseEntryColor(entry, color);
    restored += 1;
  });
  houseColorGroups.forEach(refreshHouseGroupColor);
  if (restored) {
    saveHouseColors();
    selectionSummary.textContent = `Restored ${restored} saved house color edits.`;
  }
  return restored;
}

async function copyHouseColors() {
  const text = JSON.stringify(getHouseColorSnapshot(), null, 2);
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'House color settings copied to clipboard.';
    selectionSummary.textContent = 'Color settings copied. Paste the JSON into a message or file.';
  } catch {
    status.textContent = text;
  }
}

function updateHouseGroupButton(group) {
  group.button.textContent = `${group.open ? '▾' : '▸'} ${group.name}`;
  group.items.hidden = !group.open;
}

function selectHouseTarget(target, entry = null, group = null) {
  selectedHouseTarget = target;
  selectedHouseEntry = entry;
  selectedHouseGroup = group || entry?.group || null;
  houseColorEntries.forEach((item) => item.row.classList.toggle('selected', item === entry));
  houseColorGroups.forEach((item) => item.header.classList.toggle('selected', item === selectedHouseGroup && !entry));
  if (entry) {
    selectionSummary.textContent = `Selected component: ${entry.label} · group ${entry.group.name}`;
    entry.row.scrollIntoView({ block: 'nearest' });
  } else if (group) {
    selectionSummary.textContent = `Selected semantic group: ${group.name} · ${group.entries.length} components`;
  } else {
    selectionSummary.textContent = 'Click the model or a list item to select it.';
  }
  if (!selectionHelper) {
    selectionHelper = new THREE.BoxHelper(target, 0xffd166);
    scene.add(selectionHelper);
  } else {
    selectionHelper.setFromObject(target);
  }
}

function getSemanticHouseGroupKey(child, material) {
  const hierarchy = houseHierarchyLabel(child);
  const label = `${material.name || ''} ${hierarchy}`.toLowerCase();
  if (/^plane[._]?016$/i.test(child.name || '')) return null;
  if (HOUSE_BASE_STONE_COMPONENTS.has((child.name || '').toLowerCase().replace(/[^a-z0-9]/g, ''))) return 'baseStone';
  if (/^plane[._]?119$/i.test(child.name || '')) return 'wood';
  if (/(cut[ _]long[ _]wall[ _]top[ _]window|middlefrontwall[._]?001)/.test(hierarchy)) return 'baseStone';
  const isGlassHolder = /glass holder/.test(label);
  const isActualGlass = !isGlassHolder && (/(window|missingglass)/.test(label)
    || material.name === 'gs'
    || /cylinder[._]?002/.test(hierarchy));
  if (isActualGlass) return 'glass';

  // The Blender collection named "wood" also contains the room floor and pool;
  // those are surfaces, not part of the requested wood controls. Keep the
  // explicitly named wood platform that sits on the pool.
  const componentLabel = `${material.name || ''} ${child.name || ''}`.toLowerCase();
  if (/(^|[\s_.])(water|pool)([\s_.]|$)/.test(label)
    && !/wood top of water/.test(label)) return null;

  const isHardware = /(glassss|holding[ _]the[ _]glass|glass[ _]holder|frame|handle|knob|details|stairs[ _]i[ _]want|torus|sphere|right[ _]middle[ _]wall[ _]2)/.test(label);
  if (isHardware) return 'metal';

  // Match the source Blender collections: only "top of wall" is the actual
  // roof; the separate "WHITE ROOF LINE" collection is white stone trim.
  if (/(^|[ _])top[ _]of[ _]wall([ _]|$)/.test(hierarchy)) return 'roof';
  if (/(^|[ _])white[ _]roof[ _]line([ _]|$)/.test(hierarchy)) return 'stone';

  if (/roomfloor/.test(componentLabel)) return 'baseStone';
  if (/(wood top of water|woodboard|wood|door|platform)/.test(label)) return 'wood';
  return 'baseStone';
}

function updateHouseSelectionHelper() {
  if (selectionHelper && selectedHouseTarget) selectionHelper.setFromObject(selectedHouseTarget);
}

function addHouseColorControls(model) {
  houseColorEntries = [];
  houseColorGroups = [];
  componentColorList.replaceChildren();
  let componentNumber = 0;
  const groupMap = new Map(SEMANTIC_HOUSE_GROUPS.map(({ key, name }) => [
    key,
    { key, name, node: model, entries: [], open: false }
  ]));

  model.traverse((child) => {
    if (!child.isMesh) return;
    componentNumber += 1;
    const materials = Array.isArray(child.material) ? child.material : [child.material];

    materials.forEach((material, slotIndex) => {
      if (!material?.color) return;
      const groupKey = getSemanticHouseGroupKey(child, material);
      if (!groupKey) return;
      const group = groupMap.get(groupKey);
      const initialColor = material.color.clone();
      const row = document.createElement('div');
      row.className = 'component-color-row';
      row.tabIndex = 0;
      row.setAttribute('role', 'button');

      const name = document.createElement('div');
      name.className = 'component-color-name';
      const meshName = child.name || `Component ${componentNumber}`;
      const materialName = material.name || `Material ${slotIndex + 1}`;
      const label = materials.length > 1 ? `${meshName} · ${materialName}` : meshName;
      name.textContent = label;
      name.title = label;

      const input = document.createElement('input');
      input.type = 'color';
      input.value = colorHex(material.color);
      input.setAttribute('aria-label', `Color for ${label}`);
      const value = document.createElement('output');
      value.className = 'component-color-value';
      value.textContent = input.value;

      const entry = { mesh: child, group, material, initialColor, input, value, row, label, materialName };
      group.entries.push(entry);
      input.addEventListener('input', () => {
        setHouseEntryColor(entry, input.value);
        refreshHouseGroupColor(group);
        saveHouseColors();
      });
      input.addEventListener('click', (event) => event.stopPropagation());
      row.addEventListener('click', () => selectHouseTarget(child, entry, group));
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectHouseTarget(child, entry, group);
        }
      });
      row.append(name, input, value);
      houseColorEntries.push(entry);
    });
  });

  houseColorGroups = SEMANTIC_HOUSE_GROUPS.map(({ key }) => groupMap.get(key));

  if (!houseColorGroups.length) {
    const empty = document.createElement('div');
    empty.className = 'component-color-empty';
    empty.textContent = 'No color-editable components found.';
    componentColorList.append(empty);
  } else {
    houseColorGroups.forEach((group, index) => {
      const section = document.createElement('section');
      section.className = 'component-color-group';
      const header = document.createElement('div');
      header.className = 'component-color-group-header';
      const button = document.createElement('button');
      button.type = 'button';
      button.addEventListener('click', () => {
        group.open = !group.open;
        updateHouseGroupButton(group);
        selectHouseTarget(group.node, null, group);
      });
      const input = document.createElement('input');
      input.type = 'color';
      input.value = group.entries.length ? colorHex(group.entries[0].material.color) : '#777777';
      input.disabled = group.entries.length === 0;
      input.setAttribute('aria-label', `Color for ${group.name}`);
      input.addEventListener('input', () => {
        applyHouseGroupColor(group, input.value);
        saveHouseColors();
      });
      input.addEventListener('click', (event) => event.stopPropagation());
      const count = document.createElement('span');
      count.className = 'component-color-group-count';
      count.textContent = `${group.entries.length}`;
      const items = document.createElement('div');
      items.className = 'component-color-group-items';
      group.button = button;
      group.input = input;
      group.header = header;
      group.items = items;
      group.entries.forEach((entry) => items.append(entry.row));
      header.append(button, input, count);
      section.append(header, items);
      componentColorList.append(section);
      group.open = index === 0;
      updateHouseGroupButton(group);
    });
  }
  resetHouseColorsButton.disabled = houseColorEntries.length === 0;
  copyHouseColorsButton.disabled = houseColorEntries.length === 0;
}

function resetHouseColors() {
  houseColorEntries.forEach((entry) => setHouseEntryColor(entry, colorHex(entry.initialColor)));
  houseColorGroups.forEach(refreshHouseGroupColor);
  saveHouseColors();
  selectionSummary.textContent = 'Source Blender colors restored.';
}

function applyPhotoPalette(remember = true) {
  houseColorEntries.forEach((entry) => {
    const paletteColor = PHOTO_SEMANTIC_PALETTE[entry.group.key];
    setHouseEntryColor(entry, paletteColor);
  });
  houseColorGroups.forEach(refreshHouseGroupColor);
  if (remember) saveHouseColors();
  selectionSummary.textContent = 'Muted photo-based palette applied. Refine any group or component below.';
}

function filterHouseComponents() {
  const query = componentSearch.value.trim().toLowerCase();
  houseColorGroups.forEach((group) => {
    let visible = 0;
    group.entries.forEach((entry) => {
      const matches = !query || entry.label.toLowerCase().includes(query) || group.name.toLowerCase().includes(query);
      entry.row.hidden = !matches;
      if (matches) visible += 1;
    });
    group.header.parentElement.hidden = visible === 0;
    if (query && visible) {
      group.open = true;
      updateHouseGroupButton(group);
    }
  });
}

function applyPlacement() {
  if (!housePivot) return;
  housePivot.position.set(state.x, state.y, state.z);
  housePivot.scale.setScalar(state.scale);
  housePivot.rotation.y = THREE.MathUtils.degToRad(state.rotationY);
  updateControls();
}

function createRainVideoScreen(posterTexture) {
  posterTexture.colorSpace = THREE.SRGBColorSpace;
  posterTexture.minFilter = THREE.LinearMipmapLinearFilter;
  posterTexture.magFilter = THREE.LinearFilter;
  posterTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const group = new THREE.Group();
  const screenWidth = RAIN_SCREEN_WIDTH;
  const screenHeight = RAIN_SCREEN_HEIGHT;
  const frameWidth = screenWidth + 0.2;
  const frameHeight = screenHeight + 0.2;
  const holderMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: 0.78 });
  const screenMaterial = new THREE.MeshBasicMaterial({ map: posterTexture, toneMapped: false });

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.08, 0.84), holderMaterial);
  base.position.set(0, 0.04, -0.03);
  group.add(base);

  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.02, 0.55), holderMaterial);
  pedestal.position.set(0, 0.59, -0.05);
  group.add(pedestal);

  const screenAssembly = new THREE.Group();
  screenAssembly.position.set(0, 1.62, -0.03);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(frameWidth, frameHeight, 0.14), holderMaterial);
  frame.position.z = -0.055;
  screenAssembly.add(frame);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenWidth, screenHeight), screenMaterial);
  screen.position.z = 0.022;
  screenAssembly.add(screen);

  const angledNeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.64, 0.42),
    holderMaterial
  );
  angledNeck.position.set(0, -frameHeight / 2 - 0.28, -0.08);
  screenAssembly.add(angledNeck);

  // Use the existing front face of the stand's lower white surface. Do not
  // create another white backing panel for the photo.
  const photoMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    toneMapped: false
  });
  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.78 / (4 / 3)),
    photoMaterial
  );
  photo.position.set(0, angledNeck.position.y, 0.136);
  screenAssembly.add(photo);

  group.add(screenAssembly);
  scene.add(group);
  const pivot = { group, screenAssembly, screenMaterial, photoMaterial };
  if (staticImageTexture) applyStaticImageToPhoto(pivot);
  return pivot;
}

function applyStaticImageToPhoto(pivot = rainPivot) {
  if (!pivot?.photoMaterial || !staticImageTexture) return;
  pivot.photoMaterial.map = staticImageTexture;
  pivot.photoMaterial.needsUpdate = true;
}

function applyRainPlacement() {
  if (!rainPivot) return;
  rainPivot.group.position.set(rainState.x, rainState.y, rainState.z);
  rainPivot.group.scale.setScalar(rainState.scale);
  rainPivot.group.rotation.y = THREE.MathUtils.degToRad(rainState.rotationY);
  rainPivot.screenAssembly.rotation.set(
    THREE.MathUtils.degToRad(rainState.tiltX),
    THREE.MathUtils.degToRad(rainState.tiltY),
    THREE.MathUtils.degToRad(rainState.tiltZ)
  );
  updateControls();
}

function createStaticImage(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  staticImageTexture = texture;
  applyStaticImageToPhoto();
}

function applyImagePlacement() {
  applyStaticImageToPhoto();
  updateControls();
}

function addMiniatureRoomShell(world, room, floorColor) {
  const wallColor = room === SCREENING_ROOM || room === BRAIN_ROOM || room === GAME_ROOM || room === VIDEOS_ROOM
    ? 0x111416
    : 0xdeddd8;
  const wallMaterial = new THREE.MeshBasicMaterial({ color: wallColor });
  const floorMaterial = new THREE.MeshBasicMaterial({ color: floorColor });
  const wallHeight = MAIN_ROOM.height;
  const wallThickness = ROOM_WALL_THICKNESS;
  const nearZ = room === MAIN_ROOM ? -MAIN_ROOM.halfDepth : room.nearZ;
  const farZ = room === MAIN_ROOM ? MAIN_ROOM.halfDepth : room.farZ;
  const centerX = room === MAIN_ROOM ? 0 : room.centerX;
  const roomDepth = farZ - nearZ;
  const roomCenterZ = (nearZ + farZ) / 2;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(room.halfWidth * 2, 0.1, roomDepth), floorMaterial);
  floor.position.set(centerX, -0.05, roomCenterZ);
  world.add(floor);

  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(room.halfWidth * 2, wallHeight, wallThickness),
    wallMaterial
  );
  northWall.position.set(centerX, wallHeight / 2, nearZ - wallThickness / 2);
  world.add(northWall);

  const southWall = northWall.clone();
  southWall.position.z = farZ + wallThickness / 2;
  world.add(southWall);

  const sideGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth);
  const westWall = new THREE.Mesh(sideGeometry, wallMaterial);
  westWall.position.set(centerX - room.halfWidth - wallThickness / 2, wallHeight / 2, roomCenterZ);
  world.add(westWall);

  const eastWall = westWall.clone();
  eastWall.position.x = centerX + room.halfWidth + wallThickness / 2;
  world.add(eastWall);
}

function addMiniatureCorridor(world, centerX, centerZ, width, depth, floorColor, wallColor = 0xdeddd8) {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.08, depth),
    new THREE.MeshBasicMaterial({ color: floorColor })
  );
  floor.position.set(centerX, -0.04, centerZ);
  world.add(floor);

  const wallMaterial = new THREE.MeshBasicMaterial({ color: wallColor });
  const wallGeometry = new THREE.BoxGeometry(ROOM_WALL_THICKNESS, MAIN_ROOM.height, depth);
  const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
  leftWall.position.set(centerX - width / 2 - ROOM_WALL_THICKNESS / 2, MAIN_ROOM.height / 2, centerZ);
  world.add(leftWall);
  const rightWall = leftWall.clone();
  rightWall.position.x = centerX + width / 2 + ROOM_WALL_THICKNESS / 2;
  world.add(rightWall);
}

function createMiniatureGalleryShell() {
  const world = new THREE.Group();
  addMiniatureRoomShell(world, MAIN_ROOM, 0xd3d2cd);
  addMiniatureRoomShell(world, APP_ROOM, 0xbfc1bf);
  addMiniatureRoomShell(world, SCREENING_ROOM, 0x0b0c0d);
  addMiniatureRoomShell(world, BRAIN_ROOM, 0x000000);
  addMiniatureRoomShell(world, GAME_ROOM, 0x020202);
  addMiniatureRoomShell(world, VIDEOS_ROOM, 0x020202);
  addMiniatureRoomShell(world, EMPTY_GAME_ROOM, 0x020202);
  addMiniatureRoomShell(world, ART_ROOM, 0xaaa397);

  addMiniatureCorridor(
    world,
    APP_ROOM.centerX,
    (MAIN_ROOM.halfDepth + APP_ROOM.nearZ) / 2,
    APP_ROOM.doorWidth,
    APP_ROOM.nearZ - MAIN_ROOM.halfDepth,
    0xbfc1bf
  );
  addMiniatureCorridor(
    world,
    SCREENING_ROOM.centerX,
    (MAIN_ROOM.halfDepth + SCREENING_ROOM.nearZ) / 2,
    SCREENING_ROOM.doorWidth,
    SCREENING_ROOM.nearZ - MAIN_ROOM.halfDepth,
    0xd3d2cd
  );
  addMiniatureCorridor(
    world,
    BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth / 2,
    BRAIN_HALL_CENTER_Z,
    BRAIN_HALL_WIDTH,
    BRAIN_ROOM.centerX - (SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth),
    0x020202,
    0x111416
  );
  addMiniatureCorridor(
    world,
    ART_ROOM.centerX + ART_ROOM.doorOffsetX,
    (APP_ROOM.farZ + ART_ROOM.nearZ) / 2,
    ART_ROOM.doorWidth,
    ART_ROOM.nearZ - APP_ROOM.farZ,
    0xaaa397
  );
  return world;
}

function createMiniatureModel() {
  miniaturePivot = createMiniatureGalleryShell();
  miniaturePivot.name = 'Full gallery miniature shell without wall artwork';
  scene.add(miniaturePivot);
  applyMiniaturePlacement();
}

function applyMiniaturePlacement() {
  if (!miniaturePivot) return;
  miniaturePivot.position.set(miniatureState.x, miniatureState.y, miniatureState.z);
  miniaturePivot.scale.setScalar(miniatureState.scale);
  miniaturePivot.rotation.y = THREE.MathUtils.degToRad(miniatureState.rotationY);
  updateControls();
}

function setCameraView(view) {
  const target = new THREE.Vector3(ART_ROOM.centerX, 3.2, ART_CENTER_Z);
  const positions = {
    south: [ART_ROOM.centerX, 5.8, ART_ROOM.nearZ - 13],
    north: [ART_ROOM.centerX, 5.8, ART_ROOM.farZ + 13],
    west: [ART_LEFT - 13, 5.8, ART_CENTER_Z],
    east: [ART_RIGHT + 13, 5.8, ART_CENTER_Z]
  };
  camera.position.set(...positions[view]);
  camera.lookAt(target);
}

function startWalking() {
  camera.position.set(ART_ROOM.centerX, WALK_EYE_HEIGHT, ART_ROOM.nearZ + 5.5);
  camera.lookAt(new THREE.Vector3(state.x, 1.6, state.z));
  controls.lock();
}

function updateWalking(delta) {
  if (!controls.isLocked) return;
  const forward = Number(pressedKeys.has('KeyW')) - Number(pressedKeys.has('KeyS'));
  const sideways = Number(pressedKeys.has('KeyD')) - Number(pressedKeys.has('KeyA'));
  if (!forward && !sideways) return;

  const previousX = camera.position.x;
  const previousZ = camera.position.z;
  const distance = WALK_SPEED * delta;
  if (forward) controls.moveForward(forward * distance);
  if (sideways) controls.moveRight(sideways * distance);

  const roomMargin = 0.35;
  const hallwayMargin = 0.6;
  const insideRoom = camera.position.x >= ART_LEFT + roomMargin
    && camera.position.x <= ART_RIGHT - roomMargin
    && camera.position.z >= ART_ROOM.nearZ + roomMargin
    && camera.position.z <= ART_ROOM.farZ - roomMargin;
  const inEntryHall = camera.position.x >= ART_ROOM.centerX + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2 + hallwayMargin
    && camera.position.x <= ART_ROOM.centerX + ART_ROOM.doorOffsetX + ART_ROOM.doorWidth / 2 - hallwayMargin
    && camera.position.z >= ART_ROOM.nearZ - 8
    && camera.position.z <= ART_ROOM.nearZ + roomMargin;
  if (!insideRoom && !inEntryHall) camera.position.set(previousX, camera.position.y, previousZ);
}

canvas.addEventListener('pointerdown', (event) => {
  if (controls.isLocked || !housePivot) return;
  const rect = canvas.getBoundingClientRect();
  housePointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  housePointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  houseRaycaster.setFromCamera(housePointer, camera);
  const hit = houseRaycaster.intersectObject(housePivot, true).find(({ object }) => object.isMesh);
  if (!hit) return;
  const entry = houseColorEntries.find((item) => item.mesh === hit.object);
  if (entry) selectHouseTarget(hit.object, entry, entry.group);
});

const controlMap = {
  house: {
    state,
    inputs: {
      x: document.querySelector('#position-x'),
      y: document.querySelector('#position-y'),
      z: document.querySelector('#position-z'),
      scale: document.querySelector('#scale'),
      rotationY: document.querySelector('#rotation-y')
    },
    outputs: {
      x: document.querySelector('#position-x-value'),
      y: document.querySelector('#position-y-value'),
      z: document.querySelector('#position-z-value'),
      scale: document.querySelector('#scale-value'),
      rotationY: document.querySelector('#rotation-y-value')
    },
    angles: ['rotationY']
  },
  screen: {
    state: rainState,
    inputs: {
      x: document.querySelector('#rain-x'),
      y: document.querySelector('#rain-y'),
      z: document.querySelector('#rain-z'),
      scale: document.querySelector('#rain-scale'),
      tiltX: document.querySelector('#rain-tilt-x'),
      tiltY: document.querySelector('#rain-tilt-y'),
      tiltZ: document.querySelector('#rain-tilt-z'),
      rotationY: document.querySelector('#rain-rotation-y')
    },
    outputs: {
      x: document.querySelector('#rain-x-value'),
      y: document.querySelector('#rain-y-value'),
      z: document.querySelector('#rain-z-value'),
      scale: document.querySelector('#rain-scale-value'),
      tiltX: document.querySelector('#rain-tilt-x-value'),
      tiltY: document.querySelector('#rain-tilt-y-value'),
      tiltZ: document.querySelector('#rain-tilt-z-value'),
      rotationY: document.querySelector('#rain-rotation-y-value')
    },
    angles: ['tiltX', 'tiltY', 'tiltZ', 'rotationY']
  },
  miniature: {
    state: miniatureState,
    inputs: {
      x: document.querySelector('#miniature-x'),
      y: document.querySelector('#miniature-y'),
      z: document.querySelector('#miniature-z'),
      scale: document.querySelector('#miniature-scale'),
      rotationY: document.querySelector('#miniature-rotation-y')
    },
    outputs: {
      x: document.querySelector('#miniature-x-value'),
      y: document.querySelector('#miniature-y-value'),
      z: document.querySelector('#miniature-z-value'),
      scale: document.querySelector('#miniature-scale-value'),
      rotationY: document.querySelector('#miniature-rotation-y-value')
    },
    angles: ['rotationY']
  }
};

function updateControls() {
  Object.values(controlMap).forEach(({ state: objectState, inputs, outputs, angles }) => {
    Object.entries(inputs).forEach(([key, input]) => {
      input.value = objectState[key];
      outputs[key].textContent = angles.includes(key)
        ? `${Math.round(objectState[key])}°`
        : Number(objectState[key]).toFixed(2);
    });
  });
}

Object.entries(controlMap).forEach(([objectName, { state: objectState, inputs }]) => {
  Object.entries(inputs).forEach(([key, input]) => {
    input.addEventListener('input', () => {
      objectState[key] = Number(input.value);
      if (objectName === 'house') applyPlacement();
      else if (objectName === 'screen') applyRainPlacement();
      else applyMiniaturePlacement();
    });
  });
});

document.querySelectorAll('[data-transform-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.transformTab;
    document.querySelectorAll('[data-transform-tab]').forEach((tab) => {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-selected', tab === button ? 'true' : 'false');
    });
    document.querySelectorAll('[data-transform-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.transformPanel !== selected;
    });
  });
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => setCameraView(button.dataset.view));
});

walkButton.addEventListener('click', startWalking);
controls.addEventListener('lock', () => {
  walkButton.textContent = 'Walking active · press Esc to stop';
  status.textContent = 'Walking active · WASD moves, mouse looks around.';
});
controls.addEventListener('unlock', () => {
  pressedKeys.clear();
  walkButton.textContent = 'Start walking / mouse look';
  status.textContent = `Ready · ART-NORTH-WEST length: ${ART_NORTH_WEST_LENGTH.toFixed(3)} units`;
});

window.addEventListener('keydown', (event) => {
  if (!controls.isLocked || !['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) return;
  event.preventDefault();
  pressedKeys.add(event.code);
});
window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.code);
});

document.querySelector('#reset').addEventListener('click', () => {
  if (initialState) Object.assign(state, initialState);
  if (initialRainState) Object.assign(rainState, initialRainState);
  if (initialImageState) Object.assign(imageState, initialImageState);
  if (initialMiniatureState) Object.assign(miniatureState, initialMiniatureState);
  applyPlacement();
  applyRainPlacement();
  applyImagePlacement();
  applyMiniaturePlacement();
});

document.querySelector('#copy').addEventListener('click', async () => {
  const text = JSON.stringify({
    house: { ...state, scaleRelativeToArtNorthWest: state.scale },
    houseRainScreen: { ...rainState },
    staticImage: { attachedTo: 'houseRainScreen.display' },
    miniature: { ...miniatureState }
  }, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'Transform copied to clipboard.';
  } catch {
    status.textContent = text;
  }
});

resetHouseColorsButton.addEventListener('click', resetHouseColors);
copyHouseColorsButton.addEventListener('click', copyHouseColors);
componentSearch.addEventListener('input', filterHouseComponents);
applyPhotoPaletteButton.addEventListener('click', () => applyPhotoPalette(true));

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

window.addEventListener('resize', resize);
createArtRoomShell();
createMiniatureModel();
loadArtWallContent();
initialMiniatureState = { ...miniatureState };
setCameraView('south');
resize();
updateControls();

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
textureLoader.load(RAIN_POSTER_URL, (texture) => {
  rainPivot = createRainVideoScreen(texture);
  initialRainState = { ...rainState };
  applyRainPlacement();
}, undefined, () => {
  status.textContent = 'House loaded; rain-video poster could not be loaded.';
});
textureLoader.load(STATIC_IMAGE_URL, (texture) => {
  createStaticImage(texture);
  initialImageState = { ...imageState };
  applyImagePlacement();
}, undefined, () => {
  status.textContent = 'House loaded; the static JPG could not be loaded.';
});
loader.load(MODEL_URL, (gltf) => {
  const model = gltf.scene.clone(true);
  prepareHouseModel(model);
  addHouseColorControls(model);
  restoreHouseColors().then((restored) => {
    if (!restored) applyPhotoPalette(false);
  });
  housePivot = new THREE.Group();
  housePivot.add(model);
  scene.add(housePivot);
  initialState = { ...state };
  applyPlacement();
  status.textContent = `Ready · ART-NORTH-WEST length: ${ART_NORTH_WEST_LENGTH.toFixed(3)} units`;
}, undefined, (error) => {
  console.error(error);
  status.textContent = 'Could not load the house model.';
});

function animate() {
  requestAnimationFrame(animate);
  updateWalking(1 / 60);
  updateHouseSelectionHelper();
  renderer.render(scene, camera);
}
animate();
