# Dirección Artística y Biblia Visual: ICESI RUN

## 1. Regla de Oro
> **"Todo objeto o actor importante en pantalla debe identificarse en menos de un segundo."**

No hacemos pixel art borroso ni fondos monocromáticos. El estilo es **Top-down 2.5D arcade de alta fidelidad** con siluetas definidas, iluminación dinámica y jerarquía visual estricta.

---

## 2. Escala y Dimensiones Métricas

- **Grid Base:** $1\text{ tile} = 0.5\text{ metros}$ en espacio de mundo.
- **Protagonista (Estudiante):** Altura $\approx 1.0 - 1.2\text{ tiles}$ ($0.5m - 0.6m$ en planta, permitiendo ver cabeza, hombros y morral).
- **Corredores Peatonales:** Ancho de $3\text{ a }5\text{ tiles}$ ($1.5m - 2.5m$), permitiendo cruce fluido entre jugador y amenazas.
- **Bulevares Principales (Cañasgordas / Central):** $6\text{ a }8\text{ tiles}$ ($3m - 4m$).
- **Muros de Edificios:** Grosor de $1\text{ tile}$ con bisel superior sombreado.

---

## 3. Paleta de Identidad Cromática

| Nombre del Color | Hex Code | Uso Semántico |
| :--- | :--- | :--- |
| **Icesi Blue** | `#002B49` | Chaqueta del estudiante, letreros institucionales, marcos de UI |
| **Icesi Blue Light** | `#004B80` | Resaltados de interfaz, bordes activos |
| **Terracotta Brick** | `#B85D38` | Ladrillo a la vista característico de los edificios de Icesi |
| **Brick Dark / Mortar**| `#7A2B16` | Juntas de ladrillo, zócalos y sombras proyectadas de muros |
| **Campus Green (Pance)**| `#2E7D32` | Zonas verdes, jardines y follaje denso del Samán |
| **Canopy Highlight** | `#4CAF50` | Crestas de luz en las copas de los árboles |
| **Concrete Grey** | `#2B3B4E` | Baldosas peatonales y asfalto de vías perimetrales |
| **Warm Gold** | `#FFD166` | Puntos de créditos académicos, luz de lámparas interiores |
| **Shillers Orange** | `#FF6B00` | Morral del estudiante, vaso de café, rastro de turbo |
| **Alert Red** | `#EF4444` | Balizas de seguridad, conos de peligro de monitores, rejas cerradas |

---

## 4. Jerarquía de Animación de Personajes

Para evitar el cuello de botella de animar 500 sprites a mano, la producción se divide en tres niveles de fidelidad:

```text
NIVEL 1: PROTAGONISTA (Artesanal Frame-by-Frame en Aseprite)
  ├── IDLE (4 frames - respiración sutil)
  ├── WALK (6 frames - balanceo de brazos y morral)
  ├── RUN (8 frames - zancadas enérgicas e inclinación hacia adelante)
  ├── TURN / DRIFT (2 frames - frenado con micropartículas de polvo)
  ├── HIT / DAMAGE (3 frames - sacudida y parpadeo de invulnerabilidad)
  ├── POWERUP_COFFEE (4 frames - aura radiante)
  └── ESCAPE_VICTORY (6 frames - puño en alto de graduación)

NIVEL 2: LOS 4 ENEMIGOS PRINCIPALES (Frame-by-Frame + FX Procedurales)
  ├── Vigilante: Faros con 2D Spot Light y giro de ruedas.
  ├── Monitor: Tabla de quices animada y globo de exclamación '!'.
  ├── La Entrega: Cronómetro digital flotante sobre su silueta.
  └── La Iguana: Movimiento reptiliano de cola y pestañeo al asolearse.

NIVEL 3: NPCS SECUNDARIOS DEL CAMPUS (2D Skeletal Animation con IK en Unity)
  ├── 1 esqueleto base con huesos (Head, Torso, Arms, Legs).
  ├── Múltiples skins de ropa y peinados (estudiantes con celular, profesores con maletín).
  └── Animaciones reutilizables: Walk, Idle sentado en banca, Chatting.
```

---

## 5. Iluminación y Sombra (Directrices de Render)

1. **Dirección de Luz Solar Exterior:**
   - Ángulo fijo de $45^\circ$ desde el noroeste simulando la caída de sol de la tarde en Pance.
   - Sombras proyectadas suaves en el suelo hacia el sureste con longitud $\approx 0.6 \times \text{altura del muro}$.
2. **Luces Interiores Cálidas:**
   - La Biblioteca Carvajal posee un perfil de luz dorada íntima (`#FFF3D6`, intensidad $0.8$), contrastando con el exterior fresco.
3. **Señalización Nocturna y Alarma:**
   - Durante el evento de cierre, las luces ambientales bajan un $60\%$ y las balizas de emergencia rojas parpadean proyectando conos dinámicos sobre los corredores.
