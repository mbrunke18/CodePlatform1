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

# TOTAL_DUR and all delays below were recomputed a second time after a full
# script rewrite of the intro (4 beats) and all 3 scenario cuts (old/ready
# lines) to: (a) reframe situations as expected-category/unknown-timing and
# name the "mobilization gap" explicitly, and (b) replace generic "pre-staged
# and authorized" language in each scenario with specific product depth
# (protocol numbers, what is actually pre-approved, system-detected/executive-
# authorized mechanism) per feedback that the script read like a generic pitch
# rather than one written with real product knowledge. The fade-in duration
# (20ms) above is UNCHANGED -- this revision only touched narration content and
# its resulting timing, never the onset/fade approach. See build_video.sh
# build_intro/build_cut1/build_cut2/build_cut3/build_endcard for the matching
# on-screen caption timings -- the two files must be kept in lockstep.
TOTAL_DUR=182.622

S=voiceover_segments
FADEIN="afade=type=in:start_time=0:duration=0.02"
# PREPAD inserts 50ms of true silence at the very start of each raw segment's
# OWN local timeline, before FADEIN is applied. This guarantees the 20ms fade
# (FADEIN, untouched -- do not change its duration) always ramps across pure
# silence, regardless of how little natural lead-in silence a given ElevenLabs
# take happens to have (measured onsets ranged 15-117ms across segments,
# variance driven by which consonant a word starts with -- e.g. sibilants like
# "System" read as louder earlier than plosives like "Protocol"). Without this
# guaranteed buffer, a take with an unusually early true onset (e.g. ~15ms)
# could have its first phoneme partially ramped-through by the fade, heard as
# a clipped/missing first word. PREPAD does not change FADEIN or the overall
# per-segment absolute adelay position in the mix -- it only pads the content
# fed into the existing fade so the fade always has silence to work with.
PREPAD="adelay=50|50"

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
  [0:a]${PREPAD},${FADEIN},adelay=900|900[a0];
  [1:a]${PREPAD},${FADEIN},adelay=6881|6881[a1];
  [2:a]${PREPAD},${FADEIN},adelay=14404|14404[a2];
  [3:a]${PREPAD},${FADEIN},adelay=25113|25113[a3];
  [4:a]${PREPAD},${FADEIN},adelay=39088|39088[a4];
  [5:a]${PREPAD},${FADEIN},adelay=46820|46820[a5];
  [6:a]${PREPAD},${FADEIN},adelay=57163|57163[a6];
  [7:a]${PREPAD},${FADEIN},adelay=71680|71680[a7];
  [8:a]${PREPAD},${FADEIN},adelay=76590|76590[a8];
  [9:a]${PREPAD},${FADEIN},adelay=85680|85680[a9];
  [10:a]${PREPAD},${FADEIN},adelay=99647|99647[a10];
  [11:a]${PREPAD},${FADEIN},adelay=102520|102520[a11];
  [12:a]${PREPAD},${FADEIN},adelay=110408|110408[a12];
  [13:a]${PREPAD},${FADEIN},adelay=121633|121633[a13];
  [14:a]${PREPAD},${FADEIN},adelay=134589|134589[a14];
  [15:a]${PREPAD},${FADEIN},adelay=146840|146840[a15];
  [16:a]${PREPAD},${FADEIN},adelay=154963|154963[a16];
  [17:a]${PREPAD},${FADEIN},adelay=167292|167292[a17];
  [18:a]${PREPAD},${FADEIN},adelay=172933|172933[a18];
  [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18]amix=inputs=19:normalize=0:dropout_transition=0[mixed];
  [mixed]apad=whole_dur=${TOTAL_DUR}[out]
  " -map "[out]" -c:a aac -b:a 192k mixed_voiceover.m4a

echo "AUDIO MIX DONE"
