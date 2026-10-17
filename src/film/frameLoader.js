// Carregador de frames com fila de prioridade e limite de downloads simultâneos.
//
// Estratégia ("refinamento progressivo"):
//   1. frame 0 (já pré-carregado pelo <link rel="preload"> do index.html)
//   2. um frame a cada 16, depois a cada 8, 4, 2 e por fim todos.
// Assim, em poucos segundos existe um frame "próximo o bastante" para qualquer
// posição do scroll, e a sequência vai ficando mais fina sem bloquear nada.
//
// As imagens ficam guardadas como HTMLImageElement já decodificados (img.decode()).
// Não usamos ImageBitmap para a sequência inteira: 150 frames decodificados em
// 1280x720 ocupariam ~550 MB de memória, o que derruba celulares. O navegador
// gerencia o cache de decodificação das <img> sozinho.

function buildOrder(count, step) {
  const order = [0];
  const seen = new Uint8Array(count);
  seen[0] = 1;
  for (let stride = 16; stride >= step; stride = stride / 2) {
    for (let i = 0; i < count; i += stride) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
    if (stride === 1) break;
  }
  // o último frame também entra cedo: é o fim da narrativa
  const last = count - 1;
  if (!seen[last] && last % step === 0) order.splice(Math.min(order.length, 12), 0, last);
  return order;
}

export function createFrameLoader({ count, urlFor, concurrency = 4, step = 1, onFrame }) {
  const images = new Array(count).fill(null);
  const status = new Uint8Array(count); // 0 nada, 1 baixando, 2 pronto, 3 erro
  let queue = buildOrder(count, step);
  let active = 0;
  let readyCount = 0;
  let destroyed = false;
  const pending = new Set();

  function load(i) {
    status[i] = 1;
    active += 1;
    const img = new Image();
    img.decoding = 'async';
    pending.add(img);
    img.src = urlFor(i);
    img
      .decode()
      .then(() => {
        if (destroyed) return;
        images[i] = img;
        status[i] = 2;
        readyCount += 1;
        onFrame?.(i, readyCount);
      })
      .catch(() => {
        status[i] = 3;
      })
      .finally(() => {
        pending.delete(img);
        active -= 1;
        if (!destroyed) pump();
      });
  }

  function pump() {
    while (active < concurrency && queue.length) {
      const i = queue.shift();
      if (status[i] === 0) load(i);
    }
  }

  return {
    start() {
      pump();
    },
    // Quando o usuário pula para uma região ainda não carregada,
    // os frames ao redor passam para a frente da fila.
    prioritize(center, radius = 6) {
      if (destroyed) return;
      const near = [];
      for (let d = 0; d <= radius; d += 1) {
        for (const i of d === 0 ? [center] : [center - d * step, center + d * step]) {
          if (i >= 0 && i < count && status[i] === 0) near.push(i);
        }
      }
      if (!near.length) return;
      const set = new Set(near);
      queue = near.concat(queue.filter((i) => !set.has(i)));
      pump();
    },
    // Frame pronto mais próximo do desejado (nunca deixa a tela vazia).
    nearest(target) {
      if (status[target] === 2) return target;
      for (let d = 1; d < count; d += 1) {
        const a = target - d;
        const b = target + d;
        // prefere o frame anterior: parece "ainda não chegou", não "pulou à frente"
        if (a >= 0 && status[a] === 2) return a;
        if (b < count && status[b] === 2) return b;
      }
      return -1;
    },
    image(i) {
      return images[i];
    },
    get ready() {
      return readyCount;
    },
    destroy() {
      destroyed = true;
      queue = [];
      pending.forEach((img) => {
        img.src = '';
      });
      pending.clear();
      images.fill(null);
    },
  };
}
