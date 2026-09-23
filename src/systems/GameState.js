export const STATES = {
  START: 'START',
  PLAYING: 'PLAYING',
  WON: 'WON',
  GAME_OVER: 'GAME_OVER'
};

export class GameState {
  constructor(initialTimeSeconds = 150) {
    this.initialTime = initialTimeSeconds;
    this.remainingTime = initialTimeSeconds;
    this.state = STATES.START;

    this.score = 0;
    this.creditsCollected = 0;
    this.totalCredits = 0;
    this.gameOverReason = '';
  }

  reset(totalCredits = 0) {
    this.remainingTime = this.initialTime;
    this.state = STATES.PLAYING;
    this.score = 0;
    this.creditsCollected = 0;
    this.totalCredits = totalCredits;
    this.gameOverReason = '';
  }

  addScore(points) {
    this.score += points;
  }

  recordCredit() {
    this.creditsCollected += 1;
    this.addScore(10);
  }

  update(dt) {
    if (this.state !== STATES.PLAYING) return;

    this.remainingTime -= dt;
    if (this.remainingTime <= 0) {
      this.remainingTime = 0;
      this.triggerGameOver('¡El campus cerró sus puertas y quedaste encerrado!');
    }
  }

  triggerVictory() {
    this.state = STATES.WON;
    // Bonificación de escape por tiempo sobrante
    const timeBonus = Math.floor(this.remainingTime) * 5;
    this.addScore(500 + timeBonus);
  }

  triggerGameOver(reason = 'El personal de seguridad te interceptó.') {
    this.state = STATES.GAME_OVER;
    this.gameOverReason = reason;
  }

  getFormattedTime() {
    const totalSecs = Math.max(0, Math.ceil(this.remainingTime));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
