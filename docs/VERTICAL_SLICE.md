# Plan y Criterios del Vertical Slice: ICESI RUN

## 1. Alcance Espacial y Geográfico
Para evitar el error común de construir 140.000 m² de campus con arte incompleto, el **Vertical Slice** abarca exclusivamente el eje norte-centro de Icesi:

```text
PORTERÍA 1 (Spawn)
       │
   Bulevar Norte
       │
  EDIFICIO A (Aulas y pasillo de ladrillo)
       │
  PLAZA DEL SAMÁN (Árbol central, iguanas y sombras)
       │
  BIBLIOTECA CARVAJAL (Núcleo de reserva y escape)
       │
  PUERTA DE ESCAPE TEMPORAL (Victoria del Slice)
```

---

## 2. Benchmark de Calidad (La Prueba de los 30 Segundos)
> **"Cualquiera que vea un video de 30 segundos de esta sección debe decir: 'Esto es un videojuego terminado', no 'Esto es una tarea o proyecto de clase'."**

### Checklists de Entrega por Área

### A. Jugabilidad y Controles (*Game Feel*)
- [ ] Movimiento continuo asistido en corredores con ventana de *Corner Buffering* dinámica.
- [ ] Giro instantáneo en esquinas sin choque contra las paredes de ladrillo.
- [ ] 1 Ítem de Misión principal: *Libro de Reserva* en la Biblioteca.
- [ ] 1 Power-Up interactivo: *Café de Shillers* con aumento de velocidad y estela de partículas.
- [ ] Sistema de créditos de pasillo con sonido armónico de recogida.
- [ ] Condiciones completas de fin de partida: Victoria al cruzar la salida y Muerte al agotar vidas.

### B. Inteligencia Artificial (El Vigilante y el Monitor)
- [ ] Toma de decisiones en nodos de cruce (sin Dijkstra por fotograma).
- [ ] Transición fluida entre estados: `PATROL` → `DETECT` (`!`) → `CHASE` → `LOSE` (`?`) → `RETURN`.
- [ ] Faro de patrulla con cono de luz y detección de línea de visión.

### C. Arte y Arquitectura 2.5D
- [ ] **Protagonista Terminado:** Sprites artesanales en Aseprite para Idle, Run, Corner-Turn, Damage y Victory.
- [ ] **Edificio A:** Textura de ladrillo con relieve de normal maps, ventanas reflejantes y rótulo de fachada.
- [ ] **El Gran Samán:** Hero asset ilustrado con múltiples capas de follaje y sombras arrojadas.
- [ ] **Biblioteca Carvajal:** Fachada y sala central con iluminación cálida de estudio.
- [ ] **Props Ambientales:** Lámparas de campus, bancas universitarias, canecas de reciclaje y vegetación de Pance.

### D. Presentación, Iluminación y *Juice*
- [ ] Iluminación URP 2D con sol a 45° y sombras dinámicas arrojadas mediante `Shadow Caster 2D`.
- [ ] Faros de luz dinámica en el carrito de seguridad.
- [ ] Micro-pausa (*Hit-Stop*) de 50ms al recibir un golpe.
- [ ] *Camera Shake* amortiguado con Perlin Noise en impactos.
- [ ] Partículas de hojas en el Samán y polvo en los giros cerrados.
- [ ] Post-procesamiento URP: Bloom sutil y Color Grading cálido.

### E. Flujo de Usuario (UX / UI)
- [ ] `Pantalla de Inicio` con logo, menú e instrucciones claras.
- [ ] `HUD Minimalista` con Score, Vidas y Misión sin saturación.
- [ ] `Pantalla de Resultados` con opción de reinicio inmediato en un clic (*"Otra partida más"*).
