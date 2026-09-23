import { TILE_SIZE } from '../world/map.js';

export class Enemy {
  constructor(tileX, tileY, name = 'Enemigo', color = '#e63946', radius = 13) {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.name = name;
    this.color = color;
    this.radius = radius;
    this.speed = 100;
    this.angle = 0;
    this.isActive = true;
  }

  checkCollisionWithPlayer(player) {
    if (!this.isActive) return false;
    const dist = Math.hypot(this.x - player.x, this.y - player.y);
    return dist < this.radius + player.radius;
  }

  drawBase(ctx) {
    // Sombra proyectada
    ctx.beginPath();
    ctx.ellipse(this.x + 2, this.y + 4, this.radius * 1.1, this.radius * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();
  }
}
