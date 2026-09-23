export class Screens {
  constructor() {
    this.startScreen = document.getElementById('start-screen');
    this.victoryScreen = document.getElementById('victory-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');

    this.btnStart = document.getElementById('btn-start');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    this.btnRetry = document.getElementById('btn-retry');

    // Elementos de métricas finales
    this.finalScore = document.getElementById('final-score');
    this.finalTime = document.getElementById('final-time');
    this.finalCredits = document.getElementById('final-credits');

    this.goReason = document.getElementById('game-over-reason');
    this.goScore = document.getElementById('go-score');
    this.goCredits = document.getElementById('go-credits');

    this.onStartGame = null;
    this.onRestartGame = null;

    this.setupListeners();
  }

  setupListeners() {
    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => {
        if (this.onStartGame) this.onStartGame();
      });
    }

    if (this.btnPlayAgain) {
      this.btnPlayAgain.addEventListener('click', () => {
        if (this.onRestartGame) this.onRestartGame();
      });
    }

    if (this.btnRetry) {
      this.btnRetry.addEventListener('click', () => {
        if (this.onRestartGame) this.onRestartGame();
      });
    }
  }

  showStartScreen() {
    this.hideAll();
    this.startScreen.classList.remove('hidden');
  }

  showVictoryScreen(stats) {
    this.hideAll();
    if (this.finalScore) this.finalScore.textContent = stats.score;
    if (this.finalTime) this.finalTime.textContent = stats.time;
    if (this.finalCredits) this.finalCredits.textContent = `${stats.creditsCollected}/${stats.totalCredits}`;
    this.victoryScreen.classList.remove('hidden');
  }

  showGameOverScreen(stats, reason) {
    this.hideAll();
    if (this.goReason && reason) this.goReason.textContent = reason;
    if (this.goScore) this.goScore.textContent = stats.score;
    if (this.goCredits) this.goCredits.textContent = stats.creditsCollected;
    this.gameOverScreen.classList.remove('hidden');
  }

  hideAll() {
    this.startScreen.classList.add('hidden');
    this.victoryScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
  }
}
