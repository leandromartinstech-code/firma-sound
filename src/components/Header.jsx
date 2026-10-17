import { useEffect, useRef, useState } from 'react';
import { NAV, asset } from '../content/site.js';
import QuoteButton from './QuoteButton.jsx';

export default function Header({ menuOpen, setMenuOpen }) {
  const [solid, setSolid] = useState(false);
  const menuButtonRef = useRef(null);

  // Transparente sobre a abertura; fundo sólido quando a abertura sai da tela.
  useEffect(() => {
    const film = document.querySelector('[data-film]');
    if (!film) return undefined;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
    });
    io.observe(film);
    return () => io.disconnect();
  }, []);

  // Menu do celular: Esc fecha, a página por trás não rola.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.documentElement.classList.add('is-locked');
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, setMenuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={`header${solid || menuOpen ? ' header--solid' : ''}`}>
      <div className="wrap header__bar">
        <a className="header__logo" href="#topo" aria-label="Firma Sound, voltar ao início">
          <img src={asset('/assets/brand/firma-sound-logo.webp')} alt="Firma Sound" width="1000" height="560" />
        </a>
        <nav className="header__nav" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.href} className="navlink" href={n.href}>{n.label}</a>
          ))}
        </nav>
        <QuoteButton size="sm" className="header__cta" />
        <button
          ref={menuButtonRef}
          type="button"
          className="header__menu-btn"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav id="menu-mobile" className="menu-mobile" aria-label="Menu">
          <div className="menu-mobile__links">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={close}>{n.label}</a>
            ))}
          </div>
          <QuoteButton size="lg" className="btn--block" onClick={close} />
        </nav>
      )}
    </header>
  );
}
