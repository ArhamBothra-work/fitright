import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API = 'https://fitright-server.onrender.com/api';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

// Precise anatomical target mappings for Front and Back sides
const musclePositions = {
  // Front Muscles
  chest:      { front: true },
  shoulders:  { front: true },
  biceps:     { front: true },
  core:       { front: true },
  quads:      { front: true },
  adductors:  { front: true },

  // Back Muscles
  back:       { front: false },
  lats:       { front: false },
  triceps:    { front: false },
  hamstrings: { front: false },
  glutes:     { front: false },
  calves:     { front: false },
  abductors:  { front: false },
  traps:      { front: false },
};

function BodyDiagram({ activeMuscles }) {
  // Calculate which side to show based on the hovered muscles
  const showFront = activeMuscles.length === 0 || activeMuscles.some(m => {
    const key = m.toLowerCase();
    return musclePositions[key]?.front || (!musclePositions[key] && !['back', 'lats', 'glutes', 'hamstrings', 'calves', 'triceps', 'abductors', 'traps'].includes(key));
  });

  const isActive = (muscleName) => {
    return activeMuscles.some(m => m.toLowerCase().includes(muscleName.toLowerCase()));
  };

  const activeColor = 'var(--acc)';
  const inactiveColor = '#121212';
  const strokeColor = 'rgba(240,237,232,0.12)';

  return (
    <div style={{ position: 'sticky', top: '2rem' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: '1rem', textAlign: 'center' }}>
        {activeMuscles.length ? (showFront ? 'Front' : 'Back') : 'Hover an exercise'} — muscles targeted
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 420"
        style={{ width: '100%', height: 'auto', background: '#0a0a0a', borderRadius: '12px', border: '1px solid var(--border)', padding: '1rem', display: 'block', margin: '0 auto' }}
      >
        {/* Render Front Side Muscles */}
        {showFront && (
          <g id="front-anatomy">
            {/* Traps (Anterior) */}
            <path d="M78 68 C80 50, 92 48, 92 48 L92 68 Z" fill={isActive('traps') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M122 68 C120 50, 108 48, 108 48 L108 68 Z" fill={isActive('traps') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Shoulders / Delts */}
            <path d="M68 68 C55 80, 60 100, 64 110 L76 78 Z" fill={isActive('shoulders') || isActive('deltoids') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M132 68 C145 80, 140 100, 136 110 L124 78 Z" fill={isActive('shoulders') || isActive('deltoids') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Chest / Pectorals */}
            <path d="M78 74 C78 74, 90 74, 96 78 L96 108 C80 108, 76 96, 76 96 Z" fill={isActive('chest') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M122 74 C122 74, 110 74, 104 78 L104 108 C120 108, 124 96, 124 96 Z" fill={isActive('chest') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Biceps */}
            <path d="M60 112 C55 125, 55 140, 62 152 L68 120 Z" fill={isActive('biceps') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M140 112 C145 125, 145 140, 138 152 L132 120 Z" fill={isActive('biceps') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Forearms */}
            <path d="M58 156 C52 170, 50 190, 56 205 L64 165 Z" fill={isActive('forearms') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M142 156 C148 170, 150 190, 144 205 L136 165 Z" fill={isActive('forearms') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Abs / Core */}
            <rect x="84" y="112" width="32" height="60" rx="4" fill={isActive('core') || isActive('abs') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Quads (Thighs) */}
            <path d="M72 195 C72 195, 68 250, 78 285 L94 285 C94 285, 96 220, 92 195 Z" fill={isActive('quads') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M128 195 C128 195, 132 250, 122 285 L106 285 C106 285, 104 220, 108 195 Z" fill={isActive('quads') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Adductors (Inner Thigh) */}
            <path d="M88 198 L94 270 L86 270 Z" fill={isActive('adductors') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M112 198 L106 270 L114 270 Z" fill={isActive('adductors') ? activeColor : inactiveColor} stroke={strokeColor} />
          </g>
        )}

        {/* Render Posterior (Back) Side Muscles */}
        {!showFront && (
          <g id="back-anatomy">
            {/* Neck / Traps (Back) */}
            <path d="M82 48 C90 35, 110 35, 118 48 L108 78 L92 78 Z" fill={isActive('traps') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Upper Back & Lats */}
            <path d="M76 82 C65 95, 62 135, 84 145 L94 110 Z" fill={isActive('back') || isActive('lats') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M124 82 C135 95, 138 135, 116 145 L106 110 Z" fill={isActive('back') || isActive('lats') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Lower Back */}
            <rect x="88" y="145" width="24" height="35" rx="2" fill={isActive('lower back') || isActive('back') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Triceps */}
            <path d="M64 105 C55 120, 55 138, 65 152 L70 120 Z" fill={isActive('triceps') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M136 105 C145 120, 145 138, 135 152 L130 120 Z" fill={isActive('triceps') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Glutes */}
            <path d="M72 182 C72 170, 98 170, 98 185 L96 215 C82 215, 72 205, 72 182 Z" fill={isActive('glutes') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M128 182 C128 170, 102 170, 102 185 L104 215 C118 215, 128 205, 128 182 Z" fill={isActive('glutes') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Hamstrings */}
            <path d="M74 218 C72 245, 74 275, 84 288 L96 288 L96 218 Z" fill={isActive('hamstrings') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M126 218 C128 245, 126 275, 116 288 L104 288 L104 218 Z" fill={isActive('hamstrings') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Calves */}
            <path d="M76 295 C70 315, 70 345, 84 365 L90 365 L88 295 Z" fill={isActive('calves') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M124 295 C130 315, 130 345, 116 365 L110 365 L112 295 Z" fill={isActive('calves') ? activeColor : inactiveColor} stroke={strokeColor} />

            {/* Abductors (Lateral Hips) */}
            <path d="M68 182 C64 195, 66 208, 72 215 L72 182 Z" fill={isActive('abductors') ? activeColor : inactiveColor} stroke={strokeColor} />
            <path d="M132 182 C136 195, 134 208, 128 215 L128 182 Z" fill={isActive('abductors') ? activeColor : inactiveColor} stroke={strokeColor} />
          </g>
        )}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', justifyContent: 'center' }}>
        {activeMuscles.map(m => (
          <span key={m} style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(230,48,48,0.1)', border: '0.5px solid var(--acc)', color: 'var(--acc)', padding: '0.2rem 0.6rem' }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goalFilter, setGoalFilter] = useState('all');
  const [activePlan, setActivePlan] = useState(null);
  const [hoveredMuscles, setHoveredMuscles] = useState([]);

  useEffect(() => {
    axios.get(`${API}/plans`, authHeaders())
      .then(res => { setPlans(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filtered = goalFilter === 'all' ? plans : plans.filter(p => p.goal === goalFilter);
  const selectedPlan = plans.find(p => p._id === activePlan);

  if (loading) return (
    <div className="page"><Navbar />
      <div style={{ padding: '4rem 2.5rem', fontSize: 13, color: 'var(--fg-muted)' }}>Loading plans...</div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />

      <section style={{ padding: '3.5rem 2.5rem 2rem', borderBottom: '0.5px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem' }}>⚡ Workout Plans</div>
          <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', lineHeight: 0.95 }}>
            <span style={{ WebkitTextStroke: '1px rgba(240,237,232,0.2)', color: 'transparent', display: 'block' }}>Train</span>
            <span style={{ color: 'var(--fg)', display: 'block' }}>with purpose.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 400, lineHeight: 1.8, marginTop: '1rem' }}>
            Goal-based splits built and explained properly. Hover any exercise to see exactly what it works.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            {['all', 'fat_loss', 'muscle_gain', 'maintenance'].map(g => (
              <button key={g} onClick={() => setGoalFilter(g)} style={{
                background: goalFilter === g ? 'var(--acc)' : 'transparent',
                color: goalFilter === g ? 'var(--fg)' : 'var(--fg-dim)',
                border: `0.5px solid ${goalFilter === g ? 'var(--acc)' : 'rgba(255,255,255,0.12)'}`,
                padding: '0.4rem 1rem', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', transition: 'all 0.2s',
              }}>{g.replace('_', ' ')}</button>
            ))}
          </div>
        </motion.div>
      </section>

      {!activePlan ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          {filtered.map((plan, i) => (
            <motion.div key={plan._id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => setActivePlan(plan._id)}
              whileHover={{ background: '#0f0f0f' }}
              style={{ padding: '2.5rem', borderRight: i % 3 < 2 ? '0.5px solid var(--border)' : 'none', borderBottom: '0.5px solid var(--border)', cursor: 'none', transition: 'background 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', fontWeight: 700 }}>⚡ {plan.split}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-dim)', border: '0.5px solid var(--border)', padding: '0.2rem 0.5rem' }}>{plan.level}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{plan.title}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{plan.desc}</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{plan.days} days/week</div>
                <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>Goal: {plan.goal.replace('_', ' ')}</div>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: 11, color: 'var(--acc)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>View plan →</div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 320px' }}>
          <div style={{ borderRight: '0.5px solid var(--border)' }}>
            <div style={{ padding: '1.5rem 2.5rem', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.25rem' }}>⚡ {selectedPlan.split}</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{selectedPlan.title}</div>
              </div>
              <button onClick={() => { setActivePlan(null); setHoveredMuscles([]); }} style={{ background: 'transparent', color: 'var(--fg-dim)', border: '0.5px solid var(--border)', padding: '0.5rem 1rem', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Back</button>
            </div>

            {selectedPlan.schedule.map((day, di) => (
              <div key={di} style={{ borderBottom: '0.5px solid var(--border)' }}>
                <div style={{ padding: '1.25rem 2.5rem', borderBottom: '0.5px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', fontWeight: 700 }}>{day.day}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>{day.focus}</div>
                </div>
                {day.exercises.map((ex, ei) => (
                  <motion.div key={ei}
                    onHoverStart={() => setHoveredMuscles(ex.muscles)}
                    onHoverEnd={() => setHoveredMuscles([])}
                    whileHover={{ background: '#0d0d0d' }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', padding: '1rem 2.5rem', borderBottom: ei < day.exercises.length - 1 ? '0.5px solid var(--border)' : 'none', cursor: 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: '0.2rem' }}>{ex.name}</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {ex.muscles.map(m => (
                          <span key={m} style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--acc)', opacity: 0.7 }}>{m}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--acc)' }}>{ex.sets}</div>
                      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-dim)' }}>sets</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>{ex.reps}</div>
                      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-dim)' }}>reps</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ padding: '2rem 1.5rem' }}>
            <BodyDiagram activeMuscles={hoveredMuscles} />
          </div>
        </motion.div>
      )}
    </div>
  );
}