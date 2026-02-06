import { useApp } from '../context/AppContext';
import { INITIAL_INVENTORY } from '../data/defaults';
import Pill from '../components/Pill';
import Card from '../components/Card';
import './SettingsPage.css';

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'te', label: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41' },
  { code: 'kn', label: '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1' },
  { code: 'hi', label: '\u0939\u093F\u0928\u094D\u0926\u0940' },
];

function SettingsPage() {
  const {
    lang,
    setLang,
    orgName,
    setOrgName,
    servingSize,
    setServingSize,
    setInventory,
    inventory,
  } = useApp();

  const handleExport = () => {
    const data = JSON.stringify({ inventory }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'viniyoga-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-page">
      <h2 className="settings-page__title">
        &#x2699;&#xFE0F; Settings
      </h2>

      <Card className="settings-section">
        <div className="settings-section__label">
          Organisation / Household
        </div>
        <input
          className="settings-section__input"
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          placeholder="e.g. Krishna Family, Ashram Kitchen..."
        />
      </Card>

      <Card className="settings-section">
        <div className="settings-section__label">
          Language / &#x0C2D;&#x0C3E;&#x0C37; / &#x0CAD;&#x0CBE;&#x0CB7;&#x0CC6;
        </div>
        <div className="settings-section__grid">
          {LANG_OPTIONS.map(l => (
            <Pill
              key={l.code}
              active={lang === l.code}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </Pill>
          ))}
        </div>
      </Card>

      <Card className="settings-section">
        <div className="settings-section__label">Default Servings</div>
        <div className="settings-section__servings">
          {[2, 4, 6, 10, 20, 50].map(s => (
            <Pill
              key={s}
              active={servingSize === s}
              onClick={() => setServingSize(s)}
            >
              {s}
            </Pill>
          ))}
        </div>
        <div className="settings-section__hint">
          Use higher values for institutional / ashram settings
        </div>
      </Card>

      <Card className="settings-section">
        <div className="settings-section__label">Data Management</div>
        <div className="settings-section__actions">
          <button
            className="settings-section__btn"
            onClick={() => setInventory({ ...INITIAL_INVENTORY })}
          >
            &#x1F504; Reset Inventory
          </button>
          <button className="settings-section__btn" onClick={handleExport}>
            &#x1F4E5; Export Data
          </button>
        </div>
      </Card>
    </div>
  );
}

export default SettingsPage;
