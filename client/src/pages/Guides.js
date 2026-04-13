import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const categories = [
  {
    id: 'nutrition',
    n: '01',
    title: 'Nutrition',
    desc: 'Calories, protein, macros — understand what you eat and why it matters.',
    guides: [
      { id: 'calories-explained', title: 'Calories explained', sub: 'What they are and why they matter' },
      { id: 'protein-guide', title: 'The protein guide', sub: 'How much, when, and why' },
      { id: 'macros-101', title: 'Macros 101', sub: 'Carbs, fats, protein broken down' },
      { id: 'fat-loss-diet', title: 'Fat loss nutrition', sub: 'Eating in a deficit the right way' },
    ]
  },
  {
    id: 'training',
    n: '02',
    title: 'Training',
    desc: 'How to structure your workouts, build strength, and actually progress.',
    guides: [
      { id: 'progressive-overload', title: 'Progressive overload', sub: 'The single most important training concept' },
      { id: 'workout-splits', title: 'Workout splits explained', sub: 'PPL, Upper/Lower, Full body — which is best' },
      { id: 'compound-movements', title: 'Compound movements', sub: 'The big lifts and why they matter' },
      { id: 'recovery-guide', title: 'Recovery & rest', sub: 'Why rest days are part of the plan' },
    ]
  },
  {
    id: 'myths',
    n: '03',
    title: 'Myth busting',
    desc: 'The fitness industry is full of lies. We fix that here.',
    guides: [
      { id: 'cardio-myth', title: 'Cardio doesn\'t burn fat', sub: 'What actually causes fat loss' },
      { id: 'lifting-myth', title: 'Lifting makes you bulky', sub: 'Why this is completely wrong' },
      { id: 'spot-reduction', title: 'Spot reduction is fake', sub: 'You can\'t choose where fat comes from' },
      { id: 'starvation-mode', title: 'Starvation mode myth', sub: 'The truth about extreme deficits' },
    ]
  },
  {
    id: 'recovery',
    n: '04',
    title: 'Recovery',
    desc: 'Sleep, stress, and everything your body needs outside the gym.',
    guides: [
      { id: 'sleep-gains', title: 'Sleep and muscle growth', sub: 'Why 8 hours is non-negotiable' },
      { id: 'stress-cortisol', title: 'Stress and cortisol', sub: 'How stress kills your progress' },
      { id: 'deload-week', title: 'Deload weeks', sub: 'When and why to train less' },
      { id: 'supplements-basics', title: 'Supplements basics', sub: 'What actually works and what doesn\'t' },
    ]
  }
];

function Guides() {
  return (
    <div className="page">
      <Navbar />

      <section style={{ padding: '3.5rem 2.5rem 2rem', borderBottom: '0.5px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem' }}>⚡ Education Hub</div>
          <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', lineHeight: 0.95 }}>
            <span style={{ WebkitTextStroke: '1px rgba(240,237,232,0.2)', color: 'transparent', display: 'block' }}>Learn</span>
            <span style={{ color: 'var(--fg)', display: 'block' }}>the truth.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 400, lineHeight: 1.8, marginTop: '1rem' }}>
            No influencer nonsense. No broscience. Just accurate, practical fitness knowledge structured like a proper curriculum.
          </p>
        </motion.div>
      </section>

      <div>
        {categories.map((cat, ci) => (
          <motion.div key={cat.id}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: ci * 0.05 }}
            style={{ borderBottom: '0.5px solid var(--border)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ padding: '2rem 2.5rem', borderRight: '0.5px solid var(--border)' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--acc)', marginBottom: '0.75rem', fontWeight: 700 }}>{cat.n} ⚡</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{cat.title}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.7 }}>{cat.desc}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {cat.guides.map((guide, gi) => (
                  <Link to={`/guides/${guide.id}`} key={guide.id}>
                    <motion.div
                      whileHover={{ background: '#0f0f0f' }}
                      style={{
                        padding: '1.75rem 2rem',
                        borderRight: gi % 2 === 0 ? '0.5px solid var(--border)' : 'none',
                        borderBottom: gi < 2 ? '0.5px solid var(--border)' : 'none',
                        transition: 'background 0.2s', position: 'relative', cursor: 'none'
                      }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '0.4rem' }}>{guide.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{guide.sub}</div>
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: 14, color: 'var(--acc)', opacity: 0.5 }}>↗</div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Guides;