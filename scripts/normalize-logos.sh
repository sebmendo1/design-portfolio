#!/usr/bin/env bash
# Normalize company logos onto a white square canvas.
# Removes baked-in black or white backgrounds without touching logo artwork.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/assets/logos"
SRC_BASE="${CURSOR_ASSETS:-$ROOT/scripts/logo-sources}"
CANVAS=128
CONTENT=104

mkdir -p "$OUT"

corner_flood() {
  local src="$1"
  magick "$src" \
    -alpha set \
    -bordercolor none \
    -border 1 \
    -fill none \
    -draw "color 0,0 floodfill" \
    -draw "color %[fx:w-1],0 floodfill" \
    -draw "color 0,%[fx:h-1] floodfill" \
    -draw "color %[fx:w-1],%[fx:h-1] floodfill" \
    -shave 1x1 \
    png:-
}

finalize() {
  local src="$1"
  local dest="$2"
  magick "$src" \
    -resize "${CONTENT}x${CONTENT}" \
    -gravity center \
    -background white \
    -extent "${CANVAS}x${CANVAS}" \
    -alpha off \
    -type TrueColor \
    -strip \
    "PNG24:${dest}"
}

normalize_logo() {
  local src="$1"
  local dest="$2"

  read -r r g b <<< "$(magick "$src" -format "%[fx:int(255*u.r)] %[fx:int(255*u.g)] %[fx:int(255*u.b)]" info:)"

  local tmp
  tmp="$(mktemp /tmp/logo-XXXXXX.png)"

  if (( r < 40 && g < 40 && b < 40 )); then
    magick "$src" -fuzz 22% -transparent black -trim +repage "$tmp"
  elif (( r > 215 && g > 215 && b > 215 )); then
    corner_flood "$src" | magick png:- -trim +repage "$tmp"
  else
    magick "$src" -fuzz 22% -transparent black -trim +repage "$tmp"
  fi

  finalize "$tmp" "$dest"
  rm -f "$tmp"
}

normalize_writer_logo() {
  local src="$1"
  local dest="$2"
  local tmp
  tmp="$(mktemp -d)"

  # Original is a white mark on black — invert to black on white for contrast
  magick "$src" -background black -flatten "$tmp/flat.png"
  magick "$tmp/flat.png" -negate "$tmp/inverted.png"
  magick "$tmp/inverted.png" -fuzz 1% -trim +repage "$tmp/trimmed.png"
  finalize "$tmp/trimmed.png" "$dest"

  rm -rf "$tmp"
}

normalize_logo "$SRC_BASE/chase-bank-cb008bb5-04ad-468c-8822-f25b329a6695.png" "$OUT/chase.png"
normalize_logo "$SRC_BASE/Salesforce-752bdb6f-9e52-4a74-b37a-9d420a68f230.png" "$OUT/salesforce.png"
normalize_writer_logo "$SRC_BASE/Writer-41e80b92-98d8-4eee-907f-de1b49d83f81.png" "$OUT/writer.png"
normalize_logo "$SRC_BASE/Shift-Logo-7d0c2638-2c2f-4051-966a-a314f6e0a7cc.png" "$OUT/shift.png"

# Chorus AI: vector source avoids dark raster fringe from the original PNG
finalize "$OUT/chorus-ai.svg" "$OUT/chorus-ai.png"

echo "Normalized logos:"
magick identify "$OUT"/*.png "$OUT"/*.svg

for f in salesforce chorus-ai; do
  magick "$OUT/$f.png" -format "$f type:%[type] margin:%[pixel:p{8,8}]" info:
  echo
done
