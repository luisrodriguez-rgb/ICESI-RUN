import { Vigilante } from '../entities/Vigilante.js';
import { Monitor } from '../entities/Monitor.js';
import { Iguana } from '../entities/Iguana.js';
import { CloserEnemy } from '../entities/CloserEnemy.js';
import { SPAWN_VIGILANTE, SPAWN_MONITOR, SPAWN_IGUANA } from '../world/map.js';

export class EnemyAI {
  constructor() {
    this.vigilante = new Vigilante(
      SPAWN_VIGILANTE.tileX,
      SPAWN_VIGILANTE.tileY,
      SPAWN_VIGILANTE.patrolRoute
    );

    this.monitor = new Monitor(SPAWN_MONITOR.tileX, SPAWN_MONITOR.tileY);
    this.iguana = new Iguana(SPAWN_IGUANA.tileX, SPAWN_IGUANA.tileY);
    this.closer = new CloserEnemy(15, 2);

    this.onPlayerHit = null;
  }

  reset() {
    this.vigilante = new Vigilante(
      SPAWN_VIGILANTE.tileX,
      SPAWN_VIGILANTE.tileY,
      SPAWN_VIGILANTE.patrolRoute
    );
    this.monitor = new Monitor(SPAWN_MONITOR.tileX, SPAWN_MONITOR.tileY);
    this.iguana = new Iguana(SPAWN_IGUANA.tileX, SPAWN_IGUANA.tileY);
    this.closer = new CloserEnemy(15, 2);
  }

  triggerClosingEvent() {
    if (!this.closer.isActive) {
      this.closer.activate(15, 2);
    }
  }

  update(dt, player, collisionSystem) {
    // 1. Actualizar Vigilante (bucle predecible)
    this.vigilante.update(dt, collisionSystem);

    // 2. Actualizar Monitor (visión y persecución)
    this.monitor.update(dt, player, collisionSystem);

    // 3. Actualizar Iguana (obstáculo dinámico en El Samán)
    this.iguana.update(dt, collisionSystem);
    this.iguana.checkCollisionWithPlayer(player);

    // 4. Actualizar Cierre si está activo
    if (this.closer.isActive) {
      this.closer.update(dt, player, collisionSystem);
    }

    // 5. Comprobar colisiones dañinas contra el jugador
    const hostileEnemies = [this.vigilante, this.monitor];
    if (this.closer.isActive) hostileEnemies.push(this.closer);

    for (const enemy of hostileEnemies) {
      if (enemy.checkCollisionWithPlayer(player)) {
        const tookDmg = player.takeDamage();
        if (tookDmg && this.onPlayerHit) {
          this.onPlayerHit(enemy);
        }
      }
    }
  }

  draw(ctx) {
    // Dibujar en capas: Iguana, Vigilante, Monitor, Cierre
    this.iguana.draw(ctx);
    this.vigilante.draw(ctx);
    this.monitor.draw(ctx);
    if (this.closer.isActive) {
      this.closer.draw(ctx);
    }
  }
}
