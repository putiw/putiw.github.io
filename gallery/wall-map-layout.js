// Shared room coordinates for the 3D gallery and the wall-reference map.
// Edit these values when the floor plan changes; the map page watches this
// module and redraws itself without needing a second copy of the layout.
export const MAIN_ROOM = { halfWidth: 9.5, halfDepth: 7, height: 5.6 };

export const SCREENING_ROOM = {
  centerX: 5.65,
  doorWidth: 1.55,
  doorHeight: 3.5,
  hallStartZ: 6.94,
  nearZ: 10.45,
  farZ: 18.45,
  halfWidth: 4.1,
  height: 5.6
};

export const BRAIN_HALL_LENGTH = 2.2;
export const BRAIN_ROOM = {
  centerX: SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth * 2 + BRAIN_HALL_LENGTH,
  doorWidth: 1.55,
  doorHeight: 3.5,
  doorOffsetZ: -2.55,
  nearZ: SCREENING_ROOM.nearZ,
  farZ: SCREENING_ROOM.farZ,
  halfWidth: SCREENING_ROOM.halfWidth,
  height: SCREENING_ROOM.height
};
export const BRAIN_HALL_SOUTH_EDGE = (BRAIN_ROOM.nearZ + BRAIN_ROOM.farZ) / 2 + BRAIN_ROOM.doorOffsetZ + BRAIN_ROOM.doorWidth / 2;
export const BRAIN_HALL_NORTH_EDGE = SCREENING_ROOM.nearZ;
export const BRAIN_HALL_WIDTH = BRAIN_HALL_SOUTH_EDGE - BRAIN_HALL_NORTH_EDGE;
export const BRAIN_HALL_CENTER_Z = (BRAIN_HALL_NORTH_EDGE + BRAIN_HALL_SOUTH_EDGE) / 2;

export const APP_ROOM = {
  centerX: -5.65,
  doorWidth: 1.55,
  doorHeight: 3.5,
  hallStartZ: 6.94,
  nearZ: 10.45,
  farZ: 34.25,
  halfWidth: 6.9,
  height: 6.2
};

export const SIDE_ROOM_DOOR_WIDTH = APP_ROOM.doorWidth * 1.5;
export const SIDE_ROOM_DOOR_Z = APP_ROOM.farZ - SIDE_ROOM_DOOR_WIDTH / 2 - 0.45;
export const ROOM_WALL_THICKNESS = 0.18;

export const GAME_HALL_LENGTH = 2.2;
export const GAME_ROOM = {
  centerX: APP_ROOM.centerX - APP_ROOM.halfWidth - GAME_HALL_LENGTH - 4.1,
  doorWidth: SIDE_ROOM_DOOR_WIDTH,
  doorHeight: 3.5,
  doorOffsetZ: SIDE_ROOM_DOOR_Z - (APP_ROOM.farZ - 8 + APP_ROOM.farZ) / 2,
  nearZ: APP_ROOM.farZ - 8,
  farZ: APP_ROOM.farZ,
  halfWidth: 4.1,
  height: 5.6
};

export const VIDEOS_HALL_LENGTH = GAME_HALL_LENGTH;
export const GAME_VIDEOS_HALL_DOOR_X = GAME_ROOM.centerX + GAME_ROOM.halfWidth - GAME_ROOM.doorWidth / 2 - 0.35;
export const VIDEOS_ROOM = {
  centerX: GAME_ROOM.centerX,
  doorWidth: GAME_ROOM.doorWidth,
  doorHeight: GAME_ROOM.doorHeight,
  southDoorX: GAME_VIDEOS_HALL_DOOR_X,
  // Extend the room north until its named north wall aligns with
  // APP-NORTH-WEST. Keep the south wall fixed so the Game–Videos hallway
  // and its door remain in the same place.
  nearZ: APP_ROOM.nearZ,
  farZ: GAME_ROOM.nearZ - VIDEOS_HALL_LENGTH,
  halfWidth: GAME_ROOM.halfWidth,
  height: GAME_ROOM.height
};

