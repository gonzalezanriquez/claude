---
name: threejs-experience
description: Diseña e implementa experiencias 3D y WebGL con foco en narrativa, usabilidad y performance.
---

# Three.js Experience

## Tecnologías
- Three.js
- React Three Fiber
- Drei
- WebGL
- GLSL
- Postprocessing

## Antes de implementar 3D
Responder:
1. ¿Qué aporta el 3D?
2. ¿Se puede lograr mejor con CSS/GSAP?
3. ¿Es esencial para la narrativa?
4. ¿Funciona en mobile?
5. ¿Cuál es el fallback?

## Performance
Priorizar:
- modelos optimizados
- Draco/Meshopt cuando corresponda
- texturas comprimidas
- lazy loading
- limitar DPR
- controlar sombras
- evitar geometría excesiva
- cleanup de recursos
- evitar memory leaks

## UX
Nunca bloquear:
- navegación
- lectura
- CTA
- accesibilidad

## Mobile
Crear versiones simplificadas si es necesario.

## Reduced motion
Proporcionar alternativa sin movimientos complejos.

## Regla
El 3D debe ser funcional, narrativo o identitario. Nunca decorativo por defecto.
