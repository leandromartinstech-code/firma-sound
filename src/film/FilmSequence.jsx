import { useEffect, useRef, useState } from 'react';
import {
  FILM_VARIANTS,
  FILM_CHAPTERS,
  FILM_SCROLL_SCREENS,
  INTRO_FADE,
  MOBILE_QUERY,
  frameUrl,
} from '../content/film.js';
import { createFrameLoader } from './frameLoader.js';
import { useMediaQuery, REDUCED_MOTION_QUERY } from '../hooks/useMediaQuery.js';
import FilmIntro from './FilmIntro.jsx';
import QuoteButton from '../components/QuoteButton.jsx';
import FilmStatic from './FilmStatic.jsx';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const FADE = 0.04; // largura (em progresso) da entrada e saída de cada texto
const SMOOTH_MS = 120; // inércia da cena: maior = desliza mais (e responde um pouco mais devagar)
const BLEND_STEPS = 16; // níveis de mistura entre dois frames vizinhos

// Escreve estilos só quando o valor muda de verdade: evita trabalho a cada frame.
function applyFade(el, cache, opacity, y) {
  const o = Math.round(opacity * 1000) / 1000;
  const ty = Math.round(y * 10) / 10;
  if (cache.o === o && cache.y === ty) return;
  cache.o = o;
  cache.y = ty;
  el.style.opacity = String(o);
  el.style.transform = ty ? `translate3d(0, ${ty}px, 0)` : 'none';
  el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
}

