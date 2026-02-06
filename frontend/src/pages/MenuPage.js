import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAvailableMenus, deductInventory } from '../utils/inventory';
import MENU_DB from '../data/menus';
import VEGETABLE_DB from '../data/vegetables';
import C from '../theme/colors';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Pill from '../components/Pill';
import Modal from '../components/Modal';
import './MenuPage.css';

function MenuPage() {
  const { inventory, setInventory, lang, setTodayMenu, addLog } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [servings, setServings] = useState(1);

  const available = getAvailableMenus(inventory);
  const filtered =
    filter === 'all'
      ? available
      : available.filter(m => m.type === filter);
  const unavailable = MENU_DB.filter(
    m => !available.find(a => a.id === m.id)
  );

  const handleCook = (menu) => {
    const newInv = deductInventory(inventory, menu, servings);
    setInventory(newInv);
    setTodayMenu(menu);
    addLog({
      type: 'cook',
      menu: menu.name,
      servings,
      time: new Date().toISOString(),
    });
    setSelectedMenu(null);
    setServings(1);
  };

  const getMissing = (menu) => {
    return Object.entries(menu.ingredients)
      .filter(([item, qty]) => (inventory[item] || 0) < qty)
      .map(([item]) => VEGETABLE_DB[item]?.en || item);
  };

  return (
    <div className="menu-page">
      <div className="menu-page__header">
        <h2 className="menu-page__title">Viniyoga Menu</h2>
        <p className="menu-page__subtitle">
          {available.length} of {MENU_DB.length} menus available based on
          current stock
        </p>
      </div>

      <div className="menu-page__filters">
        {['all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'].map(
          f => (
            <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Pill>
          )
        )}
      </div>

      {filtered.length > 0 && (
        <div className="menu-page__section">
          <div className="menu-page__section-label menu-page__section-label--available">
            &#x2705; Available ({filtered.length})
          </div>
          <div className="menu-page__list">
            {filtered.map(menu => (
              <Card
                key={menu.id}
                hover
                onClick={() => setSelectedMenu(menu)}
                style={{ borderLeft: `4px solid ${C.forest}` }}
              >
                <div className="menu-card__top">
                  <div>
                    <div className="menu-card__name">
                      #{menu.id} &middot; {menu.name}
                    </div>
                    <div className="menu-card__badges">
                      <Badge>{menu.type}</Badge>
                      <Badge color={C.mid} bg="#F5F5F5">
                        {menu.servings} servings
                      </Badge>
                    </div>
                  </div>
                  <span className="menu-card__emoji">&#x1F35B;</span>
                </div>
                <div className="menu-card__ingredients">
                  {Object.keys(menu.ingredients).map(item => (
                    <span key={item} className="menu-card__ingredient-tag">
                      {VEGETABLE_DB[item]?.icon}{' '}
                      {VEGETABLE_DB[item]?.[lang] ||
                        VEGETABLE_DB[item]?.en ||
                        item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {unavailable.length > 0 && (
        <div className="menu-page__section">
          <div className="menu-page__section-label menu-page__section-label--unavailable">
            &#x274C; Unavailable ({unavailable.length})
          </div>
          <div className="menu-page__list">
            {unavailable.map(menu => (
              <Card
                key={menu.id}
                className="menu-card--unavailable"
                style={{ borderLeft: `4px solid ${C.border}` }}
              >
                <div className="menu-card__name menu-card__name--dim">
                  #{menu.id} &middot; {menu.name}
                </div>
                <div className="menu-card__missing">
                  Missing: {getMissing(menu).join(', ')}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={!!selectedMenu}
        onClose={() => setSelectedMenu(null)}
        title={selectedMenu?.name}
      >
        {selectedMenu && (
          <div className="menu-modal">
            <Badge>{selectedMenu.type}</Badge>
            <div className="menu-modal__ingredients">
              <div className="menu-modal__ingredients-title">
                Ingredients Required:
              </div>
              {Object.entries(selectedMenu.ingredients).map(
                ([item, qty]) => (
                  <div key={item} className="menu-modal__ingredient-row">
                    <span>
                      {VEGETABLE_DB[item]?.icon}{' '}
                      {VEGETABLE_DB[item]?.en || item}
                    </span>
                    <span className="menu-modal__ingredient-qty">
                      {(qty * servings).toFixed(2)}{' '}
                      {VEGETABLE_DB[item]?.unit || 'kg'}
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="menu-modal__servings">
              <span className="menu-modal__servings-label">
                Servings Multiplier:
              </span>
              {[1, 2, 3, 5].map(s => (
                <Pill
                  key={s}
                  active={servings === s}
                  onClick={() => setServings(s)}
                >
                  {s}&times;
                </Pill>
              ))}
            </div>
            <button
              className="menu-modal__confirm"
              onClick={() => handleCook(selectedMenu)}
            >
              &#x1F373; Confirm &amp; Deduct from Inventory
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MenuPage;
