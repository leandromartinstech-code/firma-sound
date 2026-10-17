# Firma Sound — site

Landing page em Vite + React. A abertura é um filme controlado pelo scroll: uma sequência de frames WebP desenhada num `<canvas>`.

## Rodar no seu computador

```bash
cd site
npm install      # baixa React e Vite (só na primeira vez)
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão final em dist/
npm run preview  # testa a versão final
```

## Onde está cada coisa

| Caminho | O que é |
| --- | --- |
| `src/film/FilmSequence.jsx` | A cena: seção alta + área fixa (sticky) + canvas + textos |
| `src/film/frameLoader.js` | Fila de download dos frames (4 por vez, em ondas) |
| `src/film/FilmStatic.jsx` | Versão sem animação (movimento reduzido) |
| `src/content/film.js` | Quantidade de frames, tempos dos textos, altura da seção |
| `src/content/site.js` | WhatsApp, contatos, serviços, eventos, portfólio |
| `src/styles/global.css` | Cores, tipografia e layout |
| `public/assets/films/hero/` | Frames `desktop/` (16:9) e `mobile/` (3:4) |
| `scripts/build-frames.sh` | Gera os frames a partir do vídeo MP4 (precisa de `brew install ffmpeg webp`) |

## Tarefas comuns

- **Número do WhatsApp:** em `src/content/site.js`, preencha `whatsapp: '55DDDNUMERO'`.
- **Regerar os frames:** `npm run frames -- ../referencias/Sound_engineer_operating_mixing.mp4`. Para mudar quantidade, largura ou qualidade, veja o topo de `scripts/build-frames.sh` e atualize `count`/`width`/`height` em `src/content/film.js`.
- **Cena mais lenta ou mais rápida:** `FILM_SCROLL_SCREENS` em `src/content/film.js`.
- **Quando cada texto aparece:** `from` / `to` em `FILM_CHAPTERS` (0 = início da cena, 1 = fim).

Tudo entre colchetes (`[CNPJ]`, `[Nome do evento]`...) é placeholder e precisa ser confirmado antes de publicar.
