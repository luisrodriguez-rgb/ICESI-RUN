/**
 * Manejo de entradas: Teclado (WASD / Flechas) y controles táctiles virtuales
 */

export class Input {
  constructor() {
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      sprint: false
    };

    this.touchDirection = { x: 0, y: 0 };
    this.setupKeyboardListeners();
    this.setupTouchListeners();
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      this.handleKey(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.handleKey(e.code, false);
    });
  }

  handleKey(code, isDown) {
    switch (code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.up = isDown;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.down = isDown;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = isDown;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = isDown;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
      case 'Space':
        this.keys.sprint = isDown;
        break;
    }
  }

  setupTouchListeners() {
    const bindBtn = (id, directionKey) => {
      const btn = document.getElementById(id);
      if (!btn) return;

      const start = (e) => {
        e.preventDefault();
        this.keys[directionKey] = true;
      };
      const end = (e) => {
        e.preventDefault();
        this.keys[directionKey] = false;
      };

      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };

    bindBtn('btn-up', 'up');
    bindBtn('btn-down', 'down');
    bindBtn('btn-left', 'left');
    bindBtn('btn-right', 'right');
    bindBtn('btn-sprint', 'sprint');

    // Auto-detect mobile devices to display mobile controls
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mobileControls = document.getElementById('mobile-controls');
    if (isTouchDevice && mobileControls) {
      mobileControls.classList.remove('hidden');
    }
  }

  getAxis() {
    let x = 0;
    let y = 0;

    if (this.keys.left) x -= 1;
    if (this.keys.right) x += 1;
    if (this.keys.up) y -= 1;
    if (this.keys.down) y += 1;

    // Normalizar diagonal
    if (x !== 0 && y !== 0) {
      const length = Math.SQRT2;
      x /= length;
      y /= length;
    }

    return { x, y, isSprint: this.keys.sprint };
  }
}
