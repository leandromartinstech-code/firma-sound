import { FILM_CHAPTERS, FILM_VARIANTS, MOBILE_QUERY, STATIC_FRAMES, frameUrl } from '../content/film.js';
import FilmIntro from './FilmIntro.jsx';

// Versão para quem pede movimento reduzido: sem fixar a tela, sem trocar frames.
// A narrativa vira três quadros editoriais, com os mesmos textos.
export default function FilmStatic() {
  const pick = (key, at) => frameUrl(FILM_VARIANTS[key], Math.round(at * (FILM_VARIANTS[key].count - 1)));
  const texts = FILM_CHAPTERS;

  return (
    <section id="topo" data-film className="film-static" aria-label="Abertura: do bastidor ao espetáculo">
      <div className="film-static__hero">
        <picture className="film__poster">
          <source media={MOBILE_QUERY} srcSet={pick('mobile', 0)} width="810" height="1080" />
          <img src={pick('desktop', 0)} alt="" width="1600" height="900" fetchPriority="high" />
        </picture>
        <div className="film__scrim" aria-hidden="true" />
        <FilmIntro />
      </div>
      <div className="film-static__stills">
        {STATIC_FRAMES.map((f, k) => (
          <figure className="film-static__still" key={f.alt}>
            <picture>
              <source media={MOBILE_QUERY} srcSet={pick('mobile', f.index)} width="810" height="1080" />
              <img src={pick('desktop', f.index)} alt={f.alt} width="1600" height="900" loading="lazy" decoding="async" />
            </picture>
            <figcaption>
              <h2 className="film__chapter-title">{texts[k].title}</h2>
              {texts[k].text && <p className="film__chapter-text">{texts[k].text}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
