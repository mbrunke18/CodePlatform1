#!/bin/bash
set -e
cd "$(dirname "$0")"

FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
NAVY="0x0A0F2E"
GOLD="0xC9A84C"

make_clip() {
  IMG="$1"
  OUT="$2"
  DOMAIN="$3"
  STAT="$4"
  DUR=12
  FPS=25
  FRAMES=$(python3 -c "print(int($DUR*$FPS))")

  ffmpeg -y -loop 1 -i "$IMG" -vf "
    scale=1920:1080,
    zoompan=z='min(zoom+0.00025,1.15)':d=${FRAMES}:s=1920x1080:fps=${FPS},
    drawbox=x=0:y=0:w=1920:h=130:color=${NAVY}@0.88:t=fill,
    drawbox=x=0:y=950:w=1920:h=130:color=${NAVY}@0.88:t=fill,
    drawtext=fontfile=${FONT}:text='${DOMAIN}':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=45:borderw=0:alpha='if(lt(t,0.6),0,1)',
    drawtext=fontfile=${FONT}:text='${STAT}':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=985:borderw=0:alpha='if(lt(t,2.2),0,1)',
    fade=t=in:st=0:d=0.6,
    fade=t=out:st=$(python3 -c "print(${DUR}-0.6)"):d=0.6:alpha=0
  " -frames:v ${FRAMES} -pix_fmt yuv420p -r ${FPS} "$OUT"
}

make_clip growth_market_entry.jpg cut1_growth.mp4 "GROWTH & POSITIONING" "T+12\:00 -- 23 pipeline accounts in active discussion"
make_clip risk_ransomware.jpg cut2_risk.mp4 "RISK & RESILIENCE" "T+12\:00 -- Full activation complete. Regulators satisfied."
make_clip transformation_product_launch.jpg cut3_transformation.mp4 "TRANSFORMATION" "T+12\:00 -- Go/no-go criteria set. Launch locked in."

# End card: stacked domain labels + tagline on navy background
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=9:r=25" -vf "
drawtext=fontfile=${FONT}:text='GROWTH & POSITIONING':fontcolor=${GOLD}:fontsize=38:x=(w-text_w)/2:y=380:alpha='if(lt(t,0.6),0,1)',
drawtext=fontfile=${FONT}:text='RISK & RESILIENCE':fontcolor=${GOLD}:fontsize=38:x=(w-text_w)/2:y=440:alpha='if(lt(t,1.6),0,1)',
drawtext=fontfile=${FONT}:text='TRANSFORMATION':fontcolor=${GOLD}:fontsize=38:x=(w-text_w)/2:y=500:alpha='if(lt(t,2.6),0,1)',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=30:x=(w-text_w)/2:y=620:alpha='if(lt(t,4.2),0,1)',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=670:alpha='if(lt(t,5.0),0,1)',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=44:x=(w-text_w)/2:y=730:alpha='if(lt(t,5.8),0,1)',
fade=t=in:st=0:d=0.6,
fade=t=out:st=8.2:d=0.7
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
