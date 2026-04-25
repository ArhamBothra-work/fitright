import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function GuideDetail() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API}/guides/${id}`, authHeaders())
      .then(res => { setGuide(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="page"><Navbar />
      <div style={{ padding: '4rem 2.5rem', fontSize: 13, color: 'var(--fg-muted)' }}>Loading guide...</div>
    </div>
  );

  if (error || !guide) return (
    <div className="page"><Navbar />
      <div style={{ padding: '4rem 2.5rem' }}>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: '1rem' }}>Guide not found.</div>
        <Link to="/guides" style={{ fontSize: 11, color: 'var(--acc)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>← Back to guides</Link>
      </div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <section style={{ padding: '3.5rem 2.5rem 2rem', borderBottom: '0.5px solid var(--border)', maxWidth: 900 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Link to="/guides" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-dim)' }}>← Back</Link>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--acc)' }}>⚡ {guide.category}</div>
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.75rem' }}>{guide.title}</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)' }}>{guide.sub}</p>
        </motion.div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px' }}>
        <div style={{ borderRight: '0.5px solid var(--border)', padding: '2.5rem' }}>
          {guide.sections.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: i < guide.sections.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '1rem', textTransform: 'uppercase' }}>{s.heading}</h2>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.85 }}>{s.body}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ padding: '2.5rem' }}>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: '1rem' }}>In this guide</div>
            {guide.sections.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--fg-muted)', padding: '0.6rem 0', borderBottom: '0.5px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--acc)', fontSize: 10, marginTop: 2 }}>⚡</span>
                {s.heading}
              </div>
            ))}
            <Link to="/guides">
              <button style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', color: 'var(--fg-dim)', border: '0.5px solid var(--border)', padding: '0.75rem', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>← All guides</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}