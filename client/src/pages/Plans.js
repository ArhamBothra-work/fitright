import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const plans = [
  {
    id: 1, goal: 'fat_loss', level: 'Beginner', title: 'Fat Loss Starter',
    days: 3, desc: 'A simple 3-day full body plan focused on building the habit and burning calories.',
    split: 'Full Body',
    schedule: [
      {
        day: 'Day 1', focus: 'Full Body A',
        exercises: [
          { name: 'Squat', sets: '3', reps: '10', muscles: ['quads', 'glutes'] },
          { name: 'Bench Press', sets: '3', reps: '10', muscles: ['chest', 'shoulders'] },
          { name: 'Bent Over Row', sets: '3', reps: '10', muscles: ['back', 'biceps'] },
          { name: 'Plank', sets: '3', reps: '30s', muscles: ['core'] },
        ]
      },
      {
        day: 'Day 2', focus: 'Full Body B',
        exercises: [
          { name: 'Romanian Deadlift', sets: '3', reps: '10', muscles: ['hamstrings', 'glutes'] },
          { name: 'Overhead Press', sets: '3', reps: '10', muscles: ['shoulders'] },
          { name: 'Lat Pulldown', sets: '3', reps: '10', muscles: ['back', 'biceps'] },
          { name: 'Leg Raises', sets: '3', reps: '12', muscles: ['core'] },
        ]
      },
      {
        day: 'Day 3', focus: 'Full Body C',
        exercises: [
          { name: 'Leg Press', sets: '4', reps: '12', muscles: ['quads', 'glutes'] },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '10', muscles: ['chest', 'shoulders'] },
          { name: 'Cable Row', sets: '3', reps: '10', muscles: ['back'] },
          { name: 'Dumbbell Curl', sets: '2', reps: '12', muscles: ['biceps'] },
        ]
      }
    ]
  },
  {
    id: 2, goal: 'muscle_gain', level: 'Intermediate', title: 'Push Pull Legs',
    days: 6, desc: 'The classic PPL split for maximum muscle gain. Each muscle hit twice a week.',
    split: 'Push Pull Legs',
    schedule: [
      {
        day: 'Day 1', focus: 'Push',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '6-8', muscles: ['chest', 'shoulders', 'triceps'] },
          { name: 'Overhead Press', sets: '3', reps: '8', muscles: ['shoulders'] },
          { name: 'Incline DB Press', sets: '3', reps: '10', muscles: ['chest'] },
          { name: 'Lateral Raises', sets: '4', reps: '15', muscles: ['shoulders'] },
          { name: 'Tricep Pushdown', sets: '3', reps: '12', muscles: ['triceps'] },
        ]
      },
      {
        day: 'Day 2', focus: 'Pull',
        exercises: [
          { name: 'Deadlift', sets: '4', reps: '5', muscles: ['back', 'hamstrings', 'glutes'] },
          { name: 'Pull Ups', sets: '3', reps: '8', muscles: ['back', 'biceps'] },
          { name: 'Cable Row', sets: '3', reps: '10', muscles: ['back'] },
          { name: 'Face Pulls', sets: '3', reps: '15', muscles: ['shoulders'] },
          { name: 'Barbell Curl', sets: '3', reps: '10', muscles: ['biceps'] },
        ]
      },
      {
        day: 'Day 3', focus: 'Legs',
        exercises: [
          { name: 'Squat', sets: '4', reps: '6-8', muscles: ['quads', 'glutes'] },
          { name: 'Romanian Deadlift', sets: '3', reps: '10', muscles: ['hamstrings', 'glutes'] },
          { name: 'Leg Press', sets: '3', reps: '12', muscles: ['quads'] },
          { name: 'Leg Curl', sets: '3', reps: '12', muscles: ['hamstrings'] },
          { name: 'Calf Raises', sets: '4', reps: '15', muscles: ['calves'] },
        ]
      }
    ]
  },
  {
    id: 3, goal: 'maintenance', level: 'Beginner', title: 'Upper Lower Split',
    days: 4, desc: 'A balanced 4-day upper/lower split. Great for building strength and staying consistent.',
    split: 'Upper / Lower',
    schedule: [
      {
        day: 'Day 1', focus: 'Upper A',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '8', muscles: ['chest', 'shoulders', 'triceps'] },
          { name: 'Barbell Row', sets: '4', reps: '8', muscles: ['back', 'biceps'] },
          { name: 'Overhead Press', sets: '3', reps: '10', muscles: ['shoulders'] },
          { name: 'Lat Pulldown', sets: '3', reps: '10', muscles: ['back'] },
        ]
      },
      {
        day: 'Day 2', focus: 'Lower A',
        exercises: [
          { name: 'Squat', sets: '4', reps: '8', muscles: ['quads', 'glutes'] },
          { name: 'Romanian Deadlift', sets: '3', reps: '10', muscles: ['hamstrings', 'glutes'] },
          { name: 'Leg Press', sets: '3', reps: '12', muscles: ['quads'] },
          { name: 'Calf Raises', sets: '4', reps: '15', muscles: ['calves'] },
        ]
      }
    ]
  }
];

