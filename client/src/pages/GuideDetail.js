import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const guideContent = {
  'calories-explained': {
    category: 'Nutrition',
    title: 'Calories explained',
    sub: 'What they are and why they matter',
    sections: [
      { heading: 'What is a calorie?', body: 'A calorie is simply a unit of energy. Your body needs energy to function — to breathe, think, move, pump blood. That energy comes from the food you eat. When people talk about "burning calories", they mean using up that stored energy.' },
      { heading: 'Why calories matter for body composition', body: 'Your body weight is fundamentally determined by energy balance. If you eat more calories than your body uses, the excess is stored — primarily as fat. If you eat fewer calories than your body uses, it pulls from stored energy — again, primarily fat. This is the law of thermodynamics and it applies to every human body without exception.' },
      { heading: 'What is a calorie deficit?', body: 'A calorie deficit means consuming fewer calories than your body burns in a day. For example, if your body burns 2500 calories daily and you eat 2000, you are in a 500 calorie deficit. Over time, this deficit causes fat loss. A deficit of around 300-500 calories per day is considered sustainable and effective for most people.' },
      { heading: 'Common misconception', body: 'Many people believe certain foods are "fattening" while others are "safe." The truth is no single food causes fat gain — only a sustained calorie surplus does. You can gain fat eating salad if you eat enough of it. You can lose fat eating pizza if you stay in a deficit. Food quality matters for health and performance, but calories determine body weight.' },
      { heading: 'How to find your calorie needs', body: 'Your Total Daily Energy Expenditure (TDEE) is the number of calories your body burns in a day including activity. You can estimate it using your height, weight, age, and activity level. Most adults fall between 1800–3000 calories per day. Eating above this = weight gain. Below = weight loss. At this = maintenance.' },
    ]
  },
  'protein-guide': {
    category: 'Nutrition',
    title: 'The protein guide',
    sub: 'How much, when, and why',
    sections: [
      { heading: 'Why protein is the most important macro', body: 'Protein is the building block of muscle tissue. When you train, you create microscopic damage in your muscle fibers. Protein provides the amino acids your body uses to repair and grow those fibers back stronger. Without sufficient protein, muscle growth stalls regardless of how hard you train.' },
      { heading: 'How much protein do you need?', body: 'The research is clear — for people who train, 1.6 to 2.2 grams of protein per kilogram of bodyweight per day is the optimal range. For a 70kg person, that means 112–154g of protein daily. If you are in a calorie deficit trying to lose fat, staying at the higher end (2.2g/kg) helps preserve muscle mass.' },
      { heading: 'Does protein timing matter?', body: 'Protein timing is far less important than total daily intake. Getting enough protein across the day is what matters most. That said, having protein around your workout — within a few hours before or after — is a good habit and may offer a small additional benefit for muscle protein synthesis.' },
      { heading: 'Best protein sources', body: 'Complete protein sources contain all essential amino acids. These include eggs, chicken, fish, beef, dairy, and for vegetarians — paneer, Greek yogurt, legumes combined with grains, and soy products. Protein supplements like whey are simply convenient food sources, not magic — they count toward your daily total just like any food.' },
    ]
  },
  'progressive-overload': {
    category: 'Training',
    title: 'Progressive overload',
    sub: 'The single most important training concept',
    sections: [
      { heading: 'What is progressive overload?', body: 'Progressive overload is the gradual increase of stress placed on your muscles over time. Your body adapts to whatever demand you place on it. If you always lift the same weight for the same reps, your body has no reason to change. To keep growing stronger and building muscle, you must continuously challenge your body beyond what it is already adapted to.' },
      { heading: 'How to apply it', body: 'The simplest form is adding weight to the bar over time. If you bench pressed 60kg last week, try 62.5kg this week. If you cannot add weight, add a rep. If you cannot add a rep, improve your form. Every session should have some form of progression — more weight, more reps, better technique, shorter rest periods, or more total volume.' },
      { heading: 'Why most people stop progressing', body: 'Most gym-goers plateau because they do the same workout with the same weight every session. Without a progressive stimulus, the body has no reason to adapt further. Tracking your lifts is essential — if you are not writing down your weights and reps, you are almost certainly not progressing as fast as you could be.' },
      { heading: 'Progressive overload and beginners', body: 'Beginners can progress very rapidly — often adding weight every single session for several months. This is called beginner gains and is driven by neural adaptations, not just muscle growth. Take advantage of this window by training consistently and eating enough protein. Progress will slow over time, but that is normal and expected.' },
    ]
  },
  'cardio-myth': {
    category: 'Myth Busting',
    title: 'Cardio doesn\'t burn fat',
    sub: 'What actually causes fat loss',
    sections: [
      { heading: 'The myth', body: 'A huge number of people believe that doing cardio is what burns fat — that running on a treadmill directly melts fat off your body. This leads to hours of steady-state cardio with little results, and a lot of frustration.' },
      { heading: 'What actually causes fat loss', body: 'Fat loss is caused by a calorie deficit — consuming fewer calories than your body burns. Cardio can contribute to that deficit by burning additional calories, but it is not the mechanism itself. You could do zero cardio and lose fat perfectly well by eating less. Cardio is a tool, not the cause.' },
      { heading: 'Why cardio alone fails most people', body: 'When people do cardio to lose fat without managing their diet, they often compensate by eating more — either consciously or unconsciously. A 45-minute run might burn 350 calories, which is undone by a single snack. This is why "I run every day but can\'t lose weight" is such a common experience. The diet is the issue, not the cardio.' },
      { heading: 'The actual role of cardio', body: 'Cardio is excellent for cardiovascular health, endurance, mood, and it does increase your daily calorie burn. Used alongside a calorie deficit, it accelerates fat loss. But it should be viewed as a supplement to your diet strategy, not a replacement for it. Resistance training combined with a mild calorie deficit is often more effective for body composition than cardio alone.' },
    ]
  },
  'workout-splits': {
    category: 'Training',
    title: 'Workout splits explained',
    sub: 'PPL, Upper/Lower, Full body — which is best',
    sections: [
      { heading: 'What is a workout split?', body: 'A workout split is how you divide your training across the week. Different splits train different muscle groups on different days, allowing for recovery while maintaining training frequency.' },
      { heading: 'Push Pull Legs (PPL)', body: 'One of the most popular splits. Push days train chest, shoulders, triceps. Pull days train back and biceps. Leg days train quads, hamstrings, glutes, calves. Run 3 or 6 days a week. Excellent for intermediate to advanced lifters who can handle higher volume.' },
      { heading: 'Upper / Lower split', body: 'Four days a week — two upper body sessions, two lower body sessions. Great balance of frequency and recovery. Each muscle group gets trained twice a week which is optimal for hypertrophy. Good for beginners and intermediates.' },
      { heading: 'Full body training', body: 'Train every major muscle group every session, typically 3 days a week. Best for beginners because the high frequency of hitting each muscle (3x per week) accelerates early progress. Also good for people with limited gym days.' },
      { heading: 'Which is best?', body: 'The best split is the one you can follow consistently. All well-designed splits produce results. What matters more is progressive overload, sufficient volume per muscle group per week, and recovery. If you are a beginner, start with full body or upper/lower. Intermediate and beyond, PPL or upper/lower works very well.' },
    ]
  }
};

const fallbackGuide = {
  category: 'Guide',
  title: 'Coming soon',
  sub: 'This guide is being written',
  sections: [
    { heading: 'Under construction', body: 'This guide is currently being written. Check back soon — we are building out the full curriculum.' }
  ]
};

function GuideDetail() {
  const { id } = useParams();
  const guide = guideContent[id] || fallbackGuide;

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
              <button style={{
                width: '100%', marginTop: '1.5rem', background: 'transparent',
                color: 'var(--fg-dim)', border: '0.5px solid var(--border)',
                padding: '0.75rem', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase'
              }}>← All guides</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideDetail;