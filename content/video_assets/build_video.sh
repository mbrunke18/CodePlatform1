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
# INTRO (38.188s): rewritten a third time to (a) reframe situations as EXPECTED
# categories with unknown timing rather than things "not expected" -- the
# organization has faced them, will face them again, and just doesn't know
# when -- and (b) name the "mobilization gap" explicitly as the cost being
# eliminated, so the payoff beat reads as "no mobilization gap" rather than a
# generic speed claim. The third beat still chains trigger -> protocol but now
# carries real breadth numbers (231 triggers / 180 protocols) instead of vague
# language, per feedback that the script needed to demonstrate real product
# depth, not just a generic pitch. Reveal timings are synced to the actual
# measured narration durations for this script (see
# .agents/memory/elevenlabs-voiceover-mixing.md for the sync formula).
# ============================================================================
INTRO_DUR=38.188
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=${INTRO_DUR}:r=25" -vf "
[0:v]drawtext=fontfile=${FONT}:text='YOU HAVE FACED THIS. YOU WILL FACE IT AGAIN. YOU DO NOT KNOW WHEN.':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=460:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='THE OLD WAY':fontcolor=${REDISH}:fontsize=30:x=(w-text_w)/2:y=600:alpha='if(lt(t,6.581),0,1)',
drawtext=fontfile=${FONT}:text='A 30-day mobilization gap -- a war room built from scratch\, after the fact':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=650:alpha='if(lt(t,6.581),0,1)',
drawtext=fontfile=${FONT}:text='SYSTEM-DETECTED. INSTANTLY MATCHED.':fontcolor=${TEAL}:fontsize=30:x=(w-text_w)/2:y=760:alpha='if(lt(t,14.104),0,1)',
drawtext=fontfile=${FONT}:text='231 triggers monitored -- matched to one of 180 pre-staged Readiness Protocols':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=810:alpha='if(lt(t,14.104),0,1)',
drawtext=fontfile=${FONT}:text='NO MOBILIZATION GAP.':fontcolor=${GOLD}:fontsize=38:x=(w-text_w)/2:y=880:alpha='if(lt(t,24.813),0,1)',
drawtext=fontfile=${FONT}:text='Execution starts in 12 minutes\, not 30 days':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=930:alpha='if(lt(t,24.813),0,1)',
drawtext=fontfile=${FONT}:text='Watch it respond to 3 situations your team has likely already lived through':fontcolor=0xB8BCC8:fontsize=23:x=(w-text_w)/2:y=975:alpha='if(lt(t,24.813),0,1)'
[base];
$(brand_overlay_hero 130)
[branded]fade=t=in:st=0:d=0.6,
fade=t=out:st=37.588:d=0.6
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
  "Day one: nobody owns this yet. Sales is already calling 380 of their accounts -- with no plan and no pricing approved." \
  "Protocol 31 was already staged. Authorized in minutes -- 23 target accounts move into outreach immediately\, messaging and pricing pre-approved." \
  32.591 8.331 18.675
}

build_cut2() {
make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" \
  "RANSOMWARE HITS PRODUCTION -- REGULATORS WATCHING" \
  "No statement agreed yet. Legal\, comms\, and IT are on three separate calls when the SEC inquiry lands." \
  "System-detected\, executive-authorized in minutes -- systems isolating\, the SEC notified\, and the customer statement issued before the story breaks." \
  27.968 5.510 14.600
}

build_cut3() {
make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" \
  "A RIVAL RACES TO LAUNCH FIRST" \
  "The go-to-market plan is still in draft -- marketing\, product\, and sales have not even agreed on a date." \
  "Protocol 89 was already staged. Authorized in minutes -- launch moves three weeks earlier\, landing first\, not second." \
  21.986 3.473 11.361
}

build_endcard() {
# ============================================================================
# End card (61.889s): a full closing arc built to move a buyer to act --
# depth+breadth (180 protocols, 231 triggers, every team/function, not just the
# 3 situations shown) -> cost of not being a customer -> the 3,600x metric ->
# ADVANCE closed-loop learning as a built-in differentiator -> the locked
# tagline -> a Founding Partner call to action that names the company
# explicitly and gives the URL. The hero logo graphic stays on screen for the
# entire card, since this is the moment a viewer decides whether to remember
# the brand. Beat boundaries below are derived from the actual measured
# narration durations (see .agents/memory/elevenlabs-voiceover-mixing.md).
# ============================================================================
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=61.889:r=25" -vf "
[0:v]drawtext=fontfile=${FONT}:text='180 READINESS PROTOCOLS':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-0.6)/0.3\,(13.556-t)/0.3)))',
drawtext=fontfile=${FONT}:text='231 triggers monitored end-to-end -- across every team\, every function':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-0.9)/0.3\,(13.556-t)/0.3)))',
drawtext=fontfile=${FONT}:text='WITHOUT IT':fontcolor=${REDISH}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-13.556)/0.3\,(25.807-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days you do not have -- accounts lost\, exposure compounding\, competitors moving first':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-13.856)/0.3\,(25.807-t)/0.3)))',
drawtext=fontfile=${FONT}:text='3\,600X EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-25.807)/0.3\,(33.930-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-26.107)/0.3\,(33.930-t)/0.3)))',
drawtext=fontfile=${FONT}:text='AND IT GETS SMARTER EVERY TIME':fontcolor=${GOLD}:fontsize=44:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-33.930)/0.3\,(46.259-t)/0.3)))',
drawtext=fontfile=${FONT}:text='ADVANCE closes the loop -- proven improvements\, compounding with every activation':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-34.230)/0.3\,(46.259-t)/0.3)))',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=440:alpha='min(1\,max(0\,min((t-46.259)/0.3\,(51.900-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=490:alpha='min(1\,max(0\,min((t-46.559)/0.3\,(51.900-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=550:alpha='min(1\,max(0\,min((t-46.859)/0.3\,(51.900-t)/0.3)))',
drawtext=fontfile=${FONT}:text='THIS IS VAUGHNMARTIN READINESS OS':fontcolor=${GOLD}:fontsize=24:x=(w-text_w)/2:y=445:alpha='min(1\,max(0\,(t-51.900)/0.3))',
drawbox=x=(w-820)/2:y=490:w=820:h=170:color=${NAVY}@0.9:t=fill:enable='gte(t,51.900)',
drawbox=x=(w-820)/2:y=490:w=820:h=3:color=${GOLD}:t=fill:enable='gte(t,51.900)',
drawbox=x=(w-820)/2:y=657:w=820:h=3:color=${GOLD}:t=fill:enable='gte(t,51.900)',
drawtext=fontfile=${FONT}:text='REQUEST FOUNDING PARTNER ACCESS':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=545:alpha='min(1\,max(0\,(t-51.900)/0.3))',
drawtext=fontfile=${FONT}:text='vaughnmartin.com':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=600:alpha='min(1\,max(0\,(t-51.900)/0.3))'
[base];
$(brand_overlay_hero 90)
[branded]fade=t=in:st=0:d=0.6,
fade=t=out:st=61.289:d=0.6
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
