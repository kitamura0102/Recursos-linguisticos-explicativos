/* audio.js */
const AudioFX = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }
  function tone(freq, type, dur, vol, delay = 0) {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime + delay);
    g.gain.setValueAtTime(vol, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
    o.start(c.currentTime + delay);
    o.stop(c.currentTime + delay + dur + 0.05);
  }
  return {
    correct() { tone(523,'sine',0.15,0.25,0); tone(659,'sine',0.15,0.25,0.1); tone(784,'sine',0.2,0.25,0.2); },
    wrong()   { tone(220,'sawtooth',0.1,0.18,0); tone(180,'sawtooth',0.15,0.18,0.1); },
    win()     { [523,659,784,1047].forEach((f,i) => tone(f,'sine',0.25,0.22,i*0.12)); }
  };
})();
