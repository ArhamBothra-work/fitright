import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

function Landing() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const trails = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      trails.push({ x: e.clientX, y: e.clientY, life: 1, size: Math.random() * 3 + 2 });
      if (trails.length > 40) trails.shift();
    };
    window.addEventListener('mousemove', onMove);

    const drawLightning = (x1, y1, x2, y2, depth = 5) => {
      if (depth <= 0) return;
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 80;
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 40;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(mx, my); ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(230,48,48,${depth * 0.07})`;
      ctx.lineWidth = depth * 0.5; ctx.stroke();
      if (Math.random() > 0.6) drawLightning(mx, my, mx + (Math.random() - 0.5) * 60, my + 50, depth - 1);
      drawLightning(x1, y1, mx, my, depth - 1);
      drawLightning(mx, my, x2, y2, depth - 1);
    };

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trails.forEach((t, i) => {
        t.life -= 0.05;
        if (t.life <= 0) { trails.splice(i, 1); return; }
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size * t.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,48,48,${t.life * 0.3})`;
        ctx.fill();
      });
      if (frame % 200 === 0 && Math.random() > 0.3) {
        const x = Math.random() * canvas.width;
        drawLightning(x, 0, x + (Math.random() - 0.5) * 200, canvas.height * 0.5);
      }
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    show: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        <section style={{ padding: '5rem 2.5rem 3rem', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
              <div style={{ width: 5, height: 5, background: 'var(--acc)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-dim)' }}>fitness education & tracking</span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(56px, 12vw, 110px)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.05em', textTransform: 'uppercase', marginBottom: '3rem' }}>
              <span style={{ display: 'block', WebkitTextStroke: '1px rgba(240,237,232,0.2)', color: 'transparent' }}>Know</span>
              <span style={{ display: 'block', WebkitTextStroke: '1px rgba(240,237,232,0.15)', color: 'transparent' }}>your</span>
              <span style={{ display: 'block', color: 'var(--acc)' }}>craft.</span>
            </motion.h1>

            <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 300, lineHeight: 1.8 }}>
                No myths. No confusion. Science-backed knowledge, structured plans, and the tools to prove your consistency works.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/register">
                  <button style={{ background: 'var(--acc)', color: 'var(--fg)', border: 'none', padding: '0.9rem 2.2rem', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Start now
                  </button>
                </Link>
                <Link to="/guides">
                  <button style={{ background: 'transparent', color: 'var(--fg-muted)', border: '0.5px solid var(--border)', padding: '0.9rem 2.2rem', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Explore
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <div style={{ overflow: 'hidden', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)', padding: '0.6rem 0' }}>
          <div style={{ display: 'flex', gap: 0, animation: 'marquee 20s linear infinite', width: 'max-content' }}>
            {['Education Hub', '⚡ No Myths', 'Workout Plans', '⚡ Progress Tracking', 'Nutrition Log', '⚡ Built Different', 'Fat Loss', '⚡ Muscle Gain',
              'Education Hub', '⚡ No Myths', 'Workout Plans', '⚡ Progress Tracking', 'Nutrition Log', '⚡ Built Different', 'Fat Loss', '⚡ Muscle Gain'].map((item, i) => (
              <span key={i} style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-dim)', padding: '0 2rem', borderRight: '0.5px solid var(--border)', whiteSpace: 'nowrap' }}>{item}</span>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { n: '01', title: 'Education hub', desc: 'A full curriculum. From metabolism basics to advanced programming. No fluff, no myths.' },
            { n: '02', title: 'Workout plans', desc: 'Goal-based splits — fat loss, muscle gain, recomp. Built and explained properly.' },
            { n: '03', title: 'Progress tracking', desc: 'Log everything. Weight, nutrition, lifts. Watch the data prove your work.' }
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ background: '#0f0f0f' }}
              style={{ padding: '2rem 2.5rem', borderRight: i < 2 ? '0.5px solid var(--border)' : 'none', borderTop: '0.5px solid var(--border)', position: 'relative', transition: 'background 0.25s' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--acc)', marginBottom: '1rem', fontWeight: 700 }}>{f.n} ⚡</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.65 }}>{f.desc}</div>
              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontSize: 16, color: 'var(--acc)', opacity: 0.4 }}>↗</div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', borderTop: '0.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 40, height: '0.5px', background: 'var(--border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', background: 'var(--acc)', animation: 'scanline 2s ease-in-out infinite' }} />
            </div>
            <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)' }}>scroll to explore</span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--fg-dim)' }}>v1.0 — 2026</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes scanline { 0% { left: -30% } 100% { left: 130% } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
      `}</style>
    </div>
  );
}

export default Landing;