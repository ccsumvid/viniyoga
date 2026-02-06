import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const NAV_ITEMS = [
  { id: '/', icon: '\u{1F3E0}', label: 'Home' },
  { id: '/menu', icon: '\u{1F37D}\uFE0F', label: 'Menu' },
  { id: '/inventory', icon: '\u{1F4E6}', label: 'Stock' },
  { id: '/procurement', icon: '\u{1F6D2}', label: 'Buy' },
  { id: '/communicate', icon: '\u{1F4AC}', label: 'Chat' },
  { id: '/settings', icon: '\u2699\uFE0F', label: 'Settings' },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map(nav => {
        const active = location.pathname === nav.id;
        return (
          <button
            key={nav.id}
            className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate(nav.id)}
          >
            <span className="bottom-nav__icon">{nav.icon}</span>
            <span className="bottom-nav__label">{nav.label}</span>
            {active && <div className="bottom-nav__dot" />}
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
