import { Enemy } from './Enemy.js';
import { TILE_SIZE } from '../world/map.js';

export class Vigilante extends Enemy {
  constructor(tileX, tileY, patrolRoute = []) {
    super(tileX, tileY, 'Vigilante', '#eab308', 14);
    this.speed = 110;
    this.patrolRoute = patrolRoute.map(pt => ({
      x: pt.tileX * TILE_SIZE + TILE_SIZE / 2,
      y: pt.tileY * TILE_SIZE + TILE_SIZE / 2
    }));
    this.currentWaypointIndex = 0;
    this.lightPulse = 0;
  }

  update(dt, collisionSystem) {
    if (!this.isActive || this.patrolRoute.length === 0) return;

    this.lightPulse += dt * 5;
    const target = this.patrolRoute[this.currentWaypointIndex];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) {
      // Avanzar al siguiente punto del bucle
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolRoute.length;
    } else {
      this.angle = Math.atan2(dy, dx);
      const moveX = (dx / dist) * this.speed * dt;
      const moveY = (dy / dist) * this.speed * dt;

      // Mover con suavidad
      this.x += moveX;
      this.y += moveY;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;

    ctx.save();

    // Haz de luz de la linterna / faro de patrullaje
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const lightRadius = 65;
    const lightAngle = 0.5; // Apertura del cono

    const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, lightRadius);
    grad.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
    grad.addColorStop(0.8, 'rgba(250, 204, 21, 0.15)');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, lightRadius, -lightAngle, lightAngle);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Sombra
    this.drawBase(ctx);

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Carro de golf / Cuerpo del vigilante
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, [4]);
    ctx.fillStyle = '#0f172a'; // Chasis oscuro
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Chaleco reflectivo amarillo fluorescente
    ctx.beginPath();
    ctx.roundRect(-8, -6, 12, 12, [2]);
    ctx.fillStyle = '#facc15';
    ctx.fill();

    // Bandas reflectivas plateadas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6, -4, 2, 8);
    ctx.fillRect(-2, -4, 2, 8);

    // Gorra de seguridad
    ctx.beginPath();
    ctx.arc(2, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#002b49';
    ctx.fill();

    // Faro delantero
    ctx.beginPath();
    ctx.arc(10, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();
  }
}
