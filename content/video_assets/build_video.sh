#!/bin/bash
set -e
cd "$(dirname "$0")"

FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
NAVY="0x0A0F2E"
GOLD="0xC9A84C"
TEAL="0x2B8A6E"
REDISH="0xB83228"

LOGO_CORNER=brand/vm_logo_corner.png
LOGO_HERO=brand/vm_logo_hero.png

# Persistent branding, drawn on every clip (cuts 1-3) using the REAL logo graphic
# (cropped from a live screenshot of the app's own VaughnMartinLogo component --
# see .agents/memory for why text-only "READINESS OS" labels were not sufficient).
# Corner logo dims are 340x88; placed inside the existing top navy header bar (h=130)
# so it never collides with the centered domain title.
brand_overlay_corner() {
  echo "movie=${LOGO_CORNER}[logo];[base][logo]overlay=x=40:y=28[branded];"
}

# Larger "hero" logo instance used at the two highest-recall moments: the very first
# frames of the video (intro) and the closing call-to-action (endcard).
brand_overlay_hero() {
  local Y="$1"
  echo "movie=${LOGO_HERO}[hlogo];[base][hlogo]overlay=x=(1920-771)/2:y=${Y}:enable='gte(t,0.05)'[branded];"
}

make_clip() {
  IMG="$1"
  OUT="$2"
  DOMAIN="$3"
  HOOKLINE="$4"
  OLDLINE="$5"
  READYLINE="$6"
  DUR="$7"
  CARD_START="$8"
  READY_FADE_START="$9"
  FPS=25
  FRAMES=$(python3 -c "print(int($DUR*$FPS))")
  OLD_FADE_END=${READY_FADE_START}
  CROSSFADE_MID=$(python3 -c "print((${CARD_START}+${READY_FADE_START})/2)")
  FADE_OUT_ST=$(python3 -c "print(${DUR}-0.6)")
  HOOK_ALPHA="min(1\,max(0\,min((t-0.6)/0.3\,(${CARD_START}-t)/0.3)))"
  OLD_ALPHA="min(1\,max(0\,min((t-${CARD_START})/0.3\,(${OLD_FADE_END}-t)/0.3)))"
  READY_ALPHA="min(1\,max(0\,(t-${READY_FADE_START})/0.3))"

  ffmpeg -y -loop 1 -i "$IMG" -vf "
    [0:v]scale=1920:1080,
    zoompan=z='min(zoom+0.00025,1.15)':d=${FRAMES}:s=1920x1080:fps=${FPS},
    drawbox=x=0:y=0:w=1920:h=130:color=${NAVY}@0.88:t=fill,
    drawtext=fontfile=${FONT}:text='${DOMAIN}':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=45:alpha='if(lt(t,0.6),0,1)',
    drawtext=fontfile=${FONT}:text='${HOOKLINE}':fontcolor=white:fontsize=27:x=(w-text_w)/2:y=175:alpha='${HOOK_ALPHA}',
    drawbox=x=0:y=800:w=1920:h=280:color=${NAVY}@0.92:t=fill:enable='gte(t,${CARD_START})',
    drawbox=x=0:y=800:w=8:h=280:color=${REDISH}:t=fill:enable='between(t,${CARD_START},${CROSSFADE_MID})',
    drawbox=x=0:y=800:w=8:h=280:color=${TEAL}:t=fill:enable='gte(t,${CROSSFADE_MID})',
    drawtext=fontfile=${FONT}:text='OLD MODEL':fontcolor=${REDISH}:fontsize=30:x=80:y=840:alpha='${OLD_ALPHA}',
    drawtext=fontfile=${FONT}:text='${OLDLINE}':fontcolor=white:fontsize=24:x=80:y=900:alpha='${OLD_ALPHA}',
    drawtext=fontfile=${FONT}:text='READINESS OS -- T+12\:00 -- MOBILIZED':fontcolor=${TEAL}:fontsize=28:x=80:y=840:alpha='${READY_ALPHA}',
    drawtext=fontfile=${FONT}:text='${READYLINE}':fontcolor=white:fontsize=24:x=80:y=900:alpha='${READY_ALPHA}'
    [base];
    $(brand_overlay_corner)
    [branded]fade=t=in:st=0:d=0.6,
    fade=t=out:st=${FADE_OUT_ST}:d=0.6:alpha=0
  " -frames:v ${FRAMES} -pix_fmt yuv420p -r ${FPS} "$OUT"
}

