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
# v3 REWRITE: further tension rewrite per second round of customer feedback
# (still explains "what the platform is" before convincing "why to care";
# product mention needs to be delayed further). Act 1 grew from 3 segments to
# 6 short staccato lines (a1_believes/a1_tested/a1_surface/a1_where/a1_who/
# a1_why, near-verbatim reviewer wording, no product mention). Act 3 grew
# from 5 to 7 segments: a3_infra was replaced by a3_notsoftware (same beat,
# reworded), and two NEW emotional beats (a3_capability, a3_fearless) were
# inserted BEFORE the spec-sheet numbers (a3_numbers) and mechanism close
# (a3_mechanism) so the emotional/capability payoff lands before the
# functional detail, per the reviewer's "why before what" note. a2_* (Act 2,
# unchanged) and a3_another/a3_this/a3_numbers/a3_mechanism (unchanged
# wording, reused) keep their original audio files -- only their absolute
# position shifts, since Act 1's 6 short staccato lines run shorter overall
# than the old 3 longer lines, net pulling everything ~1.66s earlier even
# after adding the 2 new Act 3 beats. The 3 scenario cuts
# (seg00-08), proof/metric endcard beats (seg09-11, seg14), philosophy close
# (a5_*), and tagline/CTA (seg12-13) are all UNCHANGED audio -- only their
# absolute position shifts by the same +1.6606s delta the new intro (100.858s,
# was 99.197s) introduces. TOTAL_DUR grew from 272.389s (v2) to 274.050s (v3).
# See content/video_script_v2_draft.md for the full script and the
# code_execution timing derivation for this rebuild for the arithmetic.
# ============================================================================
TOTAL_DUR=274.050

S=voiceover_segments
S2=voiceover_segments_v2
FADEIN="afade=type=in:start_time=0:duration=0.02"
PREPAD="adelay=50|50"

ffmpeg -y \
  -i ${S2}/a1_believes.mp3 \
  -i ${S2}/a1_tested.mp3 \
  -i ${S2}/a1_surface.mp3 \
  -i ${S2}/a1_where.mp3 \
  -i ${S2}/a1_who.mp3 \
  -i ${S2}/a1_why.mp3 \
  -i ${S2}/a2_open.mp3 \
  -i ${S2}/a2_warroom.mp3 \
  -i ${S2}/a2_chaos.mp3 \
  -i ${S2}/a2_waiting.mp3 \
  -i ${S2}/a2_thirty.mp3 \
  -i ${S2}/a3_another.mp3 \
  -i ${S2}/a3_notsoftware.mp3 \
  -i ${S2}/a3_this.mp3 \
  -i ${S2}/a3_capability.mp3 \
  -i ${S2}/a3_fearless.mp3 \
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
  [1:a]${PREPAD},${FADEIN},adelay=4743|4743[a1];
  [2:a]${PREPAD},${FADEIN},adelay=8429|8429[a2];
  [3:a]${PREPAD},${FADEIN},adelay=11567|11567[a3];
  [4:a]${PREPAD},${FADEIN},adelay=14234|14234[a4];
  [5:a]${PREPAD},${FADEIN},adelay=17084|17084[a5];
  [6:a]${PREPAD},${FADEIN},adelay=21158|21158[a6];
  [7:a]${PREPAD},${FADEIN},adelay=29045|29045[a7];
  [8:a]${PREPAD},${FADEIN},adelay=33719|33719[a8];
  [9:a]${PREPAD},${FADEIN},adelay=42469|42469[a9];
  [10:a]${PREPAD},${FADEIN},adelay=48475|48475[a10];
  [11:a]${PREPAD},${FADEIN},adelay=56467|56467[a11];
  [12:a]${PREPAD},${FADEIN},adelay=58947|58947[a12];
  [13:a]${PREPAD},${FADEIN},adelay=66129|66129[a13];
  [14:a]${PREPAD},${FADEIN},adelay=69158|69158[a14];
  [15:a]${PREPAD},${FADEIN},adelay=79736|79736[a15];
  [16:a]${PREPAD},${FADEIN},adelay=83626|83626[a16];
  [17:a]${PREPAD},${FADEIN},adelay=93159|93159[a17];
  [18:a]${PREPAD},${FADEIN},adelay=101758|101758[a18];
  [19:a]${PREPAD},${FADEIN},adelay=109489|109489[a19];
  [20:a]${PREPAD},${FADEIN},adelay=119833|119833[a20];
  [21:a]${PREPAD},${FADEIN},adelay=134349|134349[a21];
  [22:a]${PREPAD},${FADEIN},adelay=139259|139259[a22];
  [23:a]${PREPAD},${FADEIN},adelay=148349|148349[a23];
  [24:a]${PREPAD},${FADEIN},adelay=162317|162317[a24];
  [25:a]${PREPAD},${FADEIN},adelay=165190|165190[a25];
  [26:a]${PREPAD},${FADEIN},adelay=173078|173078[a26];
  [27:a]${PREPAD},${FADEIN},adelay=184303|184303[a27];
  [28:a]${PREPAD},${FADEIN},adelay=197259|197259[a28];
  [29:a]${PREPAD},${FADEIN},adelay=209510|209510[a29];
  [30:a]${PREPAD},${FADEIN},adelay=228910|228910[a30];
  [31:a]${PREPAD},${FADEIN},adelay=241239|241239[a31];
  [32:a]${PREPAD},${FADEIN},adelay=245879|245879[a32];
  [33:a]${PREPAD},${FADEIN},adelay=250362|250362[a33];
  [34:a]${PREPAD},${FADEIN},adelay=258720|258720[a34];
  [35:a]${PREPAD},${FADEIN},adelay=264361|264361[a35];
  [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11][a12][a13][a14][a15][a16][a17][a18][a19][a20][a21][a22][a23][a24][a25][a26][a27][a28][a29][a30][a31][a32][a33][a34][a35]amix=inputs=36:normalize=0:dropout_transition=0[mixed];
  [mixed]apad=whole_dur=${TOTAL_DUR}[out]
  " -map "[out]" -c:a aac -b:a 192k mixed_voiceover.m4a

echo "AUDIO MIX DONE"
