import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', goal: 'fat_loss' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const inputStyle = {
    width: '100%', background: 'transparent',
    border: '0.5px solid rgba(255,255,255,0.12)',
    color: 'var(--fg)', padding: '0.9rem 1rem',
    fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif'
  };

  const goals = [
    { value: 'fat_loss', label: 'Fat Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  return (
    <div className="page">
      <Navbar />
      <div style={{ display: 'flex', minHeight: '90vh' }}>
        <div style={{ flex: 1, borderRight: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', WebkitTextStroke: '1px rgba(240,237,232,0.08)', color: 'transparent', lineHeight: 0.9 }}>
              START<br />YOUR<br /><span style={{ color: 'var(--acc)', WebkitTextStroke: 'none' }}>JOURNEY.</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: '2rem', maxWidth: 260, margin: '2rem auto 0' }}>
              Join FitRight and stop guessing. Learn the right way, train with purpose.
            </p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ width: '100%', maxWidth: 380 }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem' }}>⚡ Create account</div>
              <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase' }}>Let's build.</h1>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: '0.5rem' }}>Set your goal. We'll handle the rest.</p>
            </div>

            {error && <div style={{ background: 'rgba(230,48,48,0.1)', border: '0.5px solid var(--acc)', padding: '0.75rem 1rem', fontSize: 12, color: 'var(--acc)', marginBottom: '1.5rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input name="name" placeholder="Your name" onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', display: 'block', marginBottom: '0.5rem' }}>Your goal</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {goals.map(g => (
                    <button key={g.value} type="button" onClick={() => setForm({ ...form, goal: g.value })}
                      style={{
                        flex: 1, padding: '0.6rem 0.25rem', fontSize: 10,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        background: form.goal === g.value ? 'var(--acc)' : 'transparent',
                        color: form.goal === g.value ? 'var(--fg)' : 'var(--fg-dim)',
                        border: `0.5px solid ${form.goal === g.value ? 'var(--acc)' : 'rgba(255,255,255,0.12)'}`,
                        transition: 'all 0.2s', fontWeight: form.goal === g.value ? 700 : 400
                      }}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" style={{
                background: 'var(--acc)', color: 'var(--fg)', border: 'none',
                padding: '1rem', fontSize: 12, fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.5rem'
              }}>Create account →</button>
            </form>

            <p style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: '1.5rem', textAlign: 'center' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--acc)' }}>Log in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;