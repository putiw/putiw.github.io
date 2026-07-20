import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';
import { artWorks } from './art/works.js';
import {
  MAIN_ROOM as ROOM,
  SCREENING_ROOM,
  BRAIN_ROOM,
  BRAIN_HALL_SOUTH_EDGE,
  BRAIN_HALL_NORTH_EDGE,
  BRAIN_HALL_WIDTH,
  BRAIN_HALL_CENTER_Z,
  APP_ROOM,
  SIDE_ROOM_DOOR_WIDTH,
  SIDE_ROOM_DOOR_Z,
  ROOM_WALL_THICKNESS,
  GAME_ROOM,
  GAME_VIDEOS_HALL_DOOR_X,
  VIDEOS_ROOM,
  EMPTY_GAME_ROOM,
  ART_ROOM
} from './wall-map-layout.js?v=20260718-all-door-headers-labels-contrast1-map-path1';

const ROOM_KEYS = {
  main: 'main',
  app: 'app',
  screening: 'screening',
  brain: 'brain',
  mri: 'mri',
  game: 'game',
  videos: 'videos',
  art: 'art'
};
const MAIN_ROOM_AREA = {
  centerX: 0,
  halfWidth: ROOM.halfWidth,
  nearZ: -ROOM.halfDepth,
  farZ: ROOM.halfDepth
};
const GALLERY_ROOM_AREAS = [
  { key: ROOM_KEYS.main, room: MAIN_ROOM_AREA },
  { key: ROOM_KEYS.app, room: APP_ROOM },
  { key: ROOM_KEYS.screening, room: SCREENING_ROOM },
  { key: ROOM_KEYS.brain, room: BRAIN_ROOM },
  { key: ROOM_KEYS.mri, room: EMPTY_GAME_ROOM },
  { key: ROOM_KEYS.game, room: GAME_ROOM },
  { key: ROOM_KEYS.videos, room: VIDEOS_ROOM },
  { key: ROOM_KEYS.art, room: ART_ROOM }
];
const SPECULATIVE_PRELOAD_DWELL_MS = 700;
const ORDERED_PRELOAD_PHASE_GAP_MS = 180;
const ORDERED_VIDEO_PRELOAD_GAP_MS = 240;

const ANALYTICS_HOST = 'putiw.github.io';
const ANALYTICS_ENDPOINT = 'https://cloud.umami.is/api/send';
const ANALYTICS_WEBSITE_ID = '9ae65ed7-fa3e-461b-adb5-0d37c0d0603c';
const ANALYTICS_ROOM_LABELS = {
  [ROOM_KEYS.main]: 'Science room',
  [ROOM_KEYS.app]: 'App room',
  [ROOM_KEYS.screening]: 'Defense room',
  [ROOM_KEYS.brain]: 'Brain room',
  [ROOM_KEYS.mri]: 'MRI room',
  [ROOM_KEYS.game]: 'Game room',
  [ROOM_KEYS.videos]: 'Video room',
  [ROOM_KEYS.art]: 'Art room',
  house: 'House in the Rain'
};
const ANALYTICS_ROOM_TIME_REFERRERS = {
  [ROOM_KEYS.main]: 'https://science-room.gallery/',
  [ROOM_KEYS.app]: 'https://app-room.gallery/',
  [ROOM_KEYS.screening]: 'https://defense-room.gallery/',
  [ROOM_KEYS.brain]: 'https://brain-room.gallery/',
  [ROOM_KEYS.mri]: 'https://mri-room.gallery/',
  [ROOM_KEYS.game]: 'https://game-room.gallery/',
  [ROOM_KEYS.videos]: 'https://video-room.gallery/',
  [ROOM_KEYS.art]: 'https://art-room.gallery/',
  house: 'https://house-in-the-rain.gallery/'
};

const MOTION_POSTER_HEIGHT = 3;
const POSTER_FRAME_BORDER = 0.075;
const APP_VIDEO_ASPECT = 640 / 412;
const MYPHYSIO_PHONE_ASPECT = 1170 / 2532;

const posters = [
  {
    id: 'fst',
    title: 'Localizing visual motion area FST in human',
    category: 'Visual neuroscience',
    authors: 'Vision Sciences Society Annual Meeting (poster) - May 2024',
    labelMeta: 'Vision Sciences Society Annual Meeting (poster) - May 2024',
    wallImage: './posters/fst-wall.webp',
    detailImage: './posters/fst-detail.webp',
    aspect: 3072 / 1808,
    width: MOTION_POSTER_HEIGHT * (3072 / 1808),
    frameWidth: MOTION_POSTER_HEIGHT * (3072 / 1808) + POSTER_FRAME_BORDER * 2,
    frameHeight: MOTION_POSTER_HEIGHT + POSTER_FRAME_BORDER * 2,
    flatFrame: true,
    position: [-9.36, 3.2, -3.0],
    rotationY: Math.PI / 2
  },
  {
    id: 'decoding',
    title: 'Single-trial fMRI decoding of 3D motion with stereoscopic and perspective cues',
    category: 'fMRI and computational neuroscience',
    authors: 'Vision Sciences Society Annual Meeting, St. Pete Beach (poster) - May 2023',
    labelMeta: 'Vision Sciences Society Annual Meeting, St. Pete Beach (poster) - May 2023',
    wallImage: './posters/decoding-wall.webp',
    detailImage: './posters/decoding-detail.webp',
    aspect: 16 / 9,
    width: MOTION_POSTER_HEIGHT * (16 / 9),
    frameWidth: MOTION_POSTER_HEIGHT * (16 / 9) + POSTER_FRAME_BORDER * 2,
    frameHeight: MOTION_POSTER_HEIGHT + POSTER_FRAME_BORDER * 2,
    flatFrame: true,
    position: [-9.36, 3.2, 3.0],
    rotationY: Math.PI / 2
  },
  {
    id: 'cbh',
    title: 'Center for Brain and Health - Research Institute Day Poster',
    category: 'CBH NYUAD',
    authors: 'Designed for the Center for Brain and Health at NYU Abu Dhabi - Research Institute Day 2025',
    labelMeta: 'Designed for the Center for Brain and Health at NYU Abu Dhabi - Research Institute Day 2025',
    wallImage: './posters/cbh-wall.webp',
    detailImage: './posters/cbh-detail.webp',
    aspect: 2048 / 1127,
    width: 4.4,
    position: [9.36, 3.15, 2.55],
    rotationY: -Math.PI / 2
  },
  {
    id: 'ms-lesion-metrics',
    title: 'Enhanced Prediction of Multiple Sclerosis Disabilities Using Tract-Specific Lesion Load and Advanced Quantitative MRI Metrics',
    category: 'Multiple sclerosis neuroimaging',
    authors: 'MENACTRIMS Congress, Jeddah (poster) - November 2024; NYU Abu Dhabi Division of Science Annual Research Conference (First Place Poster) - January 2025',
    labelMeta: 'MENACTRIMS Congress, Jeddah (poster) - November 2024; NYU Abu Dhabi Division of Science Annual Research Conference (First Place Poster) - January 2025',
    labelMetaFontSize: 30,
    wallImage: './posters/ms-lesion-metrics-wall.webp',
    detailImage: './posters/ms-lesion-metrics-detail.webp',
    aspect: 2175 / 3072,
    width: 2.443,
    position: [-6.2, 3.05, -6.88],
    rotationY: 0
  },
  {
    id: 'ohbm-pdi',
    title: 'MP2RAGE Ventricle Distance Profiling Improves Classification of Multiple Sclerosis Subtypes',
    category: 'Multiple sclerosis neuroimaging',
    authors: 'Organization for Human Brain Mapping Annual Meeting, Brisbane (poster) - June 2025',
    labelMeta: 'Organization for Human Brain Mapping Annual Meeting, Brisbane (poster) - June 2025',
    wallImage: './posters/ohbm-pdi-wall.webp',
    detailImage: './posters/ohbm-pdi-detail.webp',
    aspect: 2175 / 3072,
    width: 2.443,
    position: [-3.3, 3.05, -6.88],
    rotationY: 0
  },
  {
    id: 'ms-research-day',
    title: 'MS Research Day',
    category: 'Research engagement and outreach',
    authors: 'Made this banner for an event for the National Multiple Sclerosis Society and NYU Abu Dhabi - 5 November 2025',
    labelMeta: 'Made this banner for an event for the National Multiple Sclerosis Society and NYU Abu Dhabi - 5 November 2025',
    labelMetaSingleLine: true,
    wallImage: './posters/ms-research-day-wall.webp',
    detailImage: './posters/ms-research-day-detail.webp',
    aspect: 1337 / 3072,
    width: 1.502,
    labelWidth: 2.7,
    position: [2.95, 3.05, -6.88],
    rotationY: 0
  },
  {
    id: 'laminate',
    title: 'NMSS one pager',
    category: 'Multiple sclerosis collaboration',
    authors: 'Made this one pager for the National Multiple Sclerosis Society - 2025',
    labelMeta: 'Made this one pager for the National Multiple Sclerosis Society - 2025',
    wallImage: './posters/laminate-wall.webp',
    detailImage: './posters/laminate-detail.webp',
    aspect: 2173 / 3072,
    width: 1.22,
    labelWidth: 2.3,
    position: [5.65, 3.05, -6.88],
    rotationY: 0
  },
  {
    id: 'menactrims-cvsview',
    title: 'CVS-View: AI-powered central vein sign identification',
    category: 'Multiple sclerosis software and AI',
    authors: 'Tenth MENACTRIMS Congress, Dubai (poster) - 5-6 December 2025',
    labelMeta: 'Tenth MENACTRIMS Congress, Dubai (poster) - 5-6 December 2025',
    wallImage: './posters/menactrims-cvsview-wall.webp',
    detailImage: './posters/menactrims-cvsview-detail.webp',
    aspect: 1240 / 2048,
    width: 2.09,
    labelWidth: 2.8,
    position: [0, 3.05, -6.88],
    rotationY: 0
  }
];

const videoWork = {
  title: 'Center for Brain and Health - One-Minute Overview Film',
  category: 'CBH NYUAD',
  labelMeta: 'Produced for the Center for Brain and Health at NYU Abu Dhabi - Research Institute Day 2025',
  source: './media/cbh-center-film.mp4',
  posterImage: './media/cbh-center-film-poster.webp',
  aspect: 16 / 9,
  width: 4.4,
  position: [9.36, 3.15, -2.55],
  rotationY: -Math.PI / 2,
  roomKey: ROOM_KEYS.main,
  autoplayInBounds: true,
  activationBounds: {
    minX: -ROOM.halfWidth - 0.5,
    maxX: ROOM.halfWidth + 0.5,
    minZ: -ROOM.halfDepth - 0.5,
    maxZ: ROOM.halfDepth + 0.5
  },
  playWhenVisible: true,
  playDistance: 12,
  interactionRadius: 7
};

const BRAIN_WALL_SHEETS = [
  { image: './brain-room/brain-pdf-3.png', side: 'north', aspect: 1076 / 1051 },
  { image: './brain-room/brain-pdf-2.png', side: 'east' },
  { image: './brain-room/brain-pdf-1.png', side: 'floor', aspect: 1487 / 1051 }
];

// The MRI room uses the remaining artboards from the same Illustrator file.
// Each sheet is rendered at the room height; the west and north sheets are
// cropped to the usable wall span so neither can cover a doorway.
const MRI_WALL_SHEETS = [
  { image: './mri-room/brain-pdf-5-updated-v2.png?v=20260718-mri-pdf-black-video-frames', side: 'south', aspect: 4781 / 1744 },
  { image: './mri-room/brain-pdf-4.png?v=20260718-hd', side: 'west', aspect: 4754 / 1744, cropAlign: 'center', contentOnly: true, contentCenterX: 0.607 },
  { image: './mri-room/brain-pdf-6-updated.png?v=20260718-mri-pdf-clean1', side: 'east', aspect: 4704 / 1744 },
  // The black artboard is cropped from the PDF page and padded with black only;
  // its title, subtitle, marked video frame, and original typography stay in
  // this single sheet texture, just like the diffusion wall.
  { image: './mri-room/brain-pdf-7-updated-clean-v2.png?v=20260718-mri-pdf-black-video-frames', side: 'north', aspect: 2299 / 1744 }
];

const MRI_VIDEO_WORKS = [
  {
    title: 'AFQView',
    source: './media/mri-afqview-hd.mp4',
    roomKey: ROOM_KEYS.mri,
    side: 'south',
    sheetAspect: 4781 / 1744,
    // PDF page 5 marker bounds in the cropped 4781 x 1744 image.
    rect: { x: 3335 / 4781, y: 601 / 1744, width: 1075 / 4781, height: 695 / 1744 },
    videoAspect: 16 / 9
  },
  {
    title: 'Functional MRI',
    source: './media/mri-fmri-hd.mp4',
    roomKey: ROOM_KEYS.mri,
    side: 'north',
    sheetAspect: 2299 / 1744,
    // PDF page 7 marker bounds in the cropped 2299 x 1744 image.
    rect: { x: 515 / 2299, y: 509 / 1744, width: 1274 / 2299, height: 825 / 1744 },
    videoAspect: 16 / 9
  }
];

const BRAIN_SOURCES = {
  left: '../mri/lh.pial',
  right: '../mri/rh.pial'
};

const BRAIN_ANNOTATIONS = {
  left: '../mri/lh.aparc.DKTatlas.annot',
  right: '../mri/rh.aparc.DKTatlas.annot'
};

const APP_VIDEO_WIDTH = 2.8;
const APP_VIDEO_GAP = 0.35;
const APP_VIDEO_GROUP_GAP = 1.0;
const APP_VIDEO_STEP = APP_VIDEO_WIDTH + APP_VIDEO_GAP;
const APP_VIDEO_GROUP_SPAN = APP_VIDEO_WIDTH * 3 + APP_VIDEO_GAP * 2;
const APP_VIDEO_AREA_NEAR = APP_ROOM.nearZ + 0.9;
const APP_VIDEO_AREA_FAR = SIDE_ROOM_DOOR_Z - SIDE_ROOM_DOOR_WIDTH / 2 - 0.9;
const APP_VIDEO_MARGIN = (
  APP_VIDEO_AREA_FAR - APP_VIDEO_AREA_NEAR
  - (APP_VIDEO_GROUP_SPAN * 2 + APP_VIDEO_GROUP_GAP)
) / 2;
const LESION_VIDEO_FIRST_Z = APP_VIDEO_AREA_NEAR + APP_VIDEO_MARGIN + APP_VIDEO_WIDTH / 2;
const CVS_VIDEO_FIRST_Z = LESION_VIDEO_FIRST_Z + APP_VIDEO_GROUP_SPAN + APP_VIDEO_GROUP_GAP;
const LESION_GROUP_CENTER_Z = LESION_VIDEO_FIRST_Z + APP_VIDEO_STEP;
const CVS_GROUP_CENTER_Z = CVS_VIDEO_FIRST_Z + APP_VIDEO_STEP;

const ART_PORTAL_COLOR = 0x7f8181;
const ART_PORTAL_CSS_COLOR = '#7f8181';
const ART_R_SHIFT_X = 0.22;
const PDF_ART_PANEL_HEIGHT = ART_ROOM.height;
const APARTMENT_PANEL_ASPECT = 3230 / 1867;
const ART_MOSAIC_HEIGHT = 5.75;
const ART_MOSAIC_CENTER_Y = ART_ROOM.height / 2 - 0.35;

const ART_PDF_CATEGORIES = new Set([
  'Random stuff',
  'Cat',
  'Apartment',
  'Stuff I did for others',
  'Colored stuff',
  'Stuff I did when I was sick',
  'Black and white stuff'
]);

const ART_WALL_SHEETS = [
  {
    images: [
      './art/walls/hd/home-0.webp?v=20260720-hd2x1',
      './art/walls/hd/home-1.webp?v=20260720-hd2x1'
    ],
    tilePixelWidths: [3705, 3705],
    aspect: 4631 / 1867,
    side: 'near-left'
  },
  {
    images: [
      './art/walls/hd/others-apartment-0.webp?v=20260720-hd2x1',
      './art/walls/hd/others-apartment-1.webp?v=20260720-hd2x1',
      './art/walls/hd/others-apartment-2.webp?v=20260720-hd2x1',
      './art/walls/hd/others-apartment-3.webp?v=20260720-hd2x1'
    ],
    tilePixelWidths: [3739, 3739, 3739, 3739],
    aspect: 7478 / 1867,
    side: 'left'
  },
  {
    images: [
      './art/walls/hd/art-south-0.webp?v=20260720-hd2x1',
      './art/walls/hd/art-south-1.webp?v=20260720-hd2x1',
      './art/walls/hd/art-south-2.webp?v=20260720-hd2x1',
      './art/walls/hd/art-south-3.webp?v=20260720-hd2x1'
    ],
    tilePixelWidths: [4034, 4034, 4034, 4034],
    aspect: 8068 / 1494,
    side: 'far'
  },
  {
    images: [
      './art/walls/hd/sick-black-white-0.webp?v=20260720-hd2x1',
      './art/walls/hd/sick-black-white-1.webp?v=20260720-hd2x1',
      './art/walls/hd/sick-black-white-2.webp?v=20260720-hd2x1'
    ],
    tilePixelWidths: [3989, 3989, 3988],
    aspect: 7478 / 1867,
    side: 'right'
  },
  {
    images: [
      './art/walls/hd/final-wall-0.webp?v=20260720-hd2x1',
      './art/walls/hd/final-wall-1.webp?v=20260720-hd2x1'
    ],
    tilePixelWidths: [3705, 3705],
    aspect: 4631 / 1867,
    side: 'near-right'
  }
];

const ART_SALON_PANELS = [
  {
    category: 'Random stuff', side: 'near-right', width: 10.3,
    smallWidth: 6.2, rows: 4, featureSide: 'right'
  },
  {
    category: 'Cat', side: 'front', centerX: -2, width: 7.5,
    smallWidth: 3.6, rows: 3, featureSide: 'right'
  },
  {
    category: 'Stuff I did when I was sick', side: 'right', centerZ: 42.9, width: 10.3,
    smallWidth: 6.2, rows: 4, featureSide: 'right', largerSmallWorks: true
  },
  {
    category: 'Black and white stuff', side: 'right', centerZ: 53.45, width: 8.2,
    smallWidth: 4.2, rows: 4, featureSide: 'left'
  },
  {
    category: 'Colored stuff', side: 'front', centerX: 13.09, width: 7,
    smallWidth: 4.2, rows: 4, featureSide: 'left'
  },
  {
    category: 'Apartment', side: 'left',
    centerZ: ART_ROOM.nearZ + (APARTMENT_PANEL_ASPECT * PDF_ART_PANEL_HEIGHT) / 2,
    width: 11.2,
    smallWidth: 2.3, rows: 1, featureSide: 'left'
  },
  {
    category: 'Stuff I did for others', side: 'left',
    centerZ: ART_ROOM.farZ - (3024 / 1489 * PDF_ART_PANEL_HEIGHT) / 2,
    width: 8.8,
    smallWidth: 4.8, rows: 3, featureSide: 'right'
  }
];

const ART_TEMPLATE_PANELS = {
  Cat: {
    image: './art/templates/cat-panel.png',
    aspect: 3202 / 1594,
    height: PDF_ART_PANEL_HEIGHT
  },
  Apartment: {
    image: './art/templates/apartment-panel-updated.png?v=20260718-apartment-pdf-text',
    aspect: APARTMENT_PANEL_ASPECT,
    height: PDF_ART_PANEL_HEIGHT
  },
  'Stuff I did for others': {
    image: './art/templates/others-panel.png',
    aspect: 3024 / 1489,
    height: PDF_ART_PANEL_HEIGHT
  },
  'Colored stuff': {
    image: './art/templates/colored-panel.png',
    aspect: 3348 / 1584,
    height: PDF_ART_PANEL_HEIGHT
  }
};

const TSHIRT_TEMPLATE_PANEL = {
  image: './art/templates/tshirt-panel.png',
  aspect: 2174 / 1240,
  height: PDF_ART_PANEL_HEIGHT
};

const TSHIRT_WORKS = [
  { image: './design/shirt-cbh.png', aspect: 1484 / 1472, x: -2.65, width: 2.42 },
  { image: './design/shirt-chengdian.png', aspect: 1340 / 1508, x: 0, width: 2.28 },
  { image: './design/shirt-cshl.png', aspect: 1482 / 1462, x: 2.65, width: 2.42 }
];

const MUG_DISPLAYS = [
  {
    texture: './art/pierre-mug.webp',
    x: ART_ROOM.centerX - 1.25,
    z: 49.15,
    pedestalHeight: 1.7,
    rotationY: -0.54
  },
  {
    texture: './art/hadi-mug.webp?v=20260720-current-artwork',
    x: ART_ROOM.centerX + 1.25,
    z: 49.15,
    pedestalHeight: 1.7,
    rotationY: 0.54
  }
];

const HOUSE_DISPLAY = {
  model: './models/childhood-house-new-grouped.glb',
  x: ART_ROOM.centerX - 6.35,
  z: 43.25,
  width: 3.34,
  depth: 1.54,
  plinthHeight: 1.25
};
const HOUSE_POND = {
  // Measurements from childhood-house-pond.glb, normalized around the same
  // house origin used by prepareHouseModel. Keeping these source dimensions
  // lets the lake inherit the house placement without losing its OG ratio.
  centerX: 23.861792347598647,
  centerZ: 2.460796638391791,
  width: 16.441970825195312,
  depth: 20.82552657279642,
  outlineCenterX: 0.1,
  outlineCenterZ: 0.2,
  outlineWidth: 15.8,
  outlineDepth: 19.8,
  waterLevel: -0.004,
  outline: [
    [-7.8, -2.2], [-6.4, -7.1], [-2.2, -9.7], [2.5, -9.4],
    [6.7, -6.2], [8.0, -1.8], [7.3, 3.1], [5.4, 7.6],
    [1.4, 10.1], [-2.3, 9.5], [-4.1, 6.7], [-3.0, 4.0],
    [-5.9, 4.2], [-7.7, 1.4]
  ]
};
const HOME_PORTAL = {
  // Only the lower-left photo section of the Home sheet is permeable. The
  // Blender renders and model studies to its right remain on a solid wall.
  x: ART_ROOM.centerX - ART_ROOM.halfWidth + 4.275,
  z: ART_ROOM.nearZ,
  width: 6.75,
  height: 5.85,
  triggerZ: ART_ROOM.nearZ + 0.37,
  promptDistance: 5.4,
  promptSideMargin: 0.45
};
const HOME_FLOOR_ARROW = {
  // Center the cue directly in front of the photo-only portal area so it
  // points straight at the Home wall rather than sitting by the entrance.
  x: HOME_PORTAL.x - 1.0,
  targetX: HOME_PORTAL.x - 1.0,
  z: ART_ROOM.nearZ + 3.2,
  length: 3.6,
  shaftWidth: 0.58,
  headWidth: 1.75
};
const ART_ROOM_FLOOR_COLOR = 0xaaa397;
const HOUSE_WORLD_LAYER = 1;
const HOUSE_WORLD_PLAYER_SCALE = 1 / 1.5;
const HOUSE_WORLD_EYE_HEIGHT = 1.68 * HOUSE_WORLD_PLAYER_SCALE;
const HOUSE_WORLD_MODEL_PLACEMENT = Object.freeze({
  x: 0,
  // Equivalent to the original -0.51 offset after removing the 1.5x model
  // scale: -0.51 / 1.5 = -0.34.
  y: -0.34,
  z: 0,
  scale: 1
});

function houseLocalToWorldX(x) {
  return HOUSE_WORLD_MODEL_PLACEMENT.x + x * HOUSE_WORLD_MODEL_PLACEMENT.scale;
}

function houseLocalToWorldY(y) {
  return HOUSE_WORLD_MODEL_PLACEMENT.y + y * HOUSE_WORLD_MODEL_PLACEMENT.scale;
}

function houseLocalToWorldZ(z) {
  return HOUSE_WORLD_MODEL_PLACEMENT.z + z * HOUSE_WORLD_MODEL_PLACEMENT.scale;
}

function houseWorldToLocalX(x) {
  return (x - HOUSE_WORLD_MODEL_PLACEMENT.x) / HOUSE_WORLD_MODEL_PLACEMENT.scale;
}

function houseWorldToLocalZ(z) {
  return (z - HOUSE_WORLD_MODEL_PLACEMENT.z) / HOUSE_WORLD_MODEL_PLACEMENT.scale;
}

const HOUSE_WORLD = {
  // The grouped Blender export is already authored in metres. Preserve its
  // measured 28.27 m width so the exterior reads at human scale.
  modelWidth: 28.27074351296743,
  minX: houseLocalToWorldX(-48),
  maxX: houseLocalToWorldX(48),
  minZ: houseLocalToWorldZ(-40),
  maxZ: houseLocalToWorldZ(32),
  // Run the portal approach directly into the foot of the main stone stairs,
  // centered between its two floor lamps. Enter on the house-facing side of
  // the frame, still well outside the building footprint.
  portalX: houseLocalToWorldX(34.5),
  portalZ: houseLocalToWorldZ(5.225),
  portalRotationY: Math.PI / 2,
  portalTriggerX: houseLocalToWorldX(33.95),
  arrival: new THREE.Vector3(
    houseLocalToWorldX(33.15),
    HOUSE_WORLD_EYE_HEIGHT,
    houseLocalToWorldZ(5.225)
  ),
  stairPathStartX: houseLocalToWorldX(14.25),
  pathWidth: 3.4 * HOUSE_WORLD_MODEL_PLACEMENT.scale,
  maxStepUp: 0.8 * HOUSE_WORLD_PLAYER_SCALE,
  // The front platform is about one metre high: it is safe to drop from, but
  // remains too tall to climb or jump onto from the surrounding ground.
  maxStepDown: 1.25 * HOUSE_WORLD_PLAYER_SCALE,
  playerRadius: 0.29 * HOUSE_WORLD_PLAYER_SCALE
};
const HOUSE_WORLD_MOVE_SPEED = 4.35 * HOUSE_WORLD_PLAYER_SCALE;
const HOUSE_WORLD_MOVE_SUBSTEP = 0.08 * HOUSE_WORLD_PLAYER_SCALE;
const HOUSE_WORLD_AUTO_DROP_THRESHOLD = 0.45 * HOUSE_WORLD_PLAYER_SCALE;
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
  'Plane085', 'cut_long_wall_top_window', 'front_wall_right_side',
  'leftwall', 'middlefrontwall', 'middlefrontwall001', 'middlefrontwall004', 'midwall1',
  'midwall1002', 'midwall1027', 'midwall1028', 'right_middle_wall', 'roomfloor',
  'midwall1015', 'midwall1016', 'midwall1017', 'midwall1018', 'midwall1019',
  'midwall1020', 'midwall1021', 'midwall1022', 'midwall1023', 'midwall1024',
  'midwall1025', 'midwall1026', 'Plane', 'Plane014', 'Plane015', 'Plane039', 'Plane074', 'Plane126'
].map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')));
const HOUSE_WOOD_COMPONENTS = new Set([
  'Plane083', 'Plane084', 'Plane119'
].map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')));

const ART_NORTH_WEST_LENGTH = ART_ROOM.halfWidth + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2;
const HOUSE_FLOOR_PREVIEW = {
  wallLength: ART_NORTH_WEST_LENGTH,
  x: -16.81,
  y: -0.05,
  z: 41.99,
  scale: 0.23,
  rotationY: THREE.MathUtils.degToRad(29)
};

const GALLERY_MINIATURE = {
  scale: 0.052,
  x: -15.68,
  z: 52.14
};
const NESTED_GALLERY_MINIATURE = {
  scale: GALLERY_MINIATURE.scale,
  x: GALLERY_MINIATURE.x,
  y: 0.02,
  z: GALLERY_MINIATURE.z
};

const HOUSE_RAIN_DISPLAY = {
  title: 'House in the Rain, 2020',
  source: './media/house-in-rain.mp4',
  posterImage: './media/house-in-rain-poster.jpg',
  photoImage: './placement-assets/img-0168.jpg',
  aspect: 16 / 9,
  width: 2.35,
  x: -11.79,
  positionY: -1,
  z: 42.55,
  screenY: 1.62,
  tiltX: THREE.MathUtils.degToRad(-63),
  tiltY: 0,
  tiltZ: 0,
  pedestalHeight: 1.02,
  rotationY: THREE.MathUtils.degToRad(89),
  interactionRadius: 4.1,
  playDistance: 5,
  requireFocusForPlayback: true,
  preloadPriority: 20,
  manualOnly: false,
  requireInteractionRange: true,
  roomKey: ROOM_KEYS.art,
  autoplayWithSound: true,
  hasSound: true
};

const GAME_DISPLAY_WORKS = [
  {
    title: 'Echoing End',
    description: 'Post-apocalyptic survival of a kid and a dog.',
    source: './media/everything-everywhere-game.mp4',
    posterImage: './media/video-posters/everything-everywhere-game.png',
    aspect: 1172 / 660,
    contentHeight: 1.15,
    frameWidth: 2.7,
    frameHeight: 1.38,
    x: GAME_ROOM.centerX - GAME_ROOM.halfWidth + (GAME_ROOM.halfWidth * 2) / 3,
    z: 29.05
  },
  {
    title: 'Shrimp',
    description: 'Shrimp farm simulation.',
    source: './media/shrimp-tanks-game.mp4',
    posterImage: './media/video-posters/shrimp-tanks-game.png',
    aspect: 1594 / 730,
    contentHeight: 1.15,
    frameWidth: 2.7,
    frameHeight: 1.38,
    x: GAME_ROOM.centerX - GAME_ROOM.halfWidth + (GAME_ROOM.halfWidth * 2) / 3,
    z: 32.45,
    launchAction: {
      label: 'PLAY',
      url: '../shrimp-tanks/?v=20260718-shrimp-build-6c9142f1155c06ec'
    }
  }
].map((work) => ({
  ...work,
  screenY: 1.68,
  // Match the deliberate backward kiosk tilt used by the house display.
  tiltX: -Math.PI / 5.5,
  pedestalHeight: 1.0,
  displayScale: 0.86,
  // Face the new west-side doorway so visitors see the screens on entry.
  rotationY: Math.PI / 2,
  holderColor: 0x0b0d0f,
  interactionRadius: 4.4,
  playDistance: 8,
  preloadPriority: 96,
  playWhenVisible: true,
  manualOnly: false,
  requireInteractionRange: false,
  hasSound: true,
  activationBounds: null,
  roomKey: ROOM_KEYS.game
}));

const GAME_WALL_SHEETS = [
  {
    image: './game/game-artboard-3-transparent.png?v=20260718-game-artboard-3-transparent-600dpi',
    side: 'west',
    aspect: 1087 / 468,
    width: 1.24
  }
];

const VIDEO_ROOM_SCREEN_WIDTH = 3.15;
const VIDEO_ROOM_SCREEN_Y = 2.8;
// Video Room audio is attenuated in the source files; keep the element at unity gain.
const VIDEO_ROOM_VOLUME = 1;
const VIDEO_ROOM_ASSET_VERSION = '20260718-video-room-audio-50';
const VIDEO_ROOM_POSTER_VERSION = '20260718-video-room3-poster-frames';
const VIDEO_ROOM_WALL_ZS = [
  VIDEOS_ROOM.nearZ + 4.1,
  VIDEOS_ROOM.nearZ + 9.45
];
const VIDEO_ROOM_ACTIVATION_BOUNDS = {
  minX: VIDEOS_ROOM.centerX - VIDEOS_ROOM.halfWidth - 0.5,
  maxX: VIDEOS_ROOM.centerX + VIDEOS_ROOM.halfWidth + 0.5,
  minZ: VIDEOS_ROOM.nearZ - 0.5,
  maxZ: VIDEOS_ROOM.farZ + 0.5
};

const VIDEO_ROOM_WORKS = [
  {
    title: 'Cataract',
    source: `./media/videos/cataract-audio-50.mp4?v=${VIDEO_ROOM_ASSET_VERSION}`,
    posterImage: './media/video-posters/cataract-poster-00-20.jpg',
    position: [VIDEOS_ROOM.centerX, VIDEO_ROOM_SCREEN_Y, VIDEOS_ROOM.nearZ + 0.14],
    rotationY: 0
  },
  {
    title: 'Lower Back Pain',
    source: `./media/videos/lower-back-pain-audio-50.mp4?v=${VIDEO_ROOM_ASSET_VERSION}`,
    posterImage: './media/video-posters/lower-back-pain-poster-00-11.jpg',
    position: [VIDEOS_ROOM.centerX + VIDEOS_ROOM.halfWidth - 0.14, VIDEO_ROOM_SCREEN_Y, VIDEO_ROOM_WALL_ZS[0]],
    rotationY: -Math.PI / 2
  },
  {
    title: 'Goosebumps, Hiccups, and Yawns',
    source: `./media/videos/goosebumps-hiccup-yawn-sub-audio-50.mp4?v=${VIDEO_ROOM_ASSET_VERSION}`,
    posterImage: './media/video-posters/goosebumps-hiccup-yawn-sub-poster-00-11.jpg',
    position: [VIDEOS_ROOM.centerX + VIDEOS_ROOM.halfWidth - 0.14, VIDEO_ROOM_SCREEN_Y, VIDEO_ROOM_WALL_ZS[1]],
    rotationY: -Math.PI / 2
  },
  {
    title: 'Teeth',
    source: `./media/videos/teeth-audio-50.mp4?v=${VIDEO_ROOM_ASSET_VERSION}`,
    posterImage: './media/video-posters/teeth-poster-00-47.jpg',
    position: [VIDEOS_ROOM.centerX - VIDEOS_ROOM.halfWidth + 0.14, VIDEO_ROOM_SCREEN_Y, VIDEO_ROOM_WALL_ZS[0]],
    rotationY: Math.PI / 2
  },
  {
    title: 'How to Kill Spider Mites',
    source: `./media/videos/spider-mites-sub-audio-50.mp4?v=${VIDEO_ROOM_ASSET_VERSION}`,
    posterImage: './media/video-posters/spider-mites-sub-poster-00-24.jpg',
    position: [VIDEOS_ROOM.centerX - VIDEOS_ROOM.halfWidth + 0.14, VIDEO_ROOM_SCREEN_Y, VIDEO_ROOM_WALL_ZS[1]],
    rotationY: Math.PI / 2
  }
].map((work) => ({
  ...work,
  posterImage: `${work.posterImage}?v=${VIDEO_ROOM_POSTER_VERSION}`,
  aspect: 16 / 9,
  width: VIDEO_ROOM_SCREEN_WIDTH,
  labelWidth: 2.5,
  showCategory: false,
  showMeta: false,
  frameColor: 0x111416,
  blackOutline: true,
  blackOutlinePadding: 0.08,
  playWhenVisible: false,
  playDistance: 5.5,
  interactionRadius: 5.5,
  requireInteractionRange: true,
  requireFocusForPlayback: true,
  activationBounds: VIDEO_ROOM_ACTIVATION_BOUNDS,
  videoRoom: true,
  roomKey: ROOM_KEYS.videos,
  deferVideoLoad: true,
  hasSound: true,
  labelColor: '#eef2f3',
  preloadPriority: 0
}));

const HOUSE_RENDER_WALL = {
  image: './house-renders/home-all-wall.png',
  aspect: 4427 / 1627,
  width: PDF_ART_PANEL_HEIGHT * (4427 / 1627),
  y: ART_ROOM.height / 2
};

const defenseScreeningWork = {
  title: 'PhD Defense',
  source: './media/defense-screening-web.mp4?v=20260717-faststart',
  posterImage: './media/video-posters/defense-screening-web.jpg',
  aspect: 1280 / 828,
  width: 6.2,
  position: [SCREENING_ROOM.centerX, 2.8, SCREENING_ROOM.farZ - 0.1],
  rotationY: Math.PI,
  roomKey: ROOM_KEYS.screening,
  preloadPriority: 70,
  playDistance: 9,
  showLabel: false,
  activationBounds: {
    minX: SCREENING_ROOM.centerX - SCREENING_ROOM.halfWidth - 0.5,
    maxX: SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth + 0.5,
    minZ: 8.2,
    maxZ: SCREENING_ROOM.farZ
  },
  frameColor: 0x030404
};

const appDemoWorks = [
  {
    title: 'Lesion-Centered Mask Review',
    category: '1 · CVSView',
    labelMeta: 'Centers the camera on each lesion and toggles its mask.',
    source: './media/cvsview-lesion-mask-native.mp4',
    aspect: APP_VIDEO_ASPECT,
    width: APP_VIDEO_WIDTH,
    position: [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.1, CVS_VIDEO_FIRST_Z + APP_VIDEO_STEP * 2],
    labelWidth: 3,
    device: 'monitor',
    rotationY: -Math.PI / 2
  },
  {
    title: 'Rapid Lesion Navigation',
    category: '2 · CVSView',
    labelMeta: 'Moves quickly between lesions with automatic camera centering.',
    source: './media/cvsview-rapid-navigation-native.mp4',
    aspect: APP_VIDEO_ASPECT,
    width: APP_VIDEO_WIDTH,
    position: [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.1, CVS_VIDEO_FIRST_Z + APP_VIDEO_STEP],
    labelWidth: 3,
    device: 'monitor',
    rotationY: -Math.PI / 2
  },
  {
    title: 'CVS/PRL Review and Reporting',
    category: '3 · CVSView',
    labelMeta: 'Reviews co-registered FLAIR*, phase, and FLAIR images at each lesion and saves the results.',
    source: './media/cvsview-cvs-prl-review-web-720.mp4',
    preloadPriority: 95,
    aspect: APP_VIDEO_ASPECT,
    width: APP_VIDEO_WIDTH,
    position: [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.1, CVS_VIDEO_FIRST_Z],
    labelWidth: 3,
    device: 'monitor',
    rotationY: -Math.PI / 2
  },
  {
    title: 'Lesion-Centered Segmentation',
    category: '1 · LesionView',
    labelMeta: 'Shows the segmentation mask with the camera centered on the lesion.',
    source: './media/lesionview-lesion-segmentation-native.mp4',
    aspect: APP_VIDEO_ASPECT,
    width: APP_VIDEO_WIDTH,
    position: [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.1, LESION_VIDEO_FIRST_Z + APP_VIDEO_STEP * 2],
    labelWidth: 3,
    device: 'monitor',
    rotationY: -Math.PI / 2
  },
  {
    title: 'Baseline and Follow-up Comparison',
    category: '2 · LesionView',
    labelMeta: 'Displays co-registered baseline and follow-up scans for any lesion.',
    source: './media/lesionview-longitudinal-comparison-native.mp4',
    aspect: APP_VIDEO_ASPECT,
    width: APP_VIDEO_WIDTH,
    position: [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.1, LESION_VIDEO_FIRST_Z + APP_VIDEO_STEP],
    labelWidth: 3,
    device: 'monitor',
    rotationY: -Math.PI / 2
  },
  {
    title: 'New Lesion Verification',
    category: '3 · LesionView',
    labelMeta: 'Reviews and verifies newly detected lesions.',
    source: './media/lesionview-new-lesion-verification-native.mp4',
    aspect: APP_VIDEO_ASPECT,
    width: APP_VIDEO_WIDTH,
    position: [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.1, LESION_VIDEO_FIRST_Z],
    labelWidth: 3,
    device: 'monitor',
    rotationY: -Math.PI / 2
  }
].map((work) => ({
  ...work,
  preloadPriority: work.preloadPriority ?? 75,
  posterImage: `./media/video-posters/${work.source.split('/').pop().replace(/\.mp4$/i, '.jpg')}`,
  playWhenVisible: true,
  playDistance: 6,
  interactionRadius: 5.5,
  monitorStand: false,
  labelPlacement: 'bottom',
  showCategory: false,
  activationBounds: {
    minX: APP_ROOM.centerX - APP_ROOM.halfWidth - 0.5,
    maxX: APP_ROOM.centerX + APP_ROOM.halfWidth + 0.5,
    minZ: APP_ROOM.nearZ - 0.5,
    maxZ: APP_ROOM.farZ + 0.5
  },
  roomKey: ROOM_KEYS.app
}));

const myPhysioVideoWorks = [
  {
    title: 'App Welcome',
    category: 'Demo 1',
    labelMeta: 'Launches MyPhysio and introduces the patient experience.',
    source: './media/myphysio-01-app-welcome.mp4?v=20260720-balanced1',
    positionZ: 12.35
  },
  {
    title: "Today's Exercise Plan",
    category: 'Demo 2',
    labelMeta: 'Shows the exercises assigned for the day.',
    source: './media/myphysio-02-daily-exercise.mp4?v=20260720-balanced1',
    positionZ: 14.7
  },
  {
    title: 'Guided Workout Tracker',
    category: 'Demo 3',
    labelMeta: 'Follows the patient through an exercise session.',
    source: './media/myphysio-03-workout-tracker.mp4?v=20260720-balanced1',
    positionZ: 17.05
  },
  {
    title: 'Pain & Discomfort Diary',
    category: 'Demo 4',
    labelMeta: 'Records pain and discomfort over time.',
    source: './media/myphysio-04-pain-diary.mp4?v=20260720-balanced1',
    positionZ: 19.4
  },
  {
    title: 'Range-of-Motion Diary',
    category: 'Demo 5',
    labelMeta: 'Logs and tracks patient range of motion.',
    source: './media/myphysio-05-rom-diary.mp4?v=20260720-balanced1',
    positionZ: 21.75
  },
  {
    title: 'Exercise Program Manager',
    category: 'Demo 6',
    labelMeta: 'Manages the exercise program assigned to the patient.',
    source: './media/myphysio-06-manage-program.mp4?v=20260720-balanced1',
    positionZ: 24.1
  }
].map((work) => ({
  ...work,
  preloadPriority: 55,
  posterImage: `./media/video-posters/${work.source.split('/').pop().split('?')[0].replace(/\.mp4$/i, '.jpg')}`,
  playWhenVisible: true,
  playDistance: 5.5,
  interactionRadius: 5,
  aspect: MYPHYSIO_PHONE_ASPECT,
  width: 1.1,
  position: [APP_ROOM.centerX - APP_ROOM.halfWidth + 0.14, 3.1, work.positionZ],
  rotationY: Math.PI / 2,
  labelPlacement: 'bottom',
  labelWidth: 2.35,
  showCategory: false,
  device: 'phone',
  activationBounds: {
    minX: APP_ROOM.centerX - APP_ROOM.halfWidth - 0.5,
    maxX: APP_ROOM.centerX + APP_ROOM.halfWidth + 0.5,
    minZ: APP_ROOM.nearZ - 0.5,
    maxZ: APP_ROOM.farZ + 0.5
  },
  roomKey: ROOM_KEYS.app
}));

const myPhysioImageWorks = [
  {
    title: 'Patient Progress at a Glance',
    category: 'Demo 7',
    labelMeta: 'Exercise completion, pain, and range-of-motion tracking.',
    image: './media/myphysio-07-stats.png',
    aspect: MYPHYSIO_PHONE_ASPECT,
    width: 1.1,
    position: [APP_ROOM.centerX - APP_ROOM.halfWidth + 0.14, 3.1, 26.45],
    rotationY: Math.PI / 2,
    labelPlacement: 'bottom',
    labelWidth: 2.35,
    showCategory: false,
    device: 'phone'
  },
  {
    title: 'Physiotherapist Dashboard',
    category: 'Demo 8',
    labelMeta: 'Desktop overview for monitoring patients and managing care.',
    image: './media/myphysio-08-physio-dashboard.png',
    aspect: 2892 / 2004,
    width: 2.25,
    position: [APP_ROOM.centerX - APP_ROOM.halfWidth + 0.14, 3.1, 29.3],
    rotationY: Math.PI / 2,
    labelPlacement: 'bottom',
    labelWidth: 2.65,
    showCategory: false,
    device: 'monitor'
  }
];

const figureSalonStatement = {
  body: 'Not posters, just random figures from my papers, I spent a lot of time on them so they are here as a record of the past even tho they are definitely not my favourite in this room :)'
};

const defenseStatement = 'I study how humans come to know the direction of a tiny dot moving on a computer screen. While this may not seem like the most thought-provoking question, it shares the same root as questions as old as philosophy itself – how do humans know anything about the external world? One of the most echoed ideas is that perception is the bridge between us and reality. Plato’s Allegory of the Cave suggests that our immediate senses are mere shadows of true reality. Kant distinguished between the noumenal world (things as they are in themselves) and the phenomenal world (things as they appear to us), proposing that our perceptions are shaped by innate structures of the mind: “All our knowledge begins with the senses, proceeds then to the understanding, and ends with reason” (Kant, 1781). Knowing the direction of a tiny moving dot, as unrelated as it may seem, is part of this much grander and ancient conversation. The fundamental question of how our minds reconstruct the external world from sensory information remains central to this inquiry, and studying motion perception is the means to that end.';
const DEFENSE_WALL_FONT_FAMILY = 'Arial, Helvetica, sans-serif';
const DEFENSE_WALL_TEXT_COLOR = '#8c969a';
const MRI_INTRO_FONT_FAMILY = '"Inter", Arial, Helvetica, sans-serif';
const VIDEOS_INTRO_FONT_FAMILY = '"Inter", Arial, Helvetica, sans-serif';

const resumePages = [
  {
    title: 'Puti Wen — Résumé',
    url: '/resume/',
    image: './resume/resume-page-1.jpg?v=20260720-resume-refresh3',
    width: 3.28,
    aspect: 1391 / 1800,
    position: [1.9, 2.72, 6.9],
    rotationY: Math.PI
  },
  {
    title: 'Puti Wen — Résumé',
    url: '/resume/',
    image: './resume/resume-page-2.jpg?v=20260720-resume-refresh3',
    width: 3.28,
    aspect: 1391 / 1800,
    position: [-1.9, 2.72, 6.9],
    rotationY: Math.PI
  }
];

const figureClusters = [
  {
    title: 'Random figures from published papers',
    category: 'Paper figures',
    labelMeta: 'A single sheet of figures from past papers',
    image: './figures/paper-figures-sheet.jpg',
    detailImage: './figures/paper-figures-sheet.jpg',
    aspect: 3000 / 1649,
    width: 2.6,
    position: [7.95, 2.515, 6.9],
    rotationY: Math.PI
  }
];

const posterById = new Map(posters.map((poster) => [poster.id, poster]));
const galleryApp = document.getElementById('gallery-app');
const canvas = document.getElementById('gallery-canvas');
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');
const loadingStatus = document.getElementById('loading-status');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeEyebrow = document.getElementById('welcome-eyebrow');
const welcomeTitle = document.getElementById('welcome-title');
const welcomeCopy = document.getElementById('welcome-copy');
const enterButton = document.getElementById('enter-button');
const galleryDestinationButton = document.getElementById('gallery-destination-button');
const resumeButton = document.getElementById('resume-button');
const controlSummary = document.getElementById('control-summary');
const reticle = document.getElementById('reticle');
const focusCard = document.getElementById('focus-card');
const focusTitle = document.getElementById('focus-title');
const focusEyebrow = focusCard.querySelector('small');
const focusAction = focusCard.querySelector('span');
const portalPrompt = document.getElementById('portal-prompt');
const portalPromptTitle = document.getElementById('portal-prompt-title');
const portalPromptCopy = document.getElementById('portal-prompt-copy');
const soundReminder = document.getElementById('sound-reminder');
const portalTransition = document.getElementById('portal-transition');
const portalTransitionTitle = document.getElementById('portal-transition-title');
const walkHint = document.getElementById('walk-hint');
const movementGuide = document.querySelector('.movement-guide');
const posterIndex = document.getElementById('poster-index');
const closeIndexButton = document.getElementById('close-index');
const posterDialog = document.getElementById('poster-dialog');
const dialogCategory = document.getElementById('dialog-category');
const dialogTitle = document.getElementById('dialog-title');
const dialogAuthors = document.getElementById('dialog-authors');
const dialogImage = document.getElementById('dialog-image');
const detailLoading = document.getElementById('detail-loading');
const helpDialog = document.getElementById('help-dialog');
const helpButton = document.getElementById('help-button');
const isMobileDevice = navigator.userAgentData?.mobile === true
  || /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const previewParams = new URLSearchParams(window.location.search);

let renderer;
let camera;
let scene;
let controls;
let focusedPoster = null;
let focusedPhoto = null;
let focusedResumeLink = null;
let focusedManualVideo = null;
let focusedGameAction = null;
let focusedBrainRegion = null;
let enteredOnce = false;
let sceneReady = false;
let webglAvailable = true;
let needsRender = true;
let galleryActive = false;
let dragLookEnabled = false;
let draggingView = false;
let dragMoved = false;
let returnToGalleryAfterPoster = false;
let videoRoomLoadRequested = false;
let videoRoomDisplaysLoaded = false;
let videoRoomAudioUnlocked = false;
const videoRoomEntries = [];
let videoSyncRequested = false;
let lastCameraInputAt = 0;
let currentGalleryRoomKey = null;
let previousGalleryRoomKey = null;
let analyticsStarted = false;
let analyticsCache = '';
let analyticsRequestChain = Promise.resolve();
let analyticsRoomKey = null;
let analyticsRoomEnteredAt = 0;
let speculativeOriginRoomKey = null;
let speculativeRoomKey = null;
let activeRoomVideoSequence = null;
let fullGalleryPreloadStarted = false;
const backgroundVideoPreloadPromises = new WeakMap();
const fullGalleryPreloadRoomKeys = new Set();
const roomVisualReadyKeys = new Set([ROOM_KEYS.main]);
const roomVisualReadyResolvers = new Map();
const roomLoadControllers = new Map();
let artGalleryLoadStarted = false;
let backgroundGalleryLoadsStarted = false;
let artRoomMugLoadPromise = null;
let artRoomPeripheralLoadPromise = null;
let artRoomHdUpgradePromise = null;
let lastDragX = 0;
let lastDragY = 0;
let lastFrame = performance.now();
let brainSurfaceLoadStarted = false;
let brainSurfaceLoadPromise = null;
let mriWallLoadsStarted = false;
let mriVideoDisplaysLoaded = false;
let brainWallLoadsStarted = false;
let gameRoomLoadsStarted = false;
let gameRoomKiosksReady = false;
let researchRoomLoadsStarted = false;
let screeningRoomLoadsStarted = false;
let mainRoomBackgroundLoadsStarted = false;
const mainRoomLoadedImages = new Set();
const artRoomLoadedImages = new Set();
const artWallTileMaterials = new Map();
let galleryMiniature = null;
let galleryMiniatureRefreshesQueued = false;
let galleryMiniatureRefreshTimer = 0;
let houseWorldGroup = null;
let houseWorldReady = false;
let insideHouseWorld = false;
let portalTransitioning = false;
let homePortalVeil = null;
let homePortalVeilMaterial = null;
let houseWorldPortalVeil = null;
let houseWorldPortalMaterial = null;
let houseWorldGroundY = 0;
let houseWorldCameraGroundY = 0;
let houseWorldEdgeDropActive = false;
let houseWorldDropGroundOverride = false;
const houseWalkableMeshes = [];
const houseSolidBoxes = [];

function analyticsEnabled() {
  return window.location.hostname === ANALYTICS_HOST;
}

async function postAnalyticsEvent(name, data, options = {}) {
  const payload = {
    website: ANALYTICS_WEBSITE_ID,
    hostname: window.location.hostname,
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: window.navigator?.language || '',
    title: document.title,
    url: window.location.pathname,
    referrer: options.referrer ?? document.referrer ?? ''
  };
  if (name) payload.name = name;
  if (data) payload.data = data;

  const headers = {
    'Content-Type': 'application/json',
    'x-umami-website-id': ANALYTICS_WEBSITE_ID,
    'x-umami-hostname': ANALYTICS_HOST
  };
  if (analyticsCache) headers['x-umami-cache'] = analyticsCache;

  const response = await window.fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    keepalive: true,
    credentials: 'omit',
    headers,
    body: JSON.stringify({ type: 'event', payload })
  });
  if (!response.ok) return;
  const result = await response.json().catch(() => null);
  if (result?.cache) analyticsCache = result.cache;
}

function sendAnalyticsEvent(name, data, options) {
  if (!analyticsEnabled()) return;
  analyticsRequestChain = analyticsRequestChain
    .catch(() => {})
    .then(() => postAnalyticsEvent(name, data, options))
    .catch(() => {});
}

function startAnalytics() {
  if (!analyticsEnabled() || analyticsStarted) return;
  analyticsStarted = true;
  // Umami documents direct event submission for sites that do not use its
  // tracker bundle. This sends the page view without loading third-party JS.
  sendAnalyticsEvent();
}

function finishAnalyticsRoomVisit(now = performance.now()) {
  if (!analyticsRoomKey || !analyticsRoomEnteredAt) return;
  const durationSeconds = Math.max(0, (now - analyticsRoomEnteredAt) / 1000);
  const roomKey = analyticsRoomKey;
  sendAnalyticsEvent('room_dwell', {
    room: ANALYTICS_ROOM_LABELS[roomKey] || roomKey,
    seconds: Number(durationSeconds.toFixed(1)),
    // Umami Boards cannot sum arbitrary numeric event properties. Its Revenue
    // components can, so $1 is deliberately used as one minute of room time.
    revenue: Number((durationSeconds / 60).toFixed(4)),
    currency: 'USD'
  }, {
    referrer: ANALYTICS_ROOM_TIME_REFERRERS[roomKey]
  });
  analyticsRoomKey = null;
  analyticsRoomEnteredAt = 0;
}

function beginAnalyticsRoomVisit(roomKey, now = performance.now()) {
  if (!galleryActive || document.hidden || !roomKey) return;
  if (analyticsRoomKey === roomKey) return;
  finishAnalyticsRoomVisit(now);
  analyticsRoomKey = roomKey;
  analyticsRoomEnteredAt = now;
  sendAnalyticsEvent('room_enter', {
    room: ANALYTICS_ROOM_LABELS[roomKey] || roomKey
  });
}

function resumeAnalyticsRoomTracking() {
  if (!galleryActive || document.hidden) return;
  beginAnalyticsRoomVisit(insideHouseWorld ? 'house' : getGalleryRoomKeyAtCamera());
}
const houseWalkRaycaster = new THREE.Raycaster();
const houseWalkRayOrigin = new THREE.Vector3();
const houseWalkDown = new THREE.Vector3(0, -1, 0);
const houseWalkNormal = new THREE.Vector3();
const houseWalkNormalMatrix = new THREE.Matrix3();
const houseCourtyardWaterMeshes = [];
const houseCourtyardWaterRaycaster = new THREE.Raycaster();
const houseCourtyardWaterRayOrigin = new THREE.Vector3();
const housePondMeshes = [];
const housePondRaycaster = new THREE.Raycaster();
const housePondRayOrigin = new THREE.Vector3();
let housePondWaterTexture = null;
const HOUSE_POND_COLLISION_OFFSETS = [
  [0, 0],
  [HOUSE_WORLD.playerRadius, 0],
  [-HOUSE_WORLD.playerRadius, 0],
  [0, HOUSE_WORLD.playerRadius],
  [0, -HOUSE_WORLD.playerRadius]
];
const galleryMiniaturePosterTextures = new Map();
const galleryMiniaturePosterLoads = new Map();
const GALLERY_MINIATURE_POSTER_OVERRIDES = new Map([
  ['mri-afqview-hd.mp4', '../gallery-miniature/media/video-posters/mri-afqview-miniature.jpg'],
  ['mri-fmri-hd.mp4', '../gallery-miniature/media/video-posters/mri-fmri-miniature.jpg']
]);
let animationFrame = 0;
let eHoldTimer = 0;
let eHoldTarget = null;
let eHoldTriggered = false;
let eHoldWasPlaying = false;
let loadingDisplayProgress = 0;
let loadingProgressAnimation = 0;
const INITIAL_LOADING_MIN_DURATION_MS = 4000;
// performance.now() starts at navigation, which is also when the static
// loading screen becomes visible. Include module startup in the visible gate.
const initialLoadingStartedAt = 0;
const shrimpRoomMusic = new Audio('./media/shrimp-game-music.mp3?v=20260717');
shrimpRoomMusic.loop = true;
shrimpRoomMusic.preload = 'auto';
shrimpRoomMusic.volume = 0;
shrimpRoomMusic.setAttribute('aria-hidden', 'true');
const shrimpRoomWater = new Audio('./media/shrimp-game-water.mp3?v=20260717');
shrimpRoomWater.loop = true;
shrimpRoomWater.preload = 'auto';
shrimpRoomWater.volume = 0;
shrimpRoomWater.setAttribute('aria-hidden', 'true');
const shrimpRoomTracks = [shrimpRoomMusic, shrimpRoomWater];
const shrimpRoomTrackVolumes = [0.36, 0.44];
const SHRIMP_MUSIC_FADE_DISTANCE = 1.1;
const SHRIMP_MUSIC_FADE_RATE = 8;
let shrimpMusicPrimed = false;
let shrimpMusicPlayBlocked = false;
const shrimpMusicPlayPending = new Set();

const pressedKeys = new Set();
const posterMeshes = [];
const photoMeshes = [];
const videoMeshes = [];
const brainMeshes = [];
const galleryVideos = [];
const manualVideoEntries = [];
const raycaster = new THREE.Raycaster();
const pointerCenter = new THREE.Vector2(0, 0);
const dragEuler = new THREE.Euler(0, 0, 0, 'YXZ');
const videoWorldPosition = new THREE.Vector3();
const cameraToVideo = new THREE.Vector3();
const videoToCamera = new THREE.Vector3();
const videoScreenNormal = new THREE.Vector3();
const videoScreenQuaternion = new THREE.Quaternion();
const videoFrustum = new THREE.Frustum();
const videoFrustumMatrix = new THREE.Matrix4();
const STANDING_EYE_HEIGHT = ROOM.height / 2;
const CROUCH_DROP = 0.86;
const JUMP_SPEED = 3.9;
const JUMP_GRAVITY = 12.4;
let jumpOffset = 0;
let jumpVelocity = 0;
let crouchAmount = 0;

function resetPlayerHeight() {
  jumpOffset = 0;
  jumpVelocity = 0;
  crouchAmount = 0;
  if (camera) {
    camera.position.y = insideHouseWorld
      ? houseWorldCameraGroundY + HOUSE_WORLD_EYE_HEIGHT
      : STANDING_EYE_HEIGHT;
  }
}

function startJump() {
  if (!galleryActive || posterDialog.open || !posterIndex.hidden) return;
  if (jumpOffset > 0.001 || jumpVelocity > 0) return;
  jumpVelocity = JUMP_SPEED * (insideHouseWorld ? HOUSE_WORLD_PLAYER_SCALE : 1);
  needsRender = true;
}

function setWelcomeMode(mode) {
  const housePaused = mode === 'house-paused';
  welcomeScreen.classList.toggle('house-paused', housePaused);
  galleryDestinationButton.hidden = !housePaused;
  resumeButton.textContent = housePaused ? 'Resume' : 'View résumé';

  if (housePaused) {
    welcomeEyebrow.textContent = 'House paused';
    welcomeTitle.textContent = 'Where would you like to go?';
    welcomeCopy.textContent = 'Continue exploring the house, return to the gallery, or open the résumé.';
    enterButton.textContent = 'House';
    return;
  }

  if (mode === 'paused') {
    welcomeEyebrow.textContent = 'Gallery paused';
    welcomeTitle.textContent = 'Take your time.';
    welcomeCopy.textContent = 'Return when you are ready.';
    enterButton.textContent = 'Return to gallery';
    return;
  }

  welcomeEyebrow.textContent = 'Puti Wen · Neuroimaging scientist & clinical tool builder';
  welcomeTitle.textContent = 'Walk through the research.';
  welcomeCopy.textContent = 'Explore an interactive 3D gallery of clinical tools, MRI and neuroimaging work, research posters, scientific figures, films, games, and artwork.';
  enterButton.textContent = 'Enter gallery';
}

function setWalkHint(mode = 'gallery') {
  const items = mode === 'house'
    ? [
      '<span class="walk-hint-item"><span class="walk-hint-keys"><kbd>WASD</kbd></span><span class="walk-hint-action">Explore</span></span>',
      '<span class="walk-hint-item walk-hint-note"><span class="walk-hint-action">Walk off the platform to descend</span></span>',
      '<span class="walk-hint-item"><span class="walk-hint-keys"><kbd>Space</kbd><i>+</i><kbd>WASD</kbd></span><span class="walk-hint-action">Jump from roof</span></span>',
      '<span class="walk-hint-item walk-hint-note"><span class="walk-hint-action">Glowing wall returns to gallery</span></span>'
    ]
    : [
      '<span class="walk-hint-item"><span class="walk-hint-keys"><kbd>WASD</kbd></span><span class="walk-hint-action">Move</span></span>',
      '<span class="walk-hint-item"><span class="walk-hint-keys"><kbd>Mouse</kbd></span><span class="walk-hint-action">Look</span></span>',
      '<span class="walk-hint-item walk-hint-video"><span class="walk-hint-keys"><kbd>E</kbd></span><span class="walk-hint-action">Video: play/pause · hold to restart</span></span>',
      '<span class="walk-hint-item"><span class="walk-hint-keys"><kbd>←</kbd><kbd>→</kbd></span><span class="walk-hint-action">Video ±5 sec</span></span>'
    ];
  walkHint.innerHTML = items.join('<span class="walk-hint-separator" aria-hidden="true"></span>');
  walkHint.setAttribute(
    'aria-label',
    mode === 'house'
      ? 'WASD explores. Walk off the platform to descend. Press Space while moving to jump from the roof. The glowing wall returns to the gallery.'
      : 'WASD moves. Mouse looks. Press E to play or pause the focused video, or hold E to restart it. Left and right arrows skip the focused video by five seconds.'
  );
}

function showWelcome(mode = 'initial') {
  finishAnalyticsRoomVisit();
  galleryActive = false;
  pauseGalleryVideos();
  dragLookEnabled = false;
  draggingView = false;
  galleryApp.classList.remove('drag-look', 'dragging-view');
  setWelcomeMode(mode);
  welcomeScreen.hidden = false;
  reticle.hidden = true;
  walkHint.hidden = true;
  focusCard.hidden = true;
  portalPrompt.hidden = true;
  hideSoundReminder();
}

function hideWelcome() {
  welcomeScreen.hidden = true;
  if (!isCoarsePointer) {
    reticle.hidden = false;
    walkHint.hidden = false;
  }
}

function showCatalog() {
  finishAnalyticsRoomVisit();
  galleryActive = false;
  pauseGalleryVideos();
  controls?.unlock();
  galleryApp.classList.add('catalog-open');
  posterIndex.hidden = false;
  posterIndex.setAttribute('aria-hidden', 'false');
  document.getElementById('close-index').focus();
}

function hideCatalog() {
  galleryApp.classList.remove('catalog-open');
  posterIndex.hidden = true;
  posterIndex.setAttribute('aria-hidden', 'true');
  showWelcome(enteredOnce ? 'paused' : 'initial');
  document.getElementById('help-button')?.focus();
}

function openPoster(poster) {
  if (!poster) return;
  finishAnalyticsRoomVisit();
  returnToGalleryAfterPoster = galleryActive;
  galleryActive = false;
  pauseGalleryVideos();
  pressedKeys.clear();
  controls?.unlock();
  dialogCategory.textContent = poster.category;
  dialogTitle.textContent = poster.title;
  dialogAuthors.textContent = poster.labelMeta || poster.authors || '';
  dialogImage.alt = `Full view: ${poster.title}`;
  detailLoading.hidden = false;
  dialogImage.hidden = true;
  dialogImage.src = poster.detailImage;
  if (!posterDialog.open) posterDialog.showModal();
}

dialogImage.addEventListener('load', () => {
  detailLoading.hidden = true;
  dialogImage.hidden = false;
});

dialogImage.addEventListener('error', () => {
  detailLoading.hidden = false;
  detailLoading.textContent = 'The high-resolution poster could not be loaded.';
});

posterDialog.addEventListener('close', () => {
  dialogImage.removeAttribute('src');
  detailLoading.textContent = 'Loading high-resolution poster...';
  const shouldResumeGallery = returnToGalleryAfterPoster;
  returnToGalleryAfterPoster = false;

  if (shouldResumeGallery) {
    enterGallery();
  } else if (!posterIndex.hidden) {
    welcomeScreen.hidden = true;
  } else {
    showWelcome(enteredOnce ? 'paused' : 'initial');
  }
});

function createRoom() {
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: 0.96, metalness: 0 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d2cd, roughness: 1, metalness: 0 });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf1f0ec, roughness: 1, metalness: 0 });
  const appDoorLeft = APP_ROOM.centerX - APP_ROOM.doorWidth / 2;
  const appDoorRight = APP_ROOM.centerX + APP_ROOM.doorWidth / 2;
  const screeningDoorLeft = SCREENING_ROOM.centerX - SCREENING_ROOM.doorWidth / 2;
  const screeningDoorRight = SCREENING_ROOM.centerX + SCREENING_ROOM.doorWidth / 2;
  const frontWallSpans = [
    [-ROOM.halfWidth, appDoorLeft],
    [appDoorRight, screeningDoorLeft],
    [screeningDoorRight, ROOM.halfWidth]
  ];

  const floor = new THREE.Mesh(new THREE.BoxGeometry(ROOM.halfWidth * 2, 0.12, ROOM.halfDepth * 2), floorMaterial);
  floor.position.y = -0.06;
  scene.add(floor);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(ROOM.halfWidth * 2, 0.12, ROOM.halfDepth * 2), ceilingMaterial);
  ceiling.position.y = ROOM.height + 0.06;
  scene.add(ceiling);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM.halfWidth * 2, ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  backWall.position.set(0, ROOM.height / 2, -ROOM.halfDepth - ROOM_WALL_THICKNESS / 2);
  scene.add(backWall);

  frontWallSpans.forEach(([left, right]) => {
    const width = right - left;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
    wall.position.set(left + width / 2, ROOM.height / 2, ROOM.halfDepth + ROOM_WALL_THICKNESS / 2);
    scene.add(wall);
  });

  [APP_ROOM, SCREENING_ROOM].forEach((room) => {
    const headerHeight = ROOM.height - room.doorHeight;
    const header = new THREE.Mesh(new THREE.BoxGeometry(room.doorWidth, headerHeight, ROOM_WALL_THICKNESS), wallMaterial);
    header.position.set(room.centerX, room.doorHeight + headerHeight / 2, ROOM.halfDepth + ROOM_WALL_THICKNESS / 2);
    scene.add(header);
  });

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WALL_THICKNESS, ROOM.height, ROOM.halfDepth * 2), wallMaterial);
  leftWall.position.set(-ROOM.halfWidth - ROOM_WALL_THICKNESS / 2, ROOM.height / 2, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WALL_THICKNESS, ROOM.height, ROOM.halfDepth * 2), wallMaterial);
  rightWall.position.set(ROOM.halfWidth + ROOM_WALL_THICKNESS / 2, ROOM.height / 2, 0);
  scene.add(rightWall);

  const baseboardMaterial = new THREE.MeshStandardMaterial({ color: 0xb7b8b5, roughness: 0.9 });
  const baseboards = [
    { geometry: new THREE.BoxGeometry(ROOM.halfWidth * 2 - 0.14, 0.12, 0.07), position: [0, 0.1, -ROOM.halfDepth + 0.09] },
    ...frontWallSpans.map(([left, right]) => ({
      geometry: new THREE.BoxGeometry(right - left - 0.07, 0.12, 0.07),
      position: [(left + right) / 2, 0.1, ROOM.halfDepth - 0.09]
    })),
    { geometry: new THREE.BoxGeometry(0.07, 0.12, ROOM.halfDepth * 2 - 0.14), position: [-ROOM.halfWidth + 0.09, 0.1, 0] },
    { geometry: new THREE.BoxGeometry(0.07, 0.12, ROOM.halfDepth * 2 - 0.14), position: [ROOM.halfWidth - 0.09, 0.1, 0] }
  ];
  baseboards.forEach(({ geometry, position }) => {
    const trim = new THREE.Mesh(geometry, baseboardMaterial);
    trim.position.set(...position);
    scene.add(trim);
  });

  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [-4.6, 0, 4.6].forEach((z) => {
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.025, 0.09), lightMaterial);
    lightStrip.position.set(0, ROOM.height - 0.08, z);
    scene.add(lightStrip);
  });

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b5ad, 2.25));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(1.5, 5, 3);
  scene.add(keyLight);

  createAppRoom();
  createGameRoom();
  createScreeningRoom();
  createBrainRoom();
  createArtRoom();
  addRoomHeading(
    'PhD Defense',
    [SCREENING_ROOM.centerX, 3.67, ROOM.halfDepth - 0.11],
    Math.PI,
    SCREENING_ROOM.doorWidth,
    190
  );
  addRoomHeading(
    'Stuff I built',
    [APP_ROOM.centerX, 3.67, ROOM.halfDepth - 0.11],
    Math.PI,
    APP_ROOM.doorWidth,
    190
  );
  const gameDoorCenterZ = (GAME_ROOM.nearZ + GAME_ROOM.farZ) / 2 + GAME_ROOM.doorOffsetZ;
  addRoomHeading(
    'Game Room',
    [APP_ROOM.centerX - APP_ROOM.halfWidth + 0.14, 3.67, gameDoorCenterZ],
    Math.PI / 2,
    GAME_ROOM.doorWidth,
    190
  );
  addRoomHeading(
    'Video Room',
    [GAME_VIDEOS_HALL_DOOR_X, 3.67, GAME_ROOM.nearZ + 0.15],
    0,
    GAME_ROOM.doorWidth,
    190,
    '#dce4e7'
  );
  addRoomHeading(
    'MRI Room',
    [APP_ROOM.centerX + APP_ROOM.halfWidth - 0.14, 3.67, SIDE_ROOM_DOOR_Z],
    -Math.PI / 2,
    SIDE_ROOM_DOOR_WIDTH,
    190
  );
  addRoomHeading(
    'Stuff I built',
    [EMPTY_GAME_ROOM.centerX - EMPTY_GAME_ROOM.halfWidth + 0.14, 3.67, SIDE_ROOM_DOOR_Z],
    Math.PI / 2,
    SIDE_ROOM_DOOR_WIDTH,
    190
  );
  addFigureSalonStatement();
  addDefenseStatement();
  addDefenseIntroStatement();
  addMriRoomIntroStatement();
  addVideosRoomIntroStatement();
  addGameRoomIntroStatement();
}

function addGalleryMap() {
  // True-scale floor plan: all rectangles use the same world-unit scale,
  // so the proportions and relative positions match the rooms visitors walk through.
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1800;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  const rooms = [
    { label: 'Research', left: -ROOM.halfWidth, right: ROOM.halfWidth, near: -ROOM.halfDepth, far: ROOM.halfDepth },
    { label: 'Defense', left: SCREENING_ROOM.centerX - SCREENING_ROOM.halfWidth, right: SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth, near: SCREENING_ROOM.nearZ, far: SCREENING_ROOM.farZ },
    { label: 'Brain', left: BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth, right: BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth, near: BRAIN_ROOM.nearZ, far: BRAIN_ROOM.farZ },
    { label: 'App', left: APP_ROOM.centerX - APP_ROOM.halfWidth, right: APP_ROOM.centerX + APP_ROOM.halfWidth, near: APP_ROOM.nearZ, far: APP_ROOM.farZ },
    { label: 'Game', left: GAME_ROOM.centerX - GAME_ROOM.halfWidth, right: GAME_ROOM.centerX + GAME_ROOM.halfWidth, near: GAME_ROOM.nearZ, far: GAME_ROOM.farZ },
    { label: 'Videos', left: VIDEOS_ROOM.centerX - VIDEOS_ROOM.halfWidth, right: VIDEOS_ROOM.centerX + VIDEOS_ROOM.halfWidth, near: VIDEOS_ROOM.nearZ, far: VIDEOS_ROOM.farZ },
    // Empty former game room: included for map scale, intentionally unlabeled.
    { label: '', left: EMPTY_GAME_ROOM.centerX - EMPTY_GAME_ROOM.halfWidth, right: EMPTY_GAME_ROOM.centerX + EMPTY_GAME_ROOM.halfWidth, near: EMPTY_GAME_ROOM.nearZ, far: EMPTY_GAME_ROOM.farZ },
    { label: 'Art', left: ART_ROOM.centerX - ART_ROOM.halfWidth, right: ART_ROOM.centerX + ART_ROOM.halfWidth, near: ART_ROOM.nearZ, far: ART_ROOM.farZ }
  ];
  const minX = Math.min(...rooms.map((room) => room.left));
  const maxX = Math.max(...rooms.map((room) => room.right));
  const minZ = Math.min(...rooms.map((room) => room.near));
  const maxZ = Math.max(...rooms.map((room) => room.far));
  const padding = 72;
  const scale = Math.min(
    (canvas.width - padding * 2) / (maxX - minX),
    (canvas.height - padding * 2) / (maxZ - minZ)
  );
  const toCanvas = (x, z) => ({
    x: padding + (x - minX) * scale,
    y: padding + (z - minZ) * scale
  });

  context.strokeStyle = '#101214';
  context.fillStyle = '#101214';
  context.lineWidth = 9;
  context.lineJoin = 'miter';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const gameDoorCenterZ = (GAME_ROOM.nearZ + GAME_ROOM.farZ) / 2 + GAME_ROOM.doorOffsetZ;
  const oldGameDoorCenterZ = (EMPTY_GAME_ROOM.nearZ + EMPTY_GAME_ROOM.farZ) / 2 + EMPTY_GAME_ROOM.doorOffsetZ;
  const appDoorHalfWidth = APP_ROOM.doorWidth / 2;
  const screeningDoorHalfWidth = SCREENING_ROOM.doorWidth / 2;
  const artDoorCenter = ART_ROOM.centerX + ART_ROOM.doorOffsetX;
  const artDoorHalfWidth = ART_ROOM.doorWidth / 2;
  const corridors = [
    // Research → App and Research → Defense
    { left: APP_ROOM.centerX - appDoorHalfWidth, right: APP_ROOM.centerX + appDoorHalfWidth, near: ROOM.halfDepth, far: APP_ROOM.nearZ },
    { left: SCREENING_ROOM.centerX - screeningDoorHalfWidth, right: SCREENING_ROOM.centerX + screeningDoorHalfWidth, near: ROOM.halfDepth, far: SCREENING_ROOM.nearZ },
    // App → Art
    { left: artDoorCenter - artDoorHalfWidth, right: artDoorCenter + artDoorHalfWidth, near: APP_ROOM.farZ, far: ART_ROOM.nearZ },
    // App → Game (new west-side room)
    { left: GAME_ROOM.centerX + GAME_ROOM.halfWidth, right: APP_ROOM.centerX - APP_ROOM.halfWidth, near: gameDoorCenterZ - GAME_ROOM.doorWidth / 2, far: gameDoorCenterZ + GAME_ROOM.doorWidth / 2 },
    // App → the former (empty) game room
    { left: APP_ROOM.centerX + APP_ROOM.halfWidth, right: EMPTY_GAME_ROOM.centerX - EMPTY_GAME_ROOM.halfWidth, near: oldGameDoorCenterZ - EMPTY_GAME_ROOM.doorWidth / 2, far: oldGameDoorCenterZ + EMPTY_GAME_ROOM.doorWidth / 2 },
    // Game → Videos
    { left: GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2, right: GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2, near: VIDEOS_ROOM.farZ, far: GAME_ROOM.nearZ },
    // Defense → Brain
    { left: SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth, right: BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth, near: BRAIN_HALL_NORTH_EDGE, far: BRAIN_HALL_SOUTH_EDGE }
  ];
  corridors.forEach((corridor) => {
    const topLeft = toCanvas(corridor.left, corridor.near);
    const bottomRight = toCanvas(corridor.right, corridor.far);
    context.strokeRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );
  });

  rooms.forEach((room) => {
    const topLeft = toCanvas(room.left, room.near);
    const bottomRight = toCanvas(room.right, room.far);
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;
    context.strokeRect(topLeft.x, topLeft.y, width, height);

    const labelSize = Math.max(34, Math.min(64, Math.min(width * 0.24, height * 0.22)));
    context.font = `500 ${labelSize}px Arial, Helvetica, sans-serif`;
    context.fillText(room.label, topLeft.x + width / 2, topLeft.y + height / 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const mapHeight = 5.35;
  const mapWidth = mapHeight * ((maxX - minX) / (maxZ - minZ));
  const entryDoorLeft = APP_ROOM.centerX - APP_ROOM.doorWidth / 2;
  const map = new THREE.Mesh(new THREE.PlaneGeometry(mapWidth, mapHeight), material);
  // Put the plan on the opposite (entry) wall, in the blank section left of its door.
  const roomLeft = APP_ROOM.centerX - APP_ROOM.halfWidth;
  const blankSectionCenter = roomLeft + (entryDoorLeft - roomLeft) / 2;
  map.position.set(blankSectionCenter, APP_ROOM.height / 2 + 0.08, APP_ROOM.nearZ + 0.1);
  map.rotation.y = 0;
  map.renderOrder = 6;
  scene.add(map);
}

function createAppRoom() {
  const doorLeft = APP_ROOM.centerX - APP_ROOM.doorWidth / 2;
  const doorRight = APP_ROOM.centerX + APP_ROOM.doorWidth / 2;
  const roomLeft = APP_ROOM.centerX - APP_ROOM.halfWidth;
  const roomRight = APP_ROOM.centerX + APP_ROOM.halfWidth;
  const artDoorCenter = ART_ROOM.centerX + ART_ROOM.doorOffsetX;
  const artDoorLeft = artDoorCenter - ART_ROOM.doorWidth / 2;
  const artDoorRight = artDoorCenter + ART_ROOM.doorWidth / 2;
  const floorStartZ = ROOM.halfDepth;
  const floorLength = APP_ROOM.nearZ - floorStartZ;
  const wallStartZ = ROOM.halfDepth + 0.08;
  const wallEndZ = APP_ROOM.nearZ - 0.14;
  const wallLength = wallEndZ - wallStartZ;
  const roomDepth = APP_ROOM.farZ - APP_ROOM.nearZ;
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe9e9e6, roughness: 0.96, metalness: 0 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbfc1bf, roughness: 1, metalness: 0 });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf0efeb, roughness: 1, metalness: 0 });
  const artPortalMaterial = new THREE.MeshBasicMaterial({
    color: ART_PORTAL_COLOR,
    toneMapped: false,
    side: THREE.DoubleSide
  });

  const hallFloor = new THREE.Mesh(new THREE.BoxGeometry(APP_ROOM.doorWidth, 0.08, floorLength), floorMaterial);
  hallFloor.position.set(APP_ROOM.centerX, -0.04, floorStartZ + floorLength / 2);
  scene.add(hallFloor);

  const hallCeiling = new THREE.Mesh(new THREE.BoxGeometry(APP_ROOM.doorWidth + 0.12, 0.08, wallLength), ceilingMaterial);
  hallCeiling.position.set(APP_ROOM.centerX, APP_ROOM.doorHeight, wallStartZ + wallLength / 2);
  scene.add(hallCeiling);

  const hallWallGeometry = new THREE.BoxGeometry(ROOM_WALL_THICKNESS, APP_ROOM.doorHeight, wallLength);
  const leftHallWall = new THREE.Mesh(hallWallGeometry, wallMaterial);
  leftHallWall.position.set(doorLeft - ROOM_WALL_THICKNESS / 2, APP_ROOM.doorHeight / 2, wallStartZ + wallLength / 2);
  scene.add(leftHallWall);

  const rightHallWall = leftHallWall.clone();
  rightHallWall.position.x = doorRight + ROOM_WALL_THICKNESS / 2;
  scene.add(rightHallWall);

  const roomFloor = new THREE.Mesh(new THREE.BoxGeometry(APP_ROOM.halfWidth * 2, 0.1, roomDepth), floorMaterial);
  roomFloor.position.set(APP_ROOM.centerX, -0.05, APP_ROOM.nearZ + roomDepth / 2);
  scene.add(roomFloor);

  const roomCeiling = new THREE.Mesh(new THREE.BoxGeometry(APP_ROOM.halfWidth * 2, 0.1, roomDepth), ceilingMaterial);
  roomCeiling.position.set(APP_ROOM.centerX, APP_ROOM.height, APP_ROOM.nearZ + roomDepth / 2);
  scene.add(roomCeiling);

  // Open the west wall directly opposite the former game-room doorway for
  // the new, mirrored game room. The app content is moved to the east wall.
  const newGameDoorCenterZ = (GAME_ROOM.nearZ + GAME_ROOM.farZ) / 2 + GAME_ROOM.doorOffsetZ;
  const newGameDoorNorthZ = newGameDoorCenterZ - GAME_ROOM.doorWidth / 2;
  const newGameDoorSouthZ = newGameDoorCenterZ + GAME_ROOM.doorWidth / 2;
  const westNorthDepth = newGameDoorNorthZ - APP_ROOM.nearZ;
  const westSouthDepth = APP_ROOM.farZ - newGameDoorSouthZ;
  const westNorthWall = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, APP_ROOM.height, westNorthDepth),
    wallMaterial
  );
  westNorthWall.position.set(roomLeft - ROOM_WALL_THICKNESS / 2, APP_ROOM.height / 2, APP_ROOM.nearZ + westNorthDepth / 2);
  scene.add(westNorthWall);
  const westSouthWall = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, APP_ROOM.height, westSouthDepth),
    wallMaterial
  );
  westSouthWall.position.set(roomLeft - ROOM_WALL_THICKNESS / 2, APP_ROOM.height / 2, newGameDoorSouthZ + westSouthDepth / 2);
  scene.add(westSouthWall);
  const westDoorHeaderHeight = APP_ROOM.height - GAME_ROOM.doorHeight;
  const westDoorHeader = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, westDoorHeaderHeight, GAME_ROOM.doorWidth),
    wallMaterial
  );
  westDoorHeader.position.set(
    roomLeft - ROOM_WALL_THICKNESS / 2,
    GAME_ROOM.doorHeight + westDoorHeaderHeight / 2,
    newGameDoorCenterZ
  );
  scene.add(westDoorHeader);

  // The former game room remains reachable through a second doorway on the
  // App room's east wall, placed near the Art-room end of the wall.
  const oldGameDoorCenterZ = (EMPTY_GAME_ROOM.nearZ + EMPTY_GAME_ROOM.farZ) / 2 + EMPTY_GAME_ROOM.doorOffsetZ;
  const oldGameDoorNorthZ = oldGameDoorCenterZ - EMPTY_GAME_ROOM.doorWidth / 2;
  const oldGameDoorSouthZ = oldGameDoorCenterZ + EMPTY_GAME_ROOM.doorWidth / 2;
  const eastNorthDepth = oldGameDoorNorthZ - APP_ROOM.nearZ;
  const eastSouthDepth = APP_ROOM.farZ - oldGameDoorSouthZ;
  const eastNorthWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WALL_THICKNESS, APP_ROOM.height, eastNorthDepth), wallMaterial);
  eastNorthWall.position.set(roomRight + ROOM_WALL_THICKNESS / 2, APP_ROOM.height / 2, APP_ROOM.nearZ + eastNorthDepth / 2);
  scene.add(eastNorthWall);
  const eastSouthWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WALL_THICKNESS, APP_ROOM.height, eastSouthDepth), wallMaterial);
  eastSouthWall.position.set(roomRight + ROOM_WALL_THICKNESS / 2, APP_ROOM.height / 2, oldGameDoorSouthZ + eastSouthDepth / 2);
  scene.add(eastSouthWall);
  const eastDoorHeaderHeight = APP_ROOM.height - EMPTY_GAME_ROOM.doorHeight;
  const eastDoorHeader = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, eastDoorHeaderHeight, EMPTY_GAME_ROOM.doorWidth),
    wallMaterial
  );
  eastDoorHeader.position.set(
    roomRight + ROOM_WALL_THICKNESS / 2,
    EMPTY_GAME_ROOM.doorHeight + eastDoorHeaderHeight / 2,
    oldGameDoorCenterZ
  );
  scene.add(eastDoorHeader);

  const nearLeftWidth = doorLeft - roomLeft;
  const nearLeftWall = new THREE.Mesh(new THREE.BoxGeometry(nearLeftWidth, APP_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  nearLeftWall.position.set(roomLeft + nearLeftWidth / 2, APP_ROOM.height / 2, APP_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearLeftWall);

  const nearRightWidth = roomRight - doorRight;
  const nearRightWall = new THREE.Mesh(new THREE.BoxGeometry(nearRightWidth, APP_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  nearRightWall.position.set(doorRight + nearRightWidth / 2, APP_ROOM.height / 2, APP_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearRightWall);

  const nearHeaderHeight = APP_ROOM.height - APP_ROOM.doorHeight;
  const nearHeader = new THREE.Mesh(new THREE.BoxGeometry(APP_ROOM.doorWidth, nearHeaderHeight, ROOM_WALL_THICKNESS), wallMaterial);
  nearHeader.position.set(APP_ROOM.centerX, APP_ROOM.doorHeight + nearHeaderHeight / 2, APP_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearHeader);

  const farLeftWidth = artDoorLeft - roomLeft;
  const farLeftWall = new THREE.Mesh(new THREE.BoxGeometry(farLeftWidth, APP_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  farLeftWall.position.set(roomLeft + farLeftWidth / 2, APP_ROOM.height / 2, APP_ROOM.farZ + ROOM_WALL_THICKNESS / 2);
  scene.add(farLeftWall);

  const farRightWidth = roomRight - artDoorRight;
  const farRightWall = new THREE.Mesh(new THREE.BoxGeometry(farRightWidth, APP_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  farRightWall.position.set(artDoorRight + farRightWidth / 2, APP_ROOM.height / 2, APP_ROOM.farZ + ROOM_WALL_THICKNESS / 2);
  scene.add(farRightWall);

  const jambDepth = 0.2;
  const leftPortalJamb = new THREE.Mesh(
    new THREE.PlaneGeometry(jambDepth, APP_ROOM.height),
    artPortalMaterial
  );
  leftPortalJamb.position.set(artDoorLeft + 0.002, APP_ROOM.height / 2, APP_ROOM.farZ + jambDepth / 2);
  leftPortalJamb.rotation.y = Math.PI / 2;
  scene.add(leftPortalJamb);

  const rightPortalJamb = leftPortalJamb.clone();
  rightPortalJamb.position.x = artDoorRight - 0.002;
  rightPortalJamb.rotation.y = -Math.PI / 2;
  scene.add(rightPortalJamb);

  const portalEdgeWidth = 0.3;
  [artDoorLeft - portalEdgeWidth / 2, artDoorRight + portalEdgeWidth / 2].forEach((x) => {
    const portalEdge = new THREE.Mesh(
      new THREE.PlaneGeometry(portalEdgeWidth, APP_ROOM.height),
      artPortalMaterial
    );
    portalEdge.position.set(x, APP_ROOM.height / 2, APP_ROOM.farZ - 0.075);
    portalEdge.rotation.y = Math.PI;
    portalEdge.renderOrder = 1;
    scene.add(portalEdge);
  });

  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [13, 17, 21, 25, 29, 33].forEach((z) => {
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(12, 0.025, 0.09), lightMaterial);
    lightStrip.position.set(APP_ROOM.centerX, APP_ROOM.height - 0.08, z);
    scene.add(lightStrip);
  });

  addRoomHeading('CVSView', [roomRight - 0.14, 5.1, CVS_GROUP_CENTER_Z], -Math.PI / 2, 3.2, 170);
  addRoomCaption(
    'A review tool for evaluating the central vein sign and paramagnetic rim lesions on co-registered MRI.',
    [roomRight - 0.14, 0.5, CVS_GROUP_CENTER_Z],
    -Math.PI / 2,
    9.1
  );
  addRoomHeading('LesionView', [roomRight - 0.14, 5.1, LESION_GROUP_CENTER_Z], -Math.PI / 2, 3.6, 170);
  addRoomCaption(
    'A longitudinal MRI workspace for segmenting, comparing, and verifying multiple sclerosis lesions.',
    [roomRight - 0.14, 0.5, LESION_GROUP_CENTER_Z],
    -Math.PI / 2,
    9.1
  );
  addRoomHeading('MyPhysio', [roomLeft + 0.14, 5.245, 20.75], Math.PI / 2, 3.6, 170);
  addRoomCaption(
    'A patient-and-clinician platform for guided exercise, symptom tracking, and rehabilitation progress.',
    [roomLeft + 0.14, 0.44, 20.75],
    Math.PI / 2,
    10.5
  );
  addArtPortalGraphic(roomLeft, roomRight);
}

function createGameRoomShell(room, doorSide) {
  const appWest = APP_ROOM.centerX - APP_ROOM.halfWidth;
  const appEast = APP_ROOM.centerX + APP_ROOM.halfWidth;
  const roomWest = room.centerX - room.halfWidth;
  const roomEast = room.centerX + room.halfWidth;
  const roomDepth = room.farZ - room.nearZ;
  const roomCenterZ = (room.nearZ + room.farZ) / 2;
  const doorCenterZ = roomCenterZ + (room.doorOffsetZ || 0);
  const doorNorthZ = doorCenterZ - room.doorWidth / 2;
  const doorSouthZ = doorCenterZ + room.doorWidth / 2;
  const northDoorX = room.northDoorX
    ?? (room === GAME_ROOM ? GAME_VIDEOS_HALL_DOOR_X : room.centerX);
  const southDoorX = room.southDoorX ?? room.centerX;
  const hasWestDoor = doorSide === 'west' || doorSide === 'north-west';
  const hasEastDoor = doorSide === 'east' || doorSide === 'east-north';
  const hasNorthDoor = doorSide === 'north' || doorSide === 'north-west' || doorSide === 'east-north';
  const hasSouthDoor = doorSide === 'south';
  const appCorridorLength = hasWestDoor
    ? roomWest - appEast
    : hasEastDoor
      ? appWest - roomEast
      : 0;
  const appCorridorCenterX = hasWestDoor
    ? appEast + appCorridorLength / 2
    : appWest - appCorridorLength / 2;
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: room === EMPTY_GAME_ROOM ? 0x000000 : 0x171a1c,
    roughness: 1,
    metalness: 0
  });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.98, metalness: 0 });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0 });
  const corridorWallMaterial = new THREE.MeshStandardMaterial({ color: 0xe9e9e6, roughness: 0.96, metalness: 0 });
  const corridorFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xbfc1bf, roughness: 1, metalness: 0 });
  const corridorCeilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf0efeb, roughness: 1, metalness: 0 });

  if (appCorridorLength > 0) {
    const corridorStartX = appCorridorCenterX - appCorridorLength / 2;
    const corridorEndX = appCorridorCenterX + appCorridorLength / 2;
    const corridorMidX = (corridorStartX + corridorEndX) / 2;
    const hasRoomTransition = (room === EMPTY_GAME_ROOM || room === GAME_ROOM)
      && (hasWestDoor || hasEastDoor);
    const corridorSegments = hasRoomTransition
      ? hasWestDoor
        ? [
          {
            startX: corridorStartX,
            endX: corridorMidX,
            wallMaterial: corridorWallMaterial,
            floorMaterial: corridorFloorMaterial,
            ceilingMaterial: corridorCeilingMaterial
          },
          {
            startX: corridorMidX,
            endX: corridorEndX,
            wallMaterial,
            floorMaterial,
            ceilingMaterial
          }
        ]
        : [
          {
            startX: corridorStartX,
            endX: corridorMidX,
            wallMaterial,
            floorMaterial,
            ceilingMaterial
          },
          {
            startX: corridorMidX,
            endX: corridorEndX,
            wallMaterial: corridorWallMaterial,
            floorMaterial: corridorFloorMaterial,
            ceilingMaterial: corridorCeilingMaterial
          }
        ]
      : [{
        startX: corridorStartX,
        endX: corridorEndX,
        wallMaterial: corridorWallMaterial,
        floorMaterial: corridorFloorMaterial,
        ceilingMaterial: corridorCeilingMaterial
      }];
    corridorSegments.forEach((segment) => {
      const segmentLength = segment.endX - segment.startX;
      const segmentCenterX = (segment.startX + segment.endX) / 2;
      const corridorFloor = new THREE.Mesh(new THREE.BoxGeometry(segmentLength, 0.08, room.doorWidth), segment.floorMaterial);
      corridorFloor.position.set(segmentCenterX, -0.04, doorCenterZ);
      scene.add(corridorFloor);
      const corridorCeiling = new THREE.Mesh(new THREE.BoxGeometry(segmentLength, 0.08, room.doorWidth + 0.12), segment.ceilingMaterial);
      corridorCeiling.position.set(segmentCenterX, room.doorHeight, doorCenterZ);
      scene.add(corridorCeiling);
      [doorNorthZ - ROOM_WALL_THICKNESS / 2, doorSouthZ + ROOM_WALL_THICKNESS / 2].forEach((z) => {
        const corridorWall = new THREE.Mesh(new THREE.BoxGeometry(segmentLength, room.doorHeight, ROOM_WALL_THICKNESS), segment.wallMaterial);
        corridorWall.position.set(segmentCenterX, room.doorHeight / 2, z);
        scene.add(corridorWall);
      });
    });
  }
  if (hasNorthDoor && !room.openNorth) {
    const northCorridorEndZ = room.northHallEndZ ?? (room === GAME_ROOM ? VIDEOS_ROOM.farZ : BRAIN_ROOM.farZ);
    const brainCorridorLength = room.nearZ - northCorridorEndZ;
    const brainCorridorCenterZ = northCorridorEndZ + brainCorridorLength / 2;
    const corridorFloor = new THREE.Mesh(new THREE.BoxGeometry(room.doorWidth, 0.08, brainCorridorLength), floorMaterial);
    corridorFloor.position.set(northDoorX, -0.04, brainCorridorCenterZ);
    scene.add(corridorFloor);
    const corridorCeiling = new THREE.Mesh(new THREE.BoxGeometry(room.doorWidth + 0.12, 0.08, brainCorridorLength), ceilingMaterial);
    corridorCeiling.position.set(northDoorX, room.doorHeight, brainCorridorCenterZ);
    scene.add(corridorCeiling);
    [northDoorX - room.doorWidth / 2 - ROOM_WALL_THICKNESS / 2, northDoorX + room.doorWidth / 2 + ROOM_WALL_THICKNESS / 2].forEach((x) => {
      const corridorWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WALL_THICKNESS, room.doorHeight, brainCorridorLength), wallMaterial);
      corridorWall.position.set(x, room.doorHeight / 2, brainCorridorCenterZ);
      scene.add(corridorWall);
    });
  }

  const floor = new THREE.Mesh(new THREE.BoxGeometry(room.halfWidth * 2, 0.1, roomDepth), floorMaterial);
  floor.position.set(room.centerX, -0.05, roomCenterZ);
  scene.add(floor);
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(room.halfWidth * 2, 0.1, roomDepth), ceilingMaterial);
  ceiling.position.set(room.centerX, room.height, roomCenterZ);
  scene.add(ceiling);

  const addFullSideWall = (x) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WALL_THICKNESS, room.height, roomDepth), wallMaterial);
    wall.position.set(x, room.height / 2, roomCenterZ);
    scene.add(wall);
  };
  const addDoorSideWall = (x, thickness = ROOM_WALL_THICKNESS) => {
    const northDepth = doorNorthZ - room.nearZ;
    const southDepth = room.farZ - doorSouthZ;
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(thickness, room.height, northDepth), wallMaterial);
    northWall.position.set(x, room.height / 2, room.nearZ + northDepth / 2);
    scene.add(northWall);
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(thickness, room.height, southDepth), wallMaterial);
    southWall.position.set(x, room.height / 2, doorSouthZ + southDepth / 2);
    scene.add(southWall);
    const headerHeight = room.height - room.doorHeight;
    const header = new THREE.Mesh(new THREE.BoxGeometry(thickness, headerHeight, room.doorWidth), wallMaterial);
    header.position.set(x, room.doorHeight + headerHeight / 2, doorCenterZ);
    scene.add(header);
  };
  const addNorthDoorWall = () => {
    const northDoorLeft = northDoorX - room.doorWidth / 2;
    const northDoorRight = northDoorX + room.doorWidth / 2;
    const leftWidth = northDoorLeft - roomWest;
    const rightWidth = roomEast - northDoorRight;
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(leftWidth, room.height, ROOM_WALL_THICKNESS), wallMaterial);
    leftWall.position.set(roomWest + leftWidth / 2, room.height / 2, room.nearZ - ROOM_WALL_THICKNESS / 2);
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(rightWidth, room.height, ROOM_WALL_THICKNESS), wallMaterial);
    rightWall.position.set(northDoorRight + rightWidth / 2, room.height / 2, room.nearZ - ROOM_WALL_THICKNESS / 2);
    scene.add(rightWall);
    const headerHeight = room.height - room.doorHeight;
    const header = new THREE.Mesh(new THREE.BoxGeometry(room.doorWidth, headerHeight, ROOM_WALL_THICKNESS), wallMaterial);
    header.position.set(northDoorX, room.doorHeight + headerHeight / 2, room.nearZ - ROOM_WALL_THICKNESS / 2);
    scene.add(header);
  };
  const addSouthDoorWall = () => {
    const southDoorLeft = southDoorX - room.doorWidth / 2;
    const southDoorRight = southDoorX + room.doorWidth / 2;
    const leftWidth = southDoorLeft - roomWest;
    const rightWidth = roomEast - southDoorRight;
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(leftWidth, room.height, ROOM_WALL_THICKNESS), wallMaterial);
    leftWall.position.set(roomWest + leftWidth / 2, room.height / 2, room.farZ + ROOM_WALL_THICKNESS / 2);
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(rightWidth, room.height, ROOM_WALL_THICKNESS), wallMaterial);
    rightWall.position.set(southDoorRight + rightWidth / 2, room.height / 2, room.farZ + ROOM_WALL_THICKNESS / 2);
    scene.add(rightWall);
    const headerHeight = room.height - room.doorHeight;
    const header = new THREE.Mesh(new THREE.BoxGeometry(room.doorWidth, headerHeight, ROOM_WALL_THICKNESS), wallMaterial);
    header.position.set(southDoorX, room.doorHeight + headerHeight / 2, room.farZ + ROOM_WALL_THICKNESS / 2);
    scene.add(header);
  };
  if (hasWestDoor) {
    const thickness = ROOM_WALL_THICKNESS;
    addDoorSideWall(roomWest - thickness / 2, thickness);
  }
  else addFullSideWall(roomWest - ROOM_WALL_THICKNESS / 2);
  if (hasEastDoor) addDoorSideWall(roomEast + ROOM_WALL_THICKNESS / 2);
  else addFullSideWall(roomEast + ROOM_WALL_THICKNESS / 2);

  if (hasNorthDoor && !room.openNorth) addNorthDoorWall();
  else if (!room.openNorth) {
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(room.halfWidth * 2, room.height, ROOM_WALL_THICKNESS), wallMaterial);
    northWall.position.set(room.centerX, room.height / 2, room.nearZ - ROOM_WALL_THICKNESS / 2);
    scene.add(northWall);
  }
  if (hasSouthDoor) addSouthDoorWall();
  else {
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(room.halfWidth * 2, room.height, ROOM_WALL_THICKNESS), wallMaterial);
    southWall.position.set(room.centerX, room.height / 2, room.farZ + ROOM_WALL_THICKNESS / 2);
    scene.add(southWall);
  }

  // The MRI room is intentionally almost black. A low, continuous black
  // baseboard hides the light seam where its dark walls meet the floor while
  // preserving the west doorway and the open Brain-room connection.
  if (room === EMPTY_GAME_ROOM) {
    const baseboardMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0 });
    const baseHeight = 0.16;
    const baseDepth = 0.10;
    const addHorizontalBaseboard = (start, end, z) => {
      if (end <= start) return;
      const base = new THREE.Mesh(new THREE.BoxGeometry(end - start, baseHeight, baseDepth), baseboardMaterial);
      base.position.set((start + end) / 2, baseHeight / 2, z);
      scene.add(base);
    };
    const addVerticalBaseboard = (start, end, x) => {
      if (end <= start) return;
      const base = new THREE.Mesh(new THREE.BoxGeometry(baseDepth, baseHeight, end - start), baseboardMaterial);
      base.position.set(x, baseHeight / 2, (start + end) / 2);
      scene.add(base);
    };
    addHorizontalBaseboard(roomWest, roomEast, room.farZ - 0.02);
    addVerticalBaseboard(room.nearZ, doorNorthZ, roomWest + 0.02);
    addVerticalBaseboard(doorSouthZ, room.farZ, roomWest + 0.02);
    addVerticalBaseboard(room.nearZ, room.farZ, roomEast - 0.02);
    const brainRoomWest = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
    addHorizontalBaseboard(roomWest, brainRoomWest, room.nearZ + 0.02);
  }

  const stripMaterial = new THREE.MeshBasicMaterial({ color: 0x9fb6bd, toneMapped: false });
  [-1.55, 1.55].forEach((offsetX) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.025, 0.065), stripMaterial);
    strip.position.set(room.centerX + offsetX, room.height - 0.08, roomCenterZ);
    scene.add(strip);
  });
  const roomLight = new THREE.PointLight(0xc8d7dc, 12, 8, 2);
  roomLight.position.set(room.centerX, room.height - 0.7, roomCenterZ);
  scene.add(roomLight);
}

function createGameRoom() {
  // Keep the former game-room shell empty; it now has both App and Brain
  // connections, while the active displays remain in the mirrored west room.
  createGameRoomShell(EMPTY_GAME_ROOM, 'north-west');
  createGameRoomShell(GAME_ROOM, 'east-north');
  createGameRoomShell(VIDEOS_ROOM, 'south');
}

function addGameWallSheet(sheet, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = sheet.width / sheet.aspect;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.015,
    depthWrite: false,
    toneMapped: false
  });
  const artwork = new THREE.Mesh(new THREE.PlaneGeometry(sheet.width, height), material);
  artwork.position.y = GAME_ROOM.height / 2;

  const roomLeft = GAME_ROOM.centerX - GAME_ROOM.halfWidth;
  const roomCenterZ = (GAME_ROOM.nearZ + GAME_ROOM.farZ) / 2;
  const group = new THREE.Group();
  if (sheet.side === 'south') {
    group.position.set(GAME_ROOM.centerX, 0, GAME_ROOM.farZ - 0.075);
    group.rotation.y = Math.PI;
  } else {
    group.position.set(roomLeft + 0.075, 0, roomCenterZ);
    group.rotation.y = Math.PI / 2;
  }
  group.add(artwork);
  scene.add(group);
  needsRender = true;
}

function createGameWallSheets(textureLoader) {
  GAME_WALL_SHEETS.forEach((sheet) => {
    textureLoader.load(sheet.image, (texture) => addGameWallSheet(sheet, texture));
  });
}

function addArtPortalGraphic(roomLeft, roomRight) {
  const wallWidth = roomRight - roomLeft;
  const wallHeight = APP_ROOM.height;
  const pixelsPerMeter = 200;
  const graphicCanvas = document.createElement('canvas');
  graphicCanvas.width = Math.round(wallWidth * pixelsPerMeter);
  graphicCanvas.height = Math.round(wallHeight * pixelsPerMeter);
  const context = graphicCanvas.getContext('2d');
  context.clearRect(0, 0, graphicCanvas.width, graphicCanvas.height);
  context.fillStyle = ART_PORTAL_CSS_COLOR;
  context.font = '900 1000px "Arial Black", Arial, Helvetica, sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';

  const cellWidth = graphicCanvas.width / 3;
  ['A', 'R', 'T'].forEach((letter, index) => {
    const metrics = context.measureText(letter);
    const glyphLeft = metrics.actualBoundingBoxLeft || 0;
    const glyphWidth = glyphLeft + (metrics.actualBoundingBoxRight || metrics.width);
    const glyphAscent = metrics.actualBoundingBoxAscent ?? 800;
    const glyphHeight = glyphAscent + (metrics.actualBoundingBoxDescent ?? 200);
    context.save();
    const shiftX = letter === 'R' ? ART_R_SHIFT_X * pixelsPerMeter : 0;
    context.translate(index * cellWidth + shiftX, 0);
    context.scale(cellWidth / glyphWidth, graphicCanvas.height / glyphHeight);
    context.fillText(letter, glyphLeft, glyphAscent);
    context.restore();
  });

  const clearOpening = (bottom, top, width) => {
    const padding = 0;
    const doorCenterPixels = (ART_ROOM.centerX + ART_ROOM.doorOffsetX - roomLeft) * pixelsPerMeter;
    const openingX = doorCenterPixels - width * pixelsPerMeter / 2 - padding;
    const openingY = (wallHeight - top) * pixelsPerMeter - padding;
    const openingWidth = width * pixelsPerMeter + padding * 2;
    const openingHeight = (top - bottom) * pixelsPerMeter + padding * 2;
    context.clearRect(openingX, openingY, openingWidth, openingHeight);
  };
  clearOpening(0, wallHeight, ART_ROOM.doorWidth);

  const graphicTexture = new THREE.CanvasTexture(graphicCanvas);
  graphicTexture.colorSpace = THREE.SRGBColorSpace;
  graphicTexture.minFilter = THREE.LinearMipmapLinearFilter;
  graphicTexture.magFilter = THREE.LinearFilter;
  graphicTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const graphicMaterial = new THREE.MeshBasicMaterial({
    map: graphicTexture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const graphic = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), graphicMaterial);
  graphic.position.set(APP_ROOM.centerX, wallHeight / 2, APP_ROOM.farZ - 0.08);
  graphic.rotation.y = Math.PI;
  graphic.renderOrder = 2;
  scene.add(graphic);

}

function createHomeFloorArrow() {
  const halfLength = HOME_FLOOR_ARROW.length / 2;
  const halfShaft = HOME_FLOOR_ARROW.shaftWidth / 2;
  const halfHead = HOME_FLOOR_ARROW.headWidth / 2;
  const headBaseY = -halfLength * 0.16;
  const arrowShape = new THREE.Shape();
  // The shape points toward local -Y. After it is laid flat, that direction
  // becomes local +Z and can be aimed with a single world-space yaw.
  arrowShape.moveTo(-halfShaft, halfLength);
  arrowShape.lineTo(halfShaft, halfLength);
  arrowShape.lineTo(halfShaft, headBaseY);
  arrowShape.lineTo(halfHead, headBaseY);
  arrowShape.lineTo(0, -halfLength);
  arrowShape.lineTo(-halfHead, headBaseY);
  arrowShape.lineTo(-halfShaft, headBaseY);
  arrowShape.closePath();

  const geometry = new THREE.ShapeGeometry(arrowShape);
  geometry.rotateX(-Math.PI / 2);

  const arrow = new THREE.Group();
  const fill = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x176789, toneMapped: false, side: THREE.DoubleSide })
  );
  fill.renderOrder = 3;
  arrow.add(fill);

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512;
  labelCanvas.height = 256;
  const labelContext = labelCanvas.getContext('2d');
  labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  labelContext.fillStyle = '#aaa397';
  labelContext.font = '700 220px Arial, Helvetica, sans-serif';
  labelContext.textAlign = 'center';
  labelContext.textBaseline = 'middle';
  // This floor label is read from the back of its double-sided plane after
  // the arrow is aimed at the portal, so pre-mirror it to remain legible.
  labelContext.translate(labelCanvas.width, 0);
  labelContext.scale(-1, 1);
  labelContext.fillText('Run', labelCanvas.width / 2, labelCanvas.height / 2 + 8);

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.minFilter = THREE.LinearMipmapLinearFilter;
  labelTexture.magFilter = THREE.LinearFilter;
  labelTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const labelGeometry = new THREE.PlaneGeometry(HOME_FLOOR_ARROW.shaftWidth * 0.94, 0.29);
  labelGeometry.rotateX(Math.PI / 2);
  const label = new THREE.Mesh(
    labelGeometry,
    new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide
    })
  );
  label.position.set(0, 0.004, -halfLength * 0.68);
  label.renderOrder = 4;
  arrow.add(label);

  const directionX = HOME_FLOOR_ARROW.targetX - HOME_FLOOR_ARROW.x;
  const directionZ = HOME_PORTAL.z - HOME_FLOOR_ARROW.z;
  arrow.position.set(HOME_FLOOR_ARROW.x, 0.012, HOME_FLOOR_ARROW.z);
  arrow.rotation.y = Math.atan2(directionX, directionZ);
  scene.add(arrow);
}

function createArtRoom() {
  const doorCenter = ART_ROOM.centerX + ART_ROOM.doorOffsetX;
  const doorLeft = doorCenter - ART_ROOM.doorWidth / 2;
  const doorRight = doorCenter + ART_ROOM.doorWidth / 2;
  const roomLeft = ART_ROOM.centerX - ART_ROOM.halfWidth;
  const roomRight = ART_ROOM.centerX + ART_ROOM.halfWidth;
  const floorStartZ = APP_ROOM.farZ;
  const floorLength = ART_ROOM.nearZ - floorStartZ;
  const wallStartZ = APP_ROOM.farZ + 0.14;
  const wallEndZ = ART_ROOM.nearZ - 0.14;
  const wallLength = wallEndZ - wallStartZ;
  const roomDepth = ART_ROOM.farZ - ART_ROOM.nearZ;
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeae2, roughness: 0.98, metalness: 0 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: ART_ROOM_FLOOR_COLOR, roughness: 1, metalness: 0 });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf2eee7, roughness: 1, metalness: 0 });
  const portalWallMaterial = new THREE.MeshBasicMaterial({ color: ART_PORTAL_COLOR, toneMapped: false });

  const hallFloor = new THREE.Mesh(new THREE.BoxGeometry(ART_ROOM.doorWidth, 0.08, floorLength), floorMaterial);
  hallFloor.position.set(doorCenter, -0.04, floorStartZ + floorLength / 2);
  scene.add(hallFloor);

  const hallCeiling = new THREE.Mesh(new THREE.BoxGeometry(ART_ROOM.doorWidth + 0.12, 0.08, wallLength), ceilingMaterial);
  hallCeiling.position.set(doorCenter, ART_ROOM.height, wallStartZ + wallLength / 2);
  scene.add(hallCeiling);

  const hallWallGeometry = new THREE.BoxGeometry(ROOM_WALL_THICKNESS, ART_ROOM.height, wallLength);
  const leftHallWall = new THREE.Mesh(hallWallGeometry, portalWallMaterial);
  leftHallWall.position.set(doorLeft - ROOM_WALL_THICKNESS / 2, ART_ROOM.height / 2, wallStartZ + wallLength / 2);
  scene.add(leftHallWall);

  const rightHallWall = leftHallWall.clone();
  rightHallWall.position.x = doorRight + ROOM_WALL_THICKNESS / 2;
  scene.add(rightHallWall);

  const roomFloor = new THREE.Mesh(new THREE.BoxGeometry(ART_ROOM.halfWidth * 2, 0.1, roomDepth), floorMaterial);
  roomFloor.position.set(ART_ROOM.centerX, -0.05, ART_ROOM.nearZ + roomDepth / 2);
  scene.add(roomFloor);
  createHomeFloorArrow();

  const roomCeiling = new THREE.Mesh(new THREE.BoxGeometry(ART_ROOM.halfWidth * 2, 0.1, roomDepth), ceilingMaterial);
  roomCeiling.position.set(ART_ROOM.centerX, ART_ROOM.height, ART_ROOM.nearZ + roomDepth / 2);
  scene.add(roomCeiling);

  const roomSideGeometry = new THREE.BoxGeometry(ROOM_WALL_THICKNESS, ART_ROOM.height, roomDepth);
  const roomLeftWall = new THREE.Mesh(roomSideGeometry, wallMaterial);
  roomLeftWall.position.set(roomLeft - ROOM_WALL_THICKNESS / 2, ART_ROOM.height / 2, ART_ROOM.nearZ + roomDepth / 2);
  scene.add(roomLeftWall);

  const roomRightWall = roomLeftWall.clone();
  roomRightWall.position.x = roomRight + ROOM_WALL_THICKNESS / 2;
  scene.add(roomRightWall);

  const farWall = new THREE.Mesh(new THREE.BoxGeometry(ART_ROOM.halfWidth * 2, ART_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  farWall.position.set(ART_ROOM.centerX, ART_ROOM.height / 2, ART_ROOM.farZ + ROOM_WALL_THICKNESS / 2);
  scene.add(farWall);

  const nearLeftWidth = doorLeft - roomLeft;
  const nearLeftWall = new THREE.Mesh(new THREE.BoxGeometry(nearLeftWidth, ART_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  nearLeftWall.position.set(roomLeft + nearLeftWidth / 2, ART_ROOM.height / 2, ART_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearLeftWall);

  const nearRightWidth = roomRight - doorRight;
  const nearRightWall = new THREE.Mesh(new THREE.BoxGeometry(nearRightWidth, ART_ROOM.height, ROOM_WALL_THICKNESS), wallMaterial);
  nearRightWall.position.set(doorRight + nearRightWidth / 2, ART_ROOM.height / 2, ART_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearRightWall);

  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xfff9ec });
  for (let z = ART_ROOM.nearZ + 2; z < ART_ROOM.farZ - 0.8; z += 4) {
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(22, 0.025, 0.08), lightMaterial);
    lightStrip.position.set(ART_ROOM.centerX, ART_ROOM.height - 0.08, z);
    scene.add(lightStrip);
  }

}

function createMugDisplay(texture, config) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(12, renderer.capabilities.getMaxAnisotropy());

  const display = new THREE.Group();
  display.position.set(config.x, 0, config.z);

  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4f1ea,
    roughness: 0.86,
    metalness: 0
  });
  const pedestal = new THREE.Mesh(
    new THREE.BoxGeometry(1.06, config.pedestalHeight, 1.06),
    pedestalMaterial
  );
  pedestal.position.y = config.pedestalHeight / 2;
  display.add(pedestal);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.1, 1.24), pedestalMaterial);
  plinth.position.y = config.pedestalHeight + 0.05;
  display.add(plinth);

  const mug = new THREE.Group();
  mug.position.y = config.pedestalHeight + 0.5;
  mug.rotation.y = config.rotationY;

  const ceramicMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffffff,
    roughness: 0.34,
    metalness: 0.015,
    side: THREE.DoubleSide
  });
  const blackCeramicMaterial = new THREE.MeshStandardMaterial({
    color: 0x050606,
    roughness: 0.28,
    metalness: 0.02
  });

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.3, 0.72, 64, 1, true),
    ceramicMaterial
  );
  mug.add(body);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.308, 0.024, 16, 72), blackCeramicMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.36;
  mug.add(rim);

  const inside = new THREE.Mesh(
    new THREE.CircleGeometry(0.283, 64),
    new THREE.MeshStandardMaterial({ color: 0x111313, roughness: 0.42, metalness: 0 })
  );
  inside.rotation.x = -Math.PI / 2;
  inside.position.y = 0.348;
  mug.add(inside);

  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.3, 64), blackCeramicMaterial);
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -0.36;
  mug.add(bottom);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.052, 18, 64), blackCeramicMaterial);
  handle.rotation.y = Math.PI / 2;
  handle.position.set(0, 0.005, 0.33);
  handle.scale.y = 1.16;
  mug.add(handle);

  display.add(mug);
  scene.add(display);

  const mugLight = new THREE.PointLight(0xfff5e3, 30, 7, 2);
  mugLight.position.set(config.x, 4.1, config.z - 0.6);
  scene.add(mugLight);
  needsRender = true;
}

function houseHierarchyLabel(child) {
  const names = [];
  let current = child;
  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }
  return names.join(' ').toLowerCase();
}

function isExplicitHouseBaseStone(child) {
  return HOUSE_BASE_STONE_COMPONENTS.has((child.name || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
}

function getGalleryHouseColorGroup(child, material) {
  const hierarchy = houseHierarchyLabel(child);
  const label = `${material.name || ''} ${hierarchy}`.toLowerCase();
  if (/^plane[._]?016$/i.test(child.name || '')) return null;
  if (HOUSE_WOOD_COMPONENTS.has((child.name || '').toLowerCase().replace(/[^a-z0-9]/g, ''))) return 'wood';
  if (isExplicitHouseBaseStone(child)) return 'baseStone';
  if (/(cut[ _]long[ _]wall[ _]top[ _]window|middlefrontwall[._]?001)/.test(hierarchy)) return 'baseStone';
  const isGlassHolder = /glass holder/.test(label);
  const isActualGlass = !isGlassHolder && (/(window|missingglass)/.test(label)
    || material.name === 'gs'
    || /cylinder[._]?002/.test(hierarchy));
  if (isActualGlass) return 'glass';
  if (/(^|[\s_.])(water|pool)([\s_.]|$)/.test(label)
    && !/wood top of water/.test(label)) return null;
  if (/(glassss|holding[ _]the[ _]glass|glass[ _]holder|frame|handle|knob|details|stairs[ _]i[ _]want|torus|sphere|right[ _]middle[ _]wall[ _]2)/.test(label)) return 'metal';
  if (/(^|[ _])top[ _]of[ _]wall([ _]|$)/.test(hierarchy)) return 'roof';
  if (/(^|[ _])white[ _]roof[ _]line([ _]|$)/.test(hierarchy)) return 'stone';
  if (/roomfloor/.test(`${material.name || ''} ${child.name || ''}`.toLowerCase())) return 'baseStone';
  if (/(wood top of water|woodboard|wood|door|platform)/.test(label)) return 'wood';
  return 'baseStone';
}

function prepareHouseModel(model, scaleMultiplier = 1, baseY = 0, targetWidth = null) {
  model.traverse((child) => {
    if (!child.isMesh) return;
    if (/^plane[._]?016$/i.test(child.name || '')) {
      child.visible = false;
      return;
    }
    child.castShadow = false;
    child.receiveShadow = false;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    const clonedMaterials = materials.map((material) => material?.clone ? material.clone() : material);
    child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0];
    clonedMaterials.filter(Boolean).forEach((material) => {
      const groupKey = getGalleryHouseColorGroup(child, material);
      if (groupKey) material.color.set(HOUSE_COLOR_PRESET[groupKey]);
      if (groupKey === 'glass') {
        material.transparent = true;
        material.opacity = 0.34;
        material.depthWrite = false;
        material.side = THREE.DoubleSide;
        material.roughness = 0.08;
        material.metalness = 0;
        if ('transmission' in material) material.transmission = 0.55;
        if ('thickness' in material) material.thickness = 0.04;
        if ('ior' in material) material.ior = 1.45;
      } else if (/(cut[ _]long[ _]wall[ _]top[ _]window|middlefrontwall[._]?001)/.test(houseHierarchyLabel(child))) {
        material.transparent = false;
        material.opacity = 1;
        material.depthWrite = true;
        material.side = THREE.FrontSide;
      }
      material.roughness = material.roughness ?? 0.88;
      material.metalness = 0;
      material.needsUpdate = true;
    });
  });

  model.updateMatrixWorld(true);
  const originalBox = new THREE.Box3().setFromObject(model);
  const originalSize = originalBox.getSize(new THREE.Vector3());
  const horizontalSize = Math.max(originalSize.x, originalSize.z);
  const modelScale = targetWidth
    ? targetWidth / originalSize.x
    : Math.min(3.16 / horizontalSize, 1.5 / originalSize.y) * scaleMultiplier;
  model.scale.setScalar(modelScale);
  model.updateMatrixWorld(true);

  const scaledBox = new THREE.Box3().setFromObject(model);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  model.position.x -= scaledCenter.x;
  model.position.z -= scaledCenter.z;
  model.position.y += baseY - scaledBox.min.y;
  return model;
}

function createHouseDisplay(gltf) {
  const display = new THREE.Group();
  display.position.set(HOUSE_DISPLAY.x, 0, HOUSE_DISPLAY.z);

  const plinthMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8e5dd,
    roughness: 0.78,
    metalness: 0
  });
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(HOUSE_DISPLAY.width, HOUSE_DISPLAY.plinthHeight, HOUSE_DISPLAY.depth),
    plinthMaterial
  );
  plinth.position.y = HOUSE_DISPLAY.plinthHeight / 2;
  display.add(plinth);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(HOUSE_DISPLAY.width + 0.04, 0.08, HOUSE_DISPLAY.depth + 0.04),
    new THREE.MeshStandardMaterial({ color: 0xf5f3ed, roughness: 0.62, metalness: 0 })
  );
  top.position.y = HOUSE_DISPLAY.plinthHeight + 0.04;
  display.add(top);

  const modelPivot = new THREE.Group();
  modelPivot.rotation.y = 0;
  const model = prepareHouseModel(gltf.scene.clone(true), 1, HOUSE_DISPLAY.plinthHeight + 0.1);
  modelPivot.add(model);
  display.add(modelPivot);

  scene.add(display);
  needsRender = true;
}

function createHouseFloorPreview(gltf) {
  const display = new THREE.Group();
  const modelPivot = new THREE.Group();
  modelPivot.rotation.y = 0;
  const model = prepareHouseModel(
    gltf.scene.clone(true),
    1,
    0,
    HOUSE_FLOOR_PREVIEW.wallLength
  );
  display.position.set(
    HOUSE_FLOOR_PREVIEW.x,
    HOUSE_FLOOR_PREVIEW.y,
    HOUSE_FLOOR_PREVIEW.z
  );
  modelPivot.scale.setScalar(HOUSE_FLOOR_PREVIEW.scale);
  modelPivot.rotation.y = HOUSE_FLOOR_PREVIEW.rotationY;
  modelPivot.add(model);
  display.add(modelPivot);
  scene.add(display);
  needsRender = true;
}

function setObjectLayer(object, layer) {
  object.traverse((child) => child.layers.set(layer));
}

const HOUSE_WALKABLE_MESH_NAMES = new Set([
  'wall_top001',
  'Plane001',
  'Plane003',
  'Plane005',
  'Plane012',
  'Plane018',
  'Plane119',
  'Plane126'
]);
const HOUSE_FLOOR_LAMP_COMPONENT_GROUPS = [
  ['Cube003', 'Cube004', 'Cube005', 'Cube006', 'Cube007', 'Cube008', 'Cube009'],
  ['Cube010', 'Cube011', 'Cube012', 'Cube013', 'Cube014', 'Cube015', 'Cube016']
].map((group) => new Set(
  group.map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, ''))
));
const HOUSE_GROUND_SOLID_AREAS = [
  { minX: -11.4, maxX: -0.95, minZ: -7.2, maxZ: 10.0 },
  { minX: -4.7, maxX: 12.25, minZ: -7.35, maxZ: 2.7 },
  { minX: -12.4, maxX: -4.0, minZ: -10.7, maxZ: -2.3 },
  { minX: -14.45, maxX: -10.6, minZ: 4.45, maxZ: 9.9 },
  // The raised front platform is solid underneath; its stone stair remains
  // open on the east side at x ≈ 12–14 m. End the footprint at the platform
  // edge so players can drop to the ground without opening a route upward.
  { minX: -1.15, maxX: 11.75, minZ: 2.2, maxZ: 9.4 }
];
const HOUSE_EXTERIOR_WALKABLE_AREAS = [
  {
    name: 'main stone stair',
    // One continuous safety surface spans both flights and the center seam.
    // These bounds slightly exceed the measured STONE STAIR mesh bounds
    // (x 11.98–14.14, z 3.25–7.23) and overlap the platform and road.
    minX: 11.7, maxX: 14.42, minZ: 3.12, maxZ: 7.36,
    height: (x) => THREE.MathUtils.lerp(
      1.03,
      0.28,
      THREE.MathUtils.clamp((x - 11.85) / 2.4, 0, 1)
    )
  },
  {
    name: 'main platform',
    minX: -1.55, maxX: 11.8, minZ: -1.95, maxZ: 9.4,
    height: () => 1.0
  },
  {
    name: 'west deck',
    minX: -7.45, maxX: -1.55, minZ: -3.55, maxZ: 5.15,
    height: () => 1.06
  },
  {
    name: 'side stair',
    // Follow the actual lower and middle flights with the red intermediate
    // platform held level between z -1.17 and -2.60.
    minX: 9.05, maxX: 12.0, minZ: -3.9, maxZ: 2.4,
    height: (_x, z) => {
      if (z >= -1.17) {
        return THREE.MathUtils.lerp(
          3.39,
          1.0,
          THREE.MathUtils.clamp((z + 1.17) / 3.57, 0, 1)
        );
      }
      if (z >= -2.6) return 3.39;
      return THREE.MathUtils.lerp(
        4.1,
        3.39,
        THREE.MathUtils.clamp((z + 3.9) / 1.3, 0, 1)
      );
    }
  },
  {
    name: 'upper stair landing',
    // The orange platform is the second flat pause before the final flight.
    minX: 9.05, maxX: 12.0, minZ: -6.97, maxZ: -3.9,
    height: () => 4.1
  },
  {
    name: 'hallway roof connector',
    minX: 7.45, maxX: 9.05, minZ: -6.97, maxZ: -3.9,
    height: (x) => THREE.MathUtils.lerp(
      4.72,
      4.1,
      THREE.MathUtils.clamp((x - 7.45) / 1.6, 0, 1)
    )
  },
  {
    name: 'hallway roof',
    minX: -5.2, maxX: 7.45, minZ: -7.0, maxZ: -3.85,
    height: () => 4.72
  }
];
const HOUSE_MAIN_PLATFORM_AREA = HOUSE_EXTERIOR_WALKABLE_AREAS.find(
  (area) => area.name === 'main platform'
);
const HOUSE_SIDE_STAIR_AREA = HOUSE_EXTERIOR_WALKABLE_AREAS.find(
  (area) => area.name === 'side stair'
);
const HOUSE_UPPER_STAIR_LANDING_AREA = HOUSE_EXTERIOR_WALKABLE_AREAS.find(
  (area) => area.name === 'upper stair landing'
);
const HOUSE_HALLWAY_ROOF_CONNECTOR_AREA = HOUSE_EXTERIOR_WALKABLE_AREAS.find(
  (area) => area.name === 'hallway roof connector'
);
const HOUSE_MAIN_STAIR_AREA = HOUSE_EXTERIOR_WALKABLE_AREAS.find(
  (area) => area.name === 'main stone stair'
);
const HOUSE_HALLWAY_ROOF_AREA = HOUSE_EXTERIOR_WALKABLE_AREAS.find(
  (area) => area.name === 'hallway roof'
);
const HOUSE_SMOOTH_STAIR_ROUTE_AREAS = [
  HOUSE_SIDE_STAIR_AREA,
  HOUSE_UPPER_STAIR_LANDING_AREA,
  HOUSE_HALLWAY_ROOF_CONNECTOR_AREA,
  HOUSE_HALLWAY_ROOF_AREA
];

function isHouseWalkableMesh(mesh) {
  const hierarchy = houseHierarchyLabel(mesh);
  return HOUSE_WALKABLE_MESH_NAMES.has(mesh.name)
    || /stone_stair|stairs_i_want/.test(hierarchy);
}

function registerHouseExteriorCollision(model) {
  houseWalkableMeshes.length = 0;
  houseSolidBoxes.length = 0;
  houseCourtyardWaterMeshes.length = 0;
  model.updateMatrixWorld(true);

  model.traverse((child) => {
    if (!child.isMesh || !child.visible) return;
    if (isHouseWalkableMesh(child)) houseWalkableMeshes.push(child);
    if (/^water$/i.test(child.name || '')) houseCourtyardWaterMeshes.push(child);

    const box = new THREE.Box3().setFromObject(child);
    const size = box.getSize(new THREE.Vector3());
    const isWallOrRailing = size.y >= 0.55 && (size.x <= 0.72 || size.z <= 0.72);
    if (!isWallOrRailing) return;
    box.expandByVector(new THREE.Vector3(HOUSE_WORLD.playerRadius, 0, HOUSE_WORLD.playerRadius));
    houseSolidBoxes.push(box);
  });

  // Each stair-side floor lamp is assembled from several individually short
  // meshes. Treat the complete assembly as one obstacle so the camera cannot
  // pass between or through its stacked parts.
  HOUSE_FLOOR_LAMP_COMPONENT_GROUPS.forEach((componentNames) => {
    const lampBox = new THREE.Box3();
    model.traverse((child) => {
      if (!child.isMesh || !child.visible) return;
      const normalizedName = (child.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (componentNames.has(normalizedName)) lampBox.expandByObject(child);
    });
    if (lampBox.isEmpty()) return;
    lampBox.expandByVector(new THREE.Vector3(
      HOUSE_WORLD.playerRadius,
      0.08 * HOUSE_WORLD_PLAYER_SCALE,
      HOUSE_WORLD.playerRadius
    ));
    houseSolidBoxes.push(lampBox);
  });

  houseWalkRaycaster.layers.set(HOUSE_WORLD_LAYER);
  houseCourtyardWaterRaycaster.layers.set(HOUSE_WORLD_LAYER);
}

function isHouseExteriorBlocked(x, z, surfaceY) {
  const bodyMinY = surfaceY + 0.08 * HOUSE_WORLD_PLAYER_SCALE;
  const bodyMaxY = surfaceY + HOUSE_WORLD_EYE_HEIGHT * 0.94;
  return houseSolidBoxes.some((box) => (
    x >= box.min.x && x <= box.max.x
    && z >= box.min.z && z <= box.max.z
    && bodyMaxY >= box.min.y && bodyMinY <= box.max.y
  ));
}

function isHousePondBlocked(x, z) {
  if (!housePondMeshes.length) return false;
  return HOUSE_POND_COLLISION_OFFSETS.some(([offsetX, offsetZ]) => {
    housePondRayOrigin.set(x + offsetX, 2.5, z + offsetZ);
    housePondRaycaster.set(housePondRayOrigin, houseWalkDown);
    housePondRaycaster.near = 0;
    housePondRaycaster.far = 4;
    return housePondRaycaster.intersectObjects(housePondMeshes, false).length > 0;
  });
}

function isHouseCourtyardWater(x, z) {
  if (!houseCourtyardWaterMeshes.length) return false;
  houseCourtyardWaterRayOrigin.set(x, 3, z);
  houseCourtyardWaterRaycaster.set(houseCourtyardWaterRayOrigin, houseWalkDown);
  houseCourtyardWaterRaycaster.near = 0;
  houseCourtyardWaterRaycaster.far = 4;
  return houseCourtyardWaterRaycaster.intersectObjects(
    houseCourtyardWaterMeshes,
    false
  ).length > 0;
}

function isOnHousePortalPath(x, z) {
  return x >= HOUSE_WORLD.stairPathStartX
    && x <= HOUSE_WORLD.portalX
    && Math.abs(z - HOUSE_WORLD.portalZ) <= HOUSE_WORLD.pathWidth / 2;
}

function getHouseWalkableSurfaceY(x, z, currentY = houseWorldGroundY) {
  if (x < HOUSE_WORLD.minX || x > HOUSE_WORLD.maxX || z < HOUSE_WORLD.minZ || z > HOUSE_WORLD.maxZ) {
    return null;
  }
  if (!isOnHousePortalPath(x, z) && isHousePondBlocked(x, z)) return null;
  houseWalkRayOrigin.set(x, 24, z);
  houseWalkRaycaster.set(houseWalkRayOrigin, houseWalkDown);
  houseWalkRaycaster.near = 0;
  houseWalkRaycaster.far = 30;
  const hits = houseWalkRaycaster.intersectObjects(houseWalkableMeshes, false);
  const maximumY = currentY + HOUSE_WORLD.maxStepUp;
  const minimumY = currentY - HOUSE_WORLD.maxStepDown;
  const candidates = [];
  const localX = houseWorldToLocalX(x);
  const localZ = houseWorldToLocalZ(z);

  // Follow the authored rise/landing profile instead of individual overlapping
  // tread meshes: smooth on each flight, stationary on both mid platforms.
  const smoothRouteArea = HOUSE_SMOOTH_STAIR_ROUTE_AREAS.find(
    (area) => isInsideHouseWalkArea(area, x, z)
  );
  if (smoothRouteArea) {
    const smoothRouteY = houseLocalToWorldY(
      smoothRouteArea.height(localX, localZ)
    ) + 0.018;
    if (smoothRouteY <= maximumY
      && smoothRouteY >= minimumY
      && !isHouseExteriorBlocked(x, z, smoothRouteY)) return smoothRouteY;
  }

  for (const hit of hits) {
    if (!hit.face) continue;
    houseWalkNormalMatrix.getNormalMatrix(hit.object.matrixWorld);
    houseWalkNormal.copy(hit.face.normal).applyMatrix3(houseWalkNormalMatrix).normalize();
    if (Math.abs(houseWalkNormal.y) < 0.45) continue;
    candidates.push(hit.point.y + 0.018);
  }

  HOUSE_EXTERIOR_WALKABLE_AREAS.forEach((area) => {
    if (!isInsideHouseWalkArea(area, x, z)) return;
    candidates.push(houseLocalToWorldY(area.height(localX, localZ)) + 0.018);
  });

  candidates.sort((a, b) => b - a);
  for (const surfaceY of candidates) {
    if (surfaceY > maximumY || surfaceY < minimumY) continue;
    if (!isHouseExteriorBlocked(x, z, surfaceY)) return surfaceY;
  }

  const insideHouseGroundSolidFootprint = HOUSE_GROUND_SOLID_AREAS.some(
    (area) => isInsideHouseWalkArea(area, x, z)
  );
  const insideRaisedWalkableFootprint = HOUSE_EXTERIOR_WALKABLE_AREAS.some(
    (area) => isInsideHouseWalkArea(area, x, z)
  );
  const insideHouseFootprint = insideHouseGroundSolidFootprint || insideRaisedWalkableFootprint;
  // Never substitute ground level while the player is still over a raised
  // platform or stair. If its surface is rejected by a railing collision,
  // block that movement and preserve the previous supported position instead.
  const canReachGround = 0 <= maximumY && 0 >= minimumY;
  // After an intentional edge drop, keep the shallow courtyard channels at
  // ground level walkable until the player reaches stairs or another raised
  // exterior surface. Raised footprints stay solid, and the normal wall boxes
  // below still prevent walking through the house itself.
  const canUseDropLandingGround = houseWorldDropGroundOverride
    && currentY <= 0.22
    && (!insideRaisedWalkableFootprint || isHouseCourtyardWater(x, z));
  if ((!insideHouseFootprint || canUseDropLandingGround)
    && canReachGround
    && !isHouseExteriorBlocked(x, z, 0)) return 0;
  return null;
}

function createHomePortalSurface() {
  const material = new THREE.MeshBasicMaterial({
    color: 0xc9e0d4,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.AdditiveBlending
  });
  const veil = new THREE.Mesh(
    new THREE.PlaneGeometry(HOME_PORTAL.width, HOME_PORTAL.height),
    material
  );
  veil.position.set(HOME_PORTAL.x, HOME_PORTAL.height / 2, HOME_PORTAL.z + 0.102);
  veil.renderOrder = 12;
  scene.add(veil);
  homePortalVeil = veil;
  homePortalVeilMaterial = material;
}

function createHouseWorldSky() {
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 32;
  skyCanvas.height = 512;
  const context = skyCanvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 0, skyCanvas.height);
  gradient.addColorStop(0, '#6f8581');
  gradient.addColorStop(0.42, '#aebbb0');
  gradient.addColorStop(0.67, '#d7c9aa');
  gradient.addColorStop(1, '#52634f');
  context.fillStyle = gradient;
  context.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

  const texture = new THREE.CanvasTexture(skyCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = 4;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(92 * HOUSE_WORLD_MODEL_PLACEMENT.scale, 48, 28),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide, fog: false, toneMapped: false })
  );
  sky.position.y = 15 * HOUSE_WORLD_MODEL_PLACEMENT.scale;
  return sky;
}

function createHouseWorldPortal() {
  const portal = new THREE.Group();
  portal.position.set(HOUSE_WORLD.portalX, 0, HOUSE_WORLD.portalZ);
  portal.rotation.y = HOUSE_WORLD.portalRotationY;

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x5f6760,
    roughness: 0.96,
    metalness: 0
  });
  const sideGeometry = new THREE.BoxGeometry(0.62, 4.5, 0.58);
  [-2.55, 2.55].forEach((x) => {
    const side = new THREE.Mesh(sideGeometry, stoneMaterial);
    side.position.set(x, 2.25, 0);
    portal.add(side);
  });
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.72, 0.62, 0.58), stoneMaterial);
  lintel.position.set(0, 4.18, 0);
  portal.add(lintel);

  houseWorldPortalMaterial = new THREE.MeshBasicMaterial({
    color: 0xcce8dc,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.AdditiveBlending
  });
  houseWorldPortalVeil = new THREE.Mesh(
    new THREE.PlaneGeometry(4.48, 3.58),
    houseWorldPortalMaterial
  );
  houseWorldPortalVeil.position.y = 2.1;
  portal.add(houseWorldPortalVeil);

  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 1024;
  labelCanvas.height = 180;
  const context = labelCanvas.getContext('2d');
  context.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  context.fillStyle = '#f3f2e9';
  context.font = '600 52px Arial, Helvetica, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  // Visitors approach this double-sided sign from the plane's back face in
  // the life-size house world. Pre-mirror the texture so it reads normally
  // from that side instead of appearing backward.
  context.translate(labelCanvas.width, 0);
  context.scale(-1, 1);
  context.fillText('RETURN TO THE GALLERY', labelCanvas.width / 2, labelCanvas.height / 2);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 0.97),
    new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide
    })
  );
  label.position.set(0, 5.05, 0);
  portal.add(label);

  const glow = new THREE.PointLight(0xb9dfcf, 18, 11, 2);
  glow.position.set(0, 2.4, -1.2);
  portal.add(glow);
  return portal;
}

function createHouseWorldShell() {
  houseWorldGroup = new THREE.Group();
  houseWorldGroup.name = 'Full-scale childhood home world';
  houseWorldGroup.userData.excludeFromMiniature = true;
  houseWorldGroup.visible = false;

  houseWorldGroup.add(createHouseWorldSky());

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
      112 * HOUSE_WORLD_MODEL_PLACEMENT.scale,
      96 * HOUSE_WORLD_MODEL_PLACEMENT.scale
    ),
    new THREE.MeshStandardMaterial({ color: 0x68705b, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.035;
  houseWorldGroup.add(ground);
  createFullScaleHousePond();

  const approachLength = HOUSE_WORLD.portalX - HOUSE_WORLD.stairPathStartX;
  const approach = new THREE.Mesh(
    new THREE.PlaneGeometry(approachLength, HOUSE_WORLD.pathWidth),
    new THREE.MeshStandardMaterial({ color: 0x968d72, roughness: 1, metalness: 0 })
  );
  approach.rotation.x = -Math.PI / 2;
  approach.position.set(
    HOUSE_WORLD.stairPathStartX + approachLength / 2,
    0.014,
    HOUSE_WORLD.portalZ
  );
  houseWorldGroup.add(approach);

  const mountainMaterial = new THREE.MeshStandardMaterial({
    color: 0x526158,
    roughness: 1,
    metalness: 0,
    flatShading: true
  });
  const mountainSpecs = [
    [-43, -30, 13, 18], [-30, -42, 16, 22], [-10, -48, 15, 19],
    [12, -48, 18, 25], [33, -40, 14, 20], [47, -25, 17, 23],
    [-49, -8, 12, 17], [50, -2, 13, 18], [-48, 18, 15, 20],
    [48, 22, 12, 16], [-33, 38, 14, 18], [31, 39, 15, 20]
  ];
  mountainSpecs.forEach(([x, z, radius, height], index) => {
    const landscapeScale = HOUSE_WORLD_MODEL_PLACEMENT.scale;
    const scaledHeight = height * landscapeScale;
    const mountain = new THREE.Mesh(
      new THREE.ConeGeometry(radius * landscapeScale, scaledHeight, 7, 1),
      mountainMaterial.clone()
    );
    mountain.material.color.offsetHSL(index % 2 ? 0.012 : -0.008, 0, index % 3 ? -0.015 : 0.02);
    mountain.position.set(
      houseLocalToWorldX(x),
      scaledHeight / 2 - 1.2,
      houseLocalToWorldZ(z)
    );
    mountain.rotation.y = index * 0.47;
    houseWorldGroup.add(mountain);
  });

  houseWorldGroup.add(createHouseWorldPortal());

  const hemisphere = new THREE.HemisphereLight(0xe6eee7, 0x59604d, 2.4);
  houseWorldGroup.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xffe0aa, 2.7);
  sun.position.set(-24, 34, 18);
  houseWorldGroup.add(sun);

  setObjectLayer(houseWorldGroup, HOUSE_WORLD_LAYER);
  scene.add(houseWorldGroup);
}

function createFullScaleHouse(gltf) {
  if (!houseWorldGroup || houseWorldReady) return;
  const modelPivot = new THREE.Group();
  const model = prepareHouseModel(
    gltf.scene.clone(true),
    1,
    0,
    HOUSE_WORLD.modelWidth
  );
  modelPivot.add(model);

  // Extend the authored stair foundation just below the terrain. This keeps
  // the original sloped sides and front edge while naturally concealing the
  // two low stair pieces, without adding a separate cover block.
  model.updateMatrixWorld(true);
  let frontStairFoundation = null;
  model.traverse((child) => {
    if (!child.isMesh) return;
    const hierarchy = houseHierarchyLabel(child);
    if (child.name === 'Cube' && /stone[_ ]stair/.test(hierarchy)) frontStairFoundation = child;
  });
  if (frontStairFoundation) {
    const originalBottomY = new THREE.Box3().setFromObject(frontStairFoundation).min.y;
    const foundationBottomY = -0.08;
    frontStairFoundation.geometry = frontStairFoundation.geometry.clone();
    const positions = frontStairFoundation.geometry.getAttribute('position');
    const toLocal = frontStairFoundation.matrixWorld.clone().invert();
    const vertex = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(frontStairFoundation.matrixWorld);
      if (vertex.y > originalBottomY + 0.01) continue;
      vertex.y = foundationBottomY;
      vertex.applyMatrix4(toLocal);
      positions.setXYZ(index, vertex.x, vertex.y, vertex.z);
    }
    positions.needsUpdate = true;
    frontStairFoundation.geometry.computeBoundingBox();
    frontStairFoundation.geometry.computeBoundingSphere();
  }

  // Apply the placement selected in the interactive editor. Scale the
  // normalized model around the house-world origin, then add its XYZ offset.
  model.position.multiplyScalar(HOUSE_WORLD_MODEL_PLACEMENT.scale);
  model.position.add(new THREE.Vector3(
    HOUSE_WORLD_MODEL_PLACEMENT.x,
    HOUSE_WORLD_MODEL_PLACEMENT.y,
    HOUSE_WORLD_MODEL_PLACEMENT.z
  ));
  model.scale.multiplyScalar(HOUSE_WORLD_MODEL_PLACEMENT.scale);
  model.updateMatrixWorld(true);

  const houseShadow = new THREE.Mesh(
    new THREE.CircleGeometry(16.2, 64),
    new THREE.MeshBasicMaterial({ color: 0x182019, transparent: true, opacity: 0.18, depthWrite: false })
  );
  houseShadow.rotation.x = -Math.PI / 2;
  houseShadow.scale.set(
    HOUSE_WORLD_MODEL_PLACEMENT.scale,
    HOUSE_WORLD_MODEL_PLACEMENT.scale,
    0.74 * HOUSE_WORLD_MODEL_PLACEMENT.scale
  );
  houseShadow.position.set(
    HOUSE_WORLD_MODEL_PLACEMENT.x,
    0.016,
    HOUSE_WORLD_MODEL_PLACEMENT.z
  );
  modelPivot.add(houseShadow);

  setObjectLayer(modelPivot, HOUSE_WORLD_LAYER);
  houseWorldGroup.add(modelPivot);
  houseWorldGroup.updateMatrixWorld(true);
  registerHouseExteriorCollision(model);
  houseWorldReady = true;
  activateHousePreviewIfRequested();
  needsRender = true;
}

function createHousePondGeometry(scale = 1) {
  const scaleX = HOUSE_POND.width / HOUSE_POND.outlineWidth;
  const scaleZ = HOUSE_POND.depth / HOUSE_POND.outlineDepth;
  const controlPoints = HOUSE_POND.outline.map(([x, z]) => new THREE.Vector3(
    (x - HOUSE_POND.outlineCenterX) * scaleX * scale,
    -(z - HOUSE_POND.outlineCenterZ) * scaleZ * scale,
    0
  ));
  const curve = new THREE.CatmullRomCurve3(controlPoints, true, 'centripetal', 0.35);
  const outline = curve.getPoints(84).map((point) => new THREE.Vector2(point.x, point.y));
  const geometry = new THREE.ShapeGeometry(new THREE.Shape(outline), 12);
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const width = Math.max(0.001, max.x - min.x);
  const height = Math.max(0.001, max.y - min.y);
  const positions = geometry.getAttribute('position');
  const uvs = geometry.getAttribute('uv');
  for (let index = 0; index < positions.count; index += 1) {
    uvs.setXY(
      index,
      (positions.getX(index) - min.x) / width,
      (positions.getY(index) - min.y) / height
    );
  }
  uvs.needsUpdate = true;
  return geometry;
}

function createHousePondWaterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  const depth = context.createRadialGradient(275, 248, 28, 256, 256, 330);
  depth.addColorStop(0, '#436f70');
  depth.addColorStop(0.55, '#568985');
  depth.addColorStop(1, '#79a99d');
  context.fillStyle = depth;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineCap = 'round';
  for (let row = 0; row < 13; row += 1) {
    const y = 34 + row * 38;
    context.beginPath();
    for (let x = -20; x <= 532; x += 8) {
      const waveY = y + Math.sin(x * 0.045 + row * 0.85) * 3.2;
      if (x === -20) context.moveTo(x, waveY);
      else context.lineTo(x, waveY);
    }
    context.strokeStyle = row % 3 === 0 ? 'rgba(225, 244, 235, 0.12)' : 'rgba(202, 232, 225, 0.065)';
    context.lineWidth = row % 3 === 0 ? 2.2 : 1.2;
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function createFullScaleHousePond() {
  if (!houseWorldGroup || housePondMeshes.length) return;
  const pond = new THREE.Group();
  pond.name = 'Full-scale outdoor childhood pond';
  pond.position.set(
    houseLocalToWorldX(HOUSE_POND.centerX),
    0,
    houseLocalToWorldZ(HOUSE_POND.centerZ)
  );
  const pondScale = HOUSE_WORLD_MODEL_PLACEMENT.scale;

  const shore = new THREE.Mesh(
    createHousePondGeometry(1.075 * pondScale),
    new THREE.MeshStandardMaterial({ color: 0x8b8065, roughness: 1, metalness: 0, side: THREE.DoubleSide })
  );
  shore.rotation.x = -Math.PI / 2;
  shore.position.y = -0.018;
  pond.add(shore);

  const bed = new THREE.Mesh(
    createHousePondGeometry(1.025 * pondScale),
    new THREE.MeshStandardMaterial({ color: 0x315956, roughness: 0.9, metalness: 0, side: THREE.DoubleSide })
  );
  bed.rotation.x = -Math.PI / 2;
  bed.position.y = -0.01;
  pond.add(bed);

  housePondWaterTexture = createHousePondWaterTexture();
  const water = new THREE.Mesh(
    createHousePondGeometry(pondScale),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: housePondWaterTexture,
      roughness: 0.3,
      metalness: 0,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.52,
      clearcoatRoughness: 0.24,
      side: THREE.DoubleSide
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = HOUSE_POND.waterLevel;
  water.renderOrder = 2;
  pond.add(water);

  houseWorldGroup.add(pond);
  housePondMeshes.push(water);
  housePondRaycaster.layers.set(HOUSE_WORLD_LAYER);
  needsRender = true;
}

function activateHousePreviewIfRequested() {
  if (!galleryActive || !houseWorldReady || insideHouseWorld || portalTransitioning) return;
  if (previewParams.has('home-world-preview')) {
    enterHouseWorld();
  } else if (previewParams.has('home-transition-preview')) {
    window.setTimeout(() => beginPortalTransition('home'), 80);
  }
}

function setGalleryEnvironment() {
  camera.layers.set(0);
  camera.near = 0.08;
  camera.far = 100;
  camera.updateProjectionMatrix();
  scene.background.set(0xe5e4e0);
  scene.fog.color.set(0xe5e4e0);
  scene.fog.near = 22;
  scene.fog.far = 78;
}

function setHouseWorldEnvironment() {
  camera.layers.set(HOUSE_WORLD_LAYER);
  camera.near = 0.08 * HOUSE_WORLD_PLAYER_SCALE;
  camera.far = 220;
  camera.updateProjectionMatrix();
  scene.background.set(0x83938d);
  scene.fog.color.set(0x83938d);
  scene.fog.near = 54 * HOUSE_WORLD_MODEL_PLACEMENT.scale;
  scene.fog.far = 112 * HOUSE_WORLD_MODEL_PLACEMENT.scale;
}

function enterHouseWorld() {
  insideHouseWorld = true;
  beginAnalyticsRoomVisit('house');
  houseWorldGroup.visible = true;
  setHouseWorldEnvironment();
  houseWorldGroundY = 0;
  houseWorldCameraGroundY = 0;
  houseWorldEdgeDropActive = false;
  houseWorldDropGroundOverride = false;
  camera.position.copy(HOUSE_WORLD.arrival);
  camera.lookAt(
    houseLocalToWorldX(0),
    houseLocalToWorldY(2.7),
    houseLocalToWorldZ(0)
  );
  const worldPreview = previewParams.get('home-world-preview');
  const previewLocation = worldPreview === 'platform'
    ? {
      x: houseLocalToWorldX(5.4),
      z: houseLocalToWorldZ(7.0),
      expectedY: houseLocalToWorldY(1.0),
      lookX: houseLocalToWorldX(0),
      lookZ: houseLocalToWorldZ(1.5)
    }
    : worldPreview === 'roof'
      ? {
        x: houseLocalToWorldX(1.5),
        z: houseLocalToWorldZ(-5.1),
        expectedY: houseLocalToWorldY(4.3),
        lookX: houseLocalToWorldX(-5.5),
        lookZ: houseLocalToWorldZ(-6.0)
      }
      : null;
  if (previewLocation) {
    const surfaceY = getHouseWalkableSurfaceY(
      previewLocation.x,
      previewLocation.z,
      previewLocation.expectedY
    );
    houseWorldGroundY = surfaceY ?? previewLocation.expectedY;
    houseWorldCameraGroundY = houseWorldGroundY;
    camera.position.set(
      previewLocation.x,
      houseWorldGroundY + HOUSE_WORLD_EYE_HEIGHT,
      previewLocation.z
    );
    camera.lookAt(
      previewLocation.lookX,
      houseWorldGroundY + HOUSE_WORLD_EYE_HEIGHT,
      previewLocation.lookZ
    );
  }
  resetPlayerHeight();
  pauseGalleryVideos();
  pauseShrimpRoomMusic();
  focusedPoster = null;
  focusedPhoto = null;
  focusedResumeLink = null;
  focusedManualVideo = null;
  focusedGameAction = null;
  focusedBrainRegion = null;
  focusCard.hidden = true;
  portalPrompt.hidden = true;
  reticle.classList.remove('active');
  setWalkHint('house');
  needsRender = true;
}

function exitHouseWorld() {
  insideHouseWorld = false;
  houseWorldGroundY = 0;
  houseWorldCameraGroundY = 0;
  houseWorldEdgeDropActive = false;
  houseWorldDropGroundOverride = false;
  setGalleryEnvironment();
  camera.position.set(HOME_PORTAL.x, STANDING_EYE_HEIGHT, HOME_PORTAL.z + 1.5);
  camera.lookAt(HOME_PORTAL.x, STANDING_EYE_HEIGHT, HOME_PORTAL.z + 8);
  beginAnalyticsRoomVisit(getGalleryRoomKeyAtCamera());
  resetPlayerHeight();
  houseWorldGroup.visible = false;
  setWalkHint();
  playGalleryVideos();
  requestVideoSync();
  needsRender = true;
}

function beginPortalTransition(destination) {
  if (portalTransitioning) return;
  if (destination === 'home' && !houseWorldReady) {
    portalPrompt.hidden = false;
    portalPromptTitle.textContent = 'The memory is still forming.';
    portalPromptCopy.textContent = 'Stay close—the house will be ready in a moment.';
    startArtRoomLoads();
    return;
  }

  portalTransitioning = true;
  pressedKeys.clear();
  portalTransitionTitle.textContent = destination === 'home' ? 'Home' : 'Gallery';
  portalTransition.classList.remove('is-revealing');
  portalTransition.classList.add('is-active');

  window.setTimeout(() => {
    if (destination === 'home') enterHouseWorld();
    else exitHouseWorld();
    portalTransition.classList.add('is-revealing');
  }, 300);

  window.setTimeout(() => {
    portalTransition.classList.remove('is-active', 'is-revealing');
    portalTransitioning = false;
    needsRender = true;
  }, 760);
}

function updateHomePortalEffects(now) {
  if (!camera || !homePortalVeilMaterial) return false;
  const pulse = 0.5 + Math.sin(now * 0.0032) * 0.5;

  if (insideHouseWorld) {
    portalPrompt.hidden = true;
    if (housePondWaterTexture) {
      housePondWaterTexture.offset.x = Math.sin(now * 0.00011) * 0.012;
      housePondWaterTexture.offset.y = (now * 0.000007) % 1;
    }
    if (houseWorldPortalMaterial) houseWorldPortalMaterial.opacity = 0.24 + pulse * 0.14;
    if (houseWorldPortalVeil) {
      const scale = 1 + pulse * 0.012;
      houseWorldPortalVeil.scale.set(scale, scale, 1);
    }
    return true;
  }

  const distanceZ = camera.position.z - HOME_PORTAL.z;
  const distanceX = Math.abs(camera.position.x - HOME_PORTAL.x);
  const nearPortal = distanceZ >= 0
    && distanceZ <= HOME_PORTAL.promptDistance
    && distanceX <= HOME_PORTAL.width / 2 + HOME_PORTAL.promptSideMargin;
  const proximity = nearPortal
    ? 1 - THREE.MathUtils.clamp(distanceZ / HOME_PORTAL.promptDistance, 0, 1)
    : 0;
  if (nearPortal && !houseWorldReady) startArtRoomLoads();
  homePortalVeilMaterial.opacity = proximity * (0.055 + pulse * 0.055);
  if (homePortalVeil) {
    const scale = 1 + pulse * 0.006 * proximity;
    homePortalVeil.scale.set(scale, scale, 1);
  }

  if (galleryActive && nearPortal && !portalTransitioning) {
    portalPrompt.hidden = false;
    portalPromptTitle.textContent = houseWorldReady
      ? 'Home is on the other side.'
      : 'The memory is forming.';
    portalPromptCopy.textContent = houseWorldReady
      ? 'Walk into the house photos.'
      : 'Stay close—the house will be ready in a moment.';
  } else {
    portalPrompt.hidden = true;
  }
  return nearPortal;
}

function isHomePortalCrossing(x, z, previousZ) {
  return !insideHouseWorld
    && previousZ > HOME_PORTAL.triggerZ
    && z <= HOME_PORTAL.triggerZ
    && Math.abs(x - HOME_PORTAL.x) <= HOME_PORTAL.width / 2;
}

function isHouseWorldPortalCrossing(x, z, previousX) {
  return insideHouseWorld
    && previousX < HOUSE_WORLD.portalTriggerX
    && x >= HOUSE_WORLD.portalTriggerX
    && Math.abs(z - HOUSE_WORLD.portalZ) <= HOUSE_WORLD.pathWidth / 2;
}

function isHouseWorldWalkablePosition(x, z) {
  return getHouseWalkableSurfaceY(x, z) !== null;
}

function isInsideHouseWalkArea(area, x, z, margin = 0) {
  if (!area) return false;
  const minX = houseLocalToWorldX(area.minX);
  const maxX = houseLocalToWorldX(area.maxX);
  const minZ = houseLocalToWorldZ(area.minZ);
  const maxZ = houseLocalToWorldZ(area.maxZ);
  return x >= minX - margin && x <= maxX + margin
    && z >= minZ - margin && z <= maxZ + margin;
}

function getHouseAreaExitPosition(area, targetX, targetZ) {
  const clearance = HOUSE_WORLD.playerRadius + 0.1 * HOUSE_WORLD_PLAYER_SCALE;
  const minX = houseLocalToWorldX(area.minX);
  const maxX = houseLocalToWorldX(area.maxX);
  const minZ = houseLocalToWorldZ(area.minZ);
  const maxZ = houseLocalToWorldZ(area.maxZ);
  let x = targetX;
  let z = targetZ;
  if (targetX < minX) x = minX - clearance;
  if (targetX > maxX) x = maxX + clearance;
  if (targetZ < minZ) z = minZ - clearance;
  if (targetZ > maxZ) z = maxZ + clearance;
  return { x, z };
}

function beginHouseWorldEdgeDrop(fromSurfaceY, landingY = 0) {
  const visibleFootY = Math.max(
    fromSurfaceY,
    houseWorldCameraGroundY + jumpOffset
  );
  houseWorldGroundY = landingY;
  houseWorldCameraGroundY = landingY;
  jumpOffset = Math.max(0.001, visibleFootY - landingY);
  houseWorldEdgeDropActive = true;
  houseWorldDropGroundOverride = true;
}

function tryLeaveHouseWalkArea(
  area,
  stepStartX,
  stepStartZ,
  targetX,
  targetZ,
  startingSurfaceY,
  startMargin = 0
) {
  if (!isInsideHouseWalkArea(area, stepStartX, stepStartZ, startMargin)) return false;
  if (isInsideHouseWalkArea(area, targetX, targetZ)) return false;
  const exit = getHouseAreaExitPosition(area, targetX, targetZ);
  const airborneFootY = Math.max(startingSurfaceY, houseWorldCameraGroundY + jumpOffset);
  if (isHouseExteriorBlocked(exit.x, exit.z, airborneFootY)) return false;
  camera.position.x = exit.x;
  camera.position.z = exit.z;
  beginHouseWorldEdgeDrop(startingSurfaceY, 0);
  return true;
}

function tryWalkOffMainPlatform(stepStartX, stepStartZ, targetX, targetZ, startingSurfaceY) {
  const platformY = houseLocalToWorldY(1);
  if (startingSurfaceY < platformY - 0.28 || startingSurfaceY > platformY + 0.3) return false;
  // A rejected movement over a stair riser or rail must stop at the current
  // position, never be interpreted as stepping off the platform into a hole.
  if (isInsideHouseWalkArea(
    HOUSE_MAIN_STAIR_AREA,
    targetX,
    targetZ,
    0.12 * HOUSE_WORLD_PLAYER_SCALE
  )) return false;
  return tryLeaveHouseWalkArea(
    HOUSE_MAIN_PLATFORM_AREA,
    stepStartX,
    stepStartZ,
    targetX,
    targetZ,
    startingSurfaceY
  );
}

function tryJumpOffHallwayRoof(stepStartX, stepStartZ, targetX, targetZ, startingSurfaceY) {
  if (startingSurfaceY < houseLocalToWorldY(3.9)) return false;
  if (jumpVelocity <= 0 && jumpOffset <= 0) return false;
  return tryLeaveHouseWalkArea(
    HOUSE_HALLWAY_ROOF_AREA,
    stepStartX,
    stepStartZ,
    targetX,
    targetZ,
    startingSurfaceY,
    0.35 * HOUSE_WORLD_PLAYER_SCALE
  );
}

function moveHouseWorldAirborne(stepStartX, stepStartZ, targetX, targetZ) {
  const airborneFootY = houseWorldGroundY + jumpOffset;
  const canMoveTo = (x, z) => (
    x >= HOUSE_WORLD.minX && x <= HOUSE_WORLD.maxX
    && z >= HOUSE_WORLD.minZ && z <= HOUSE_WORLD.maxZ
    && !isHouseExteriorBlocked(x, z, airborneFootY)
  );
  camera.position.x = stepStartX;
  camera.position.z = stepStartZ;
  if (canMoveTo(targetX, targetZ)) {
    camera.position.x = targetX;
    camera.position.z = targetZ;
    return;
  }
  if (canMoveTo(targetX, stepStartZ)) camera.position.x = targetX;
  if (canMoveTo(camera.position.x, targetZ)) camera.position.z = targetZ;
}

function applyHouseWorldMove(x, z, fromSurfaceY = houseWorldGroundY) {
  const surfaceY = getHouseWalkableSurfaceY(x, z, fromSurfaceY);
  if (surfaceY === null) return false;
  camera.position.x = x;
  camera.position.z = z;
  if (surfaceY < fromSurfaceY - HOUSE_WORLD_AUTO_DROP_THRESHOLD) {
    beginHouseWorldEdgeDrop(fromSurfaceY, surfaceY);
  } else {
    houseWorldGroundY = surfaceY;
    if (surfaceY > 0.22) houseWorldDropGroundOverride = false;
  }
  return true;
}

function moveHouseWorldPlayer(stepStartX, stepStartZ, targetX, targetZ) {
  const startingSurfaceY = houseWorldGroundY;
  if (houseWorldEdgeDropActive && jumpOffset > 0) {
    moveHouseWorldAirborne(stepStartX, stepStartZ, targetX, targetZ);
    return;
  }
  camera.position.x = stepStartX;
  camera.position.z = stepStartZ;
  const leavingMainPlatform = isInsideHouseWalkArea(
    HOUSE_MAIN_PLATFORM_AREA,
    stepStartX,
    stepStartZ
  ) && !isInsideHouseWalkArea(HOUSE_MAIN_PLATFORM_AREA, targetX, targetZ);
  if (leavingMainPlatform) {
    const targetSurfaceY = getHouseWalkableSurfaceY(targetX, targetZ, startingSurfaceY);
    if ((targetSurfaceY === null
      || targetSurfaceY < startingSurfaceY - HOUSE_WORLD_AUTO_DROP_THRESHOLD)
      && tryWalkOffMainPlatform(
        stepStartX,
        stepStartZ,
        targetX,
        targetZ,
        startingSurfaceY
      )) return;
  }
  if (applyHouseWorldMove(targetX, targetZ, startingSurfaceY)) return;

  if (tryWalkOffMainPlatform(
    stepStartX,
    stepStartZ,
    targetX,
    targetZ,
    startingSurfaceY
  )) return;
  if (tryJumpOffHallwayRoof(
    stepStartX,
    stepStartZ,
    targetX,
    targetZ,
    startingSurfaceY
  )) return;

  houseWorldGroundY = startingSurfaceY;
  if (!applyHouseWorldMove(targetX, stepStartZ, startingSurfaceY)) {
    camera.position.x = stepStartX;
    camera.position.z = stepStartZ;
    houseWorldGroundY = startingSurfaceY;
  }
  if (!applyHouseWorldMove(camera.position.x, targetZ, houseWorldGroundY)) {
    camera.position.z = stepStartZ;
  }
}

function getMiniatureVideoEntry(source) {
  if (!source?.isMesh) return null;
  return galleryVideos.find((entry) => entry.screen === source || entry.material === source.material) || null;
}

function getMiniaturePosterSource(entry) {
  if (!entry) return null;
  const sourceName = entry.source?.split('?')[0].split('/').pop();
  if (GALLERY_MINIATURE_POSTER_OVERRIDES.has(sourceName)) {
    return GALLERY_MINIATURE_POSTER_OVERRIDES.get(sourceName);
  }
  if (!entry.posterImage) return null;
  const cleanPath = entry.posterImage.split('?')[0];
  if (!cleanPath.startsWith('./media/')) return null;
  return `../gallery-miniature/${cleanPath.slice(2)}`;
}

function getMiniatureStaticTexture(entry) {
  if (!entry) return null;
  if (galleryMiniaturePosterTextures.has(entry)) return galleryMiniaturePosterTextures.get(entry);

  const posterSource = getMiniaturePosterSource(entry);
  if (!posterSource) {
    const placeholder = createVideoPlaceholderTexture();
    galleryMiniaturePosterTextures.set(entry, placeholder);
    return placeholder;
  }
  if (galleryMiniaturePosterLoads.has(entry)) return null;

  const placeholder = createVideoPlaceholderTexture();
  galleryMiniaturePosterTextures.set(entry, placeholder);
  galleryMiniaturePosterLoads.set(entry, true);
  const loader = new THREE.TextureLoader();
  loader.load(posterSource, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    placeholder.dispose();
    galleryMiniaturePosterTextures.set(entry, texture);
    if (galleryMiniature) requestGalleryMiniatureRefresh();
  }, undefined, () => {
    if (galleryMiniature) requestGalleryMiniatureRefresh();
  });
  return placeholder;
}

function getMiniatureMaterial(material, staticTexture) {
  if (!staticTexture) return material;
  const cloneMaterial = (sourceMaterial) => {
    if (!sourceMaterial) return sourceMaterial;
    const copy = sourceMaterial.clone();
    copy.map = staticTexture;
    copy.needsUpdate = true;
    return copy;
  };
  return Array.isArray(material) ? material.map(cloneMaterial) : cloneMaterial(material);
}

function copyMiniatureObject(source) {
  if (source.isLight) return null;
  const videoEntry = getMiniatureVideoEntry(source);
  const staticTexture = videoEntry ? getMiniatureStaticTexture(videoEntry) : null;
  const material = getMiniatureMaterial(source.material, staticTexture);
  let copy;
  if (source.isMesh) copy = new THREE.Mesh(source.geometry, material);
  else if (source.isLineSegments) copy = new THREE.LineSegments(source.geometry, material);
  else if (source.isLine) copy = new THREE.Line(source.geometry, material);
  else if (source.isPoints) copy = new THREE.Points(source.geometry, material);
  else if (source.isGroup) copy = new THREE.Group();
  else if (source.isObject3D) copy = new THREE.Object3D();
  else return null;

  copy.position.copy(source.position);
  copy.quaternion.copy(source.quaternion);
  copy.scale.copy(source.scale);
  copy.visible = source.visible;
  copy.renderOrder = source.renderOrder;
  copy.frustumCulled = source.frustumCulled;
  source.children.forEach((child) => {
    const childCopy = copyMiniatureObject(child);
    if (childCopy) copy.add(childCopy);
  });
  return copy;
}

function populateMiniature(target) {
  scene.children.forEach((source) => {
    if (source === galleryMiniature || source.isLight || source.userData.excludeFromMiniature) return;
    const copy = copyMiniatureObject(source);
    if (!copy) return;
    copy.traverse((object) => {
      if (!object.isMesh) return;
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      if (center.y > 5.15 && size.y < 0.2 && Math.max(size.x, size.z) > 1.5) object.visible = false;
      object.castShadow = false;
      object.receiveShadow = false;
    });
    target.add(copy);
  });
}

function createGalleryMiniature() {
  if (!scene || !sceneReady) return;
  if (galleryMiniature) scene.remove(galleryMiniature);

  const miniature = new THREE.Group();
  miniature.name = 'Full gallery miniature without table';
  miniature.position.set(GALLERY_MINIATURE.x, 0.02, GALLERY_MINIATURE.z);
  miniature.scale.setScalar(GALLERY_MINIATURE.scale);
  populateMiniature(miniature);

  const nestedMiniature = new THREE.Group();
  nestedMiniature.name = 'Nested full gallery miniature';
  nestedMiniature.position.set(
    NESTED_GALLERY_MINIATURE.x,
    NESTED_GALLERY_MINIATURE.y,
    NESTED_GALLERY_MINIATURE.z
  );
  nestedMiniature.scale.setScalar(NESTED_GALLERY_MINIATURE.scale);
  populateMiniature(nestedMiniature);
  miniature.add(nestedMiniature);

  scene.add(miniature);
  galleryMiniature = miniature;
  needsRender = true;
}

function requestGalleryMiniatureRefresh(delay = 0) {
  if (galleryMiniatureRefreshTimer) return;
  const attemptRefresh = () => {
    galleryMiniatureRefreshTimer = 0;
    // Rebuilding the nested miniature clones the full scene twice. Never do
    // that during movement; coalesce any poster callbacks and try once idle.
    if (galleryActive && performance.now() - lastCameraInputAt < 1200) {
      galleryMiniatureRefreshTimer = window.setTimeout(attemptRefresh, 350);
      return;
    }
    createGalleryMiniature();
  };
  galleryMiniatureRefreshTimer = window.setTimeout(attemptRefresh, delay);
}

function queueGalleryMiniatureRefreshes() {
  if (galleryMiniatureRefreshesQueued) return;
  galleryMiniatureRefreshesQueued = true;
  [1200, 7000, 15000, 26000].forEach((delay) => {
    window.setTimeout(() => requestGalleryMiniatureRefresh(), delay);
  });
}

function refreshFocusCard() {
  if (focusedResumeLink) {
    focusCard.classList.remove('video-focus');
    focusCard.classList.remove('is-playing');
    focusEyebrow.textContent = 'Résumé · In view';
    focusTitle.textContent = focusedResumeLink.title;
    focusAction.innerHTML = '<b class="video-primary"><kbd>E</kbd> Open résumé</b>';
    return;
  }
  if (focusedPhoto) {
    focusCard.classList.remove('video-focus');
    focusCard.classList.remove('is-playing');
    focusEyebrow.textContent = 'Artwork · In view';
    focusTitle.textContent = focusedPhoto.title;
    focusAction.innerHTML = '<b class="video-primary"><kbd>E</kbd> Open high resolution</b>';
    return;
  }
  if (focusedBrainRegion) {
    focusCard.classList.remove('video-focus');
    focusCard.classList.remove('is-playing');
    focusEyebrow.textContent = 'Cortical region · Fixation target';
    focusTitle.textContent = `${focusedBrainRegion.hemisphere} ${focusedBrainRegion.name}`;
    focusAction.textContent = 'Move the reticle across the brain to inspect regions.';
    return;
  }
  if (focusedGameAction) {
    focusCard.classList.add('video-focus');
    focusCard.classList.remove('is-playing');
    focusEyebrow.textContent = 'Game launcher · In range';
    focusTitle.textContent = focusedGameAction.title;
    focusAction.innerHTML = `<b class="video-primary"><kbd>E</kbd> ${focusedGameAction.label} <i>in a new tab</i></b>`;
    return;
  }
  if (!focusedManualVideo) {
    focusCard.hidden = true;
    return;
  }

  const isPlaying = !focusedManualVideo.element.paused;
  focusCard.classList.add('video-focus');
  focusCard.classList.toggle('is-playing', isPlaying);
  focusEyebrow.textContent = 'Video controls · In range';
  focusTitle.textContent = focusedManualVideo.title;
  focusAction.innerHTML = `
    <b class="video-primary"><kbd>E</kbd> ${isPlaying ? 'Pause' : 'Play'} <i>or click</i></b>
    <em class="video-secondary"><em class="video-time">${formatVideoTime(focusedManualVideo.element.currentTime)} / ${formatVideoTime(focusedManualVideo.element.duration)}</em> · <kbd>←</kbd> <kbd>→</kbd> skip 5 sec · hold <kbd>E</kbd> to restart</em>
  `;
}

function formatVideoTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function refreshFocusedVideoTime() {
  if (!focusedManualVideo) return;
  const timeLabel = focusCard.querySelector('.video-time');
  if (!timeLabel) return;
  const nextLabel = `${formatVideoTime(focusedManualVideo.element.currentTime)} / ${formatVideoTime(focusedManualVideo.element.duration)}`;
  if (timeLabel.textContent !== nextLabel) timeLabel.textContent = nextLabel;
}

function launchGameAction(action) {
  if (!action) return;
  window.open(action.url, '_blank', 'noopener,noreferrer');
}

function enableVideoAudio(entry) {
  if (!entry?.hasSound) return;
  entry.audioEnabled = true;
  entry.element.muted = false;
  entry.element.defaultMuted = false;
  entry.element.removeAttribute('muted');
  entry.element.volume = entry.videoRoom ? VIDEO_ROOM_VOLUME : 1;
}

function toggleManualVideo(entry) {
  const video = entry.element;
  if (!video.paused) {
    entry.userPaused = true;
    if (entry.manualOnly) entry.manualActivated = false;
    video.pause();
    refreshFocusCard();
    return;
  }

  entry.userPaused = false;
  if (entry.manualOnly) entry.manualActivated = true;
  if (!video.hasAttribute('src')) {
    video.preload = 'auto';
    video.src = entry.source;
    video.load();
  }
  enableVideoAudio(entry);
  if (!shouldPlayVideo(entry)) {
    refreshFocusCard();
    return;
  }
  video.play().then(() => {
    if (entry.hasSound && entry.audioEnabled) {
      video.muted = false;
      video.defaultMuted = false;
      video.removeAttribute('muted');
    }
    scheduleVideoFrame(entry);
    refreshFocusCard();
  }).catch(() => {
    entry.userPaused = true;
    if (entry.manualOnly) entry.manualActivated = false;
    refreshFocusCard();
  });
}

function restartVideoEntry(entry) {
  const video = entry.element;
  entry.userPaused = false;
  if (entry.manualOnly) entry.manualActivated = true;
  if (!video.hasAttribute('src')) {
    video.preload = 'auto';
    video.src = entry.source;
    video.load();
  }
  enableVideoAudio(entry);

  const restart = () => {
    video.currentTime = 0;
    if (!shouldPlayVideo(entry)) {
      video.pause();
      refreshFocusCard();
      return;
    }
    video.play().then(() => {
    if (entry.hasSound && entry.audioEnabled) {
      video.muted = false;
      video.defaultMuted = false;
      video.removeAttribute('muted');
    }
      scheduleVideoFrame(entry);
      refreshFocusCard();
    }).catch(() => {
      entry.userPaused = true;
      if (entry.manualOnly) entry.manualActivated = false;
      refreshFocusCard();
    });
  };
  if (video.readyState >= 1) restart();
  else video.addEventListener('loadedmetadata', restart, { once: true });
}

function seekVideoEntry(entry, offsetSeconds) {
  const video = entry.element;
  if (!video.hasAttribute('src')) {
    video.preload = 'auto';
    video.src = entry.source;
    video.load();
  }

  const seek = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const latestTime = duration > 0 ? Math.max(0, duration - 0.05) : Number.POSITIVE_INFINITY;
    video.currentTime = THREE.MathUtils.clamp(video.currentTime + offsetSeconds, 0, latestTime);
    needsRender = true;
  };

  if (video.readyState >= 1) seek();
  else video.addEventListener('loadedmetadata', seek, { once: true });
}

function createStandingVideoDisplay(work, posterTexture) {
  posterTexture.colorSpace = THREE.SRGBColorSpace;
  posterTexture.minFilter = THREE.LinearMipmapLinearFilter;
  posterTexture.magFilter = THREE.LinearFilter;
  posterTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const screenHeight = work.contentHeight ?? work.width / work.aspect;
  const screenWidth = work.contentWidth ?? (work.width ?? screenHeight * work.aspect);
  const frameWidth = work.frameWidth ?? screenWidth + 0.2;
  const frameHeight = work.frameHeight ?? screenHeight + 0.2;
  const group = new THREE.Group();
  group.position.set(work.x, work.positionY ?? 0, work.z);
  group.rotation.y = work.rotationY;
  const holderScale = work.displayScale ?? 1;

  const holderMaterial = new THREE.MeshStandardMaterial({
    color: work.holderColor ?? 0xf4f3ef,
    roughness: 0.78,
    metalness: 0
  });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.28 * holderScale, 0.08 * holderScale, 0.84 * holderScale),
    holderMaterial
  );
  base.position.set(0, 0.04 * holderScale, -0.03 * holderScale);
  group.add(base);

  const pedestal = new THREE.Mesh(
    new THREE.BoxGeometry(1.02 * holderScale, work.pedestalHeight, 0.55 * holderScale),
    holderMaterial
  );
  pedestal.position.set(0, work.pedestalHeight / 2 + 0.08 * holderScale, -0.05 * holderScale);
  group.add(pedestal);

  const screenAssembly = new THREE.Group();
  screenAssembly.position.set(0, work.screenY, -0.03);
  screenAssembly.rotation.set(work.tiltX ?? 0, work.tiltY ?? 0, work.tiltZ ?? 0);
  group.add(screenAssembly);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth, frameHeight, 0.14),
    holderMaterial
  );
  frame.position.z = -0.055;
  screenAssembly.add(frame);

  const screenMaterial = new THREE.MeshBasicMaterial({ map: posterTexture, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenWidth, screenHeight), screenMaterial);
  screen.position.z = 0.022;
  screenAssembly.add(screen);

  const focusOutline = createVideoFocusOutline(frameWidth, frameHeight, 0.052);
  screenAssembly.add(focusOutline);
  const interactionTarget = new THREE.Mesh(
    new THREE.PlaneGeometry(frameWidth + 0.58, frameHeight + 0.58),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
      side: THREE.FrontSide
    })
  );
  interactionTarget.position.z = 0.046;
  screenAssembly.add(interactionTarget);

  const angledNeck = new THREE.Mesh(
    new THREE.BoxGeometry(
      work.description
        ? (work.launchAction ? Math.min(frameWidth + 0.25, 2.95) : Math.min(frameWidth - 0.25, 2.55))
        : 0.9,
      0.64,
      0.42
    ),
    holderMaterial
  );
  angledNeck.position.set(0, -frameHeight / 2 - 0.28, -0.08);
  screenAssembly.add(angledNeck);

  let photoMaterial = null;
  if (work.photoImage) {
    const photoWidth = work.photoWidth ?? 0.78;
    const photoHeight = work.photoHeight ?? photoWidth / (4 / 3);
    photoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const photo = new THREE.Mesh(
      new THREE.PlaneGeometry(photoWidth, photoHeight),
      photoMaterial
    );
    photo.userData.housePhoto = true;
    photo.userData.poster = {
      id: 'house-photo-2009',
      title: '温家堡, 2009',
      category: 'Art',
      authors: 'House in the rain',
      detailImage: work.photoDetailImage || work.photoImage
    };
    photo.position.set(0, angledNeck.position.y, 0.136);
    screenAssembly.add(photo);
    photoMeshes.push(photo);
  }

  const video = document.createElement('video');
  video.className = 'gallery-video-source';
  video.poster = work.posterImage;
  video.preload = 'none';
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.disablePictureInPicture = true;
  video.tabIndex = -1;
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('playsinline', '');
  document.body.appendChild(video);

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;

  if (work.description) addStandingDisplayLabel(screenAssembly, work, frameHeight);
  if (work.launchAction) addGameLaunchButton(screenAssembly, work, frameHeight);

  const entry = {
    title: work.title,
    source: work.source,
    posterImage: work.posterImage,
    activationBounds: work.activationBounds,
    autoplayInBounds: Boolean(work.autoplayInBounds),
    autoplayOnEntry: Boolean(work.autoplayOnEntry),
    playWhenVisible: Boolean(work.playWhenVisible),
    position: new THREE.Vector3(work.x, 0, work.z),
    interactionRadius: work.interactionRadius,
    playDistance: work.playDistance,
    requireFocusForPlayback: Boolean(work.requireFocusForPlayback),
    element: video,
    frameCallback: 0,
    screen,
    photoMaterial,
    focusOutline,
    material: screenMaterial,
    supportsFrameCallback: typeof video.requestVideoFrameCallback === 'function',
    texture: videoTexture,
    preloadPriority: work.preloadPriority || 0,
    roomKey: work.roomKey,
    userPaused: false,
    playbackStarted: false,
    manualOnly: Boolean(work.manualOnly),
    manualActivated: false,
    requireInteractionRange: Boolean(work.requireInteractionRange),
    hasSound: Boolean(work.hasSound),
    autoplayWithSound: Boolean(work.autoplayWithSound),
    audioEnabled: Boolean(work.autoplayWithSound && galleryActive)
  };
  if (entry.audioEnabled) enableVideoAudio(entry);

  const activateVideoTexture = () => {
    if (screenMaterial.map !== videoTexture) {
      screenMaterial.map = videoTexture;
      screenMaterial.needsUpdate = true;
    }
    needsRender = true;
  };

  video.addEventListener('loadeddata', activateVideoTexture, { once: true });
  video.addEventListener('playing', () => {
    activateVideoTexture();
    scheduleVideoFrame(entry);
    refreshFocusCard();
  });
  video.addEventListener('pause', () => {
    cancelVideoFrame(entry);
    refreshFocusCard();
    needsRender = true;
  });
  interactionTarget.userData.videoEntry = entry;
  videoMeshes.push(interactionTarget);
  galleryVideos.push(entry);
  manualVideoEntries.push(entry);
  maybePrepareNewVideoEntry(entry);
  scene.add(group);
  if (galleryActive) requestVideoSync();
  needsRender = true;
  return entry;
}

function addStandingDisplayLabel(screenAssembly, work, frameHeight) {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 1800;
  labelCanvas.height = 250;
  const context = labelCanvas.getContext('2d');
  context.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#eef2f3';
  context.font = '700 82px Arial, Helvetica, sans-serif';
  context.fillText(work.title, labelCanvas.width / 2, 72);
  context.font = '400 38px Arial, Helvetica, sans-serif';
  context.fillText(work.description, labelCanvas.width / 2, 174);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const isLaunchLabel = Boolean(work.launchAction);
  const labelWidth = isLaunchLabel
    ? Math.min(work.frameWidth - 0.75, 2.1)
    : Math.min(work.frameWidth - 0.4, 2.45);
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(labelWidth, labelWidth * (labelCanvas.height / labelCanvas.width)),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.04,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide
    })
  );
  // Keep the caption in front of the support so the full title and description
  // remain readable at every viewing angle.
  label.position.set(isLaunchLabel ? -0.18 : 0, -frameHeight / 2 - 0.28, 0.145);
  label.renderOrder = 9;
  screenAssembly.add(label);
}

function addGameLaunchButton(screenAssembly, work, frameHeight) {
  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: 0xb3433e,
    roughness: 0.4,
    metalness: 0.05,
    emissive: 0x2b0806,
    emissiveIntensity: 0.35
  });
  // Keep the control on the title panel rather than on a separate floor stand.
  const buttonX = Math.min(work.frameWidth / 2 - 0.24, 1.12);
  const button = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.1, 32),
    buttonMaterial
  );
  button.rotation.x = Math.PI / 2;
  button.position.set(buttonX, -frameHeight / 2 - 0.28, 0.19);
  button.userData.gameAction = {
    title: work.title,
    label: work.launchAction.label,
    url: work.launchAction.url,
    position: new THREE.Vector3(),
    interactionRadius: 3.8
  };
  screenAssembly.add(button);

  const buttonLabelCanvas = document.createElement('canvas');
  buttonLabelCanvas.width = 500;
  buttonLabelCanvas.height = 240;
  const context = buttonLabelCanvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.font = '700 130px Arial, Helvetica, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(work.launchAction.label, buttonLabelCanvas.width / 2, buttonLabelCanvas.height / 2);
  const buttonLabelTexture = new THREE.CanvasTexture(buttonLabelCanvas);
  buttonLabelTexture.colorSpace = THREE.SRGBColorSpace;
  const buttonLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.34, 0.15),
    new THREE.MeshBasicMaterial({
      map: buttonLabelTexture,
      transparent: true,
      alphaTest: 0.04,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide
    })
  );
  buttonLabel.position.set(buttonX, -frameHeight / 2 - 0.28, 0.25);
  screenAssembly.add(buttonLabel);

  screenAssembly.parent?.updateMatrixWorld(true);
  button.getWorldPosition(button.userData.gameAction.position);
  videoMeshes.push(button);
}

function createHouseRainDisplay(posterTexture) {
  return createStandingVideoDisplay(HOUSE_RAIN_DISPLAY, posterTexture);
}

function replaceHouseRainPhotoTexture(entry, texture) {
  if (!entry?.photoMaterial) return;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  entry.photoMaterial.map = texture;
  entry.photoMaterial.needsUpdate = true;
  needsRender = true;
}

function replaceVideoPosterTexture(entry, texture) {
  if (!entry?.material) return;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const previousTexture = entry.material.map;
  entry.material.map = texture;
  entry.material.needsUpdate = true;
  if (previousTexture && previousTexture !== texture) previousTexture.dispose();
  needsRender = true;
}

function startArtRoomMugLoads() {
  if (artRoomMugLoadPromise) return artRoomMugLoadPromise;
  const textureLoader = new THREE.TextureLoader();
  artRoomMugLoadPromise = Promise.all(MUG_DISPLAYS.map((config) => new Promise((resolve) => {
    if (artRoomLoadedImages.has(config.texture)) {
      resolve();
      return;
    }
    artRoomLoadedImages.add(config.texture);
    textureLoader.load(
      config.texture,
      (texture) => {
        createMugDisplay(texture, config);
        resolve();
      },
      undefined,
      resolve
    );
  })));
  return artRoomMugLoadPromise;
}

function getArtApproachImage(image) {
  const cleanPath = image.split('?')[0];
  return `${cleanPath.replace('/walls/hd/', '/walls/approach/')}?v=20260720-progressive1`;
}

function loadArtWallTile(textureLoader, sheet, image, tileIndex, quality = 'approach') {
  const source = quality === 'hd' ? image : getArtApproachImage(image);
  if (artRoomLoadedImages.has(source)) return Promise.resolve();
  artRoomLoadedImages.add(source);
  return new Promise((resolve) => {
    textureLoader.load(
      source,
      (texture) => {
        addArtWallSheet(sheet, texture, tileIndex);
        resolve();
      },
      undefined,
      resolve
    );
  });
}

function loadArtWallSheetTiles(textureLoader, sheet, quality = 'approach') {
  return Promise.all(sheet.images.map((image, tileIndex) => (
    loadArtWallTile(textureLoader, sheet, image, tileIndex, quality)
  )));
}

function waitForGalleryCameraIdle(minimumIdleMs = 1200) {
  if (!galleryActive || performance.now() - lastCameraInputAt >= minimumIdleMs) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.setTimeout(() => {
      waitForGalleryCameraIdle(minimumIdleMs).then(resolve);
    }, 250);
  });
}

function startArtRoomHdUpgrades() {
  if (artRoomHdUpgradePromise) return artRoomHdUpgradePromise;
  artRoomHdUpgradePromise = (async () => {
    await waitForRoomVisualsReady(ROOM_KEYS.art);
    const textureLoader = new THREE.TextureLoader();
    const farSheet = ART_WALL_SHEETS.find((sheet) => sheet.side === 'far');
    const orderedSheets = [farSheet, ...ART_WALL_SHEETS.filter((sheet) => sheet !== farSheet)]
      .filter(Boolean);

    // Decode and swap only one 4K tile at a time. Movement resets the idle
    // window, so sprinting or rotating can never trigger the full wall burst.
    for (const sheet of orderedSheets) {
      for (let tileIndex = 0; tileIndex < sheet.images.length; tileIndex += 1) {
        await waitForGalleryCameraIdle(1400);
        await loadArtWallTile(
          textureLoader,
          sheet,
          sheet.images[tileIndex],
          tileIndex,
          'hd'
        );
        await new Promise((resolve) => window.setTimeout(resolve, 420));
      }
    }
  })();
  return artRoomHdUpgradePromise;
}

function startArtRoomLoads() {
  const mugLoadPromise = startArtRoomMugLoads();
  if (backgroundGalleryLoadsStarted) {
    roomLoadControllers.get(ROOM_KEYS.art)?.resume();
    return;
  }
  backgroundGalleryLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  const approachLoadPromises = [];
  const peripheralLoadPromises = [];
  const tshirtWallSheet = ART_WALL_SHEETS.find((sheet) => sheet.side === 'far');
  const remainingArtWallSheets = ART_WALL_SHEETS.filter((sheet) => sheet !== tshirtWallSheet);
  const jobs = [
    () => {
      if (!tshirtWallSheet) return;
      approachLoadPromises.push(loadArtWallSheetTiles(textureLoader, tshirtWallSheet));
    },
    () => createArtGallery(),
    ...remainingArtWallSheets.map((sheet) => () => {
      approachLoadPromises.push(loadArtWallSheetTiles(textureLoader, sheet));
    }),
    () => {
      const houseRainEntry = createHouseRainDisplay(createVideoPlaceholderTexture());
      peripheralLoadPromises.push(new Promise((resolve) => {
        textureLoader.load(
          HOUSE_RAIN_DISPLAY.posterImage,
          (texture) => {
            replaceVideoPosterTexture(houseRainEntry, texture);
            prepareDeferredRoomVideos(ROOM_KEYS.art);
            resolve();
          },
          undefined,
          resolve
        );
      }));
      peripheralLoadPromises.push(new Promise((resolve) => {
        textureLoader.load(
          HOUSE_RAIN_DISPLAY.photoImage,
          (texture) => {
            replaceHouseRainPhotoTexture(houseRainEntry, texture);
            resolve();
          },
          undefined,
          resolve
        );
      }));
    },
    () => {
      const houseLoader = new GLTFLoader();
      peripheralLoadPromises.push(new Promise((resolve) => {
        houseLoader.load(HOUSE_DISPLAY.model, (gltf) => {
          createHouseFloorPreview(gltf);
          createFullScaleHouse(gltf);
          resolve();
        }, undefined, (error) => {
          console.warn('Could not load childhood house model.', error);
          resolve();
        });
      }));
    },
    () => {
      artRoomPeripheralLoadPromise = Promise.all(peripheralLoadPromises);
      Promise.all([mugLoadPromise, ...approachLoadPromises])
        .then(() => markRoomVisualsReady(ROOM_KEYS.art));
    }
  ];
  roomLoadControllers.set(
    ROOM_KEYS.art,
    scheduleLowPriorityGallerySequence(
      jobs,
      0,
      360,
      () => isRoomPreparationAllowed(ROOM_KEYS.art)
    )
  );
}

function startMainRoomBackgroundLoads() {
  if (mainRoomBackgroundLoadsStarted) return;
  mainRoomBackgroundLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  figureClusters.forEach((cluster) => {
    if (mainRoomLoadedImages.has(cluster.image)) return;
    mainRoomLoadedImages.add(cluster.image);
    textureLoader.load(cluster.image, (texture) => addFigureCluster(cluster, texture));
  });
  resumePages.forEach((page) => {
    if (mainRoomLoadedImages.has(page.image)) return;
    mainRoomLoadedImages.add(page.image);
    textureLoader.load(page.image, (texture) => addResumePage(page, texture));
  });
}

function startResearchRoomLoads() {
  if (researchRoomLoadsStarted) {
    roomLoadControllers.get(ROOM_KEYS.app)?.resume();
    return;
  }
  researchRoomLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  const videoWorks = [...appDemoWorks, ...myPhysioVideoWorks];
  let remainingVisuals = videoWorks.length + myPhysioImageWorks.length;
  const markVisualReady = () => {
    remainingVisuals -= 1;
    if (remainingVisuals === 0) {
      markRoomVisualsReady(ROOM_KEYS.app);
      prepareDeferredRoomVideos(ROOM_KEYS.app);
    }
  };
  const jobs = [
    ...videoWorks.map((work) => () => {
      textureLoader.load(
        work.posterImage,
        (texture) => {
          addVideoWork(work, texture);
          markVisualReady();
        },
        undefined,
        () => {
          addVideoWork(work, createVideoPlaceholderTexture());
          markVisualReady();
        }
      );
    }),
    ...myPhysioImageWorks.map((work) => () => {
      textureLoader.load(
        work.image,
        (texture) => {
          addImageWork(work, texture);
          markVisualReady();
        },
        undefined,
        () => {
          markVisualReady();
        }
      );
    })
  ];
  roomLoadControllers.set(
    ROOM_KEYS.app,
    scheduleLowPriorityGallerySequence(
      jobs,
      0,
      260,
      () => isRoomPreparationAllowed(ROOM_KEYS.app)
    )
  );
}

function startScreeningRoomLoads() {
  if (screeningRoomLoadsStarted) {
    roomLoadControllers.get(ROOM_KEYS.screening)?.resume();
    return;
  }
  screeningRoomLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  const jobs = [() => {
    textureLoader.load(
      defenseScreeningWork.posterImage,
      (texture) => {
        addVideoWork(defenseScreeningWork, texture);
        markRoomVisualsReady(ROOM_KEYS.screening);
        prepareDeferredRoomVideos(ROOM_KEYS.screening);
      },
      undefined,
      () => {
        addVideoWork(defenseScreeningWork, createVideoPlaceholderTexture());
        markRoomVisualsReady(ROOM_KEYS.screening);
        prepareDeferredRoomVideos(ROOM_KEYS.screening);
      }
    );
  }];
  roomLoadControllers.set(
    ROOM_KEYS.screening,
    scheduleLowPriorityGallerySequence(
      jobs,
      0,
      260,
      () => isRoomPreparationAllowed(ROOM_KEYS.screening)
    )
  );
}

function startMriWallLoads() {
  if (mriWallLoadsStarted) {
    roomLoadControllers.get(ROOM_KEYS.mri)?.resume();
    return;
  }
  mriWallLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  let remainingWalls = MRI_WALL_SHEETS.length;
  const finishWall = () => {
    remainingWalls -= 1;
    if (remainingWalls > 0) return;
    ensureMriVideoDisplays();
    markRoomVisualsReady(ROOM_KEYS.mri);
  };
  const jobs = MRI_WALL_SHEETS.map((sheet) => () => {
    textureLoader.load(
      sheet.image,
      (texture) => {
        addMriWallSheet(sheet, texture);
        finishWall();
      },
      undefined,
      finishWall
    );
  });
  roomLoadControllers.set(
    ROOM_KEYS.mri,
    scheduleLowPriorityGallerySequence(
      jobs,
      0,
      420,
      () => isRoomPreparationAllowed(ROOM_KEYS.mri)
    )
  );
}

function ensureMriVideoDisplays() {
  if (mriVideoDisplaysLoaded) return;
  mriVideoDisplaysLoaded = true;
  MRI_VIDEO_WORKS.forEach((work) => addMriVideoWork(work));
  prepareDeferredRoomVideos(ROOM_KEYS.mri);
}

function startBrainWallLoads() {
  if (brainWallLoadsStarted) {
    roomLoadControllers.get(ROOM_KEYS.brain)?.resume();
    return;
  }
  brainWallLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  let remainingWalls = BRAIN_WALL_SHEETS.length;
  const finishWall = () => {
    remainingWalls -= 1;
    if (remainingWalls === 0) markRoomVisualsReady(ROOM_KEYS.brain);
  };
  roomLoadControllers.set(
    ROOM_KEYS.brain,
    scheduleLowPriorityGallerySequence(
      BRAIN_WALL_SHEETS.map((sheet) => () => {
        textureLoader.load(
          sheet.image,
          (texture) => {
            addBrainWallSheet(sheet, texture);
            finishWall();
          },
          undefined,
          finishWall
        );
      }),
      0,
      420,
      () => isRoomPreparationAllowed(ROOM_KEYS.brain)
    )
  );
}

function startGameRoomLoads() {
  if (gameRoomLoadsStarted) {
    roomLoadControllers.get(ROOM_KEYS.game)?.resume();
    return;
  }
  gameRoomLoadsStarted = true;
  const textureLoader = new THREE.TextureLoader();
  const shrimpKiosk = GAME_DISPLAY_WORKS.find((work) => work.title === 'Shrimp');
  const otherKiosks = GAME_DISPLAY_WORKS.filter((work) => work !== shrimpKiosk);
  const kioskWorks = [shrimpKiosk, ...otherKiosks].filter(Boolean);
  let readyKioskCount = 0;
  let remainingVisuals = kioskWorks.length + GAME_WALL_SHEETS.length;
  const markVisualReady = () => {
    remainingVisuals -= 1;
    if (remainingVisuals === 0) {
      markRoomVisualsReady(ROOM_KEYS.game);
      prepareDeferredRoomVideos(ROOM_KEYS.game);
    }
  };
  const markKioskReady = () => {
    readyKioskCount += 1;
    if (readyKioskCount === kioskWorks.length) gameRoomKiosksReady = true;
    markVisualReady();
  };
  const jobs = [
    ...kioskWorks.map((work) => () => {
      textureLoader.load(
        work.posterImage,
        (texture) => {
          createStandingVideoDisplay(work, texture);
          markKioskReady();
        },
        undefined,
        () => {
          createStandingVideoDisplay(work, createVideoPlaceholderTexture());
          markKioskReady();
        }
      );
    }),
    ...GAME_WALL_SHEETS.map((sheet) => () => {
      textureLoader.load(
        sheet.image,
        (texture) => {
          addGameWallSheet(sheet, texture);
          markVisualReady();
        },
        undefined,
        markVisualReady
      );
    })
  ];
  if (!kioskWorks.length) gameRoomKiosksReady = true;
  roomLoadControllers.set(
    ROOM_KEYS.game,
    scheduleLowPriorityGallerySequence(
      jobs,
      0,
      300,
      () => isRoomPreparationAllowed(ROOM_KEYS.game)
    )
  );
}

function isCameraNearRoom(room, margin = 2) {
  const roomLeft = room.centerX - room.halfWidth;
  const roomRight = room.centerX + room.halfWidth;
  const roomNear = room.nearZ;
  const roomFar = room.farZ;
  const nearestX = Math.max(roomLeft, Math.min(camera.position.x, roomRight));
  const nearestZ = Math.max(roomNear, Math.min(camera.position.z, roomFar));
  return Math.hypot(camera.position.x - nearestX, camera.position.z - nearestZ) <= margin;
}

function isCameraInsideRoom(room, margin = 0.35) {
  const roomLeft = room.centerX - room.halfWidth;
  const roomRight = room.centerX + room.halfWidth;
  return camera.position.x >= roomLeft + margin
    && camera.position.x <= roomRight - margin
    && camera.position.z >= room.nearZ + margin
    && camera.position.z <= room.farZ - margin;
}

function getDistanceToRoom(room) {
  const roomLeft = room.centerX - room.halfWidth;
  const roomRight = room.centerX + room.halfWidth;
  const nearestX = Math.max(roomLeft, Math.min(camera.position.x, roomRight));
  const nearestZ = Math.max(room.nearZ, Math.min(camera.position.z, room.farZ));
  return Math.hypot(camera.position.x - nearestX, camera.position.z - nearestZ);
}

function getGalleryRoomKeyAtCamera() {
  const containingRoom = GALLERY_ROOM_AREAS.find(({ room }) => isCameraInsideRoom(room, 0));
  if (containingRoom) return containingRoom.key;
  return GALLERY_ROOM_AREAS.reduce((nearest, candidate) => (
    getDistanceToRoom(candidate.room) < getDistanceToRoom(nearest.room) ? candidate : nearest
  )).key;
}

function allowsSpeculativeVideoPreload(connection = (
  navigator.connection || navigator.mozConnection || navigator.webkitConnection
)) {
  if (!connection) return true;
  if (connection.saveData) return false;
  return !/^(slow-2g|2g)$/.test(connection.effectiveType || '');
}

function isStationaryForSpeculativePreload(now = performance.now()) {
  return galleryActive && now - lastCameraInputAt >= SPECULATIVE_PRELOAD_DWELL_MS;
}

function isRoomPreparationAllowed(roomKey) {
  if (!galleryActive) {
    if (fullGalleryPreloadRoomKeys.has(roomKey)) return true;
    return roomKey === ROOM_KEYS.art
      && (
        previewParams.has('home-world-preview')
        || previewParams.has('home-transition-preview')
        || previewParams.has('house-rain-preview')
      );
  }
  if (currentGalleryRoomKey === roomKey) return true;
  if (fullGalleryPreloadRoomKeys.has(roomKey)) {
    return !currentGalleryRoomKey || roomVisualReadyKeys.has(currentGalleryRoomKey);
  }
  return speculativeRoomKey === roomKey
    && speculativeOriginRoomKey === currentGalleryRoomKey
    && isStationaryForSpeculativePreload();
}

function prepareGalleryRoomContent(
  roomKey,
  { speculative = false, originRoomKey = null, background = false } = {}
) {
  if (!roomKey) return;
  if (background) fullGalleryPreloadRoomKeys.add(roomKey);
  if (speculative) {
    speculativeOriginRoomKey = originRoomKey;
    speculativeRoomKey = roomKey;
  }

  if (roomKey === ROOM_KEYS.main) startMainRoomBackgroundLoads();
  if (roomKey === ROOM_KEYS.app) startResearchRoomLoads();
  if (roomKey === ROOM_KEYS.screening) startScreeningRoomLoads();
  if (roomKey === ROOM_KEYS.brain) {
    startBrainWallLoads();
    requestBrainSurfaceLoad();
  }
  if (roomKey === ROOM_KEYS.mri) {
    requestBrainSurfaceLoad();
    startMriWallLoads();
  }
  if (roomKey === ROOM_KEYS.game) startGameRoomLoads();
  if (roomKey === ROOM_KEYS.videos) requestVideoRoomLoad();
  if (roomKey === ROOM_KEYS.art) {
    startArtRoomLoads();
    if (!background) startArtRoomHdUpgrades();
  }

  if (!background) prepareRoomVideosSequentially(roomKey, { speculative, originRoomKey });
}

function prepareDeferredRoomVideos(roomKey) {
  if (currentGalleryRoomKey === roomKey) {
    prepareRoomVideosSequentially(roomKey);
    return;
  }
  if (
    speculativeRoomKey === roomKey
    && speculativeOriginRoomKey === currentGalleryRoomKey
    && isStationaryForSpeculativePreload()
  ) {
    prepareRoomVideosSequentially(roomKey, {
      speculative: true,
      originRoomKey: speculativeOriginRoomKey
    });
  }
}

function getNearestPlausibleNextRoomKey(currentRoomKey) {
  const candidates = GALLERY_ROOM_AREAS.filter(({ key }) => (
    key !== currentRoomKey && key !== previousGalleryRoomKey
  ));
  const availableCandidates = candidates.length
    ? candidates
    : GALLERY_ROOM_AREAS.filter(({ key }) => key !== currentRoomKey);
  return availableCandidates.reduce((nearest, candidate) => {
    const roomCenterZ = (candidate.room.nearZ + candidate.room.farZ) / 2;
    const nearestCenterZ = (nearest.room.nearZ + nearest.room.farZ) / 2;
    const candidateDistance = Math.hypot(
      camera.position.x - candidate.room.centerX,
      camera.position.z - roomCenterZ
    );
    const nearestDistance = Math.hypot(
      camera.position.x - nearest.room.centerX,
      camera.position.z - nearestCenterZ
    );
    return candidateDistance < nearestDistance ? candidate : nearest;
  }).key;
}

function maybeStartRoomBackgroundPreloads(now = performance.now()) {
  if (!galleryActive || !sceneReady || !currentGalleryRoomKey) return;
  if (fullGalleryPreloadStarted) return;
  if (!isStationaryForSpeculativePreload(now)) return;

  if (
    speculativeRoomKey
    && speculativeOriginRoomKey === currentGalleryRoomKey
  ) {
    prepareGalleryRoomContent(speculativeRoomKey, {
      speculative: true,
      originRoomKey: speculativeOriginRoomKey
    });
    return;
  }

  const nextRoomKey = getNearestPlausibleNextRoomKey(currentGalleryRoomKey);
  prepareGalleryRoomContent(nextRoomKey, {
    speculative: true,
    originRoomKey: currentGalleryRoomKey
  });
}

function maybeLoadNearbyRoomContent() {
  if (!galleryActive || !sceneReady) return;
  const nextCurrentRoomKey = getGalleryRoomKeyAtCamera();
  if (nextCurrentRoomKey === currentGalleryRoomKey) return;

  if (!insideHouseWorld) beginAnalyticsRoomVisit(nextCurrentRoomKey);
  previousGalleryRoomKey = currentGalleryRoomKey;
  currentGalleryRoomKey = nextCurrentRoomKey;
  speculativeOriginRoomKey = null;
  speculativeRoomKey = null;
  if (activeRoomVideoSequence?.roomKey !== currentGalleryRoomKey) {
    activeRoomVideoSequence.stopped = true;
  }
  prepareGalleryRoomContent(currentGalleryRoomKey);
}

function openResumePage() {
  sendAnalyticsEvent('resume_open', {
    room: ANALYTICS_ROOM_LABELS[analyticsRoomKey] || analyticsRoomKey || 'Unknown'
  });
  const resumeWindow = window.open('/resume/', 'puti-resume');
  if (resumeWindow) {
    resumeWindow.focus();
    return;
  }
  // A same-tab fallback keeps the résumé reachable when a browser blocks the
  // user-initiated secondary tab.
  window.location.assign('/resume/');
}

function scheduleLowPriorityGalleryWork(callback, delay = 1200) {
  window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: delay });
      return;
    }
    callback();
  }, delay);
}

function scheduleLowPriorityGallerySequence(
  jobs,
  initialDelay = 0,
  gap = 300,
  shouldContinue = () => true
) {
  let cursor = 0;
  let scheduled = false;
  let finished = false;
  const scheduleNext = (delay) => {
    if (finished || scheduled || cursor >= jobs.length) {
      if (cursor >= jobs.length) finished = true;
      return;
    }
    if (!shouldContinue()) return;
    scheduled = true;
    scheduleLowPriorityGalleryWork(() => {
      scheduled = false;
      if (!shouldContinue()) return;
      const job = jobs[cursor];
      cursor += 1;
      try {
        job();
      } finally {
        scheduleNext(gap);
      }
    }, delay);
  };
  // Leave a small gap after the room trigger so the current movement frame
  // finishes before the first background request is started.
  scheduleNext(Math.max(180, initialDelay));
  return {
    resume() {
      scheduleNext(180);
    }
  };
}

function markRoomVisualsReady(roomKey) {
  if (roomVisualReadyKeys.has(roomKey)) return;
  roomVisualReadyKeys.add(roomKey);
  const resolvers = roomVisualReadyResolvers.get(roomKey) || [];
  roomVisualReadyResolvers.delete(roomKey);
  resolvers.forEach((resolve) => resolve());
  fullGalleryPreloadRoomKeys.forEach((backgroundRoomKey) => {
    if (backgroundRoomKey !== roomKey) {
      roomLoadControllers.get(backgroundRoomKey)?.resume();
    }
  });
}

function waitForRoomVisualsReady(roomKey) {
  if (roomVisualReadyKeys.has(roomKey)) return Promise.resolve();
  return new Promise((resolve) => {
    const resolvers = roomVisualReadyResolvers.get(roomKey) || [];
    resolvers.push(resolve);
    roomVisualReadyResolvers.set(roomKey, resolvers);
  });
}

function waitForOrderedPreloadGap(delay = ORDERED_PRELOAD_PHASE_GAP_MS) {
  return new Promise((resolve) => scheduleLowPriorityGalleryWork(resolve, delay));
}

function preloadVideoEntryInBackground(entry) {
  if (entry.element.hasAttribute('src') || entry.backgroundPreloadComplete) {
    return Promise.resolve();
  }
  const existingPromise = backgroundVideoPreloadPromises.get(entry);
  if (existingPromise) return existingPromise;

  // `canplay` only means a small initial buffer is ready; the browser keeps
  // transferring that file while the next video starts. Stream the complete
  // response into the HTTP cache so background video transfers are genuinely
  // one-at-a-time. The media element receives its URL only when it is visible.
  const preloadPromise = (async () => {
    try {
      const response = await fetch(entry.source, {
        cache: 'force-cache',
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (response.body?.getReader) {
        const reader = response.body.getReader();
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      } else {
        await response.blob();
      }
      entry.backgroundPreloadComplete = true;
    } catch (error) {
      console.warn(`Could not preload ${entry.source} in the background.`, error);
      // Do not trap a room sequence retrying the same failed URL forever.
      // Normal visible playback can still request it later.
      entry.backgroundPreloadComplete = true;
    }
  })().finally(() => {
    backgroundVideoPreloadPromises.delete(entry);
  });
  backgroundVideoPreloadPromises.set(entry, preloadPromise);
  return preloadPromise;
}

async function preloadRoomVideosInBackground(roomKey) {
  if (!allowsSpeculativeVideoPreload()) return;
  const entries = galleryVideos
    .filter((entry) => entry.roomKey === roomKey)
    .sort((a, b) => (b.preloadPriority || 0) - (a.preloadPriority || 0));
  for (const entry of entries) {
    if (
      galleryActive
      && currentGalleryRoomKey
      && currentGalleryRoomKey !== roomKey
      && !roomVisualReadyKeys.has(currentGalleryRoomKey)
    ) {
      await waitForRoomVisualsReady(currentGalleryRoomKey);
    }
    await preloadVideoEntryInBackground(entry);
    await waitForOrderedPreloadGap(ORDERED_VIDEO_PRELOAD_GAP_MS);
  }
}

async function startFullGalleryBackgroundPreload() {
  // Begin as soon as the core scene is ready. When this happens before entry,
  // the loading screen turns otherwise idle time into useful room preparation.
  // The current-room checks below still take priority once the visitor enters.
  if (fullGalleryPreloadStarted || !sceneReady) return;
  fullGalleryPreloadStarted = true;
  if (currentGalleryRoomKey) fullGalleryPreloadRoomKeys.add(currentGalleryRoomKey);
  try {
    // 1. The science/main room is part of the initial loading gate.
    // 2. Prepare the defense film poster before any secondary-room content.
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.screening);
    startScreeningRoomLoads();
    await waitForRoomVisualsReady(ROOM_KEYS.screening);
    await waitForOrderedPreloadGap();

    // 3. App screenshots and video poster frames, without the video files yet.
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.app);
    startResearchRoomLoads();
    await waitForRoomVisualsReady(ROOM_KEYS.app);
    await waitForOrderedPreloadGap();

    // 4. Brain-room walls and floor.
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.brain);
    startBrainWallLoads();
    await waitForRoomVisualsReady(ROOM_KEYS.brain);
    await waitForOrderedPreloadGap();

    // 5. The cortical surface in the MRI room.
    await requestBrainSurfaceLoad();
    await waitForOrderedPreloadGap();

    // 6. Remaining MRI walls and the two embedded video poster frames.
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.mri);
    startMriWallLoads();
    await waitForRoomVisualsReady(ROOM_KEYS.mri);
    await waitForOrderedPreloadGap();

    // 7. App-room video files, one at a time. The two Art-room mugs are
    // already part of the initial loading gate so the doorway never looks
    // empty while the rest of this background queue is still running.
    await preloadRoomVideosInBackground(ROOM_KEYS.app);
    await waitForOrderedPreloadGap();

    // 8. Game-room content and all video-room poster frames. Game videos may
    // warm now; video-room files deliberately remain last.
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.game);
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.videos);
    startGameRoomLoads();
    requestVideoRoomLoad();
    await Promise.all([
      waitForRoomVisualsReady(ROOM_KEYS.game),
      waitForRoomVisualsReady(ROOM_KEYS.videos)
    ]);
    await preloadRoomVideosInBackground(ROOM_KEYS.game);
    await waitForOrderedPreloadGap();

    // 9. Everything else in the art room. Approach-resolution walls become
    // usable first; final 4K tiles then replace them one at a time while idle.
    fullGalleryPreloadRoomKeys.add(ROOM_KEYS.art);
    startArtRoomLoads();
    await waitForRoomVisualsReady(ROOM_KEYS.art);
    await Promise.all([
      startArtRoomHdUpgrades(),
      artRoomPeripheralLoadPromise || Promise.resolve()
    ]);
    await waitForOrderedPreloadGap();

    // 10. Video-room files are the final background media phase.
    await preloadRoomVideosInBackground(ROOM_KEYS.videos);
  } catch (error) {
    console.warn('Could not finish the ordered gallery preload.', error);
  }
}

function requestBrainSurfaceLoad() {
  if (brainSurfaceLoadStarted) return brainSurfaceLoadPromise || Promise.resolve();
  brainSurfaceLoadStarted = true;
  brainSurfaceLoadPromise = loadBrainSurfaceObject();
  return brainSurfaceLoadPromise;
}

function maybeLoadBrainSurface() {
  if (!galleryActive || brainSurfaceLoadStarted) return;
  const roomLeft = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
  const roomRight = BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth;
  const nearestX = Math.max(roomLeft, Math.min(camera.position.x, roomRight));
  const nearestZ = Math.max(BRAIN_ROOM.nearZ, Math.min(camera.position.z, BRAIN_ROOM.farZ));
  if (Math.hypot(camera.position.x - nearestX, camera.position.z - nearestZ) <= 12) {
    requestBrainSurfaceLoad();
  }
}

function addHouseRenderWall(group, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = HOUSE_RENDER_WALL.width / HOUSE_RENDER_WALL.aspect;
  const wallPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(HOUSE_RENDER_WALL.width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.015,
      depthWrite: false,
      toneMapped: false
    })
  );
  wallPanel.position.set(0, HOUSE_RENDER_WALL.y, 0.012);
  group.add(wallPanel);
  needsRender = true;
}

function createHouseRenderWall(textureLoader) {
  const roomLeft = ART_ROOM.centerX - ART_ROOM.halfWidth;
  const doorLeft = ART_ROOM.centerX + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2;
  const wallGroup = new THREE.Group();
  wallGroup.position.set((roomLeft + doorLeft) / 2, 0, ART_ROOM.nearZ + 0.075);
  scene.add(wallGroup);

  textureLoader.load(
    HOUSE_RENDER_WALL.image,
    (texture) => addHouseRenderWall(wallGroup, texture)
  );
}

function addArtWallSheet(sheet, texture, tileIndex = 0) {
  texture.colorSpace = THREE.SRGBColorSpace;
  // Approach and final wall tiles both sample their source directly. The
  // lower-resolution map is replaced in-place once its 4K counterpart loads.
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const tileKey = `${sheet.side}:${tileIndex}`;
  const existingMaterial = artWallTileMaterials.get(tileKey);
  if (existingMaterial) {
    const previousTexture = existingMaterial.map;
    existingMaterial.map = texture;
    existingMaterial.needsUpdate = true;
    if (previousTexture && previousTexture !== texture) previousTexture.dispose();
    needsRender = true;
    return;
  }

  const height = ART_ROOM.height;
  const width = height * sheet.aspect;
  const totalPixelWidth = sheet.tilePixelWidths.reduce((total, value) => total + value, 0);
  const tilePixelWidth = sheet.tilePixelWidths[tileIndex];
  const precedingPixelWidth = sheet.tilePixelWidths
    .slice(0, tileIndex)
    .reduce((total, value) => total + value, 0);
  const tileWidth = width * tilePixelWidth / totalPixelWidth;
  const tileCenterX = -width / 2
    + width * (precedingPixelWidth + tilePixelWidth / 2) / totalPixelWidth;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.015,
    depthWrite: false,
    toneMapped: false
  });
  artWallTileMaterials.set(tileKey, material);
  const wallSheet = new THREE.Mesh(new THREE.PlaneGeometry(tileWidth, height), material);
  wallSheet.position.set(tileCenterX, height / 2, 0);

  const group = new THREE.Group();
  const roomLeft = ART_ROOM.centerX - ART_ROOM.halfWidth;
  const roomRight = ART_ROOM.centerX + ART_ROOM.halfWidth;
  const roomMidZ = (ART_ROOM.nearZ + ART_ROOM.farZ) / 2;
  if (sheet.side === 'left') {
    group.position.set(roomLeft + 0.075, 0, roomMidZ);
    group.rotation.y = Math.PI / 2;
  } else if (sheet.side === 'right') {
    group.position.set(roomRight - 0.075, 0, roomMidZ);
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
  needsRender = true;
}

function createArtWallSheets(textureLoader) {
  ART_WALL_SHEETS.forEach((sheet) => {
    sheet.images.forEach((image, tileIndex) => {
      textureLoader.load(image, (texture) => addArtWallSheet(sheet, texture, tileIndex));
    });
  });
}

function addTshirtWork(group, work, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = work.width / work.aspect;
  const shirt = new THREE.Mesh(
    new THREE.PlaneGeometry(work.width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.015,
      toneMapped: false
    })
  );
  shirt.position.set(work.x, 3.3, 0.012);
  group.add(shirt);
  needsRender = true;
}

function createTshirtWall(textureLoader) {
  const wallGroup = new THREE.Group();
  const panelWidth = TSHIRT_TEMPLATE_PANEL.height * TSHIRT_TEMPLATE_PANEL.aspect;
  wallGroup.position.set(
    ART_ROOM.centerX - ART_ROOM.halfWidth + panelWidth / 2,
    0,
    ART_ROOM.farZ - 0.1
  );
  wallGroup.rotation.y = Math.PI;
  scene.add(wallGroup);
  textureLoader.load(
    TSHIRT_TEMPLATE_PANEL.image,
    (texture) => addArtTemplatePanel(wallGroup, TSHIRT_TEMPLATE_PANEL, texture)
  );
}

function createScreeningRoom() {
  const doorLeft = SCREENING_ROOM.centerX - SCREENING_ROOM.doorWidth / 2;
  const doorRight = SCREENING_ROOM.centerX + SCREENING_ROOM.doorWidth / 2;
  const roomLeft = SCREENING_ROOM.centerX - SCREENING_ROOM.halfWidth;
  const roomRight = SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth;
  const brainDoorCenterZ = BRAIN_HALL_CENTER_Z;
  const brainDoorNorthZ = BRAIN_HALL_NORTH_EDGE;
  const brainDoorSouthZ = BRAIN_HALL_SOUTH_EDGE;
  const floorStartZ = ROOM.halfDepth;
  const floorLength = SCREENING_ROOM.nearZ - floorStartZ;
  const roomDepth = SCREENING_ROOM.farZ - SCREENING_ROOM.nearZ;
  const darkWallMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0 });
  const darkFloorMaterial = new THREE.MeshStandardMaterial({ color: 0x0b0c0d, roughness: 1, metalness: 0 });
  const darkCeilingMaterial = new THREE.MeshStandardMaterial({ color: 0x090a0b, roughness: 1, metalness: 0 });

  const transitionWallMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: 0.96, metalness: 0 });
  const transitionFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d2cd, roughness: 1, metalness: 0 });
  const transitionCeilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf1f0ec, roughness: 1, metalness: 0 });
  const hallMidZ = floorStartZ + floorLength / 2;
  const hallWallStartZ = floorStartZ + 0.08;
  const hallWallEndZ = SCREENING_ROOM.nearZ - 0.14;
  const hallWallMidZ = (hallWallStartZ + hallWallEndZ) / 2;
  [
    { startZ: floorStartZ, endZ: hallMidZ, wallStartZ: hallWallStartZ, wallEndZ: hallWallMidZ, wallMaterial: transitionWallMaterial, floorMaterial: transitionFloorMaterial, ceilingMaterial: transitionCeilingMaterial },
    { startZ: hallMidZ, endZ: SCREENING_ROOM.nearZ, wallStartZ: hallWallMidZ, wallEndZ: hallWallEndZ, wallMaterial: darkWallMaterial, floorMaterial: darkFloorMaterial, ceilingMaterial: darkCeilingMaterial }
  ].forEach((segment) => {
    const segmentFloorLength = segment.endZ - segment.startZ;
    const segmentWallLength = segment.wallEndZ - segment.wallStartZ;
    const hallFloor = new THREE.Mesh(
      new THREE.BoxGeometry(SCREENING_ROOM.doorWidth, 0.08, segmentFloorLength),
      segment.floorMaterial
    );
    hallFloor.position.set(SCREENING_ROOM.centerX, -0.04, segment.startZ + segmentFloorLength / 2);
    scene.add(hallFloor);
    const hallCeiling = new THREE.Mesh(
      new THREE.BoxGeometry(SCREENING_ROOM.doorWidth + 0.12, 0.08, segmentWallLength),
      segment.ceilingMaterial
    );
    hallCeiling.position.set(SCREENING_ROOM.centerX, SCREENING_ROOM.doorHeight, segment.wallStartZ + segmentWallLength / 2);
    scene.add(hallCeiling);
    const hallWallGeometry = new THREE.BoxGeometry(ROOM_WALL_THICKNESS, SCREENING_ROOM.doorHeight, segmentWallLength);
    const leftHallWall = new THREE.Mesh(hallWallGeometry, segment.wallMaterial);
    leftHallWall.position.set(doorLeft - ROOM_WALL_THICKNESS / 2, SCREENING_ROOM.doorHeight / 2, segment.wallStartZ + segmentWallLength / 2);
    scene.add(leftHallWall);
    const rightHallWall = leftHallWall.clone();
    rightHallWall.position.x = doorRight + ROOM_WALL_THICKNESS / 2;
    scene.add(rightHallWall);
  });

  const roomFloor = new THREE.Mesh(
    new THREE.BoxGeometry(SCREENING_ROOM.halfWidth * 2, 0.1, roomDepth),
    darkFloorMaterial
  );
  roomFloor.position.set(SCREENING_ROOM.centerX, -0.05, SCREENING_ROOM.nearZ + roomDepth / 2);
  scene.add(roomFloor);

  const roomCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(SCREENING_ROOM.halfWidth * 2, 0.1, roomDepth),
    darkCeilingMaterial
  );
  roomCeiling.position.set(SCREENING_ROOM.centerX, SCREENING_ROOM.height, SCREENING_ROOM.nearZ + roomDepth / 2);
  scene.add(roomCeiling);

  const roomSideGeometry = new THREE.BoxGeometry(ROOM_WALL_THICKNESS, SCREENING_ROOM.height, roomDepth);
  const roomLeftWall = new THREE.Mesh(roomSideGeometry, darkWallMaterial);
  roomLeftWall.position.set(roomLeft - ROOM_WALL_THICKNESS / 2, SCREENING_ROOM.height / 2, SCREENING_ROOM.nearZ + roomDepth / 2);
  scene.add(roomLeftWall);

  const eastNorthDepth = brainDoorNorthZ - SCREENING_ROOM.nearZ;
  if (eastNorthDepth > 0) {
    const eastNorthWall = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WALL_THICKNESS, SCREENING_ROOM.height, eastNorthDepth),
      darkWallMaterial
    );
    eastNorthWall.position.set(roomRight + ROOM_WALL_THICKNESS / 2, SCREENING_ROOM.height / 2, SCREENING_ROOM.nearZ + eastNorthDepth / 2);
    scene.add(eastNorthWall);
  }

  const eastSouthDepth = SCREENING_ROOM.farZ - brainDoorSouthZ;
  const eastSouthWall = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, SCREENING_ROOM.height, eastSouthDepth),
    darkWallMaterial
  );
  eastSouthWall.position.set(roomRight + ROOM_WALL_THICKNESS / 2, SCREENING_ROOM.height / 2, brainDoorSouthZ + eastSouthDepth / 2);
  scene.add(eastSouthWall);

  const brainDoorHeaderHeight = SCREENING_ROOM.height - BRAIN_ROOM.doorHeight;
  const brainDoorHeader = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, brainDoorHeaderHeight, BRAIN_HALL_WIDTH),
    darkWallMaterial
  );
  brainDoorHeader.position.set(
    roomRight + ROOM_WALL_THICKNESS / 2,
    BRAIN_ROOM.doorHeight + brainDoorHeaderHeight / 2,
    brainDoorCenterZ
  );
  scene.add(brainDoorHeader);

  const brainDoorTrimMaterial = new THREE.MeshStandardMaterial({ color: 0x536067, roughness: 0.9, metalness: 0 });
  [brainDoorNorthZ, brainDoorSouthZ].forEach((z) => {
    const jamb = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, BRAIN_ROOM.doorHeight, 0.045),
      brainDoorTrimMaterial
    );
    jamb.position.set(roomRight - 0.075, BRAIN_ROOM.doorHeight / 2, z);
    scene.add(jamb);
  });
  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.045, BRAIN_HALL_WIDTH),
    brainDoorTrimMaterial
  );
  lintel.position.set(roomRight - 0.075, BRAIN_ROOM.doorHeight, brainDoorCenterZ);
  scene.add(lintel);

  const roomFarWall = new THREE.Mesh(
    new THREE.BoxGeometry(SCREENING_ROOM.halfWidth * 2, SCREENING_ROOM.height, ROOM_WALL_THICKNESS),
    darkWallMaterial
  );
  roomFarWall.position.set(SCREENING_ROOM.centerX, SCREENING_ROOM.height / 2, SCREENING_ROOM.farZ + ROOM_WALL_THICKNESS / 2);
  scene.add(roomFarWall);

  // Close the remaining section of the MRI/Defense boundary.  The Defense
  // room occupies the west section of this edge and the Brain room's south
  // opening starts at `roomWest`; without this short infill, the MRI room
  // could see through the gap between the two rooms as a bright wedge.
  const brainRoomWest = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
  const separatorWidth = brainRoomWest - roomRight;
  if (separatorWidth > 0) {
    const mriDefenseSeparator = new THREE.Mesh(
      new THREE.BoxGeometry(separatorWidth, EMPTY_GAME_ROOM.height, ROOM_WALL_THICKNESS),
      darkWallMaterial
    );
    mriDefenseSeparator.position.set(
      roomRight + separatorWidth / 2,
      EMPTY_GAME_ROOM.height / 2,
      SCREENING_ROOM.farZ + ROOM_WALL_THICKNESS / 2
    );
    scene.add(mriDefenseSeparator);
  }

  const nearLeftWidth = doorLeft - roomLeft;
  const nearLeftWall = new THREE.Mesh(
    new THREE.BoxGeometry(nearLeftWidth, SCREENING_ROOM.height, ROOM_WALL_THICKNESS),
    darkWallMaterial
  );
  nearLeftWall.position.set(roomLeft + nearLeftWidth / 2, SCREENING_ROOM.height / 2, SCREENING_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearLeftWall);

  const nearRightWidth = roomRight - doorRight;
  const nearRightWall = new THREE.Mesh(
    new THREE.BoxGeometry(nearRightWidth, SCREENING_ROOM.height, ROOM_WALL_THICKNESS),
    darkWallMaterial
  );
  nearRightWall.position.set(doorRight + nearRightWidth / 2, SCREENING_ROOM.height / 2, SCREENING_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(nearRightWall);

  const nearHeaderHeight = SCREENING_ROOM.height - SCREENING_ROOM.doorHeight;
  const nearHeader = new THREE.Mesh(
    new THREE.BoxGeometry(SCREENING_ROOM.doorWidth, nearHeaderHeight, ROOM_WALL_THICKNESS),
    darkWallMaterial
  );
  nearHeader.position.set(
    SCREENING_ROOM.centerX,
    SCREENING_ROOM.doorHeight + nearHeaderHeight / 2,
    SCREENING_ROOM.nearZ - ROOM_WALL_THICKNESS / 2
  );
  scene.add(nearHeader);

  const hallwayGlow = new THREE.PointLight(0xc6d2d9, 18, 7, 2);
  hallwayGlow.position.set(SCREENING_ROOM.centerX, 3.15, 9.55);
  scene.add(hallwayGlow);

  const screeningGlow = new THREE.PointLight(0xb9c6ce, 10, 9, 2);
  screeningGlow.position.set(SCREENING_ROOM.centerX, 4.25, 14.4);
  scene.add(screeningGlow);
}

function createBrainRoom() {
  const screeningEast = SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth;
  const roomWest = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
  const roomEast = BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth;
  const roomDepth = BRAIN_ROOM.farZ - BRAIN_ROOM.nearZ;
  const roomCenterZ = (BRAIN_ROOM.nearZ + BRAIN_ROOM.farZ) / 2;
  const doorCenterZ = BRAIN_HALL_CENTER_Z;
  const doorNorthZ = BRAIN_HALL_NORTH_EDGE;
  const doorSouthZ = BRAIN_HALL_SOUTH_EDGE;
  const corridorLength = roomWest - screeningEast;
  const corridorCenterX = screeningEast + corridorLength / 2;
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.98, metalness: 0 });
  const roomFloorMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, metalness: 0 });

  const corridorFloor = new THREE.Mesh(
    new THREE.BoxGeometry(corridorLength, 0.08, BRAIN_HALL_WIDTH),
    floorMaterial
  );
  corridorFloor.position.set(corridorCenterX, -0.04, doorCenterZ);
  scene.add(corridorFloor);

  const corridorCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(corridorLength, 0.08, BRAIN_HALL_WIDTH + 0.12),
    ceilingMaterial
  );
  corridorCeiling.position.set(corridorCenterX, BRAIN_ROOM.doorHeight, doorCenterZ);
  scene.add(corridorCeiling);

  [doorNorthZ - ROOM_WALL_THICKNESS / 2, doorSouthZ + ROOM_WALL_THICKNESS / 2].forEach((z) => {
    const corridorWall = new THREE.Mesh(
      new THREE.BoxGeometry(corridorLength, BRAIN_ROOM.doorHeight, ROOM_WALL_THICKNESS),
      wallMaterial
    );
    corridorWall.position.set(corridorCenterX, BRAIN_ROOM.doorHeight / 2, z);
    scene.add(corridorWall);
  });

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(BRAIN_ROOM.halfWidth * 2, 0.1, roomDepth),
    roomFloorMaterial
  );
  floor.position.set(BRAIN_ROOM.centerX, -0.05, roomCenterZ);
  scene.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(BRAIN_ROOM.halfWidth * 2, 0.1, roomDepth),
    ceilingMaterial
  );
  ceiling.position.set(BRAIN_ROOM.centerX, BRAIN_ROOM.height, roomCenterZ);
  scene.add(ceiling);

  const westNorthDepth = doorNorthZ - BRAIN_ROOM.nearZ;
  if (westNorthDepth > 0) {
    const westNorthWall = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_WALL_THICKNESS, BRAIN_ROOM.height, westNorthDepth),
      wallMaterial
    );
    westNorthWall.position.set(roomWest - ROOM_WALL_THICKNESS / 2, BRAIN_ROOM.height / 2, BRAIN_ROOM.nearZ + westNorthDepth / 2);
    scene.add(westNorthWall);
  }

  const westSouthDepth = BRAIN_ROOM.farZ - doorSouthZ;
  const westSouthWall = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, BRAIN_ROOM.height, westSouthDepth),
    wallMaterial
  );
  westSouthWall.position.set(roomWest - ROOM_WALL_THICKNESS / 2, BRAIN_ROOM.height / 2, doorSouthZ + westSouthDepth / 2);
  scene.add(westSouthWall);

  const westHeaderHeight = BRAIN_ROOM.height - BRAIN_ROOM.doorHeight;
  const westHeader = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, westHeaderHeight, BRAIN_HALL_WIDTH),
    wallMaterial
  );
  westHeader.position.set(roomWest - ROOM_WALL_THICKNESS / 2, BRAIN_ROOM.doorHeight + westHeaderHeight / 2, doorCenterZ);
  scene.add(westHeader);

  const eastWall = new THREE.Mesh(
    new THREE.BoxGeometry(ROOM_WALL_THICKNESS, BRAIN_ROOM.height, roomDepth),
    wallMaterial
  );
  eastWall.position.set(roomEast + ROOM_WALL_THICKNESS / 2, BRAIN_ROOM.height / 2, roomCenterZ);
  scene.add(eastWall);

  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(BRAIN_ROOM.halfWidth * 2, BRAIN_ROOM.height, ROOM_WALL_THICKNESS),
    wallMaterial
  );
  northWall.position.set(BRAIN_ROOM.centerX, BRAIN_ROOM.height / 2, BRAIN_ROOM.nearZ - ROOM_WALL_THICKNESS / 2);
  scene.add(northWall);

  // The south side is fully open to the dark transition into the MRI room.

  const stripMaterial = new THREE.MeshBasicMaterial({ color: 0x28363b, toneMapped: false });
  [-1.55, 1.55].forEach((offsetX) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.025, 0.065), stripMaterial);
    strip.position.set(BRAIN_ROOM.centerX + offsetX, BRAIN_ROOM.height - 0.08, roomCenterZ);
    scene.add(strip);
  });

  const brainLight = new THREE.PointLight(0xb9d0d7, 8, 7.5, 2);
  brainLight.position.set(BRAIN_ROOM.centerX, BRAIN_ROOM.height - 0.65, roomCenterZ);
  scene.add(brainLight);

  const doorwayLight = new THREE.PointLight(0x8fa4ac, 2.5, 4.5, 2);
  doorwayLight.position.set(
    roomWest + 0.7,
    BRAIN_ROOM.doorHeight - 0.35,
    doorCenterZ
  );
  scene.add(doorwayLight);

}

function addRoomHeading(text, position, rotationY, width, fontSize = 128, color = '#17191a') {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 280;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.04,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const heading = new THREE.Mesh(new THREE.PlaneGeometry(width, width * 0.175), material);
  heading.position.set(...position);
  heading.rotation.y = rotationY;
  scene.add(heading);
}

function addRoomCaption(text, position, rotationY, width, color = '#34383a') {
  const captionCanvas = document.createElement('canvas');
  captionCanvas.width = 2000;
  captionCanvas.height = 160;
  const context = captionCanvas.getContext('2d');
  context.clearRect(0, 0, captionCanvas.width, captionCanvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  let fontSize = 60;
  context.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;
  while (fontSize > 34 && context.measureText(text).width > 1970) {
    fontSize -= 1;
    context.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;
  }
  context.fillText(text, captionCanvas.width / 2, captionCanvas.height / 2);

  const texture = new THREE.CanvasTexture(captionCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.04,
    depthWrite: false,
    toneMapped: false
  });
  const captionHeight = width * (captionCanvas.height / captionCanvas.width);
  const caption = new THREE.Mesh(new THREE.PlaneGeometry(width, captionHeight), material);
  caption.position.set(...position);
  caption.rotation.y = rotationY;
  scene.add(caption);
}

function addArtCategoryHeading(parent, text, width) {
  const headingCanvas = document.createElement('canvas');
  headingCanvas.width = 1600;
  headingCanvas.height = 220;
  const context = headingCanvas.getContext('2d');
  context.clearRect(0, 0, headingCanvas.width, headingCanvas.height);
  context.fillStyle = '#161819';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  let fontSize = 132;
  context.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;
  while (fontSize > 56 && context.measureText(text).width > 1510) {
    fontSize -= 2;
    context.font = `700 ${fontSize}px Arial, Helvetica, sans-serif`;
  }
  context.fillText(text, headingCanvas.width / 2, headingCanvas.height / 2);

  const texture = new THREE.CanvasTexture(headingCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const displayWidth = Math.min(width, 5.8);
  const displayHeight = displayWidth * (headingCanvas.height / headingCanvas.width);
  const heading = new THREE.Mesh(
    new THREE.PlaneGeometry(displayWidth, displayHeight),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.03,
      depthWrite: false,
      toneMapped: false
    })
  );
  heading.position.set(0, 6.48, 0.035);
  parent.add(heading);
}

function getArtworkTitleSize(artworkWidth, featured = false) {
  const width = Math.max(0.45, artworkWidth);
  return { width, height: 0.26 };
}

function addArtworkTitle(parent, title, artworkWidth, imageHeight, featured = false) {
  const labelSize = getArtworkTitleSize(artworkWidth, featured);
  const titleCanvas = document.createElement('canvas');
  titleCanvas.height = 256;
  titleCanvas.width = Math.round(titleCanvas.height * (labelSize.width / labelSize.height));
  if (titleCanvas.width > 2048) {
    titleCanvas.height = Math.round(titleCanvas.height * (2048 / titleCanvas.width));
    titleCanvas.width = 2048;
  }
  const context = titleCanvas.getContext('2d');
  context.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
  context.fillStyle = '#17191a';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const fontSize = Math.round(titleCanvas.height * 0.28);
  const lineHeight = fontSize * 1.08;
  context.font = `600 ${fontSize}px Arial, Helvetica, sans-serif`;
  const titleLines = wrapLabelText(context, title, titleCanvas.width - 32, 2);
  const firstLineY = titleCanvas.height / 2 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, index) => {
    context.fillText(line, titleCanvas.width / 2, firstLineY + index * lineHeight);
  });

  const texture = new THREE.CanvasTexture(titleCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const titleMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(labelSize.width, labelSize.height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.03,
      depthWrite: false,
      toneMapped: false
    })
  );
  titleMesh.position.set(0, -imageHeight / 2 - 0.1 - labelSize.height / 2, 0.032);
  parent.add(titleMesh);
}

function addArtworkNote(parent, note, artworkWidth, imageHeight) {
  if (!note) return;
  const noteWidth = Math.max(2.2, Math.min(3.7, artworkWidth));
  const noteHeight = 0.48;
  const noteCanvas = document.createElement('canvas');
  noteCanvas.height = 384;
  noteCanvas.width = Math.round(noteCanvas.height * (noteWidth / noteHeight));
  if (noteCanvas.width > 2048) {
    noteCanvas.height = Math.round(noteCanvas.height * (2048 / noteCanvas.width));
    noteCanvas.width = 2048;
  }

  const context = noteCanvas.getContext('2d');
  context.clearRect(0, 0, noteCanvas.width, noteCanvas.height);
  context.fillStyle = '#34383a';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const fontSize = Math.round(noteCanvas.height * 0.2);
  const lineHeight = fontSize * 1.14;
  context.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;
  const lines = wrapLabelText(context, note, noteCanvas.width - 48, 2);
  const firstLineY = noteCanvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, noteCanvas.width / 2, firstLineY + index * lineHeight);
  });

  const texture = new THREE.CanvasTexture(noteCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const noteMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(noteWidth, noteHeight),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.03,
      depthWrite: false,
      toneMapped: false
    })
  );
  noteMesh.position.set(0, -imageHeight / 2 - 0.72, 0.032);
  parent.add(noteMesh);
}

function addArtPiece(placement, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const artGroup = new THREE.Group();
  artGroup.position.set(placement.x, placement.y, 0.04);

  const border = placement.featured ? 0.055 : 0.026;
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(placement.width + border * 2, placement.height + border * 2),
    new THREE.MeshBasicMaterial({ color: 0x101213, toneMapped: false })
  );
  frame.position.z = -0.008;
  artGroup.add(frame);

  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(placement.width, placement.height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.01,
      toneMapped: false
    })
  );
  art.position.z = 0.006;
  artGroup.add(art);

  if (!placement.hideTitle) {
    addArtworkTitle(artGroup, placement.work.title, placement.width, placement.height, placement.featured);
  }
  if (placement.featured) {
    addArtworkNote(artGroup, placement.work.note, placement.width, placement.height);
  }
  placement.parent.add(artGroup);
  needsRender = true;
}

function addArtworkCollection(placement, textures) {
  const entries = placement.work.collectionWorks
    .map((work, index) => ({ work, texture: textures[index] }))
    .filter((entry) => entry.texture);
  if (!entries.length) return;

  const collectionGroup = new THREE.Group();
  collectionGroup.position.set(placement.x, placement.y, 0.04);
  const gap = 0.045;
  const totalAspect = entries.reduce((total, entry) => total + entry.work.aspect, 0);
  const imageHeight = (placement.width - gap * (entries.length - 1)) / totalAspect;
  const widths = entries.map((entry) => entry.work.aspect * imageHeight);
  const collectionWidth = widths.reduce((total, width) => total + width, 0)
    + gap * (entries.length - 1);
  let cursorX = -collectionWidth / 2;

  entries.forEach((entry, index) => {
    const width = widths[index];
    entry.texture.colorSpace = THREE.SRGBColorSpace;
    entry.texture.minFilter = THREE.LinearMipmapLinearFilter;
    entry.texture.magFilter = THREE.LinearFilter;
    entry.texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

    const piece = new THREE.Group();
    piece.position.x = cursorX + width / 2;
    const border = 0.026;
    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(width + border * 2, imageHeight + border * 2),
      new THREE.MeshBasicMaterial({ color: 0x101213, toneMapped: false })
    );
    frame.position.z = -0.008;
    piece.add(frame);

    const image = new THREE.Mesh(
      new THREE.PlaneGeometry(width, imageHeight),
      new THREE.MeshBasicMaterial({ map: entry.texture, toneMapped: false })
    );
    image.position.z = 0.006;
    piece.add(image);
    collectionGroup.add(piece);
    cursorX += width + gap;
  });

  addArtworkTitle(collectionGroup, placement.work.title, collectionWidth, imageHeight, false);
  placement.parent.add(collectionGroup);
  needsRender = true;
}

function balanceArtRows(works, rowCount) {
  const rows = Array.from({ length: rowCount }, () => []);
  const aspectTotals = Array(rowCount).fill(0);
  const eyeLevelWorks = works.filter((work) => work.eyeLevel);
  const remainingWorks = works.filter((work) => !work.eyeLevel);
  const eyeRowIndex = eyeLevelWorks.length
    ? Math.max(0, Math.floor((rowCount - 1) / 2))
    : -1;

  eyeLevelWorks.sort((a, b) => a.index - b.index).forEach((work) => {
    rows[eyeRowIndex].push(work);
    aspectTotals[eyeRowIndex] += work.aspect;
  });

  const availableRows = rows
    .map((row, index) => index)
    .filter((index) => index !== eyeRowIndex);
  if (!availableRows.length) availableRows.push(Math.max(0, eyeRowIndex));

  [...remainingWorks].sort((a, b) => b.aspect - a.aspect).forEach((work) => {
    const lightestRow = availableRows.reduce((best, index) => (
      aspectTotals[index] < aspectTotals[best] ? index : best
    ), availableRows[0]);
    rows[lightestRow].push(work);
    aspectTotals[lightestRow] += work.aspect;
  });

  rows.forEach((row) => row.sort((a, b) => a.index - b.index));
  return { rows, eyeRowIndex };
}

function createSalonPlacements(parent, works, panelWidth, rowCount, options = {}) {
  if (!works.length) return [];
  const itemGap = 0.08;
  const rowGap = 0.08;
  const titleBlock = 0.32;
  const maxMosaicHeight = options.maxHeight || 5.15;
  const centerX = options.centerX || 0;
  const centerY = options.centerY || 3.15;
  const { rows, eyeRowIndex } = balanceArtRows(works, rowCount);
  const rowHeights = rows.map((row) => {
    const totalAspect = row.reduce((total, work) => total + work.aspect, 0);
    return (panelWidth - itemGap * (row.length - 1)) / totalAspect;
  });

  const reservedHeight = titleBlock * rows.length + rowGap * (rows.length - 1);
  const naturalImageHeight = rowHeights.reduce((total, height) => total + height, 0);
  const imageScale = Math.min(1, (maxMosaicHeight - reservedHeight) / naturalImageHeight);
  rowHeights.forEach((height, index) => { rowHeights[index] = height * imageScale; });

  const mosaicHeight = rowHeights.reduce((total, height) => total + height, 0) + reservedHeight;
  let rowTop = centerY + mosaicHeight / 2;
  if (eyeRowIndex >= 0) {
    let cursorTop = rowTop;
    let eyeRowCenter = centerY;
    rowHeights.forEach((height, index) => {
      if (index === eyeRowIndex) eyeRowCenter = cursorTop - height / 2;
      cursorTop -= height + titleBlock + rowGap;
    });
    const desiredShift = (options.eyeLevelY || 3.55) - eyeRowCenter;
    const minimumShift = 0.5 - (centerY - mosaicHeight / 2);
    const maximumShift = 5.9 - (centerY + mosaicHeight / 2);
    rowTop += Math.max(minimumShift, Math.min(maximumShift, desiredShift));
  }
  const placements = [];

  rows.forEach((row, rowIndex) => {
    const height = rowHeights[rowIndex];
    const rowWidth = row.reduce((total, work) => total + work.aspect * height, 0)
      + itemGap * (row.length - 1);
    let cursorX = -rowWidth / 2;

    row.forEach((work) => {
      const width = work.aspect * height;
      placements.push({
        parent,
        work,
        x: centerX + cursorX + width / 2,
        y: rowTop - height / 2,
        width,
        height,
        featured: Boolean(options.featured)
      });
      cursorX += width + itemGap;
    });

    rowTop -= height + titleBlock + rowGap;
  });

  return placements;
}

function createCategoryPlacements(parent, works, panel) {
  if (panel.category === 'Apartment') {
    const newWorks = ['apartment1', 'apartment2']
      .map((id) => works.find((work) => work.id === id))
      .filter(Boolean);
    const originalWorks = works
      .filter((work) => !['apartment1', 'apartment2'].includes(work.id))
      .sort((a, b) => a.index - b.index);
    const rowBottom = 2.15;
    const newHeight = 1.75;
    const originalHeight = 1.1;
    const individualGap = 0.45;
    const groupGap = 0.62;
    const originalGap = 0.06;
    const newWidths = newWorks.map((work) => work.aspect * newHeight);
    const originalWidths = originalWorks.map((work) => work.aspect * originalHeight);
    const originalGroupWidth = originalWidths.reduce((total, width) => total + width, 0)
      + originalGap * Math.max(0, originalWidths.length - 1);
    const rowWidth = newWidths.reduce((total, width) => total + width, 0)
      + individualGap * Math.max(0, newWidths.length - 1)
      + (newWorks.length && originalWorks.length ? groupGap : 0)
      + originalGroupWidth;
    let cursorX = -rowWidth / 2;
    const placements = [];

    newWorks.forEach((work, index) => {
      const width = newWidths[index];
      placements.push({
        parent,
        work,
        x: cursorX + width / 2,
        y: rowBottom + newHeight / 2,
        width,
        height: newHeight,
        featured: false
      });
      cursorX += width + (index < newWorks.length - 1 ? individualGap : groupGap);
    });

    const originalGroupStart = cursorX;
    originalWorks.forEach((work, index) => {
      const width = originalWidths[index];
      placements.push({
        parent,
        work,
        x: cursorX + width / 2,
        y: rowBottom + originalHeight / 2,
        width,
        height: originalHeight,
        featured: false,
        hideTitle: true
      });
      cursorX += width + (index < originalWorks.length - 1 ? originalGap : 0);
    });

    if (originalWorks.length) {
      const labelAnchor = new THREE.Group();
      labelAnchor.position.set(originalGroupStart + originalGroupWidth / 2, rowBottom, 0);
      parent.add(labelAnchor);
      addArtworkTitle(labelAnchor, 'home now', originalGroupWidth, 0, false);
    }
    return placements;
  }

  const featuredWorks = works.filter((work) => work.featured);
  const groupedWorks = works.filter((work) => !work.featured);
  if (!featuredWorks.length) {
    return createSalonPlacements(parent, groupedWorks, panel.width, panel.rows, {
      centerY: ART_MOSAIC_CENTER_Y,
      maxHeight: ART_MOSAIC_HEIGHT
    });
  }

  const sectionGap = 0.38;
  const featureSlotWidth = panel.width - panel.smallWidth - sectionGap;
  const featureOnLeft = panel.featureSide === 'left';
  const featureCenterX = featureOnLeft
    ? -panel.width / 2 + featureSlotWidth / 2
    : panel.width / 2 - featureSlotWidth / 2;
  const smallCenterX = featureOnLeft
    ? panel.width / 2 - panel.smallWidth / 2
    : -panel.width / 2 + panel.smallWidth / 2;

  const featureRows = featuredWorks.length <= 2 ? 1 : 2;
  const placements = createSalonPlacements(
    parent,
    featuredWorks,
    featureSlotWidth - 0.12,
    featureRows,
    {
      centerX: featureCenterX,
      centerY: ART_MOSAIC_CENTER_Y,
      maxHeight: ART_MOSAIC_HEIGHT,
      eyeLevelY: 3.55,
      featured: true
    }
  );
  placements.push(...createSalonPlacements(
    parent,
    groupedWorks,
    panel.smallWidth,
    panel.rows,
    {
      centerX: smallCenterX,
      centerY: ART_MOSAIC_CENTER_Y,
      maxHeight: ART_MOSAIC_HEIGHT
    }
  ));
  return placements;
}

function addArtTemplatePanel(parent, panel, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = panel.height || panel.width / panel.aspect;
  const width = panel.height ? panel.height * panel.aspect : panel.width;
  const template = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.015,
      depthWrite: false,
      toneMapped: false
    })
  );
  template.position.set(0, ART_ROOM.height / 2, 0.035);
  parent.add(template);
  needsRender = true;
}

function createArtGallery() {
  if (artGalleryLoadStarted) return;
  artGalleryLoadStarted = true;
  const placements = [];
  const templatePanels = [];

  ART_SALON_PANELS.forEach((panel) => {
    let works = artWorks.filter((work) => work.category === panel.category);
    if (!works.length) return;
    if (ART_PDF_CATEGORIES.has(panel.category)) return;

    const fashionWorks = works
      .filter((work) => work.collection === 'fashion-designs')
      .sort((a, b) => a.index - b.index);
    if (fashionWorks.length) {
      works = works.filter((work) => work.collection !== 'fashion-designs');
      works.push({
        id: 'fashion-designs-collection',
        index: Math.min(...fashionWorks.map((work) => work.index)),
        title: 'Fashion designs',
        category: panel.category,
        featured: false,
        eyeLevel: false,
        aspect: fashionWorks.reduce((total, work) => total + work.aspect, 0),
        collectionWorks: fashionWorks
      });
    }

    const wallGroup = new THREE.Group();
    const isLeft = panel.side === 'left';
    const isFront = panel.side === 'front';
    const isNearRight = panel.side === 'near-right';
    if (isFront) {
      wallGroup.position.set(ART_ROOM.centerX + panel.centerX, 0, ART_ROOM.farZ - 0.1);
      wallGroup.rotation.y = Math.PI;
    } else if (isNearRight) {
      const roomRight = ART_ROOM.centerX + ART_ROOM.halfWidth;
      const doorRight = ART_ROOM.centerX + ART_ROOM.doorOffsetX + ART_ROOM.doorWidth / 2;
      wallGroup.position.set((doorRight + roomRight) / 2, 0, ART_ROOM.nearZ + 0.1);
    } else {
      wallGroup.position.set(
        ART_ROOM.centerX + (isLeft ? -ART_ROOM.halfWidth + 0.1 : ART_ROOM.halfWidth - 0.1),
        0,
        panel.centerZ
      );
      wallGroup.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
    }
    scene.add(wallGroup);

    const templatePanel = ART_TEMPLATE_PANELS[panel.category];
    if (templatePanel) {
      templatePanels.push({ parent: wallGroup, ...templatePanel });
      return;
    }

    addArtCategoryHeading(wallGroup, panel.category, panel.width);
    placements.push(...createCategoryPlacements(wallGroup, works, panel));
  });

  const textureLoader = new THREE.TextureLoader();
  templatePanels.forEach((panel) => {
    textureLoader.load(panel.image, (texture) => addArtTemplatePanel(panel.parent, panel, texture));
  });
  let cursor = 0;
  let activeLoads = 0;
  const loadNext = () => {
    while (activeLoads < 4 && cursor < placements.length) {
      const placement = placements[cursor];
      cursor += 1;
      activeLoads += 1;
      if (placement.work.collectionWorks) {
        const collectionTextures = Array(placement.work.collectionWorks.length);
        let remaining = placement.work.collectionWorks.length;
        const finishCollectionLoad = () => {
          remaining -= 1;
          if (remaining > 0) return;
          addArtworkCollection(placement, collectionTextures);
          activeLoads -= 1;
          loadNext();
        };
        placement.work.collectionWorks.forEach((work, index) => {
          textureLoader.load(
            work.image,
            (texture) => {
              collectionTextures[index] = texture;
              finishCollectionLoad();
            },
            undefined,
            finishCollectionLoad
          );
        });
        continue;
      }
      textureLoader.load(
        placement.work.image,
        (texture) => {
          addArtPiece(placement, texture);
          activeLoads -= 1;
          loadNext();
        },
        undefined,
        () => {
          activeLoads -= 1;
          loadNext();
        }
      );
    }
  };
  loadNext();
}

function addFigureSalonStatement() {
  const statementCanvas = document.createElement('canvas');
  statementCanvas.width = 1800;
  statementCanvas.height = 220;
  const context = statementCanvas.getContext('2d');
  context.textBaseline = 'top';
  context.fillStyle = '#17191a';
  context.font = '400 32px Arial, Helvetica, sans-serif';
  const bodyLines = wrapLabelText(context, figureSalonStatement.body, 1720, 4);
  bodyLines.forEach((line, index) => context.fillText(line, 40, 32 + index * 44));

  const statementTexture = new THREE.CanvasTexture(statementCanvas);
  statementTexture.colorSpace = THREE.SRGBColorSpace;
  statementTexture.minFilter = THREE.LinearMipmapLinearFilter;
  statementTexture.magFilter = THREE.LinearFilter;
  statementTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const statementMaterial = new THREE.MeshBasicMaterial({
    map: statementTexture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const statement = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.342), statementMaterial);
  statement.position.set(7.95, 3.4, 6.89);
  statement.rotation.y = Math.PI;
  scene.add(statement);
}

function addDefenseStatement() {
  const statementCanvas = document.createElement('canvas');
  statementCanvas.width = 2200;
  statementCanvas.height = 1380;
  const context = statementCanvas.getContext('2d');
  context.clearRect(0, 0, statementCanvas.width, statementCanvas.height);
  context.textBaseline = 'top';
  // Keep the long-form statement legible but subdued against the dark screening room.
  context.fillStyle = '#6f7679';
  context.font = '400 38px Arial, Helvetica, sans-serif';
  const lineHeight = 56;
  const lines = wrapLabelText(context, defenseStatement, statementCanvas.width - 150, 23);
  const textTop = Math.max(70, (statementCanvas.height - lines.length * lineHeight) / 2);
  lines.forEach((line, index) => context.fillText(line, 75, textTop + index * lineHeight));

  const texture = new THREE.CanvasTexture(statementCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const statement = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 4.265), material);
  statement.position.set(
    SCREENING_ROOM.centerX - SCREENING_ROOM.halfWidth + 0.14,
    SCREENING_ROOM.height / 2,
    (SCREENING_ROOM.nearZ + SCREENING_ROOM.farZ) / 2
  );
  statement.rotation.y = Math.PI / 2;
  scene.add(statement);
}

function addDefenseIntroStatement() {
  const statementCanvas = document.createElement('canvas');
  statementCanvas.width = 3600;
  statementCanvas.height = 900;
  const context = statementCanvas.getContext('2d');
  context.clearRect(0, 0, statementCanvas.width, statementCanvas.height);
  context.textBaseline = 'top';
  context.fillStyle = DEFENSE_WALL_TEXT_COLOR;
  context.font = `700 92px ${DEFENSE_WALL_FONT_FAMILY}`;
  const statementParagraphs = [
    'This is my PhD defense presentation. The text to your left is the first paragraph of my dissertation.',
    'Archilochus said "The fox knows many things, but the hedgehog knows one big thing", doing PhD made me realized that I am not a hedgehog.'
  ];
  const lineHeight = 116;
  const paragraphGap = 30;
  const paragraphLines = statementParagraphs.map((paragraph) => wrapLabelText(context, paragraph, statementCanvas.width - 220, 23));
  const totalTextHeight = paragraphLines.reduce((height, lines) => height + lines.length * lineHeight, 0)
    + paragraphGap * (paragraphLines.length - 1);
  let textTop = Math.max(70, (statementCanvas.height - totalTextHeight) / 2);
  paragraphLines.forEach((lines) => {
    lines.forEach((line) => {
      context.fillText(line, 110, textTop);
      textTop += lineHeight;
    });
    textTop += paragraphGap;
  });

  const texture = new THREE.CanvasTexture(statementCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const statement = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.8), material);
  statement.position.set(
    SCREENING_ROOM.centerX,
    4.6,
    SCREENING_ROOM.nearZ + 0.071
  );
  scene.add(statement);
}

function addMriRoomIntroStatement() {
  const statementCanvas = document.createElement('canvas');
  statementCanvas.width = 2800;
  statementCanvas.height = 2800;
  const context = statementCanvas.getContext('2d');
  context.clearRect(0, 0, statementCanvas.width, statementCanvas.height);
  context.textBaseline = 'top';
  context.textAlign = 'center';
  context.fillStyle = '#a7a6aa';
  context.font = `400 78px ${MRI_INTRO_FONT_FAMILY}`;
  const statementParagraphs = [
    ['You are standing on my brain.'],
    [
      'This room shows briefly the basic things',
      'that I do with MRI. Most of what I do is for',
      'research, and recently I started assisting',
      'neurologists and radiologists as well.',
      'Research and significance aside, I think',
      'they just look cool.'
    ],
    [
      'The brain in the middle of the room is also',
      'my brain.'
    ]
  ];
  const lineHeight = 104;
  const paragraphGap = 140;
  const totalTextHeight = statementParagraphs.reduce((height, lines) => height + lines.length * lineHeight, 0)
    + paragraphGap * (statementParagraphs.length - 1);
  let textTop = Math.max(80, (statementCanvas.height - totalTextHeight) / 2 - 90);
  statementParagraphs.forEach((lines) => {
    lines.forEach((line) => {
      context.fillText(line, statementCanvas.width / 2, textTop);
      textTop += lineHeight;
    });
    textTop += paragraphGap;
  });

  const texture = new THREE.CanvasTexture(statementCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const wallMargin = 0.28;
  const wallLeft = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
  const wallTopZ = BRAIN_HALL_SOUTH_EDGE;
  const wallBottomZ = BRAIN_ROOM.farZ;
  const wallWidth = wallBottomZ - wallTopZ - wallMargin * 2;
  const wallHeight = BRAIN_ROOM.height - 0.42;
  const statement = new THREE.Mesh(new THREE.PlaneGeometry(wallWidth, wallHeight), material);
  statement.position.set(
    wallLeft + ROOM_WALL_THICKNESS / 2 + 0.021,
    BRAIN_ROOM.height / 2,
    wallTopZ + wallMargin + wallWidth / 2
  );
  statement.rotation.y = Math.PI / 2;
  scene.add(statement);
}

function addVideosRoomIntroStatement() {
  const statementCanvas = document.createElement('canvas');
  statementCanvas.width = 2600;
  statementCanvas.height = 1450;
  const context = statementCanvas.getContext('2d');
  context.clearRect(0, 0, statementCanvas.width, statementCanvas.height);
  context.textBaseline = 'top';
  context.fillStyle = '#a7a6aa';
  context.font = `italic 400 70px ${VIDEOS_INTRO_FONT_FAMILY}`;

  const statementParagraphs = [
    [
      'In this room, you will find five videos I',
      'made as part of a series called'
    ],
    ['Nice, Accurate, and Random Things'],
    [
      'I made them because I was procrastinating',
      'during the last year of my PhD and wanted',
      'to do something else.'
    ]
  ];
  const lineHeight = 94;
  const paragraphGap = 88;
  const totalTextHeight = statementParagraphs.reduce((height, lines) => height + lines.length * lineHeight, 0)
    + paragraphGap * (statementParagraphs.length - 1);
  let textTop = Math.max(70, (statementCanvas.height - totalTextHeight) / 2);
  statementParagraphs.forEach((lines) => {
    lines.forEach((line) => {
      context.fillText(line, 120, textTop);
      textTop += lineHeight;
    });
    textTop += paragraphGap;
  });

  const texture = new THREE.CanvasTexture(statementCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const statementWidth = 4.75;
  const statementHeight = statementWidth * statementCanvas.height / statementCanvas.width;
  const segmentLeft = VIDEOS_ROOM.centerX - VIDEOS_ROOM.halfWidth;
  const segmentRight = GAME_VIDEOS_HALL_DOOR_X - VIDEOS_ROOM.doorWidth / 2;
  const statement = new THREE.Mesh(
    new THREE.PlaneGeometry(statementWidth, statementHeight),
    material
  );
  statement.position.set(
    (segmentLeft + segmentRight) / 2,
    3.55,
    VIDEOS_ROOM.farZ - 0.021
  );
  statement.rotation.y = Math.PI;
  scene.add(statement);
}

function addGameRoomIntroStatement() {
  const statementCanvas = document.createElement('canvas');
  statementCanvas.width = 2600;
  statementCanvas.height = 1450;
  const context = statementCanvas.getContext('2d');
  context.clearRect(0, 0, statementCanvas.width, statementCanvas.height);
  context.textBaseline = 'top';
  context.textAlign = 'left';
  context.fillStyle = '#a7a6aa';
  context.font = `400 70px ${VIDEOS_INTRO_FONT_FAMILY}`;

  const statementParagraphs = [
    ['I love video games'],
    [
      'In this room you will find two of',
      'the games that I am currently',
      'developing. Both games are',
      'inspired by my real life hobbies'
    ]
  ];
  const lineHeight = 94;
  const paragraphGap = 88;
  const textBlockWidth = Math.max(
    ...statementParagraphs.flat().map((line) => context.measureText(line).width)
  );
  const textLeft = (statementCanvas.width - textBlockWidth) / 2;
  const totalTextHeight = statementParagraphs.reduce((height, lines) => height + lines.length * lineHeight, 0)
    + paragraphGap * (statementParagraphs.length - 1);
  let textTop = Math.max(70, (statementCanvas.height - totalTextHeight) / 2);
  statementParagraphs.forEach((lines) => {
    lines.forEach((line) => {
      context.fillText(line, textLeft, textTop);
      textTop += lineHeight;
    });
    textTop += paragraphGap;
  });

  const texture = new THREE.CanvasTexture(statementCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false
  });
  const wallMargin = 0.24;
  const wallX = GAME_ROOM.centerX + GAME_ROOM.halfWidth;
  const doorCenterZ = (GAME_ROOM.nearZ + GAME_ROOM.farZ) / 2 + GAME_ROOM.doorOffsetZ;
  const wallTopZ = GAME_ROOM.nearZ;
  const wallBottomZ = doorCenterZ - GAME_ROOM.doorWidth / 2;
  const statementWidth = wallBottomZ - wallTopZ - wallMargin * 2;
  const statementHeight = statementWidth * statementCanvas.height / statementCanvas.width;
  const statement = new THREE.Mesh(
    new THREE.PlaneGeometry(statementWidth, statementHeight),
    material
  );
  statement.position.set(
    wallX - ROOM_WALL_THICKNESS / 2 - 0.021,
    3.55,
    wallTopZ + wallMargin + statementWidth / 2
  );
  statement.rotation.y = -Math.PI / 2;
  scene.add(statement);
}

function addBrainWallSheet(sheet, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = BRAIN_ROOM.height;
  const roomMiddleZ = (BRAIN_ROOM.nearZ + BRAIN_ROOM.farZ) / 2;
  const westSheetStartZ = BRAIN_HALL_SOUTH_EDGE + 0.03;
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  if (sheet.side === 'floor') {
    const floorWidth = BRAIN_ROOM.halfWidth * 2 - 0.3;
    const floorDepth = BRAIN_ROOM.farZ - BRAIN_ROOM.nearZ - 0.3;
    // Rotate the artwork on the floor while preserving its original aspect
    // ratio and keeping the rotated footprint inside the room.
    const width = Math.min(floorDepth, floorWidth * sheet.aspect);
    const depth = width / sheet.aspect;
    const sheetMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material);
    sheetMesh.position.set(BRAIN_ROOM.centerX, 0.006, roomMiddleZ);
    sheetMesh.rotation.x = -Math.PI / 2;
    sheetMesh.rotation.z = -Math.PI / 2;
    scene.add(sheetMesh);
    needsRender = true;
    return;
  }
  const width = sheet.side === 'east'
    ? BRAIN_ROOM.farZ - BRAIN_ROOM.nearZ
    : sheet.side === 'west'
      ? BRAIN_ROOM.farZ - westSheetStartZ
    : BRAIN_ROOM.halfWidth * 2;
  const northWidth = sheet.side === 'north'
    ? Math.min(width, height * sheet.aspect)
    : width;
  const northHeight = sheet.side === 'north'
    ? northWidth / sheet.aspect
    : height;
  const sheetMesh = new THREE.Mesh(new THREE.PlaneGeometry(northWidth, northHeight), material);

  if (sheet.side === 'north') {
    sheetMesh.position.set(BRAIN_ROOM.centerX, northHeight / 2, BRAIN_ROOM.nearZ + 0.071);
  } else if (sheet.side === 'east') {
    sheetMesh.position.set(BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth - 0.071, BRAIN_ROOM.height / 2, roomMiddleZ);
    sheetMesh.rotation.y = -Math.PI / 2;
  } else if (sheet.side === 'west') {
    sheetMesh.position.set(
      BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth + 0.071,
      BRAIN_ROOM.height / 2,
      westSheetStartZ + width / 2
    );
    sheetMesh.rotation.y = Math.PI / 2;
  }

  scene.add(sheetMesh);
  needsRender = true;
}

function getMriWallLayout(sheet) {
  const room = EMPTY_GAME_ROOM;
  const height = room.height;
  const roomWest = room.centerX - room.halfWidth;
  const roomEast = room.centerX + room.halfWidth;
  const roomMiddleZ = (room.nearZ + room.farZ) / 2;
  const doorCenterZ = (room.nearZ + room.farZ) / 2 + room.doorOffsetZ;
  const doorNorthZ = doorCenterZ - room.doorWidth / 2;
  const wallMargin = 0.08;
  let availableSpan;
  let centerX;
  let centerZ;
  let rotationY;

  if (sheet.side === 'south') {
    availableSpan = room.halfWidth * 2 - wallMargin * 2;
    centerX = room.centerX;
    centerZ = room.farZ - 0.071;
    rotationY = Math.PI;
  } else if (sheet.side === 'east') {
    availableSpan = room.farZ - room.nearZ - wallMargin * 2;
    centerX = roomEast - 0.071;
    centerZ = roomMiddleZ;
    rotationY = -Math.PI / 2;
  } else if (sheet.side === 'west') {
    availableSpan = doorNorthZ - room.nearZ - wallMargin * 2;
    centerX = roomWest + 0.071;
    centerZ = room.nearZ + wallMargin + availableSpan / 2;
    rotationY = Math.PI / 2;
  } else {
    // The north side is open only across the Brain-room overlap. Keep the
    // sheet on the west portion so it cannot cover that passage.
    const brainRoomWest = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
    availableSpan = brainRoomWest - roomWest - wallMargin * 2;
    centerX = roomWest + wallMargin + availableSpan / 2;
    // The Defense room's far wall occupies the first wall-thickness of the
    // MRI room at this shared boundary. Put the PDF sheet on that wall's
    // MRI-facing surface so the title and video marker remain visible.
    centerZ = room.nearZ + ROOM_WALL_THICKNESS + 0.02;
    rotationY = 0;
  }

  const sourceAspect = sheet.aspect;
  const planeAspect = Math.min(sourceAspect, availableSpan / height);
  const width = planeAspect * height;
  if (sheet.side === 'east') {
    // Butt the MRI panel directly against the Brain-room panel at their
    // shared south/north edge instead of centering it with a visible seam.
    centerZ = BRAIN_ROOM.farZ + width / 2;
  } else if (sheet.side === 'west') {
    // Do the same on the west wall, where the Brain artboard ends at the
    // MRI-room north edge.
    centerZ = room.nearZ + width / 2;
  }
  const repeatX = Math.min(1, planeAspect / sourceAspect);
  const offsetX = repeatX < 1 && sheet.cropAlign !== 'left'
    ? (1 - repeatX) / 2
    : 0;
  const contentCenterNorm = sheet.contentOnly
    ? (sheet.contentCenterX - offsetX) / repeatX
    : 0.5;
  const contentShiftLocalX = sheet.contentOnly
    ? (0.5 - contentCenterNorm) * width
    : 0;
  return {
    width,
    height,
    repeatX,
    offsetX,
    contentShiftLocalX,
    centerX,
    centerZ,
    rotationY
  };
}

function addMriWallSheet(sheet, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const layout = getMriWallLayout(sheet);
  if (layout.repeatX < 1) {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.repeat.x = layout.repeatX;
    texture.offset.x = layout.offsetX;
    texture.needsUpdate = true;
  }
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: Boolean(sheet.contentOnly),
    alphaTest: sheet.contentOnly ? 0.015 : 0,
    depthWrite: !sheet.contentOnly,
    toneMapped: false,
    side: THREE.DoubleSide
  });
  const sheetMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(layout.width, layout.height),
    material
  );
  sheetMesh.renderOrder = 2;
  const shiftCos = Math.cos(layout.rotationY) * layout.contentShiftLocalX;
  const shiftSin = Math.sin(layout.rotationY) * layout.contentShiftLocalX;
  sheetMesh.position.set(
    layout.centerX + shiftCos,
    layout.height / 2,
    layout.centerZ - shiftSin
  );
  sheetMesh.rotation.y = layout.rotationY;
  scene.add(sheetMesh);
  needsRender = true;
}

function addMriVideoWork(work) {
  const sheet = MRI_WALL_SHEETS.find((candidate) => candidate.side === work.side);
  if (!sheet) return;
  const layout = getMriWallLayout(sheet);
  const rect = work.rect;
  const displayedLeft = rect.x / layout.repeatX;
  const displayedWidth = rect.width / layout.repeatX;
  const localX = (displayedLeft + displayedWidth / 2 - 0.5) * layout.width;
  const localY = (0.5 - (rect.y + rect.height / 2)) * layout.height;
  const surfaceOffset = 0.095;
  const cos = Math.cos(layout.rotationY);
  const sin = Math.sin(layout.rotationY);
  const position = [
    layout.centerX + cos * localX + sin * surfaceOffset,
    layout.height / 2 + localY,
    layout.centerZ - sin * localX + cos * surfaceOffset
  ];
  const width = layout.width * displayedWidth;
  const height = layout.height * rect.height;
  addVideoWork({
    ...work,
    width,
    aspect: width / height,
    position,
    rotationY: layout.rotationY,
    showFrame: false,
    showLabel: false,
    showFocusOutline: false,
    blackOutline: true,
    blackOutlinePadding: 0.1,
    preloadPriority: 92,
    playWhenVisible: true,
    playDistance: 100,
    activationBounds: null,
    requireFocusForPlayback: false
  }, createVideoPlaceholderTexture());
}

function readFreeSurferSurface(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0xff || bytes[1] !== 0xff || bytes[2] !== 0xfe) {
    throw new Error('Unsupported FreeSurfer surface format');
  }

  let offset = 3;
  const skipLine = () => {
    while (offset < bytes.length && bytes[offset] !== 10) offset += 1;
    offset += 1;
  };
  skipLine();
  skipLine();

  const data = new DataView(buffer);
  const vertexCount = data.getInt32(offset, false);
  offset += 4;
  const faceCount = data.getInt32(offset, false);
  offset += 4;

  const positions = new Float32Array(vertexCount * 3);
  for (let index = 0; index < positions.length; index += 1) {
    positions[index] = data.getFloat32(offset, false);
    offset += 4;
  }

  const indices = new Uint32Array(faceCount * 3);
  for (let index = 0; index < indices.length; index += 1) {
    indices[index] = data.getInt32(offset, false);
    offset += 4;
  }

  return { positions, indices };
}

function readFreeSurferAnnotation(buffer) {
  const data = new DataView(buffer);
  const decoder = new TextDecoder();
  let offset = 0;
  const readInt = () => {
    const value = data.getInt32(offset, false);
    offset += 4;
    return value;
  };
  const readString = (length) => {
    const value = decoder.decode(new Uint8Array(buffer, offset, Math.max(0, length - 1)));
    offset += length;
    return value;
  };

  const vertexCount = readInt();
  const labels = new Uint32Array(vertexCount);
  for (let index = 0; index < vertexCount; index += 1) {
    const vertexIndex = readInt();
    labels[vertexIndex] = readInt() >>> 0;
  }

  const names = new Map([[0, 'unknown']]);
  const hasColorTable = readInt();
  if (hasColorTable) {
    const tableVersion = readInt();
    let entryCount;
    if (tableVersion < 0) {
      readInt(); // maximum number of structures
      readString(readInt()); // original color-table filename
      entryCount = readInt();
    } else {
      entryCount = tableVersion;
      readString(readInt()); // original color-table filename
    }

    for (let index = 0; index < entryCount; index += 1) {
      readInt(); // structure index
      const name = readString(readInt());
      const red = readInt();
      const green = readInt();
      const blue = readInt();
      const alpha = readInt();
      const annotation = (red | (green << 8) | (blue << 16) | (alpha << 24)) >>> 0;
      names.set(annotation, name);
    }
  }

  return { labels, names };
}

function createBrainSurfaceMesh(surface, color) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(surface.positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(surface.indices, 1));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.68,
    metalness: 0.02,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(geometry, material);
}

function getBrainRegionAtHit(hit) {
  const mesh = hit?.object;
  const annotation = mesh?.userData?.annotation;
  const index = mesh?.geometry?.index;
  if (!annotation || !index || hit.faceIndex == null) return null;

  const triangleStart = hit.faceIndex * 3;
  const vertexIndices = [
    index.getX(triangleStart),
    index.getX(triangleStart + 1),
    index.getX(triangleStart + 2)
  ];
  const vertexLabels = vertexIndices.map((vertexIndex) => annotation.labels[vertexIndex] ?? 0);
  let label = vertexLabels[0];
  if (vertexLabels[1] === vertexLabels[2]) label = vertexLabels[1];
  else if (vertexLabels[0] !== vertexLabels[1] && vertexLabels[0] !== vertexLabels[2]) {
    const localHit = mesh.worldToLocal(hit.point.clone());
    const distances = vertexIndices.map((vertexIndex) => {
      const vertex = new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position, vertexIndex);
      return vertex.distanceToSquared(localHit);
    });
    label = vertexLabels[distances.indexOf(Math.min(...distances))];
  }

  const name = annotation.names.get(label) || `label ${label}`;
  const hemisphere = mesh.userData.hemisphere === 'right' ? 'Right' : 'Left';
  return { key: `${hemisphere}:${name}`, hemisphere, name };
}

function addBrainSurfaceObject(leftBuffer, rightBuffer, leftAnnotationBuffer, rightAnnotationBuffer) {
  const left = createBrainSurfaceMesh(readFreeSurferSurface(leftBuffer), 0xb8d5da);
  const right = createBrainSurfaceMesh(readFreeSurferSurface(rightBuffer), 0xd5b8b0);
  left.userData.hemisphere = 'left';
  right.userData.hemisphere = 'right';
  left.userData.annotation = readFreeSurferAnnotation(leftAnnotationBuffer);
  right.userData.annotation = readFreeSurferAnnotation(rightAnnotationBuffer);
  brainMeshes.push(left, right);
  const surfaceGroup = new THREE.Group();
  surfaceGroup.add(left, right);

  const rawBounds = new THREE.Box3().setFromObject(surfaceGroup);
  const rawCenter = rawBounds.getCenter(new THREE.Vector3());
  left.position.sub(rawCenter);
  right.position.sub(rawCenter);
  surfaceGroup.rotation.set(-Math.PI / 2, 0, 0);
  surfaceGroup.updateMatrixWorld(true);

  let bounds = new THREE.Box3().setFromObject(surfaceGroup);
  const size = bounds.getSize(new THREE.Vector3());
  const footprintScale = 4 / Math.max(size.x, size.z);
  surfaceGroup.scale.setScalar(footprintScale);
  surfaceGroup.updateMatrixWorld(true);
  bounds = new THREE.Box3().setFromObject(surfaceGroup);
  surfaceGroup.position.y = 0.02 - bounds.min.y;

  const display = new THREE.Group();
  display.position.set(
    EMPTY_GAME_ROOM.centerX,
    0,
    (EMPTY_GAME_ROOM.nearZ + EMPTY_GAME_ROOM.farZ) / 2
  );
  display.add(surfaceGroup);
  scene.add(display);
  needsRender = true;
}

function loadBrainSurfaceObject(manager = null) {
  const loadSurface = (path) => new Promise((resolve, reject) => {
    const loader = manager ? new THREE.FileLoader(manager) : new THREE.FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(path, resolve, undefined, reject);
  });

  const trackedItem = 'brain-room-surface-object';
  if (manager) manager.itemStart(trackedItem);
  return Promise.all([
    loadSurface(BRAIN_SOURCES.left),
    loadSurface(BRAIN_SOURCES.right),
    loadSurface(BRAIN_ANNOTATIONS.left),
    loadSurface(BRAIN_ANNOTATIONS.right)
  ])
    .then(([leftBuffer, rightBuffer, leftAnnotationBuffer, rightAnnotationBuffer]) => (
      addBrainSurfaceObject(leftBuffer, rightBuffer, leftAnnotationBuffer, rightAnnotationBuffer)
    ))
    .catch((error) => {
      console.warn('Could not load the brain surface object.', error);
      if (manager) manager.itemError(trackedItem);
    })
    .finally(() => {
      if (manager) manager.itemEnd(trackedItem);
    });
}

function addResumePage(page, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = page.width / page.aspect;
  const group = new THREE.Group();
  group.position.set(...page.position);
  group.rotation.y = page.rotationY;

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(page.width + 0.1, height + 0.1, 0.045),
    new THREE.MeshStandardMaterial({ color: 0x202324, roughness: 0.86, metalness: 0.03 })
  );
  frame.position.z = -0.015;
  group.add(frame);

  const pageMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(page.width, height),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  );
  pageMesh.userData.resumeLink = {
    title: page.title,
    url: page.url
  };
  pageMesh.position.z = 0.02;
  group.add(pageMesh);
  photoMeshes.push(pageMesh);

  scene.add(group);
  needsRender = true;
}

function addPoster(poster, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = poster.width / poster.aspect;
  const group = new THREE.Group();
  group.position.set(...poster.position);
  group.rotation.y = poster.rotationY;

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x171a1b,
    emissive: 0x000000,
    roughness: 0.82,
    metalness: 0.05
  });
  const frameWidth = poster.frameWidth || poster.width + 0.15;
  const frameHeight = poster.frameHeight || height + 0.15;
  const frameGeometry = poster.flatFrame
    ? new THREE.PlaneGeometry(frameWidth, frameHeight)
    : new THREE.BoxGeometry(frameWidth, frameHeight, 0.09);
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.z = poster.flatFrame ? -0.006 : -0.035;
  group.add(frame);

  const posterMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(poster.width, height), posterMaterial);
  mesh.position.z = 0.016;
  mesh.userData.poster = poster;
  mesh.userData.frame = frame;
  mesh.userData.defaultFrameColor = 0x171a1b;
  group.add(mesh);

  addWallLabel(group, poster, height);

  scene.add(group);
  posterMeshes.push(mesh);
  needsRender = true;
}

function addFigureCluster(cluster, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = cluster.width / cluster.aspect;
  const group = new THREE.Group();
  group.position.set(...cluster.position);
  group.rotation.y = cluster.rotationY;

  const mountMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0
  });
  const mount = new THREE.Mesh(new THREE.BoxGeometry(cluster.width + 0.04, height + 0.04, 0.018), mountMaterial);
  mount.position.z = -0.012;
  group.add(mount);

  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const clusterMesh = new THREE.Mesh(new THREE.PlaneGeometry(cluster.width, height), material);
  clusterMesh.position.z = 0.02;
  clusterMesh.userData.poster = cluster;
  clusterMesh.userData.frame = mount;
  clusterMesh.userData.defaultFrameColor = 0xffffff;
  group.add(clusterMesh);

  scene.add(group);
  posterMeshes.push(clusterMesh);
  needsRender = true;
}

function scheduleVideoFrame(entry) {
  const video = entry.element;
  if (!galleryActive || video.paused || entry.frameCallback || !entry.supportsFrameCallback) return;

  entry.frameCallback = video.requestVideoFrameCallback(() => {
    entry.frameCallback = 0;
    needsRender = true;
    scheduleVideoFrame(entry);
  });
}

function cancelVideoFrame(entry) {
  if (!entry.frameCallback) return;
  if (typeof entry.element.cancelVideoFrameCallback === 'function') {
    entry.element.cancelVideoFrameCallback(entry.frameCallback);
  }
  entry.frameCallback = 0;
}

function shouldPlayVideo(entry) {
  if (!galleryActive || insideHouseWorld) return false;
  if (entry.autoplayOnEntry) return true;
  if (entry.autoplayInBounds) {
    if (!entry.activationBounds) return false;
    const { minX, maxX, minZ, maxZ } = entry.activationBounds;
    return camera.position.x >= minX && camera.position.x <= maxX
      && camera.position.z >= minZ && camera.position.z <= maxZ;
  }
  if (entry.activationBounds) {
    const { minX, maxX, minZ, maxZ } = entry.activationBounds;
    const insideActivationArea = camera.position.x >= minX && camera.position.x <= maxX
      && camera.position.z >= minZ && camera.position.z <= maxZ;
    if (!insideActivationArea) return false;
  }

  entry.screen.getWorldPosition(videoWorldPosition);
  entry.screen.getWorldQuaternion(videoScreenQuaternion);
  videoScreenNormal.set(0, 0, 1).applyQuaternion(videoScreenQuaternion);
  videoToCamera.copy(camera.position).sub(videoWorldPosition).normalize();
  if (videoScreenNormal.dot(videoToCamera) <= 0.04) return false;

  if (!videoFrustum.intersectsObject(entry.screen)) return false;

  if (entry.requireFocusForPlayback) {
    raycaster.setFromCamera(pointerCenter, camera);
    raycaster.far = 7;
    const focusedHit = raycaster.intersectObjects(videoMeshes, false)[0];
    if (focusedHit?.object?.userData?.videoEntry !== entry) return false;
  }

  cameraToVideo.copy(videoWorldPosition).sub(camera.position);
  const distance = cameraToVideo.length();
  const maximumDistance = entry.requireInteractionRange
    ? entry.interactionRadius
    : entry.playDistance;
  return entry.playWhenVisible || distance <= maximumDistance;
}

function playVideoEntry(entry) {
  if (entry.userPaused || (entry.manualOnly && !entry.manualActivated)) return;
  if (!entry.element.hasAttribute('src')) {
    entry.element.preload = 'auto';
    entry.element.src = entry.source;
    entry.element.load();
  }
  const startingPlayback = !entry.playbackStarted;
  if (startingPlayback) {
    entry.element.currentTime = 0;
    // Mark this before calling play(). If visibility changes while the
    // promise is pending, the retry must resume rather than reset to frame 1.
    entry.playbackStarted = true;
  }
  const enableSoundAfterStart = entry.hasSound && entry.audioEnabled;
  if (enableSoundAfterStart) enableVideoAudio(entry);
  else entry.element.muted = true;
  const finishPlayback = () => {
    entry.playbackStarted = true;
    if (enableSoundAfterStart) {
      entry.element.muted = false;
      entry.element.defaultMuted = false;
      entry.element.removeAttribute('muted');
    }
    scheduleVideoFrame(entry);
  };
  entry.element.play().then(finishPlayback).catch(() => {
    if (!enableSoundAfterStart) return;
    entry.element.muted = true;
    entry.element.defaultMuted = true;
    entry.element.play().then(finishPlayback).catch(() => {});
  });
}

function preloadGalleryVideos() {
  const roomKey = getGalleryRoomKeyAtCamera();
  if (currentGalleryRoomKey !== roomKey) {
    previousGalleryRoomKey = currentGalleryRoomKey;
    currentGalleryRoomKey = roomKey;
    speculativeOriginRoomKey = null;
    speculativeRoomKey = null;
  }
  prepareGalleryRoomContent(roomKey);
}

function shouldContinueRoomVideoSequence(sequence) {
  if (sequence.stopped || activeRoomVideoSequence !== sequence) return false;
  if (!sequence.speculative) return currentGalleryRoomKey === sequence.roomKey;
  return allowsSpeculativeVideoPreload()
    && speculativeRoomKey === sequence.roomKey
    && speculativeOriginRoomKey === sequence.originRoomKey
    && currentGalleryRoomKey === sequence.originRoomKey
    && isStationaryForSpeculativePreload();
}

function loadNextRoomVideo(sequence) {
  sequence.loading = false;
  if (!shouldContinueRoomVideoSequence(sequence)) return;
  const entry = galleryVideos
    .filter((candidate) => (
      candidate.roomKey === sequence.roomKey
      && !candidate.element.hasAttribute('src')
      && !candidate.backgroundPreloadComplete
    ))
    .sort((a, b) => (b.preloadPriority || 0) - (a.preloadPriority || 0))[0];
  if (!entry) return;

  sequence.loading = true;
  preloadVideoEntryInBackground(entry).finally(() => {
    sequence.loading = false;
    if (!shouldContinueRoomVideoSequence(sequence)) return;
    scheduleLowPriorityGalleryWork(() => loadNextRoomVideo(sequence), 260);
  });
}

function prepareRoomVideosSequentially(
  roomKey,
  { speculative = false, originRoomKey = null } = {}
) {
  if (speculative && !allowsSpeculativeVideoPreload()) return;
  if (activeRoomVideoSequence?.roomKey === roomKey) {
    activeRoomVideoSequence.speculative = speculative;
    activeRoomVideoSequence.originRoomKey = originRoomKey;
    activeRoomVideoSequence.stopped = false;
    if (!activeRoomVideoSequence.loading) loadNextRoomVideo(activeRoomVideoSequence);
    return;
  }

  if (activeRoomVideoSequence) activeRoomVideoSequence.stopped = true;
  activeRoomVideoSequence = {
    roomKey,
    speculative,
    originRoomKey,
    loading: false,
    stopped: false
  };
  loadNextRoomVideo(activeRoomVideoSequence);
}

function maybePrepareNewVideoEntry(entry) {
  if (!galleryActive || !entry.roomKey) return;
  if (currentGalleryRoomKey === entry.roomKey) {
    prepareRoomVideosSequentially(entry.roomKey);
  }
}

function requestVideoRoomLoad() {
  if (!sceneReady) return;
  if (!galleryActive && !fullGalleryPreloadRoomKeys.has(ROOM_KEYS.videos)) return;
  videoRoomLoadRequested = true;
  startVideoRoomLoadIfReady();
}

function startVideoRoomLoadIfReady() {
  if (!videoRoomLoadRequested) return;
  if (videoRoomDisplaysLoaded) {
    roomLoadControllers.get(ROOM_KEYS.videos)?.resume();
    return;
  }
  videoRoomDisplaysLoaded = true;
  const textureLoader = new THREE.TextureLoader();
  let remaining = VIDEO_ROOM_WORKS.length;
  const finishDisplay = () => {
    remaining -= 1;
    if (remaining === 0) {
      markRoomVisualsReady(ROOM_KEYS.videos);
      prepareDeferredRoomVideos(ROOM_KEYS.videos);
    }
  };
  const jobs = VIDEO_ROOM_WORKS.map((work) => () => {
    textureLoader.load(
      work.posterImage,
      (texture) => {
        addVideoWork(work, texture);
        finishDisplay();
      },
      undefined,
      () => {
        addVideoWork(work, createVideoPlaceholderTexture());
        finishDisplay();
      }
    );
  });
  roomLoadControllers.set(
    ROOM_KEYS.videos,
    scheduleLowPriorityGallerySequence(
      jobs,
      0,
      300,
      () => isRoomPreparationAllowed(ROOM_KEYS.videos)
    )
  );
}

function primeShrimpRoomMusic() {
  if (shrimpMusicPrimed || shrimpRoomTracks.some((track) => !track.paused)) return;
  shrimpRoomTracks.forEach((track) => {
    track.muted = true;
    track.volume = 0;
  });
  const attempts = shrimpRoomTracks.map((track) => Promise.resolve(track.play()));
  Promise.all(attempts).then(() => {
    shrimpRoomTracks.forEach((track) => {
      track.pause();
      track.currentTime = 0;
      track.muted = false;
    });
    shrimpMusicPrimed = true;
    shrimpMusicPlayBlocked = false;
  }).catch(() => {
    shrimpRoomTracks.forEach((track) => {
      track.pause();
      track.muted = false;
    });
    shrimpMusicPlayBlocked = false;
  });
}

function getShrimpRoomAudioBlend() {
  if (!galleryActive) return 0;
  const wallClearance = 0.35;
  const roomLeft = GAME_ROOM.centerX - GAME_ROOM.halfWidth + wallClearance;
  const roomRight = GAME_ROOM.centerX + GAME_ROOM.halfWidth - wallClearance;
  const roomNear = GAME_ROOM.nearZ + wallClearance;
  const roomFar = GAME_ROOM.farZ - wallClearance;
  const distanceInside = Math.min(
    camera.position.x - roomLeft,
    roomRight - camera.position.x,
    camera.position.z - roomNear,
    roomFar - camera.position.z
  );
  return THREE.MathUtils.clamp(distanceInside / SHRIMP_MUSIC_FADE_DISTANCE, 0, 1);
}

function playShrimpRoomTrack(track) {
  if (!track.paused || shrimpMusicPlayPending.has(track) || shrimpMusicPlayBlocked) return;
  shrimpMusicPlayPending.add(track);
  track.play().then(() => {
    shrimpMusicPlayBlocked = false;
  }).catch(() => {
    shrimpMusicPlayBlocked = true;
  }).finally(() => {
    shrimpMusicPlayPending.delete(track);
  });
}

function updateShrimpRoomMusic(delta) {
  const blend = getShrimpRoomAudioBlend();
  shrimpRoomTracks.forEach((track, index) => {
    const targetVolume = shrimpRoomTrackVolumes[index] * blend;
    track.volume = THREE.MathUtils.damp(track.volume, targetVolume, SHRIMP_MUSIC_FADE_RATE, delta);
    if (blend > 0 && !shrimpMusicPlayBlocked) playShrimpRoomTrack(track);
    if (blend === 0 && track.volume < 0.004 && !track.paused) track.pause();
  });
}

function pauseShrimpRoomMusic() {
  shrimpRoomTracks.forEach((track) => {
    track.pause();
    track.volume = 0;
  });
}

function hideSoundReminder() {
  soundReminder.hidden = true;
}

function getSoundReminderZone() {
  if (!galleryActive || insideHouseWorld) return null;
  if (isCameraInsideRoom(GAME_ROOM, 0.15)) return ROOM_KEYS.game;
  if (isCameraInsideRoom(VIDEOS_ROOM, 0.15)) return ROOM_KEYS.videos;

  const lookingAtHouseRainDisplay = focusedManualVideo?.source === HOUSE_RAIN_DISPLAY.source;
  return lookingAtHouseRainDisplay ? 'house-rain-display' : null;
}

function updateSoundReminder() {
  soundReminder.hidden = !getSoundReminderZone();
}

function syncGalleryVideos(entries = galleryVideos) {
  camera.updateMatrixWorld();
  videoFrustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  videoFrustum.setFromProjectionMatrix(videoFrustumMatrix);

  entries.forEach((entry) => {
    const eligible = shouldPlayVideo(entry);
    if (entry.manualOnly) {
      if (!eligible) {
        entry.manualActivated = false;
        entry.userPaused = false;
      }
      if (eligible && entry.manualActivated && !entry.userPaused) {
        if (entry.element.paused) playVideoEntry(entry);
        return;
      }
      cancelVideoFrame(entry);
      entry.element.pause();
      return;
    }

    if (eligible && !entry.userPaused) {
      if (entry.element.paused) playVideoEntry(entry);
      return;
    }
    cancelVideoFrame(entry);
    entry.element.pause();
  });
}

function syncFocusLockedVideos() {
  if (!galleryActive) return;
  const entries = galleryVideos.filter((entry) => entry.requireFocusForPlayback);
  if (!entries.length) return;
  syncGalleryVideos(entries);
}

function requestVideoSync() {
  if (!galleryActive) return;
  videoSyncRequested = true;
  lastCameraInputAt = performance.now();
}

function flushVideoSync(now) {
  if (!videoSyncRequested || now - lastCameraInputAt < 180) return;
  videoSyncRequested = false;
  syncGalleryVideos();
}

function playGalleryVideos() {
  videoSyncRequested = false;
  syncGalleryVideos();
}

function playAutoplayOnEntryVideos() {
  galleryVideos.forEach((entry) => {
    if (entry.autoplayOnEntry && !entry.userPaused) playVideoEntry(entry);
  });
}

function pauseGalleryVideos() {
  galleryVideos.forEach((entry) => {
    cancelVideoFrame(entry);
    entry.element.pause();
  });
  pauseShrimpRoomMusic();
}

function createRoundedPanelGeometry(width, height, radius) {
  const left = -width / 2;
  const right = width / 2;
  const bottom = -height / 2;
  const top = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(left + radius, bottom);
  shape.lineTo(right - radius, bottom);
  shape.quadraticCurveTo(right, bottom, right, bottom + radius);
  shape.lineTo(right, top - radius);
  shape.quadraticCurveTo(right, top, right - radius, top);
  shape.lineTo(left + radius, top);
  shape.quadraticCurveTo(left, top, left, top - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);
  return new THREE.ShapeGeometry(shape, 18);
}

function createVideoFocusOutline(width, height, z = 0.038) {
  const outline = new THREE.Group();
  const thickness = Math.max(0.025, Math.min(width, height) * 0.022);
  const material = new THREE.MeshBasicMaterial({
    color: 0x46b9e8,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    toneMapped: false
  });
  const horizontalGeometry = new THREE.BoxGeometry(width + thickness * 2, thickness, 0.014);
  const verticalGeometry = new THREE.BoxGeometry(thickness, height, 0.014);
  const top = new THREE.Mesh(horizontalGeometry, material);
  top.position.y = height / 2 + thickness / 2;
  const bottom = top.clone();
  bottom.position.y = -height / 2 - thickness / 2;
  const left = new THREE.Mesh(verticalGeometry, material);
  left.position.x = -width / 2 - thickness / 2;
  const right = left.clone();
  right.position.x = width / 2 + thickness / 2;
  outline.add(top, bottom, left, right);
  outline.position.z = z;
  outline.renderOrder = 8;
  outline.visible = false;
  return outline;
}

function addDisplayFrame(group, work, height) {
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: work.frameColor ?? 0x111314,
    roughness: 0.72,
    metalness: work.device === 'phone' ? 0.22 : 0.1
  });

  if (work.device === 'phone') {
    const shellWidth = work.width + 0.2;
    const shellHeight = height + 0.3;
    const shell = new THREE.Mesh(createRoundedPanelGeometry(shellWidth, shellHeight, 0.15), frameMaterial);
    shell.position.z = -0.035;
    group.add(shell);

    const detailMaterial = new THREE.MeshBasicMaterial({ color: 0x34383a, toneMapped: false });
    const speaker = new THREE.Mesh(new THREE.BoxGeometry(work.width * 0.24, 0.028, 0.018), detailMaterial);
    speaker.position.set(0, height / 2 + 0.09, 0.012);
    group.add(speaker);

    const homeBar = new THREE.Mesh(new THREE.BoxGeometry(work.width * 0.28, 0.025, 0.018), detailMaterial);
    homeBar.position.set(0, -height / 2 - 0.09, 0.012);
    group.add(homeBar);
    return;
  }

  if (work.device === 'monitor') {
    const casing = new THREE.Mesh(new THREE.BoxGeometry(work.width + 0.22, height + 0.22, 0.11), frameMaterial);
    casing.position.z = -0.04;
    group.add(casing);

    const powerLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.018, 0.014),
      new THREE.MeshBasicMaterial({ color: 0x4fb6c9, toneMapped: false })
    );
    powerLight.position.set(work.width / 2 - 0.07, -height / 2 - 0.07, 0.025);
    group.add(powerLight);

    if (work.monitorStand !== false) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.27, 0.07), frameMaterial);
      stand.position.set(0, -height / 2 - 0.23, -0.035);
      group.add(stand);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.07, 0.12), frameMaterial);
      base.position.set(0, -height / 2 - 0.39, -0.03);
      group.add(base);
    }
    return;
  }

  const frame = new THREE.Mesh(new THREE.BoxGeometry(work.width + 0.16, height + 0.16, 0.11), frameMaterial);
  frame.position.z = -0.04;
  group.add(frame);
}

function addVideoWork(work, posterTexture) {
  posterTexture.colorSpace = THREE.SRGBColorSpace;
  posterTexture.minFilter = THREE.LinearMipmapLinearFilter;
  posterTexture.magFilter = THREE.LinearFilter;
  posterTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = work.width / work.aspect;
  const group = new THREE.Group();
  group.position.set(...work.position);
  group.rotation.y = work.rotationY;

  if (work.showFrame !== false) addDisplayFrame(group, work, height);

  const screenMaterial = new THREE.MeshBasicMaterial({ map: posterTexture, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(work.width, height), screenMaterial);
  screen.position.z = work.screenOffset ?? 0.02;
  if (work.blackOutline) {
    const blackOutlinePadding = work.blackOutlinePadding ?? 0.1;
    const blackOutline = new THREE.Mesh(
      new THREE.PlaneGeometry(work.width + blackOutlinePadding * 2, height + blackOutlinePadding * 2),
      new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false })
    );
    blackOutline.position.z = screen.position.z - 0.004;
    blackOutline.renderOrder = 3;
    group.add(blackOutline);
    screen.renderOrder = 4;
  }
  group.add(screen);
  const focusOutline = work.showFocusOutline === false
    ? new THREE.Group()
    : createVideoFocusOutline(work.width, height);
  group.add(focusOutline);

  const video = document.createElement('video');
  video.className = 'gallery-video-source';
  if (work.posterImage) video.poster = work.posterImage;
  video.preload = 'none';
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.playsInline = true;
  video.disablePictureInPicture = true;
  video.tabIndex = -1;
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('playsinline', '');
  document.body.appendChild(video);

  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.generateMipmaps = false;

  const entry = {
    title: work.title || 'Video display',
    activationBounds: work.activationBounds,
    posterImage: work.posterImage,
    element: video,
    frameCallback: 0,
    interactionRadius: work.interactionRadius || Math.min(work.playDistance || 6, 5.8),
    material: screenMaterial,
    autoplayOnEntry: Boolean(work.autoplayOnEntry),
    playWhenVisible: Boolean(work.playWhenVisible),
    playDistance: work.playDistance || 6,
    requireFocusForPlayback: Boolean(work.requireFocusForPlayback),
    preloadPriority: work.preloadPriority || 0,
    roomKey: work.roomKey,
    position: new THREE.Vector3(...work.position),
    screen,
    focusOutline,
    source: work.source,
    supportsFrameCallback: typeof video.requestVideoFrameCallback === 'function',
    texture: videoTexture,
    userPaused: false,
    playbackStarted: false,
    hasSound: Boolean(work.hasSound),
    videoRoom: Boolean(work.videoRoom),
    audioEnabled: false
  };
  if (entry.videoRoom && videoRoomAudioUnlocked) {
    entry.audioEnabled = true;
    enableVideoAudio(entry);
  }
  video.volume = entry.videoRoom ? VIDEO_ROOM_VOLUME : 1;

  const activateVideoTexture = () => {
    if (screenMaterial.map !== videoTexture) {
      screenMaterial.map = videoTexture;
      screenMaterial.needsUpdate = true;
    }
    needsRender = true;
  };

  if (!work.videoRoom) {
    video.addEventListener('loadeddata', activateVideoTexture, { once: true });
  }
  video.addEventListener('playing', () => {
    activateVideoTexture();
    scheduleVideoFrame(entry);
  });
  video.addEventListener('pause', () => {
    cancelVideoFrame(entry);
    needsRender = true;
  });

  if (work.showLabel !== false) addWallLabel(group, work, height);

  screen.userData.videoEntry = entry;
  videoMeshes.push(screen);
  galleryVideos.push(entry);
  if (work.videoRoom) videoRoomEntries.push(entry);
  maybePrepareNewVideoEntry(entry);
  scene.add(group);
  if (galleryActive) {
    if (entry.autoplayOnEntry) playVideoEntry(entry);
    else requestVideoSync();
  }
  needsRender = true;
}

function addImageWork(work, texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const height = work.width / work.aspect;
  const group = new THREE.Group();
  group.position.set(...work.position);
  group.rotation.y = work.rotationY;

  addDisplayFrame(group, work, height);

  const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(work.width, height), screenMaterial);
  screen.position.z = 0.02;
  group.add(screen);

  if (work.showLabel !== false) addWallLabel(group, work, height);
  scene.add(group);
  needsRender = true;
}

function createVideoPlaceholderTexture() {
  const placeholderCanvas = document.createElement('canvas');
  placeholderCanvas.width = 32;
  placeholderCanvas.height = 18;
  const context = placeholderCanvas.getContext('2d');
  context.fillStyle = '#000000';
  context.fillRect(0, 0, placeholderCanvas.width, placeholderCanvas.height);
  const texture = new THREE.CanvasTexture(placeholderCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function wrapLabelText(context, text, maxWidth, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
    } else if (lines.length < maxLines - 1) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`;
    }
  });

  if (line) lines.push(line);
  if (lines.length > maxLines) lines.length = maxLines;

  const finalIndex = lines.length - 1;
  if (context.measureText(lines[finalIndex]).width > maxWidth) {
    let shortened = lines[finalIndex];
    while (shortened.length && context.measureText(`${shortened}...`).width > maxWidth) {
      shortened = shortened.slice(0, -1);
    }
    lines[finalIndex] = `${shortened.trim()}...`;
  }

  return lines;
}

function fitLabelFontSize(context, text, maxWidth, startSize, minSize) {
  let fontSize = startSize;
  context.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;

  while (fontSize > minSize && context.measureText(text).width > maxWidth) {
    fontSize -= 1;
    context.font = `400 ${fontSize}px Arial, Helvetica, sans-serif`;
  }

  return fontSize;
}

function addWallLabel(group, poster, posterHeight) {
  const labelWidth = poster.labelWidth || Math.min(Math.max(poster.width, 2.5), 3.8);
  const artworkWidth = poster.frameWidth || poster.width;
  const showCategory = poster.showCategory !== false;
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 1600;
  labelCanvas.height = 380;
  const labelHeight = labelWidth * (labelCanvas.height / labelCanvas.width);
  const context = labelCanvas.getContext('2d');

  context.textBaseline = 'top';
  context.fillStyle = poster.labelColor || '#17191a';
  if (showCategory) {
    context.font = '700 34px Arial, Helvetica, sans-serif';
    context.fillText(poster.category.toUpperCase(), 18, 18);

    context.font = '700 52px Arial, Helvetica, sans-serif';
    const titleLines = wrapLabelText(context, poster.title, 1564, 2);
    titleLines.forEach((line, index) => context.fillText(line, 18, 68 + index * 58));

    if (poster.showMeta !== false) {
      context.fillStyle = poster.labelMetaColor || '#34383a';
      const meta = poster.labelMeta || poster.authors;
      const metaFontSize = poster.labelMetaFontSize || 36;
      context.font = `400 ${metaFontSize}px Arial, Helvetica, sans-serif`;
      if (poster.labelMetaSingleLine) {
        fitLabelFontSize(context, meta, 1564, metaFontSize, 20);
      }
      const metaLines = poster.labelMetaSingleLine ? [meta] : wrapLabelText(context, meta, 1564, 2);
      metaLines.forEach((line, index) => context.fillText(line, 18, 230 + index * 43));
    }
  } else {
    context.font = '700 66px Arial, Helvetica, sans-serif';
    const titleLines = wrapLabelText(context, poster.title, 1564, 2);
    titleLines.forEach((line, index) => context.fillText(line, 18, 20 + index * 72));

    if (poster.showMeta !== false) {
      context.fillStyle = poster.labelMetaColor || '#34383a';
      context.font = '400 48px Arial, Helvetica, sans-serif';
      const subtitle = poster.labelMeta || poster.authors;
      const subtitleLines = wrapLabelText(context, subtitle, 1564, 2);
      const subtitleY = 46 + titleLines.length * 72;
      subtitleLines.forEach((line, index) => context.fillText(line, 18, subtitleY + index * 56));
    }
  }

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.minFilter = THREE.LinearMipmapLinearFilter;
  labelTexture.magFilter = THREE.LinearFilter;
  labelTexture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());

  const labelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
    alphaTest: 0.06,
    depthWrite: false,
    toneMapped: false
  });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(labelWidth, labelHeight), labelMaterial);
  let frameExtent = (poster.frameHeight || posterHeight + 0.15) / 2;
  if (poster.device === 'phone') frameExtent = posterHeight / 2 + 0.15;
  if (poster.device === 'monitor') {
    frameExtent = posterHeight / 2 + (poster.monitorStand === false ? 0.11 : 0.43);
  }
  const edgeGap = poster.labelEdgeGap ?? 0.16;
  const labelY = poster.labelPlacement === 'top'
    ? frameExtent + edgeGap + labelHeight / 2
    : -frameExtent - edgeGap - labelHeight / 2;
  label.position.set(-artworkWidth / 2 + labelWidth / 2, labelY, 0.022);
  group.add(label);
}

function updateFocusedPoster() {
  if (!galleryActive) return false;
  if (insideHouseWorld) {
    const hadFocus = Boolean(focusedPoster || focusedPhoto || focusedResumeLink || focusedManualVideo || focusedGameAction || focusedBrainRegion);
    focusedPoster = null;
    focusedPhoto = null;
    focusedResumeLink = null;
    focusedManualVideo = null;
    focusedGameAction = null;
    focusedBrainRegion = null;
    focusCard.hidden = true;
    reticle.classList.remove('active');
    return hadFocus;
  }
  raycaster.setFromCamera(pointerCenter, camera);
  raycaster.far = 7;
  const hit = raycaster.intersectObjects(posterMeshes.concat(photoMeshes), false)[0];
  const nextPoster = hit?.object?.userData?.poster || null;
  const nextPhoto = hit?.object?.userData?.housePhoto ? nextPoster : null;
  const nextResumeLink = hit?.object?.userData?.resumeLink || null;
  const videoHit = nextPoster || nextResumeLink ? null : raycaster.intersectObjects(videoMeshes, false)[0];
  const gameAction = videoHit?.object?.userData?.gameAction || null;
  const videoEntry = videoHit?.object?.userData?.videoEntry || null;
  const brainHit = nextPoster || videoHit ? null : raycaster.intersectObjects(brainMeshes, false)[0];
  const nextBrainRegion = brainHit ? getBrainRegionAtHit(brainHit) : null;
  if (videoEntry) videoEntry.screen.getWorldPosition(videoWorldPosition);
  const videoInRange = videoEntry
    && camera.position.distanceTo(videoWorldPosition) <= videoEntry.interactionRadius;
  const nextManualVideo = videoInRange
    && (!videoEntry.manualOnly || shouldPlayVideo(videoEntry))
    ? videoEntry
    : null;
  const actionInRange = gameAction
    && camera.position.distanceTo(gameAction.position) <= gameAction.interactionRadius;
  const nextGameAction = actionInRange ? gameAction : null;

  if (nextPoster === focusedPoster
    && nextPhoto === focusedPhoto
    && nextResumeLink === focusedResumeLink
    && nextManualVideo === focusedManualVideo
    && nextGameAction === focusedGameAction
    && nextBrainRegion?.key === focusedBrainRegion?.key) return false;

  posterMeshes.forEach((mesh) => {
    const active = mesh.userData.poster === nextPoster;
    mesh.userData.frame.material.color.set(active ? 0x176789 : mesh.userData.defaultFrameColor);
    mesh.userData.frame.material.emissive.set(active ? 0x092c3a : 0x000000);
  });
  galleryVideos.forEach((entry) => {
    if (entry.focusOutline) entry.focusOutline.visible = entry === nextManualVideo;
  });

  focusedPoster = nextPoster;
  focusedPhoto = nextPhoto;
  focusedResumeLink = nextResumeLink;
  focusedManualVideo = nextManualVideo;
  focusedGameAction = nextGameAction;
  focusedBrainRegion = nextBrainRegion;
  // Static artwork still highlights under the reticle, but only videos and
  // active buttons and brain regions get the instructional tooltip card.
  focusCard.hidden = !nextPhoto && !nextResumeLink && !nextManualVideo && !nextGameAction && !nextBrainRegion;
  focusCard.classList.toggle('video-focus', Boolean(focusedManualVideo));
  if (!focusedManualVideo && !focusedGameAction) focusCard.classList.remove('is-playing');
  reticle.classList.toggle('active', Boolean(focusedPoster || focusedPhoto || focusedResumeLink || focusedManualVideo || focusedGameAction || focusedBrainRegion));
  if (focusedPhoto || focusedResumeLink || focusedManualVideo || focusedGameAction || focusedBrainRegion) refreshFocusCard();
  return true;
}

function isWalkablePosition(x, z) {
  if (insideHouseWorld) return isHouseWorldWalkablePosition(x, z);
  const wallClearance = 0.35;
  const insideHallway = (room, minZ, maxZ) => {
    const doorCenter = room.centerX + (room.doorOffsetX || 0);
    const doorLeft = doorCenter - room.doorWidth / 2;
    const doorRight = doorCenter + room.doorWidth / 2;
    return x >= doorLeft + 0.24 && x <= doorRight - 0.24 && z >= minZ && z <= maxZ;
  };
  const insideRoom = (room) => {
    const roomLeft = room.centerX - room.halfWidth;
    const roomRight = room.centerX + room.halfWidth;
    return x >= roomLeft + wallClearance && x <= roomRight - wallClearance
      && z >= room.nearZ + wallClearance && z <= room.farZ - wallClearance;
  };

  const mainRoom = x >= -ROOM.halfWidth + 0.65 && x <= ROOM.halfWidth - 0.65
    && z >= -ROOM.halfDepth + 0.65 && z <= ROOM.halfDepth - 0.45;
  const screeningHallway = insideHallway(SCREENING_ROOM, 6.2, SCREENING_ROOM.nearZ + wallClearance);
  const screeningRoom = insideRoom(SCREENING_ROOM);
  const brainHallway = x >= SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth - 0.5
    && x <= BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth + 0.5
    && z >= BRAIN_HALL_NORTH_EDGE + 0.24
    && z <= BRAIN_HALL_SOUTH_EDGE - 0.24;
  const insideBrainRoom = insideRoom(BRAIN_ROOM);
  const clearOfBrain = Math.hypot(
    (x - EMPTY_GAME_ROOM.centerX) / 2.25,
    (z - (EMPTY_GAME_ROOM.nearZ + EMPTY_GAME_ROOM.farZ) / 2) / 2.45
  ) >= 1;
  const brainRoom = insideBrainRoom;
  const appHallway = insideHallway(APP_ROOM, 6.2, APP_ROOM.nearZ + wallClearance);
  const appRoom = insideRoom(APP_ROOM);
  const gameDoorCenterZ = (GAME_ROOM.nearZ + GAME_ROOM.farZ) / 2 + GAME_ROOM.doorOffsetZ;
  const gameHallway = x >= GAME_ROOM.centerX + GAME_ROOM.halfWidth - 0.5
    && x <= APP_ROOM.centerX - APP_ROOM.halfWidth + 0.5
    && z >= gameDoorCenterZ - GAME_ROOM.doorWidth / 2 + 0.24
    && z <= gameDoorCenterZ + GAME_ROOM.doorWidth / 2 - 0.24;
  const insideGameRoom = insideRoom(GAME_ROOM);
  const clearOfGameDisplays = GAME_DISPLAY_WORKS.every(
    (display) => Math.hypot(x - display.x, z - display.z) >= 0.92
  );
  const gameRoom = insideGameRoom && clearOfGameDisplays;
  const videosHallway = x >= GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2 + 0.24
    && x <= GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2 - 0.24
    && z >= VIDEOS_ROOM.farZ - wallClearance
    && z <= GAME_ROOM.nearZ + wallClearance;
  const videosRoom = insideRoom(VIDEOS_ROOM);
  const emptyGameDoorCenterZ = (EMPTY_GAME_ROOM.nearZ + EMPTY_GAME_ROOM.farZ) / 2 + EMPTY_GAME_ROOM.doorOffsetZ;
  const emptyGameHallway = x >= APP_ROOM.centerX + APP_ROOM.halfWidth - 0.5
    && x <= EMPTY_GAME_ROOM.centerX - EMPTY_GAME_ROOM.halfWidth + 0.5
    && z >= emptyGameDoorCenterZ - EMPTY_GAME_ROOM.doorWidth / 2 + 0.24
    && z <= emptyGameDoorCenterZ + EMPTY_GAME_ROOM.doorWidth / 2 - 0.24;
  const brainMriConnection = x >= Math.max(
    BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth,
    EMPTY_GAME_ROOM.centerX - EMPTY_GAME_ROOM.halfWidth
  ) + wallClearance
    && x <= Math.min(
      BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth,
      EMPTY_GAME_ROOM.centerX + EMPTY_GAME_ROOM.halfWidth
    ) - wallClearance
    && z >= BRAIN_ROOM.farZ - wallClearance
    && z <= EMPTY_GAME_ROOM.nearZ + wallClearance;
  const emptyGameRoom = insideRoom(EMPTY_GAME_ROOM) && clearOfBrain;
  const artHallway = insideHallway(
    ART_ROOM,
    ART_ROOM.hallStartZ - wallClearance,
    ART_ROOM.nearZ + wallClearance
  );
  const insideArtRoom = insideRoom(ART_ROOM);
  const clearOfMugDisplays = MUG_DISPLAYS.every(
    (display) => Math.hypot(x - display.x, z - display.z) >= 0.92
  );
  const clearOfManualVideoDisplays = manualVideoEntries.every(
    (entry) => Math.hypot(x - entry.position.x, z - entry.position.z) >= 0.82
  );
  const artRoom = insideArtRoom && clearOfMugDisplays && clearOfManualVideoDisplays;
  return mainRoom || screeningHallway || screeningRoom || brainHallway || brainRoom
    || appHallway || appRoom || gameHallway || gameRoom || videosHallway || videosRoom || emptyGameHallway || brainMriConnection || emptyGameRoom
    || artHallway || artRoom;
}

function updateMovement(delta) {
  if (!galleryActive || portalTransitioning || posterDialog.open || !posterIndex.hidden) return false;
  const speed = insideHouseWorld ? HOUSE_WORLD_MOVE_SPEED : 4.35;
  const maxMoveSubstep = insideHouseWorld ? HOUSE_WORLD_MOVE_SUBSTEP : 0.08;
  const forward = Number(pressedKeys.has('KeyW')) - Number(pressedKeys.has('KeyS'));
  const sideways = Number(pressedKeys.has('KeyD')) - Number(pressedKeys.has('KeyA'));
  const previousX = camera.position.x;
  const previousY = camera.position.y;
  const previousZ = camera.position.z;

  const requestedDistance = speed * delta * Math.hypot(forward, sideways);
  const stepCount = Math.max(1, Math.ceil(requestedDistance / maxMoveSubstep));
  const forwardStep = forward * speed * delta / stepCount;
  const sidewaysStep = sideways * speed * delta / stepCount;

  for (let step = 0; step < stepCount; step += 1) {
    const stepStartX = camera.position.x;
    const stepStartZ = camera.position.z;
    if (forward) controls.moveForward(forwardStep);
    if (sideways) controls.moveRight(sidewaysStep);

    const targetX = camera.position.x;
    const targetZ = camera.position.z;
    if (isHomePortalCrossing(targetX, targetZ, stepStartZ)) {
      camera.position.set(stepStartX, camera.position.y, stepStartZ);
      beginPortalTransition('home');
      break;
    }
    if (isHouseWorldPortalCrossing(targetX, targetZ, stepStartX)) {
      camera.position.set(stepStartX, camera.position.y, stepStartZ);
      beginPortalTransition('gallery');
      break;
    }
    if (insideHouseWorld) {
      moveHouseWorldPlayer(stepStartX, stepStartZ, targetX, targetZ);
      continue;
    }
    if (!isWalkablePosition(targetX, targetZ)) {
      camera.position.set(stepStartX, camera.position.y, stepStartZ);
      if (isWalkablePosition(targetX, stepStartZ)) camera.position.x = targetX;
      if (isWalkablePosition(camera.position.x, targetZ)) camera.position.z = targetZ;
    }
  }

  if (jumpVelocity !== 0 || jumpOffset > 0) {
    const previousJumpOffset = jumpOffset;
    const jumpGravity = JUMP_GRAVITY * (insideHouseWorld ? HOUSE_WORLD_PLAYER_SCALE : 1);
    jumpVelocity -= jumpGravity * delta;
    jumpOffset += jumpVelocity * delta;

    // An edge drop can cross over the main stairs or another exterior deck.
    // Catch that surface as the feet pass it instead of continuing through the
    // mesh to the nominal ground-level landing below.
    if (insideHouseWorld && houseWorldEdgeDropActive && jumpVelocity <= 0 && jumpOffset > 0) {
      const previousFootY = houseWorldGroundY + previousJumpOffset;
      const nextFootY = houseWorldGroundY + jumpOffset;
      const landingSurfaceY = getHouseWalkableSurfaceY(
        camera.position.x,
        camera.position.z,
        previousFootY
      );
      if (landingSurfaceY !== null
        && landingSurfaceY > houseWorldGroundY + 0.04
        && previousFootY >= landingSurfaceY
        && nextFootY <= landingSurfaceY + 0.04) {
        houseWorldGroundY = landingSurfaceY;
        houseWorldCameraGroundY = landingSurfaceY;
        if (landingSurfaceY > 0.22) houseWorldDropGroundOverride = false;
        jumpOffset = 0;
        jumpVelocity = 0;
        houseWorldEdgeDropActive = false;
      }
    }
    if (jumpOffset <= 0) {
      jumpOffset = 0;
      jumpVelocity = 0;
      houseWorldEdgeDropActive = false;
    }
  }
  const crouchTarget = pressedKeys.has('ArrowDown') ? 1 : 0;
  crouchAmount = THREE.MathUtils.damp(crouchAmount, crouchTarget, 14, delta);
  if (insideHouseWorld) {
    // Snap upward onto each stair immediately so the camera can never lag
    // below a riser. Keep the gentler interpolation only while descending.
    houseWorldCameraGroundY = houseWorldGroundY > houseWorldCameraGroundY
      ? houseWorldGroundY
      : THREE.MathUtils.damp(houseWorldCameraGroundY, houseWorldGroundY, 18, delta);
  } else {
    houseWorldCameraGroundY = 0;
  }
  const eyeHeight = insideHouseWorld ? HOUSE_WORLD_EYE_HEIGHT : STANDING_EYE_HEIGHT;
  const groundY = insideHouseWorld ? houseWorldCameraGroundY : 0;
  const crouchDrop = CROUCH_DROP * (insideHouseWorld ? HOUSE_WORLD_PLAYER_SCALE : 1);
  camera.position.y = groundY + eyeHeight - crouchDrop * crouchAmount + jumpOffset;

  const moved = Boolean(forward || sideways || Math.abs(camera.position.y - previousY) > 0.0001);
  if (moved) requestVideoSync();
  return moved;
}

function animate(now) {
  animationFrame = window.requestAnimationFrame(animate);
  if (document.hidden || !renderer) return;
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  const moved = updateMovement(delta);
  const portalAnimated = updateHomePortalEffects(now);
  maybeLoadNearbyRoomContent();
  maybeStartRoomBackgroundPreloads(now);
  syncFocusLockedVideos();
  updateShrimpRoomMusic(delta);
  updateSoundReminder();
  flushVideoSync(now);
  const focusChanged = updateFocusedPoster();
  refreshFocusedVideoTime();
  const fallbackVideoPlaying = galleryVideos
    .some((entry) => !entry.supportsFrameCallback && !entry.element.paused && entry.element.readyState >= 2);
  if (needsRender || moved || focusChanged || fallbackVideoPlaying || portalAnimated) {
    renderer.render(scene, camera);
    needsRender = false;
  }
}

function resize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCoarsePointer ? 1.25 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  needsRender = true;
}

function warmInitialCamera() {
  if (!renderer || !scene || !camera) return;

  const originalPosition = camera.position.clone();
  const originalQuaternion = camera.quaternion.clone();
  const yawAxis = new THREE.Vector3(0, 1, 0);
  const yawQuaternion = new THREE.Quaternion();
  const warmupYawOffsets = [-Math.PI, -2.1, -1.05, 0, 1.05, 2.1];

  warmupYawOffsets.forEach((offset) => {
    yawQuaternion.setFromAxisAngle(yawAxis, offset);
    camera.position.copy(originalPosition);
    camera.quaternion.copy(yawQuaternion).multiply(originalQuaternion);
    camera.updateMatrixWorld();
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
  });

  camera.position.copy(originalPosition);
  camera.quaternion.copy(originalQuaternion);
  camera.updateMatrixWorld();
  needsRender = true;
}

function warmPreparedRoomCameras() {
  if (!renderer || !scene || !camera || galleryActive) return;

  const originalPosition = camera.position.clone();
  const originalQuaternion = camera.quaternion.clone();
  const yawAxis = new THREE.Vector3(0, 1, 0);
  const yawQuaternion = new THREE.Quaternion();
  const roomKeysToWarm = new Set([ROOM_KEYS.main, ...roomVisualReadyKeys]);
  const warmupYawOffsets = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

  GALLERY_ROOM_AREAS.forEach(({ key, room }) => {
    if (!roomKeysToWarm.has(key)) return;
    camera.position.set(
      room.centerX,
      Math.min(STANDING_EYE_HEIGHT, ROOM.height / 2),
      (room.nearZ + room.farZ) / 2
    );
    warmupYawOffsets.forEach((offset) => {
      yawQuaternion.setFromAxisAngle(yawAxis, offset);
      camera.quaternion.copy(yawQuaternion);
      camera.updateMatrixWorld();
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
    });
  });

  camera.position.copy(originalPosition);
  camera.quaternion.copy(originalQuaternion);
  camera.updateMatrixWorld();
  needsRender = true;
}

function animateLoadingProgress() {
  if (loadingProgressAnimation) return;
  const tick = () => {
    const elapsed = Math.max(0, performance.now() - initialLoadingStartedAt);
    const gateRatio = Math.min(1, elapsed / INITIAL_LOADING_MIN_DURATION_MS);
    // Move steadily from 0–96% across the useful four-second preload gate.
    // If real asset work takes longer, continue creeping toward 99% instead
    // of displaying a frozen percentage while still reserving 100% for ready.
    const timedProgress = gateRatio < 1
      ? gateRatio * 96
      : 96 + 3 * (1 - Math.exp(-(elapsed - INITIAL_LOADING_MIN_DURATION_MS) / 3000));
    loadingDisplayProgress = Math.max(loadingDisplayProgress, Math.min(99, timedProgress));
    loadingBar.style.width = `${loadingDisplayProgress}%`;
    loadingStatus.textContent = `${Math.round(loadingDisplayProgress)}%`;
    loadingProgressAnimation = window.requestAnimationFrame(tick);
  };
  loadingProgressAnimation = window.requestAnimationFrame(tick);
}

function completeInitialLoading() {
  sceneReady = true;
  queueGalleryMiniatureRefreshes();
  // Start the ordered secondary-room queue while the minimum loading gate is
  // still visible. Large video files retain their later positions in the queue.
  startFullGalleryBackgroundPreload();
  // Compile the poster-only initial room while the preload queue gets started.
  warmInitialCamera();

  const elapsed = performance.now() - initialLoadingStartedAt;
  const remaining = Math.max(0, INITIAL_LOADING_MIN_DURATION_MS - elapsed);
  // Perform the heavier multi-room render shortly before the gate ends so it
  // is included in the requested wait instead of extending it afterward.
  window.setTimeout(() => {
    warmPreparedRoomCameras();
  }, Math.max(0, remaining - 650));
  window.setTimeout(() => {
    if (loadingProgressAnimation) {
      window.cancelAnimationFrame(loadingProgressAnimation);
      loadingProgressAnimation = 0;
    }
    loadingDisplayProgress = 100;
    loadingBar.style.width = '100%';
    loadingStatus.textContent = '100%';
    window.setTimeout(() => {
      loadingScreen.hidden = true;
      showWelcome('initial');
    }, 220);
  }, remaining);
}

function finishLoading() {
  completeInitialLoading();
}

function getInitialVideoPosterImages() {
  const mriVideoPosterSheets = MRI_VIDEO_WORKS
    .map((work) => MRI_WALL_SHEETS.find((sheet) => sheet.side === work.side)?.image)
    .filter(Boolean);
  return [...new Set([
    videoWork.posterImage,
    defenseScreeningWork.posterImage,
    ...appDemoWorks.map((work) => work.posterImage),
    ...myPhysioVideoWorks.map((work) => work.posterImage),
    ...GAME_DISPLAY_WORKS.map((work) => work.posterImage),
    ...VIDEO_ROOM_WORKS.map((work) => work.posterImage),
    HOUSE_RAIN_DISPLAY.posterImage,
    ...mriVideoPosterSheets
  ].filter(Boolean))];
}

function showMobileFallback() {
  loadingScreen.hidden = true;
  welcomeScreen.hidden = false;
  welcomeScreen.classList.remove('house-paused');
  welcomeEyebrow.textContent = '3D gallery · Desktop only';
  welcomeTitle.textContent = 'Please visit from a laptop.';
  welcomeCopy.textContent = 'This 3D gallery needs a keyboard and mouse. In the meantime, you can view my résumé.';
  enterButton.hidden = true;
  galleryDestinationButton.hidden = true;
  movementGuide.hidden = true;
  controlSummary.hidden = true;
  helpButton.hidden = true;
  resumeButton.textContent = 'View résumé';
  resumeButton.classList.remove('secondary-button');
  resumeButton.classList.add('primary-button');
}

function enableDragLookFallback() {
  if (!galleryActive || controls?.isLocked) return;
  dragLookEnabled = true;
  galleryApp.classList.add('drag-look');
    setWalkHint();
  needsRender = true;
}

function enterGallery() {
  if (!sceneReady || !webglAvailable || isMobileDevice) return;
  const firstEntry = !enteredOnce;
  enteredOnce = true;
  galleryActive = true;
  if (firstEntry) sendAnalyticsEvent('gallery_enter');
  videoRoomAudioUnlocked = true;
  galleryVideos.forEach((entry) => {
    if (entry.videoRoom || entry.autoplayWithSound) {
      entry.audioEnabled = true;
      enableVideoAudio(entry);
    }
  });
  primeShrimpRoomMusic();
  preloadGalleryVideos();
  resumeAnalyticsRoomTracking();
  startFullGalleryBackgroundPreload();
  if (insideHouseWorld) pauseGalleryVideos();
  else playAutoplayOnEntryVideos();
  requestVideoSync();
  scheduleLowPriorityGalleryWork(() => startMainRoomBackgroundLoads(), 700);
  dragLookEnabled = false;
  galleryApp.classList.remove('drag-look', 'dragging-view');
  setWalkHint();
  pressedKeys.clear();
  resetPlayerHeight();
  hideWelcome();
  activateHousePreviewIfRequested();
  needsRender = true;

  try {
    const lockRequest = document.body.requestPointerLock();
    if (lockRequest?.catch) lockRequest.catch(enableDragLookFallback);
  } catch (error) {
    enableDragLookFallback();
  }

  window.setTimeout(() => {
    if (galleryActive && !controls?.isLocked) enableDragLookFallback();
  }, 420);
}

function initializeGallery() {
  if (isMobileDevice) {
    showMobileFallback();
    return;
  }
  if (document.fonts?.load) {
    // Warm the wall-text font in parallel with renderer and texture setup.
    // Waiting here made the loading screen sit at its CSS 4% start position
    // until the font request completed, even though the gallery had not
    // begun its actual asset queue yet.
    Promise.all([
      document.fonts.load('400 78px "Inter"'),
      document.fonts.load('italic 400 70px "Inter"')
    ]).catch(() => {});
  }
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isCoarsePointer,
      powerPreference: 'high-performance',
      alpha: false
    });
  } catch (error) {
    webglAvailable = false;
    loadingScreen.hidden = true;
    enterButton.hidden = true;
    controlSummary.textContent = '3D graphics are unavailable in this browser. The full poster index remains available.';
    showWelcome('initial');
    return;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xe5e4e0, 1);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe5e4e0);
  scene.fog = new THREE.Fog(0xe5e4e0, 22, 78);

  camera = new THREE.PerspectiveCamera(67, window.innerWidth / window.innerHeight, 0.08, 100);
  camera.position.set(0.8, ROOM.height / 2, 1.5);
  camera.lookAt(9.36, ROOM.height / 2, 0.2);
  if (previewParams.has('house-rain-preview')) {
    camera.position.set(
      HOUSE_RAIN_DISPLAY.x + 3.2,
      STANDING_EYE_HEIGHT,
      HOUSE_RAIN_DISPLAY.z
    );
    camera.lookAt(
      HOUSE_RAIN_DISPLAY.x,
      (HOUSE_RAIN_DISPLAY.positionY ?? 0) + HOUSE_RAIN_DISPLAY.screenY,
      HOUSE_RAIN_DISPLAY.z
    );
  } else if (previewParams.has('brain-preview')) {
    const brainCenterZ = (EMPTY_GAME_ROOM.nearZ + EMPTY_GAME_ROOM.farZ) / 2;
    camera.position.set(EMPTY_GAME_ROOM.centerX, 2.4, EMPTY_GAME_ROOM.nearZ + 2.2);
    camera.lookAt(EMPTY_GAME_ROOM.centerX, 0.9, brainCenterZ);
  } else if (previewParams.has('home-preview') || previewParams.has('home-transition-preview')) {
    camera.position.set(HOME_PORTAL.x, STANDING_EYE_HEIGHT, HOME_PORTAL.z + 4.5);
    camera.lookAt(HOME_PORTAL.x, STANDING_EYE_HEIGHT, HOME_PORTAL.z);
  }

  controls = new PointerLockControls(camera, document.body);
  controls.pointerSpeed = 0.82;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.78;

  controls.addEventListener('lock', () => {
    enteredOnce = true;
    galleryActive = true;
    primeShrimpRoomMusic();
    preloadGalleryVideos();
    resumeAnalyticsRoomTracking();
    startFullGalleryBackgroundPreload();
    if (insideHouseWorld) pauseGalleryVideos();
    else playAutoplayOnEntryVideos();
    requestVideoSync();
    scheduleLowPriorityGalleryWork(() => startMainRoomBackgroundLoads(), 700);
    dragLookEnabled = false;
    galleryApp.classList.remove('drag-look', 'dragging-view');
    setWalkHint();
    pressedKeys.clear();
    resetPlayerHeight();
    hideWelcome();
    activateHousePreviewIfRequested();
    needsRender = true;
  });

  controls.addEventListener('change', () => {
    requestVideoSync();
    needsRender = true;
  });

  controls.addEventListener('unlock', () => {
    finishAnalyticsRoomVisit();
    galleryActive = false;
    pauseShrimpRoomMusic();
    dragLookEnabled = false;
    draggingView = false;
    galleryApp.classList.remove('drag-look', 'dragging-view');
    pressedKeys.clear();
    if (eHoldTimer) window.clearTimeout(eHoldTimer);
    eHoldTimer = 0;
    eHoldTarget = null;
    eHoldTriggered = false;
    eHoldWasPlaying = false;
    focusedPoster = null;
    focusedPhoto = null;
    focusedResumeLink = null;
    focusedManualVideo = null;
    focusedGameAction = null;
    posterMeshes.forEach((mesh) => {
      mesh.userData.frame.material.color.set(mesh.userData.defaultFrameColor);
      mesh.userData.frame.material.emissive.set(0x000000);
    });
    reticle.classList.remove('active');
    if (!posterDialog.open && posterIndex.hidden && !helpDialog.open) {
      showWelcome(insideHouseWorld ? 'house-paused' : 'paused');
    }
  });

  document.addEventListener('pointerlockerror', enableDragLookFallback);

  createRoom();
  createHomePortalSurface();
  createHouseWorldShell();
  if (
    previewParams.has('home-world-preview')
    || previewParams.has('home-transition-preview')
    || previewParams.has('house-rain-preview')
  ) {
    startArtRoomLoads();
  }
  const manager = new THREE.LoadingManager();
  manager.onLoad = finishLoading;
  manager.onError = () => {
    loadingStatus.textContent = `${Math.round(loadingDisplayProgress)}%`;
  };

  // The visible progress follows the useful preload window rather than cached
  // request bursts, so it keeps moving smoothly even on repeat visits.
  animateLoadingProgress();

  const textureLoader = new THREE.TextureLoader(manager);
  posters.forEach((poster) => {
    textureLoader.load(poster.wallImage, (texture) => addPoster(poster, texture));
  });
  // The two resume pages are visible in the first Research room. Include them
  // in the initial gate so visitors do not enter an otherwise empty room.
  resumePages.forEach((page) => {
    mainRoomLoadedImages.add(page.image);
    textureLoader.load(page.image, (texture) => addResumePage(page, texture));
  });
  // The paper-figure sheet is also visible in the first Research room, so it
  // must be ready before the camera warm-up runs.
  figureClusters.forEach((cluster) => {
    mainRoomLoadedImages.add(cluster.image);
    textureLoader.load(cluster.image, (texture) => addFigureCluster(cluster, texture));
  });
  // These two small textures are the first visible hint of the Art room from
  // the App hallway. Place the mugs during the initial loading gate; all other
  // Art-room walls, models, and media retain their later background priority.
  MUG_DISPLAYS.forEach((config) => {
    if (artRoomLoadedImages.has(config.texture)) return;
    artRoomLoadedImages.add(config.texture);
    textureLoader.load(
      config.texture,
      (texture) => createMugDisplay(texture, config),
      undefined,
      () => artRoomLoadedImages.delete(config.texture)
    );
  });
  // Cache every film/demo poster before the visitor can enter. Room loaders
  // can then place their screens immediately, while the much larger video
  // files remain in the ordered post-entry queue.
  getInitialVideoPosterImages()
    .filter((image) => image !== videoWork.posterImage)
    .forEach((image) => {
      textureLoader.load(image, (texture) => texture.dispose(), undefined, () => {});
    });
  textureLoader.load(videoWork.posterImage, (texture) => addVideoWork(videoWork, texture));
  resize();
  window.addEventListener('resize', resize, { passive: true });
  animationFrame = window.requestAnimationFrame(animate);
}

enterButton.addEventListener('click', enterGallery);

galleryDestinationButton.addEventListener('click', () => {
  if (insideHouseWorld) exitHouseWorld();
  enterGallery();
});

closeIndexButton.addEventListener('click', hideCatalog);

helpButton?.addEventListener('click', () => {
  finishAnalyticsRoomVisit();
  galleryActive = false;
  pauseGalleryVideos();
  controls?.unlock();
  helpDialog.showModal();
});

helpDialog.addEventListener('close', () => {
  showWelcome(insideHouseWorld ? 'house-paused' : (enteredOnce ? 'paused' : 'initial'));
});

document.querySelectorAll('[data-poster]').forEach((button) => {
  button.addEventListener('click', () => openPoster(posterById.get(button.dataset.poster)));
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyE' && posterDialog.open) {
    event.preventDefault();
    posterDialog.close();
    return;
  }

  if (
    galleryActive
    && focusedManualVideo
    && (event.code === 'ArrowLeft' || event.code === 'ArrowRight')
  ) {
    event.preventDefault();
    pressedKeys.delete(event.code);
    if (!event.repeat) {
      seekVideoEntry(focusedManualVideo, event.code === 'ArrowLeft' ? -5 : 5);
    }
    return;
  }

  const movementKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowDown'];
  if (movementKeys.includes(event.code)) {
    pressedKeys.add(event.code);
    if (galleryActive) event.preventDefault();
  }
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (galleryActive) event.preventDefault();
    if (!event.repeat) startJump();
  }
  if (event.code === 'KeyE' && focusedResumeLink && galleryActive) {
    event.preventDefault();
    if (!event.repeat) openResumePage();
    return;
  }
  if (event.code === 'KeyE' && focusedGameAction && galleryActive) {
    event.preventDefault();
    if (!event.repeat) launchGameAction(focusedGameAction);
    return;
  }
  if (event.code === 'KeyE' && focusedManualVideo && galleryActive) {
    event.preventDefault();
    if (event.repeat) return;
    if (eHoldTimer) window.clearTimeout(eHoldTimer);
    eHoldTarget = focusedManualVideo;
    eHoldTriggered = false;
    eHoldWasPlaying = !eHoldTarget.element.paused;
    if (!eHoldWasPlaying) toggleManualVideo(eHoldTarget);
    eHoldTimer = window.setTimeout(() => {
      eHoldTimer = 0;
      eHoldTriggered = true;
      restartVideoEntry(eHoldTarget);
    }, 1000);
    return;
  }
  if (event.code === 'KeyE' && focusedPoster && galleryActive) {
    event.preventDefault();
    openPoster(focusedPoster);
  }
  if (event.code === 'Escape' && galleryActive && !controls?.isLocked) {
    event.preventDefault();
    showWelcome(insideHouseWorld ? 'house-paused' : 'paused');
  }
});

window.addEventListener('keyup', (event) => {
  pressedKeys.delete(event.code);
  if (event.code !== 'KeyE' || !eHoldTarget) return;
  event.preventDefault();
  if (eHoldTimer) window.clearTimeout(eHoldTimer);
  const target = eHoldTarget;
  const heldLongEnough = eHoldTriggered;
  const wasPlaying = eHoldWasPlaying;
  eHoldTimer = 0;
  eHoldTarget = null;
  eHoldTriggered = false;
  eHoldWasPlaying = false;
  if (!heldLongEnough && wasPlaying) toggleManualVideo(target);
  else if (heldLongEnough) refreshFocusCard();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    finishAnalyticsRoomVisit();
    if (eHoldTimer) window.clearTimeout(eHoldTimer);
    eHoldTimer = 0;
    eHoldTarget = null;
    eHoldTriggered = false;
    eHoldWasPlaying = false;
    pauseGalleryVideos();
  } else if (galleryActive) {
    resumeAnalyticsRoomTracking();
    playGalleryVideos();
  }
});

window.addEventListener('pagehide', () => {
  finishAnalyticsRoomVisit();
});

canvas.addEventListener('pointerdown', (event) => {
  if (!galleryActive || !dragLookEnabled || event.button !== 0) return;
  draggingView = true;
  dragMoved = false;
  lastDragX = event.clientX;
  lastDragY = event.clientY;
  galleryApp.classList.add('dragging-view');
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (!draggingView || !dragLookEnabled) return;
  const movementX = event.clientX - lastDragX;
  const movementY = event.clientY - lastDragY;
  lastDragX = event.clientX;
  lastDragY = event.clientY;
  if (Math.abs(movementX) + Math.abs(movementY) > 2) dragMoved = true;

  dragEuler.setFromQuaternion(camera.quaternion);
  dragEuler.y -= movementX * 0.0024;
  dragEuler.x -= movementY * 0.0024;
  dragEuler.x = THREE.MathUtils.clamp(dragEuler.x, -1.05, 1.05);
  camera.quaternion.setFromEuler(dragEuler);
  requestVideoSync();
  needsRender = true;
});

function finishDrag(event) {
  if (!draggingView) return;
  draggingView = false;
  galleryApp.classList.remove('dragging-view');
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  window.setTimeout(() => { dragMoved = false; }, 0);
}

canvas.addEventListener('pointerup', finishDrag);
canvas.addEventListener('pointercancel', finishDrag);

canvas.addEventListener('click', () => {
  if (!galleryActive || dragMoved) return;
  if (focusedResumeLink) {
    openResumePage();
    return;
  }
  if (focusedGameAction) {
    launchGameAction(focusedGameAction);
    return;
  }
  if (focusedManualVideo) {
    toggleManualVideo(focusedManualVideo);
    return;
  }
  if (focusedPoster) openPoster(focusedPoster);
});

window.addEventListener('beforeunload', () => {
  finishAnalyticsRoomVisit();
  window.cancelAnimationFrame(animationFrame);
  renderer?.dispose();
});

startAnalytics();
setWalkHint();
initializeGallery();
