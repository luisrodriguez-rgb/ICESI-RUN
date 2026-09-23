import { Game } from './core/Game.js';

window.addEventListener('DOMContentLoaded', () => {
  // Inicializar el juego al cargar la página
  const game = new Game();
  window.__ICESI_GAME__ = game; // Exposición para depuración si fuese necesario
});
