import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Plus, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './AdminNavbar.css';

interface AdminNavbarProps {
  onOpenMedia: () => void;
  onNewEntry: () => void;
}

export default function AdminNavbar({ onOpenMedia, onNewEntry }: AdminNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppContext();
  const { logout, user } = useAdminAuth();

  const isActive = (path: string) =>
    location.pathname === path ? 'admin-nav__link active' : 'admin-nav__link';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="admin-navbar">
      {/* Left: Brand & Main Navigation */}
      <div className="admin-nav__left">
        <Link to="/admin/dashboard" className="admin-nav__logo display-font">
          HG <span className="logo-accent">Studio</span>
        </Link>
        
        <div className="admin-nav__links">
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
          <Link to="/" className="admin-nav__link secondary">View Site</Link>
        </div>
      </div>

      {/* Center: Theme Switcher (Same as public navbar) */}
      <div className="admin-nav__center">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="theme-toggle__icon theme-toggle__icon--sun">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          </span>
          <span className="theme-toggle__track">
            <span className="theme-toggle__thumb" />
          </span>
          <span className="theme-toggle__icon theme-toggle__icon--moon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          </span>
        </button>
      </div>

      {/* Right: Dashboard Actions (From your Dashboard.tsx) */}
      <div className="admin-nav__right">
        <div className="admin-nav__actions">
          <button className="btn-secondary" onClick={onOpenMedia}>
            <ImageIcon size={16} /> <span>Media</span>
          </button>
          
          <button className="btn-primary" onClick={onNewEntry}>
            <Plus size={16} /> <span>New Entry</span>
          </button>

          <div className="nav-divider" />

          <button className="btn-icon-logout" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}