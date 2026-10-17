import QuoteButton from '../components/QuoteButton.jsx';
import { asset } from '../content/site.js';

// Texto da primeira tela: comunica o serviço sem depender da animação.
export default function FilmIntro({ introRef }) {
  return (
    <div className="film__intro" ref={introRef}>
      <img
        className="film__logo"
        src={asset('/assets/brand/firma-sound-logo.webp')}
        alt="Firma Sound"
        width="1000"
        height="560"
      />
      <h1 className="film__title">Criamos o ambiente, e você cria memórias.</h1>
      <p className="film__lead">
        Sonorização, iluminação cênica, painéis de LED e palcos para casamentos, eventos corporativos,
        festas e shows. Montamos, operamos e desmontamos.
      </p>
      <div className="film__actions">
        <QuoteButton size="lg" />
        <a className="btn btn--md btn--ghost" href="#servicos">Ver serviços</a>
      </div>
    </div>
  );
}
