/**
 * Definición de tipos de tiles para el mapa del Campus Icesi
 */

export const TILE_TYPES = {
  EMPTY: 0,          // Asfalto perimetral / exterior
  BUILDING: 1,       // Muros de edificios de ladrillo Icesi (bloqueo)
  PATH: 2,           // Pasillos y corredores peatonales (transitable)
  GRASS: 3,          // Zonas verdes / jardines de Pance
  TREE_SAMAN: 4,     // El Samán de la plaza central
  GATE_1: 5,         // Portería 1 (Avenida Cañasgordas - Spawn)
  GATE_2: 6,         // Portería 2 (Callejón de las Chuchas - Meta)
  DOOR_LOCKED: 7,    // Reja de Portería 2 (bloqueada hasta cumplir misión)
  WATER: 8,          // Espejos de agua ornamentales
  CAFETERIA: 9,      // Área de mesas y terraza de cafetería
};

export const TILE_PROPERTIES = {
  [TILE_TYPES.EMPTY]: {
    walkable: true,
    name: 'Asfalto exterior',
    color: '#0e1520',
  },
  [TILE_TYPES.BUILDING]: {
    walkable: false,
    name: 'Edificio Icesi',
    color: '#9e472a',
    roofColor: '#b85d38',
    borderColor: '#7a2b16',
  },
  [TILE_TYPES.PATH]: {
    walkable: true,
    name: 'Corredor peatonal',
    color: '#243242',
    tileColor: '#2b3b4e',
  },
  [TILE_TYPES.GRASS]: {
    walkable: true, // Se puede caminar sobre el césped pero con ligera fricción
    name: 'Zona verde Pance',
    color: '#1a3a24',
    tuftColor: '#275635',
  },
  [TILE_TYPES.TREE_SAMAN]: {
    walkable: false, // El tronco es sólido, la copa se dibuja encima
    name: 'El Samán',
    trunkColor: '#4a2e1b',
    canopyColor: '#1d5e2d',
    canopyHighlight: '#2e8b45',
  },
  [TILE_TYPES.GATE_1]: {
    walkable: true,
    name: 'Portería 1 (Cañasgordas)',
    color: '#1e3a5f',
  },
  [TILE_TYPES.GATE_2]: {
    walkable: true,
    name: 'Portería 2 (Chuchas)',
    color: '#2e7d32',
  },
  [TILE_TYPES.DOOR_LOCKED]: {
    walkable: false,
    name: 'Reja de seguridad',
    color: '#e63946',
  },
  [TILE_TYPES.WATER]: {
    walkable: false,
    name: 'Fuente / Espejo de agua',
    color: '#134063',
  },
  [TILE_TYPES.CAFETERIA]: {
    walkable: true,
    name: 'Cafetería Central',
    color: '#344558',
  },
};
