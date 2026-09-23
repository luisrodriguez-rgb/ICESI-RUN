import { TILE_SIZE } from '../world/map.js';

export class Player {
  constructor(tileX, tileY) {
    this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
    this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    this.spawnX = this.x;
    this.spawnY = this.y;

    this.radius = 13; // Radio de colisión
    this.baseSpeed = 175; // px por segundo
    this.speed = this.baseSpeed;
    this.angle = 0; // Ángulo de orientación en radianes

    this.lives = 3;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;
    this.flashState = true;

    // Power-up de Café
    this.turboTimer = 0;
    this.isTurboActive = false;

    // Animación de caminata
    this.walkCycle = 0;
    this.isMoving = false;
  }

  resetPosition() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.angle = Math.PI / 2; // Mirando al sur
    this.triggerInvulnerability(2000);
  }

  activateCoffeeBoost(durationMs = 8000) {
    this.turboTimer = durationMs;
    this.isTurboActive = true;
  }

  triggerInvulnerability(durationMs = 1800) {
    this.isInvulnerable = true;
    this.invulnerableTimer = durationMs;
  }

  takeDamage() {
    if (this.isInvulnerable) return false;

    this.lives -= 1;
    this.triggerInvulnerability(2000);
    return true;
  }

  update(dt, inputAxis, collisionSystem) {
    // Manejo de temporizador de turbo (Café de Shillers)
    if (this.isTurboActive) {
      this.turboTimer -= dt * 1000;
      if (this.turboTimer <= 0) {
        this.isTurboActive = false;
        this.turboTimer = 0;
      }
    }

    // Manejo de invulnerabilidad
    if (this.isInvulnerable) {
      this.invulnerableTimer -= dt * 1000;
      this.flashState = Math.floor(this.invulnerableTimer / 120) % 2 === 0;
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
        this.flashState = true;
      }
    }

    // Calcular velocidad actual
    let currentSpeed = this.baseSpeed;
    if (this.isTurboActive) {
      currentSpeed *= 1.55; // +55% de turbo con café
    }

    const moveX = inputAxis.x;
    const moveY = inputAxis.y;
    this.isMoving = moveX !== 0 || moveY !== 0;

    if (this.isMoving) {
      this.angle = Math.atan2(moveY, moveX);
      this.walkCycle += dt * 12;

      const deltaX = moveX * currentSpeed * dt;
      const deltaY = moveY * currentSpeed * dt;

      // Resolver colisión con deslizamiento en paredes
      const resolved = collisionSystem.resolveMovement(
        this.x,
        this.y,
        deltaX,
        deltaY,
        this.radius
      );

      this.x = resolved.x;
      this.y = resolved.y;
    }
  }

  draw(ctx) {
    if (this.isInvulnerable && !this.flashState) {
      return; // Efecto de parpadeo al recibir daño
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // Sombra suave proyectada
    ctx.beginPath();
    ctx.ellipse(2, 4, this.radius * 1.1, this.radius * 0.7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Aura de turbo si el café está activo
    if (this.isTurboActive) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6 + Math.sin(this.walkCycle * 2) * 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 107, 0, 0.3)';
      ctx.strokeStyle = '#ff8c38';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }

    // Rotar según la dirección en que camina
    ctx.rotate(this.angle);

    // Piernas animadas al caminar
    if (this.isMoving) {
      const legOffset = Math.sin(this.walkCycle) * 5;
      ctx.fillStyle = '#1e293b';
      // Pierna izquierda
      ctx.fillRect(-8, -10 + legOffset, 5, 8);
      // Pierna derecha
      ctx.fillRect(-8, 2 - legOffset, 5, 8);
    }

    // Torso / Chaqueta universitaria Icesi (Azul marino)
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#002b49';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#004b80';
    ctx.stroke();

    // Morral universitario en la espalda (Naranja Icesi)
    ctx.beginPath();
    ctx.roundRect(-this.radius - 2, -7, 7, 14, [3]);
    ctx.fillStyle = '#ff6b00';
    ctx.fill();
    ctx.strokeStyle = '#b85d38';
    ctx.stroke();

    // Cabeza del estudiante
    ctx.beginPath();
    ctx.arc(2, 0, this.radius * 0.62, 0, Math.PI * 2);
    ctx.fillStyle = '#f6d8ae';
    ctx.fill();

    // Pelo / Gorra
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.58, -Math.PI / 2, Math.PI / 2, true);
    ctx.fillStyle = '#2c1810';
    ctx.fill();

    // Visera / Detalle frontal de dirección
    ctx.beginPath();
    ctx.arc(5, 0, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b00';
    ctx.fill();

    ctx.restore();
  }
}
