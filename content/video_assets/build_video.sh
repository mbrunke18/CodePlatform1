#!/bin/bash
set -e
cd "$(dirname "$0")"

FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
NAVY="0x0A0F2E"
GOLD="0xC9A84C"
TEAL="0x2B8A6E"
REDISH="0xB83228"

# Persistent branding, drawn on every clip (intro, cuts, endcard) so Readiness OS
# is visually present in every single frame of the video, not just intro/endcard.
# Top-left small tag + thin gold rule; bottom-right wordmark watermark.
brand_overlay() {
  echo "drawtext=fontfile=${FONT}:text='READINESS OS':fontcolor=${GOLD}:fontsize=22:x=40:y=40:alpha=0.92,
    drawbox=x=40:y=68:w=170:h=2:color=${GOLD}@0.85:t=fill,
    drawtext=fontfile=${FONT}:text='VAUGHNMARTIN | READINESS OS':fontcolor=white:fontsize=18:x=w-text_w-40:y=h-45:alpha=0.75,"
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
    scale=1920:1080,
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
    drawtext=fontfile=${FONT}:text='${READYLINE}':fontcolor=white:fontsize=24:x=80:y=900:alpha='${READY_ALPHA}',
    $(brand_overlay)
    fade=t=in:st=0:d=0.6,
    fade=t=out:st=${FADE_OUT_ST}:d=0.6:alpha=0
  " -frames:v ${FRAMES} -pix_fmt yuv420p -r ${FPS} "$OUT"
}

# Intro card (17.5s): defines the concept in plain language before any scenario plays,
# so a viewer unfamiliar with Readiness OS knows what they're watching and why it matters.
# Text-reveal timings are synced to the actual measured narration durations below.
# Added a closing bridge line so viewers know the following 3 cuts ARE the product,
# not an abstract concept -- addresses "what is being sold" clarity.
INTRO_DUR=17.5
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=${INTRO_DUR}:r=25" -vf "
drawtext=fontfile=${FONT}:text='EVERY ORGANIZATION FACES SITUATIONS IT DOES NOT EXPECT':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=420:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='THE OLD WAY':fontcolor=${REDISH}:fontsize=30:x=(w-text_w)/2:y=560:alpha='if(lt(t,4.3),0,1)',
drawtext=fontfile=${FONT}:text='30 days to figure out who is in charge':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=610:alpha='if(lt(t,4.3),0,1)',
drawtext=fontfile=${FONT}:text='READINESS OS':fontcolor=${TEAL}:fontsize=30:x=(w-text_w)/2:y=740:alpha='if(lt(t,8.4),0,1)',
drawtext=fontfile=${FONT}:text='Stages the response in advance':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=790:alpha='if(lt(t,8.4),0,1)',
drawtext=fontfile=${FONT}:text='EXECUTION STARTS IN 12 MINUTES':fontcolor=${GOLD}:fontsize=40:x=(w-text_w)/2:y=900:alpha='if(lt(t,12.1),0,1)',
drawtext=fontfile=${FONT}:text='Watch Readiness OS respond to 3 real situations below':fontcolor=0xB8BCC8:fontsize=24:x=(w-text_w)/2:y=955:alpha='if(lt(t,13.6),0,1)',
$(brand_overlay)
fade=t=in:st=0:d=0.6,
fade=t=out:st=16.7:d=0.8
" -pix_fmt yuv420p -r 25 cut0_intro.mp4

# Per-cut timing: audio for each beat (hook/old/ready) starts exactly when its caption
# reaches full opacity (0.3s after the caption begins fading in), never before -- this
# fixes narration feeling "cut off" (e.g. LegacyPoint), which happened because audio
# previously started while the caption was still fading in and not yet legible.
# CARD_START / READY_FADE_START / DUR below are derived from the actual measured
# narration durations plus this sync rule (see .agents/memory for the timing formula).
make_clip growth_market_entry.jpg cut1_growth.mp4 "GROWTH & POSITIONING" \
  "LEGACYPOINT FILES CHAPTER 11 -- 1\,400 ACCOUNTS IN PLAY" \
  "Day one: who owns this? Salesforce already has 380 of their accounts." \
  "Pre-staged and authorized. 23 accounts move into outreach immediately." \
  25.63 8.122 15.488

