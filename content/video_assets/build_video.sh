#!/bin/bash
set -e
cd "$(dirname "$0")"

FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
NAVY="0x0A0F2E"
GOLD="0xC9A84C"
TEAL="0x2B8A6E"
REDISH="0xB83228"

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
    fade=t=in:st=0:d=0.6,
    fade=t=out:st=${FADE_OUT_ST}:d=0.6:alpha=0
  " -frames:v ${FRAMES} -pix_fmt yuv420p -r ${FPS} "$OUT"
}

# Intro card (17.5s): defines the concept in plain language before any scenario plays,
# so a viewer unfamiliar with Readiness OS knows what they're watching and why it matters.
# Text-reveal timings are synced to the actual measured narration durations below.
INTRO_DUR=17.5
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=${INTRO_DUR}:r=25" -vf "
drawtext=fontfile=${FONT}:text='EVERY ORGANIZATION FACES SITUATIONS IT DOES NOT EXPECT':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=420:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='THE OLD WAY':fontcolor=${REDISH}:fontsize=30:x=(w-text_w)/2:y=560:alpha='if(lt(t,4.3),0,1)',
drawtext=fontfile=${FONT}:text='30 days to figure out who is in charge':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=610:alpha='if(lt(t,4.3),0,1)',
drawtext=fontfile=${FONT}:text='READINESS OS':fontcolor=${TEAL}:fontsize=30:x=(w-text_w)/2:y=740:alpha='if(lt(t,8.4),0,1)',
drawtext=fontfile=${FONT}:text='Stages the response in advance':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=790:alpha='if(lt(t,8.4),0,1)',
drawtext=fontfile=${FONT}:text='EXECUTION STARTS IN 12 MINUTES':fontcolor=${GOLD}:fontsize=40:x=(w-text_w)/2:y=900:alpha='if(lt(t,12.1),0,1)',
fade=t=in:st=0:d=0.6,
fade=t=out:st=16.7:d=0.8
" -pix_fmt yuv420p -r 25 cut0_intro.mp4

# Per-cut durations sized to the actual measured narration length for hook+old+ready
# (rather than cramming narration into a fixed window -- see project memory on this).
# Each cut now opens with a HOOKLINE that names the situation before the old/new comparison,
# so the scene doesn't feel like it cuts off mid-thought.
make_clip growth_market_entry.jpg cut1_growth.mp4 "GROWTH & POSITIONING" \
  "LEGACYPOINT FILES CHAPTER 11 -- 1\,400 ACCOUNTS IN PLAY" \
  "Day one: who owns this? Salesforce already has 380 of their accounts." \
  "Pre-staged and authorized. 23 accounts move into outreach immediately." \
  24.93 7.42 14.59

make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" \
  "RANSOMWARE HITS PRODUCTION -- REGULATORS WATCHING" \
  "No statement agreed yet. The SEC inquiry lands first." \
  "Pre-staged and authorized. Systems isolating\, regulators already notified." \
  24.51 6.59 14.69

make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" \
  "RIVAL RACES TO LAUNCH FIRST" \
  "The NovaTech plan is still in draft. The rival announces first." \
  "Pre-staged and authorized. Launch moves three weeks earlier." \
  20.28 6.30 11.95

# End card (35.47s): a full closing arc for a potential buying customer --
# depth (180 protocols across every domain) -> cost of not being a customer ->
# the 3,600x metric -> the locked tagline -> a Founding Partner call to action.
# Each beat fades in/out sequentially, timed to its own narration segment.
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=35.47:r=25" -vf "
drawtext=fontfile=${FONT}:text='180 READINESS PROTOCOLS':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-0.6)/0.3\,(7.9-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Pre-staged across Growth & Positioning\, Risk & Resilience\, Transformation':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=540:alpha='min(1\,max(0\,min((t-0.9)/0.3\,(7.9-t)/0.3)))',
drawtext=fontfile=${FONT}:text='WITHOUT IT':fontcolor=${REDISH}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-8.25)/0.3\,(14.6-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days you do not have -- accounts lost\, exposure compounding':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=540:alpha='min(1\,max(0\,min((t-8.55)/0.3\,(14.6-t)/0.3)))',
drawtext=fontfile=${FONT}:text='3\,600X EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-14.95)/0.3\,(21.9-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=540:alpha='min(1\,max(0\,min((t-15.25)/0.3\,(21.9-t)/0.3)))',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=420:alpha='min(1\,max(0\,min((t-22.2)/0.3\,(27.75-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=470:alpha='min(1\,max(0\,min((t-22.5)/0.3\,(27.75-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=530:alpha='min(1\,max(0\,min((t-22.8)/0.3\,(27.75-t)/0.3)))',
drawbox=x=(w-780)/2:y=470:w=780:h=140:color=${NAVY}@0.9:t=fill:enable='gte(t,28.1)',
drawbox=x=(w-780)/2:y=470:w=780:h=3:color=${GOLD}:t=fill:enable='gte(t,28.1)',
drawbox=x=(w-780)/2:y=607:w=780:h=3:color=${GOLD}:t=fill:enable='gte(t,28.1)',
drawtext=fontfile=${FONT}:text='REQUEST FOUNDING PARTNER ACCESS':fontcolor=${GOLD}:fontsize=36:x=(w-text_w)/2:y=525:alpha='min(1\,max(0\,(t-28.1)/0.3))',
fade=t=in:st=0:d=0.6,
fade=t=out:st=34.87:d=0.6
" -pix_fmt yuv420p -r 25 cut4_endcard.mp4

# Concatenate all five cuts
cat > concat_list.txt << EOF
file 'cut0_intro.mp4'
file 'cut1_growth.mp4'
file 'cut2_risk.mp4'
file 'cut3_transformation.mp4'
file 'cut4_endcard.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i concat_list.txt -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p ../readiness_os_3cut_demo_silent.mp4

echo "VIDEO DONE"
