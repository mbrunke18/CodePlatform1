import { useEffect, CSSProperties } from 'react';
import { useLocation } from 'wouter';
import PageLayout from "@/components/layout/PageLayout";
import { updatePageMetadata } from '@/lib/seo';
import { ArrowRight, Film, Monitor, Music, Clock, Type, Eye, Printer } from 'lucide-react';

const NAVY   = "#0A0F2E";
const GOLD   = "#C9A84C";
const TEAL   = "#2B8A6E";
const IVORY  = "#F0EDE4";
const BORDER = "#E0DBD0";
const MUTED  = "#6B7280";
const RED    = "#EF4444";
const DARK   = "#1A1F3A";

const CG: CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const BC: CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };
const MONO: CSSProperties = { fontFamily: 'monospace' };

interface Scene {
  num: string;
  title: string;
  timing: string;
  visual: string;
  onScreen: string[];
  direction: string;
  audio: string;
}

const scenes: Scene[] = [
  {
    num: '01',
    title: 'Cold Open — The Counter',
    timing: '0:00 – 0:08',
    visual: 'Pure black. No logo, no music. A monospace red number appears at the center of frame, ticking upward from $0 — dollar by dollar, then faster. The screen is otherwise empty.',
    onScreen: [
      '$0',
      '$47',
      '$312',
      '$1,804',
    ],
    direction: 'No voiceover. No music yet. Just the ticking. The number accelerates slightly — not frantic, but relentless. After 8 seconds the counter freezes.',
    audio: 'Silence. Optional: a single, low-frequency sub-tone that builds imperceptibly under the counter.',
  },
  {
    num: '02',
    title: 'The Question',
    timing: '0:08 – 0:15',
    visual: 'Counter freezes mid-tick. White text appears below it, sentence by sentence, in Cormorant Garamond. No animation — text cuts in, not fades.',
    onScreen: [
      'This is what the last 8 seconds cost you.',
      'Not the breach. Not the lawsuit. Not the lost deal.',
      'The mobilization cost.',
      'The cost of not being ready.',
    ],
    direction: 'Each line holds for 1–1.5 seconds before the next cuts in. The counter remains visible above, frozen, throughout. The frozen number is its own accusation.',
    audio: 'Music begins — very low, single piano note, sustained. No melody yet.',
  },
  {
    num: '03',
    title: 'The Fork',
    timing: '0:15 – 0:25',
    visual: 'A hard vertical cut divides the screen. Left half goes deep red-black. Right half goes deep navy-teal. Each side gets a single label — no other content yet.',
    onScreen: [
      '[Left, red]  WITHOUT READINESS OS',
      '[Right, teal]  WITH READINESS OS',
      '[Center, white, small]  Same organization. Same situation. One variable.',
    ],
    direction: 'The split is sharp — not a dissolve, not a wipe. It cuts. The labels appear simultaneously. Hold 3 seconds on the empty split screen. The tension comes from what is NOT there yet.',
    audio: 'Music gains a second layer — low strings, still minimal. Building, not resolving.',
  },
  {
    num: '04',
    title: 'The Situation — Ransomware',
    timing: '0:25 – 0:58',
    visual: 'Both halves begin populating — left side builds downward in red text (timeline milestones), right side builds downward in teal (12-minute resolution). Each milestone cuts in, not fades. Cost flags appear in red on the left side at each node.',
    onScreen: [
      '[Top center, gold]  RANSOMWARE DETECTION · PROTOCOL #47',
      '',
      '[Left timeline, red — each line cuts in with a 1.5s hold]',
      '3:17 AM — Log alert fires. On-call engineer sees it.',
      '6:00 AM — CISO finally reached. 3 hours of uncoordinated activity.',
      'Day 1 — Legal notified. Outside counsel at emergency rates. +$40K',
      'Day 2 — Board informed. Separately. With different facts. +$85K',
      'Day 7 — Customer notification language finally agreed. +$210K',
      'Day 30 — Full response coordinated. $504K. Separate from the breach.',
      '',
      '[Right timeline, teal — populates faster, each line cuts in]',
      'Minute 0 — Signal detected automatically.',
      'Minute 2 — Protocol #47 staged. 22 tasks. Named owners. Templates ready.',
      'Minute 5 — CISO, Legal, Board, IR firm. Briefed simultaneously. Same brief.',
      'Minute 8 — Outside counsel already briefed on your protocols.',
      'Minute 12 — Executive authorizes. Full coordinated response in motion.',
      '',
      '[Bottom left, red, larger]  $504,000',
      '[Bottom right, teal, larger]  $0',
    ],
    direction: 'The left side populates slowly — Day 1, pause, Day 2, pause — each beat costs them something and they feel it. The right side populates in 15 seconds, done before the left side reaches Day 7. The contrast is the story. The right side is finished and waiting while the left side is still counting.',
    audio: 'Music builds through this scene. The left side milestones are accompanied by a very subtle low drum hit — not dramatic, just present. The right side is clean, no percussion. The contrast in audio mirrors the contrast in cost.',
  },
  {
    num: '05',
    title: 'The Verdict',
    timing: '0:58 – 1:08',
    visual: 'Both timelines fade. Black screen. Single sentence appears centered in Cormorant Garamond italic, white.',
    onScreen: [
      'The breach cost is fixed.',
      'The mobilization cost — $504,000 — is entirely preventable.',
    ],
    direction: 'Two-line statement. First line alone for 2 seconds. Second line cuts in. Hold both for 4 seconds. Silence except for music.',
    audio: 'Music pauses on a single sustained note at the moment "entirely preventable" appears.',
  },
  {
    num: '06',
    title: 'The Math',
    timing: '1:08 – 1:20',
    visual: 'White background. Three stark numbers appear in sequence, centered, in large Barlow Condensed. No decorative elements.',
    onScreen: [
      '$504K      cost per situation, without Readiness OS',
      '$150K      Readiness OS Core — full year, flat',
      '$354K      you keep — every time a situation fires',
      '',
      '[ After a 2-second hold, a fourth line appears in gold ]',
      'Break-even: your first activation.',
    ],
    direction: 'Numbers appear one at a time, 1.5 seconds apart. Clean, brutal math. No narration needed. The gold break-even line is the emotional resolution of the video.',
    audio: 'Music resolves here — not triumphant, but settled. The tension releases. A quiet, clean chord.',
  },
  {
    num: '07',
    title: 'The Counter Returns',
    timing: '1:20 – 1:27',
    visual: 'Black screen. The red counter from scene 01 reappears — but now it is much larger, and it has been running the entire time. The number is much higher than where it froze in scene 02.',
    onScreen: [
      '[ Counter, large, red — showing the accumulated time since the video began ]',
      '',
      '[ Below it, white, Cormorant Garamond ]',
      'This counter has been running since you pressed play.',
      'It doesn\'t pause when you do.',
    ],
    direction: 'The callback to scene 01 is the emotional gut-punch. The number should be real — calculated from video runtime × the per-second cost rate. If produced as a static video, use the 90-second value. If produced as an interactive web video, make it live.',
    audio: 'Single piano note returns — the same one from scene 02. Bookending.',
  },
  {
    num: '08',
    title: 'The Close',
    timing: '1:27 – 1:30',
    visual: 'Navy background. VaughnMartin seal + wordmark, centered. Single line of text below. Then silence.',
    onScreen: [
      '[ VaughnMartin / Readiness OS logo ]',
      '',
      'When the situation arrives — The Response Is Ready Before the Trigger Fires.',
      '',
      'ReadinessOS.com',
    ],
    direction: 'No CTA button. No "Learn More." No URL with UTM codes. Just the tagline and the domain. Confidence is the CTA.',
    audio: 'Music fades to silence over 3 seconds. The final frame holds in silence for 1 full second before cut to black.',
  },
];

