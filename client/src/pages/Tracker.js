import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import axios from 'axios';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Tracker() {
  const [activeTab, setActiveTab] = useState('weight');
  const [weightLog, setWeightLog] = useState(() => JSON.parse(localStorage.getItem('weightLog') || '[]'));
  const [workoutLog, setWorkoutLog] = useState(() => JSON.parse(localStorage.getItem('workoutLog') || '[]'));
  const [nutritionLog, setNutritionLog] = useState(() => JSON.parse(localStorage.getItem('nutritionLog') || '[]'));
  const [weightForm, setWeightForm] = useState({ date: '', weight: '' });
  const [workoutForm, setWorkoutForm] = useState({ date: '', exercise: '', sets: '', reps: '', weight: '' });
  const [nutritionForm, setNutritionForm] = useState({ date: '', calories: '', protein: '' });

  const user = JSON.parse(localStorage.getItem('user'));

  const saveWeight = (e) => {
    e.preventDefault();
    const updated = [...weightLog, { ...weightForm, id: Date.now() }].sort((a, b) => new Date(a.date) - new Date(b.date));
    setWeightLog(updated);
    localStorage.setItem('weightLog', JSON.stringify(updated));
    setWeightForm({ date: '', weight: '' });
  };

  const saveWorkout = (e) => {
    e.preventDefault();
    const updated = [...workoutLog, { ...workoutForm, id: Date.now() }];
    setWorkoutLog(updated);
    localStorage.setItem('workoutLog', JSON.stringify(updated));
    setWorkoutForm({ date: '', exercise: '', sets: '', reps: '', weight: '' });
  };

  const saveNutrition = (e) => {
    e.preventDefault();
    const updated = [...nutritionLog, { ...nutritionForm, id: Date.now() }];
    setNutritionLog(updated);
    localStorage.setItem('nutritionLog', JSON.stringify(updated));
    setNutritionForm({ date: '', calories: '', protein: '' });
  };

  const inputStyle = {
    background: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)',
    color: 'var(--fg)', padding: '0.75rem 1rem', fontSize: 13,
    outline: 'none', fontFamily: 'Inter, sans-serif', width: '100%'
  };

  const labelStyle = {
    fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'var(--fg-dim)', display: 'block', marginBottom: '0.4rem'
  };

  const tabs = ['weight', 'workout', 'nutrition'];

  const maxWeight = weightLog.length ? Math.max(...weightLog.map(w => parseFloat(w.weight))) : 100;
  const minWeight = weightLog.length ? Math.min(...weightLog.map(w => parseFloat(w.weight))) : 0;
  const weightRange = maxWeight - minWeight || 1;

  return (
    <div className="page">
      <Navbar />

      <section style={{ padding: '3.5rem 2.5rem 2rem', borderBottom: '0.5px solid var(--border)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', marginBottom: '0.75rem' }}>⚡ Progress Tracker</div>
          <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', lineHeight: 0.95 }}>
            <span style={{ WebkitTextStroke: '1px rgba(240,237,232,0.2)', color: 'transparent', display: 'block' }}>Prove</span>
            <span style={{ color: 'var(--fg)', display: 'block' }}>your work.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 400, lineHeight: 1.8, marginTop: '1rem' }}>
            Log your weight, workouts, and nutrition. Watch the data show you exactly how far you've come.
          </p>
        </motion.div>
      </section>

      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '1rem 2rem', fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase', background: 'transparent',
            color: activeTab === tab ? 'var(--acc)' : 'var(--fg-dim)',
            border: 'none', borderBottom: activeTab === tab ? '1px solid var(--acc)' : '1px solid transparent',
            transition: 'all 0.2s', marginBottom: '-0.5px'
          }}>{tab}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr' }}>
        <div style={{ borderRight: '0.5px solid var(--border)', padding: '2rem' }}>

          {activeTab === 'weight' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={saveWeight}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '0.5rem' }}>Log bodyweight</div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={weightForm.date} onChange={e => setWeightForm({ ...weightForm, date: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Weight (kg)</label>
                <input type="number" step="0.1" placeholder="75.5" style={inputStyle} value={weightForm.weight} onChange={e => setWeightForm({ ...weightForm, weight: e.target.value })} required />
              </div>
              <button type="submit" style={{ background: 'var(--acc)', color: 'var(--fg)', border: 'none', padding: '0.85rem', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Log weight →</button>
            </motion.form>
          )}

          {activeTab === 'workout' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={saveWorkout}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '0.5rem' }}>Log workout</div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={workoutForm.date} onChange={e => setWorkoutForm({ ...workoutForm, date: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Exercise</label>
                <input placeholder="Bench Press" style={inputStyle} value={workoutForm.exercise} onChange={e => setWorkoutForm({ ...workoutForm, exercise: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Sets</label>
                  <input type="number" placeholder="4" style={inputStyle} value={workoutForm.sets} onChange={e => setWorkoutForm({ ...workoutForm, sets: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Reps</label>
                  <input type="number" placeholder="8" style={inputStyle} value={workoutForm.reps} onChange={e => setWorkoutForm({ ...workoutForm, reps: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>kg</label>
                  <input type="number" placeholder="80" style={inputStyle} value={workoutForm.weight} onChange={e => setWorkoutForm({ ...workoutForm, weight: e.target.value })} required />
                </div>
              </div>
              <button type="submit" style={{ background: 'var(--acc)', color: 'var(--fg)', border: 'none', padding: '0.85rem', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Log workout →</button>
            </motion.form>
          )}

          {activeTab === 'nutrition' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={saveNutrition}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '0.5rem' }}>Log nutrition</div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={nutritionForm.date} onChange={e => setNutritionForm({ ...nutritionForm, date: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Calories</label>
                <input type="number" placeholder="2000" style={inputStyle} value={nutritionForm.calories} onChange={e => setNutritionForm({ ...nutritionForm, calories: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Protein (g)</label>
                <input type="number" placeholder="150" style={inputStyle} value={nutritionForm.protein} onChange={e => setNutritionForm({ ...nutritionForm, protein: e.target.value })} required />
              </div>
              <button type="submit" style={{ background: 'var(--acc)', color: 'var(--fg)', border: 'none', padding: '0.85rem', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Log nutrition →</button>
            </motion.form>
          )}
        </div>

        <div style={{ padding: '2rem' }}>
          {activeTab === 'weight' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '1.5rem' }}>Bodyweight over time</div>
              {weightLog.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', padding: '3rem 0' }}>No entries yet — log your first weigh-in.</div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                      { label: 'Starting', value: `${weightLog[0]?.weight} kg` },
                      { label: 'Current', value: `${weightLog[weightLog.length - 1]?.weight} kg` },
                      { label: 'Change', value: `${(parseFloat(weightLog[weightLog.length - 1]?.weight) - parseFloat(weightLog[0]?.weight)).toFixed(1)} kg` }
                    ].map((s, i) => (
                      <div key={i} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--border)' }}>
                        <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: '0.4rem' }}>{s.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: i === 2 ? 'var(--acc)' : 'var(--fg)' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ position: 'relative', height: 200, marginBottom: '1rem' }}>
                    <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(weightLog.length * 60, 400)} 200`} preserveAspectRatio="none">
                      <polyline
                        fill="none" stroke="var(--acc)" strokeWidth="2"
                        points={weightLog.map((w, i) => `${i * 60 + 30},${180 - ((parseFloat(w.weight) - minWeight) / weightRange) * 150}`).join(' ')}
                      />
                      {weightLog.map((w, i) => (
                        <g key={i}>
                          <circle cx={i * 60 + 30} cy={180 - ((parseFloat(w.weight) - minWeight) / weightRange) * 150} r="4" fill="var(--acc)" />
                          <text x={i * 60 + 30} y="198" textAnchor="middle" fill="rgba(240,237,232,0.3)" fontSize="9">{w.date?.slice(5)}</text>
                          <text x={i * 60 + 30} y={170 - ((parseFloat(w.weight) - minWeight) / weightRange) * 150} textAnchor="middle" fill="rgba(240,237,232,0.6)" fontSize="10">{w.weight}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'workout' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '1.5rem' }}>Workout log</div>
              {workoutLog.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', padding: '3rem 0' }}>No workouts logged yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px', background: 'var(--border)' }}>
                  {[...workoutLog].reverse().map((w, i) => (
                    <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 60px 60px 70px', gap: '1rem', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--bg)' }}>
                      <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{w.date}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{w.exercise}</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--acc)' }}>{w.sets}</div>
                        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-dim)' }}>sets</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 900 }}>{w.reps}</div>
                        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-dim)' }}>reps</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 900 }}>{w.weight}</div>
                        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-dim)' }}>kg</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '1.5rem' }}>Nutrition log</div>
              {nutritionLog.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', padding: '3rem 0' }}>No nutrition logged yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px', background: 'var(--border)' }}>
                  {[...nutritionLog].reverse().map((n, i) => (
                    <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '1rem', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--bg)' }}>
                      <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{n.date}</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--acc)' }}>{n.calories}</div>
                        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-dim)' }}>calories</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 900 }}>{n.protein}g</div>
                        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-dim)' }}>protein</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tracker;