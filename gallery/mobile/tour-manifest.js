import { WORKS_BY_ID } from '../project-data.js?v=20260722-app-center-device1';

const PANORAMA_SPEC = Object.freeze({
  version: '20260722-mri-previews1',
  baseSize: 512,
  faceSize: 2560,
  tileSize: 512,
  levels: Object.freeze([2048, 2560])
});

const link = (target, yaw, pitch, label, kind) => ({ target, yaw, pitch, label, kind });
const hotspot = (workId, yaw, pitch, label) => ({ workId, yaw, pitch, label });
const destinationHotspot = (href, yaw, pitch, label) => ({ href, yaw, pitch, label });
const artWall = (id, label, categories, image) => Object.freeze({
  id,
  label,
  categories: Object.freeze(categories),
  image
});
// These groups follow the baked ART_WALL_SHEETS composites used in panoramas,
// not the unused ART_SALON_PANELS category layout in the desktop source.
export const ART_WALLS = Object.freeze({
  // final-wall.webp
  nearRight: artWall(
    'near-right',
    'Colored works',
    ['Colored stuff'],
    './art/walls/final-wall.webp'
  ),
  // art-south-updated.webp (the filename does not describe every collection)
  far: artWall(
    'far',
    'Black-and-white works and works for others',
    ['Black and white stuff', 'Stuff I did for others'],
    './art/walls/art-south-updated.webp'
  ),
  // sick-black-and-white.webp (despite the stale filename, black-and-white is on the far wall)
  right: artWall(
    'right',
    'Random and sick works',
    ['Random stuff', 'Stuff I did when I was sick'],
    './art/walls/sick-black-and-white.webp'
  ),
  // others-apartment-updated.webp
  left: artWall(
    'left',
    'Cat and apartment works',
    ['Cat', 'Apartment'],
    './art/walls/others-apartment-updated.webp'
  )
});
const artWallHotspot = (yaw, pitch, wall) => ({
  yaw,
  pitch,
  label: 'View artwork',
  artWall: wall
});

