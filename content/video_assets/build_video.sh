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
  OLDLINE="$4"
  READYLINE="$5"
  DUR="$6"
  CARD_START="$7"
  READY_FADE_START="$8"
  FPS=25
  FRAMES=$(python3 -c "print(int($DUR*$FPS))")
  OLD_FADE_END=${READY_FADE_START}
  CROSSFADE_MID=$(python3 -c "print((${CARD_START}+${READY_FADE_START})/2)")
  FADE_OUT_ST=$(python3 -c "print(${DUR}-0.6)")
  OLD_ALPHA="min(1\,max(0\,min((t-${CARD_START})/0.3\,(${OLD_FADE_END}-t)/0.3)))"
  READY_ALPHA="min(1\,max(0\,(t-${READY_FADE_START})/0.3))"

  ffmpeg -y -loop 1 -i "$IMG" -vf "
    scale=1920:1080,
    zoompan=z='min(zoom+0.00025,1.15)':d=${FRAMES}:s=1920x1080:fps=${FPS},
    drawbox=x=0:y=0:w=1920:h=130:color=${NAVY}@0.88:t=fill,
    drawtext=fontfile=${FONT}:text='${DOMAIN}':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=45:alpha='if(lt(t,0.6),0,1)',
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

# Per-cut durations sized to the actual measured narration length for that cut's old/ready lines
# (rather than cramming narration into a fixed window -- see project memory on this).
make_clip growth_market_entry.jpg cut1_growth.mp4 "GROWTH & POSITIONING" \
  "Day one: who owns this? Salesforce already has 380 of their accounts." \
  "Pre-staged and authorized. 23 accounts move into outreach immediately." \
  18.5 3.4 10.7

make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" \
  "No statement agreed yet. The SEC inquiry lands first." \
  "Pre-staged and authorized. Systems isolating, regulators already notified." \
  17.0 3.4 8.5

make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" \
  "The NovaTech plan is still in draft. The rival announces first." \
  "Pre-staged and authorized. Launch moves three weeks earlier." \
  15.5 3.4 8.4

# End card (19.0s): domains + 3,600x metric + tagline on navy background.
# Metric text/audio plays first, tagline text/audio plays after metric audio finishes.
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=19.0:r=25" -vf "
drawtext=fontfile=${FONT}:text='GROWTH & POSITIONING':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=260:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='RISK & RESILIENCE':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=320:alpha='if(lt(t,1.4),0,1)',
drawtext=fontfile=${FONT}:text='TRANSFORMATION':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=380:alpha='if(lt(t,2.2),0,1)',
drawtext=fontfile=${FONT}:text='3\,600X EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=52:x=(w-text_w)/2:y=480:alpha='if(lt(t,2.8),0,1)',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=555:alpha='if(lt(t,3.4),0,1)',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=680:alpha='if(lt(t,11.5),0,1)',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=728:alpha='if(lt(t,13.0),0,1)',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=788:alpha='if(lt(t,14.5),0,1)',
fade=t=in:st=0:d=0.6,
fade=t=out:st=18.2:d=0.8
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
