#!/bin/bash
set -e
cd "$(dirname "$0")"

# Mixes all narration segments into a single audio track timed against build_video.sh's
# timeline. Every delay below is the absolute time (ms) at which that segment's caption
# reaches full opacity in the video -- audio never starts before its caption is legible.
# See .agents/memory/elevenlabs-voiceover-mixing.md for why this sync rule matters and
# why output is .m4a (not raw .aac).

TOTAL_DUR=127.098

S=voiceover_segments

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
  [0:a]adelay=600|600[a0];
  [1:a]adelay=4300|4300[a1];
  [2:a]adelay=8400|8400[a2];
  [3:a]adelay=12100|12100[a3];
  [4:a]adelay=18400|18400[a4];
  [5:a]adelay=25922|25922[a5];
  [6:a]adelay=33288|33288[a6];
  [7:a]adelay=44030|44030[a7];
  [8:a]adelay=50717|50717[a8];
  [9:a]adelay=59023|59023[a9];
  [10:a]adelay=69243|69243[a10];
  [11:a]adelay=75642|75642[a11];
  [12:a]adelay=81493|81493[a12];
  [13:a]adelay=90224|90224[a13];
  [14:a]adelay=98673|98673[a14];
  [15:a]adelay=105869|105869[a15];
  [16:a]adelay=113639|113639[a16];
  [17:a]adelay=119999|119999[a17];
  [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17]amix=inputs=18:normalize=0:dropout_transition=0[mixed];
  [mixed]apad=whole_dur=${TOTAL_DUR}[out]
  " -map "[out]" -c:a aac -b:a 192k mixed_voiceover.m4a

echo "AUDIO MIX DONE"
