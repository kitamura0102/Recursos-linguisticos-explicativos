/* game.js */

const NO_CONNECTOR = 'No tiene conector';

const TOURISMS = [
  {
    name:     'Turismo cultural',
    emoji:    '🏛️',
    sentence: '"Este interés surge porque los individuos buscan enriquecer su conocimiento sobre la identidad de otros pueblos… Es decir, el viajero se convierte en un aprendiz de la historia viva."',
    causa:    null,
    reforma:  'es decir',
    distractores: {
      causa:  ['porque', 'a causa de'],
      reforma: ['en otras palabras', NO_CONNECTOR],
    },
  },
  {
    name:     'Turismo deportivo',
    emoji:    '⚽',
    sentence: '"Estos desplazamientos ocurren debido a que el deporte funciona como un unificador social… En otros términos, el evento deportivo es el motor de la economía local durante su duración."',
    causa:    'debido a que',
    reforma:  'en otros términos',
    distractores: {
      causa:  ['porque', 'ya que'],
      reforma: ['es decir', NO_CONNECTOR],
    },
  },
  {
    name:     'Ecoturismo',
    emoji:    '🌿',
    sentence: '"Su implementación es vital debido a que promueve la sostenibilidad y la educación ambiental… En otras palabras, prioriza la conservación sobre el consumo masivo."',
    causa:    'debido a que',
    reforma:  'en otras palabras',
    distractores: {
      causa:  ['a causa de', 'porque'],
      reforma: ['en otros términos', NO_CONNECTOR],
    },
  },
  {
    name:     'Turismo gastronómico',
    emoji:    '🍽️',
    sentence: '"Esta tendencia ha crecido ya que la comida es una de las expresiones más directas de la identidad de un país. Esto significa que el paladar es la vía para conocer la historia local."',
    causa:    'ya que',
    reforma:  'esto significa que',
    distractores: {
      causa:  ['porque', 'debido a que'],
      reforma: ['es decir', NO_CONNECTOR],
    },
  },
  {
    name:     'Turismo de aventura',
    emoji:    '🏔️',
    sentence: '"Esta modalidad se expande a causa de la demanda de experiencias que generen adrenalina… Se puede definir como una forma de turismo activo donde el visitante es el protagonista."',
    causa:    'a causa de',
    reforma:  null,
    distractores: {
      causa:  ['porque', 'ya que'],
      reforma: ['es decir', 'en otras palabras'],
    },
  },
  {
    name:     'Turismo festivo',
    emoji:    '🎭',
    sentence: '"Se desarrolla principalmente porque las personas buscan experimentar la alegría y el folclore auténtico… Es decir, la fiesta genera la unión simbólica y potente de la comunidad visitada."',
    causa:    null,
    reforma:  'es decir',
    distractores: {
      causa:  ['porque', 'debido a que'],
      reforma: ['en otros términos', NO_CONNECTOR],
    },
  },
  {
    name:     'Turismo genealógico o de raíces',
    emoji:    '🌳',
    sentence: '"Este tipo de viaje surge porque las personas sienten la necesidad de reconectar con sus orígenes… Es decir, es una búsqueda de pertenencia a través de la geografía."',
    causa:    null,
    reforma:  'es decir',
    distractores: {
      causa:  ['porque', 'a causa de'],
      reforma: ['en otras palabras', NO_CONNECTOR],
    },
  },
];