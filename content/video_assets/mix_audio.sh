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
# actual spoken content, not a bug. A 20ms fade fully resolves to 100% BEFORE the
# ~30ms onset, so it only smooths any digital click at t=0 and never touches real
# speech content.
#
# ============================================================================
# v2 REWRITE: full narrative restructure per potential-customer feedback (video
# explained the product too quickly, no emotional build, no closing philosophy).
# 13 new segments (voiceover_segments_v2/) replace the old 4-segment "intro"
# with a 3-act build (THE QUESTION -> THE OLD WAY -> THE TURN) that plays
# entirely before any product screen. 3 new segments insert a philosophy close
# ("Organizations do not fail because they lack talented people...") between
# the existing ADVANCE beat and the locked tagline. The 3 scenario cuts
# (seg00-08) and the existing proof/metric endcard beats (seg09-11, seg14) and
# tagline/CTA (seg12-13) are UNCHANGED audio -- only their absolute position in
# the timeline shifts later, since the new intro (99.197s) and philosophy
# insert (+17.481s) push everything after them back. TOTAL_DUR grew from
# 193.899s (v1) to 272.389s (v2). All delays below were recomputed from
# scratch off the new global timeline -- see content/video_script_v2_draft.md
# for the full script and the code_execution timing derivation for this
# rebuild for the arithmetic.
# ============================================================================
TOTAL_DUR=272.389

S=voiceover_segments
S2=voiceover_segments_v2
FADEIN="afade=type=in:start_time=0:duration=0.02"
PREPAD="adelay=50|50"

ffmpeg -y \
  -i ${S2}/a1_question.mp3 \
  -i ${S2}/a1_existed.mp3 \
  -i ${S2}/a1_faced.mp3 \
  -i ${S2}/a2_open.mp3 \
  -i ${S2}/a2_warroom.mp3 \
  -i ${S2}/a2_chaos.mp3 \
  -i ${S2}/a2_waiting.mp3 \
  -i ${S2}/a2_thirty.mp3 \
  -i ${S2}/a3_another.mp3 \
  -i ${S2}/a3_infra.mp3 \
  -i ${S2}/a3_this.mp3 \
  -i ${S2}/a3_numbers.mp3 \
  -i ${S2}/a3_mechanism.mp3 \
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
  -i ${S2}/a5_fail.mp3 \
  -i ${S2}/a5_disappear.mp3 \
  -i ${S2}/a5_capability.mp3 \
  -i ${S}/seg12_endcard_tagline.mp3 \
  -i ${S}/seg13_endcard_cta.mp3 \
  -filter_complex "
  [0:a]${PREPAD},${FADEIN},adelay=900|900[a0];
  [1:a]${PREPAD},${FADEIN},adelay=11791|11791[a1];
  [2:a]${PREPAD},${FADEIN},adelay=23597|23597[a2];
  [3:a]${PREPAD},${FADEIN},adelay=29708|29708[a3];
  [4:a]${PREPAD},${FADEIN},adelay=37595|37595[a4];
  [5:a]${PREPAD},${FADEIN},adelay=42269|42269[a5];
  [6:a]${PREPAD},${FADEIN},adelay=51018|51018[a6];
  [7:a]${PREPAD},${FADEIN},adelay=57025|57025[a7];
  [8:a]${PREPAD},${FADEIN},adelay=65017|65017[a8];
  [9:a]${PREPAD},${FADEIN},adelay=67497|67497[a9];
  [10:a]${PREPAD},${FADEIN},adelay=78937|78937[a10];
  [11:a]${PREPAD},${FADEIN},adelay=81966|81966[a11];
  [12:a]${PREPAD},${FADEIN},adelay=91499|91499[a12];
  [13:a]${PREPAD},${FADEIN},adelay=100097|100097[a13];
  [14:a]${PREPAD},${FADEIN},adelay=107828|107828[a14];
  [15:a]${PREPAD},${FADEIN},adelay=118172|118172[a15];
  [16:a]${PREPAD},${FADEIN},adelay=132688|132688[a16];
  [17:a]${PREPAD},${FADEIN},adelay=137598|137598[a17];
  [18:a]${PREPAD},${FADEIN},adelay=146688|146688[a18];
  [19:a]${PREPAD},${FADEIN},adelay=160656|160656[a19];
  [20:a]${PREPAD},${FADEIN},adelay=163529|163529[a20];
  [21:a]${PREPAD},${FADEIN},adelay=171417|171417[a21];
  [22:a]${PREPAD},${FADEIN},adelay=182642|182642[a22];
  [23:a]${PREPAD},${FADEIN},adelay=195598|195598[a23];
  [24:a]${PREPAD},${FADEIN},adelay=207849|207849[a24];
  [25:a]${PREPAD},${FADEIN},adelay=227249|227249[a25];
  [26:a]${PREPAD},${FADEIN},adelay=239578|239578[a26];
  [27:a]${PREPAD},${FADEIN},adelay=244218|244218[a27];
  [28:a]${PREPAD},${FADEIN},adelay=248701|248701[a28];
  [29:a]${PREPAD},${FADEIN},adelay=257059|257059[a29];
  [30:a]${PREPAD},${FADEIN},adelay=262700|262700[a30];
  [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18][a19][a20][a21][a22][a23][a24][a25][a26][a27][a28][a29][a30]amix=inputs=31:normalize=0:dropout_transition=0[mixed];
  [mixed]apad=whole_dur=${TOTAL_DUR}[out]
  " -map "[out]" -c:a aac -b:a 192k mixed_voiceover.m4a

echo "AUDIO MIX DONE"
