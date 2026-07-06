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
