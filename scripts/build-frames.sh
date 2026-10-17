#!/usr/bin/env bash
# Gera as sequências de frames WebP do filme da abertura a partir do vídeo original (MP4).
# Uso (dentro de firma-sound/site):  npm run frames -- "../referencias/Sound_engineer_operating_mixing.mp4"
# Opcional: QUALITY=80 DESKTOP_WIDTH=1920 npm run frames -- "..."
# Precisa de ffmpeg e cwebp (no Mac: brew install ffmpeg webp).
# Para mudar a quantidade de frames, altere DESKTOP_STEP / MOBILE_STEP e rode de novo;
# depois atualize "count" em src/content/film.js (o script imprime os números).
#
# Por que o MP4 e não os JPGs de referencias/frames-jpg: aqueles JPGs foram exportados
# pelo ezgif muito comprimidos (~25 KB cada) e com 1 frame repetido a cada 5
# (conversão de 24 para 30 fps), o que deixava o movimento irregular.
set -euo pipefail

SRC="${1:-}"
if [ -z "$SRC" ] || [ ! -f "$SRC" ]; then
  echo "Informe o caminho do vídeo: npm run frames -- \"/caminho/do/video.mp4\"" >&2
  exit 1
fi

OUT="public/assets/films/hero"
DESKTOP_STEP=1   # todos os frames do vídeo (24 fps x 10 s = 240)
MOBILE_STEP=2    # metade (120): tela menor, menos dados
QUALITY=${QUALITY:-72}        # qualidade WebP (0-100). Mais alto = mais nítido e mais pesado
DESKTOP_WIDTH=${DESKTOP_WIDTH:-1600} # largura dos frames desktop (o vídeo 1080p tem 1920)

# 1. ffmpeg extrai os frames em PNG (sem perda) numa pasta temporária.
# 2. cwebp converte cada PNG em WebP, a única compressão com perda do processo.
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

extract() { # extract <pasta> <passo> [recorte]
  local dir="$TMP/$1" vf="select='not(mod(n\,$2))'"
  [ -n "${3:-}" ] && vf="$vf,$3"
  mkdir -p "$dir"
  # -fps_mode passthrough: um arquivo por frame real do vídeo, sem duplicar nem descartar.
  ffmpeg -hide_banner -loglevel error -y -i "$SRC" -vf "$vf" -fps_mode passthrough -an \
    -start_number 1 "$dir/frame_%04d.png"
}

encode() { # encode <pasta>
  # Sobrescreve os frames com o mesmo nome. Se a nova quantidade for MENOR,
  # os arquivos excedentes antigos continuam na pasta: apague-os à mão.
  mkdir -p "$OUT/$1"
  for png in "$TMP/$1"/frame_*.png; do
    cwebp -quiet -q $QUALITY -m 6 -sharp_yuv "$png" -o "$OUT/$1/$(basename "${png%.png}").webp"
  done
}

extract desktop $DESKTOP_STEP "scale=$DESKTOP_WIDTH:-2:flags=lanczos" # 16:9, reduzido com filtro de alta qualidade
extract mobile $MOBILE_STEP "crop=ih*3/4:ih:(iw-ih*3/4)/2:0" # recorte vertical 3:4 centralizado
encode desktop
encode mobile

for v in desktop mobile; do
  n=$(ls "$OUT/$v"/frame_*.webp | wc -l | tr -d ' ')
  size=$(du -sh "$OUT/$v" | cut -f1)
  echo "$v: $n frames, $size"
done
