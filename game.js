/* game.js */
 
/* ============================================================
   DATA
============================================================ */
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
 
/* ============================================================
   STATE
============================================================ */
let current   = 0;
let dzState   = { causa: null, reforma: null };
let bothDone  = false;
 
/* ============================================================
   HELPERS
============================================================ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
 
function cardId(word) {
  return 'card-' + word.replace(/[\s]+/g, '_');
}
 
/* Build bank cards for this slide:
   - 2 correct answers (causa + reforma, using NO_CONNECTOR if null)
   - 2 causa distractors
   - 2 reforma distractors
   "No tiene conector" always appears as ONE shared card regardless of how many times it shows up */
function buildBankCards(t) {
  const raw = [];
 
  /* correct causa */
  raw.push(t.causa
    ? { word: t.causa,      type: 'causa' }
    : { word: NO_CONNECTOR, type: 'no'    });
 
  /* correct reforma */
  raw.push(t.reforma
    ? { word: t.reforma,    type: 'reforma' }
    : { word: NO_CONNECTOR, type: 'no'      });
 
  /* causa distractors */
  t.distractores.causa.forEach(w =>
    raw.push({ word: w, type: w === NO_CONNECTOR ? 'no' : 'causa' })
  );
 
  /* reforma distractors */
  t.distractores.reforma.forEach(w =>
    raw.push({ word: w, type: w === NO_CONNECTOR ? 'no' : 'reforma' })
  );
 
  /* dedupe: only one card per unique word */
  const seen  = new Set();
  const unique = raw.filter(c => {
    if (seen.has(c.word)) return false;
    seen.add(c.word);
    return true;
  });
 
  return shuffle(unique);
}
 
/* ============================================================
   PROGRESS BAR
============================================================ */
function updateProgress() {
  const pct = (current / TOURISMS.length) * 100;
  document.getElementById('progress-bar-fill').style.width = pct + '%';
  document.getElementById('prog-current').textContent = current + 1;
  document.getElementById('prog-total').textContent   = TOURISMS.length;
}
 
/* ============================================================
   RENDER SLIDE
============================================================ */
function renderSlide() {
  const t = TOURISMS[current];
  dzState = { causa: null, reforma: null };
  bothDone = false;
 
  /* tourism card */
  document.getElementById('tourism-emoji').textContent    = t.emoji;
  document.getElementById('tourism-name').textContent     = t.name;
  document.getElementById('tourism-sentence').textContent = t.sentence;
 
  /* reset drop zones */
  ['causa', 'reforma'].forEach(col => {
    const dz = document.getElementById('dz-' + col);
    dz.className   = 'drop-zone';
    dz.dataset.col = col;
    dz.innerHTML   = '<span class="drop-placeholder">Arrastra aquí</span>';
    setupDropZone(dz, col);
  });
 
  /* bank */
  const bank  = document.getElementById('bank-cards');
  bank.innerHTML = '';
  const cards = buildBankCards(t);
  cards.forEach(c => bank.appendChild(createCard(c)));
 
  /* hide feedback & next btn */
  const fb = document.getElementById('feedback');
  fb.style.display = 'none';
  fb.className     = 'feedback';
 
  document.getElementById('next-btn').style.display = 'none';
 
  updateProgress();
}
 
/* ============================================================
   CREATE CARD
============================================================ */
function createCard(c) {
  const el = document.createElement('div');
  el.className    = `word-card type-${c.type}`;
  el.id           = cardId(c.word + (c.forCol || ''));
  el.draggable    = true;
  el.dataset.word = c.word;
  el.dataset.type = c.type;
  if (c.forCol) el.dataset.forCol = c.forCol;
 
  const icon = c.type === 'causa' ? '🔗' : c.type === 'reforma' ? '🔄' : '✖️';
  el.innerHTML = `<span>${icon}</span> ${c.word}`;
 
  /* mouse drag */
  el.addEventListener('dragstart', e => {
    el.classList.add('dragging');
    e.dataTransfer.setData('application/json', JSON.stringify({
      word: c.word, type: c.type, forCol: c.forCol || null, cardId: el.id
    }));
    e.dataTransfer.effectAllowed = 'move';
  });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));
 
  /* touch drag */
  setupTouchDrag(el, c);
 
  return el;
}
 
