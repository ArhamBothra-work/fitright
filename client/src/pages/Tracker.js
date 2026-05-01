import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API = 'https://fitright-server.onrender.com/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return { headers: { Authorization: `Bearer ${token}` } };
}

export default function Tracker() {
  const [activeTab, setActiveTab] = useState('workout');
  const [weightLog, setWeightLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  
  // High-performance Exercise Preset List
  const [exercises, setExercises] = useState([
    "Barbell Bench Press", "Smith Machine Inclined Bench Press", 
    "Incline Dumbbell Press", "Overhead Press", "Barbell Row", 
    "Lat Pulldown", "Tricep Cable Pushdown", "Lateral Cable Raise", 
    "Peck Deck", "Rear Delt Machine Fly", "Bent Over Wide Grip Row",
    "Cable Curl", "Romanian Deadlift", "Squats"
  ]);

  const [isCustomExercise, setIsCustomExercise] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');
  
  const [weightForm, setWeightForm] = useState({ date: '', weight: '' });
  const [workoutForm, setWorkoutForm] = useState({ 
    exercise: 'Barbell Bench Press', reps: '', weight: '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [trackerDate, setTrackerDate] = useState(new Date());

  const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchAllLogs();
  }, [trackerDate]);

  const fetchAllLogs = async () => {
    try {
      const [w, wo] = await Promise.all([
        axios.get(`${API}/logs/weight`, authHeaders()),
        axios.get(`${API}/logs/workout`, authHeaders()),
      ]);
      setWeightLog(w.data || []);
      setWorkoutLog(wo.data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const changeDateByAmount = (daysAmount) => {
    const newDate = new Date(trackerDate);
    newDate.setDate(newDate.getDate() + daysAmount);
    setTrackerDate(newDate);
  };

  // Safe matching helper to compare exact date strings
  const currentViewDateStr = getLocalDateString(trackerDate);
  const todaysWorkouts = workoutLog.filter(w => w.date === currentViewDateStr);

  const groupedWorkouts = todaysWorkouts.reduce((acc, current) => {
    if (!acc[current.exercise]) acc[current.exercise] = [];
    acc[current.exercise].push(current);
    return acc;
  }, {});

  const saveWeight = async (e) => {
    e.preventDefault();
    if (!weightForm.weight) return;
    setLoading(true);
    try {
      const payload = {
        date: currentViewDateStr,
        weight: weightForm.weight
      };
      const res = await axios.post(`${API}/logs/weight`, payload, authHeaders());
      setWeightLog(prev => [...prev, res.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setWeightForm(prev => ({ ...prev, weight: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkout = async (e) => {
    e.preventDefault();
    const finalExerciseName = isCustomExercise ? customExerciseName : workoutForm.exercise;
    if (!finalExerciseName || !workoutForm.reps || !workoutForm.weight) return;

    // Calculate current set automatically (Next logical ascending number)
    const existingSets = groupedWorkouts[finalExerciseName] || [];
    const nextSetNumber = existingSets.length + 1;

    setLoading(true);
    try {
      const payload = {
        date: currentViewDateStr,
        exercise: finalExerciseName,
        sets: nextSetNumber,
        reps: workoutForm.reps,
        weight: workoutForm.weight
      };
      const res = await axios.post(`${API}/logs/workout`, payload, authHeaders());
      setWorkoutLog(prev => [...prev, res.data]);

      if (isCustomExercise && !exercises.includes(finalExerciseName)) {
        setExercises(prev => [...prev, finalExerciseName].sort());
      }

      setWorkoutForm(prev => ({
        ...prev,
        exercise: finalExerciseName,
        reps: '',
        weight: ''
      }));
      setIsCustomExercise(false);
      setCustomExerciseName('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ffffff',
    padding: '0.85rem 1rem',
    fontSize: 14,
    outline: 'none',
    width: '100%'
  };

  const labelStyle = {
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: '0.5rem',
    fontFamily: "'Space Mono', monospace"
  };

  const minW = weightLog.length ? Math.min(...weightLog.map(w => parseFloat(w.weight))) : 0;
  const maxW = weightLog.length ? Math.max(...weightLog.map(w => parseFloat(w.weight))) : 100;
  const range = maxW - minW || 1;

  return (
    <div className="page" style={{ background: '#070707', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      {/* Header Day Navigation Widget */}
      <section style={{ padding: '3rem 2.5rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', background: '#0d0d0d' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button onClick={() => changeDateByAmount(-1)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', width: '42px', height: '42px', borderRadius: '4px', color: '#ffffff', cursor: 'pointer' }}>◀</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--acc)', fontFamily: "'Space Mono', monospace", marginBottom: '0.25rem' }}>Log Selection</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1 }}>
                {trackerDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </h2>
            </div>
            <button onClick={() => changeDateByAmount(1)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', width: '42px', height: '42px', borderRadius: '4px', color: '#ffffff', cursor: 'pointer' }}>▶</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: '#080808', padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <button onClick={() => setActiveTab('workout')} style={{ padding: '0.75rem 1.5rem', background: activeTab === 'workout' ? 'var(--acc)' : 'transparent', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Workouts</button>
            <button onClick={() => setActiveTab('weight')} style={{ padding: '0.75rem 1.5rem', background: activeTab === 'weight' ? 'var(--acc)' : 'transparent', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>Weight</button>
          </div>

        </div>
      </section>

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', minHeight: 'calc(100vh - 300px)' }}>
        
        {/* User Interactive Logging Form */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.12)', padding: '2.5rem 2rem', background: '#070707' }}>
          {activeTab === 'weight' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={saveWeight} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ffffff' }}>Add Weight Entry</div>
              <div>
                <label style={labelStyle}>Weight Measurement (kg)</label>
                <input type="number" step="0.1" placeholder="78.5" value={weightForm.weight} onChange={e => setWeightForm({ ...weightForm, weight: e.target.value })} required style={inputStyle} />
              </div>
              <button type="submit" disabled={loading} style={{ background: 'var(--acc)', color: '#ffffff', border: 'none', padding: '1.1rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Space Mono', monospace" }}>
                {loading ? 'Saving...' : 'Confirm Record →'}
              </button>
            </motion.form>
          )}

          {activeTab === 'workout' && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={saveWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ffffff' }}>Add Single Set</div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Exercise</label>
                  <button type="button" onClick={() => setIsCustomExercise(!isCustomExercise)} style={{ background: 'transparent', border: 'none', color: 'var(--acc)', cursor: 'pointer', fontSize: 10, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}>
                    {isCustomExercise ? 'Back to select' : '+ Add custom'}
                  </button>
                </div>

                {isCustomExercise ? (
                  <input type="text" placeholder="e.g. Incline Bench" value={customExerciseName} onChange={e => setCustomExerciseName(e.target.value)} required style={inputStyle} />
                ) : (
                  <select style={inputStyle} value={workoutForm.exercise} onChange={e => setWorkoutForm({ ...workoutForm, exercise: e.target.value })}>
                    {exercises.map((ex, idx) => (
                      <option key={idx} value={ex} style={{ background: '#111111', color: '#ffffff' }}>{ex}</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Reps</label>
                  <input type="number" placeholder="8" value={workoutForm.reps} onChange={e => setWorkoutForm({ ...workoutForm, reps: e.target.value })} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Load (kg)</label>
                  <input type="number" step="0.5" placeholder="85.0" value={workoutForm.weight} onChange={e => setWorkoutForm({ ...workoutForm, weight: e.target.value })} required style={inputStyle} />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ background: 'var(--acc)', color: '#ffffff', border: 'none', padding: '1.1rem', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Space Mono', monospace" }}>
                {loading ? 'Adding...' : 'Register Set →'}
              </button>
            </motion.form>
          )}
        </div>

        {/* Dynamic Activity Log Window */}
        <div style={{ padding: '2.5rem', background: '#080808' }}>
          {activeTab === 'weight' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '1.5rem' }}>Metrics Graph</div>
              
              {weightLog.length === 0 ? (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: '2rem 0' }}>No recordings found in memory.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                      { label: 'Starting', value: `${weightLog[0]?.weight} kg` },
                      { label: 'Current', value: `${weightLog[weightLog.length - 1]?.weight} kg` },
                      { label: 'Net Difference', value: `${(parseFloat(weightLog[weightLog.length - 1]?.weight) - parseFloat(weightLog[0]?.weight)).toFixed(1)} kg` }
                    ].map((s, idx) => (
                      <div key={idx} style={{ flex: 1, padding: '1.25rem', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px' }}>
                        <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', fontFamily: "'Space Mono', monospace" }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.5px' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weight Chart */}
                  <div style={{ position: 'relative', height: 240, background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.12)', padding: '1.25rem', borderRadius: '4px' }}>
                    <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(weightLog.length * 65, 500)} 200`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--acc)" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="var(--acc)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#chartGrad)" d={
                        `M 30, 200 ` +
                        weightLog.map((w, i) => `L ${i * 65 + 30}, ${170 - ((parseFloat(w.weight) - minW) / range) * 130}`).join(' ') +
                        ` L ${(weightLog.length - 1) * 65 + 30}, 200 Z`
                      } />
                      <polyline fill="none" stroke="var(--acc)" strokeWidth="2.5" points={weightLog.map((w, i) => `${i * 65 + 30},${170 - ((parseFloat(w.weight) - minW) / range) * 130}`).join(' ')} />
                      {weightLog.map((w, i) => (
                        <g key={i}>
                          <circle cx={i * 65 + 30} cy={170 - ((parseFloat(w.weight) - minW) / range) * 130} r="5" fill="var(--acc)" stroke="#0d0d0d" strokeWidth="1.5" />
                          <text x={i * 65 + 30} y="195" textAnchor="middle" fill="rgba(255, 255, 255, 0.4)" fontSize="9" fontFamily="Space Mono">{w.date?.slice(5)}</text>
                          <text x={i * 65 + 30} y={154 - ((parseFloat(w.weight) - minW) / range) * 130} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="Space Mono">{w.weight}</text>
                        </g>
                      ))}
                    </svg>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'workout' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '1.5rem' }}>Session Activities</div>
              {Object.keys(groupedWorkouts).length === 0 ? (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: '2rem 0', fontFamily: "'Space Mono', monospace" }}>No data points logged for this day.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {Object.entries(groupedWorkouts).map(([exerciseName, setsList], idx) => {
                    // Critical: Sort the list in ascending order so Set 1 always outputs before Set 2
                    const orderedSets = [...setsList].sort((a, b) => parseInt(a.sets) - parseInt(b.sets));
                    
                    return (
                      <div key={idx} style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.12)', padding: '1.5rem', borderRadius: '4px' }}>
                        
                        <div style={{ borderBottom: '1.5px solid var(--acc)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#ffffff' }}>{exerciseName}</h3>
                          <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{orderedSets.length} sets logged</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {orderedSets.map((setEntry, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'var(--acc)', fontWeight: 700 }}>SET {setEntry.sets}</span>
                              <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <span style={{ fontSize: 15, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.5px' }}>
                                  <span style={{ color: '#ffffff' }}>{setEntry.weight}</span> <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>KGS</span>
                                </span>
                                <span style={{ fontSize: 15, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.5px' }}>
                                  <span style={{ color: '#ffffff' }}>{setEntry.reps}</span> <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>REPS</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}