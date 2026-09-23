import { TILE_PROPERTIES, TILE_TYPES } from '../world/tiles.js';
import { TILE_SIZE, CAMPUS_GRID } from '../world/map.js';

export class CollisionSystem {
  constructor(grid = CAMPUS_GRID) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;
    this.gateUnlocked = false;
  }

  setGateUnlocked(unlocked) {
    this.gateUnlocked = unlocked;
  }

  isTileWalkable(tileX, tileY) {
    if (tileX < 0 || tileX >= this.cols || tileY < 0 || tileY >= this.rows) {
      return false;
    }

    const tileType = this.grid[tileY][tileX];

    // Si la reja está desbloqueada, el tile DOOR_LOCKED se vuelve transitable
    if (tileType === TILE_TYPES.DOOR_LOCKED && this.gateUnlocked) {
      return true;
    }

    const prop = TILE_PROPERTIES[tileType];
    return prop ? prop.walkable : false;
  }

  /**
   * Valida colisión circular contra las celdas adyacentes del mapa
   */
  checkCircleCollision(x, y, radius) {
    const minTileX = Math.floor((x - radius) / TILE_SIZE);
    const maxTileX = Math.floor((x + radius) / TILE_SIZE);
    const minTileY = Math.floor((y - radius) / TILE_SIZE);
    const maxTileY = Math.floor((y + radius) / TILE_SIZE);

    for (let ty = minTileY; ty <= maxTileY; ty++) {
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        if (!this.isTileWalkable(tx, ty)) {
          // Bounding box del tile
          const tileLeft = tx * TILE_SIZE;
          const tileRight = tileLeft + TILE_SIZE;
          const tileTop = ty * TILE_SIZE;
          const tileBottom = tileTop + TILE_SIZE;

          // Punto más cercano del tile al centro del círculo
          const closestX = Math.max(tileLeft, Math.min(x, tileRight));
          const closestY = Math.max(tileTop, Math.min(y, tileBottom));

          const distX = x - closestX;
          const distY = y - closestY;
          const distSq = distX * distX + distY * distY;

          if (distSq < radius * radius) {
            return {
              collided: true,
              tileX: tx,
              tileY: ty,
              overlapX: distX,
              overlapY: distY,
              distance: Math.sqrt(distSq)
            };
          }
        }
      }
    }

    return { collided: false };
  }

  /**
   * Resuelve el movimiento aplicando deslizamiento contra muros (wall-sliding)
   */
  resolveMovement(currX, currY, deltaX, deltaY, radius) {
    // Probar movimiento en X
    let targetX = currX + deltaX;
    let targetY = currY;

    let colX = this.checkCircleCollision(targetX, targetY, radius);
    if (colX.collided) {
      targetX = currX; // Se detiene en X
    }

    // Probar movimiento en Y
    targetY = currY + deltaY;
    let colY = this.checkCircleCollision(targetX, targetY, radius);
    if (colY.collided) {
      targetY = currY; // Se detiene en Y
    }

    return { x: targetX, y: targetY };
  }

  /**
   * Comprueba línea de visión directa (sin muros bloqueantes) entre dos puntos
   */
  hasLineOfSight(x1, y1, x2, y2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const stepSize = TILE_SIZE / 2;
    const steps = Math.ceil(dist / stepSize);

    if (steps === 0) return true;

    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;

      const tx = Math.floor(px / TILE_SIZE);
      const ty = Math.floor(py / TILE_SIZE);

      if (!this.isTileWalkable(tx, ty)) {
        return false;
      }
    }

    return true;
  }
}
