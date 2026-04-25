require('dotenv').config();
const mongoose = require('mongoose');
const Guide = require('./models/Guide');
const Plan = require('./models/Plan');

const guides = [
  {
    slug: 'calories-explained',
    category: 'Nutrition',
    title: 'Calories explained',
    sub: 'What they are and why they matter',
    sections: [
      { heading: 'What is a calorie?', body: 'A calorie is simply a unit of energy. Your body needs energy to function — to breathe, think, move, pump blood. That energy comes from the food you eat. When people talk about burning calories, they mean using up that stored energy.' },
      { heading: 'Why calories matter for body composition', body: 'Your body weight is fundamentally determined by energy balance. If you eat more calories than your body uses, the excess is stored as fat. If you eat fewer calories than your body uses, it pulls from stored energy. This is the law of thermodynamics and it applies to every human body without exception.' },
      { heading: 'What is a calorie deficit?', body: 'A calorie deficit means consuming fewer calories than your body burns in a day. A deficit of around 300-500 calories per day is considered sustainable and effective for most people.' },
      { heading: 'Common misconception', body: 'No single food causes fat gain — only a sustained calorie surplus does. You can gain fat eating salad if you eat enough of it. You can lose fat eating pizza if you stay in a deficit. Food quality matters for health, but calories determine body weight.' },
    ]
  },
  {
    slug: 'protein-guide',
    category: 'Nutrition',
    title: 'The protein guide',
    sub: 'How much, when, and why',
    sections: [
      { heading: 'Why protein is the most important macro', body: 'Protein is the building block of muscle tissue. When you train, you create microscopic damage in your muscle fibers. Protein provides the amino acids your body uses to repair and grow those fibers back stronger.' },
      { heading: 'How much protein do you need?', body: 'For people who train, 1.6 to 2.2 grams of protein per kilogram of bodyweight per day is optimal. For a 70kg person, that means 112–154g of protein daily.' },
      { heading: 'Does protein timing matter?', body: 'Protein timing is far less important than total daily intake. Getting enough protein across the day is what matters most.' },
      { heading: 'Best protein sources', body: 'Complete protein sources include eggs, chicken, fish, beef, dairy, Greek yogurt, paneer, and soy products. Protein supplements like whey are simply convenient food sources — they count toward your daily total just like any food.' },
    ]
  },
  {
    slug: 'macros-101',
    category: 'Nutrition',
    title: 'Macros 101',
    sub: 'Carbs, fats, protein broken down',
    sections: [
      { heading: 'What are macros?', body: 'Macronutrients are the three main categories of nutrients that provide calories: protein, carbohydrates, and fats. Every food you eat is made up of some combination of these three.' },
      { heading: 'Protein', body: 'Protein provides 4 calories per gram. It is essential for muscle repair, immune function, and enzyme production. For body composition, it is the most important macro to get right.' },
      { heading: 'Carbohydrates', body: 'Carbs provide 4 calories per gram. They are your body\'s preferred energy source, especially for high-intensity exercise. They are not the enemy — overconsumption is.' },
      { heading: 'Fats', body: 'Fats provide 9 calories per gram. They are essential for hormone production, brain function, and absorbing fat-soluble vitamins. Do not eliminate fats from your diet.' },
    ]
  },
  {
    slug: 'fat-loss-diet',
    category: 'Nutrition',
    title: 'Fat loss nutrition',
    sub: 'Eating in a deficit the right way',
    sections: [
      { heading: 'The only way to lose fat', body: 'Fat loss requires a calorie deficit — consuming fewer calories than you burn. There is no diet that bypasses this. Keto, intermittent fasting, low carb — these work only when they help you eat less.' },
      { heading: 'How big should your deficit be?', body: 'A deficit of 300-500 calories per day produces steady, sustainable fat loss of roughly 0.3-0.5kg per week. Larger deficits cause faster weight loss but risk muscle loss and are harder to maintain.' },
      { heading: 'Protein while cutting', body: 'Eating high protein during a deficit is critical. It preserves muscle mass, keeps you fuller for longer, and has the highest thermic effect of any macro — meaning your body burns more calories digesting it.' },
      { heading: 'What to eat', body: 'Focus on high-volume, low-calorie foods: vegetables, lean proteins, fruits. These fill you up without blowing your calorie budget. You do not need to eliminate any food — just fit it into your target.' },
    ]
  },
  {
    slug: 'progressive-overload',
    category: 'Training',
    title: 'Progressive overload',
    sub: 'The single most important training concept',
    sections: [
      { heading: 'What is progressive overload?', body: 'Progressive overload is the gradual increase of stress placed on your muscles over time. If you always lift the same weight for the same reps, your body has no reason to change.' },
      { heading: 'How to apply it', body: 'The simplest form is adding weight to the bar over time. If you cannot add weight, add a rep. If you cannot add a rep, improve your form. Every session should have some form of progression.' },
      { heading: 'Why most people stop progressing', body: 'Most gym-goers plateau because they do the same workout with the same weight every session. Tracking your lifts is essential — if you are not writing down your weights and reps, you are almost certainly not progressing.' },
      { heading: 'Progressive overload and beginners', body: 'Beginners can progress very rapidly — often adding weight every single session for several months. Take advantage of this window by training consistently and eating enough protein.' },
    ]
  },
  {
    slug: 'workout-splits',
    category: 'Training',
    title: 'Workout splits explained',
    sub: 'PPL, Upper/Lower, Full body — which is best',
    sections: [
      { heading: 'What is a workout split?', body: 'A workout split is how you divide your training across the week, allowing for recovery while maintaining training frequency.' },
      { heading: 'Push Pull Legs', body: 'Push days train chest, shoulders, triceps. Pull days train back and biceps. Leg days train quads, hamstrings, glutes, calves. Excellent for intermediate to advanced lifters.' },
      { heading: 'Upper / Lower split', body: 'Four days a week — two upper body sessions, two lower body sessions. Each muscle group gets trained twice a week which is optimal for hypertrophy.' },
      { heading: 'Full body training', body: 'Train every major muscle group every session, typically 3 days a week. Best for beginners because the high frequency accelerates early progress.' },
      { heading: 'Which is best?', body: 'The best split is the one you can follow consistently. What matters more is progressive overload, sufficient volume, and recovery.' },
    ]
  },
  {
    slug: 'compound-movements',
    category: 'Training',
    title: 'Compound movements',
    sub: 'The big lifts and why they matter',
    sections: [
      { heading: 'What are compound movements?', body: 'Compound movements are exercises that engage multiple muscle groups and joints simultaneously. Examples include squats, deadlifts, bench press, overhead press, and rows.' },
      { heading: 'Why they should be your foundation', body: 'Compound lifts stimulate more muscle mass per exercise, allow you to lift heavier weights, produce more hormonal response, and give you more bang for your time in the gym.' },
      { heading: 'The big 5', body: 'Squat, deadlift, bench press, overhead press, and barbell row. Master these movements with proper form and progressive overload and you will build a strong, muscular physique.' },
      { heading: 'Where isolations fit in', body: 'Isolation exercises like curls, lateral raises, and leg extensions have their place — but as accessories to your compound work, not the foundation of your program.' },
    ]
  },
  {
    slug: 'recovery-guide',
    category: 'Training',
    title: 'Recovery & rest',
    sub: 'Why rest days are part of the plan',
    sections: [
      { heading: 'You grow outside the gym', body: 'Training is the stimulus. Recovery is when adaptation actually happens. Without adequate recovery, you are breaking your body down without giving it the chance to rebuild.' },
      { heading: 'How many rest days do you need?', body: 'Most programs include 2-3 rest days per week. Active recovery — light walking, stretching — is better than complete inactivity on these days.' },
      { heading: 'Signs of overtraining', body: 'Persistent soreness, declining performance, poor sleep, irritability, and loss of motivation are all signs you need more recovery. More is not always better.' },
      { heading: 'Sleep is the most important recovery tool', body: 'During sleep, growth hormone is released and muscle protein synthesis is elevated. 7-9 hours per night is non-negotiable for serious progress.' },
    ]
  },
  {
    slug: 'cardio-myth',
    category: 'Myth Busting',
    title: 'Cardio burns fat — myth',
    sub: 'What actually causes fat loss',
    sections: [
      { heading: 'The myth', body: 'Many people believe cardio directly burns fat — that running on a treadmill melts fat off your body. This leads to hours of cardio with little results.' },
      { heading: 'What actually causes fat loss', body: 'Fat loss is caused by a calorie deficit. Cardio can contribute to that deficit, but it is not the mechanism. You could do zero cardio and lose fat perfectly by eating less.' },
      { heading: 'Why cardio alone fails', body: 'When people do cardio without managing diet, they often compensate by eating more. A 45-minute run might burn 350 calories, undone by a single snack.' },
      { heading: 'The actual role of cardio', body: 'Cardio is excellent for cardiovascular health and it does increase calorie burn. Used alongside a calorie deficit, it accelerates fat loss. But it supplements your diet strategy, not replaces it.' },
    ]
  },
  {
    slug: 'lifting-myth',
    category: 'Myth Busting',
    title: 'Lifting makes you bulky — myth',
    sub: 'Why this is completely wrong',
    sections: [
      { heading: 'The myth', body: 'Many people — especially women — avoid lifting weights out of fear of becoming bulky or masculine looking. This fear is based on a fundamental misunderstanding of how muscle building works.' },
      { heading: 'Why it is impossible to accidentally bulk up', body: 'Building significant muscle mass requires years of consistent training, a calorie surplus, and in men — high testosterone levels. It does not happen by accident or quickly.' },
      { heading: 'What lifting actually does', body: 'Resistance training increases muscle tone, improves body composition, boosts metabolism, strengthens bones, and creates the lean athletic physique most people actually want.' },
      { heading: 'The evidence', body: 'The physiques people fear from lifting are the result of years of dedicated effort, specific diets, and in many cases — performance enhancing drugs. You will not wake up bulky from lifting weights three times a week.' },
    ]
  },
  {
    slug: 'spot-reduction',
    category: 'Myth Busting',
    title: 'Spot reduction is fake',
    sub: 'You cannot choose where fat comes from',
    sections: [
      { heading: 'The myth', body: 'Spot reduction is the idea that you can burn fat from a specific body part by exercising that area — for example, doing crunches to lose belly fat.' },
      { heading: 'Why it does not work', body: 'Fat loss is systemic, not local. When you are in a calorie deficit, your body pulls fat from stores throughout your entire body based on genetics and hormones — not from the muscles you are currently working.' },
      { heading: 'What crunches actually do', body: 'Crunches build the abdominal muscles underneath the fat. They do not burn the fat above them. You cannot see defined abs until your overall body fat is low enough — which requires a calorie deficit, not more crunches.' },
      { heading: 'What to do instead', body: 'Focus on creating a calorie deficit through diet and full-body training. As you lose fat overall, it will come off from every area of your body, including the areas you want.' },
    ]
  },
  {
    slug: 'starvation-mode',
    category: 'Myth Busting',
    title: 'Starvation mode — myth',
    sub: 'The truth about extreme deficits',
    sections: [
      { heading: 'The myth', body: 'Starvation mode is the belief that eating too little causes your metabolism to shut down so completely that you stop losing weight or even gain fat. People use this to justify not tracking calories.' },
      { heading: 'What adaptive thermogenesis actually is', body: 'Your metabolism does slow somewhat in a large deficit — this is called adaptive thermogenesis. But it is not enough to stop fat loss entirely. You cannot gain fat in a true calorie deficit.' },
      { heading: 'Why the scale sometimes stops moving', body: 'When weight loss stalls, the usual cause is inaccurate calorie tracking, increased water retention, or gradual deficit erosion as you lose weight and your TDEE decreases.' },
      { heading: 'The real problem with extreme deficits', body: 'Very low calorie diets are unsustainable, cause muscle loss, lead to nutrient deficiencies, and are mentally brutal. Moderate deficits of 300-500 calories work better long term — not because of starvation mode, but because you can actually stick to them.' },
    ]
  },
  {
    slug: 'sleep-gains',
    category: 'Recovery',
    title: 'Sleep and muscle growth',
    sub: 'Why 8 hours is non-negotiable',
    sections: [
      { heading: 'What happens during sleep', body: 'During deep sleep, your body releases growth hormone, elevates muscle protein synthesis, repairs damaged tissue, and consolidates motor patterns from your training. Sleep is when you actually get stronger.' },
      { heading: 'How much sleep do you need?', body: 'Most adults need 7-9 hours of quality sleep per night for optimal recovery and muscle growth. Consistently getting less than 6 hours significantly impairs both performance and body composition.' },
      { heading: 'Sleep deprivation and body composition', body: 'Studies show that sleep deprivation increases cortisol, reduces testosterone, increases hunger hormones, and causes a greater proportion of weight loss to come from muscle rather than fat.' },
      { heading: 'Improving sleep quality', body: 'Keep a consistent sleep schedule, avoid screens before bed, keep your room cool and dark, avoid caffeine after 2pm, and avoid alcohol — which fragments sleep architecture even if it helps you fall asleep faster.' },
    ]
  },
  {
    slug: 'supplements-basics',
    category: 'Recovery',
    title: 'Supplements basics',
    sub: 'What actually works and what does not',
    sections: [
      { heading: 'The supplement industry', body: 'The supplement industry is worth billions and largely unregulated. Most products are overpriced, ineffective, and unnecessary if your diet and training are solid.' },
      { heading: 'What actually works', body: 'Creatine monohydrate is the most researched supplement in history — it reliably increases strength and muscle mass. Protein powder is just food in convenient form. Caffeine improves performance. Vitamin D and omega-3s benefit most people who are deficient.' },
      { heading: 'What does not work', body: 'Fat burners, testosterone boosters, BCAAs (if you already hit protein targets), most pre-workouts beyond caffeine, and the vast majority of proprietary blends are either ineffective or marginally beneficial at best.' },
      { heading: 'The right order of priorities', body: 'Sort your diet first. Then your training. Then your sleep. Then consider basic supplements. Not the other way around.' },
    ]
  },
  {
    slug: 'deload-week',
    category: 'Recovery',
    title: 'Deload weeks',
    sub: 'When and why to train less',
    sections: [
      { heading: 'What is a deload?', body: 'A deload is a planned period of reduced training volume and/or intensity, typically lasting one week. It allows accumulated fatigue to dissipate so you can come back and train harder.' },
      { heading: 'Why deloads work', body: 'Fatigue masks fitness. When you are deeply fatigued, your performance suffers even if your actual fitness has improved. Removing the fatigue allows your true capabilities to express themselves.' },
      { heading: 'When to deload', body: 'Every 4-8 weeks of hard training, or whenever you notice persistent soreness, declining performance, low motivation, or disrupted sleep. Listen to your body.' },
      { heading: 'How to deload', body: 'Reduce training volume by 40-60% while keeping intensity similar. Keep lifting heavy but do fewer sets. Stay active but give your body the break it needs.' },
    ]
  },
  {
    slug: 'stress-cortisol',
    category: 'Recovery',
    title: 'Stress and cortisol',
    sub: 'How stress kills your progress',
    sections: [
      { heading: 'What is cortisol?', body: 'Cortisol is a stress hormone released by your adrenal glands in response to physical and psychological stress. In the short term it is helpful — it mobilizes energy and keeps you alert.' },
      { heading: 'Chronic stress and body composition', body: 'Chronically elevated cortisol promotes fat storage especially around the abdomen, breaks down muscle tissue, disrupts sleep, increases hunger and cravings for high-calorie foods, and impairs recovery.' },
      { heading: 'Sources of stress that hurt your progress', body: 'Sleep deprivation, extreme calorie deficits, overtraining, work stress, relationship stress, and anxiety all elevate cortisol and work against your body composition goals.' },
      { heading: 'Managing stress', body: 'Adequate sleep, moderate training loads, sufficient calorie intake, regular low-intensity movement like walking, and stress management practices all help keep cortisol in a healthy range.' },
    ]
  },
];

