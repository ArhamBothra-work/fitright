import React from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '2rem' }}>
      <h1>Welcome, {user?.name} 👋</h1>
      <p>Goal: {user?.goal?.replace('_', ' ')}</p>
      <hr />
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/guides">Fitness Guides</a></li>
        <li><a href="/plans">Workout Plans</a></li>
        <li><a href="/tracker">Progress Tracker</a></li>
        <li><a href="/nutrition">Nutrition Log</a></li>
      </ul>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;