export const EMPTY_GAME_ROOM = {
  centerX: (APP_ROOM.centerX + APP_ROOM.halfWidth + GAME_HALL_LENGTH + BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth) / 2,
  northDoorX: BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth + SIDE_ROOM_DOOR_WIDTH / 2 + 0.35,
  doorWidth: SIDE_ROOM_DOOR_WIDTH,
  doorHeight: 3.5,
  doorOffsetZ: SIDE_ROOM_DOOR_Z - (BRAIN_ROOM.farZ + APP_ROOM.farZ) / 2,
  nearZ: BRAIN_ROOM.farZ,
  farZ: APP_ROOM.farZ,
  halfWidth: (BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth - APP_ROOM.centerX - APP_ROOM.halfWidth - GAME_HALL_LENGTH) / 2,
  openNorth: true,
  height: 5.6
};

export const ART_ROOM = {
  centerX: APP_ROOM.centerX,
  doorWidth: 1.71,
  doorOffsetX: -0.08,
  doorHeight: 3.5,
  hallStartZ: APP_ROOM.farZ,
  nearZ: 36.75,
  farZ: 65.59,
  halfWidth: 19.45,
  height: 7.2
};

const roomRect = (id, label, room, color) => ({
  id,
  label,
  left: room.centerX - room.halfWidth,
  right: room.centerX + room.halfWidth,
  near: room.nearZ,
  far: room.farZ,
  height: room.height,
  color
});

const horizontalWall = (id, label, x1, x2, z, face, notes = '', options = {}) => ({
  id, label, orientation: 'horizontal', x1, x2, z1: z, z2: z, face, notes,
  thickness: ROOM_WALL_THICKNESS,
  ...options
});

const verticalWall = (id, label, x, z1, z2, face, notes = '', options = {}) => ({
  id, label, orientation: 'vertical', x1: x, x2: x, z1, z2, face, notes,
  thickness: ROOM_WALL_THICKNESS,
  ...options
});

const mainLeft = -MAIN_ROOM.halfWidth;
const mainRight = MAIN_ROOM.halfWidth;
const mainNear = -MAIN_ROOM.halfDepth;
const mainFar = MAIN_ROOM.halfDepth;
const appLeft = APP_ROOM.centerX - APP_ROOM.halfWidth;
const appRight = APP_ROOM.centerX + APP_ROOM.halfWidth;
const defenseLeft = SCREENING_ROOM.centerX - SCREENING_ROOM.halfWidth;
const defenseRight = SCREENING_ROOM.centerX + SCREENING_ROOM.halfWidth;
const brainLeft = BRAIN_ROOM.centerX - BRAIN_ROOM.halfWidth;
const brainRight = BRAIN_ROOM.centerX + BRAIN_ROOM.halfWidth;
const mriLeft = EMPTY_GAME_ROOM.centerX - EMPTY_GAME_ROOM.halfWidth;
const mriRight = EMPTY_GAME_ROOM.centerX + EMPTY_GAME_ROOM.halfWidth;
const gameLeft = GAME_ROOM.centerX - GAME_ROOM.halfWidth;
const gameRight = GAME_ROOM.centerX + GAME_ROOM.halfWidth;
const artLeft = ART_ROOM.centerX - ART_ROOM.halfWidth;
const artRight = ART_ROOM.centerX + ART_ROOM.halfWidth;
const appDoorNorth = SIDE_ROOM_DOOR_Z - SIDE_ROOM_DOOR_WIDTH / 2;
const appDoorSouth = SIDE_ROOM_DOOR_Z + SIDE_ROOM_DOOR_WIDTH / 2;
const brainDoorNorth = BRAIN_HALL_NORTH_EDGE;
const brainDoorSouth = BRAIN_HALL_SOUTH_EDGE;
const appMainDoorLeft = APP_ROOM.centerX - APP_ROOM.doorWidth / 2;
const appMainDoorRight = APP_ROOM.centerX + APP_ROOM.doorWidth / 2;
const mainDoorLeft = 5.65 - SCREENING_ROOM.doorWidth / 2;
const mainDoorRight = 5.65 + SCREENING_ROOM.doorWidth / 2;
const artDoorLeft = ART_ROOM.centerX + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2;
const artDoorRight = ART_ROOM.centerX + ART_ROOM.doorOffsetX + ART_ROOM.doorWidth / 2;
const videosHallDoorLeft = GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2;
const videosHallDoorRight = GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2;

