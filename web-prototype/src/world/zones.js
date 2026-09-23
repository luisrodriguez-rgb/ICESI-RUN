/**
 * Zonas y lore del Campus Icesi
 */

export const CAMPUS_ZONES = [
  {
    id: 'porteria_1',
    name: 'Portería 1 — Avenida Cañasgordas',
    bounds: { minX: 13, maxX: 18, minY: 1, maxY: 3 },
    lore: 'Entrada principal sobre la Avenida Cañasgordas, acceso al norte del campus.'
  },
  {
    id: 'edificio_a',
    name: 'Edificio A — Tecnoquímicas',
    bounds: { minX: 19, maxX: 26, minY: 3, maxY: 7 },
    lore: 'Hogar de aulas y laboratorios universitarios con la clásica fachada de ladrillo.'
  },
  {
    id: 'edificio_b',
    name: 'Edificio B',
    bounds: { minX: 7, maxX: 14, minY: 3, maxY: 7 },
    lore: 'Bloque académico contiguo a la plaza central de la universidad.'
  },
  {
    id: 'saman',
    name: 'Plaza del Samán',
    bounds: { minX: 14, maxX: 19, minY: 8, maxY: 12 },
    lore: 'El corazón verde del campus: el imponente árbol de Samán que da sombra y vida a Icesi.'
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca Carvajal',
    bounds: { minX: 13, maxX: 19, minY: 13, maxY: 17 },
    lore: 'Centro del saber, reserva de libros y zona de estudio silencioso.'
  },
  {
    id: 'cafeteria',
    name: 'Cafetería Central & Shillers',
    bounds: { minX: 20, maxX: 24, minY: 13, maxY: 17 },
    lore: 'Punto de encuentro gastronómico; el café doble de Shillers reactiva tus energías.'
  },
  {
    id: 'auditorios',
    name: 'Bloque de Auditorios',
    bounds: { minX: 24, maxX: 29, minY: 13, maxY: 18 },
    lore: 'Espacio de conferencias magnas, ceremonias y grandes eventos académicos.'
  },
  {
    id: 'porteria_2',
    name: 'Portería 2 — Callejón de las Chuchas',
    bounds: { minX: 28, maxX: 33, minY: 14, maxY: 18 },
    lore: 'Salida oriental hacia el Callejón de las Chuchas. Tu boleto de escape.'
  }
];

export function getZoneAt(tileX, tileY) {
  for (const zone of CAMPUS_ZONES) {
    if (
      tileX >= zone.bounds.minX &&
      tileX <= zone.bounds.maxX &&
      tileY >= zone.bounds.minY &&
      tileY <= zone.bounds.maxY
    ) {
      return zone;
    }
  }
  return null;
}
