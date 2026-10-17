import { useEffect, useState } from 'react';
import QuoteButton from './QuoteButton.jsx';

// Barra de orçamento do celular (escondida no desktop via CSS).
// Aparece depois da primeira tela e se recolhe na chamada final e com o menu aberto.
export default function MobileQuoteBar({ hidden }) {
  const [pastIntro, setPastIntro] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('intro-sentinel');
    const final = document.getElementById('orcamento');
    const observers = [];
    if (sentinel) {
      const io = new IntersectionObserver(([e]) => setPastIntro(e.boundingClientRect.top < 0 && !e.isIntersecting));
      io.observe(sentinel);
      observers.push(io);
    }
    if (final) {
      const io = new IntersectionObserver(([e]) => setFinalVisible(e.isIntersecting), { threshold: 0.2 });
      io.observe(final);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const show = pastIntro && !finalVisible && !hidden;
  return (
    <div className={`quote-bar${show ? ' is-visible' : ''}`} aria-hidden={!show} inert={!show}>
      <span className="quote-bar__text">Orçamento pelo WhatsApp</span>
      <QuoteButton size="md" icon={false} />
    </div>
  );
}
