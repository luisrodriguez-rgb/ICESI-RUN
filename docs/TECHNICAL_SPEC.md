# Especificación Técnica: ICESI RUN (Unity 6 + URP 2D)

## 1. Stack de Producción y Plataformas de Destino

| Componente | Tecnología | Rol |
| :--- | :--- | :--- |
| **Motor** | **Unity 6 (6000.x LTS)** | Core Engine, gestión de memoria, bucle de simulación |
| **Render Pipeline** | **Universal Render Pipeline (URP 2D)** | Renderizado por capas, 2D Lights, Shadow Caster 2D |
| **Lenguaje** | **C# (.NET 8)** | Lógica desacoplada, arquitecturas por componentes |
| **Animación** | **2D Animation (Skeletal/IK) + Sprite Editor** | Frame-by-frame en protagonista y skeletal en NPCs |
| **Level Design** | **Unity Tilemap / LDtk / Tiled** | Grid de colisiones y capas estéticas del campus |
| **Target Builds** | **WebGL (WASM/Brotli) + Desktop + Mobile** | Web para distribución viral inmediata; Desktop para calidad máxima |

---

## 2. Movimiento Híbrido: Corredor Continuo + Navegación Discreta

El estudiante no es una esfera de física con masa inercial flotante ni un sprite bloqueado celda por celda. Posee **movimiento continuo asistido por corredores**:

### A. Representación Interna
- Cada corredor del campus se modela como un segmento dirigido entre dos nodos $A$ y $B$:
  $$\vec{P}(t) = \vec{A} + t \cdot (\vec{B} - \vec{A}), \quad t \in [0, 1]$$
- El jugador se desplaza a lo largo del eje del corredor actual, pero con coordenadas continuas en el mundo.

### B. Ventana Dinámica de Snapping (Corner Buffering)
Para que el giro se sienta natural tanto en pasillos estrechos como en bulevares amplios, la ventana de tolerancia para registrar un giro anticipado no es estática:
```csharp
float snapWindow = (corridorWidth * 0.35f) + (currentVelocity * bufferTimeFactor);
```
- Si la distancia al nodo de intersección es menor que `snapWindow` y el jugador ingresa una dirección ortogonal válida:
  1. Se almacena la intención de giro en el `InputBuffer`.
  2. Al llegar al umbral de la intersección, el sistema interpola suavemente la posición transversal hacia el eje del nuevo corredor.
  3. El impulso longitudinal se transfiere sin pérdida de velocidad (`velocity = targetVelocity`), emulando la sensación de precisión de *Pac-Man Championship Edition*.

---

## 3. Modelo de Datos del Campus: Desacoplamiento en 3 Capas

El campus de Icesi se almacena en tres representaciones ortogonales:

```text
CAMPUS DATA
    │
    ├── 1. CAPA DE GAMEPLAY (Circulation Graph + Colliders)
    │      - Nodos de intersección (posiciones X, Y en metros).
    │      - Aristas de corredores (ancho, velocidad máxima, dirección permitida).
    │      - Composite Collider 2D para bloqueos duros.
    │
    ├── 2. CAPA VISUAL (Tilemaps + Hero Assets)
    │      - Suelos (baldosas, asfalto, césped).
    │      - Edificios en ladrillo Icesi con Sorting Layers y Normal Maps.
    │      - Hero Props (El Samán, domo de Auditorios, mesas de cafetería).
    │
    └── 3. CAPA SEMÁNTICA (ScriptableObjects de Zona)
           - ID: "biblioteca_carvajal", "edificio_a", "saman".
           - dangerLevel: 0.0f a 1.0f.
           - ambientAudioTrack: "ambient_library_silence".
           - lightingProfile: "indoor_warm_desk".
           - isSafeZone: false.
```

---

## 4. Pipeline de Iluminación 2D y Presentación

Para lograr el acabado *High-End 2D* de referencias como *Nuclear Throne* y *Archvale*:
- **URP 2D Light (Freeform / Point / Spot):**
  - Exteriores de día: Luz direccional ambiental cálida de Pance con sombras suaves proyectadas hacia el sur.
  - Interiores / Noche: Conos de luz de los faros de carritos de seguridad, linternas y lámparas de pasillo.
- **Shadow Caster 2D:**
  - Los muros perimetrales de los edificios A, B, C y D proyectan sombras dinámicas que bloquean la luz de los vigilantes.
- **Post-Processing en URP 2D:**
  - Bloom sutil en luces fluorescentes y objetos de misión.
  - Color Grading ambiental según la zona (tonos verdes y frescos en El Samán; tonos cálidos ámbar en Cafetería).
- **VFX Procedurales:**
  - Sprite Trail Renderer para el turbo de café.
  - Hit-Stop Manager para congelar la simulación por 0.05 segundos al colisionar.
  - Camera Shake basado en Perlin Noise atenuado.

---

## 5. Optimización WebGL / WASM para Distribución de Campus

Para que el juego cargue en menos de 5 segundos desde un enlace de WhatsApp en el campus:
1. **Brotli / Gzip Compression** nativo con encabezados de descompresión configurados.
2. **Sprite Atlasing:** Todos los tilesets y sprites agrupados en atlas de $2048 \times 2048$ para reducir *draw calls* a $< 30$.
3. **Strip Engine Code:** Configuración `Medium` o `High` para eliminar subsistemas de Unity 3D no utilizados (física 3D, terrain 3D, VR).
4. **Memoria Heap Inicial:** Asignación fija controlada (ej. 256MB) para evitar cuelgues en navegadores móviles.
