import { buildWhatsAppLink } from '../content/site.js';

function ChatIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20l1.4-4A8 8 0 1 1 8.5 19z" />
      <path d="M9 10.5c.5 1.6 2 3.1 3.6 3.6l1.2-1.2 2 1-.6 1.6c-3 .3-7-3.7-6.7-6.7l1.6-.6 1 2z" />
    </svg>
  );
}

// Botão único de orçamento: sempre abre o WhatsApp com a mensagem padrão.
// size: 'sm' (cabeçalho) | 'md' | 'lg' (abertura e chamada final)
// variant: 'solid' | 'outline'
export default function QuoteButton({ size = 'md', variant = 'solid', label = 'Faça seu orçamento', icon = true, className = '', ...rest }) {
  return (
    <a
      className={`btn btn--${size} btn--${variant} ${className}`.trim()}
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} pelo WhatsApp (abre em nova aba)`}
      {...rest}
    >
      {icon && <ChatIcon size={size === 'sm' ? 18 : 20} />}
      <span>{label}</span>
    </a>
  );
}