build_intro() {
# ============================================================================
# INTRO (33.904s): rewritten for persuasiveness -- names the company and the
# product explicitly ("VaughnMartin Readiness OS"), states the concrete cost of
# the old model (30 days to mobilize) before showing the payoff, and pairs the
# opening frame with the REAL hero logo graphic so brand identity is unmistakable
# from second one. Reveal timings are synced to the actual measured narration
# durations for the new script (see .agents/memory/elevenlabs-voiceover-mixing.md).
# ============================================================================
INTRO_DUR=33.904
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=${INTRO_DUR}:r=25" -vf "
[0:v]drawtext=fontfile=${FONT}:text='EVERY ORGANIZATION FACES SITUATIONS IT DOES NOT EXPECT':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=460:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='THE OLD WAY':fontcolor=${REDISH}:fontsize=30:x=(w-text_w)/2:y=600:alpha='if(lt(t,5.458),0,1)',
drawtext=fontfile=${FONT}:text='30 days just to mobilize -- before a single action is taken':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=650:alpha='if(lt(t,5.458),0,1)',
drawtext=fontfile=${FONT}:text='VAUGHNMARTIN READINESS OS':fontcolor=${TEAL}:fontsize=30:x=(w-text_w)/2:y=760:alpha='if(lt(t,12.641),0,1)',
drawtext=fontfile=${FONT}:text='180 Readiness Protocols\, staged before the trigger ever fires':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=810:alpha='if(lt(t,12.641),0,1)',
drawtext=fontfile=${FONT}:text='EXECUTION STARTS IN 12 MINUTES\, NOT 30 DAYS':fontcolor=${GOLD}:fontsize=38:x=(w-text_w)/2:y=910:alpha='if(lt(t,21.548),0,1)',
drawtext=fontfile=${FONT}:text='Watch it respond to 3 real situations below':fontcolor=0xB8BCC8:fontsize=24:x=(w-text_w)/2:y=965:alpha='if(lt(t,21.548),0,1)'
[base];
$(brand_overlay_hero 130)
[branded]fade=t=in:st=0:d=0.6,
fade=t=out:st=33.304:d=0.6
" -pix_fmt yuv420p -r 25 cut0_intro.mp4
}

# ============================================================================
# Per-cut timing: audio for each beat (hook/old/ready) starts exactly when its
# caption reaches full opacity (0.3s after the caption begins fading in), never
# before. CARD_START / READY_FADE_START / DUR below are derived from the actual
# measured durations of the rewritten narration (see .agents/memory for the
# timing formula and .agents/memory/elevenlabs-voiceover-mixing.md for why this
# rule exists). Captions below are the on-screen-formatted versions of the same
# rewritten script used for narration -- kept in lockstep so viewers reading
# along never see text that contradicts what they hear.
# ============================================================================
build_cut1() {
make_clip growth_market_entry.jpg cut1_growth.mp4 "GROWTH & POSITIONING" \
  "LEGACYPOINT FILES CHAPTER 11 -- 1\,400 ACCOUNTS IN PLAY" \
  "Day one: nobody owns this yet. Salesforce already calling 380 of their accounts." \
  "Pre-staged and authorized in minutes. 23 target accounts move into outreach immediately." \
  27.785 8.331 17.709
}

build_cut2() {
make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" \
  "RANSOMWARE HITS PRODUCTION -- REGULATORS WATCHING" \
  "No statement agreed yet. The SEC inquiry lands first." \
  "Pre-staged and authorized. Systems isolating\, regulators notified before the story breaks." \
  23.475 5.510 12.144
}

