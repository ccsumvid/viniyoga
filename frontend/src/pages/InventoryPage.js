import { useState } from 'react';
import { useApp } from '../context/AppContext';
import VEGETABLE_DB from '../data/vegetables';
import { THRESHOLD } from '../data/defaults';
import C from '../theme/colors';
import Card from '../components/Card';
import Pill from '../components/Pill';
import ProgressBar from '../components/ProgressBar';
import './InventoryPage.css';

function InventoryPage() {
  const { inventory, setInventory, lang } = useApp();
  const [editItem, setEditItem] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');

  const categories = ['all', 'vegetable', 'staple', 'dairy'];

  const items = Object.entries(inventory)
    .filter(([key]) => {
      const db = VEGETABLE_DB[key];
      if (!db) return false;
      if (catFilter !== 'all' && db.category !== catFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          db.en.toLowerCase().includes(s) ||
          (db[lang] || '').toLowerCase().includes(s) ||
          key.includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => a[1] - b[1]);

  const handleSave = () => {
    if (editItem && editVal !== '') {
      setInventory(prev => ({
        ...prev,
        [editItem]: parseFloat(editVal) || 0,
      }));
      setEditItem(null);
    }
  };

  return (
    <div className="inventory-page">
      <div className="inventory-page__header">
        <h2 className="inventory-page__title">
          Bhand&#x0101;ra (&#x092D;&#x0923;&#x094D;&#x0921;&#x093E;&#x0930;)
        </h2>
        <p className="inventory-page__subtitle">Inventory Management</p>
      </div>

      <div className="inventory-page__search">
        <span className="inventory-page__search-icon">&#x1F50D;</span>
        <input
          className="inventory-page__search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items..."
        />
      </div>

      <div className="inventory-page__filters">
        {categories.map(c => (
          <Pill
            key={c}
            active={catFilter === c}
            onClick={() => setCatFilter(c)}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </Pill>
        ))}
      </div>

      <div className="inventory-page__list">
        {items.map(([key, qty]) => {
          const db = VEGETABLE_DB[key];
          const threshold = THRESHOLD[key] || 0.1;
          const maxVal = threshold * 4;
          const isLow = qty < threshold;
          const isOut = qty <= 0;

          let borderColor = C.forest;
          if (isOut) borderColor = C.red;
          else if (isLow) borderColor = C.saffron;

          return (
            <Card
              key={key}
              className="inventory-item"
              style={{ borderLeft: `4px solid ${borderColor}`, padding: '14px 18px' }}
            >
              <div className="inventory-item__top">
                <div className="inventory-item__info">
                  <span className="inventory-item__icon">{db?.icon}</span>
                  <div>
                    <div className="inventory-item__name">
                      {db?.[lang] || db?.en || key}
                    </div>
                    {lang !== 'en' && (
                      <div className="inventory-item__name-en">{db?.en}</div>
                    )}
                  </div>
                </div>
                <div className="inventory-item__right">
                  {editItem === key ? (
                    <div className="inventory-item__edit">
                      <input
                        className="inventory-item__edit-input"
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        type="number"
                        step="0.1"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                      />
                      <button
                        className="inventory-item__edit-save"
                        onClick={handleSave}
                      >
                        &#x2713;
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div
                          className="inventory-item__qty"
                          style={{
                            color: isOut
                              ? C.red
                              : isLow
                                ? C.saffron
                                : C.dark,
                          }}
                        >
                          {qty.toFixed(1)}
                        </div>
                        <div className="inventory-item__unit">
                          {db?.unit || 'kg'}
                        </div>
                      </div>
                      <button
                        className="inventory-item__edit-btn"
                        onClick={() => {
                          setEditItem(key);
                          setEditVal(qty.toString());
                        }}
                      >
                        &#x270F;&#xFE0F;
                      </button>
                    </>
                  )}
                </div>
              </div>
              <ProgressBar value={qty} max={maxVal} />
              {isOut && (
                <div className="inventory-item__status inventory-item__status--out">
                  OUT OF STOCK
                </div>
              )}
              {isLow && !isOut && (
                <div className="inventory-item__status inventory-item__status--low">
                  LOW &mdash; Reorder at {threshold} {db?.unit || 'kg'}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryPage;
