import { useApp } from '../context/AppContext';
import Badge from './Badge';
import './TopBar.css';

const LANG_LABELS = {
  en: 'EN',
  te: '\u0C24\u0C46',
  kn: '\u0C95',
  hi: '\u0939\u093F',
};

function TopBar() {
  const { orgName, lang } = useApp();

  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <div className="top-bar__logo">
          <span role="img" aria-label="leaf">&#x1F33F;</span>
        </div>
        <div className="top-bar__text">
          <div className="top-bar__title">Viniyoga</div>
          <div className="top-bar__subtitle">{orgName}</div>
        </div>
      </div>
      <Badge>{LANG_LABELS[lang] || 'EN'}</Badge>
    </div>
  );
}

export default TopBar;
