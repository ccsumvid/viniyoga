import './Pill.css';

function Pill({ active, onClick, children }) {
  return (
    <button
      className={`pill ${active ? 'pill--active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Pill;
