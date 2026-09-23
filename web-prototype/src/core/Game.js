import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { CollisionSystem } from './Collision.js';
import { Player } from '../entities/Player.js';
import { generateCredits } from '../entities/Collectible.js';
import { MissionSystem } from '../systems/MissionSystem.js';
import { EnemyAI } from '../systems/EnemyAI.js';
import { GameState, STATES } from '../systems/GameState.js';
import { HUD } from '../ui/HUD.js';
import { LoreToast } from '../ui/LoreToast.js';
import { Screens } from '../ui/Screens.js';
import { AudioManager } from '../audio/AudioManager.js';
import {
  CAMPUS_GRID,
  TILE_SIZE,
  BUILDING_LABELS,
  SPAWN_PLAYER,
  MISSION_ITEMS,
  GATE_2_DOOR_TILES
} from '../world/map.js';
import { TILE_TYPES, TILE_PROPERTIES } from '../world/tiles.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.grid = CAMPUS_GRID;
    this.worldWidth = this.grid[0].length * TILE_SIZE;
    this.worldHeight = this.grid.length * TILE_SIZE;

    // Sistemas
    this.input = new Input();
    this.collision = new CollisionSystem(this.grid);
    this.camera = new Camera(800, 600, this.worldWidth, this.worldHeight);
    this.gameState = new GameState(150); // 2 minutos 30 seg
    this.hud = new HUD();
    this.lore = new LoreToast();
    this.screens = new Screens();
    this.audio = new AudioManager();

    this.player = new Player(SPAWN_PLAYER.tileX, SPAWN_PLAYER.tileY);
    this.mission = new MissionSystem();
    this.enemies = new EnemyAI();
    this.credits = [];

    this.lastTime = 0;
    this.running = false;
    this.particles = [];

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Callbacks de UI y pantallas
    this.screens.onStartGame = () => this.startNewGame();
    this.screens.onRestartGame = () => this.startNewGame();

    // Callbacks de misiones
    this.mission.onItemCollected = (item) => {
      this.audio.playMissionItem();
      this.gameState.addScore(250);
      this.createItemExplosion(item.x, item.y, item.id === 'book' ? '#38bdf8' : '#fb923c');

      if (item.id === 'coffee') {
        this.audio.playTurbo();
      }
    };

    this.mission.onGateUnlocked = () => {
      this.audio.playAlarm();
      this.hud.showAlert('¡CAMPUS EN CIERRE! ¡CORRE A LA PORTERÍA 2!');
      this.enemies.triggerClosingEvent();
    };

    this.mission.onZoneDiscovered = (zone) => {
      this.lore.show(zone.name, zone.lore);
      this.gameState.addScore(50);
    };

    this.mission.onPlayerEscaped = () => {
      if (this.gameState.state === STATES.PLAYING) {
        this.gameState.triggerVictory();
        this.audio.playVictory();
        this.hud.hide();
        this.screens.showVictoryScreen({
          score: this.gameState.score,
          time: this.gameState.getFormattedTime(),
          creditsCollected: this.gameState.creditsCollected,
          totalCredits: this.gameState.totalCredits
        });
      }
    };

    // Callback de daño al jugador
    this.enemies.onPlayerHit = (enemy) => {
      this.audio.playHit();
      this.createDamageSparks(this.player.x, this.player.y);

      if (this.player.lives <= 0) {
        this.gameState.triggerGameOver(
          enemy.name === 'Vigilante'
            ? 'El vigilante en carrito te interceptó.'
            : enemy.name === 'Monitor'
            ? 'El monitor te alcanzó con el quiz sorpresa.'
            : 'El equipo de cierre bloqueó tu salida.'
        );
        this.audio.playGameOver();
        this.hud.hide();
        this.screens.showGameOverScreen({
          score: this.gameState.score,
          creditsCollected: this.gameState.creditsCollected
        }, this.gameState.gameOverReason);
      }
    };

    // Bucle inicial
    requestAnimationFrame((t) => this.loop(t));
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    this.camera.resize(width, height);
  }

  startNewGame() {
    this.audio.init();

    // Resetear entidades y sistemas
    this.player = new Player(SPAWN_PLAYER.tileX, SPAWN_PLAYER.tileY);
    this.mission = new MissionSystem();
    this.collision.setGateUnlocked(false);
    this.enemies.reset();

    // Reasignar callbacks
    this.mission.onItemCollected = (item) => {
      this.audio.playMissionItem();
      this.gameState.addScore(250);
      this.createItemExplosion(item.x, item.y, item.id === 'book' ? '#38bdf8' : '#fb923c');
      if (item.id === 'coffee') this.audio.playTurbo();
    };

    this.mission.onGateUnlocked = () => {
      this.audio.playAlarm();
      this.hud.showAlert('¡CAMPUS EN CIERRE! ¡CORRE A LA PORTERÍA 2!');
      this.enemies.triggerClosingEvent();
    };

    this.mission.onZoneDiscovered = (zone) => {
      this.lore.show(zone.name, zone.lore);
      this.gameState.addScore(50);
    };

    this.mission.onPlayerEscaped = () => {
      if (this.gameState.state === STATES.PLAYING) {
        this.gameState.triggerVictory();
        this.audio.playVictory();
        this.hud.hide();
        this.screens.showVictoryScreen({
          score: this.gameState.score,
          time: this.gameState.getFormattedTime(),
          creditsCollected: this.gameState.creditsCollected,
          totalCredits: this.gameState.totalCredits
        });
      }
    };

    // Generar créditos de pasillo
    this.credits = generateCredits(this.grid, MISSION_ITEMS);
    this.gameState.reset(this.credits.length);

    this.screens.hideAll();
    this.hud.show();
    this.hud.hideAlert();
    this.running = true;
  }

  createItemExplosion(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6 + Math.random() * 0.4,
        maxLife: 1.0,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }

  createDamageSparks(x, y) {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4,
        maxLife: 0.4,
        color: '#ef4444',
        size: 3
      });
    }
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.gameState.state !== STATES.PLAYING) return;

    this.gameState.update(dt);

    // Movimiento del jugador
    const axis = this.input.getAxis();
    this.player.update(dt, axis, this.collision);

    // Centrar cámara en el jugador
    this.camera.setTarget(this.player.x, this.player.y);
    this.camera.update();

    // Coleccionables (créditos)
    for (let i = this.credits.length - 1; i >= 0; i--) {
      const c = this.credits[i];
      c.update(dt);
      if (!c.isCollected && c.checkCollision(this.player)) {
        c.isCollected = true;
        this.gameState.recordCredit();
        this.audio.playCredit();
      }
    }

    // Sistema de misiones
    this.mission.update(this.player, this.collision);

    // Sistema de enemigos e iguana
    this.enemies.update(dt, this.player, this.collision);

    // Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Actualizar HUD
    this.hud.update(
      this.gameState.score,
      this.gameState.getFormattedTime(),
      this.player.lives,
      {
        bookCollected: this.mission.objectiveBook,
        coffeeCollected: this.mission.objectiveCoffee,
        gateUnlocked: this.mission.gateUnlocked
      }
    );
  }

  render() {
    const width = this.camera.viewportWidth;
    const height = this.camera.viewportHeight;

    // Limpiar pantalla
    this.ctx.fillStyle = '#0a1017';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.save();
    this.camera.apply(this.ctx);

    // 1. Dibujar tiles del campus
    this.renderCampusMap();

    // 2. Dibujar créditos dorados
    for (const c of this.credits) {
      c.draw(this.ctx);
    }

    // 3. Dibujar ítems de misión
    this.mission.draw(this.ctx);

    // 4. Dibujar enemigos e iguana
    this.enemies.draw(this.ctx);

    // 5. Dibujar estudiante (jugador)
    this.player.draw(this.ctx);

    // 6. Dibujar partículas
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 7. Dibujar copas de árboles y rótulos superiores
    this.renderCanopyAndLabels();

    this.ctx.restore();
  }

  renderCampusMap() {
    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE));
    const endCol = Math.min(this.grid[0].length - 1, Math.ceil((this.camera.x + this.camera.viewportWidth) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE));
    const endRow = Math.min(this.grid.length - 1, Math.ceil((this.camera.y + this.camera.viewportHeight) / TILE_SIZE));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const type = this.grid[r][c];
        const prop = TILE_PROPERTIES[type];
        const px = c * TILE_SIZE;
        const py = r * TILE_SIZE;

        if (type === TILE_TYPES.BUILDING) {
          // Edificio en ladrillo Icesi con bisel y sombra
          this.ctx.fillStyle = '#7a2b16';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

          // Techo de ladrillo terracota
          this.ctx.fillStyle = '#b85d38';
          this.ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);

          // Líneas sutiles de juntas
          this.ctx.strokeStyle = '#933e21';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        } else if (type === TILE_TYPES.PATH) {
          // Pasillo peatonal de baldosas
          this.ctx.fillStyle = '#223040';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

          this.ctx.strokeStyle = '#2b3b4e';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        } else if (type === TILE_TYPES.GRASS) {
          // Zonas verdes
          this.ctx.fillStyle = '#173620';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          this.ctx.fillStyle = '#1f482b';
          this.ctx.fillRect(px + 8, py + 8, 4, 4);
          this.ctx.fillRect(px + 24, py + 20, 4, 4);
        } else if (type === TILE_TYPES.CAFETERIA) {
          // Terraza de cafetería
          this.ctx.fillStyle = '#2c3c4f';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // Mesa redonda
          this.ctx.beginPath();
          this.ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 7, 0, Math.PI * 2);
          this.ctx.fillStyle = '#64748b';
          this.ctx.fill();
        } else if (type === TILE_TYPES.WATER) {
          // Fuente / Espejo de agua
          this.ctx.fillStyle = '#0f3c5f';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          this.ctx.fillStyle = '#185686';
          this.ctx.fillRect(px + 6, py + 6, TILE_SIZE - 12, TILE_SIZE - 12);
        } else if (type === TILE_TYPES.GATE_1) {
          // Portería 1 (Entrada Norte)
          this.ctx.fillStyle = '#1e3a5f';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          this.ctx.fillStyle = '#38bdf8';
          this.ctx.fillRect(px + 4, py + TILE_SIZE - 6, TILE_SIZE - 8, 4);
        } else if (type === TILE_TYPES.DOOR_LOCKED) {
          // Reja de Portería 2 (bloqueada o abierta)
          if (this.mission.gateUnlocked) {
            this.ctx.fillStyle = '#1e3a24';
            this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            // Flecha verde indicando salida
            this.ctx.fillStyle = '#4ade80';
            this.ctx.fillRect(px + 4, py + 16, TILE_SIZE - 8, 8);
          } else {
            this.ctx.fillStyle = '#3f1a1d';
            this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            // Barrotes rojos de seguridad
            this.ctx.strokeStyle = '#ef4444';
            this.ctx.lineWidth = 2.5;
            for (let i = 6; i < TILE_SIZE; i += 8) {
              this.ctx.beginPath();
              this.ctx.moveTo(px + i, py);
              this.ctx.lineTo(px + i, py + TILE_SIZE);
              this.ctx.stroke();
            }
          }
        } else if (type === TILE_TYPES.GATE_2) {
          // Portería 2 (Zona de escape)
          this.ctx.fillStyle = this.mission.gateUnlocked ? '#164e2d' : '#1e293b';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        } else {
          // Exterior / Asfalto
          this.ctx.fillStyle = prop ? prop.color : '#0e1520';
          this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  renderCanopyAndLabels() {
    // 1. Renderizar El Gran Samán en la plaza central
    const samanCenterX = 16.5 * TILE_SIZE;
    const samanCenterY = 10.5 * TILE_SIZE;

    // Gran copa del Samán con anillos de follaje
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(samanCenterX, samanCenterY, 52, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(21, 94, 45, 0.88)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    this.ctx.shadowBlur = 14;
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(samanCenterX - 8, samanCenterY - 6, 36, 0, Math.PI * 2);
    this.ctx.fillStyle = '#16a34a';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(samanCenterX + 10, samanCenterY + 8, 30, 0, Math.PI * 2);
    this.ctx.fillStyle = '#22c55e';
    this.ctx.fill();
    this.ctx.restore();

    // 2. Rótulos arquitectónicos de los edificios del campus
    this.ctx.save();
    this.ctx.font = 'bold 10px Outfit, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (const label of BUILDING_LABELS) {
      const lx = label.x * TILE_SIZE;
      const ly = label.y * TILE_SIZE;

      // Píldora de fondo
      this.ctx.font = 'bold 9px Outfit, sans-serif';
      const textWidth = this.ctx.measureText(label.name).width;

      this.ctx.fillStyle = 'rgba(10, 20, 32, 0.85)';
      this.ctx.beginPath();
      this.ctx.roundRect(lx - textWidth / 2 - 6, ly - 8, textWidth + 12, 16, [4]);
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(label.name, lx, ly);
    }

    this.ctx.restore();
  }
}
