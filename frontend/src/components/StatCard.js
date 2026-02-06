import Card from './Card';
import './StatCard.css';

function StatCard({ icon, label, value, sub, accent }) {
  const valueStyle = accent ? { color: accent } : {};

  return (
    <Card className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value" style={valueStyle}>{value}</div>
      <div className="stat-card__label">{label}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </Card>
  );
}

export default StatCard;
