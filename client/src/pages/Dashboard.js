import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cards = [
    { n: '01', title: 'Education Hub', desc: 'Learn the fundamentals. No myths, no fluff.', link: '/guides', label: 'Start learning' },
    { n: '02', title: 'Workout Plans', desc: 'Goal-based splits built and explained properly.', link: '/plans', label: 'Browse plans' },
    { n: '03', title: 'Progress Tracker', desc: 'Log weight, lifts, nutrition. See it all in one place.', link: '/tracker', label: 'Track progress' },
  ];

  const goalLabel = {
    fat_loss: 'Fat Loss',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance'
  };

  return (
    <div className="page">
      <Navbar />

      <section style={{ padding: '3.5rem 2.5rem 2rem', borderBottom: '0.5px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem' }}>⚡ Dashboard</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 1 }}>
            Welcome back,<br />
            <span style={{ color: 'var(--acc)' }}>{user?.name}.</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-dim)' }}>Current goal</div>
            <div style={{ background: 'rgba(230,48,48,0.1)', border: '0.5px solid var(--acc)', padding: '0.3rem 0.9rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--acc)' }}>
              {goalLabel[user?.goal] || 'Not set'}
            </div>
          </div>
        </motion.div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {cards.map((c, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
            style={{ padding: '2.5rem', borderRight: i < 2 ? '0.5px solid var(--border)' : 'none', borderBottom: '0.5px solid var(--border)', position: 'relative' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--acc)', marginBottom: '1.5rem', fontWeight: 700 }}>{c.n} ⚡</div>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>{c.desc}</div>
            <Link to={c.link}>
              <button style={{
                background: 'transparent', color: 'var(--acc)',
                border: '0.5px solid var(--acc)', padding: '0.6rem 1.2rem',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase'
              }}>{c.label} →</button>
            </Link>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '0.5px solid var(--border)' }}>
        {[
          { label: 'Goal', value: goalLabel[user?.goal] || '—' },
          { label: 'Status', value: 'Active' },
          { label: 'Member since', value: 'Apr 2026' }
        ].map((s, i) => (
          <div key={i} style={{ padding: '1.5rem 2.5rem', borderRight: i < 2 ? '0.5px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: '0.4rem' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem 2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleLogout} style={{
          background: 'transparent', color: 'var(--fg-dim)',
          border: '0.5px solid var(--border)', padding: '0.5rem 1.2rem',
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase'
        }}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;