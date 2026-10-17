import { useEffect, useRef, useState } from 'react';
import { useMediaQuery, REDUCED_MOTION_QUERY } from '../hooks/useMediaQuery.js';
import { COMPANY, EVENT_TYPES, PROCESS, SERVICES, WORKS, asset, buildWhatsAppLink } from '../content/site.js';
import QuoteButton from './QuoteButton.jsx';

// Moldura com cantos de visor para mídia que ainda não foi fornecida.
function Placeholder({ note, tone = 'blue', className = '' }) {
  return (
    <div className={`media media--placeholder tone-${tone} ${className}`.trim()} role="img" aria-label={note}>
      <p className="media__note">{note}</p>
    </div>
  );
}

// Vídeo de serviço: toca uma vez quando aparece na tela e para no último frame
// (o painel aceso). Pausa se sair da tela. Com movimento reduzido, mostra só a imagem final.
function ServiceVideo({ media }) {
  const ref = useRef(null);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !video.ended) video.play().catch(() => {});
        else if (!e.isIntersecting) video.pause();
      },
      { threshold: 0.5 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return <img className="media" src={media.posterEnd} alt={media.alt} width={media.w} height={media.h} loading="lazy" decoding="async" />;
  }
  return (
    <video
      ref={ref}
      className="media"
      src={media.src}
      poster={media.poster}
      width={media.w}
      height={media.h}
      muted
      playsInline
      preload="metadata"
      aria-label={media.alt}
    />
  );
}

function InlineCta({ text }) {
  return (
    <div className="inline-cta">
      <p>{text}</p>
      <QuoteButton size="md" />
    </div>
  );
}

