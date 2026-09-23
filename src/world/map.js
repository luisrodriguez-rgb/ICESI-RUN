import { TILE_TYPES } from './tiles.js';

export const TILE_SIZE = 40; // Tamaño de cada celda en píxeles

/**
 * Matriz del campus de la Universidad Icesi: 34 columnas x 26 filas
 * Convenciones:
 * 0 = Exterior / Asfalto
 * 1 = Edificio (Ladrillo Icesi)
 * 2 = Pasillo peatonal
 * 3 = Césped / Jardines
 * 4 = Samán (árbol central)
 * 5 = Portería 1 (Spawn)
 * 6 = Portería 2 (Salida Callejón de las Chuchas)
 * 7 = Reja cerrada de Portería 2
 * 8 = Espejo de agua
 * 9 = Cafetería Central
 */

// 34 x 26
export const CAMPUS_GRID = [
  // Fila 0: Avenida Cañasgordas
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // Fila 1: Avenida Cañasgordas & Portería 1
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // Fila 2: Bulevar de Acceso Norte
  [0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0],
  // Fila 3: Entrada a Edificios Norte (B y A)
  [0,0,3,3,2,2,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,2,2,2,0,0,0,0,0,0],
  // Fila 4: Edificio B (izq) y Edificio A - Tecnoquímicas (der)
  [0,0,3,3,2,2,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,2,2,2,0,0,0,0,0,0],
  // Fila 5: Cuerpos de Edificios B y A
  [0,0,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,2,2,2,0,0,0,0,0,0],
  // Fila 6: Salida sur de A y B hacia pasillos
  [0,0,2,2,3,3,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1,1,2,2,2,0,0,0,0,0,0],
  // Fila 7: Bulevar Central Norte
  [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 8: Entrada a Plaza del Samán y Edificios Occidente
  [0,0,2,2,1,1,1,2,2,3,3,3,2,2,3,3,3,3,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 9: Plaza del Samán (Árbol central)
  [0,0,2,2,1,1,1,2,2,3,3,3,2,2,3,4,4,3,2,2,3,3,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 10: Plaza del Samán (Árbol central)
  [0,0,2,2,1,1,1,2,2,3,3,3,2,2,3,4,4,3,2,2,3,3,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 11: Plaza sur del Samán hacia Biblioteca
  [0,0,2,2,1,1,1,2,2,2,2,2,2,2,3,3,3,3,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 12: Pasillo previo a Biblioteca y Cafetería
  [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 13: Biblioteca Carvajal (centro) - Cafetería (der) - Auditorios (extremo der)
  [0,0,3,3,2,2,1,1,1,2,2,2,1,1,1,1,1,1,2,2,9,9,9,1,1,1,1,2,2,0,0,0,0,0],
  // Fila 14: Biblioteca (con sala de reserva) y Cafetería
  [0,0,3,3,2,2,1,1,1,2,2,2,1,1,1,1,1,1,2,2,9,9,9,1,1,1,1,2,2,0,0,0,0,0],
  // Fila 15: Conexión Cafetería a Auditorios y Portería 2
  [0,0,2,2,2,2,1,1,1,2,2,2,1,1,1,1,1,1,2,2,9,9,9,1,1,1,1,2,2,7,6,6,0,0],
  // Fila 16: Pasillo y Salida a Portería 2 (Chuchas)
  [0,0,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,2,2,7,6,6,0,0],
  // Fila 17: Biblioteca Sur y Auditorios Sur
  [0,0,2,2,3,3,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,2,2,0,0,0,0,0],
  // Fila 18: Bulevar de conexión a Edificios Sur
  [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 19: Edificio Bienestar / L / Talleres de diseño
  [0,0,1,1,1,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 20: Edificio L y Canchas al oeste
  [0,0,1,1,1,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,2,2,8,8,2,2,2,0,0,0,0,0,0],
  // Fila 21: Corredor sur de laboratorios
  [0,0,1,1,1,2,2,1,1,1,1,1,1,2,2,2,2,1,1,1,1,2,2,8,8,2,2,2,0,0,0,0,0,0],
  // Fila 22: Sendero sur hacia deportes y parqueaderos
  [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
  // Fila 23: Jardines perimetrales sur
  [0,0,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,0,0,0,0,0,0],
  // Fila 24: Límite sur del campus
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // Fila 25: Perímetro exterior
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Metadatos de edificios para rotulación visual en Canvas
export const BUILDING_LABELS = [
  { name: 'EDIFICIO B', x: 11, y: 5 },
  { name: 'EDIFICIO A', x: 22, y: 5 },
  { name: 'EDIFICIO C', x: 6, y: 10 },
  { name: 'EDIF. D', x: 8, y: 15 },
  { name: 'BIBLIOTECA CARVAJAL', x: 16.5, y: 15 },
  { name: 'CAFETERÍA', x: 22, y: 14 },
  { name: 'AUDITORIOS', x: 26.5, y: 15.5 },
  { name: 'EDIFICIO L', x: 10.5, y: 20.5 },
  { name: 'BIENESTAR', x: 3.5, y: 20.5 },
  { name: 'PORTERÍA 1', x: 15.5, y: 1.5 },
  { name: 'PORTERÍA 2', x: 31, y: 15.5 },
  { name: 'EL SAMÁN', x: 16.5, y: 9.8 }
];

// Puntos de spawn inicial y puntos de patrulla
export const SPAWN_PLAYER = { tileX: 15, tileY: 2 };

export const SPAWN_VIGILANTE = {
  tileX: 18,
  tileY: 2,
  patrolRoute: [
    { tileX: 18, tileY: 2 },
    { tileX: 26, tileY: 2 },
    { tileX: 26, tileY: 7 },
    { tileX: 20, tileY: 7 },
    { tileX: 20, tileY: 12 },
    { tileX: 26, tileY: 12 },
    { tileX: 26, tileY: 18 },
    { tileX: 13, tileY: 18 },
    { tileX: 13, tileY: 12 },
    { tileX: 18, tileY: 12 },
    { tileX: 18, tileY: 7 },
    { tileX: 14, tileY: 7 },
    { tileX: 14, tileY: 2 }
  ]
};

export const SPAWN_MONITOR = {
  tileX: 22,
  tileY: 12,
  patrolRadius: 4,
  detectionRadius: 4.5
};

export const SPAWN_IGUANA = {
  tileX: 16,
  tileY: 11
};

// Ítems de misión principal (2 en MVP)
export const MISSION_ITEMS = [
  {
    id: 'book',
    name: 'Libro de Reserva',
    tileX: 16,
    tileY: 14,
    zone: 'Biblioteca Carvajal',
    icon: '📘',
    color: '#38bdf8'
  },
  {
    id: 'coffee',
    name: 'Café de Shillers',
    tileX: 22,
    tileY: 15,
    zone: 'Cafetería Central',
    icon: '☕',
    color: '#fb923c',
    powerUpDuration: 8000 // 8s de turbo
  }
];

// Coordenadas de las celdas de la reja de Portería 2
export const GATE_2_DOOR_TILES = [
  { tileX: 29, tileY: 15 },
  { tileX: 29, tileY: 16 }
];

export const GATE_2_EXIT_ZONE = {
  minTileX: 30,
  maxTileX: 32,
  minTileY: 15,
  maxTileY: 16
};
