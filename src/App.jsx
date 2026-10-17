import { useState } from 'react';
import Header from './components/Header.jsx';
import FilmSequence from './film/FilmSequence.jsx';
import { Bridge, Services, EventTypes, Portfolio, Process, FinalCta, Footer } from './components/Sections.jsx';
import MobileQuoteBar from './components/MobileQuoteBar.jsx';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {/* Marca o fim da primeira tela, para a barra de orçamento do celular. */}
        <div id="intro-sentinel" className="sentinel" aria-hidden="true" />
        <FilmSequence />
        <Bridge />
        <Services />
        <EventTypes />
        <Portfolio />
        <Process />
        <FinalCta />
      </main>
      <Footer />
      <MobileQuoteBar hidden={menuOpen} />
    </>
  );
}
