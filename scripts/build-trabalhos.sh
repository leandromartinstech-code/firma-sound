#!/usr/bin/env bash
# Comprime os vídeos de trabalhos (../referencias/trabalhos) para a web e gera as capas.
# Uso (dentro de firma-sound/site):  npm run trabalhos
# Para incluir um vídeo novo: adicione uma linha enc abaixo e um work(...) em src/content/site.js.
set -euo pipefail
SRC=../referencias/trabalhos
OUT=public/assets/trabalhos
enc() { # enc <arquivo de origem> <nome de saída> <segundo da capa>
  ffmpeg -hide_banner -loglevel error -y -i "$SRC/$1" -vf "scale=540:-2:flags=lanczos" \
    -c:v libx264 -preset slow -crf 29 -maxrate 1400k -bufsize 2800k -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 80k -ac 2 -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -hide_banner -loglevel error -y -ss "$3" -i "$SRC/$1" -frames:v 1 -vf "scale=720:-2:flags=lanczos" /tmp/capa.png
  cwebp -quiet -q 75 -m 6 /tmp/capa.png -o "$OUT/$2.webp"
  echo "$2: $(du -h "$OUT/$2.mp4" | cut -f1) + capa $(du -h "$OUT/$2.webp" | cut -f1)"
}
enc "casamento 01.mp4" casamento 15
enc "evento corporativo 01.mp4" corporativo-1 2
enc "evento corporativo 02.mp4" corporativo-2 14.5
enc "festa 15 anos 01.mp4" festa-15-anos-1 5.5
enc "festa 15 anos 02.mp4" festa-15-anos-2 33
enc "festa privada 01.mp4" festa-privada 7.7
# Capa extra para "Festas" na seção de eventos (pista cheia)
ffmpeg -hide_banner -loglevel error -y -ss 16.5 -i "$SRC/festa 15 anos 02.mp4" -frames:v 1 -vf "scale=720:-2:flags=lanczos" /tmp/capa.png
cwebp -quiet -q 75 -m 6 /tmp/capa.png -o "$OUT/festa-pista.webp"
rm -f /tmp/capa.png
du -sh "$OUT"
