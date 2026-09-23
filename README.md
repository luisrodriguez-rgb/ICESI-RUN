# ICESI RUN — Escapa del Campus 🏃‍♂️💨🏛️

> **"Tu campus, ahora es un videojuego. Explora. Juega. Descubre."**

[![Universidad Icesi](https://img.shields.io/badge/Campus-Universidad%20Icesi%20(Cali)-002B49?style=for-the-badge)](https://www.icesi.edu.co)
[![Engine](https://img.shields.io/badge/Engine-Unity%206%20LTS%20%7C%20URP%202D-000000?style=for-the-badge&logo=unity)](https://unity.com)
[![Arcade](https://img.shields.io/badge/Género-Top--Down%20Arcade%202.5D-FF6B00?style=for-the-badge)](#)
[![Platforms](https://img.shields.io/badge/Plataformas-Web%20(WASM)%20%7C%20Desktop%20%7C%20Mobile-2E7D32?style=for-the-badge)](#)

---

## 🎮 Visión del Proyecto

**ICESI RUN** es un arcade de persecución top-down 2.5D de alta fidelidad ambientado en la planta física real de la **Universidad Icesi** (Cali, Colombia). 

El principio rector es: **"El campus es el laberinto"**. El proyecto no es un clon retro genérico, sino una reconstrucción contemporánea de las mecánicas que hicieron legendario a *Pac-Man*:
- **Lectura visual instantánea** en menos de un segundo.
- **Movimiento híbrido asistido** en corredores con ventana de *Corner Buffering* dinámica.
- **Grafo de circulación del campus** donde la IA enemiga toma decisiones en intersecciones con 4 personalidades matemáticas legibles.
- **Iluminación 2D y sombras dinámicas** (*2D Lights + Shadow Caster 2D + Normal Maps + Bloom*) simulando la atmósfera de Pance y los interiores de la universidad.

---

## 📚 Documentación de Ingeniería y Diseño

Toda la arquitectura, especificación de sistemas y biblia de arte están documentadas en la carpeta [`docs/`](./docs/):

| Documento | Descripción |
| :--- | :--- |
| 📖 [**GDD.md**](./docs/GDD.md) | Game Design Document: filosofía de diseño, bucle de juego, mecánicas principales y feedback táctil (*juice*). |
| ⚙️ [**TECHNICAL_SPEC.md**](./docs/TECHNICAL_SPEC.md) | Especificación técnica de Unity 6 URP 2D, algoritmo de movimiento en corredores y optimización WebGL. |
| 🎨 [**ART_DIRECTION.md**](./docs/ART_DIRECTION.md) | Biblia de arte: escala métrica, paleta de color de Icesi, jerarquía de animación y reglas de iluminación 2D. |
| 🗺️ [**CAMPUS_GRAPH_SPEC.md**](./docs/CAMPUS_GRAPH_SPEC.md) | Topología formal del grafo del campus: nodos, aristas, bulevares y zonas semánticas. |
| 🧠 [**AI_DESIGN.md**](./docs/AI_DESIGN.md) | Máquina de estados FSM y algoritmos de las 4 personalidades hostiles (Monitor, Vigilante, Entrega, Caos). |
| 🎯 [**VERTICAL_SLICE.md**](./docs/VERTICAL_SLICE.md) | Alcance espacial (Portería 1 → Edificio A → Samán → Biblioteca) y criterios de calidad para el demo de 1 minuto. |

---

## 🏛️ Zonas Principales del Campus

```text
                     [ AVENIDA CAÑASGORDAS ]
                       [ PORTERÍA 1 (START) ]
                                 │
     ┌───────────────────────────┴───────────────────────────┐
     │                     Bulevar Norte                     │
┌────┴────┐               ┌─────────────┐              ┌─────┴─────┐
│ EDIF. B │──[Pasillo]────│   EDIF. A   │──[Pasillo]───│BIBLIOTECA │
└────┬────┘               └──────┬──────┘              │ CARVAJAL  │
     │                           │                     └─────┬─────┘
     │                    [ EL SAMÁN ] (Plaza Central)       │
     │                           │                     ┌─────┴─────┐
┌────┴────┐               ┌──────┴──────┐              │CAFETERÍA  │
│ EDIF. C │──[Pasillo]────│   EDIF. D   │──[Pasillo]───│& SHILLERS │
└────┬────┘               └──────┬──────┘              └─────┬─────┘
     │                           │                           │
[BIENESTAR]                 Bulevar Sur                 [AUDITORIOS]
     │                           │                           │
[CANCHAS & DEPORTES]             │                     [PORTERÍA 2]
     │                           │                     (SALIDA META)
     └───────────────────────────┴───────────────────────────┘
```

---

## 📂 Estructura del Repositorio

```text
ICESI-RUN/
├── docs/                       # Especificaciones técnicas, GDD, biblia de arte y grafo
│   ├── GDD.md
│   ├── TECHNICAL_SPEC.md
│   ├── ART_DIRECTION.md
│   ├── CAMPUS_GRAPH_SPEC.md
│   ├── AI_DESIGN.md
│   └── VERTICAL_SLICE.md
│
├── UnityProject/               # Proyecto de producción en Unity 6 (URP 2D)
│   └── Assets/
│       ├── _Project/
│       │   ├── Code/
│       │   │   ├── Movement/   # CornerBuffer.cs, CorridorTracker.cs
│       │   │   ├── Graph/      # CampusGraph.cs, CampusNode.cs, CampusEdge.cs
│       │   │   ├── AI/         # EnemyController.cs (Decisiones en cruces)
│       │   │   └── Core/
│       │   ├── Data/           # ScriptableObjects (Zonas, Enemigos, Misiones)
│       │   ├── World/          # Tilemaps, Edificios en ladrillo, El Samán, Iluminación
│       │   └── UI/
│       └── Editor/             # Herramientas internas: MapValidator, CampusGraphEditor
│
└── web-prototype/              # Laboratorio web rápido (Canvas 2D) para testeo de mecánicas
    ├── index.html
    ├── styles.css
    └── src/
```

---

## ⚡ Cómo Probar el Laboratorio Rápido (`web-prototype`)

Para validar visualmente el flujo de misiones y la distribución espacial de forma inmediata:

```bash
cd web-prototype
python3 -m http.server 5173
```
Abrir en el navegador: `http://localhost:5173`

---

## 🚀 Hoja de Ruta de Desarrollo

1. **Fase 1: Game Feel Core (Unity 6)** — Movimiento continuo, corner buffering e interpolación en corredores.
2. **Fase 2: Vertical Slice** — Portería 1 → Edificio A → El Samán → Biblioteca Carvajal con arte e iluminación final URP 2D.
3. **Fase 3: Campus Central** — Desbloqueo de Cafetería Central, Shillers, Edificios B, C, D y Auditorios.
4. **Fase 4: Campus Completo & Modos Sociales** — Zonas deportivas, Leaderboard de facultades y retos de WhatsApp.
