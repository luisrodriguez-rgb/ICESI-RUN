export class LoreToast {
  constructor() {
    this.toastElement = document.getElementById('lore-toast');
    this.titleElement = document.getElementById('lore-title');
    this.textElement = document.getElementById('lore-text');
    this.timeoutId = null;
  }

  show(title, description, durationMs = 3500) {
    if (!this.toastElement) return;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.titleElement.textContent = title;
    this.textElement.textContent = description;
    this.toastElement.classList.remove('hidden');

    this.timeoutId = setTimeout(() => {
      this.toastElement.classList.add('hidden');
      this.timeoutId = null;
    }, durationMs);
  }

  hide() {
    if (this.toastElement) {
      this.toastElement.classList.add('hidden');
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