/* ============================================================
   TOUCH DRAG
============================================================ */
function setupTouchDrag(el, c) {
  let clone = null, ox = 0, oy = 0;
 
  el.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect  = el.getBoundingClientRect();
    ox = touch.clientX - rect.left;
    oy = touch.clientY - rect.top;
    clone = el.cloneNode(true);
    clone.style.cssText = `position:fixed;z-index:9998;pointer-events:none;opacity:0.9;
      width:${rect.width}px;left:${touch.clientX - ox}px;top:${touch.clientY - oy}px;`;
    document.body.appendChild(clone);
    el.classList.add('dragging');
  }, { passive: false });
 
  el.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    if (clone) {
      clone.style.left = `${touch.clientX - ox}px`;
      clone.style.top  = `${touch.clientY - oy}px`;
    }
  }, { passive: false });
 
  el.addEventListener('touchend', e => {
    el.classList.remove('dragging');
    if (clone) { clone.remove(); clone = null; }
    const touch  = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const zone   = target && target.closest('.drop-zone');
    if (zone) handleDrop(zone, { word: c.word, type: c.type, forCol: c.forCol || null, cardId: el.id });
  });
}
 
/* ============================================================
   DROP ZONE SETUP
============================================================ */
function setupDropZone(zone, col) {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    if (dzState[col] !== null) return;
    const cls = col === 'causa' ? 'over-causa' : 'over-reforma';
    zone.classList.add(cls);
  });
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('over-causa', 'over-reforma', 'over-no');
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('over-causa', 'over-reforma', 'over-no');
    if (dzState[col] !== null) return;
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      handleDrop(zone, data);
    } catch(_) {}
  });
}
 
/* ============================================================
   HANDLE DROP
============================================================ */
function handleDrop(zone, data) {
  const col = zone.dataset.col;
  if (dzState[col] !== null) return;
 
  const t        = TOURISMS[current];
  const correct  = t[col]; // null means "No tiene conector"
  const expected = correct === null ? NO_CONNECTOR : correct;
  const isCorrect = data.word === expected;
  /* also remove forCol restriction — shared NO_CONNECTOR card is valid for any null column */
 
  if (isCorrect) {
    dzState[col] = data.word;
 
    /* style zone */
    const stateClass =
      col === 'causa'  && data.word === NO_CONNECTOR ? 'state-correct-no'     :
      col === 'reforma' && data.word === NO_CONNECTOR ? 'state-correct-no'    :
      col === 'causa'  ? 'state-correct' : 'state-correct-reforma';
 
    zone.className = 'drop-zone ' + stateClass;
 
    /* tag */
    const tagClass =
      data.word === NO_CONNECTOR ? 'tag-no'    :
      col === 'causa'            ? 'tag-causa' : 'tag-reforma';
 
    const icon = data.word === NO_CONNECTOR ? '✖️' : col === 'causa' ? '✓' : '✓';
    zone.innerHTML = `<div class="placed-tag ${tagClass}"><span class="tag-icon">${icon}</span>${data.word}</div>`;
 
    /* remove card from bank */
    const cardEl = document.getElementById(data.cardId);
    if (cardEl) cardEl.remove();
 
    AudioFX.correct();
    checkBothDone();
 
  } else {
    /* wrong */
    zone.classList.add('state-wrong');
    setTimeout(() => zone.classList.remove('state-wrong'), 500);
    AudioFX.wrong();
    showFeedback(col);
  }
}
 
/* ============================================================
   FEEDBACK
============================================================ */
function showFeedback(col) {
  const fb = document.getElementById('feedback');
  const colName = col === 'causa' ? 'causa' : 'reformulación';
  fb.textContent   = `✗  Incorrecto. Revisa el conector de ${colName} e intenta de nuevo.`;
  fb.className     = 'fb-wrong';
  fb.style.display = 'block';
  setTimeout(() => { fb.style.display = 'none'; }, 2500);
}
 
/* ============================================================
   CHECK BOTH DONE
============================================================ */
function checkBothDone() {
  if (dzState.causa === null || dzState.reforma === null) return;
  bothDone = true;
 
  const fb = document.getElementById('feedback');
  fb.textContent   = '🎉 ¡Muy bien! Completaste este tipo de turismo.';
  fb.className     = 'fb-correct';
  fb.style.display = 'block';
 
  AudioFX.win();
  launchConfetti();
 
  if (current < TOURISMS.length - 1) {
    document.getElementById('next-btn').style.display = 'block';
  } else {
    setTimeout(showFinal, 1800);
  }
}
 
/* ============================================================
   NEXT SLIDE
============================================================ */
function nextSlide() {
  if (!bothDone) return;
  current++;
  renderSlide();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.nextSlide = nextSlide;
 
/* ============================================================
   FINAL SCREEN
============================================================ */
function showFinal() {
  document.getElementById('carousel').style.display    = 'none';
  document.getElementById('final-screen').style.display = 'block';
  AudioFX.win();
  launchConfetti(5000);
}
 
function restartGame() {
  current = 0;
  document.getElementById('carousel').style.display    = 'block';
  document.getElementById('final-screen').style.display = 'none';
  renderSlide();
}
window.restartGame = restartGame;
 
/* ============================================================
   BOOT
============================================================ */
document.addEventListener('DOMContentLoaded', () => renderSlide());
 
