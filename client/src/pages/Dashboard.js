import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API = 'https://fitright-server.onrender.com/api';

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showSettings, setShowSettings] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '', goal: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setForm({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        goal: user.goal || 'maintenance'
      });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const payload = { name: form.name, email: form.email, goal: form.goal };

    if (form.newPassword || form.confirmPassword) {
      if (!form.currentPassword) {
        setError('Your current password is required to save a new password.');
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setError('New password and confirmation password do not match.');
        return;
      }
      if (form.newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    setUpdating(true);
    try {
      const res = await axios.put(`${API}/auth/update-profile`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setSuccess('Profile successfully updated.');
      
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setUpdating(false);
    }
  };

  const goalStrategies = {
    fat_loss: {
      strategy: "Maximum Deficit Strategy",
      insight: "Focus on keeping protein distribution high to prevent muscle breakdown while driving a consistent, progressive energy deficit."
    },
    muscle_gain: {
      strategy: "Hypertrophy Phase",
      insight: "Prioritize consistent mechanical tension, progressive overload, and a slight caloric surplus to maximize muscular adaptation."
    },
    maintenance: {
      strategy: "Neuromuscular Base",
      insight: "Optimize physical performance, work capacity, and maintenance calories. Build strength foundations while maintaining body weight."
    }
  };

  const cards = [
    { n: '01', title: 'Education Hub', desc: 'Learn training mechanics and science fundamentals.', link: '/guides', label: 'Start reading' },
    { n: '02', title: 'Workout Plans', desc: 'Browse training plans optimized for your primary objective.', link: '/plans', label: 'Browse plans' },
    { n: '03', title: 'Progress Tracker', desc: 'Log your metrics and track physical changes directly.', link: '/tracker', label: 'Track progress' },
  ];

  const inputStyle = {
    width: '100%',
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    color: '#ffffff',
    padding: '0.85rem 1rem',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'Inter, sans-serif'
  };

  if (!user) return null;

  return (
    <div className="page" style={{ background: '#080808', minHeight: '100vh', color: '#ffffff' }}>
      <Navbar />

      {/* Greeting Header & Edit Button */}
      <section style={{ padding: '3.5rem 2.5rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', background: '#0d0d0d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem', fontFamily: "'Space Mono', monospace" }}>
              ACTIVE DASHBOARD
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px,6vw,72px)', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 0.9, color: '#ffffff' }}>
              Welcome back, <span style={{ color: 'var(--acc)' }}>{user.name}.</span>
            </h1>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowSettings(!showSettings); setSuccess(''); setError(''); }}
            style={{
              background: showSettings ? '#ffffff' : 'transparent', color: showSettings ? '#080808' : '#ffffff',
              border: '1px solid #ffffff', borderRadius: '4px', padding: '0.8rem 1.75rem',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: "'Space Mono', monospace", cursor: 'pointer'
            }}
          >
            {showSettings ? 'Close Settings' : 'Edit Profile'}
          </motion.button>
        </div>

        {/* Collapsible Profile Settings Form - Opens up directly next to context/greeting header */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.5rem', fontFamily: "'Space Mono', monospace" }}>⚡ Profile Customization</div>
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, textTransform: 'uppercase', color: '#ffffff', marginBottom: '1rem' }}>Adjust Credentials</h2>
                  <p style={{ fontSize: 13, color: '#ffffff', opacity: 0.8, lineHeight: 1.7, maxWidth: '400px' }}>
                    Update your contact points or enter your existing password to modify your active security credentials.
                  </p>
                </div>

                <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '0.5rem', fontFamily: "'Space Mono', monospace" }}>Full Name</label>
                      <input name="name" type="text" value={form.name} onChange={handleChange} autoComplete="off" required style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '0.5rem', fontFamily: "'Space Mono', monospace" }}>Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" required style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
                    <label style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', display: 'block', marginBottom: '1rem', fontFamily: "'Space Mono', monospace" }}>🔒 Update Password</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace" }}>Current Password</label>
                        <input name="currentPassword" type="password" placeholder="Required to save new password" value={form.currentPassword} onChange={handleChange} autoComplete="new-password" style={inputStyle} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace" }}>New Password</label>
                          <input name="newPassword" type="password" placeholder="••••••••" value={form.newPassword} onChange={handleChange} autoComplete="new-password" style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace" }}>Confirm New Password</label>
                          <input name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', display: 'block', marginBottom: '0.6rem', fontFamily: "'Space Mono', monospace" }}>Goal Focus</label>
                    <div style={{ display: 'flex', gap: '6px', background: '#111111', padding: '4px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)' }}>
                      {['fat_loss', 'muscle_gain', 'maintenance'].map(g => (
                        <button
                          type="button" key={g}
                          disabled={updating}
                          onClick={() => setForm({ ...form, goal: g })}
                          style={{
                            flex: 1, padding: '0.65rem 0', fontSize: 9, letterSpacing: '0.15em',
                            textTransform: 'uppercase', background: form.goal === g ? 'var(--acc)' : 'transparent',
                            color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer',
                            fontFamily: "'Space Mono', monospace", fontWeight: 700
                          }}
                        >
                          {g.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {success && <div style={{ color: '#00ff66', fontSize: 11, background: 'rgba(0, 255, 102, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>{success}</div>}
                  {error && <div style={{ color: 'var(--acc)', fontSize: 11, background: 'rgba(232, 64, 48, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(232, 64, 48, 0.2)' }}>{error}</div>}

                  <motion.button type="submit" disabled={updating} style={{ background: 'var(--acc)', color: '#ffffff', border: 'none', padding: '1rem', borderRadius: '4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", cursor: 'pointer' }}>
                    {updating ? 'Saving changes...' : 'Save credentials →'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Dynamic User Goal Showcase */}
      <section style={{ padding: '2.5rem', background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'center', background: '#0d0d0d', padding: '2.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--acc)', fontFamily: "'Space Mono', monospace", marginBottom: '0.4rem', fontWeight: 700 }}>Personal Objective</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: '#ffffff', letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1 }}>
              {goalStrategies[user.goal || 'maintenance'].strategy}
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#ffffff', lineHeight: 1.6, borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '2.5rem' }}>
            {goalStrategies[user.goal || 'maintenance'].insight}
          </div>
        </div>
      </section>

      {/* Clean Navigation Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ padding: '2.5rem', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.12)', background: '#080808' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--acc)', marginBottom: '1.25rem', fontFamily: "'Space Mono', monospace" }}>{c.n} ⚡</div>
            <div style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'Bebas Neue', sans-serif", color: '#ffffff' }}>{c.title}</div>
            <div style={{ fontSize: 13, color: '#ffffff', opacity: 0.8, lineHeight: 1.6, marginBottom: '2.5rem' }}>{c.desc}</div>
            <Link to={c.link}>
              <button style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '0.8rem 1.5rem', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", cursor: 'pointer' }}>
                {c.label} →
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Account Control Actions */}
      <div style={{ padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'flex-end', background: '#0d0d0d' }}>
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '0.65rem 1.5rem', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;