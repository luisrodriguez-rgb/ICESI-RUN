import { TILE_SIZE } from '../world/map.js';

export class Collectible {
  constructor(id, tileX, tileY, type = 'credit', meta = {}) {
    this.id = id;
    this.tileX = tileX;
    this.tileY = tileY;
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.type = type; // 'credit', 'mission_book', 'mission_coffee'
    this.meta = meta;

    this.radius = type === 'credit' ? 4 : 12;
    this.isCollected = false;
    this.pulseAngle = Math.random() * Math.PI * 2;
  }

  update(dt) {
    this.pulseAngle += dt * 3;
  }

  checkCollision(player) {
    if (this.isCollected) return false;

    const dist = Math.hypot(this.x - player.x, this.y - player.y);
    return dist < this.radius + player.radius;
  }

  draw(ctx) {
    if (this.isCollected) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'credit') {
      // Punto dorado de crédito académico
      const pulse = Math.sin(this.pulseAngle) * 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd166';
      ctx.shadowColor = 'rgba(255, 209, 102, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
    } else if (this.type === 'mission_book') {
      // Libro de Reserva en Biblioteca
      const floatY = Math.sin(this.pulseAngle) * 3;
      ctx.translate(0, floatY);

      // Resplandor celeste
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Cuaderno / Libro abierto
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-10, -8, 20, 16);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(-8, -6, 7, 12);
      ctx.fillRect(1, -6, 7, 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-2, -7, 4, 14); // Lomo dorado
    } else if (this.type === 'mission_coffee') {
      // Café de Shillers en Cafetería
      const floatY = Math.sin(this.pulseAngle) * 3;
      ctx.translate(0, floatY);

      // Resplandor cálido
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 146, 60, 0.28)';
      ctx.shadowColor = '#fb923c';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Vaso de café universitario
      ctx.beginPath();
      ctx.moveTo(-6, -7);
      ctx.lineTo(6, -7);
      ctx.lineTo(4, 9);
      ctx.lineTo(-4, 9);
      ctx.closePath();
      ctx.fillStyle = '#ea580c';
      ctx.fill();

      // Tapa blanca
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-7, -10, 14, 3);

      // Faja de cartón
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-5, -2, 10, 5);

      // Vapor de café caliente
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-2, -12);
      ctx.quadraticCurveTo(-4, -16, -2, -19);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Genera créditos en todos los pasillos y áreas transitables del mapa
 */
export function generateCredits(grid, missionItemPositions = []) {
  const credits = [];
  let idCounter = 1;

  const missionCoords = new Set(
    missionItemPositions.map(pos => `${pos.tileX},${pos.tileY}`)
  );

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const tileType = grid[r][c];

      // Colocar créditos en pasillos (2) y cafetería (9), pero no encima de ítems de misión
      if ((tileType === 2 || tileType === 9) && !missionCoords.has(`${c},${r}`)) {
        // Para no saturar cada celda, colocamos en celdas alternadas o estratégicas
        if ((r + c) % 2 === 0) {
          credits.push(new Collectible(`credit_${idCounter++}`, c, r, 'credit'));
        }
      }
    }
  }

  return credits;
}