const cutdown: Scene[] = [
  {
    num: 'C1',
    title: 'The Counter',
    timing: '0:00 – 0:05',
    visual: 'Red monospace counter ticking from $0. Freezes.',
    onScreen: ['$0', '$47', '$312', '[ freeze ]', 'This is your mobilization cost.'],
    direction: 'Identical to scene 01 of the 90-second, compressed. No scene 02 text — go straight to the freeze + single line.',
    audio: 'Silence, then low sub-tone.',
  },
  {
    num: 'C2',
    title: 'The Fork — Compressed',
    timing: '0:05 – 0:15',
    visual: 'Hard split. Red left / teal right. Key milestones only — 3 per side, simultaneous, fast.',
    onScreen: [
      '[Left]  Day 30 — Full response coordinated. $504K.',
      '[Right]  Minute 12 — Executive authorizes. Full response in motion.',
      '[Center]  Same situation. One variable.',
    ],
    direction: 'No slow build — show the end state of both paths immediately. The contrast does the work faster.',
    audio: 'Music enters immediately — the settled chord from scene 06 of the long form.',
  },
  {
    num: 'C3',
    title: 'The Math — Single Line',
    timing: '0:15 – 0:25',
    visual: 'White background. One number. Then the break-even.',
    onScreen: [
      '$504K per situation  →  $150K/year',
      'Break-even: your first activation.',
    ],
    direction: 'Two lines, 5 seconds each. No decoration. The ratio is self-explanatory.',
    audio: 'Music resolves.',
  },
  {
    num: 'C4',
    title: 'The Close',
    timing: '0:25 – 0:30',
    visual: 'Navy. Logo. Tagline. Domain.',
    onScreen: [
      '[ VaughnMartin / Readiness OS logo ]',
      'When the situation arrives — The Response Is Ready.',
      'ReadinessOS.com',
    ],
    direction: 'Identical to scene 08. Consistency across cuts matters.',
    audio: 'Fade to silence.',
  },
];

