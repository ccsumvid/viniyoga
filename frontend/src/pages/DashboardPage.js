import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAvailableMenus, getProcurementList } from '../utils/inventory';
import { formatDate, formatTime } from '../utils/formatters';
import VEGETABLE_DB from '../data/vegetables';
import C from '../theme/colors';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import './DashboardPage.css';

function DashboardPage() {
  const { inventory, todayMenu } = useApp();
  const navigate = useNavigate();

  const available = getAvailableMenus(inventory);
  const procurement = getProcurementList(inventory);
  const lowItems = Object.keys(procurement).length;
  const totalItems = Object.keys(inventory).length;
  const stockedItems = Object.values(inventory).filter(v => v > 0).length;

  return (
    <div className="dashboard">
      <div className="dashboard__hero">
        <div className="dashboard__hero-circle dashboard__hero-circle--lg" />
        <div className="dashboard__hero-circle dashboard__hero-circle--sm" />
        <div className="dashboard__date">
          {formatDate(new Date())} &middot; {formatTime()}
        </div>
        <h2 className="dashboard__greeting">
          Namask&#x0101;ra &#x1F64F;
        </h2>
        <p className="dashboard__summary">
          {available.length} menus available from current stock &middot;{' '}
          {lowItems > 0
            ? `${lowItems} items need restocking`
            : 'All items well-stocked'}
        </p>
        {todayMenu && (
          <div className="dashboard__today">
            <span className="dashboard__today-icon">&#x1F35B;</span>
            <div>
              <div className="dashboard__today-label">TODAY'S SELECTION</div>
              <div className="dashboard__today-name">{todayMenu.name}</div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard__stats">
        <StatCard icon="&#x1F4E6;" label="Total Items" value={totalItems} />
        <StatCard
          icon="&#x2705;"
          label="In Stock"
          value={stockedItems}
          accent={C.forestLight}
        />
        <StatCard
          icon="&#x26A0;&#xFE0F;"
          label="Low Stock"
          value={lowItems}
          accent={lowItems > 0 ? C.saffron : C.forestLight}
        />
        <StatCard
          icon="&#x1F37D;&#xFE0F;"
          label="Menus Ready"
          value={available.length}
          accent={C.blue}
        />
      </div>

      {lowItems > 0 && (
        <Card
          className="dashboard__alert"
          style={{ borderLeft: `4px solid ${C.saffron}` }}
        >
          <div className="dashboard__alert-header">
            <div className="dashboard__alert-title">
              &#x26A0;&#xFE0F; Procurement Alert
            </div>
            <button
              className="dashboard__alert-btn"
              onClick={() => navigate('/inventory')}
            >
              View All
            </button>
          </div>
          <div className="dashboard__alert-badges">
            {Object.entries(procurement)
              .slice(0, 6)
              .map(([item]) => (
                <Badge key={item} color={C.saffron} bg={C.saffronPale}>
                  {VEGETABLE_DB[item]?.icon} {VEGETABLE_DB[item]?.en || item}
                </Badge>
              ))}
          </div>
        </Card>
      )}

      <div className="dashboard__actions-title">Quick Actions</div>
      <div className="dashboard__actions">
        {[
          { icon: '\u{1F37D}\uFE0F', label: 'Plan Menu', page: '/menu', color: C.forest },
          { icon: '\u{1F4E6}', label: 'Inventory', page: '/inventory', color: C.blue },
          { icon: '\u{1F6D2}', label: 'Shopping List', page: '/procurement', color: C.saffron },
          { icon: '\u{1F4AC}', label: 'Broadcast', page: '/communicate', color: '#7B1FA2' },
        ].map(a => (
          <Card
            key={a.page}
            hover
            onClick={() => navigate(a.page)}
            className="dashboard__action-card"
          >
            <div className="dashboard__action-icon">{a.icon}</div>
            <div className="dashboard__action-label" style={{ color: a.color }}>
              {a.label}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
