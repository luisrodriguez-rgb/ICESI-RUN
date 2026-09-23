export class HUD {
  constructor() {
    this.hudElement = document.getElementById('game-hud');
    this.scoreDisplay = document.getElementById('score-display');
    this.timerDisplay = document.getElementById('timer-display');
    this.livesDisplay = document.getElementById('lives-display');
    this.alertBanner = document.getElementById('alert-banner');
    this.alertText = document.getElementById('alert-text');

    this.itemBook = document.getElementById('item-book');
    this.itemCoffee = document.getElementById('item-coffee');
    this.itemGate = document.getElementById('item-gate');
  }

  show() {
    this.hudElement.classList.remove('hidden');
  }

  hide() {
    this.hudElement.classList.add('hidden');
    this.hideAlert();
  }

  update(score, formattedTime, lives, missionState) {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = String(score).padStart(5, '0');
    }

    if (this.timerDisplay) {
      this.timerDisplay.textContent = formattedTime;
    }

    if (this.livesDisplay) {
      const pips = this.livesDisplay.querySelectorAll('.life-pip');
      pips.forEach((pip, index) => {
        if (index < lives) {
          pip.classList.remove('lost');
        } else {
          pip.classList.add('lost');
        }
      });
    }

    // Actualizar checklist de misión
    if (missionState) {
      if (missionState.bookCollected && this.itemBook) {
        this.itemBook.className = 'mission-item done';
      } else if (this.itemBook) {
        this.itemBook.className = 'mission-item pending';
      }

      if (missionState.coffeeCollected && this.itemCoffee) {
        this.itemCoffee.className = 'mission-item done';
      } else if (this.itemCoffee) {
        this.itemCoffee.className = 'mission-item pending';
      }

      if (missionState.gateUnlocked && this.itemGate) {
        this.itemGate.className = 'mission-item unlocked';
        this.itemGate.querySelector('.item-name').textContent = '⚡ Portería 2 (¡ESCAPA!)';
      } else if (this.itemGate) {
        this.itemGate.className = 'mission-item locked';
        this.itemGate.querySelector('.item-name').textContent = '🔒 Portería 2 (Salida)';
      }
    }
  }

  showAlert(message = '¡CAMPUS EN CIERRE! ¡CORRE A LA PORTERÍA 2!') {
    if (this.alertBanner) {
      this.alertText.textContent = message;
      this.alertBanner.classList.remove('hidden');
    }
  }

  hideAlert() {
    if (this.alertBanner) {
      this.alertBanner.classList.add('hidden');
    }
  }
}
