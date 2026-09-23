import { Enemy } from './Enemy.js';
import { TILE_SIZE } from '../world/map.js';

export class CloserEnemy extends Enemy {
  constructor(tileX, tileY) {
    super(tileX, tileY, 'Cierre de Campus', '#dc2626', 15);
    this.speed = 145;
    this.isActive = false; // Solo se activa con el evento de cierre
    this.sirenPulse = 0;
  }

  activate(tileX = 15, tileY = 2) {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.isActive = true;
  }

  update(dt, player, collisionSystem) {
    if (!this.isActive) return;

    this.sirenPulse += dt * 10;

    // Persecución implacable hacia el jugador
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      this.angle = Math.atan2(dy, dx);
      const moveX = (dx / dist) * this.speed * dt;
      const moveY = (dy / dist) * this.speed * dt;
      const resolved = collisionSystem.resolveMovement(this.x, this.y, moveX, moveY, this.radius);
      this.x = resolved.x;
      this.y = resolved.y;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;

    ctx.save();
    this.drawBase(ctx);

    // Resplandor de sirena de emergencia
    const sirenColor = Math.sin(this.sirenPulse) > 0 ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 28, 0, Math.PI * 2);
    ctx.fillStyle = Math.sin(this.sirenPulse) > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)';
    ctx.shadowColor = sirenColor;
    ctx.shadowBlur = 16;
    ctx.fill();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Vehículo patrulla de emergencia
    ctx.beginPath();
    ctx.roundRect(-14, -10, 28, 20, [5]);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    // Baliza giratoria de sirena
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = sirenColor;
    ctx.fill();

    ctx.restore();
  }
}
