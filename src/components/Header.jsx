import { Link } from 'react-router-dom';

export default function Header({ children }) {
  return (
    <header className="header">
      {children ?? (
        <Link to="/" className="wordmark" aria-label="Lux Scan and Win home">
          Lux <span>Scan &amp; Win</span>
        </Link>
      )}
      <span className="header__badge">A Unilever promotion</span>
    </header>
  );
}