build_cut3() {
make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" \
  "A RIVAL RACES TO LAUNCH FIRST" \
  "The plan is still in draft while the rival announces." \
  "Pre-staged and authorized. Launch moves three weeks earlier -- landing first\, not second." \
  19.504 3.473 8.984
}

build_endcard() {
# ============================================================================
# End card (48.855s): a full closing arc built to move a buyer to act --
# depth (180 protocols across every domain) -> cost of not being a customer ->
# the 3,600x metric -> the locked tagline -> a Founding Partner call to action
# that names the company explicitly and gives the URL. The hero logo graphic
# stays on screen for the entire card, since this is the moment a viewer decides
# whether to remember the brand.
# ============================================================================
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=48.855:r=25" -vf "
[0:v]drawtext=fontfile=${FONT}:text='180 READINESS PROTOCOLS':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-0.6)/0.3\,(12.851-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Pre-staged across Growth & Positioning\, Risk & Resilience\, Transformation':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-0.9)/0.3\,(12.851-t)/0.3)))',
drawtext=fontfile=${FONT}:text='WITHOUT IT':fontcolor=${REDISH}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-12.851)/0.3\,(25.101-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days you do not have -- accounts lost\, exposure compounding\, competitors moving first':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-13.151)/0.3\,(25.101-t)/0.3)))',
drawtext=fontfile=${FONT}:text='3\,600X EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-25.101)/0.3\,(33.224-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-25.401)/0.3\,(33.224-t)/0.3)))',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=440:alpha='min(1\,max(0\,min((t-33.224)/0.3\,(38.866-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=490:alpha='min(1\,max(0\,min((t-33.524)/0.3\,(38.866-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=550:alpha='min(1\,max(0\,min((t-33.824)/0.3\,(38.866-t)/0.3)))',
drawtext=fontfile=${FONT}:text='THIS IS VAUGHNMARTIN READINESS OS':fontcolor=${GOLD}:fontsize=24:x=(w-text_w)/2:y=445:alpha='min(1\,max(0\,(t-38.866)/0.3))',
drawbox=x=(w-820)/2:y=490:w=820:h=170:color=${NAVY}@0.9:t=fill:enable='gte(t,38.866)',
drawbox=x=(w-820)/2:y=490:w=820:h=3:color=${GOLD}:t=fill:enable='gte(t,38.866)',
drawbox=x=(w-820)/2:y=657:w=820:h=3:color=${GOLD}:t=fill:enable='gte(t,38.866)',
drawtext=fontfile=${FONT}:text='REQUEST FOUNDING PARTNER ACCESS':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=545:alpha='min(1\,max(0\,(t-38.866)/0.3))',
drawtext=fontfile=${FONT}:text='vaughnmartin.com':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=600:alpha='min(1\,max(0\,(t-38.866)/0.3))'
[base];
$(brand_overlay_hero 90)
[branded]fade=t=in:st=0:d=0.6,
fade=t=out:st=48.255:d=0.6
" -pix_fmt yuv420p -r 25 cut4_endcard.mp4
}

# Concatenate all five cuts using the concat FILTER (not the concat demuxer).
# The demuxer concatenates raw bitstream packets and corrupts NAL units when clips
# were encoded independently (different SPS/PPS per clip) -- the filter decodes each
# clip to frames first, which avoids that corruption entirely.
build_concat() {
ffmpeg -y -i cut0_intro.mp4 -i cut1_growth.mp4 -i cut2_risk.mp4 -i cut3_transformation.mp4 -i cut4_endcard.mp4 \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0[outv]" \
  -map "[outv]" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p ../readiness_os_3cut_demo_silent.mp4
echo "VIDEO DONE"
}

STEP="${1:-all}"
case "$STEP" in
  intro) build_intro ;;
  cut1) build_cut1 ;;
  cut2) build_cut2 ;;
  cut3) build_cut3 ;;
  endcard) build_endcard ;;
  concat) build_concat ;;
  all) build_intro; build_cut1; build_cut2; build_cut3; build_endcard; build_concat ;;
  *) echo "Unknown step: $STEP"; exit 1 ;;
esac
