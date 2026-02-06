import { useState } from 'react';
import './Card.css';

function Card({ children, style, onClick, hover, className = '' }) {
  const [hovered, setHovered] = useState(false);

  const classes = [
    'card',
    hover ? 'card--hoverable' : '',
    hovered && hover ? 'card--hovered' : '',
    onClick ? 'card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {children}
    </div>
  );
}

export default Card;
