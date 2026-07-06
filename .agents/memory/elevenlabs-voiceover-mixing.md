---
name: ElevenLabs voiceover + ffmpeg mixing workflow
description: How to generate per-segment TTS voiceover and mix it into a pre-built silent marketing video with precise timing
---

## Secrets access
`ELEVENLABS_API_KEY` (or any project secret) is available via `process.env` in the `bash` tool's shell, but NOT in the `code_execution` sandbox's `process.env` — that sandbox is a separate notebook environment. Always call ElevenLabs (or any secret-gated API) from `bash` (e.g. `node -e "..."` invoked via bash), never from `code_execution`.

## Voice selection matters for brand tone
ElevenLabs premade voices carry descriptive labels (e.g. "Warm, Captivating Storyteller" vs "Steady Broadcaster" vs "Dominant, Firm"). For executive/enterprise sales narration, an authoritative "broadcaster" style voice reads as more credible than a "storyteller" voice — pick deliberately against the brand's tone requirements, don't default to the first voice tried.

**Why:** Regenerating all segments after a voice swap is cheap (just re-run TTS calls); getting the tone wrong on a sales asset is not.

## Timing narration against a fixed-duration animated video
When muxing voiceover onto a video with scripted on-screen text timed to specific seconds (e.g. drawtext `alpha` cues), each narration segment must fit inside its visual window without bleeding into the next cue or the section's fade-out. Practical approach:
1. Generate all TTS segments first, then measure actual durations with `ffprobe -show_entries format=duration`. Never assume duration from text length — actual TTS timing varies by voice/model.
2. If a segment's measured duration would overrun its allotted window (e.g. the closing tagline doesn't fit before the video ends), extend that section's clip duration (and push its fade-out further) rather than truncating or rushing the narration.
3. Build the mixed track with one `adelay=<ms>|<ms>` filter per segment (mono) feeding into a single `amix=inputs=N:normalize=0:dropout_transition=0`, then `apad=whole_dur=<total_video_seconds>` so the audio track exactly matches final video length before muxing.
4. Mux with `-map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest` — `copy` on video avoids re-encoding the already-rendered visual track.

**How to apply:** Any task that adds narration/voiceover to a pre-rendered animated video with timed on-screen text.

## Script content quality, not just technical mixing
Technically correct sync is not enough — a script that just reads section labels aloud ("Growth and positioning.") or strings together disconnected on-screen caption fragments sounds cheesy and tells no story. Write narration as connective tissue with a hook → cost-of-old-way → payoff-of-new-way arc per beat, not a transcript of the UI captions. If a well-paced story script doesn't fit the existing per-cut duration, extend the cut's duration (e.g. hold the "after" state on screen longer) rather than cramming/rushing the read — cramped pacing itself reads as unnatural/cheesy.

**Why:** First-pass voiceover was rejected by the user as "cheesy, doesn't tell a story" even though the mix was technically correct — content quality is a separate axis from mixing quality.

## Apostrophes break ffmpeg drawtext inside double-quoted -vf strings
When building a `-vf "drawtext=...:text='...'..."` filter chain inside a double-quoted bash string, an apostrophe in the caption text (e.g. "DOESN'T", "who's", "NovaTech's") breaks the single-quoted `text='...'` field early. The remaining filter option text (fontcolor=, alpha=if(...)) then gets swallowed into the text field and renders as garbled literal text on screen instead of being parsed as filter options. Escaping the apostrophe (e.g. `'\\''`) is unreliable in this context.

**Why:** This exact bug recurred twice in the same project (once on "NovaTech's", once on "DOESN'T"/"who's") before being fixed — the fix that actually works is removing the apostrophe from the caption text entirely (e.g. "DOES NOT", "who is"), not trying to escape it.

**How to apply:** Any ffmpeg drawtext caption authored inside a double-quoted `-vf` string — write captions without apostrophes/contractions rather than attempting to escape them.
