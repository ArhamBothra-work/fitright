import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showHomeLink = location.pathname !== '/';

  // ── Helper to determine color based on active route ──
  const getLinkColor = (path) => {
    return location.pathname === path ? 'var(--fg)' : 'var(--fg-muted)';
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
        
        {/* ── Home Link (lights up if active) ── */}
        {showHomeLink && (
          <Link to="/" style={{ 
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', 
            color: getLinkColor('/'),
            fontWeight: location.pathname === '/' ? 700 : 400,
            transition: 'color 0.2s ease'
          }}>
            Home
          </Link>
        )}

        {/* ── Learn (Guides) Link ── */}
        <Link to="/guides" style={{ 
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', 
          color: getLinkColor('/guides'),
          fontWeight: location.pathname === '/guides' ? 700 : 400,
          transition: 'color 0.2s ease'
        }}>
          Learn
        </Link>

        {/* ── Train (Plans) Link ── */}
        <Link to="/plans" style={{ 
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', 
          color: getLinkColor('/plans'),
          fontWeight: location.pathname === '/plans' ? 700 : 400,
          transition: 'color 0.2s ease'
        }}>
          Train
        </Link>

        {/* ── Track (Tracker) Link ── */}
        <Link to="/tracker" style={{ 
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', 
          color: getLinkColor('/tracker'),
          fontWeight: location.pathname === '/tracker' ? 700 : 400,
          transition: 'color 0.2s ease'
        }}>
          Track
        </Link>

        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ 
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', 
              color: location.pathname === '/dashboard' ? 'var(--acc)' : 'var(--fg-muted)',
              fontWeight: location.pathname === '/dashboard' ? 700 : 400,
              transition: 'color 0.2s ease'
            }}>
              {user.name}
            </Link>
            <button onClick={handleLogout} style={{
              background: 'transparent', color: 'var(--fg-muted)',
              border: '0.5px solid var(--border)', padding: '0.4rem 1rem',
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer'
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