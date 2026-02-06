import './Badge.css';

function Badge({ children, color, bg, className = '' }) {
  const style = {};
  if (color) style.color = color;
  if (bg) style.backgroundColor = bg;

  return (
    <span className={`badge ${className}`} style={style}>
      {children}
    </span>
  );
}

export default Badge;
