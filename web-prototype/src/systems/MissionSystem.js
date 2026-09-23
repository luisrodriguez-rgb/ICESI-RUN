import { MISSION_ITEMS, GATE_2_EXIT_ZONE, TILE_SIZE } from '../world/map.js';
import { Collectible } from '../entities/Collectible.js';
import { getZoneAt } from '../world/zones.js';

export class MissionSystem {
  constructor() {
    this.items = [];
    this.objectiveBook = false;
    this.objectiveCoffee = false;
    this.gateUnlocked = false;

    this.visitedZones = new Set();
    this.onItemCollected = null;
    this.onGateUnlocked = null;
    this.onZoneDiscovered = null;
    this.onPlayerEscaped = null;

    this.initMissionItems();
  }

  initMissionItems() {
    this.items = [
      new Collectible(
        'book',
        MISSION_ITEMS[0].tileX,
        MISSION_ITEMS[0].tileY,
        'mission_book',
        MISSION_ITEMS[0]
      ),
      new Collectible(
        'coffee',
        MISSION_ITEMS[1].tileX,
        MISSION_ITEMS[1].tileY,
        'mission_coffee',
        MISSION_ITEMS[1]
      )
    ];
  }

  update(player, collisionSystem) {
    // Actualizar animación de los coleccionables de misión
    for (const item of this.items) {
      item.update(0.016);

      if (!item.isCollected && item.checkCollision(player)) {
        item.isCollected = true;
        this.handleItemPickup(item, player, collisionSystem);
      }
    }

    // Comprobar descubrimiento de zonas por primera vez
    const playerTileX = Math.floor(player.x / TILE_SIZE);
    const playerTileY = Math.floor(player.y / TILE_SIZE);
    const currentZone = getZoneAt(playerTileX, playerTileY);

    if (currentZone && !this.visitedZones.has(currentZone.id)) {
      this.visitedZones.add(currentZone.id);
      if (this.onZoneDiscovered) {
        this.onZoneDiscovered(currentZone);
      }
    }

    // Comprobar escape si la reja está desbloqueada
    if (this.gateUnlocked) {
      if (
        playerTileX >= GATE_2_EXIT_ZONE.minTileX &&
        playerTileX <= GATE_2_EXIT_ZONE.maxTileX &&
        playerTileY >= GATE_2_EXIT_ZONE.minTileY &&
        playerTileY <= GATE_2_EXIT_ZONE.maxTileY
      ) {
        if (this.onPlayerEscaped) {
          this.onPlayerEscaped();
        }
      }
    }
  }

  handleItemPickup(item, player, collisionSystem) {
    if (item.id === 'book') {
      this.objectiveBook = true;
    } else if (item.id === 'coffee') {
      this.objectiveCoffee = true;
      player.activateCoffeeBoost(item.meta.powerUpDuration || 8000);
    }

    if (this.onItemCollected) {
      this.onItemCollected(item);
    }

    // Verificar si ambos objetivos están completos para desbloquear la salida
    if (this.objectiveBook && this.objectiveCoffee && !this.gateUnlocked) {
      this.gateUnlocked = true;
      collisionSystem.setGateUnlocked(true);
      if (this.onGateUnlocked) {
        this.onGateUnlocked();
      }
    }
  }

  draw(ctx) {
    for (const item of this.items) {
      item.draw(ctx);
    }
  }
}