function SceneCard({ scene, isCutdown = false }: { scene: Scene; isCutdown?: boolean }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, marginBottom: 24, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: isCutdown ? DARK : NAVY, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ ...BC, ...MONO, color: GOLD, fontSize: 22, fontWeight: 800, letterSpacing: '0.05em' }}>
            {scene.num}
          </span>
          <div>
            <p style={{ ...BC, color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>{scene.title}</p>
          </div>
        </div>
        <span style={{ ...BC, color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', background: 'rgba(201,168,76,0.12)', padding: '4px 12px', border: `1px solid rgba(201,168,76,0.3)` }}>
          <Clock style={{ width: 10, height: 10, display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
          {scene.timing}
        </span>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${BORDER}` }}>
        {/* Visual */}
        <div style={{ padding: '20px 24px', borderRight: `1px solid ${BORDER}` }}>
          <p style={{ ...BC, color: TEAL, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
            <Eye style={{ width: 10, height: 10, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Visual Direction
          </p>
          <p style={{ color: '#374151', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{scene.visual}</p>
        </div>
        {/* Direction */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{ ...BC, color: MUTED, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
            <Film style={{ width: 10, height: 10, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Director's Notes
          </p>
          <p style={{ color: '#374151', fontSize: 13, lineHeight: 1.65, margin: '0 0 14px' }}>{scene.direction}</p>
          <div style={{ padding: '10px 12px', background: '#FFF9EE', border: `1px solid rgba(201,168,76,0.2)` }}>
            <p style={{ ...BC, color: GOLD, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px' }}>
              <Music style={{ width: 10, height: 10, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              Audio
            </p>
            <p style={{ color: '#78680A', fontSize: 12, lineHeight: 1.55, margin: 0 }}>{scene.audio}</p>
          </div>
        </div>
      </div>

      {/* On-screen text */}
      <div style={{ padding: '16px 24px', background: '#FAFAFA' }}>
        <p style={{ ...BC, color: MUTED, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
          <Type style={{ width: 10, height: 10, display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          On-Screen Text (exact copy)
        </p>
        <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7, color: '#1F2937', whiteSpace: 'pre-wrap', background: '#fff', border: `1px solid ${BORDER}`, padding: '12px 14px' }}>
          {scene.onScreen.map((line, i) => (
            <div key={i} style={{ color: line.startsWith('[') ? TEAL : line === '' ? 'transparent' : '#1F2937', fontSize: line.startsWith('[') ? 11 : 12 }}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VideoBrief() {
  const [, nav] = useLocation();

  useEffect(() => {
    updatePageMetadata({
      title: 'Video Production Brief — The Cost of Waiting · VaughnMartin',
      description: 'Full cinematic storyboard and production brief for "The Cost of Waiting" brand video. 90-second hero + 30-second cutdown.',
      ogTitle: 'Video Brief — The Cost of Waiting',
      ogDescription: 'Scene-by-scene storyboard, exact on-screen text, visual direction, music notes. Production-ready.',
    });
  }, []);

  return (
    <PageLayout>

      {/* ── BRIEF HEADER ── */}
      <section style={{ background: NAVY, padding: '80px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p style={{ ...BC, color: GOLD, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
                <Film style={{ width: 12, height: 12, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Video Production Brief — Confidential
              </p>
              <h1 style={{ ...CG, color: '#fff', fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>
                "The Cost of Waiting"
              </h1>
              <p style={{ ...CG, color: GOLD, fontSize: 'clamp(18px,2.5vw,28px)', fontStyle: 'italic', margin: '0 0 20px' }}>
                A Brand Statement Video — VaughnMartin Readiness OS
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>
                This document provides the complete creative brief, scene-by-scene storyboard,
                on-screen text, visual direction, and audio notes for a 90-second hero video
                and 30-second cutdown. Intended for direct handoff to a production studio.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              style={{ ...BC, background: 'rgba(255,255,255,0.06)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 22px', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Printer style={{ width: 14, height: 14 }} />
              Print / Export PDF
            </button>
          </div>

          {/* Spec grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', marginTop: 40, borderRadius: '0.15rem', overflow: 'hidden' }}>
            {[
              { label: 'Primary Format', value: '90 seconds' },
              { label: 'Cutdown', value: '30 seconds' },
              { label: 'Aspect Ratio', value: '16:9 + 9:16' },
              { label: 'Delivery', value: 'Web · LinkedIn · Deck' },
              { label: 'Tone', value: 'Cold → Resolved' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(10,15,46,0.6)', padding: '16px 18px' }}>
                <p style={{ ...BC, color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ ...BC, color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREATIVE DIRECTION OVERVIEW ── */}
      <section style={{ background: IVORY, borderBottom: `1px solid ${BORDER}`, padding: '48px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20 }}>Creative Direction</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: BORDER }}>
            {[
              {
                icon: Eye,
                label: 'Visual Language',
                items: [
                  'Pure black or deep navy backgrounds throughout',
                  'No lifestyle footage, no stock humans, no offices',
                  'Two colors carry the entire story: Red (cost, chaos) and Teal (readiness, resolution)',
                  'Gold used only for the brand and the break-even moment',
                  'Typography is the visual — no b-roll required',
                ],
              },
              {
                icon: Type,
                label: 'Typography Treatment',
                items: [
                  'Headlines: Cormorant Garamond — editorial, authoritative',
                  'Labels / metrics: Barlow Condensed — precise, compressed',
                  'Counter / numbers: Monospace — machine-read, clinical',
                  'Text cuts in — never fades. Confidence is instantaneous.',
                  'No animation on the text itself — the sequence is the animation',
                ],
              },
              {
                icon: Music,
                label: 'Audio Direction',
                items: [
                  'No voiceover anywhere in the 90-second or the cutdown',
                  'Music: single piano note opens, strings layer in during tension',
                  'Left-side (red) milestones: subtle low drum hit',
                  'Right-side (teal) milestones: clean — no percussion',
                  'Music resolves on the break-even line — not triumphant, settled',
                ],
              },
              {
                icon: Monitor,
                label: 'Production Notes',
                items: [
                  'No talking heads. No interviews. No testimonials in this cut.',
                  'The counter in scene 01 and 07 can be filmed live from the web page',
                  'The red/teal split in scene 03 is a hard editorial cut — not a graphic',
                  'Timeline milestones are cut-in supers, not motion graphics',
                  'Subtitles must be burned in for LinkedIn autoplay (no sound)',
                ],
              },
            ].map(col => {
              const Icon = col.icon;
              return (
                <div key={col.label} style={{ background: '#fff', padding: '24px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Icon style={{ width: 14, height: 14, color: GOLD }} />
                    <p style={{ ...BC, color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>{col.label}</p>
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                    {col.items.map((item, i) => (
                      <li key={i} style={{ color: MUTED, fontSize: 12, lineHeight: 1.65, marginBottom: 6 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 90-SECOND STORYBOARD ── */}
      <section style={{ background: '#F9F8F6', padding: '64px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: 3, height: 40, background: GOLD }} />
            <div>
              <p style={{ ...BC, color: GOLD, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', margin: '0 0 4px' }}>Version A</p>
              <h2 style={{ ...CG, color: NAVY, fontSize: 32, fontWeight: 600, margin: 0 }}>90-Second Hero Video — 8 Scenes</h2>
            </div>
          </div>

          {scenes.map(scene => <SceneCard key={scene.num} scene={scene} />)}
        </div>
      </section>

      {/* ── 30-SECOND CUTDOWN ── */}
      <section style={{ background: '#F0EFEC', padding: '64px 0', borderTop: `3px solid ${DARK}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, paddingBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: 3, height: 40, background: TEAL }} />
            <div>
              <p style={{ ...BC, color: TEAL, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', margin: '0 0 4px' }}>Version B</p>
              <h2 style={{ ...CG, color: NAVY, fontSize: 32, fontWeight: 600, margin: 0 }}>30-Second Cutdown — 4 Scenes</h2>
            </div>
          </div>

          <div style={{ padding: '14px 20px', background: '#fff', border: `1px solid ${BORDER}`, marginBottom: 28, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 3, height: 40, background: TEAL, flexShrink: 0 }} />
            <p style={{ color: '#374151', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
              The 30-second cutdown is optimized for <strong>LinkedIn</strong> and <strong>paid social</strong>. It leads with the counter, delivers the fork in compressed form, lands the math, and closes. No scene 02 (the question text) — too slow for paid. The emotional effect comes from contrast speed, not from holding on text.
            </p>
          </div>

          {cutdown.map(scene => <SceneCard key={scene.num} scene={scene} isCutdown />)}
        </div>
      </section>

      {/* ── DISTRIBUTION NOTES ── */}
      <section style={{ background: '#fff', padding: '64px 0', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 24 }}>Distribution & Placement</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: BORDER }}>
            {[
              {
                channel: 'Website Hero',
                version: '90-second',
                notes: [
                  'Embed at /the-cost-of-waiting above the dual tickers',
                  'Autoplay off — user-initiated only',
                  'Closed captions required (WCAG AA)',
                  'Poster frame: the frozen red counter from scene 01',
                ],
              },
              {
                channel: 'LinkedIn Organic',
                version: '90-second + 30-second',
                notes: [
                  'Upload natively (not YouTube embed)',
                  'Burn subtitles — 85% of LinkedIn video watched without sound',
                  'First 3 seconds must work without audio or text read (the counter)',
                  'Post copy: 3 lines max. Let the video speak.',
                ],
              },
              {
                channel: 'Investor & Sales Decks',
                version: '90-second',
                notes: [
                  'Embed in slide 3 of the investor deck (after the problem statement)',
                  'Autoplay on slide entry in Keynote/PowerPoint',
                  'Export a static stills version for PDF decks',
                  'The counter freeze frame works as a standalone slide image',
                ],
              },
              {
                channel: 'Founding Partner Outreach',
                version: '30-second',
                notes: [
                  'Embed in prospect brief emails (Loom-style link)',
                  'Subject line: "8 seconds, then you\'ll see it"',
                  'Do not attach — link only, tracked',
                  'Follow up is the /the-cost-of-waiting page, not a PDF',
                ],
              },
              {
                channel: 'LinkedIn Paid',
                version: '30-second',
                notes: [
                  '30-second version only — platform penalizes longer in paid',
                  'Target: CRO, CFO, CCO at $1B+ companies in transition',
                  'CTA: "See the full cost" → /the-cost-of-waiting',
                  'Test A/B: counter open vs. fork open',
                ],
              },
              {
                channel: 'Conference / Event',
                version: '90-second — looped',
                notes: [
                  'Remove audio for looped booth display',
                  'Counter and split-screen read without audio',
                  'Loop at scene 08 → scene 01 (seamless)',
                  'QR code overlay: ReadinessOS.com',
                ],
              },
            ].map(row => (
              <div key={row.channel} style={{ background: '#fff', padding: '24px 20px' }}>
                <p style={{ ...BC, color: NAVY, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>{row.channel}</p>
                <p style={{ ...BC, color: TEAL, fontSize: 10, letterSpacing: '0.14em', margin: '0 0 14px' }}>{row.version}</p>
                <ul style={{ margin: 0, padding: '0 0 0 14px' }}>
                  {row.notes.map((note, i) => (
                    <li key={i} style={{ color: MUTED, fontSize: 12, lineHeight: 1.65, marginBottom: 4 }}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HANDOFF CTA ── */}
      <section style={{ background: NAVY, padding: '72px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 32px' }}>
          <p style={{ ...BC, color: GOLD, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16 }}>Production Handoff</p>
          <h2 style={{ ...CG, color: '#fff', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
            This document is production-ready.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.75, marginBottom: 36 }}>
            Every scene has visual direction, exact on-screen text, director's notes, and audio cues.
            The creative brief and distribution plan are complete. This goes directly to the studio.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()}
              style={{ ...BC, background: GOLD, color: NAVY, border: 'none', padding: '14px 28px', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Printer style={{ width: 13, height: 13 }} /> Export as PDF
            </button>
            <button onClick={() => nav('/the-cost-of-waiting')}
              style={{ ...BC, background: 'transparent', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              View the Live Page <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media print {
          section { break-inside: avoid; }
          button { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </PageLayout>
  );
}
