#!/bin/bash
set -e
cd "$(dirname "$0")"

# Mixes all narration segments into a single audio track timed against build_video.sh's
# timeline. Every delay below is the absolute time (ms) at which that segment's caption
# reaches full opacity in the video -- audio never starts before its caption is legible.
# See .agents/memory/elevenlabs-voiceover-mixing.md for why this sync rule matters and
# why output is .m4a (not raw .aac).
#
# Every segment also gets a short afade=type=in (150ms) applied BEFORE the adelay shift.
# Root cause fix for the "audio sounds cut off at the start of every line" complaint:
# the raw TTS mp3s start at full amplitude with zero attack ramp (verified via
# showwavespic), which reads as a clipped/truncated word to the ear even though no
# audio data is actually missing. Ramping 0 -> full over 150ms removes that perceived
# clip without a perceptible delay to speech onset.

TOTAL_DUR=153.523

S=voiceover_segments
FADEIN="afade=type=in:start_time=0:duration=0.15"

ffmpeg -y \
  -i ${S}/intro01_situations.mp3 \
  -i ${S}/intro02_oldway.mp3 \
  -i ${S}/intro03_stages.mp3 \
  -i ${S}/intro04_12min.mp3 \
  -i ${S}/seg00_growth_hook.mp3 \
  -i ${S}/seg01_growth_old.mp3 \
  -i ${S}/seg02_growth_ready.mp3 \
  -i ${S}/seg03_risk_hook.mp3 \
  -i ${S}/seg04_risk_old.mp3 \
  -i ${S}/seg05_risk_ready.mp3 \
  -i ${S}/seg06_transform_hook.mp3 \
  -i ${S}/seg07_transform_old.mp3 \
  -i ${S}/seg08_transform_ready.mp3 \
  -i ${S}/seg09_endcard_depth.mp3 \
  -i ${S}/seg10_endcard_cost.mp3 \
  -i ${S}/seg11_endcard_metric.mp3 \
  -i ${S}/seg12_endcard_tagline.mp3 \
  -i ${S}/seg13_endcard_cta.mp3 \
  -filter_complex "
  [0:a]${FADEIN},adelay=900|900[a0];
  [1:a]${FADEIN},adelay=5758|5758[a1];
  [2:a]${FADEIN},adelay=12941|12941[a2];
  [3:a]${FADEIN},adelay=21848|21848[a3];
  [4:a]${FADEIN},adelay=34804|34804[a4];
  [5:a]${FADEIN},adelay=42536|42536[a5];
  [6:a]${FADEIN},adelay=51913|51913[a6];
  [7:a]${FADEIN},adelay=62589|62589[a7];
  [8:a]${FADEIN},adelay=67499|67499[a8];
  [9:a]${FADEIN},adelay=74133|74133[a9];
  [10:a]${FADEIN},adelay=86064|86064[a10];
  [11:a]${FADEIN},adelay=88936|88936[a11];
  [12:a]${FADEIN},adelay=94447|94447[a12];
  [13:a]${FADEIN},adelay=105568|105568[a13];
  [14:a]${FADEIN},adelay=117818|117818[a14];
  [15:a]${FADEIN},adelay=130069|130069[a15];
  [16:a]${FADEIN},adelay=138192|138192[a16];
  [17:a]${FADEIN},adelay=143834|143834[a17];
  [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17]amix=inputs=18:normalize=0:dropout_transition=0[mixed];
  [mixed]apad=whole_dur=${TOTAL_DUR}[out]
  " -map "[out]" -c:a aac -b:a 192k mixed_voiceover.m4a

echo "AUDIO MIX DONE"