export const WALL_MAP_LAYOUT = {
  version: '20260718-all-door-headers',
  rooms: [
    roomRect('main', 'Main gallery', { centerX: 0, halfWidth: MAIN_ROOM.halfWidth, nearZ: mainNear, farZ: mainFar, height: MAIN_ROOM.height }, '#68757a'),
    roomRect('app', 'App room', APP_ROOM, '#6d8f9e'),
    roomRect('defense', 'Defense room', SCREENING_ROOM, '#9a7d86'),
    roomRect('brain', 'Brain room', BRAIN_ROOM, '#c3a85e'),
    roomRect('mri', 'MRI room', EMPTY_GAME_ROOM, '#6f9d91'),
    roomRect('game', 'Game room', GAME_ROOM, '#8d8a68'),
    roomRect('videos', 'Videos', VIDEOS_ROOM, '#806e9d'),
    roomRect('art', 'Art room', ART_ROOM, '#9e789b')
  ],
  walkable: [
    roomRect('main', 'Main gallery walkable area', { centerX: 0, halfWidth: MAIN_ROOM.halfWidth, nearZ: mainNear, farZ: mainFar, height: MAIN_ROOM.height }, '#314245'),
    roomRect('app', 'App room walkable area', APP_ROOM, '#314245'),
    roomRect('defense', 'Defense room walkable area', SCREENING_ROOM, '#314245'),
    roomRect('brain', 'Brain room walkable area', BRAIN_ROOM, '#314245'),
    roomRect('mri', 'MRI room walkable area', EMPTY_GAME_ROOM, '#314245'),
    roomRect('game', 'Game room walkable area', GAME_ROOM, '#314245'),
    roomRect('videos', 'Videos walkable area', VIDEOS_ROOM, '#314245'),
    roomRect('art', 'Art room walkable area', ART_ROOM, '#314245'),
    { id: 'main-app-hall', left: APP_ROOM.centerX - APP_ROOM.doorWidth / 2, right: APP_ROOM.centerX + APP_ROOM.doorWidth / 2, near: mainFar, far: APP_ROOM.nearZ },
    { id: 'main-defense-hall', left: SCREENING_ROOM.centerX - SCREENING_ROOM.doorWidth / 2, right: SCREENING_ROOM.centerX + SCREENING_ROOM.doorWidth / 2, near: mainFar, far: SCREENING_ROOM.nearZ },
    { id: 'app-art-hall', left: ART_ROOM.centerX + ART_ROOM.doorOffsetX - ART_ROOM.doorWidth / 2, right: ART_ROOM.centerX + ART_ROOM.doorOffsetX + ART_ROOM.doorWidth / 2, near: APP_ROOM.farZ, far: ART_ROOM.nearZ },
    { id: 'app-mri-hall', left: appRight, right: mriLeft, near: appDoorNorth, far: appDoorSouth },
    { id: 'app-game-hall', left: gameRight, right: appLeft, near: appDoorNorth, far: appDoorSouth },
    { id: 'game-videos-hall', left: GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2, right: GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2, near: VIDEOS_ROOM.farZ, far: GAME_ROOM.nearZ },
    { id: 'defense-brain-hall', left: defenseRight, right: brainLeft, near: brainDoorNorth, far: brainDoorSouth }
  ],
  walls: [
    horizontalWall('MAIN-NORTH', 'Main north wall', mainLeft, mainRight, mainNear, 'south-facing', 'Main gallery rear wall'),
    horizontalWall('MAIN-SOUTH-WEST', 'Main south wall / west segment', mainLeft, appMainDoorLeft, mainFar, 'north-facing', 'Main south wall west of the App hallway'),
    horizontalWall('MAIN-SOUTH-CENTER', 'Main south wall / center segment', appMainDoorRight, mainDoorLeft, mainFar, 'north-facing', 'Main south wall between the App and Defense hallways'),
    horizontalWall('MAIN-SOUTH-EAST', 'Main south wall / east segment', mainDoorRight, mainRight, mainFar, 'north-facing', 'Main south wall east of the Defense hallway'),
    horizontalWall('MAIN-APP-HEADER-MAIN', 'Main–App doorway header · Main side', appMainDoorLeft, appMainDoorRight, mainFar, 'north-facing', 'Solid wall/header above the Main-side App hallway entrance', { type: 'door-header', roomSide: 'Main gallery', height: MAIN_ROOM.height - APP_ROOM.doorHeight }),
    horizontalWall('MAIN-DEFENSE-HEADER-MAIN', 'Main–Defense doorway header · Main side', mainDoorLeft, mainDoorRight, mainFar, 'north-facing', 'Solid wall/header above the Main-side Defense hallway entrance', { type: 'door-header', roomSide: 'Main gallery', height: MAIN_ROOM.height - SCREENING_ROOM.doorHeight }),
    verticalWall('MAIN-WEST', 'Main west wall', mainLeft, mainNear, mainFar, 'east-facing', 'Main gallery west boundary'),
    verticalWall('MAIN-EAST', 'Main east wall', mainRight, mainNear, mainFar, 'west-facing', 'Main gallery east boundary'),
    verticalWall('MAIN-APP-HALL-WEST', 'Main–App hallway west wall', appMainDoorLeft, mainFar, APP_ROOM.nearZ, 'east-facing', 'West side of the Main–App entry hallway'),
    verticalWall('MAIN-APP-HALL-EAST', 'Main–App hallway east wall', appMainDoorRight, mainFar, APP_ROOM.nearZ, 'west-facing', 'East side of the Main–App entry hallway'),
    verticalWall('MAIN-DEFENSE-HALL-WEST', 'Main–Defense hallway west wall', mainDoorLeft, mainFar, SCREENING_ROOM.nearZ, 'east-facing', 'West side of the Main–Defense entry hallway'),
    verticalWall('MAIN-DEFENSE-HALL-EAST', 'Main–Defense hallway east wall', mainDoorRight, mainFar, SCREENING_ROOM.nearZ, 'west-facing', 'East side of the Main–Defense entry hallway'),

    horizontalWall('APP-NORTH-WEST', 'App north wall / west segment', appLeft, appMainDoorLeft, APP_ROOM.nearZ, 'south-facing', 'App north wall west of the Main hallway'),
    horizontalWall('APP-NORTH-EAST', 'App north wall / east segment', appMainDoorRight, appRight, APP_ROOM.nearZ, 'south-facing', 'App north wall east of the Main hallway'),
    horizontalWall('MAIN-APP-HEADER-APP', 'Main–App doorway header · App side', appMainDoorLeft, appMainDoorRight, APP_ROOM.nearZ, 'south-facing', 'Solid wall/header above the App-side Main hallway entrance', { type: 'door-header', roomSide: 'App room', height: APP_ROOM.height - APP_ROOM.doorHeight }),
    horizontalWall('APP-SOUTH-WEST', 'App south wall / west segment', appLeft, artDoorLeft, APP_ROOM.farZ, 'north-facing', 'App south wall west of the Art hallway'),
    horizontalWall('APP-SOUTH-EAST', 'App south wall / east segment', artDoorRight, appRight, APP_ROOM.farZ, 'north-facing', 'App south wall east of the Art hallway'),
    horizontalWall('APP-ART-HEADER-APP', 'App–Art doorway header · App side', artDoorLeft, artDoorRight, APP_ROOM.farZ, 'north-facing', 'Solid wall/header above the App-side Art hallway entrance', { type: 'door-header', roomSide: 'App room', height: APP_ROOM.height - ART_ROOM.doorHeight }),
    verticalWall('APP-WEST-NORTH', 'App west wall / north segment', appLeft, APP_ROOM.nearZ, appDoorNorth, 'east-facing', 'App-side wall before the Game corridor opening'),
    verticalWall('APP-WEST-SOUTH', 'App west wall / south segment', appLeft, appDoorSouth, APP_ROOM.farZ, 'east-facing', 'App-side wall after the Game corridor opening'),
    verticalWall('APP-GAME-HEADER-APP', 'App–Game doorway header · App side', appLeft, appDoorNorth, appDoorSouth, 'east-facing', 'Solid wall/header above the App-side Game hallway entrance', { type: 'door-header', roomSide: 'App room', height: APP_ROOM.height - APP_ROOM.doorHeight }),
    verticalWall('APP-EAST-NORTH', 'App east wall / north segment', appRight, APP_ROOM.nearZ, appDoorNorth, 'west-facing', 'App-side wall before the MRI corridor opening'),
    verticalWall('APP-EAST-SOUTH', 'App east wall / south segment', appRight, appDoorSouth, APP_ROOM.farZ, 'west-facing', 'App-side wall after the MRI corridor opening'),
    verticalWall('APP-MRI-HEADER-APP', 'App–MRI doorway header · App side', appRight, appDoorNorth, appDoorSouth, 'west-facing', 'Solid wall/header above the App-side MRI hallway entrance', { type: 'door-header', roomSide: 'App room', height: APP_ROOM.height - EMPTY_GAME_ROOM.doorHeight }),
    horizontalWall('APP-MRI-CORRIDOR', 'App–MRI corridor opening', appRight, mriLeft, SIDE_ROOM_DOOR_Z, 'both-facing', 'Opening runs east from App toward MRI', { type: 'opening' }),
    horizontalWall('APP-MRI-HALL-NORTH', 'App–MRI hallway north wall', appRight, mriLeft, appDoorNorth, 'south-facing', 'North side of the App–MRI hallway'),
    horizontalWall('APP-MRI-HALL-SOUTH', 'App–MRI hallway south wall', appRight, mriLeft, appDoorSouth, 'north-facing', 'South side of the App–MRI hallway'),
    horizontalWall('APP-GAME-HALL-NORTH', 'App–Game hallway north wall', gameRight, appLeft, appDoorNorth, 'south-facing', 'North side of the App–Game hallway'),
    horizontalWall('APP-GAME-HALL-SOUTH', 'App–Game hallway south wall', gameRight, appLeft, appDoorSouth, 'north-facing', 'South side of the App–Game hallway'),

    horizontalWall('DEFENSE-NORTH-LEFT', 'Defense north wall / west section', defenseLeft, mainDoorLeft, SCREENING_ROOM.nearZ, 'south-facing', 'Defense entrance-side wall'),
    horizontalWall('DEFENSE-NORTH-RIGHT', 'Defense north wall / east section', mainDoorRight, defenseRight, SCREENING_ROOM.nearZ, 'south-facing', 'Defense entrance-side wall'),
    horizontalWall('MAIN-DEFENSE-HEADER-DEFENSE', 'Main–Defense doorway header · Defense side', mainDoorLeft, mainDoorRight, SCREENING_ROOM.nearZ, 'south-facing', 'Solid wall/header above the Defense-side Main hallway entrance', { type: 'door-header', roomSide: 'Defense room', height: SCREENING_ROOM.height - SCREENING_ROOM.doorHeight }),
    horizontalWall('DEFENSE-SOUTH-WEST', 'Defense south wall / west segment', defenseLeft, mriLeft, SCREENING_ROOM.farZ, 'north-facing', 'Defense-side wall west of the shared MRI/Defense wall'),
    horizontalWall('MRI-NORTH-FMRI-DEFENSE', 'MRI north / Functional MRI · Defense side', mriLeft, defenseRight, EMPTY_GAME_ROOM.nearZ, 'north-facing', 'Defense-room face of the Functional MRI wall', { physicalId: 'MRI-NORTH-FMRI', roomSide: 'Defense room', lineOffsetZ: -ROOM_WALL_THICKNESS / 2 }),
    verticalWall('DEFENSE-WEST', 'Defense west wall', defenseLeft, SCREENING_ROOM.nearZ, SCREENING_ROOM.farZ, 'east-facing', 'Dissertation text wall'),
    verticalWall('DEFENSE-EAST-NORTH', 'Defense east wall / north segment', defenseRight, SCREENING_ROOM.nearZ, brainDoorNorth, 'west-facing', 'Defense-side wall before the Brain hallway'),
    verticalWall('DEFENSE-EAST-SOUTH', 'Defense east wall / passage segment', defenseRight, brainDoorSouth, SCREENING_ROOM.farZ, 'east-facing', 'Defense-side wall of the connecting passage'),
    verticalWall('DEFENSE-BRAIN-HEADER-DEFENSE', 'Defense–Brain doorway header · Defense side', defenseRight, brainDoorNorth, brainDoorSouth, 'west-facing', 'Solid wall/header above the Defense-side Brain hallway entrance', { type: 'door-header', roomSide: 'Defense room', height: SCREENING_ROOM.height - BRAIN_ROOM.doorHeight }),
    horizontalWall('DEFENSE-BRAIN-HALL', 'Defense–Brain hallway opening', defenseRight, brainLeft, BRAIN_HALL_CENTER_Z, 'both-facing', `Opening spans z ${brainDoorNorth.toFixed(2)}–${brainDoorSouth.toFixed(2)}`, { type: 'opening' }),
    horizontalWall('DEFENSE-BRAIN-HALL-NORTH', 'Defense–Brain hallway north wall', defenseRight, brainLeft, brainDoorNorth, 'south-facing', 'North side of the Defense–Brain hallway'),
    horizontalWall('DEFENSE-BRAIN-HALL-SOUTH', 'Defense–Brain hallway south wall', defenseRight, brainLeft, brainDoorSouth, 'north-facing', 'South side of the Defense–Brain hallway'),

    horizontalWall('BRAIN-NORTH', 'Brain north wall', brainLeft, brainRight, BRAIN_ROOM.nearZ, 'south-facing', 'Brain room north boundary'),
    horizontalWall('BRAIN-SOUTH', 'Brain south opening', brainLeft, brainRight, BRAIN_ROOM.farZ, 'north-facing', 'Open toward MRI connection', { type: 'opening' }),
    verticalWall('BRAIN-WEST-NORTH', 'Brain west wall / north segment', brainLeft, BRAIN_ROOM.nearZ, brainDoorNorth, 'east-facing', 'Brain-room west wall before Defense hallway'),
    verticalWall('BRAIN-WEST-SOUTH', 'Brain west wall / south segment', brainLeft, brainDoorSouth, BRAIN_ROOM.farZ, 'east-facing', 'MRI introduction text target; Brain-room west wall after Defense hallway'),
    verticalWall('DEFENSE-BRAIN-HEADER-BRAIN', 'Defense–Brain doorway header · Brain side', brainLeft, brainDoorNorth, brainDoorSouth, 'east-facing', 'Solid wall/header above the Brain-side Defense hallway entrance', { type: 'door-header', roomSide: 'Brain room', height: BRAIN_ROOM.height - BRAIN_ROOM.doorHeight }),
    verticalWall('BRAIN-EAST', 'Brain east wall', brainRight, BRAIN_ROOM.nearZ, BRAIN_ROOM.farZ, 'west-facing', 'Brain room east boundary'),

    horizontalWall('MRI-NORTH-FMRI-MRI', 'MRI north / Functional MRI · MRI side', mriLeft, brainLeft, EMPTY_GAME_ROOM.nearZ, 'south-facing', 'MRI-room face of the Functional MRI wall; PDF page 7 and fMRI video marker', { physicalId: 'MRI-NORTH-FMRI', roomSide: 'MRI room', lineOffsetZ: ROOM_WALL_THICKNESS / 2 }),
    horizontalWall('MRI-NORTH-BRAIN-OPENING', 'MRI north opening / Brain connection', brainLeft, mriRight, EMPTY_GAME_ROOM.nearZ, 'both-facing', 'Open Brain–MRI connection', { type: 'opening' }),
    horizontalWall('MRI-SOUTH-DIFFUSION', 'MRI south wall / Diffusion MRI', mriLeft, mriRight, EMPTY_GAME_ROOM.farZ, 'north-facing', 'PDF page 5; AFQView video marker is on this single sheet'),
    verticalWall('MRI-WEST-NORTH', 'MRI west wall / App-side north segment', mriLeft, EMPTY_GAME_ROOM.nearZ, appDoorNorth, 'east-facing', 'PDF page 4; not the Defense-side passage wall'),
    verticalWall('MRI-WEST-SOUTH', 'MRI west wall / App-side south segment', mriLeft, appDoorSouth, EMPTY_GAME_ROOM.farZ, 'east-facing', 'PDF page 4; after the App corridor opening'),
    verticalWall('APP-MRI-HEADER-MRI', 'App–MRI doorway header · MRI side', mriLeft, appDoorNorth, appDoorSouth, 'east-facing', 'Solid wall/header above the MRI-side App hallway entrance', { type: 'door-header', roomSide: 'MRI room', height: EMPTY_GAME_ROOM.height - EMPTY_GAME_ROOM.doorHeight }),
    verticalWall('MRI-EAST', 'MRI east wall / Brain-side wall', mriRight, EMPTY_GAME_ROOM.nearZ, EMPTY_GAME_ROOM.farZ, 'west-facing', 'PDF page 6'),
    horizontalWall('MRI-APP-CORRIDOR', 'MRI–App corridor opening', appRight, mriLeft, SIDE_ROOM_DOOR_Z, 'both-facing', `App corridor center z ${SIDE_ROOM_DOOR_Z.toFixed(2)}`, { type: 'opening' }),

    horizontalWall('GAME-NORTH-WEST', 'Game north wall / west segment', gameLeft, GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2, GAME_ROOM.nearZ, 'south-facing', 'Game room north boundary west of the Videos hallway'),
    horizontalWall('GAME-NORTH-EAST', 'Game north wall / east segment', GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2, gameRight, GAME_ROOM.nearZ, 'south-facing', 'Game room north boundary east of the Videos hallway'),
    horizontalWall('GAME-VIDEOS-HALL', 'Game–Videos hallway opening', GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2, GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2, GAME_ROOM.nearZ, 'both-facing', 'Opening runs north from the east edge of the Game room', { type: 'opening' }),
    horizontalWall('GAME-VIDEOS-HEADER-GAME', 'Game–Videos doorway header · Game side', GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2, GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2, GAME_ROOM.nearZ, 'south-facing', 'Solid wall/header above the Game-side Videos hallway entrance', { type: 'door-header', roomSide: 'Game room', height: GAME_ROOM.height - GAME_ROOM.doorHeight }),
    horizontalWall('GAME-SOUTH', 'Game south wall', gameLeft, gameRight, GAME_ROOM.farZ, 'north-facing', 'Game room south boundary'),
    verticalWall('GAME-WEST', 'Game west wall', gameLeft, GAME_ROOM.nearZ, GAME_ROOM.farZ, 'east-facing', 'Game room west boundary'),
    verticalWall('GAME-EAST-NORTH', 'Game east wall / north segment', gameRight, GAME_ROOM.nearZ, appDoorNorth, 'west-facing', 'App-side wall before corridor opening'),
    verticalWall('GAME-EAST-SOUTH', 'Game east wall / south segment', gameRight, appDoorSouth, GAME_ROOM.farZ, 'west-facing', 'App-side wall after corridor opening'),
    verticalWall('APP-GAME-HEADER-GAME', 'App–Game doorway header · Game side', gameRight, appDoorNorth, appDoorSouth, 'west-facing', 'Solid wall/header above the Game-side App hallway entrance', { type: 'door-header', roomSide: 'Game room', height: GAME_ROOM.height - GAME_ROOM.doorHeight }),
    verticalWall('GAME-VIDEOS-HALL-WEST', 'Game–Videos hallway west wall', videosHallDoorLeft, VIDEOS_ROOM.farZ, GAME_ROOM.nearZ, 'east-facing', 'West side of the Game–Videos hallway'),
    verticalWall('GAME-VIDEOS-HALL-EAST', 'Game–Videos hallway east wall', videosHallDoorRight, VIDEOS_ROOM.farZ, GAME_ROOM.nearZ, 'west-facing', 'East side of the Game–Videos hallway'),

    horizontalWall('VIDEOS-NORTH', 'Videos north wall', gameLeft, gameRight, VIDEOS_ROOM.nearZ, 'south-facing', 'Videos room north boundary'),
    horizontalWall('VIDEOS-SOUTH-WEST', 'Videos south wall / west segment', gameLeft, GAME_VIDEOS_HALL_DOOR_X - GAME_ROOM.doorWidth / 2, VIDEOS_ROOM.farZ, 'north-facing', 'Videos room entrance-side wall west of the hallway'),
    horizontalWall('VIDEOS-SOUTH-EAST', 'Videos south wall / east segment', GAME_VIDEOS_HALL_DOOR_X + GAME_ROOM.doorWidth / 2, gameRight, VIDEOS_ROOM.farZ, 'north-facing', 'Videos room entrance-side wall east of the hallway'),
    horizontalWall('GAME-VIDEOS-HEADER-VIDEOS', 'Game–Videos doorway header · Videos side', GAME_VIDEOS_HALL_DOOR_X - VIDEOS_ROOM.doorWidth / 2, GAME_VIDEOS_HALL_DOOR_X + VIDEOS_ROOM.doorWidth / 2, VIDEOS_ROOM.farZ, 'north-facing', 'Solid wall/header above the Videos-side Game hallway entrance', { type: 'door-header', roomSide: 'Videos room', height: VIDEOS_ROOM.height - VIDEOS_ROOM.doorHeight }),
    verticalWall('VIDEOS-WEST', 'Videos west wall', gameLeft, VIDEOS_ROOM.nearZ, VIDEOS_ROOM.farZ, 'east-facing', 'Videos room west boundary'),
    verticalWall('VIDEOS-EAST', 'Videos east wall', gameRight, VIDEOS_ROOM.nearZ, VIDEOS_ROOM.farZ, 'west-facing', 'Videos room east boundary'),

    verticalWall('APP-ART-HALL-WEST', 'App–Art hallway west wall', artDoorLeft, APP_ROOM.farZ, ART_ROOM.nearZ, 'east-facing', 'West side of the App–Art hallway'),
    verticalWall('APP-ART-HALL-EAST', 'App–Art hallway east wall', artDoorRight, APP_ROOM.farZ, ART_ROOM.nearZ, 'west-facing', 'East side of the App–Art hallway'),

    horizontalWall('ART-NORTH-WEST', 'Art north wall / west segment', artLeft, artDoorLeft, ART_ROOM.nearZ, 'south-facing', 'Art north wall west of the App hallway'),
    horizontalWall('ART-NORTH-EAST', 'Art north wall / east segment', artDoorRight, artRight, ART_ROOM.nearZ, 'south-facing', 'Art north wall east of the App hallway'),
    horizontalWall('APP-ART-HEADER-ART', 'App–Art doorway header · Art side', artDoorLeft, artDoorRight, ART_ROOM.nearZ, 'south-facing', 'Solid wall/header above the Art-side App hallway entrance', { type: 'door-header', roomSide: 'Art room', height: ART_ROOM.height - ART_ROOM.doorHeight }),
    horizontalWall('ART-SOUTH', 'Art south wall', artLeft, artRight, ART_ROOM.farZ, 'north-facing', 'Art room south boundary'),
    verticalWall('ART-WEST', 'Art west wall', artLeft, ART_ROOM.nearZ, ART_ROOM.farZ, 'east-facing', 'Art room west boundary'),
    verticalWall('ART-EAST', 'Art east wall', artRight, ART_ROOM.nearZ, ART_ROOM.farZ, 'west-facing', 'Art room east boundary')
  ],
  markers: [
    {
      id: 'defense-intro-text',
      wallId: 'DEFENSE-NORTH-RIGHT',
      label: 'Defense introduction text',
      x: SCREENING_ROOM.centerX,
      z: SCREENING_ROOM.nearZ,
      notes: 'Wide panel centered above the Defense entrance'
    },
    {
      id: 'mri-intro-text',
      wallId: 'BRAIN-WEST-SOUTH',
      label: 'MRI introduction text',
      x: brainLeft + ROOM_WALL_THICKNESS / 2 + 0.021,
      z: (brainDoorSouth + BRAIN_ROOM.farZ) / 2,
      notes: 'Mounted on the east-facing surface of the Brain west wall'
    },
    {
      id: 'mri-hallway-text',
      wallId: 'APP-EAST-NORTH',
      label: 'MRI hallway text',
      x: appRight - ROOM_WALL_THICKNESS / 2 - 0.14,
      z: APP_ROOM.nearZ + 1.35,
      notes: 'Small room-direction label on the App-side wall before the MRI corridor'
    }
  ]
};
