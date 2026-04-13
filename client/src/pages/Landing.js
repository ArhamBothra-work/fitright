import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, animate } from 'framer-motion';
import Navbar from '../components/Navbar';

/* ── tiny hook: element in view with margin control ── */
function useReveal(ref, amount = 0.25) {
  return useInView(ref, { once: false, amount });
}

/* ── Misinformation counter ── */
function MisCounter() {
  const ref = useRef(null);
  const inView = useReveal(ref, 0.5);
  const [val, setVal] = useState(100);
  const [done, setDone] = useState(false);
  const [shaking, setShaking] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (inView) {
      setDone(false);
      setShaking(true);
      let start = null;
      const dur = 1800;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(100 - eased * 100));
        if (p < 1) { rafRef.current = requestAnimationFrame(step); }
        else { setVal(0); setDone(true); setShaking(false); }
      };
      rafRef.current = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(rafRef.current);
      setVal(100); setDone(false); setShaking(false);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.div
        animate={shaking ? {
          x: [0, -4, 4, -3, 3, -2, 2, 0],
          y: [0, 2, -2, 1, -1, 0],
        } : { x: 0, y: 0 }}
        transition={{ duration: 1.8, ease: 'linear' }}
      >
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(72px,10vw,120px)',
          lineHeight: 1,
          color: val === 0 ? 'rgba(237,232,225,0.12)' : `rgb(${Math.round(200 + val * 0.3)},${Math.round(56 - val * 0.2)},${Math.round(42 - val * 0.1)})`,
          transition: 'color 0.1s',
          letterSpacing: '-0.02em',
        }}>
          {val}<span style={{ fontSize: '0.4em' }}>%</span>
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(237,232,225,0.25)',
          marginTop: '0.4rem',
        }}>misinformation</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute', top: 0, left: 0,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(20px,3vw,32px)',
          color: 'rgba(237,232,225,0.6)',
          paddingTop: '1rem',
          pointerEvents: 'none',
        }}
      >
        Only science<br />remains.
      </motion.div>
    </div>
  );
}

