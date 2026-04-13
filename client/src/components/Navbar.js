import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '1.25rem 2.5rem',
      borderBottom: '0.5px solid var(--border)',
      position: 'relative', zIndex: 50,
      background: 'var(--bg)'
    }}>
      <Link to="/" style={{ fontSize: 17, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Fit<span style={{ color: 'var(--acc)' }}>Right</span>
      </Link>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/guides" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Learn</Link>
        <Link to="/plans" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Train</Link>
        <Link to="/tracker" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Track</Link>
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--acc)' }}>{user.name}</Link>
            <button onClick={handleLogout} style={{
              background: 'transparent', color: 'var(--fg-muted)',
              border: '0.5px solid var(--border)', padding: '0.4rem 1rem',
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase'
            }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={{
            background: 'var(--acc)', color: 'var(--fg)',
            padding: '0.5rem 1.2rem', fontSize: 11,
            fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase'
          }}>Enter</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;