const plans = [
  {
    goal: 'fat_loss', level: 'Beginner', title: 'Fat Loss Starter',
    days: 3, desc: 'A simple 3-day full body plan focused on building the habit and burning calories.', split: 'Full Body',
    schedule: [
      { day: 'Day 1', focus: 'Full Body A', exercises: [
        { name: 'Squat', sets: '3', reps: '10', muscles: ['quads', 'glutes'] },
        { name: 'Bench Press', sets: '3', reps: '10', muscles: ['chest', 'shoulders'] },
        { name: 'Bent Over Row', sets: '3', reps: '10', muscles: ['back', 'biceps'] },
        { name: 'Plank', sets: '3', reps: '30s', muscles: ['core'] },
      ]},
      { day: 'Day 2', focus: 'Full Body B', exercises: [
        { name: 'Romanian Deadlift', sets: '3', reps: '10', muscles: ['hamstrings', 'glutes'] },
        { name: 'Overhead Press', sets: '3', reps: '10', muscles: ['shoulders'] },
        { name: 'Lat Pulldown', sets: '3', reps: '10', muscles: ['back', 'biceps'] },
        { name: 'Leg Raises', sets: '3', reps: '12', muscles: ['core'] },
      ]},
      { day: 'Day 3', focus: 'Full Body C', exercises: [
        { name: 'Leg Press', sets: '4', reps: '12', muscles: ['quads', 'glutes'] },
        { name: 'Incline Dumbbell Press', sets: '3', reps: '10', muscles: ['chest', 'shoulders'] },
        { name: 'Cable Row', sets: '3', reps: '10', muscles: ['back'] },
        { name: 'Dumbbell Curl', sets: '2', reps: '12', muscles: ['biceps'] },
      ]},
    ]
  },
  {
    goal: 'muscle_gain', level: 'Intermediate', title: 'Push Pull Legs',
    days: 6, desc: 'The classic PPL split for maximum muscle gain. Each muscle hit twice a week.', split: 'Push Pull Legs',
    schedule: [
      { day: 'Day 1', focus: 'Push', exercises: [
        { name: 'Bench Press', sets: '4', reps: '6-8', muscles: ['chest', 'shoulders', 'triceps'] },
        { name: 'Overhead Press', sets: '3', reps: '8', muscles: ['shoulders'] },
        { name: 'Incline DB Press', sets: '3', reps: '10', muscles: ['chest'] },
        { name: 'Lateral Raises', sets: '4', reps: '15', muscles: ['shoulders'] },
        { name: 'Tricep Pushdown', sets: '3', reps: '12', muscles: ['triceps'] },
      ]},
      { day: 'Day 2', focus: 'Pull', exercises: [
        { name: 'Deadlift', sets: '4', reps: '5', muscles: ['back', 'hamstrings', 'glutes'] },
        { name: 'Pull Ups', sets: '3', reps: '8', muscles: ['back', 'biceps'] },
        { name: 'Cable Row', sets: '3', reps: '10', muscles: ['back'] },
        { name: 'Face Pulls', sets: '3', reps: '15', muscles: ['shoulders'] },
        { name: 'Barbell Curl', sets: '3', reps: '10', muscles: ['biceps'] },
      ]},
      { day: 'Day 3', focus: 'Legs', exercises: [
        { name: 'Squat', sets: '4', reps: '6-8', muscles: ['quads', 'glutes'] },
        { name: 'Romanian Deadlift', sets: '3', reps: '10', muscles: ['hamstrings', 'glutes'] },
        { name: 'Leg Press', sets: '3', reps: '12', muscles: ['quads'] },
        { name: 'Leg Curl', sets: '3', reps: '12', muscles: ['hamstrings'] },
        { name: 'Calf Raises', sets: '4', reps: '15', muscles: ['calves'] },
      ]},
    ]
  },
  {
    goal: 'maintenance', level: 'Beginner', title: 'Upper Lower Split',
    days: 4, desc: 'A balanced 4-day upper/lower split. Great for building strength and staying consistent.', split: 'Upper / Lower',
    schedule: [
      { day: 'Day 1', focus: 'Upper A', exercises: [
        { name: 'Bench Press', sets: '4', reps: '8', muscles: ['chest', 'shoulders', 'triceps'] },
        { name: 'Barbell Row', sets: '4', reps: '8', muscles: ['back', 'biceps'] },
        { name: 'Overhead Press', sets: '3', reps: '10', muscles: ['shoulders'] },
        { name: 'Lat Pulldown', sets: '3', reps: '10', muscles: ['back'] },
      ]},
      { day: 'Day 2', focus: 'Lower A', exercises: [
        { name: 'Squat', sets: '4', reps: '8', muscles: ['quads', 'glutes'] },
        { name: 'Romanian Deadlift', sets: '3', reps: '10', muscles: ['hamstrings', 'glutes'] },
        { name: 'Leg Press', sets: '3', reps: '12', muscles: ['quads'] },
        { name: 'Calf Raises', sets: '4', reps: '15', muscles: ['calves'] },
      ]},
    ]
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Guide.deleteMany({});
  await Plan.deleteMany({});
  console.log('Cleared existing data');

  await Guide.insertMany(guides);
  console.log(`Seeded ${guides.length} guides`);

  await Plan.insertMany(plans);
  console.log(`Seeded ${plans.length} plans`);

  mongoose.disconnect();
  console.log('Done');
}

seed().catch(err => { console.error(err); process.exit(1); });