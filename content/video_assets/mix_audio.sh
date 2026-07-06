#!/bin/bash
set -e
cd "$(dirname "$0")"

# Mixes all narration segments into a single audio track timed against build_video.sh's
# timeline. Every delay below is the absolute time (ms) at which that segment's caption
# reaches full opacity in the video -- audio never starts before its caption is legible.
# See .agents/memory/elevenlabs-voiceover-mixing.md for why this sync rule matters and
# why output is .m4a (not raw .aac).
#
# Every segment also gets a very short afade=type=in (20ms) applied BEFORE the adelay
# shift. IMPORTANT: astats RMS analysis showed raw TTS segments are true digital
# silence (~-88dB) through ~30ms, then have a REAL, legitimate speech onset transient
# at 30-50ms that jumps straight to near-full loudness (-25dB -> -17dB) -- that is
# actual spoken content, not a bug. The earlier 150ms fade was too long: it ramped
# amplitude to only ~27-33% at that exact 30-50ms onset window, actively muffling/
# swallowing the real first phoneme -- which is why "first word(s) cut off" persisted
# even after adding a fade. A 20ms fade fully resolves to 100% BEFORE the ~30ms onset,
# so it only smooths any digital click at t=0 and never touches real speech content.

# TOTAL_DUR and all delays below were recomputed after: (a) shortening the fade
# (see above), (b) revising intro03 (situation->trigger->protocol chain) and
# seg09 (breadth: 231 triggers / every team+function, not just the 3 situations
# shown), and (c) inserting a new seg14 ADVANCE beat between the 3,600x metric
# and the closing tagline. See build_video.sh build_intro/build_endcard for the
# matching on-screen caption timings -- the two files must be kept in lockstep.
TOTAL_DUR=166.034

S=voiceover_segments
FADEIN="afade=type=in:start_time=0:duration=0.02"

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
  -i ${S}/seg14_endcard_advance.mp3 \
  -i ${S}/seg12_endcard_tagline.mp3 \
  -i ${S}/seg13_endcard_cta.mp3 \
  -filter_complex "
  [0:a]${FADEIN},adelay=900|900[a0];
  [1:a]${FADEIN},adelay=5758|5758[a1];
  [2:a]${FADEIN},adelay=12941|12941[a2];
  [3:a]${FADEIN},adelay=21325|21325[a3];
  [4:a]${FADEIN},adelay=34281|34281[a4];
  [5:a]${FADEIN},adelay=42013|42013[a5];
  [6:a]${FADEIN},adelay=51390|51390[a6];
  [7:a]${FADEIN},adelay=62066|62066[a7];
  [8:a]${FADEIN},adelay=66976|66976[a8];
  [9:a]${FADEIN},adelay=73610|73610[a9];
  [10:a]${FADEIN},adelay=85541|85541[a10];
  [11:a]${FADEIN},adelay=88413|88413[a11];
  [12:a]${FADEIN},adelay=93924|93924[a12];
  [13:a]${FADEIN},adelay=105045|105045[a13];
  [14:a]${FADEIN},adelay=118001|118001[a14];
  [15:a]${FADEIN},adelay=130252|130252[a15];
  [16:a]${FADEIN},adelay=138375|138375[a16];
  [17:a]${FADEIN},adelay=150704|150704[a17];
  [18:a]${FADEIN},adelay=156345|156345[a18];
  [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18]amix=inputs=19:normalize=0:dropout_transition=0[mixed];
  [mixed]apad=whole_dur=${TOTAL_DUR}[out]
  " -map "[out]" -c:a aac -b:a 192k mixed_voiceover.m4a

echo "AUDIO MIX DONE"
