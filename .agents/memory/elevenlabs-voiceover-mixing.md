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

## Prefer foreground + `timeout N` over backgrounding ffmpeg in this sandbox
Backgrounding a long ffmpeg job (`nohup ... & disown`) in this sandbox is unreliable: it sometimes survives across tool-call boundaries and completes correctly, but other times gets silently killed mid-encode (no error, process just vanishes from `ps aux`, log stops mid-line) — observed inconsistently across back-to-back attempts of the *same* command with no code change. Don't trust backgrounding for any step whose success gates the next step. Instead, run the job in the foreground inside a single `bash` tool call wrapped in `timeout <110` (leaving margin under the 120s tool limit), and use `-preset ultrafast`. A ~127s 1080p 25fps video encodes in ~22s wall time at ultrafast on this sandbox's 2 cores (~5.8x realtime) — comfortably inside one tool call. Only fall back to backgrounding+polling if the job is provably too long even at ultrafast, and treat its result as unverified until checked (frame count / duration / exit code) after the fact.

**Why:** The exact same mux command (foreground-equivalent logic, only the launch method changed) died silently around the same ~19s-of-video mark on two separate background attempts, then completed cleanly end-to-end (exit 0, correct frame count) the moment it was run as a plain foreground command inside one tool call.

**How to apply:** Any ffmpeg render/concat/mux step — try foreground + `timeout` + `-preset ultrafast` first; only reach for background+poll as a last resort, and always verify the output file afterward (ffprobe duration + frame count) regardless of which method was used.

## `-f concat` demuxer corrupts NAL units when joining independently-encoded clips
Joining multiple separately-rendered mp4 clips with the `-f concat` demuxer (a `concat_list.txt` fed via `-f concat -safe 0 -i list.txt`) — even with `-c:v libx264` forcing a re-encode — can corrupt the video with "Invalid NAL unit size" errors and silently drop most frames (e.g. expected ~3177 frames, got ~1468) when the source clips were encoded independently and carry different SPS/PPS parameter sets. The demuxer's concat mode does raw-ish stream-level splicing before decode, so mismatched bitstream parameters across clips cause corruption that isn't caught by output logs at render time.

**Why:** Fixed by switching to the concat *filter* instead: `ffmpeg -i c0 -i c1 -i c2 ... -filter_complex "[0:v][1:v][2:v]...concat=n=N:v=1:a=0[outv]" -map "[outv]" -c:v libx264 ...`. The filter decodes every input clip to raw frames first, then re-encodes the joined frame sequence, which sidesteps SPS/PPS mismatches entirely. Frame count came back correct (3177/3177) after the switch.

**How to apply:** Any time joining multiple independently-rendered video clips (different ffmpeg invocations/timestamps) into one file — use the `concat` filter (`-filter_complex ...concat=n=N:v=1:a=0[outv]`), not the `-f concat` demuxer, especially when clips weren't all encoded in the same ffmpeg process/settings. Always verify with `ffprobe -count_frames` that the output frame count matches the sum of expected per-clip frames.

## Raw .aac (ADTS) output misreports duration in ffprobe
Muxing/mixing audio to a raw `.aac` file (ADTS bitstream, no container) causes `ffprobe` to badly estimate the duration (seen: reported 135.77s for audio that was actually ~121.05s) because ADTS has no duration metadata and ffprobe falls back to bitrate-based estimation. Output intermediate mixed audio to an `.m4a` (mp4 container) instead of `.aac` whenever the duration will be checked or relied on for sync math.

**Why:** The wrong duration reading nearly caused a mis-timed final mux; switching the intermediate file extension/container from `.aac` to `.m4a` fixed the duration report with no change to the actual audio content.

**How to apply:** Any ffmpeg step producing a standalone AAC audio file for later inspection or muxing — use `.m4a` output, not raw `.aac`.

## Do not use `-shortest` when the video has trailing silent/fade time beyond the last narration line
If the video's final section (e.g. an endcard) is authored with deliberate trailing seconds after the last audio segment ends (for a closing fade-to-black or hold), muxing with `ffmpeg -shortest` truncates the video down to the audio's length — cutting off that closing fade before it completes, since the audio is shorter than the full video. Drop `-shortest` and let the video's full duration win; the trailing portion will just play in silence, which is fine and often the intended effect.

**Why:** Using `-shortest` on this project cut the endcard's closing fade-to-black off before it ever started (video landed ~1.7s short), which was only caught by comparing the muxed output duration against the known/expected silent-video duration.

**How to apply:** Before muxing narration onto a video, compare `ffprobe` durations of the silent video vs. the mixed audio. If the video is intentionally longer (trailing fade/hold), omit `-shortest`; only use it when the video should be trimmed to match audio exactly.

## "Audio sounds cut off at the start" — diagnose onset with astats RMS, not just a waveform glance, and keep the fade very short
If a user reports narration sounding "cut off" at the start of lines even after caption/audio sync timing has been fixed, don't just eyeball a `showwavespic` and slap on a fade — measure the actual onset envelope with `ffmpeg -i seg.mp3 -af astats=metadata=1:reset=1 -f null -` (or windowed RMS checks) to find exactly when true silence ends and real speech begins. In one case the raw TTS segments were true digital silence (~-88dB) until ~30ms in, then had a real, legitimate speech-onset transient at 30-50ms (-25dB → -17dB) — that transient IS the first phoneme, not a glitch.
A fade-in that is too long relative to that onset window actively causes the exact "cut off" symptom it's meant to fix: a 150ms `afade=type=in` ramps amplitude to only ~27-33% at the 30-50ms mark, muffling/swallowing the real first phoneme, so the complaint persists even after adding a fade (and even after fixing caption/audio sync). The correct fix is a much shorter fade — `afade=type=in:start_time=0:duration=0.02` (20ms) — long enough to smooth any true t=0 digital click, short enough to fully resolve to 100% before the real onset transient begins.

**Why:** A 150ms fade was shipped as "the fix" and rejected a second time for the identical complaint; astats RMS analysis showed the fade duration itself — not sync timing — was actively damaging the first phoneme of every line. Shortening it to 20ms resolved it.

**How to apply:** Any time "cut off"/"clipped" audio complaints occur or persist — run the astats onset diagnostic on the raw TTS segments first to find the true silence-to-speech boundary in ms, then pick a fade duration comfortably shorter than that boundary (not a round number guessed from ear/eye).
