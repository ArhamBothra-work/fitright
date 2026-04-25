import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const categoryOrder = ['Nutrition', 'Training', 'Myth Busting', 'Recovery'];
const categoryNums = { 'Nutrition': '01', 'Training': '02', 'Myth Busting': '03', 'Recovery': '04' };
const categoryDescs = {
  'Nutrition': 'Calories, protein, macros — understand what you eat and why it matters.',
  'Training': 'How to structure your workouts, build strength, and actually progress.',
  'Myth Busting': 'The fitness industry is full of lies. We fix that here.',
  'Recovery': 'Sleep, stress, and everything your body needs outside the gym.',
};

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/guides`, authHeaders())
      .then(res => { setGuides(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const grouped = categoryOrder.map(cat => ({
    category: cat,
    guides: guides.filter(g => g.category === cat),
  }));

  if (loading) return (
    <div className="page">
      <Navbar />
      <div style={{ padding: '4rem 2.5rem', fontSize: 13, color: 'var(--fg-muted)' }}>Loading guides...</div>
    </div>
  );

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
        {grouped.map((cat, ci) => (
          <motion.div key={cat.category}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: ci * 0.05 }}
            style={{ borderBottom: '0.5px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ padding: '2rem 2.5rem', borderRight: '0.5px solid var(--border)' }}>
                <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--acc)', marginBottom: '0.75rem', fontWeight: 700 }}>{categoryNums[cat.category]} ⚡</div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{cat.category}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.7 }}>{categoryDescs[cat.category]}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {cat.guides.map((guide, gi) => (
                  <Link to={`/guides/${guide.slug}`} key={guide.slug}>
                    <motion.div
                      whileHover={{ background: '#0f0f0f' }}
                      style={{
                        padding: '1.75rem 2rem',
                        borderRight: gi % 2 === 0 ? '0.5px solid var(--border)' : 'none',
                        borderBottom: gi < cat.guides.length - 2 ? '0.5px solid var(--border)' : 'none',
                        transition: 'background 0.2s', position: 'relative', cursor: 'none',
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