import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">📚 LMS</Link>
      <div className="nav-links">
        <Link to="/">Courses</Link>
        {user?.role === 'STUDENT' && <Link to="/my-courses">My Courses</Link>}
        {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && <Link to="/instructor">Dashboard</Link>}
        {user ? (
          <>
            <span className="muted">{user.name} ({user.role})</span>
            <button className="btn small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
