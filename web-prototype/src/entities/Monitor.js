import { Enemy } from './Enemy.js';
import { TILE_SIZE } from '../world/map.js';

export const MONITOR_STATES = {
  PATROL: 'PATROL',
  ALERT: 'ALERT',
  CHASE: 'CHASE',
  RETURN: 'RETURN'
};

export class Monitor extends Enemy {
  constructor(tileX, tileY) {
    super(tileX, tileY, 'Monitor', '#ef4444', 13);
    this.homeX = this.x;
    this.homeY = this.y;

    this.patrolSpeed = 75;
    this.chaseSpeed = 135;
    this.speed = this.patrolSpeed;

    this.detectionRadius = 5 * TILE_SIZE; // 200px
    this.maxChaseDistance = 8 * TILE_SIZE; // 320px
    this.state = MONITOR_STATES.PATROL;

    this.alertTimer = 0;
    this.lostSightTimer = 0;
    this.patrolTimer = 0;
    this.patrolTarget = { x: this.homeX, y: this.homeY };
  }

  update(dt, player, collisionSystem) {
    if (!this.isActive) return;

    const distToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    const hasSight = distToPlayer < this.detectionRadius &&
      collisionSystem.hasLineOfSight(this.x, this.y, player.x, player.y);

    switch (this.state) {
      case MONITOR_STATES.PATROL:
        this.speed = this.patrolSpeed;
        if (hasSight) {
          this.state = MONITOR_STATES.ALERT;
          this.alertTimer = 0.4; // Pausa dramática de alerta
        } else {
          this.handlePatrolWander(dt, collisionSystem);
        }
        break;

      case MONITOR_STATES.ALERT:
        this.alertTimer -= dt;
        this.angle = Math.atan2(player.y - this.y, player.x - this.x);
        if (this.alertTimer <= 0) {
          this.state = MONITOR_STATES.CHASE;
        }
        break;

      case MONITOR_STATES.CHASE:
        this.speed = this.chaseSpeed;

        if (distToPlayer > this.maxChaseDistance || !hasSight) {
          this.lostSightTimer += dt;
          if (this.lostSightTimer > 1.2) {
            // Perdió el rastro, regresa a casa
            this.state = MONITOR_STATES.RETURN;
            this.lostSightTimer = 0;
          }
        } else {
          this.lostSightTimer = 0;
        }

        // Mover hacia el jugador
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        this.angle = Math.atan2(dy, dx);
        const moveDist = Math.hypot(dx, dy);

        if (moveDist > 2) {
          const moveX = (dx / moveDist) * this.speed * dt;
          const moveY = (dy / moveDist) * this.speed * dt;
          const resolved = collisionSystem.resolveMovement(this.x, this.y, moveX, moveY, this.radius);
          this.x = resolved.x;
          this.y = resolved.y;
        }
        break;

      case MONITOR_STATES.RETURN:
        this.speed = this.patrolSpeed;

        if (hasSight) {
          this.state = MONITOR_STATES.ALERT;
          this.alertTimer = 0.3;
          break;
        }

        const homeDx = this.homeX - this.x;
        const homeDy = this.homeY - this.y;
        const distHome = Math.hypot(homeDx, homeDy);

        if (distHome < 8) {
          this.x = this.homeX;
          this.y = this.homeY;
          this.state = MONITOR_STATES.PATROL;
        } else {
          this.angle = Math.atan2(homeDy, homeDx);
          const moveX = (homeDx / distHome) * this.speed * dt;
          const moveY = (homeDy / distHome) * this.speed * dt;
          const resolved = collisionSystem.resolveMovement(this.x, this.y, moveX, moveY, this.radius);
          this.x = resolved.x;
          this.y = resolved.y;
        }
        break;
    }
  }

  handlePatrolWander(dt, collisionSystem) {
    this.patrolTimer -= dt;
    if (this.patrolTimer <= 0) {
      this.patrolTimer = 2 + Math.random() * 3;
      // Escoger punto aleatorio alrededor de casa
      const offsetAngle = Math.random() * Math.PI * 2;
      const offsetDist = Math.random() * (2 * TILE_SIZE);
      this.patrolTarget = {
        x: this.homeX + Math.cos(offsetAngle) * offsetDist,
        y: this.homeY + Math.sin(offsetAngle) * offsetDist
      };
    }

    const dx = this.patrolTarget.x - this.x;
    const dy = this.patrolTarget.y - this.y;
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

    ctx.translate(this.x, this.y);

    // Globo de estado encima de la cabeza
    if (this.state === MONITOR_STATES.ALERT || this.state === MONITOR_STATES.CHASE) {
      ctx.beginPath();
      ctx.arc(0, -this.radius - 12, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', 0, -this.radius - 12);
    } else if (this.state === MONITOR_STATES.RETURN) {
      ctx.beginPath();
      ctx.arc(0, -this.radius - 12, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', 0, -this.radius - 12);
    }

    ctx.rotate(this.angle);

    // Cuerpo del Monitor con tabla de quices / papeles
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626'; // Rojo de alerta académica
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#991b1b';
    ctx.stroke();

    // Tabla de evaluación con hojas en la mano
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(4, -5, 8, 10);
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, -5, 8, 10);

    // Cabeza con anteojos / gafas de monitor
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();

    ctx.restore();
  }
}
