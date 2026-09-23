import { TILE_SIZE } from '../world/map.js';

export const IGUANA_ACTIONS = {
  SUNBATHING: 'SUNBATHING', // Quieta asoleándose en el Samán
  WALKING: 'WALKING',       // Cruzando el camino lentamente
  TURNING: 'TURNING'        // Mirando a su alrededor
};

export class Iguana {
  constructor(tileX, tileY) {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.radius = 12;

    this.originX = this.x;
    this.originY = this.y;

    this.action = IGUANA_ACTIONS.SUNBATHING;
    this.actionTimer = 3;
    this.angle = 0;
    this.speed = 35; // Movimiento pausado y reptiliano
    this.tailSway = 0;
    this.moveTarget = { x: this.x, y: this.y };
  }

  update(dt, collisionSystem) {
    this.tailSway += dt * 4;
    this.actionTimer -= dt;

    if (this.actionTimer <= 0) {
      // Alternar aleatoriamente entre comportamientos
      const roll = Math.random();
      if (roll < 0.45) {
        this.action = IGUANA_ACTIONS.SUNBATHING;
        this.actionTimer = 4 + Math.random() * 4;
      } else if (roll < 0.8) {
        this.action = IGUANA_ACTIONS.WALKING;
        this.actionTimer = 3 + Math.random() * 3;
        // Elegir punto cercano en la plaza del Samán
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDist = 20 + Math.random() * 40;
        this.moveTarget = {
          x: this.originX + Math.cos(offsetAngle) * offsetDist,
          y: this.originY + Math.sin(offsetAngle) * offsetDist
        };
      } else {
        this.action = IGUANA_ACTIONS.TURNING;
        this.actionTimer = 1.5;
        this.angle += (Math.random() - 0.5) * Math.PI;
      }
    }

    if (this.action === IGUANA_ACTIONS.WALKING) {
      const dx = this.moveTarget.x - this.x;
      const dy = this.moveTarget.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        this.angle = Math.atan2(dy, dx);
        const moveX = (dx / dist) * this.speed * dt;
        const moveY = (dy / dist) * this.speed * dt;
        const resolved = collisionSystem.resolveMovement(this.x, this.y, moveX, moveY, this.radius);
        this.x = resolved.x;
        this.y = resolved.y;
      } else {
        this.action = IGUANA_ACTIONS.SUNBATHING;
      }
    }
  }

  checkCollisionWithPlayer(player) {
    const dist = Math.hypot(this.x - player.x, this.y - player.y);
    const minDist = this.radius + player.radius;

    if (dist < minDist && dist > 0) {
      // Empujar suavemente al jugador (obstáculo físico neutro)
      const overlap = minDist - dist;
      const pushX = ((player.x - this.x) / dist) * overlap;
      const pushY = ((player.y - this.y) / dist) * overlap;
      player.x += pushX;
      player.y += pushY;
      return true;
    }
    return false;
  }

  draw(ctx) {
    ctx.save();

    // Sombra suave alargada
    ctx.beginPath();
    ctx.ellipse(this.x + 2, this.y + 4, 18, 6, this.angle, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Cola de iguana con movimiento ondulante
    const tailOffset = Math.sin(this.tailSway) * 4;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.quadraticCurveTo(-16, tailOffset, -24, tailOffset * 1.5);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#15803d'; // Verde esmeralda
    ctx.lineCap = 'round';
    ctx.stroke();

    // Patas de reptil
    ctx.fillStyle = '#166534';
    // Delanteras
    ctx.fillRect(4, -8, 4, 3);
    ctx.fillRect(4, 5, 4, 3);
    // Traseras
    ctx.fillRect(-6, -9, 4, 3);
    ctx.fillRect(-6, 6, 4, 3);

    // Cuerpo escamoso de iguana
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e'; // Verde vivo
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#15803d';
    ctx.stroke();

    // Cresta dorsal
    ctx.fillStyle = '#f59e0b';
    for (let i = -6; i <= 6; i += 3) {
      ctx.fillRect(i, -2, 1.5, 4);
    }

    // Cabeza
    ctx.beginPath();
    ctx.ellipse(10, 0, 5, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#16a34a';
    ctx.fill();

    // Ojos pequeños
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(11, -3, 1, 0, Math.PI * 2);
    ctx.arc(11, 3, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
