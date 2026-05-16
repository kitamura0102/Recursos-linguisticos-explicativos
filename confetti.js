/* confetti.js — fuegos artificiales + sparkles + texto ¡Correcto! */
(function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId    = null;

  const COLORS = ['#f59e0b','#ec4899','#7c3aed','#10b981','#3b82f6','#ef4444','#facc15','#a78bfa','#34d399'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeShell(x, y) {
    return {
      kind: 'shell',
      x, y,
      vy: -(Math.random() * 6 + 10),
      vx: (Math.random() - 0.5) * 2,
      alpha: 1,
      exploded: false,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function makeSparkFromPoint(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    return {
      kind:  'spark',
      x, y,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      alpha: 1,
      color,
      size:  Math.random() * 4 + 2,
      gravity: 0.18,
      trail: [],
    };
  }

  function makeSparkle(x, y) {
    return {
      kind:  'sparkle',
      x, y,
      vx:    (Math.random() - 0.5) * 5,
      vy:    -(Math.random() * 5 + 2),
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size:  Math.random() * 8 + 4,
      rot:   Math.random() * Math.PI,
      vr:    (Math.random() - 0.5) * 0.2,
      gravity: 0.12,
    };
  }

  function drawStar(cx, cy, spikes, outerR, innerR) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
  }

  function update() {
    const toAdd = [];
    particles.forEach(p => {
      if (p.kind === 'shell') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        if (p.vy >= 0 && !p.exploded) {
          p.exploded = true;
          p.alpha = 0;
          for (let i = 0; i < 55; i++) toAdd.push(makeSparkFromPoint(p.x, p.y, p.color));
          for (let i = 0; i < 10; i++) toAdd.push(makeSparkle(p.x, p.y));
        }
      } else if (p.kind === 'spark') {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= 0.018;
      } else if (p.kind === 'sparkle') {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += p.gravity;
        p.rot += p.vr;
        p.alpha -= 0.022;
      }
    });
    particles.push(...toAdd);
    particles = particles.filter(p => p.alpha > 0);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      if (p.kind === 'shell') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'spark') {
        if (p.trail.length > 1) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth   = p.size * 0.5;
          ctx.lineCap     = 'round';
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          p.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
          ctx.globalAlpha = Math.max(0, p.alpha * 0.4);
          ctx.stroke();
        }
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'sparkle') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        drawStar(0, 0, 5, p.size, p.size * 0.45);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function loop() {
    draw();
    update();
    if (particles.length > 0) animId = requestAnimationFrame(loop);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); animId = null; }
  }

  window.launchConfetti = function (duration = 2200) {
    resize();
    const end = Date.now() + duration;
    function burst() {
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        const x = canvas.width  * (0.2 + Math.random() * 0.6);
        const y = canvas.height * (0.5 + Math.random() * 0.3);
        particles.push(makeShell(x, y));
      }
      if (Date.now() < end) setTimeout(burst, 280);
    }
    burst();
    if (!animId) loop();
  };

  window.showCorrectText = function () {
    const old = document.getElementById('correct-popup');
    if (old) old.remove();
    const el = document.createElement('div');
    el.id = 'correct-popup';
    el.textContent = '🎉 ¡Correcto!';
    el.style.cssText = `
      position:fixed; top:38%; left:50%;
      transform:translateX(-50%) scale(0.4);
      font-size:clamp(2.5rem,6vw,4.5rem);
      font-weight:900; color:#ffffff;
      text-shadow:0 0 20px #f59e0b, 0 4px 16px rgba(0,0,0,0.4);
      z-index:10000; pointer-events:none;
      opacity:0; transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
      white-space:nowrap; letter-spacing:-1px;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateX(-50%) scale(1)';
    });
    setTimeout(() => {
      el.style.opacity   = '0';
      el.style.transform = 'translateX(-50%) scale(1.15)';
      setTimeout(() => el.remove(), 400);
    }, 1400);
  };

})();
