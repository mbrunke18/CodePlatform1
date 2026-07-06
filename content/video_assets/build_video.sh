#!/bin/bash
set -e
cd "$(dirname "$0")"

FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
NAVY="0x0A0F2E"
GOLD="0xC9A84C"
TEAL="0x2B8A6E"
REDISH="0xD16B5B"

make_clip() {
  IMG="$1"
  OUT="$2"
  DOMAIN="$3"
  OLDLINE="$4"
  READYLINE="$5"
  DUR=14.3
  FPS=25
  FRAMES=$(python3 -c "print(int($DUR*$FPS))")
  CARD_START=3.4
  OLD_FADE_END=8.7
  READY_FADE_START=8.4
  CROSSFADE_MID=8.55
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

make_clip growth_market_entry.jpg cut1_growth.mp4 "GROWTH & POSITIONING" \
  "Salesforce captures 380 accounts in week one. Horizon is still in planning meetings." \
  "Campaign live, AEs assigned. 23 pipeline accounts already in active outreach."

make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" \
  "Market opens with no statement ready. SEC inquiry filed before internal response is coordinated." \
  "IR team engaged, systems isolating, regulators notified. Executing from a staged position."

make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" \
  "Cascade locks 3 enterprise analysts and 4 trade publications before NovaTech response is coordinated." \
  "Go/no-go authorized, campaign live. Launch pulled forward to June 15."

# End card: domains + 3,600x metric + tagline on navy background
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=10:r=25" -vf "
drawtext=fontfile=${FONT}:text='GROWTH & POSITIONING':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=260:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='RISK & RESILIENCE':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=320:alpha='if(lt(t,1.4),0,1)',
drawtext=fontfile=${FONT}:text='TRANSFORMATION':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=380:alpha='if(lt(t,2.2),0,1)',
drawtext=fontfile=${FONT}:text='3\,600X EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=52:x=(w-text_w)/2:y=480:alpha='if(lt(t,3.6),0,1)',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=555:alpha='if(lt(t,4.2),0,1)',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=680:alpha='if(lt(t,5.6),0,1)',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=728:alpha='if(lt(t,6.3),0,1)',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=788:alpha='if(lt(t,7.0),0,1)',
fade=t=in:st=0:d=0.6,
fade=t=out:st=9.2:d=0.7
" -pix_fmt yuv420p -r 25 cut4_endcard.mp4

# Concatenate all four cuts
cat > concat_list.txt << EOF
file 'cut1_growth.mp4'
file 'cut2_risk.mp4'
file 'cut3_transformation.mp4'
file 'cut4_endcard.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i concat_list.txt -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p ../readiness_os_3cut_demo.mp4

echo "DONE"
