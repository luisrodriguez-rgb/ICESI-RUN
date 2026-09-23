# Game Design Document: ICESI RUN — Escapa del Campus

## 1. Visión y Filosofía de Diseño
**ICESI RUN** es un arcade de persecución top-down 2.5D ambientado en la Universidad Icesi (Cali, Colombia).
- **Premisa central:** *"El campus es el laberinto"*.
- **Propósito:** Capturar la esencia de *Pac-Man* (legibilidad instantánea, dominio de rutas, tensión de esquinas y ritmo vertiginoso) y recontextualizarla en la cultura, geografía y situaciones de la vida universitaria.
- **Formato:** Partidas intensas de 2 a 4 minutos orientadas a alta rejugabilidad y competencia social (*"Una partida más y supero a mi amigo"*).

---

## 2. Los Cuatro Pilares de Pac-Man Contemporáneo

1. **Lectura Instantánea en Menos de 1 Segundo**:
   - `Verde / Calmado` = Zona segura, senderos transitables.
   - `Rojo / Alerta` = Peligro inminente, cono de visión o intercepción de un enemigo.
   - `Dorado / Ámbar` = Crédito académico / recurso para puntaje.
   - `Celeste / Naranja` = Ítem de misión de alto valor o Power-Up activo.
2. **Curva de Riesgo / Recompensa**:
   - Desviarse hacia un callejón lateral por un puñado de créditos expone al jugador a quedar acorralado sin salida.
3. **Legibilidad de Amenazas (Personalidades Claras)**:
   - Los enemigos no son masas caóticas. Cada uno posee una silueta, color y comportamiento algorítmico predecible que el jugador aprende a explotar.
4. **Respuesta Inmediata de Control**:
   - El estudiante no derrapa con física pesada; el giro en esquinas es asistido y milimétrico gracias al búfer de entrada.

---

## 3. Bucle de Juego Principal (The Core Loop)

```text
       SPAWN EN PORTERÍA 1
               ↓
   Recorrer pasillos y bulevares
               ↓
  Recolectar Créditos Académicos (+10 pts)
               ↓
  Conseguir Objetivos Clave:
  📘 Libro de Reserva (Biblioteca Carvajal)
  ☕ Café de Shillers (Cafetería Central - Turbo ⚡)
               ↓
  Superar los 4 Arquetipos de Amenazas:
  - Monitor (Persecución directa)
  - Vigilante (Ruta perimetral fija)
  - La Entrega (Emboscada predictiva)
  - El Caos / Iguana (Obstáculo dinámico estocástico)
               ↓
  ¡ALERTA DE CIERRE DE CAMPUS! 🚨
               ↓
  Desbloqueo de Portería 2 (Callejón de las Chuchas)
               ↓
  ¡ESCAPE EXITOSO Y EVALUACIÓN DE SEMESTRE! 🏆
```

---

## 4. Estructura de Progresión

- **Nivel 1: Conoce Icesi (Vertical Slice)**:
  - Ruta: Portería 1 → Edificio A → Plaza del Samán → Biblioteca Carvajal.
  - Amenazas: 1 Vigilante y 1 Monitor.
- **Nivel 2: Campus Central**:
  - Se desbloquean Cafetería Central, Shillers, Edificios B, C, D y Auditorios.
  - Aparece *La Entrega* (emboscador predictivo).
- **Nivel 3: El Gran Campus (Graduación o Fuga)**:
  - Campus completo con Edificio L (Diseño), Bienestar, Coliseo 2, Canchas y Zona Natural.
  - Eventos climáticos dinámicos (lluvia de Pance) y el evento de cierre activado.

---

## 5. Game Feel y Retroalimentación Táctil (*Juice*)

- **Hit-Stop (Micro-pausa de 50ms):** El fotograma se congela brevemente al recibir daño para impartir impacto físico.
- **Screen Shake Ortográfico:** Sacudida procedural basada en ruido Perlin amortiguado en impactos y alarmas.
- **Corner Snapping:** Asistencia inteligente al doblar corredores para nunca perder momentum.
- **Partículas de Polvo y Giro:** Estelas ligeras generadas en las curvas cerradas y estela luminosa con el café turbo.
