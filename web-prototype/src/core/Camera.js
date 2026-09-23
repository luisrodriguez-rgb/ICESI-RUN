/**
 * Cámara 2D con seguimiento suave (lerp) sobre el jugador
 */

export class Camera {
  constructor(viewportWidth, viewportHeight, worldWidth, worldHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.lerpFactor = 0.08; // Suavidad de interpolación
  }

  resize(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  setTarget(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
  }

  update() {
    // Centrar la cámara en el objetivo
    const desiredX = this.targetX - this.viewportWidth / 2;
    const desiredY = this.targetY - this.viewportHeight / 2;

    // Interpolación suave
    this.x += (desiredX - this.x) * this.lerpFactor;
    this.y += (desiredY - this.y) * this.lerpFactor;

    // Limitar dentro de los límites del campus
    const maxX = Math.max(0, this.worldWidth - this.viewportWidth);
    const maxY = Math.max(0, this.worldHeight - this.viewportHeight);

    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  apply(ctx) {
    ctx.translate(-Math.round(this.x), -Math.round(this.y));
  }
}
