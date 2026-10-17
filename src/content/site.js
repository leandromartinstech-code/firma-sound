// Dados da empresa. Tudo entre colchetes é placeholder e PRECISA ser confirmado
// pela Firma Sound antes de publicar. Não invente dados aqui.

// Caminho de um arquivo de public/. Usa a base do site, para funcionar tanto em
// localhost quanto numa subpasta (ex.: usuario.github.io/firma-sound/).
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const COMPANY = {
  name: 'Firma Sound',
  // Somente dígitos, com DDI e DDD. Ex.: '5511999999999'
  whatsapp: '5521964262114',
  email: '[E-mail]',
  instagram: '@firmasound',
  instagramUrl: 'https://www.instagram.com/firmasound/',
  region: '[Cidade e região atendida]',
  hours: '[dias e horários a confirmar]',
  cnpj: '[CNPJ]',
};

export const WHATSAPP_MESSAGE = 'Olá! Gostaria de solicitar um orçamento para um evento.';

export function buildWhatsAppLink(message = WHATSAPP_MESSAGE) {
  const text = encodeURIComponent(message);
  if (!COMPANY.whatsapp) {
    // Sem número ainda: o link abre o WhatsApp para a pessoa escolher o contato.
    // Troque COMPANY.whatsapp assim que o número for fornecido.
    return `https://wa.me/?text=${text}`;
  }
  return `https://wa.me/${COMPANY.whatsapp}?text=${text}`;
}

export const NAV = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#trabalhos', label: 'Trabalhos' },
  { href: '#como-trabalhamos', label: 'Como trabalhamos' },
];

export const SERVICES = [
  {
    id: 'sonorizacao',
    title: 'Sonorização',
    lead: 'Som que chega claro da primeira à última fila.',
    text: 'Sistemas de PA, subwoofers, monitores de palco, microfones e mesa digital, dimensionados para o espaço e para o público.',
    items: ['PA e subwoofers', 'Monitoração de palco', 'Microfones', 'Mesa digital e técnico de som'],
    media: { type: 'image', src: asset('/assets/photos/mixer.webp'), w: 1600, h: 1067, alt: 'Mesa de som digital iluminada, com operador ajustando canais' },
    layout: 'media-left',
  },
  {
    id: 'iluminacao',
    title: 'Iluminação',
    lead: 'Luz que desenha o espaço.',
    text: 'Iluminação cênica para palco e pista, luz arquitetural para salões e fachadas e efeitos programados para cada momento do evento.',
    items: ['Moving heads e refletores', 'Luz arquitetural e de ambiente', 'Névoa e efeitos', 'Mesa de luz e operador'],
    media: { type: 'image', src: asset('/assets/photos/truss.webp'), w: 1000, h: 1500, alt: 'Moving heads presos a uma treliça, vistos de baixo sob luz azul' },
    layout: 'media-right',
  },
  {
    id: 'led',
    title: 'Painéis de LED',
    lead: 'Imagem do tamanho do palco.',
    text: 'Painéis modulares montados na medida do espaço, para conteúdo, cenografia e transmissão ao vivo.',
    items: [],
    media: {
      type: 'video',
      src: asset('/assets/videos/painel-led.mp4'),
      poster: asset('/assets/videos/painel-led-inicio.webp'), // primeiro frame (antes de tocar)
      posterEnd: asset('/assets/videos/painel-led-final.webp'), // último frame (movimento reduzido)
      w: 1600,
      h: 900,
      alt: 'Palco ao ar livre sendo montado: treliças, caixas de som e iluminação, até o painel de LED acender ao pôr do sol',
    },
    layout: 'full-bleed',
  },
  {
    id: 'estruturas',
    title: 'Palcos e estruturas',
    lead: 'A base de tudo o que sobe.',
    text: 'Palcos, treliças, torres e house mix, montados e desmontados com segurança e dentro do cronograma do evento.',
    items: [],
    media: { type: 'placeholder', note: 'Foto a fornecer: equipe montando treliças no palco vazio, plano aberto.' },
    layout: 'media-right',
  },
];

export const EVENT_TYPES = [
  {
    name: 'Casamentos',
    kicker: 'Cerimônia e festa',
    text: 'Luz que valoriza a decoração, som limpo para a cerimônia e pista cheia na festa.',
    image: asset('/assets/trabalhos/casamento.webp'),
    alt: 'Pista de casamento cheia, com convidados de branco sob tecidos e luz azul',
    tone: 'amber',
  },
  {
    name: 'Corporativos',
    kicker: 'Convenções e lançamentos',
    text: 'Áudio claro para palestras, LED para apresentações e transmissão, e operação alinhada ao roteiro.',
    image: asset('/assets/trabalhos/corporativo-1.webp'),
    alt: 'Auditório corporativo com iluminação azul e telão com a marca Firma Sound',
    tone: 'blue',
  },
  {
    name: 'Festas',
    kicker: 'Aniversários e celebrações',
    text: 'Pista iluminada, som dimensionado para o espaço e efeitos programados para os momentos certos.',
    image: asset('/assets/trabalhos/festa-pista.webp'),
    alt: 'Pista de festa de 15 anos cheia, com luz roxa e convidados dançando',
    tone: 'magenta',
  },
  {
    name: 'Shows',
    kicker: 'Bandas, artistas e festivais',
    text: 'Palco, PA, monitoração e iluminação cênica, com técnicos no house mix durante toda a apresentação.',
    image: asset('/assets/trabalhos/festa-15-anos-1.webp'),
    alt: 'Cantor no palco com microfone, sob refletores, cantando para o público',
    tone: 'violet',
  },
];

// Vídeos reais de eventos da Firma Sound (verticais, 9:16).
// Os arquivos saem de referencias/trabalhos, comprimidos para a web.
const work = (file, title) => ({
  title,
  video: asset(`/assets/trabalhos/${file}.mp4`),
  poster: asset(`/assets/trabalhos/${file}.webp`),
});
export const WORKS = [
  work('casamento', 'Casamento'),
  work('festa-15-anos-1', 'Festa 15 anos'),
  work('corporativo-2', 'Evento corporativo'),
  work('festa-privada', 'Festa privada'),
  work('festa-15-anos-2', 'Festa 15 anos'),
  work('corporativo-1', 'Evento corporativo'),
];

export const PROCESS = [
  { title: 'Conversa', text: 'Você conta data, local, tipo de evento e público pelo WhatsApp.' },
  { title: 'Visita técnica', text: 'Medimos o espaço, a energia disponível e os acessos para a carga.' },
  { title: 'Projeto e proposta', text: 'Equipamentos dimensionados para o porte do evento, com valores claros.' },
  { title: 'Montagem e testes', text: 'Estrutura, som, luz e LED montados e testados antes da abertura.' },
  { title: 'Operação ao vivo', text: 'Técnicos na mesa de som e de luz durante todo o evento.' },
  { title: 'Desmontagem', text: 'Retiramos tudo no horário combinado com o local.' },
];
