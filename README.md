# Recursos Lingüísticos Explicativos v2 🎓

Juego interactivo tipo **carrusel** — un tipo de turismo a la vez.

## Archivos
```
recursos-v2/
├── index.html    ← estructura
├── style.css     ← estilos (landscape, fuente grande)
├── game.js       ← lógica del juego
├── audio.js      ← sonidos Web Audio API
└── confetti.js   ← animación de confetti
```

## Cómo abrir
```bash
# Con Node (recomendado):
npx serve recursos-v2

# O abrir index.html directamente en el navegador
```

## Mecánica
- 7 tipos de turismo en carrusel
- Cada slide: 4 tarjetas (2 correctas + 2 distractores aleatorios)
- Tarjeta especial **"No tiene conector"** cuando no hay conector en el texto
- Al completar ambas respuestas correctamente → confetti + botón Siguiente
- Error → pista con la respuesta correcta durante 3 segundos
- Al terminar los 7 → pantalla final de felicitación
