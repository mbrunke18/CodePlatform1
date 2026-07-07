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

# Larger "hero" logo instance used at the highest-recall moments. Accepts an optional
# ENABLE_EXPR (ffmpeg enable clause) so the intro can hold the logo back until the
# "This is Readiness OS" reveal beat, per the restructured narrative (v2): the brand
# should not appear during the tension/pain acts, only at the turn.
brand_overlay_hero() {
  local Y="$1"
  local ENABLE="${2:-gte(t\,0.05)}"
  echo "movie=${LOGO_HERO}[hlogo];[base][hlogo]overlay=x=(1920-771)/2:y=${Y}:enable='${ENABLE}'[branded];"
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

# ============================================================================
# INTRO v3 (100.858s): further tension rewrite per second round of customer
# feedback on v2 ("still spends too much time explaining what the platform is
# before convincing me why I should care -- the opening should not mention
# the product for the first ~45s, and the reveal should answer 'why care'
# emotionally before it answers 'what is this' functionally").
#   Act 1 (0.6s-20.858s) -- THE QUESTION: rewritten as 6 short, staccato
#     lines (was 3 longer lines) using the reviewer's own suggested wording
#     almost verbatim ("Every organization believes it's prepared... until
#     the day preparation is tested... then the same questions surface:
#     where is the information, who solved this before, why are we
#     rebuilding what we already knew") -- no product mention.
#   Act 2 (20.858s-56.167s) -- THE OLD WAY: UNCHANGED content (war room,
#     email, Teams, spreadsheets, searching, waiting) -- only its absolute
#     position shifted earlier since Act 1 is now shorter.
#   Act 3 (56.167s-99.258s) -- THE TURN: "There is another way" -> "Not
#     software -- organizational capability" -> brand reveal ("This is
#     Readiness OS") -> NEW emotional beat ("the expertise in the room does
#     not walk out the door... every team responds like they've done this
#     before") -> NEW payoff beat ("That's what makes an organization
#     fearless") -- BEFORE the spec-sheet numbers (231 triggers / 180
#     protocols) and mechanism close. This reorders the turn so the
#     emotional payoff (capability, fearless) lands before the functional
#     detail, directly per the reviewer's "answer why before what" note.
#     The hero logo is still withheld until the "This is Readiness OS" beat
#     (t=65.829) so the brand reveal lands at the turn, not before it.
# Beats use the same crossfade alpha formula as before so they replace each
# other rather than stack (now 18 sequential beats). Act 1 uses a slightly
# shorter hold + pause (staccato pacing) than Act 2/3's uniform 0.6s pause,
# by design, to read as tension rather than narration. Timings are derived
# from the actual measured durations of the new/reused v2 narration
# segments -- see .agents/memory/elevenlabs-voiceover-mixing.md for the sync
# formula (audio starts caption-fade-start + 0.3s) and
# content/video_script_v2_draft.md for the full narration script.
# ============================================================================
build_intro() {
INTRO_DUR=112.373

beat() {
  local START="$1" END="$2" TEXT="$3" SIZE="$4" Y="$5" COLOR="$6"
  echo "drawtext=fontfile=${FONT}:text='${TEXT}':fontcolor=${COLOR}:fontsize=${SIZE}:x=(w-text_w)/2:y=${Y}:alpha='min(1\,max(0\,min((t-${START})/0.3\,(${END}-t)/0.3)))',"
}

ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=${INTRO_DUR}:r=25" -vf "
[0:v]
$(beat 0.6 4.443 'EVERY ORGANIZATION BELIEVES IT IS PREPARED.' 40 500 white)
$(beat 4.443 8.129 'UNTIL THE DAY PREPARATION IS TESTED.' 40 500 white)
$(beat 8.129 11.267 'THEN THE SAME QUESTIONS SURFACE.' 38 500 0xB8BCC8)
$(beat 11.267 13.934 'WHERE IS THE INFORMATION?' 44 500 white)
$(beat 13.934 16.784 'WHO SOLVED THIS BEFORE?' 44 500 white)
$(beat 16.784 20.858 'WHY ARE WE REBUILDING WHAT WE ALREADY KNEW?' 34 500 ${REDISH})
$(beat 20.858 28.745 'THIS IS WHAT HAPPENS TODAY\, IN ALMOST EVERY ORGANIZATION.' 30 500 white)
$(beat 28.745 33.419 'WEEKS JUST TO MOBILIZE. FIGURING OUT WHO. WHAT. AND HOW.' 32 500 ${REDISH})
$(beat 33.419 42.169 'EMAIL THREADS MULTIPLY. TEAMS CHANNELS FORK. SPREADSHEETS PILE UP.' 28 500 white)
$(beat 42.169 48.175 'NOBODY OWNS IT YET. EVERYONE IS SEARCHING. EVERYONE IS WAITING.' 30 500 white)
$(beat 48.175 56.167 'THIRTY DAYS PASS BEFORE THE RESPONSE EVEN TAKES SHAPE.' 32 500 ${REDISH})
$(beat 56.167 58.647 'THERE IS ANOTHER WAY.' 52 500 ${GOLD})
$(beat 58.647 65.829 'NOT SOFTWARE.' 40 460 ${GOLD})
$(beat 58.647 65.829 'ORGANIZATIONAL CAPABILITY -- BUILT ONCE AND READY ALWAYS.' 26 530 white)
$(beat 65.829 68.858 'THIS IS READINESS OS.' 52 680 white)
$(beat 68.858 72.827 'EVERY ENTERPRISE ALREADY HAS THE AI.' 36 500 white)
$(beat 72.827 77.188 'ALMOST NONE HAVE THE OPERATING MODEL TO RUN IT.' 34 500 ${REDISH})
$(beat 77.188 80.373 'THAT GAP IS WHAT WE CLOSE.' 44 500 ${GOLD})
$(beat 80.373 90.951 'THE EXPERTISE IN THE ROOM DOES NOT WALK OUT THE DOOR.' 28 460 white)
$(beat 80.373 90.951 'IT IS BUILT IN -- EVERY TEAM RESPONDS LIKE THEY HAVE DONE THIS BEFORE.' 24 530 white)
$(beat 90.951 94.841 'THAT IS WHAT MAKES AN ORGANIZATION FEARLESS.' 34 500 ${GOLD})
$(beat 94.841 104.374 '231 TRIGGERS -- 180 READINESS PROTOCOLS' 34 460 ${GOLD})
$(beat 94.841 104.374 'PRE-STAGED. READY BEFORE YOU NEED THEM.' 26 520 white)
$(beat 104.374 110.773 'SYSTEM-DETECTED. EXECUTIVE-AUTHORIZED. NO MOBILIZATION GAP.' 28 500 ${TEAL})
null
[base];
$(brand_overlay_hero 130 'gte(t\,65.829)')
[branded]fade=t=in:st=0:d=0.6,
fade=t=out:st=111.773:d=0.6
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
# These 3 scenario cuts are UNCHANGED from v1 -- the customer feedback that
# drove the v2 rewrite was about the video's overall sequencing (product shown
# too early, ending too flat), not about these specific proof beats.
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
  "No statement agreed yet. Legal\, Communications\, and IT are on three separate calls when the SEC inquiry lands." \
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
# End card v2 (90.647s, up from 73.166s in v1): the proof sequence (depth,
# cost-without-it, 3,600x metric, ADVANCE learning loop) is UNCHANGED from v1
# -- no complaint from the reviewer about this material. What is NEW is the
# philosophy close inserted between the ADVANCE beat and the locked tagline:
# "Organizations do not fail because they lack talented people. They fail
# because knowledge disappears between events. Readiness OS ensures your
# experience becomes capability before your next disruption." -- directly
# per the reviewer's "biggest missed opportunity" note that the video needed
# a philosophy bigger than document management. The tagline and CTA beats
# below are simply time-shifted later by +17.481s (the length of the new
# philosophy insert) -- their own content and internal timing are unchanged.
# ============================================================================
ffmpeg -y -f lavfi -i "color=c=${NAVY}:s=1920x1080:d=90.647:r=25" -vf "
[0:v]drawtext=fontfile=${FONT}:text='180 READINESS PROTOCOLS':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-0.6)/0.3\,(13.556-t)/0.3)))',
drawtext=fontfile=${FONT}:text='One pre-staged for every situation you could face -- across every team\, every function':fontcolor=white:fontsize=26:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-0.9)/0.3\,(13.556-t)/0.3)))',
drawtext=fontfile=${FONT}:text='WITHOUT IT':fontcolor=${REDISH}:fontsize=48:x=(w-text_w)/2:y=460:alpha='min(1\,max(0\,min((t-13.556)/0.3\,(25.807-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The cost is never the event. It is the mobilization.':fontcolor=0xB8BCC8:fontsize=22:x=(w-text_w)/2:y=530:alpha='min(1\,max(0\,min((t-13.556)/0.3\,(25.807-t)/0.3)))',
drawtext=fontfile=${FONT}:text='\$47M in ransomware penalties.  -11\% stock lost to activist.  \$59M in supply chain losses.':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=572:alpha='min(1\,max(0\,min((t-13.856)/0.3\,(25.807-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Modeled outcomes -- IBM Security 2025\; Lazard Activism Review\; PwC Supply Chain Research':fontcolor=0xB8BCC8:fontsize=15:x=(w-text_w)/2:y=614:alpha='min(1\,max(0\,min((t-13.856)/0.3\,(25.807-t)/0.3)))',
drawtext=fontfile=${FONT}:text='3\,600× EXECUTION HEAD START':fontcolor=${GOLD}:fontsize=48:x=(w-text_w)/2:y=455:alpha='min(1\,max(0\,min((t-25.807)/0.3\,(45.207-t)/0.3)))',
drawtext=fontfile=${FONT}:text='30 days compressed to 12 minutes':fontcolor=0xB8BCC8:fontsize=26:x=(w-text_w)/2:y=522:alpha='min(1\,max(0\,min((t-26.107)/0.3\,(45.207-t)/0.3)))',
drawtext=fontfile=${FONT}:text='\$0 in penalties.  Narrative controlled.  +4\% stock recovery.  Supply continuity maintained.':fontcolor=white:fontsize=22:x=(w-text_w)/2:y=570:alpha='min(1\,max(0\,min((t-26.107)/0.3\,(45.207-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The same 3 situations.  The response already staged.  Ready before the trigger fired.':fontcolor=${TEAL}:fontsize=20:x=(w-text_w)/2:y=614:alpha='min(1\,max(0\,min((t-26.107)/0.3\,(45.207-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Modeled outcomes for the same 3 scenarios\, applied with Readiness OS':fontcolor=0xB8BCC8:fontsize=15:x=(w-text_w)/2:y=648:alpha='min(1\,max(0\,min((t-26.107)/0.3\,(45.207-t)/0.3)))',
drawtext=fontfile=${FONT}:text='AND IT GETS SMARTER EVERY TIME':fontcolor=${GOLD}:fontsize=44:x=(w-text_w)/2:y=480:alpha='min(1\,max(0\,min((t-45.207)/0.3\,(57.536-t)/0.3)))',
drawtext=fontfile=${FONT}:text='ADVANCE closes the loop -- proven improvements\, compounding with every activation':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=560:alpha='min(1\,max(0\,min((t-45.507)/0.3\,(57.536-t)/0.3)))',
drawtext=fontfile=${FONT}:text='ORGANIZATIONS DO NOT FAIL BECAUSE THEY LACK TALENTED PEOPLE.':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=500:alpha='min(1\,max(0\,min((t-57.536)/0.3\,(62.176-t)/0.3)))',
drawtext=fontfile=${FONT}:text='THEY FAIL BECAUSE KNOWLEDGE DISAPPEARS BETWEEN EVENTS.':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=500:alpha='min(1\,max(0\,min((t-62.176)/0.3\,(66.659-t)/0.3)))',
drawtext=fontfile=${FONT}:text='READINESS OS ENSURES YOUR EXPERIENCE BECOMES CAPABILITY':fontcolor=${GOLD}:fontsize=32:x=(w-text_w)/2:y=470:alpha='min(1\,max(0\,min((t-66.659)/0.3\,(75.017-t)/0.3)))',
drawtext=fontfile=${FONT}:text='BEFORE YOUR NEXT SITUATION.':fontcolor=${GOLD}:fontsize=32:x=(w-text_w)/2:y=520:alpha='min(1\,max(0\,min((t-66.659)/0.3\,(75.017-t)/0.3)))',
drawtext=fontfile=${FONT}:text='When the Situation Arrives --':fontcolor=0xB8BCC8:fontsize=28:x=(w-text_w)/2:y=440:alpha='min(1\,max(0\,min((t-75.017)/0.3\,(80.658-t)/0.3)))',
drawtext=fontfile=${FONT}:text='The Response Is Ready':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=490:alpha='min(1\,max(0\,min((t-75.317)/0.3\,(80.658-t)/0.3)))',
drawtext=fontfile=${FONT}:text='Before the Trigger Fires.':fontcolor=${GOLD}:fontsize=42:x=(w-text_w)/2:y=550:alpha='min(1\,max(0\,min((t-75.617)/0.3\,(80.658-t)/0.3)))',
drawtext=fontfile=${FONT}:text='THIS IS VAUGHNMARTIN READINESS OS':fontcolor=${GOLD}:fontsize=24:x=(w-text_w)/2:y=445:alpha='min(1\,max(0\,(t-80.658)/0.3))',
drawbox=x=(w-820)/2:y=490:w=820:h=170:color=${NAVY}@0.9:t=fill:enable='gte(t,80.658)',
drawbox=x=(w-820)/2:y=490:w=820:h=3:color=${GOLD}:t=fill:enable='gte(t,80.658)',
drawbox=x=(w-820)/2:y=657:w=820:h=3:color=${GOLD}:t=fill:enable='gte(t,80.658)',
drawtext=fontfile=${FONT}:text='REQUEST FOUNDING PARTNER ACCESS':fontcolor=${GOLD}:fontsize=34:x=(w-text_w)/2:y=545:alpha='min(1\,max(0\,(t-80.658)/0.3))',
drawtext=fontfile=${FONT}:text='vaughnmartin.com':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=600:alpha='min(1\,max(0\,(t-80.658)/0.3))'
[base];
$(brand_overlay_hero 90)
[branded]fade=t=in:st=0:d=0.6,
fade=t=out:st=90.047:d=0.6
" -pix_fmt yuv420p -r 25 cut4_endcard.mp4
}

# Concatenate all five cuts using the concat FILTER (not the concat demuxer).
# The demuxer concatenates raw bitstream packets and corrupts NAL units when clips
# were encoded independently (different SPS/PPS per clip) -- the filter decodes each
# clip to frames first, which avoids that corruption entirely.
build_concat() {
ffmpeg -y -i cut0_intro.mp4 -i cut1_growth.mp4 -i cut2_risk.mp4 -i cut3_transformation.mp4 -i cut4_endcard.mp4 \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0[outv]" \
  -map "[outv]" -c:v libx264 -crf 23 -preset ultrafast -pix_fmt yuv420p ../readiness_os_3cut_demo_silent.mp4
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