make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" \
  "RANSOMWARE HITS PRODUCTION -- REGULATORS WATCHING" \
  "No statement agreed yet. The SEC inquiry lands first." \
  "Pre-staged and authorized. Systems isolating\, regulators already notified." \
  25.213 7.287 15.593

make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" \
  "RIVAL RACES TO LAUNCH FIRST" \
  "The NovaTech plan is still in draft. The rival announces first." \
  "Pre-staged and authorized. Launch moves three weeks earlier." \
  20.981 6.999 12.85

# End card (37.774s): a full closing arc for a potential buying customer --
# depth (180 protocols across every domain) -> cost of not being a customer ->
# the 3,600x metric -> the locked tagline -> a Founding Partner call to action.
# Each beat fades in/out sequentially, timed to its own narration segment, with the
# same "audio starts only once caption is fully visible" sync rule applied throughout.
# Kicker line above the CTA ties brand name + category descriptor to the ask itself.
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=37.774:r=25" -vf "
drawtext=fontfile=${FONT}:text='180 READINESS PROTOCOLS':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-0.6)/0.3\,(8.749-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Pre-staged across Growth & Positioning\, Risk & Resilience\, Transformation':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=540:alpha='min(1\,max(0\,min((t-0.9)/0.3\,(8.749-t)/0.3)))',
drawtext=fontfile=${FONT}:text='WITHOUT IT':fontcolor=${REDISH}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-9.049)/0.3\,(15.945-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days you do not have -- accounts lost\, exposure compounding':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=540:alpha='min(1\,max(0\,min((t-9.349)/0.3\,(15.945-t)/0.3)))',
drawtext=fontfile=${FONT}:text='3\,600X EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-16.245)/0.3\,(23.715-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=540:alpha='min(1\,max(0\,min((t-16.545)/0.3\,(23.715-t)/0.3)))',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=420:alpha='min(1\,max(0\,min((t-24.015)/0.3\,(30.075-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=470:alpha='min(1\,max(0\,min((t-24.315)/0.3\,(30.075-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=530:alpha='min(1\,max(0\,min((t-24.615)/0.3\,(30.075-t)/0.3)))',
drawtext=fontfile=${FONT}:text='READINESS OS -- READINESS INFRASTRUCTURE':fontcolor=${GOLD}:fontsize=22:x=(w-text_w)/2:y=425:alpha='min(1\,max(0\,(t-30.375)/0.3))',
drawbox=x=(w-780)/2:y=470:w=780:h=140:color=${NAVY}@0.9:t=fill:enable='gte(t,30.375)',
drawbox=x=(w-780)/2:y=470:w=780:h=3:color=${GOLD}:t=fill:enable='gte(t,30.375)',
drawbox=x=(w-780)/2:y=607:w=780:h=3:color=${GOLD}:t=fill:enable='gte(t,30.375)',
drawtext=fontfile=${FONT}:text='REQUEST FOUNDING PARTNER ACCESS':fontcolor=${GOLD}:fontsize=36:x=(w-text_w)/2:y=525:alpha='min(1\,max(0\,(t-30.375)/0.3))',
$(brand_overlay)
fade=t=in:st=0:d=0.6,
fade=t=out:st=37.174:d=0.6
" -pix_fmt yuv420p -r 25 cut4_endcard.mp4

# Concatenate all five cuts using the concat FILTER (not the concat demuxer).
# The demuxer concatenates raw bitstream packets and corrupts NAL units when clips
# were encoded independently (different SPS/PPS per clip) -- the filter decodes each
# clip to frames first, which avoids that corruption entirely.
ffmpeg -y -i cut0_intro.mp4 -i cut1_growth.mp4 -i cut2_risk.mp4 -i cut3_transformation.mp4 -i cut4_endcard.mp4 \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0[outv]" \
  -map "[outv]" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p ../readiness_os_3cut_demo_silent.mp4

echo "VIDEO DONE"