const muscleGroups = ['chest', 'shoulders', 'back', 'biceps', 'triceps', 'core', 'quads', 'hamstrings', 'glutes', 'calves'];

const musclePositions = {
  chest:      { x: 200, y: 120, front: true },
  shoulders:  { x: 160, y: 100, front: true },
  biceps:     { x: 145, y: 145, front: true },
  core:       { x: 200, y: 180, front: true },
  quads:      { x: 185, y: 270, front: true },
  triceps:    { x: 255, y: 145, front: false },
  back:       { x: 200, y: 130, front: false },
  hamstrings: { x: 200, y: 280, front: false },
  glutes:     { x: 200, y: 230, front: false },
  calves:     { x: 200, y: 340, front: false },
};

function BodyDiagram({ activeMuscles }) {
  const showFront = activeMuscles.length === 0 || activeMuscles.some(m => musclePositions[m]?.front);

  return (
    <div style={{ position: 'sticky', top: '2rem' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: '1rem', textAlign: 'center' }}>
        {showFront ? 'Front' : 'Back'} — muscles targeted
      </div>
      <svg viewBox="0 0 400 420" style={{ width: '100%', maxWidth: 280, display: 'block', margin: '0 auto' }}>
        {showFront ? (
          <g fill="none" stroke="rgba(240,237,232,0.12)" strokeWidth="1.5">
            <ellipse cx="200" cy="55" rx="35" ry="42" />
            <line x1="200" y1="97" x2="200" y2="210" />
            <path d="M200 105 Q155 115 140 180 Q148 185 160 175 Q165 140 200 130" />
            <path d="M200 105 Q245 115 260 180 Q252 185 240 175 Q235 140 200 130" />
            <path d="M160 175 Q150 210 155 240 Q165 238 168 210" />
            <path d="M240 175 Q250 210 245 240 Q235 238 232 210" />
            <path d="M200 130 Q175 135 168 210 Q185 215 200 212 Q215 215 232 210 Q225 135 200 130" />
            <path d="M168 212 Q170 280 172 310 Q185 312 188 280 Q192 260 200 255 Q208 260 212 280 Q215 312 228 310 Q230 280 232 212" />
            <path d="M172 310 Q170 360 175 380 Q188 382 190 360 Q192 340 193 310" />
            <path d="M228 310 Q230 360 225 380 Q212 382 210 360 Q208 340 207 310" />
          </g>
        ) : (
          <g fill="none" stroke="rgba(240,237,232,0.12)" strokeWidth="1.5">
            <ellipse cx="200" cy="55" rx="35" ry="42" />
            <line x1="200" y1="97" x2="200" y2="210" />
            <path d="M200 105 Q155 115 140 180 Q148 185 160 175 Q165 140 200 130" />
            <path d="M200 105 Q245 115 260 180 Q252 185 240 175 Q235 140 200 130" />
            <path d="M160 175 Q150 210 155 240 Q165 238 168 210" />
            <path d="M240 175 Q250 210 245 240 Q235 238 232 210" />
            <path d="M200 130 Q175 135 168 210 Q185 215 200 212 Q215 215 232 210 Q225 135 200 130" />
            <path d="M168 212 Q170 280 172 310 Q185 312 188 280 Q192 260 200 255 Q208 260 212 280 Q215 312 228 310 Q230 280 232 212" />
            <path d="M172 310 Q170 360 175 380 Q188 382 190 360 Q192 340 193 310" />
            <path d="M228 310 Q230 360 225 380 Q212 382 210 360 Q208 340 207 310" />
          </g>
        )}

        {activeMuscles.map(muscle => {
          const pos = musclePositions[muscle];
          if (!pos) return null;
          if (pos.front !== showFront) return null;
          return (
            <g key={muscle}>
              <circle cx={pos.x} cy={pos.y} r="22" fill="rgba(230,48,48,0.25)" stroke="var(--acc)" strokeWidth="1.5" />
              <circle cx={pos.x} cy={pos.y} r="8" fill="var(--acc)" opacity="0.8" />
              <text x={pos.x} y={pos.y + 38} textAnchor="middle" fill="rgba(240,237,232,0.6)" fontSize="10" fontFamily="Inter">
                {muscle}
              </text>
            </g>
          );
        })}

        {activeMuscles.length === 0 && muscleGroups.map(muscle => {
          const pos = musclePositions[muscle];
          if (!pos || pos.front !== showFront) return null;
          return (
            <circle key={muscle} cx={pos.x} cy={pos.y} r="14" fill="rgba(240,237,232,0.04)" stroke="rgba(240,237,232,0.1)" strokeWidth="1" />
          );
        })}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', justifyContent: 'center' }}>
        {activeMuscles.map(m => (
          <span key={m} style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(230,48,48,0.1)', border: '0.5px solid var(--acc)', color: 'var(--acc)', padding: '0.2rem 0.6rem' }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function Plans() {
  const [goalFilter, setGoalFilter] = useState('all');
  const [activePlan, setActivePlan] = useState(null);
  const [hoveredMuscles, setHoveredMuscles] = useState([]);

  const filtered = goalFilter === 'all' ? plans : plans.filter(p => p.goal === goalFilter);
  const selectedPlan = plans.find(p => p.id === activePlan);

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
                textTransform: 'uppercase', transition: 'all 0.2s'
              }}>{g.replace('_', ' ')}</button>
            ))}
          </div>
        </motion.div>
      </section>

      {!activePlan ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {filtered.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => setActivePlan(plan.id)}
              className="hoverable"
              style={{ padding: '2.5rem', borderRight: i % 3 < 2 ? '0.5px solid var(--border)' : 'none', borderBottom: '0.5px solid var(--border)', cursor: 'none', transition: 'background 0.2s' }}
              whileHover={{ background: '#0f0f0f' }}>
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
          style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
          <div style={{ borderRight: '0.5px solid var(--border)' }}>
            <div style={{ padding: '1.5rem 2.5rem', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.25rem' }}>⚡ {selectedPlan.split}</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{selectedPlan.title}</div>
              </div>
              <button onClick={() => { setActivePlan(null); setHoveredMuscles([]); }} style={{
                background: 'transparent', color: 'var(--fg-dim)',
                border: '0.5px solid var(--border)', padding: '0.5rem 1rem',
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase'
              }}>← Back</button>
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
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center', padding: '1rem 2.5rem', borderBottom: ei < day.exercises.length - 1 ? '0.5px solid var(--border)' : 'none', transition: 'background 0.2s', cursor: 'none' }}
                    whileHover={{ background: '#0d0d0d' }}>
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

          <div style={{ padding: '2rem' }}>
            <BodyDiagram activeMuscles={hoveredMuscles} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Plans;