/* ── Clip-wipe text reveal ── */
function WipeText({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useReveal(ref, 0.3);
  return (
    <div ref={ref} style={{ overflow: 'hidden', ...style }}>
      <motion.div
        initial={{ y: '105%' }}
        animate={inView ? { y: 0 } : { y: '105%' }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Slide reveal (left or right) ── */
function SlideIn({ children, from = 'left', delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useReveal(ref, 0.2);
  const x = from === 'left' ? -60 : 60;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Scale-in ── */
function ScaleIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useReveal(ref, 0.2);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated progress bar ── */
function ProgressBar({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const inView = useReveal(ref, 0.4);
  return (
    <div ref={ref} style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.3)' }}>{label}</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(237,232,225,0.3)' }}>{value}%</span>
      </div>
      <div style={{ height: 2, background: 'rgba(237,232,225,0.07)', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', background: '#e84030', position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
}

/* ── Main Landing ── */
export default function Landing() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const intentRef = useRef(null);
  const { scrollY } = useScroll();

  /* parallax for hero title */
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  /* parallax for TRAIN WITH INTENT */
  const intentY = useTransform(scrollY, [800, 2000], [60, -60]);
  const intentScale = useTransform(scrollY, [800, 1400], [0.92, 1.04]);

  /* canvas particles + lightning */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, frame = 0, rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let mx = rx, my = ry;
    const particles = [];

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      if (Math.random() > 0.55) particles.push({ x: mx, y: my, vx: (Math.random() - .5) * 1.8, vy: (Math.random() - .5) * 1.8 - .8, life: 1, size: Math.random() * 2 + 1 });
    };

    const drawLightning = (x1, y1, x2, y2, depth = 5) => {
      if (depth <= 0) return;
      const mx2 = (x1 + x2) / 2 + (Math.random() - .5) * 70;
      const my2 = (y1 + y2) / 2 + (Math.random() - .5) * 35;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(mx2, my2); ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(232,64,48,${depth * 0.07})`; ctx.lineWidth = depth * 0.45; ctx.stroke();
      if (Math.random() > .6) drawLightning(mx2, my2, mx2 + (Math.random() - .5) * 55, my2 + 50, depth - 1);
      drawLightning(x1, y1, mx2, my2, depth - 1);
      drawLightning(mx2, my2, x2, y2, depth - 1);
    };

    const onClick = e => {
      for (let i = 0; i < 14; i++) {
        const a = (Math.PI * 2 / 14) * i;
        particles.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, life: 1, size: 2.5 });
      }
      drawLightning(e.clientX, 0, e.clientX + (Math.random() - .5) * 250, e.clientY * .7);
    };

    let rafId;
    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);
      rx += (mx - rx) * 0.08; ry += (my - ry) * 0.08;
      ctx.beginPath(); ctx.arc(rx, ry, Math.min(W, H) * .48, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,56,42,0.02)'; ctx.fill();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += .055; p.life -= .033;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,64,48,${p.life * .65})`; ctx.fill();
      }
      if (frame % 210 === 0 && Math.random() > .45) {
        const x = Math.random() * W;
        drawLightning(x, 0, x + (Math.random() - .5) * 230, H * .55);
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);
    loop();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const marqueeItems = ['Education Hub', '⚡ No Myths', 'Workout Plans', '⚡ Progress Tracking', 'Nutrition Log', '⚡ Built Different', 'Fat Loss', '⚡ Muscle Gain', 'Recovery', '⚡ Real Science', 'Progressive Overload', '⚡ Myth Busting'];

  const s = { // shared inline style helpers
    mono: { fontFamily: "'Space Mono',monospace" },
    bebas: { fontFamily: "'Bebas Neue',sans-serif" },
    acc: { color: '#e84030' },
    dim: { color: 'rgba(237,232,225,0.12)', WebkitTextStroke: '1px rgba(237,232,225,0.15)' },
    border: { borderColor: 'rgba(237,232,225,0.07)' },
  };

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden', background: '#070707' }}>
      {/* google fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap" />

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        {/* ── HERO ── */}
        <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 3rem 5rem', position: 'relative', overflow: 'hidden' }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}
            >
              <div style={{ width: 28, height: 0.5, background: '#e84030' }} />
              <span style={{ ...s.mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.25)' }}>
                fitness education & tracking — est. 2026
              </span>
            </motion.div>

            <div style={{ overflow: 'hidden', marginBottom: '0.1rem' }}>
              <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ ...s.bebas, fontSize: 'clamp(80px,14vw,180px)', lineHeight: 0.88, textTransform: 'uppercase', WebkitTextStroke: '1.5px rgba(237,232,225,0.16)', color: 'transparent' }}>Know</motion.div>
            </div>
            <div style={{ overflow: 'hidden', marginBottom: '0.1rem' }}>
              <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.18, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ ...s.bebas, fontSize: 'clamp(80px,14vw,180px)', lineHeight: 0.88, textTransform: 'uppercase', WebkitTextStroke: '1.5px rgba(237,232,225,0.11)', color: 'transparent' }}>Your</motion.div>
            </div>
            <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
              <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ ...s.bebas, fontSize: 'clamp(80px,14vw,180px)', lineHeight: 0.88, textTransform: 'uppercase', color: '#e84030' }}>Craft.</motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}
            >
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(237,232,225,0.38)', maxWidth: 280, lineHeight: 1.85, fontWeight: 300 }}>
                No myths. No confusion. Science-backed knowledge, structured plans, and tools to prove your work.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ ...s.mono, background: '#e84030', color: '#ede8e1', border: 'none', padding: '1rem 2.5rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Start now
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ borderColor: 'rgba(237,232,225,0.25)', color: '#ede8e1' }}
                  style={{ ...s.mono, background: 'transparent', color: 'rgba(237,232,225,0.35)', border: '0.5px solid rgba(237,232,225,0.08)', padding: '1rem 2rem', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                  Explore
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── MARQUEE 1 ── */}
        <div style={{ borderTop: '0.5px solid rgba(237,232,225,0.07)', borderBottom: '0.5px solid rgba(237,232,225,0.07)', overflow: 'hidden', padding: '0.6rem 0' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 28s linear infinite' }}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} style={{ ...s.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: item.includes('⚡') ? 'rgba(200,56,42,0.7)' : 'rgba(237,232,225,0.15)', padding: '0 2.5rem', borderRight: '0.5px solid rgba(237,232,225,0.07)', whiteSpace: 'nowrap' }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ── TRAIN WITH INTENT — cinematic ── */}
        <section style={{ padding: '10rem 3rem', borderTop: '0.5px solid rgba(237,232,225,0.07)', overflow: 'hidden', position: 'relative' }}>
          <motion.div style={{ y: intentY, scale: intentScale }}>
            <ScaleIn>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...s.mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 0.5, background: '#e84030' }} />
                  the only rule
                  <div style={{ width: 20, height: 0.5, background: '#e84030' }} />
                </div>
                <div style={{ ...s.bebas, fontSize: 'clamp(64px,13vw,160px)', lineHeight: 0.88, textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                  <div style={{ WebkitTextStroke: '1.5px rgba(237,232,225,0.1)', color: 'transparent' }}>Train</div>
                  <div style={{ WebkitTextStroke: '1.5px rgba(237,232,225,0.07)', color: 'transparent' }}>with</div>
                  <div style={{ color: '#e84030' }}>intent.</div>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(237,232,225,0.3)', maxWidth: 380, margin: '2.5rem auto 0', lineHeight: 1.85, fontWeight: 300 }}>
                  Every rep. Every meal. Every number tracked. When you train with intent, the results are inevitable.
                </p>
              </div>
            </ScaleIn>
          </motion.div>
        </section>

        {/* ── CINEMATIC STATS (misinformation counter) ── */}
        <section style={{ padding: '8rem 3rem', borderTop: '0.5px solid rgba(237,232,225,0.07)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <SlideIn from="left">
              <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e84030', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 0.5, background: '#e84030' }} />
                the problem
              </div>
              <div style={{ ...s.bebas, fontSize: 'clamp(48px,6vw,80px)', lineHeight: 0.9, textTransform: 'uppercase', marginBottom: '2rem' }}>
                <div style={{ WebkitTextStroke: '1px rgba(237,232,225,0.15)', color: 'transparent' }}>The internet</div>
                <div style={{ WebkitTextStroke: '1px rgba(237,232,225,0.1)', color: 'transparent' }}>is full of</div>
                <div style={{ color: '#e84030' }}>lies.</div>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(237,232,225,0.35)', lineHeight: 1.85, maxWidth: 380, fontWeight: 300 }}>
                Fitness influencers, broscience, and bad advice have confused an entire generation. FitRight exists to fix that — with actual science, structured like a curriculum.
              </p>
            </SlideIn>

            <SlideIn from="right">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(237,232,225,0.07)' }}>
                <div style={{ background: '#0e0e0e', padding: '2.5rem 2rem' }}>
                  <MisCounter />
                </div>
                <div style={{ background: '#0e0e0e', padding: '2.5rem 2rem' }}>
                  <div style={{ ...s.bebas, fontSize: 'clamp(48px,6vw,72px)', lineHeight: 1, color: '#e84030' }}>3<span style={{ fontSize: '0.4em' }}>→1</span></div>
                  <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.2)', marginTop: '0.5rem' }}>apps replaced</div>
                </div>
                <div style={{ background: '#0e0e0e', padding: '2.5rem 2rem' }}>
                  <div style={{ ...s.bebas, fontSize: 'clamp(48px,6vw,72px)', lineHeight: 1, color: '#e84030' }}>∞</div>
                  <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.2)', marginTop: '0.5rem' }}>excuses eliminated</div>
                </div>
                <div style={{ background: '#0e0e0e', padding: '2.5rem 2rem' }}>
                  <div style={{ ...s.bebas, fontSize: 'clamp(48px,6vw,72px)', lineHeight: 1, color: '#e84030' }}>1<span style={{ fontSize: '0.4em' }}>st</span></div>
                  <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.2)', marginTop: '0.5rem' }}>learn. then train.</div>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ padding: '8rem 3rem', borderTop: '0.5px solid rgba(237,232,225,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <SlideIn from="left">
              <div style={{ ...s.bebas, fontSize: 'clamp(48px,6vw,80px)', lineHeight: 0.9, textTransform: 'uppercase' }}>
                What's<br />inside.
              </div>
            </SlideIn>
            <SlideIn from="right">
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(237,232,225,0.35)', maxWidth: 260, lineHeight: 1.7, fontWeight: 300 }}>
                Everything you need to learn, plan, and track — in one place.
              </p>
            </SlideIn>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(237,232,225,0.07)' }}>
            {[
              { n: '01', title: 'Education Hub', body: 'A full curriculum. Nutrition, training, recovery, myth busting — structured like a proper course, not a blog.' },
              { n: '02', title: 'Workout Plans', body: 'Goal-based splits with an interactive body diagram that lights up exactly what every exercise hits.' },
              { n: '03', title: 'Progress Tracker', body: 'Log bodyweight, nutrition, strength. Watch charts prove your consistency is working. Data doesn\'t lie.' },
            ].map((f, i) => (
              <ScaleIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ background: '#141414', y: -4, boxShadow: '0 20px 60px rgba(232,64,48,0.08)' }}
                  style={{ background: '#0e0e0e', padding: '2.5rem 2rem', position: 'relative', transition: 'background 0.25s', cursor: 'none', height: '100%' }}
                >
                  <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.18em', color: '#e84030', marginBottom: '1.5rem' }}>{f.n} ⚡</div>
                  <div style={{ ...s.bebas, fontSize: 28, textTransform: 'uppercase', marginBottom: '0.75rem', lineHeight: 1 }}>{f.title}</div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(237,232,225,0.35)', lineHeight: 1.7, fontWeight: 300 }}>{f.body}</p>
                  <motion.div
                    whileHover={{ opacity: 1, x: 3, y: -3 }}
                    style={{ position: 'absolute', top: '2rem', right: '2rem', fontSize: 16, color: '#e84030', opacity: 0.25, transition: 'opacity 0.2s' }}
                  >↗</motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    style={{ position: 'absolute', bottom: 0, left: 0, height: 1, background: '#e84030' }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </ScaleIn>
            ))}
          </div>
        </section>

        {/* ── MARQUEE 2 reverse ── */}
        <div style={{ borderTop: '0.5px solid rgba(237,232,225,0.07)', borderBottom: '0.5px solid rgba(237,232,225,0.07)', overflow: 'hidden', padding: '0.6rem 0' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeR 24s linear infinite' }}>
            {['Calories 101', '⚡ Protein Guide', 'Workout Splits', '⚡ Compound Lifts', 'Recovery & Sleep', '⚡ Supplement Truth', 'Body Recomp', '⚡ Deload Weeks',
              'Calories 101', '⚡ Protein Guide', 'Workout Splits', '⚡ Compound Lifts', 'Recovery & Sleep', '⚡ Supplement Truth', 'Body Recomp', '⚡ Deload Weeks'].map((item, i) => (
              <span key={i} style={{ ...s.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: item.includes('⚡') ? 'rgba(200,56,42,0.7)' : 'rgba(237,232,225,0.15)', padding: '0 2.5rem', borderRight: '0.5px solid rgba(237,232,225,0.07)', whiteSpace: 'nowrap' }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ── STORY STEPS ── */}
        <section style={{ padding: '8rem 3rem', borderTop: '0.5px solid rgba(237,232,225,0.07)' }}>
          <ScaleIn style={{ marginBottom: '5rem', textAlign: 'center' }}>
            <div style={{ ...s.bebas, fontSize: 'clamp(40px,5.5vw,72px)', lineHeight: 0.92, textTransform: 'uppercase' }}>
              <span style={{ WebkitTextStroke: '1px rgba(237,232,225,0.13)', color: 'transparent' }}>The </span>
              <span style={{ color: '#e84030' }}>right way</span>
              <br />
              <span style={{ WebkitTextStroke: '1px rgba(237,232,225,0.13)', color: 'transparent' }}>to do </span>
              fitness.
            </div>
          </ScaleIn>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(237,232,225,0.07)' }}>
            {[
              { n: '01', title: 'Learn first', body: 'Start with the fundamentals. Understand calories, protein, and how your body actually builds muscle. Most people skip this step. That\'s why they fail.', tag: 'Education Hub →', from: 'left' },
              { n: '02', title: 'Pick your plan', body: 'Choose a program built for your goal. Fat loss, muscle gain, maintenance — see exactly what muscles every exercise targets with our interactive body diagram.', tag: 'Workout Plans →', from: 'right' },
              { n: '03', title: 'Log everything', body: 'Track bodyweight, strength, and nutrition daily. The data compounds. Over weeks and months you\'ll see exactly how far you\'ve come.', tag: 'Progress Tracker →', from: 'left' },
              { n: '04', title: 'Prove your work', body: 'Watch the charts. See the numbers move. Strength up. Weight down. The plan works when you work the plan — and you\'ll have the data to prove it.', tag: 'Dashboard →', from: 'right' },
            ].map((step, i) => (
              <SlideIn key={i} from={step.from} delay={0}>
                <div style={{ background: '#070707', display: 'grid', gridTemplateColumns: '80px 1fr 1fr', alignItems: 'stretch' }}>
                  <div style={{ ...s.bebas, fontSize: 60, color: '#e84030', opacity: 0.15, padding: '2rem 1.5rem', display: 'flex', alignItems: 'flex-start', borderRight: '0.5px solid rgba(237,232,225,0.07)', lineHeight: 1 }}>{step.n}</div>
                  <div style={{ padding: '2.5rem 3rem', borderRight: '0.5px solid rgba(237,232,225,0.07)' }}>
                    <div style={{ ...s.bebas, fontSize: 30, textTransform: 'uppercase', marginBottom: '0.75rem' }}>{step.title}</div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(237,232,225,0.35)', lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>{step.body}</p>
                  </div>
                  <div style={{ padding: '2.5rem 3rem', display: 'flex', alignItems: 'center' }}>
                    <motion.span
                      whileHover={{ color: '#e84030', borderColor: '#e84030' }}
                      style={{ ...s.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', border: '0.5px solid rgba(237,232,225,0.12)', padding: '0.4rem 1rem', color: 'rgba(237,232,225,0.35)', transition: 'all 0.2s', cursor: 'none' }}
                    >{step.tag}</motion.span>
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </section>

        {/* ── PREVIEW ── */}
        <section style={{ padding: '8rem 3rem', borderTop: '0.5px solid rgba(237,232,225,0.07)' }}>
          <ScaleIn style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ ...s.bebas, fontSize: 'clamp(48px,6vw,80px)', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '1rem' }}>See it<br />in action.</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(237,232,225,0.35)', fontWeight: 300 }}>A glimpse of what's inside — clean, intentional, built to help you focus.</p>
          </ScaleIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(237,232,225,0.07)' }}>
            {[
              {
                label: '⚡ Daily Nutrition', title: 'Today\'s macros',
                body: 'Simple daily logging. Protein, calories — at a glance. 30 seconds, done.',
                bars: [{ label: 'Protein', value: 87 }, { label: 'Calories', value: 72 }],
              },
              {
                label: '⚡ Strength Log', title: 'Bench press',
                body: 'Progressive overload tracked. Week by week the numbers go up. The chart proves it.',
                chart: [40, 55, 60, 70, 78, 88],
              },
              {
                label: '⚡ Guide Library', title: 'Learn the truth',
                body: '16 guides across nutrition, training, recovery, and myth-busting.',
                pills: ['Calories 101', 'Protein guide', 'PPL explained', '+ 13 more →'],
              },
            ].map((card, i) => (
              <ScaleIn key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ background: '#141414', y: -4 }}
                  style={{ background: '#0e0e0e', padding: '2rem', cursor: 'none', height: '100%' }}
                >
                  <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#e84030', marginBottom: '1rem' }}>{card.label}</div>
                  <div style={{ ...s.bebas, fontSize: 22, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{card.title}</div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'rgba(237,232,225,0.35)', lineHeight: 1.65, fontWeight: 300, marginBottom: '1.5rem' }}>{card.body}</p>
                  {card.bars && card.bars.map((b, bi) => (
                    <ProgressBar key={bi} label={b.label} value={b.value} delay={bi * 0.15} />
                  ))}
                  {card.chart && (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60, marginTop: '0.5rem' }}>
                      {card.chart.map((h, ci) => (
                        <div key={ci} style={{ flex: 1, background: 'rgba(237,232,225,0.06)', height: `${h}%`, borderTop: `1px solid ${ci === card.chart.length - 1 ? '#e84030' : 'rgba(200,56,42,0.5)'}` }} />
                      ))}
                    </div>
                  )}
                  {card.pills && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: '1rem' }}>
                      {card.pills.map((p, pi) => (
                        <div key={pi} style={{ border: `0.5px solid ${pi === card.pills.length - 1 ? '#e84030' : 'rgba(237,232,225,0.07)'}`, padding: '0.5rem 0.75rem', fontSize: 10, color: pi === card.pills.length - 1 ? '#e84030' : 'rgba(237,232,225,0.35)' }}>{p}</div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </ScaleIn>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 3rem', borderTop: '0.5px solid rgba(237,232,225,0.07)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {[300, 500, 700].map((size, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 4, delay: i * 1.3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: size, height: size, left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2, border: '0.5px solid rgba(200,56,42,0.2)', borderRadius: '50%', pointerEvents: 'none' }}
            />
          ))}
          <ScaleIn>
            <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#e84030', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <div style={{ width: 20, height: 0.5, background: '#e84030' }} />
              ready when you are
            </div>
            <div style={{ ...s.bebas, fontSize: 'clamp(64px,10vw,140px)', lineHeight: 0.88, textTransform: 'uppercase', marginBottom: '2.5rem' }}>
              <div style={{ WebkitTextStroke: '1.5px rgba(237,232,225,0.13)', color: 'transparent' }}>Start</div>
              <div style={{ WebkitTextStroke: '1.5px rgba(237,232,225,0.1)', color: 'transparent' }}>training</div>
              <div style={{ color: '#e84030' }}>right.</div>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'rgba(237,232,225,0.35)', maxWidth: 380, margin: '0 auto 3rem', lineHeight: 1.8, fontWeight: 300 }}>
              No excuses. No myths. No wasted months. Just you, the right knowledge, and a plan that actually works.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ ...s.mono, background: '#e84030', color: '#ede8e1', border: 'none', padding: '1rem 2.5rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Create account →
                </motion.button>
              </Link>
              <Link to="/guides">
                <motion.button whileHover={{ borderColor: 'rgba(237,232,225,0.25)', color: '#ede8e1' }}
                  style={{ ...s.mono, background: 'transparent', color: 'rgba(237,232,225,0.35)', border: '0.5px solid rgba(237,232,225,0.08)', padding: '1rem 2rem', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                  Explore guides
                </motion.button>
              </Link>
            </div>
          </ScaleIn>
        </section>

        <footer style={{ borderTop: '0.5px solid rgba(237,232,225,0.07)', padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ ...s.bebas, fontSize: 16 }}>Fit<span style={{ color: '#e84030' }}>Right</span></div>
          <div style={{ ...s.mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(237,232,225,0.15)' }}>© 2026 FitRight — Know Your Craft</div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');
        @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes marqueeR { from{transform:translateX(-50%)} to{transform:translateX(0)} }
      `}</style>
    </div>
  );
}