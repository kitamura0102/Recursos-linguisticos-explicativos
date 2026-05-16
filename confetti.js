/* confetti.js — lightweight canvas confetti */
(function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId    = null;

  const COLORS = ['#7c3aed','#4f46e5','#059669','#2563eb','#f59e0b','#ec4899','#10b981'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeParticle() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height * -0.2 - 20,
      w:     Math.random() * 10 + 6,
      h:     Math.random() * 6 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:   Math.random() * Math.PI * 2,
      vx:    (Math.random() - 0.5) * 3,
      vy:    Math.random() * 4 + 2,
      vr:    (Math.random() - 0.5) * 0.15,
      alpha: 1,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vr;
      if (p.y > canvas.height * 0.8) p.alpha -= 0.02;
    });
    particles = particles.filter(p => p.alpha > 0);
  }

  function loop() {
    draw();
    update();
    if (particles.length > 0) animId = requestAnimationFrame(loop);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); animId = null; }
  }

  window.launchConfetti = function (duration = 1800) {
    resize();
    const end = Date.now() + duration;
    function burst() {
      for (let i = 0; i < 18; i++) particles.push(makeParticle());
      if (Date.now() < end) setTimeout(burst, 220);
    }
    burst();
    if (!animId) loop();
  };
})();
