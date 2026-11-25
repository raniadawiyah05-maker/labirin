/* AUDIO: efek suara & musik dibuat langsung oleh browser (WebAudio) - tanpa file mp3.
   Narasi memakai Text-to-Speech browser (bahasa Indonesia jika tersedia). */
const Snd = (() => {
  let ctx = null, master = null, mus = null, musicTimer = null, step = 0, wantMusic = false;
  const st = { vol: 0.7, muted: false };
  function init() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.connect(ctx.destination);
        mus = ctx.createGain(); mus.gain.value = 0.16; mus.connect(master);
      } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    apply();
  }
  function apply() { if (master) master.gain.value = st.muted ? 0 : st.vol; if (st.muted && 'speechSynthesis' in window) speechSynthesis.cancel(); }
  function tone(f, t0, d, type, g, dest) {
    if (!ctx) return;
    const o = ctx.createOscillator(), e = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g, t0 + 0.02); e.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(e); e.connect(dest || master); o.start(t0); o.stop(t0 + d + 0.05);
  }
  function sweep(f1, f2, d, type, g) {
    if (!ctx) return; const t = ctx.currentTime, o = ctx.createOscillator(), e = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + d);
    e.gain.setValueAtTime(g, t); e.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(e); e.connect(master); o.start(t); o.stop(t + d + 0.05);
  }
  function seq(notes, type, g, gap, len) { if (!ctx) return; const t = ctx.currentTime; notes.forEach((f, i) => tone(f, t + i * (gap || 0.11), len || 0.24, type, g)); }
  const FX = {
    click: () => seq([660], 'sine', 0.14),
    step: () => tone(260 + Math.random() * 60, ctx.currentTime, 0.07, 'triangle', 0.07),
    correct: () => seq([523, 659, 784, 1047], 'triangle', 0.2, 0.1),
    wrong: () => seq([330, 277], 'sine', 0.12, 0.17, 0.3),
    door: () => { sweep(120, 220, 0.5, 'sawtooth', 0.05); setTimeout(() => ctx && seq([784, 988, 1175], 'triangle', 0.15, 0.1), 450); },
    rescue: () => seq([523, 659, 784, 659, 784, 1047, 1319], 'triangle', 0.2, 0.13),
    bubble: () => sweep(380, 900, 0.18, 'sine', 0.2),
    monster: () => seq([220, 294, 247, 330], 'triangle', 0.13, 0.1),
    star: () => seq([880, 1319], 'triangle', 0.17, 0.09),
    win: () => seq([523, 659, 784, 1047, 784, 1047, 1319, 1568], 'triangle', 0.2, 0.14, 0.34)
  };
  function sfx(n) { if (ctx && !st.muted && FX[n]) try { FX[n](); } catch (e) {} }
  // Musik latar lembut: melodi pentatonik ceria, volume kecil
  const MEL = [523, 587, 659, 784, 659, 587, 523, 0, 659, 784, 880, 784, 659, 587, 523, 0];
  const BAS = [131, 0, 196, 0, 220, 0, 196, 0];
  function tick() {
    if (!ctx || st.muted) return;
    const t = ctx.currentTime, m = MEL[step % MEL.length]; if (m) tone(m, t, 0.5, 'triangle', 0.5, mus);
    if (step % 2 === 0) { const b = BAS[(step / 2) % BAS.length]; if (b) tone(b, t, 0.8, 'sine', 0.6, mus); }
    step++;
  }
  function music(on) { wantMusic = on; clearInterval(musicTimer); if (on && ctx) musicTimer = setInterval(tick, 480); }
  return {
    init, sfx, music, get vol() { return st.vol; }, get muted() { return st.muted; },
    setVol(v) { st.vol = v; if (v > 0) st.muted = false; apply(); },
    setMuted(m) { st.muted = m; apply(); },
    duck(on) { if (mus) mus.gain.value = on ? 0.05 : 0.16; }
  };
})();

const Say = (() => {
  const ok = 'speechSynthesis' in window; let voice = null;
  const pick = () => { voice = speechSynthesis.getVoices().find(v => /^id/i.test(v.lang)) || null; };
  if (ok) { pick(); speechSynthesis.onvoiceschanged = pick; }
  return function say(text) {
    if (!ok || Snd.muted) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = 'id-ID'; if (voice) u.voice = voice;
      u.rate = 0.82; u.pitch = 1.2; u.volume = Snd.vol;
      u.onstart = () => Snd.duck(true); u.onend = u.onerror = () => Snd.duck(false);
      speechSynthesis.speak(u);
    } catch (e) {}
  };
})();