export default function FilmSequence() {
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  // A versão é escolhida uma vez: girar o aparelho não baixa a outra sequência.
  const [variantKey] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop'
  );
  const variant = FILM_VARIANTS[variantKey];

  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const cueRef = useRef(null);
  const outroRef = useRef(null);
  const loadingRef = useRef(null);
  const chapterRefs = useRef([]);

  useEffect(() => {
    if (reduced) return undefined;
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const { count, width: iw, height: ih, focusX, focusY } = variant;

    const conn = navigator.connection;
    const saveData = Boolean(conn && conn.saveData);
    const step = saveData ? 2 : 1; // economia de dados: metade dos frames
    const firstBatch = Math.min(count, Math.ceil(count / 16) + 1);

    let cssW = 0;
    let cssH = 0;
    let scrollable = 1;
    let drawnIndex = -1;
    let drawnKey = -1; // frame + mistura desenhados por último (evita redesenhar igual)
    let current = 0; // posição suavizada (em frames, com fração)
    let lastTime = 0;
    let lastWanted = -1;
    let raf = 0;
    let listening = false;
    let shownCanvas = false;
    const caches = { intro: {}, cue: {}, outro: {}, chapters: FILM_CHAPTERS.map(() => ({})) };

    const loader = createFrameLoader({
      count,
      step,
      concurrency: saveData ? 2 : 4,
      urlFor: (i) => frameUrl(variant, i),
      onFrame: (i, ready) => {
        if (loadingRef.current) {
          const pct = Math.min(1, ready / firstBatch);
          loadingRef.current.style.setProperty('--loaded', String(pct));
          if (pct >= 1) loadingRef.current.dataset.done = 'true';
        }
        // só redesenha se o frame recém-chegado for melhor que o atual
        if (lastWanted >= 0 && Math.abs(i - lastWanted) < Math.abs(drawnIndex - lastWanted)) request();
        else if (drawnIndex < 0) request();
      },
    });

    function measure() {
      cssW = sticky.clientWidth;
      cssH = sticky.clientHeight;
      scrollable = Math.max(1, section.offsetHeight - cssH);
      // Resolução do canvas: igual à da imagem recortada (cópia 1:1, sem reamostrar).
      // Cada quadro desenha bem menos pixels; a ampliação para telas Retina fica com
      // a placa de vídeo, numa etapa só. Nunca abaixo de 1x a tela.
      const cover = Math.max(cssW / iw, cssH / ih);
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, 1 / cover));
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingQuality = 'medium';
        drawnIndex = -1; // redimensionar limpa o canvas
        drawnKey = -1;
      }
    }

    // Desenha o frame `i` e, por cima, o frame `j` com opacidade `t` (0 a 1).
    // Essa mistura cria os "quadros intermediários": o movimento fica contínuo
    // mesmo quando a rolagem para entre dois frames do vídeo.
    function draw(i, j = -1, t = 0) {
      const img = loader.image(i);
      if (!img) return;
      const W = canvas.width;
      const H = canvas.height;
      const scale = Math.max(W / iw, H / ih);
      const sw = W / scale;
      const sh = H / scale;
      const sx = (iw - sw) * focusX;
      const sy = (ih - sh) * focusY;
      ctx.globalAlpha = 1;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      const next = t > 0 && j >= 0 ? loader.image(j) : null;
      if (next) {
        ctx.globalAlpha = t;
        ctx.drawImage(next, sx, sy, sw, sh, 0, 0, W, H);
        ctx.globalAlpha = 1;
      }
      drawnIndex = next && t >= 0.5 ? j : i;
      drawnKey = next ? i * 64 + Math.round(t * BLEND_STEPS) : i * 64;
      if (import.meta.env.DEV) canvas.dataset.frame = String(i); // só em desenvolvimento, para testes
      if (!shownCanvas) {
        shownCanvas = true;
        canvas.dataset.ready = 'true';
      }
    }

    function updateOverlays(p) {
      const intro = 1 - smoothstep(INTRO_FADE.start, INTRO_FADE.end, p);
      if (introRef.current) applyFade(introRef.current, caches.intro, intro, (intro - 1) * 24);
      if (cueRef.current) applyFade(cueRef.current, caches.cue, 1 - smoothstep(0, 0.03, p), 0);
      if (outroRef.current) {
        const o = smoothstep(0.92, 1, p);
        if (caches.outro.o !== o) {
          caches.outro.o = o;
          outroRef.current.style.opacity = String(o);
        }
      }
      FILM_CHAPTERS.forEach((c, k) => {
        const el = chapterRefs.current[k];
        if (!el) return;
        const fin = smoothstep(c.from, c.from + FADE, p);
        const fout = c.to > 1 ? 1 : 1 - smoothstep(c.to - FADE, c.to, p);
        const o = Math.min(fin, fout);
        // entra subindo de leve e sai continuando para cima: ao rolar de volta, o caminho se inverte
        const y = (1 - fin) * 20 - (1 - fout) * 20;
        applyFade(el, caches.chapters[k], o, y);
      });
    }

    function tick(now) {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const target = clamp01(-rect.top / scrollable) * (count - 1);
      const diff = target - current;
      // Inércia: a cena "desliza" até a posição do scroll em vez de pular.
      // Baseada no tempo (dt), então a sensação é igual em telas de 60 Hz e 120 Hz.
      // Saltos grandes (âncora, tecla End) vão direto, sem "reproduzir" o filme.
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      if (Math.abs(diff) > count * 0.2) current = target;
      else current += diff * (1 - Math.exp(-dt / SMOOTH_MS));
      if (Math.abs(target - current) < 0.01) current = target;

      // Posição fracionária: entre o frame `a` e o `b`, a uma fração `t`.
      const pos = current / step;
      const a = Math.min(count - 1, Math.floor(pos) * step);
      const b = Math.min(count - 1, a + step);
      const t = Math.round((pos - Math.floor(pos)) * BLEND_STEPS) / BLEND_STEPS;

      const wanted = t < 0.5 ? a : b;
      if (wanted !== lastWanted) {
        lastWanted = wanted;
        loader.prioritize(wanted);
      }
      if (loader.image(a) && (t === 0 || loader.image(b))) {
        const key = t > 0 ? a * 64 + Math.round(t * BLEND_STEPS) : a * 64;
        if (key !== drawnKey) draw(a, b, t);
      } else {
        // Frames ainda chegando: mostra o mais próximo já pronto (nunca tela vazia).
        const best = loader.nearest(wanted);
        if (best >= 0 && best * 64 !== drawnKey) draw(best);
      }

      // Os textos seguem a mesma posição suavizada da imagem: tudo se move junto.
      updateOverlays(current / (count - 1));
      if (current !== target) request();
      else lastTime = 0;
    }

    function request() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onResize() {
      measure();
      request();
    }

    // Só escuta o scroll enquanto a seção está perto da tela.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          listening = true;
          window.addEventListener('scroll', request, { passive: true });
          request();
        } else if (!entry.isIntersecting && listening) {
          listening = false;
          window.removeEventListener('scroll', request);
        }
      },
      { rootMargin: '50% 0px 50% 0px' }
    );

    measure();
    loader.start();
    io.observe(section);
    window.addEventListener('resize', onResize);
    request();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      loader.destroy();
    };
  }, [reduced, variant]);

  if (reduced) return <FilmStatic variant={variant} variantKey={variantKey} />;

  const first = (key) => frameUrl(FILM_VARIANTS[key], 0);

  return (
    <section
      id="topo"
      data-film
      className="film"
      ref={sectionRef}
      style={{ '--film-screens': FILM_SCROLL_SCREENS[variantKey] }}
      aria-label="Abertura: do bastidor ao espetáculo"
    >
      <a className="skip-link" href="#depois-da-cena">Pular a abertura</a>
      <div className="film__sticky" ref={stickyRef}>
        {/* Estado inicial: o primeiro frame como imagem comum, com o mesmo enquadramento do canvas. */}
        <picture className="film__poster">
          <source media={MOBILE_QUERY} srcSet={first('mobile')} width="810" height="1080" />
          <img src={first('desktop')} alt="" width="1600" height="900" fetchPriority="high" />
        </picture>
        <canvas className="film__canvas" ref={canvasRef} aria-hidden="true" />
        <div className="film__scrim" aria-hidden="true" />
        <div className="film__outro" ref={outroRef} aria-hidden="true" />

        <FilmIntro introRef={introRef} />

        {FILM_CHAPTERS.map((c, k) => (
          <div
            key={c.id}
            className={`film__chapter film__chapter--${c.place}`}
            ref={(el) => {
              chapterRefs.current[k] = el;
            }}
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <h2 className="film__chapter-title">{c.title}</h2>
            {c.text && <p className="film__chapter-text">{c.text}</p>}
            {c.cta && (
              <div className="film__actions">
                <QuoteButton size="lg" />
              </div>
            )}
          </div>
        ))}

        <div className="film__cue" ref={cueRef} aria-hidden="true">
          <span>Role para entrar no evento</span>
          <span className="film__cue-line"><span /></span>
        </div>

        <div className="film__loading" ref={loadingRef} role="status" aria-live="polite">
          <span className="sr-only">Preparando a cena</span>
          <span className="film__loading-bar" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