const nodeData = [
  {
    id: 'main-intro',
    room: 'main',
    mapRoom: 'main',
    label: 'Introduction',
    position: [0.037, 2.8, 0.04],
    environment: 'gallery',
    initialYaw: 90.6,
    initialPitch: 0,
    initialFov: 78,
    links: [
      link('app-mid', -140.7, -7, 'Clinical App room', 'door'),
      link('defense', 141.1, -7, 'Defense room', 'door')
    ],
    hotspots: [
      hotspot('cbh-film', 74.5, 3.9, 'Play film'),
      hotspot('cbh', 105.1, 3.6, 'View poster'),
      hotspot('fst', -72.1, 6.7, 'View poster'),
      hotspot('decoding', -107.5, 6.5, 'View poster'),
      hotspot('ms-lesion-metrics', -42, 5, 'View poster'),
      hotspot('ohbm-pdi', -25.7, 4.5, 'View poster'),
      hotspot('menactrims-cvsview', -0.3, 3.4, 'View poster'),
      hotspot('ms-research-day', 22.8, 3.7, 'View poster'),
      hotspot('laminate', 39, 4.1, 'View poster'),
      hotspot('resume', 164.8, 1.6, 'Open résumé'),
      hotspot('contact', -164.2, 1.6, 'Email Puti'),
      hotspot('paper-figures', 130.9, 1.6, 'View paper figures')
    ]
  },
  {
    id: 'main-science',
    hidden: true,
    room: 'main',
    mapRoom: 'main',
    label: 'Science wall',
    position: [0, 2.8, -2.2],
    environment: 'gallery',
    initialYaw: 0,
    initialPitch: 3,
    initialFov: 72,
    links: [],
    hotspots: []
  },
  {
    id: 'main-resume',
    hidden: true,
    room: 'main',
    mapRoom: 'main',
    label: 'Résumé and contact',
    position: [0, 2.8, 3.7],
    environment: 'gallery',
    initialYaw: 180,
    initialPitch: -1,
    initialFov: 68,
    links: [],
    hotspots: []
  },
  {
    id: 'app-north',
    hidden: true,
    room: 'app',
    mapRoom: 'app',
    label: 'MyPhysio and LesionView',
    position: [-5.65, 2.8, 14.4],
    environment: 'gallery',
    initialYaw: -90,
    initialPitch: 0,
    initialFov: 78,
    links: [],
    hotspots: []
  },
  {
    id: 'app-mid',
    room: 'app',
    mapRoom: 'app',
    label: 'Clinical App room',
    position: [-5.82, 2.8, 22.392],
    environment: 'gallery',
    initialYaw: 93.4,
    initialPitch: 0,
    initialFov: 78,
    links: [
      link('main-intro', 0.8, -7, 'Main gallery', 'door'),
      link('mri-brain', 145.4, -7, 'MRI room', 'door'),
      link('game', -146.7, -7, 'Game room', 'door'),
      link('art-entry', 179.6, -7, 'Art room', 'door')
    ],
    hotspots: [
      hotspot('myphysio-app-welcome', -33.3, 1.4, 'Play MyPhysio demo'),
      hotspot('myphysio-daily-exercise', -40.6, 1.7, 'Play MyPhysio demo'),
      hotspot('myphysio-workout-tracker', -51, 2, 'Play MyPhysio demo'),
      hotspot('myphysio-pain-diary', -65.6, 2.4, 'Play MyPhysio demo'),
      hotspot('myphysio-rom-diary', -84.4, 2.6, 'Play MyPhysio demo'),
      hotspot('myphysio-program-manager', -104.5, 2.5, 'Play MyPhysio demo'),
      hotspot('myphysio-patient-progress', -121.6, 2.2, 'View patient progress'),
      hotspot('myphysio-physio-dashboard', -136.3, 1.8, 'View dashboard'),
      hotspot('lesion-verification', 35.7, 1.4, 'Play LesionView demo'),
      hotspot('lesion-comparison', 46.9, 1.8, 'Play LesionView demo'),
      hotspot('lesion-segmentation', 64.3, 2.2, 'Play LesionView demo'),
      hotspot('cvs-prl-review', 93.9, 2.5, 'Play CVSView demo'),
      hotspot('cvs-rapid-navigation', 117.6, 2.2, 'Play CVSView demo'),
      hotspot('cvs-mask-review', 134.3, 1.8, 'Play CVSView demo')
    ]
  },
  {
    id: 'app-south',
    hidden: true,
    room: 'app',
    mapRoom: 'app',
    label: 'Clinical outcomes',
    position: [-5.65, 2.8, 29.1],
    environment: 'gallery',
    initialYaw: -90,
    initialPitch: 0,
    initialFov: 78,
    links: [],
    hotspots: []
  },
  {
    id: 'defense',
    room: 'screening',
    mapRoom: 'defense',
    label: 'Defense room',
    position: [5.697, 2.8, 14.146],
    environment: 'gallery',
    initialYaw: -179.4,
    initialPitch: 0,
    initialFov: 78,
    links: [
      link('main-intro', -0.7, -7, 'Main gallery', 'door'),
      link('brain', 57.5, -7, 'Brain room', 'door')
    ],
    hotspots: [hotspot('phd-defense', -179.4, 0.9, 'Play defense')]
  },
  {
    id: 'brain',
    room: 'brain',
    mapRoom: 'brain',
    label: 'Brain room',
    position: [16.006, 2.8, 15.408],
    environment: 'gallery',
    initialYaw: 0.5,
    initialPitch: 0,
    initialFov: 80,
    links: [
      link('defense', -46.5, -7, 'Defense room', 'door'),
      link('mri-brain', 179.2, -7, 'MRI room', 'door')
    ],
    hotspots: []
  },
  {
    id: 'mri-brain',
    room: 'mri',
    mapRoom: 'mri',
    label: 'MRI visualization',
    position: [11.917, 2.8, 23.042],
    environment: 'gallery',
    initialYaw: -176.5,
    initialPitch: -15,
    initialFov: 78,
    links: [
      link('app-mid', -138.6, -7, 'Clinical App room', 'door'),
      link('brain', 42, -7, 'Brain room', 'door'),
      link('mri-walls', -179.6, -16, 'MRI research walls', 'arrow')
    ],
    hotspots: [
      hotspot('mri-functional', -44.4, -1.6, 'Play visualization'),
      destinationHotspot('../brain-surface.html', -178, -22, 'Explore interactive brain')
    ]
  },
  {
    id: 'mri-walls',
    room: 'mri',
    mapRoom: 'mri',
    label: 'MRI research walls',
    position: [11.87, 2.8, 29.876],
    environment: 'gallery',
    initialYaw: -179.1,
    initialPitch: 0,
    initialFov: 78,
    links: [link('mri-brain', 0.4, -16, 'MRI visualization', 'arrow')],
    hotspots: [hotspot('mri-afqview', -131.1, 3.2, 'Play visualization')]
  },
  {
    id: 'game',
    room: 'game',
    mapRoom: 'game',
    label: 'Game room',
    position: [-16.18, 2.8, 30.433],
    environment: 'gallery',
    initialYaw: -88.4,
    initialPitch: -4.8,
    initialFov: 78,
    links: [
      link('app-mid', 147, -7, 'Clinical App room', 'door'),
      link('videos', -1.1, -7, 'Video room', 'door')
    ],
    hotspots: [
      hotspot('game-echoing-end', -71.1, -3.4, 'Play game film'),
      hotspot('game-shrimp', -116.5, -4.6, 'Play game film')
    ]
  },
  {
    id: 'videos',
    room: 'videos',
    mapRoom: 'videos',
    label: 'Video room',
    position: [-18.944, 2.8, 17.571],
    environment: 'gallery',
    initialYaw: 0.8,
    initialPitch: 0,
    initialFov: 82,
    links: [link('game', 157.5, -7, 'Game room', 'door')],
    hotspots: [
      hotspot('film-cataract', 0.8, 1, 'Play film'),
      hotspot('film-lower-back-pain', 53.3, 0.9, 'Play film'),
      hotspot('film-goosebumps', 119.9, 1, 'Play film'),
      hotspot('film-teeth', -52, 1, 'Play film'),
      hotspot('film-spider-mites', -121.1, 1.1, 'Play film')
    ]
  },
  {
    id: 'art-entry',
    room: 'art',
    mapRoom: 'art',
    label: 'Art room entrance',
    position: [-5.73, 3.2, 40.2],
    environment: 'gallery',
    initialYaw: 180,
    initialPitch: 0,
    initialFov: 82,
    links: [
      link('app-mid', 0, -7, 'Clinical App room', 'door'),
      link('art-home', -91, -16, 'Home collection', 'arrow'),
      link('art-salon', 179.6, -16, 'Art salon', 'arrow')
    ],
    hotspots: []
  },
  {
    id: 'art-home',
    room: 'art',
    mapRoom: 'art',
    label: 'Home collection',
    position: [-18, 2.8, 40.5],
    environment: 'gallery',
    initialYaw: -37,
    initialPitch: 0,
    initialFov: 78,
    links: [
      link('art-entry', 89, -16, 'Art room entrance', 'arrow'),
      link('art-salon', 118.3, -16, 'Art salon', 'arrow'),
      link('house-approach', -37, 0, 'Enter the house', 'portal')
    ],
    hotspots: [
      hotspot('house-experience', 30, 4, 'View house studies'),
      hotspot('house-in-rain', 108, -16, 'Play film')
    ]
  },
  {
    id: 'art-salon',
    room: 'art',
    mapRoom: 'art',
    label: 'Art salon',
    position: [-5.686, 2.8, 47.143],
    environment: 'gallery',
    initialYaw: 104,
    initialPitch: 1.1,
    initialFov: 84,
    links: [
      link('art-entry', -0.4, -16, 'Art room entrance', 'arrow'),
      link('art-home', -61.7, -16, 'Home collection', 'arrow')
    ],
    hotspots: [
      artWallHotspot(21.7, 6.3, ART_WALLS.nearRight),
      artWallHotspot(179.9, 3.5, ART_WALLS.far),
      artWallHotspot(161, 3.5, ART_WALLS.far),
      artWallHotspot(-104.1, 4.1, ART_WALLS.left),
      artWallHotspot(83.5, 4.3, ART_WALLS.right),
      artWallHotspot(113.1, 3.9, ART_WALLS.right),
      artWallHotspot(133.4, 3.5, ART_WALLS.right),
      artWallHotspot(-133.5, 3.5, ART_WALLS.left)
    ]
  },
  {
    id: 'house-approach',
    room: 'house',
    mapRoom: 'house',
    label: 'House approach',
    position: [33.15, 1.12, 5.225],
    environment: 'house',
    initialYaw: -81,
    initialPitch: 3,
    initialFov: 80,
    links: [
      link('art-home', 90, 0, 'Return to the Art room', 'portal'),
      link('house-platform', -94, -14, 'Walk to the main platform', 'arrow')
    ],
    hotspots: []
  },
  {
    id: 'house-platform',
    room: 'house',
    mapRoom: 'house',
    label: 'Main platform',
    position: [5.4, 1.78, 7],
    environment: 'house',
    initialYaw: -45,
    initialPitch: 0,
    initialFov: 84,
    links: [
      link('house-approach', 86, -14, 'Return to the approach', 'arrow'),
      link('house-roof', -18, -10, 'Climb to the roof view', 'arrow')
    ],
    hotspots: []
  },
  {
    id: 'house-roof',
    room: 'house',
    mapRoom: 'house',
    label: 'Roof view',
    position: [1.5, 5.08, -5.1],
    environment: 'house',
    initialYaw: -83,
    initialPitch: 0,
    initialFov: 84,
    links: [link('house-platform', 162, -14, 'Return to the main platform', 'arrow')],
    hotspots: []
  }
];

