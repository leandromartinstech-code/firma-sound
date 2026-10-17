// Configuração do filme da abertura (sequência de frames controlada pelo scroll).
// Para trocar a quantidade de frames: rode `npm run frames` com outro passo
// e atualize `count` abaixo. O componente não depende de um número fixo.

// As duas media queries são complementares e precisam ser IGUAIS às do index.html
// (preload do primeiro frame), para que cada aparelho baixe só uma versão.
export const MOBILE_QUERY = '(max-width: 767px), (orientation: portrait) and (max-width: 1024px)';
export const DESKTOP_QUERY = '(min-width: 768px) and (orientation: landscape), (min-width: 1025px)';

const base = import.meta.env.BASE_URL || '/';

export const FILM_VARIANTS = {
  desktop: {
    count: 240,
    width: 1600,
    height: 900,
    dir: `${base}assets/films/hero/desktop/`,
    // ponto focal do enquadramento (0 a 1) quando a tela corta a imagem
    focusX: 0.5,
    focusY: 0.5,
  },
  mobile: {
    count: 120,
    width: 810,
    height: 1080,
    dir: `${base}assets/films/hero/mobile/`,
    focusX: 0.5,
    focusY: 0.5,
  },
};

export function frameUrl(variant, index) {
  // index começa em 0; arquivos começam em frame_0001.webp
  return `${variant.dir}frame_${String(index + 1).padStart(4, '0')}.webp`;
}

// Altura total da seção, em telas. Mais telas = a cena avança mais devagar.
export const FILM_SCROLL_SCREENS = { desktop: 5, mobile: 4 };

// Momentos de texto sobre a cena. `from` e `to` são o progresso do scroll (0 a 1).
// `place` define a área de leitura, escolhida para não cobrir o DJ nem a mesa.
export const FILM_CHAPTERS = [
  {
    id: 'precisao',
    from: 0.14,
    to: 0.27,
    place: 'right',
    title: 'Tecnologia, precisão e emoção em perfeita sintonia.',
    text: 'Mesa digital, técnicos dedicados e cada sistema calibrado para o espaço do seu evento.',
  },
  {
    id: 'estrutura',
    from: 0.42,
    to: 0.62,
    place: 'bottom-left',
    title: 'Estrutura para grandes momentos.',
    text: 'Palco, treliças, iluminação cênica e painéis de LED montados na medida da produção.',
  },
  {
    id: 'assinatura',
    from: 0.8,
    to: 1.01,
    place: 'bottom-left',
    title: 'Seu evento. Nossa assinatura.',
    text: null,
    cta: true,
  },
];

// Fim da abertura: o texto inicial some até este ponto do progresso.
export const INTRO_FADE = { start: 0.04, end: 0.12 };

// Quadros usados na versão estática (movimento reduzido), um por momento.
export const STATIC_FRAMES = [
  { index: 0.12, alt: 'Close das mãos de um técnico operando uma mesa de som digital iluminada' },
  { index: 0.55, alt: 'Palco com treliças, painéis de LED e feixes de luz azul e violeta' },
  { index: 0.95, alt: 'DJ no centro do palco, com público em silhueta e feixes de luz cruzando a névoa' },
];
