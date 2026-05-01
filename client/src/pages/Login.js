import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear inputs completely on mount to prevent any lingering auto-fill
  useEffect(() => {
    setForm({ email: '', password: '' });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://fitright-server.onrender.com/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Clear data from form state immediately on success
      setForm({ email: '', password: '' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', 
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px',
    color: '#ffffff', 
    padding: '0.9rem 1rem',
    fontSize: 13, 
    outline: 'none', 
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.25s ease',
  };

  return (
    <div className="page" style={{ background: '#070707', minHeight: '100vh', color: '#ffffff' }}>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
        
        {/* Left Form Content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: 380 }}
          >
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '1px', background: 'var(--acc)' }} /> Welcome back
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#ffffff', lineHeight: 0.95 }}>
                Log back in.
              </h1>
              <p style={{ fontSize: 13, color: '#ffffff', opacity: 0.6, marginTop: '0.5rem' }}>Your progress is waiting.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{ background: 'rgba(230,48,48,0.08)', border: '1px solid var(--acc)', borderRadius: '4px', padding: '0.75rem 1rem', fontSize: 12, color: 'var(--acc)', marginBottom: '1.5rem', fontFamily: "'Space Mono', monospace" }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', opacity: 0.4, display: 'block', marginBottom: '0.5rem', fontFamily: "'Space Mono', monospace" }}>Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={form.email}
                  onChange={handleChange} 
                  autoComplete="off"
                  required 
                  style={inputStyle} 
                />
              </div>
              
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffffff', opacity: 0.4, display: 'block', fontFamily: "'Space Mono', monospace" }}>Password</label>
                </div>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={form.password}
                  onChange={handleChange} 
                  autoComplete="new-password"
                  required 
                  style={inputStyle} 
                />
              </div>

              <motion.button 
                type="submit" 
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  background: 'var(--acc)', color: '#ffffff', border: 'none', borderRadius: '4px',
                  padding: '1.1rem', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.75rem',
                  fontFamily: "'Space Mono', monospace", cursor: 'pointer', transition: 'all 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Entering...' : 'Enter →'}
              </motion.button>
            </form>

            <p style={{ fontSize: 12, color: '#ffffff', opacity: 0.5, marginTop: '1.75rem', textAlign: 'center' }}>
              No account? <Link to="/register" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
            </p>
          </motion.div>
        </div>

        {/* Right Brand Panel */}
        <div style={{ flex: 1, borderLeft: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0a0a' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(64px, 7.5vw, 110px)', fontWeight: 900, letterSpacing: '0.01em', textTransform: 'uppercase', color: '#ffffff', lineHeight: 0.88 }}>
              KNOW<br />YOUR<br /><span style={{ color: 'var(--acc)' }}>CRAFT.</span>
            </div>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}

export default Login;