// Ponte entre a cena e o conteúdo comercial: uma pausa escura, só tipografia.
export function Bridge() {
  return (
    <section id="depois-da-cena" className="bridge" tabIndex={-1} aria-label="Transição">
      <p className="wrap bridge__text">
        {/* A validar com a empresa: é uma promessa de processo. */}
        Montado, testado e aceso antes de o primeiro convidado chegar.
      </p>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicos" className="section services" aria-labelledby="servicos-titulo">
      <div className="wrap">
        <header className="section__head">
          <h2 id="servicos-titulo" className="display display--l">O que você pode contratar</h2>
          <p className="body">Cada serviço pode ser contratado sozinho ou junto, com montagem, operação e desmontagem pela mesma equipe.</p>
        </header>

        {SERVICES.map((s) => (
          <article key={s.id} id={s.id} className={`service service--${s.layout}`}>
            <div className="service__media">
              {s.media.type === 'image' ? (
                <img className="media" src={s.media.src} alt={s.media.alt} width={s.media.w} height={s.media.h} loading="lazy" decoding="async" />
              ) : s.media.type === 'video' ? (
                <ServiceVideo media={s.media} />
              ) : (
                <Placeholder note={s.media.note} />
              )}
            </div>
            <div className="service__text">
              <h3 className="display display--s">{s.title}</h3>
              <p className="service__lead">{s.lead}</p>
              <p className="body">{s.text}</p>
              {s.items.length > 0 && (
                <ul className="service__items">
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}

        <article className="service service--text-only">
          <h3 className="display display--s">Produção técnica integrada</h3>
          <div>
            <p className="service__statement">Um só time responde por áudio, luz, vídeo e estrutura, do primeiro teste ao fim do evento.</p>
            <p className="body">Você fala com um responsável técnico. Ele integra os sistemas, alinha o roteiro com o cerimonial ou a produção e acompanha a operação ao vivo.</p>
          </div>
        </article>

        <InlineCta text="Não sabe do que precisa? A gente monta o pacote com você." />
      </div>
    </section>
  );
}

export function EventTypes() {
  const [active, setActive] = useState(0);
  const current = EVENT_TYPES[active];
  return (
    <section id="eventos" className="section section--alt events" aria-labelledby="eventos-titulo">
      <div className="wrap">
        <h2 id="eventos-titulo" className="display display--m section__title">Para cada tipo de evento</h2>
        <div className="events__grid">
          {/* Imagem do tipo escolhido. Todas ficam empilhadas e só a ativa aparece:
              a troca é um fade, sem esperar download. No celular ela fica acima da lista. */}
          <div className="events__preview">
            <div className="events__media">
              {EVENT_TYPES.map((e, i) => (
                <img
                  key={e.name}
                  className={i === active ? 'is-active' : ''}
                  src={e.image}
                  alt={i === active ? e.alt : ''}
                  aria-hidden={i !== active}
                  width="720"
                  height="1280"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <p className="body body--light events__text" aria-live="polite">{current.text}</p>
          </div>
          <ul className="events__list">
            {EVENT_TYPES.map((e, i) => (
              <li key={e.name}>
                <button
                  type="button"
                  className={`events__item${i === active ? ' is-active' : ''}`}
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="events__name">{e.name}</span>
                  <span className="events__kicker">{e.kicker}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="body events__more">Também atendemos lançamentos de produto, ativações de marca e eventos sociais.</p>
      </div>
    </section>
  );
}

function InstagramIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Arrow({ dir = 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Um vídeo do carrossel. Toca sem som quando está pelo menos 60% visível e pausa
// quando sai (economiza dados e bateria). O som é ligado em um vídeo por vez.
function WorkVideo({ work, sound, onSound, reduced }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduced) video.play().catch(() => {});
        else if (!e.isIntersecting) video.pause();
      },
      { threshold: 0.6 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = !sound;
    if (sound) video.play().catch(() => {});
  }, [sound]);

  const toggle = () => {
    const video = ref.current;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <figure className="work">
      <video
        ref={ref}
        className="work__video"
        src={work.video}
        poster={work.poster}
        width="720"
        height="1280"
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={toggle}
        aria-label={`Vídeo: ${work.title}`}
      />
      <figcaption className="work__bar">
        <span className="work__title">{work.title}</span>
        <span className="work__controls">
          <button type="button" className="work__btn" onClick={toggle} aria-label={playing ? `Pausar ${work.title}` : `Reproduzir ${work.title}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5z" />}
            </svg>
          </button>
          <button type="button" className="work__btn" onClick={onSound} aria-pressed={sound} aria-label={sound ? `Desligar o som de ${work.title}` : `Ligar o som de ${work.title}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
              {sound ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
            </svg>
          </button>
        </span>
      </figcaption>
    </figure>
  );
}

export function Portfolio() {
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const trackRef = useRef(null);
  const [sound, setSound] = useState(-1);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Habilita/desabilita as setas conforme a posição do carrossel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth - 2;
      setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Avança o equivalente a quase uma "página" de cards.
  const move = (dir) => {
    const track = trackRef.current;
    const card = track.querySelector('.carousel__item');
    const stepPx = card ? card.getBoundingClientRect().width + 16 : 300;
    const perPage = Math.max(1, Math.floor(track.clientWidth / stepPx));
    track.scrollBy({ left: dir * stepPx * perPage, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section id="trabalhos" className="section portfolio" aria-labelledby="trabalhos-titulo">
      <div className="wrap portfolio__head">
        <div>
          <h2 id="trabalhos-titulo" className="display display--l">Trabalhos</h2>
          <p className="body">Eventos reais montados e operados pela Firma Sound. Deslize para o lado para ver mais.</p>
        </div>
        <div className="carousel__nav">
          <button type="button" className="carousel__arrow" onClick={() => move(-1)} disabled={edges.start} aria-label="Vídeos anteriores">
            <Arrow dir="left" />
          </button>
          <button type="button" className="carousel__arrow" onClick={() => move(1)} disabled={edges.end} aria-label="Próximos vídeos">
            <Arrow />
          </button>
        </div>
      </div>

      <div className="carousel" ref={trackRef} role="region" aria-label="Vídeos de eventos" tabIndex={0}>
        <ul className="carousel__track">
          {WORKS.map((w, i) => (
            <li key={w.video} className="carousel__item">
              <WorkVideo work={w} reduced={reduced} sound={sound === i} onSound={() => setSound(sound === i ? -1 : i)} />
            </li>
          ))}
          <li className="carousel__item">
            <a className="work work--more" href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={32} />
              <span className="work--more__text">Mais eventos no Instagram</span>
              <span className="work--more__handle">{COMPANY.instagram}</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="wrap">
        <a className="insta" href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer"
          aria-label={`Ver mais eventos no Instagram ${COMPANY.instagram} (abre em nova aba)`}>
          <span className="insta__kicker"><InstagramIcon size={20} /> Bastidores, montagens e eventos completos</span>
          <span className="insta__handle">{COMPANY.instagram}</span>
          <span className="insta__action">Ver no Instagram <Arrow /></span>
        </a>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="como-trabalhamos" className="section section--alt process" aria-labelledby="processo-titulo">
      <div className="wrap">
        <h2 id="processo-titulo" className="display display--m section__title">Como trabalhamos</h2>
        {/* Etapas a validar com a Firma Sound antes de publicar. */}
        <ol className="process__list">
          {PROCESS.map((s, i) => (
            <li key={s.title} className="process__step">
              <span className="process__num" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p className="body">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="diffs">
          <h3 className="diffs__title">O que você pode esperar</h3>
          {/* Diferenciais a confirmar com a empresa. Nada de números ou certificações inventadas. */}
          <ul className="diffs__list">
            <li>Planejamento técnico antes de qualquer montagem</li>
            <li>Equipamento adequado ao porte do evento</li>
            <li>Áudio, luz e vídeo integrados por uma só equipe</li>
            <li>Equipe própria de montagem e operação</li>
            <li>Solução desenhada para cada espaço</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="orcamento" className="final-cta" aria-labelledby="orcamento-titulo">
      <div className="final-cta__cone" aria-hidden="true" />
      <div className="wrap final-cta__inner">
        <h2 id="orcamento-titulo" className="display display--xl">Qual é a data do seu evento?</h2>
        <p className="lead">Conte o tipo de evento, o local e quantas pessoas vão estar lá. Respondemos pelo WhatsApp com uma proposta técnica.</p>
        <QuoteButton size="lg" />
        <p className="final-cta__hours">Atendimento {COMPANY.hours}</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <img className="footer__logo" src={asset('/assets/brand/firma-sound-logo.webp')} alt="Firma Sound" width="1000" height="560" loading="lazy" />
        <div className="footer__col">
          <span className="footer__label">Contato</span>
          <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">WhatsApp (21) 96426-2114</a>
          <span>{COMPANY.email}</span>
          <a href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram {COMPANY.instagram}</a>
        </div>
        <div className="footer__col">
          <span className="footer__label">Atendimento</span>
          <span>{COMPANY.region}</span>
        </div>
        <nav className="footer__col" aria-label="Rodapé">
          <span className="footer__label">Navegação</span>
          <a href="#servicos">Serviços</a>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#como-trabalhamos">Como trabalhamos</a>
        </nav>
      </div>
      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} {COMPANY.name}</span>
        <span>{COMPANY.cnpj}</span>
      </div>
    </footer>
  );
}