export const TOUR_NODES = Object.freeze(nodeData.map((node) => Object.freeze({
  ...node,
  position: Object.freeze(node.position),
  links: Object.freeze(node.links.map((entry) => Object.freeze(entry))),
  hotspots: Object.freeze(node.hotspots.map((entry) => Object.freeze(entry))),
  panorama: Object.freeze({
    basePath: `./mobile/panoramas/${node.id}`,
    ...PANORAMA_SPEC
  })
})));

export const NODE_BY_ID = Object.freeze(Object.fromEntries(
  TOUR_NODES.map((node) => [node.id, node])
));

export const FEATURED_ROUTE = Object.freeze([
  'main-intro',
  'app-mid',
  'mri-brain',
  'mri-walls'
]);

export const ROOM_LABELS = Object.freeze({
  main: 'Science room',
  app: 'Clinical App room',
  screening: 'Defense room',
  defense: 'Defense room',
  brain: 'Brain room',
  mri: 'MRI room',
  game: 'Game room',
  videos: 'Video room',
  art: 'Art room',
  house: 'House experience'
});

for (const node of TOUR_NODES) {
  for (const { target } of node.links) {
    const targetNode = NODE_BY_ID[target];
    if (!targetNode || !targetNode.links.some((entry) => entry.target === node.id)) {
      throw new Error(`Tour link ${node.id} -> ${target} is not bidirectional.`);
    }
  }
  for (const { workId, artWall: selectedArtWall, href } of node.hotspots) {
    if (workId && !WORKS_BY_ID[workId]) {
      throw new Error(`Unknown workId "${workId}" in tour node "${node.id}".`);
    }
    if (!workId && !selectedArtWall && !href) {
      throw new Error(`Hotspot in tour node "${node.id}" has no destination.`);
    }
  }
}
