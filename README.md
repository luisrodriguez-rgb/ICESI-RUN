# ICESI RUN — Escapa del Campus 🏃‍♂️💨🏛️

> **"Tu campus, ahora es un videojuego. Explora. Juega. Descubre."**

[![Universidad Icesi](https://img.shields.io/badge/Campus-Universidad%20Icesi%20(Cali)-002B49?style=for-the-badge)](https://www.icesi.edu.co)
[![Arcade](https://img.shields.io/badge/Género-Arcade%20de%20Persecución-FF6B00?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Tecnología-Vanilla%20JS%20%7C%20HTML5%20Canvas-2E7D32?style=for-the-badge)](#)

---

## 🎮 ¿Qué es ICESI RUN?

**ICESI RUN** es un arcade de persecución top-down 2D ambientado en la planta física real de la **Universidad Icesi** (Cali, Colombia). 

El principio rector es: **"El campus es el laberinto"**. El jugador no recorre un laberinto genérico, sino los pasillos, bulevares y plazoletas reales de Icesi: desde los **Edificios A, B, C y D**, pasando por **El Samán**, la **Biblioteca Carvajal**, la **Cafetería Central y Shillers**, hasta las canchas deportivas y las porterías de escape.

---

## 🕹️ Bucle de Juego (Core Loop)

```text
       INICIO (Portería 1)
               ↓
   Recorrer pasillos y bulevares
               ↓
  Recolectar Créditos Académicos (+10 pts)
               ↓
  Conseguir Objetivos Clave:
  📘 Libro de Reserva (Biblioteca Carvajal)
  ☕ Café de Shillers (Cafetería Central - Turbo ⚡)
               ↓
  Superar Amenazas:
  🛺 Vigilante (Patrulla en bucle cerrado)
  📋 Monitor (Perseguidor por proximidad y cono de visión)
  🦎 Iguana del Samán (Obstáculo dinámico neutral)
               ↓
  ¡ALERTA DE CIERRE DE CAMPUS! 🚨
               ↓
  Desbloqueo de Portería 2 (Callejón de las Chuchas)
               ↓
  ¡ESCAPE TRIUNFAL Y GRADUACIÓN! 🏆
```

---

## 🏛️ Zonas Emblemáticas del Campus

| # | Zona en el Campus | Rol en el Juego |
| :---: | :--- | :--- |
| **1** | **Portería 1** | Acceso por Avenida Cañasgordas (Punto de Spawn) |
| **2** | **Edificios A - B - C - D** | Núcleo académico, pasillos de ladrillo y aulas |
| **3** | **Plaza del Samán** | Centro verde y sombra icónica custodiada por la Iguana |
| **4** | **Biblioteca Carvajal** | Misión: Recoger el Libro de Reserva (+250 pts) |
| **5** | **Cafetería Central & Shillers** | Misión: Café Expreso (+250 pts y +55% velocidad turbo) |
| **6** | **Auditorios** | Gran bloque cilíndrico en el eje cultural |
| **7** | **Edificio L & Bienestar** | Talleres de diseño y área de salud estudiantil |
| **8** | **Zona Deportiva** | Canchas de fútbol, básquet, piscina y Coliseo 2 |
| **9** | **Portería 2** | Salida oriental hacia el Callejón de las Chuchas (Meta) |

---

## ⚡ Características Principales

- **Física y Colisiones Precisas**: Deslizamiento suave en muros (wall-sliding) a 60 FPS estables.
- **Enemigos Mecánicos**:
  - **Vigilante en Carrito**: Rutas de patrullaje predecibles con haz de luz frontal interactivo.
  - **Monitor con Quices**: Detecta al jugador por línea de visión directa (raycasting) y regresa a su base si pierde el rastro.
  - **Iguana de Pance**: Se asolea, camina lentamente y bloquea rutas como obstáculo dinámico vivo.
  - **El Cierre**: Amenaza de máxima velocidad activada en el tramo final de escape.
- **HUD Minimalista**: Marcador de puntuación, vidas, checklist de misión y cronómetro digital.
- **Audio Procedural Web Audio API**: Sonidos arcade retro sintetizados en tiempo real sin requerir archivos de audio externos.
- **Controles Multiplataforma**:
  - **Teclado**: Flechas direccionales o teclas `WASD`.
  - **Móvil**: D-Pad táctil virtual y botón de acción integrados.

---

## 🚀 Instalación y Ejecución Local

No requiere frameworks pesados, Node ni gestores de paquetes. Es 100% Vanilla JavaScript modular.

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/luisrodriguez-rgb/ICESI-RUN.git
   cd ICESI-RUN
   ```

2. **Iniciar un servidor HTTP local**:
   - Con Python:
     ```bash
     python3 -m http.server 5173
     ```
   - O con Node / npx:
     ```bash
     npx serve
     ```

3. **Abrir en el navegador**:
   ```text
   http://localhost:5173
   ```

---

## 👥 Cultura y Comunidad Icesi

Desarrollado con identidad caleña e icesista para toda la comunidad universitaria.

*¡Tu campus, ahora es un videojuego!*
