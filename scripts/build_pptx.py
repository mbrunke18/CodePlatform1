"""
VaughnMartin Investor Pitch Deck — PPTX builder (v10 final, 11 slides)
Matches VaughnMartin-Investor-Pitch-Deck-v10.html exactly.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

NAVY  = RGBColor(0x0A, 0x0F, 0x2E)
GOLD  = RGBColor(0xC9, 0xA8, 0x4C)
TEAL  = RGBColor(0x2B, 0x8A, 0x6E)
IVORY = RGBColor(0xF0, 0xED, 0xE4)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
MUTED = RGBColor(0x99, 0xA5, 0xBB)
DARK2 = RGBColor(0x12, 0x1A, 0x44)
DARK3 = RGBColor(0x0E, 0x16, 0x40)
MID   = RGBColor(0x1E, 0x27, 0x55)
RED   = RGBColor(0xFF, 0x50, 0x50)

W = Inches(13.33)
H = Inches(7.5)
TOTAL = 11

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
blank = prs.slide_layouts[6]

# ── Helpers ─────────────────────────────────────────────────────
def new_slide(dark=True):
    s = prs.slides.add_slide(blank)
    bg = s.background.fill; bg.solid()
    bg.fore_color.rgb = NAVY if dark else RGBColor(0xF2, 0xF0, 0xEB)
    return s

def gold_bar(s):
    r = s.shapes.add_shape(1, 0, 0, W, Pt(4))
    r.fill.solid(); r.fill.fore_color.rgb = GOLD; r.line.fill.background()

def txt(s, text, l, t, w, h, size=14, bold=False, color=WHITE,
        align=PP_ALIGN.LEFT, font="Barlow Condensed", italic=False):
    bx = s.shapes.add_textbox(l, t, w, h)
    tf = bx.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run(); r.text = text
    r.font.name = font; r.font.size = Pt(size)
    r.font.bold = bold; r.font.italic = italic
    r.font.color.rgb = color
    return bx

def lbl(s, text, l, t, w=Inches(12), color=GOLD, center=False):
    txt(s, text.upper(), l, t, w, Pt(18), size=9, bold=True, color=color,
        align=PP_ALIGN.CENTER if center else PP_ALIGN.LEFT)

def headline(s, text, l, t, w, h, size=36, color=WHITE, align=PP_ALIGN.LEFT):
    bx = s.shapes.add_textbox(l, t, w, h)
    tf = bx.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run(); r.text = text
    r.font.name = "Cormorant Garamond"; r.font.size = Pt(size)
    r.font.bold = True; r.font.color.rgb = color

def rule(s, l, t, w=Inches(4), color=GOLD):
    r = s.shapes.add_shape(1, l, t, w, Pt(1.5))
    r.fill.solid(); r.fill.fore_color.rgb = color; r.line.fill.background()

def box(s, l, t, w, h, color=DARK2, stroke=None):
    r = s.shapes.add_shape(1, l, t, w, h)
    r.fill.solid(); r.fill.fore_color.rgb = color
    if stroke: r.line.color.rgb = stroke; r.line.width = Pt(1)
    else: r.line.fill.background()
    return r

def framed_img(s, path, l, t, w, h, caption=None):
    if os.path.exists(path):
        s.shapes.add_picture(path, l, t, w, h)
    frame = s.shapes.add_shape(1, l, t, w, h)
    frame.fill.background(); frame.line.color.rgb = GOLD; frame.line.width = Pt(1.2)
    if caption:
        cap_h = Inches(0.30)
        cap_bg = s.shapes.add_shape(1, l, t + h - cap_h, w, cap_h)
        cap_bg.fill.solid(); cap_bg.fill.fore_color.rgb = RGBColor(0x08, 0x0D, 0x26)
        cap_bg.line.fill.background()
        txt(s, caption, l + Inches(0.1), t + h - cap_h + Pt(4),
            w - Inches(0.2), cap_h, size=9, bold=True, color=GOLD, align=PP_ALIGN.LEFT)

def slide_num(s, n):
    txt(s, f"{n:02d} / {TOTAL:02d}",
        Inches(12.3), Inches(7.15), Inches(1), Pt(16),
        size=10, bold=True, color=RGBColor(0x44, 0x50, 0x70),
        align=PP_ALIGN.RIGHT)

# ═══════════════════════════════════════════════════════════════
# SLIDE 1 — Opening
# ═══════════════════════════════════════════════════════════════
s1 = new_slide()
gold_bar(s1)

lbl(s1, "VaughnMartin · Readiness OS", Inches(0.5), Inches(0.45), center=True)
headline(s1,
    "When a strategic trigger fires in your organization—",
    Inches(0.8), Inches(0.9), Inches(11.73), Inches(1.1),
    size=42, align=PP_ALIGN.CENTER)
headline(s1,
    "are you executing in 12 minutes or organizing from scratch?",
    Inches(0.8), Inches(1.9), Inches(11.73), Inches(1.35),
    size=38, color=GOLD, align=PP_ALIGN.CENTER)

txt(s1, "Signal advantage before execution advantage.",
    Inches(0.8), Inches(3.2), Inches(11.73), Pt(28),
    size=18, italic=True, color=MUTED, align=PP_ALIGN.CENTER, font="Cormorant Garamond")

for i, chip in enumerate(["Activist Investor · 91%", "Ransomware · 95%", "Regulatory Inquiry · 87%"]):
    cx = Inches(1.5 + i * 3.5); cy = Inches(4.05)
    chip_bg = s1.shapes.add_shape(1, cx, cy, Inches(3.3), Inches(0.46))
    chip_bg.fill.solid(); chip_bg.fill.fore_color.rgb = RGBColor(0x18, 0x22, 0x50)
    chip_bg.line.color.rgb = RGBColor(0x44, 0x52, 0x80); chip_bg.line.width = Pt(1)
    txt(s1, chip, cx + Inches(0.1), cy + Pt(7), Inches(3.1), Inches(0.46),
        size=12, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

footer_bg = s1.shapes.add_shape(1, 0, Inches(6.88), W, Inches(0.55))
footer_bg.fill.solid(); footer_bg.fill.fore_color.rgb = RGBColor(0x08, 0x0D, 0x26)
footer_bg.line.fill.background()
txt(s1, "AI monitors continuously.   Executives authorize decisively.",
    Inches(0.5), Inches(6.93), Inches(12.33), Inches(0.45),
    size=12, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
slide_num(s1, 1)

# ═══════════════════════════════════════════════════════════════
# SLIDE 2 — Readiness Question
# ═══════════════════════════════════════════════════════════════
s2 = new_slide()
gold_bar(s2)

# Left panel — 30 Days
left = box(s2, Inches(0.4), Inches(0.55), Inches(5.85), Inches(6.6),
    color=RGBColor(0x0D, 0x14, 0x38))
lbl(s2, "The Reality", Inches(0.7), Inches(0.75))
txt(s2, "30", Inches(0.7), Inches(1.1), Inches(3.2), Inches(2.2),
    size=120, bold=True, color=GOLD, font="Cormorant Garamond")
txt(s2, "DAYS", Inches(0.7), Inches(3.05), Inches(3.2), Inches(0.55),
    size=30, bold=True, color=WHITE)
rule(s2, Inches(0.7), Inches(3.7), Inches(4.7))
txt(s2, "Mobilization time before any execution begins.",
    Inches(0.7), Inches(3.88), Inches(4.7), Inches(0.6),
    size=15, italic=True, color=MUTED, font="Cormorant Garamond")

# Right panel — Readiness question
right = box(s2, Inches(6.7), Inches(0.55), Inches(6.23), Inches(6.6),
    color=RGBColor(0x0D, 0x14, 0x38))
lbl(s2, "The Readiness Question", Inches(7.0), Inches(0.75))
headline(s2, "Who calls who?\nWhere's the brief?\nWho owns it? Who authorizes?",
    Inches(7.0), Inches(1.1), Inches(5.8), Inches(2.3), size=26, color=GOLD)
rule(s2, Inches(7.0), Inches(3.52), Inches(5.5))

accent_bg = s2.shapes.add_shape(1, Inches(7.0), Inches(3.7), Inches(5.8), Inches(0.48))
accent_bg.fill.solid(); accent_bg.fill.fore_color.rgb = RGBColor(0x15, 0x1F, 0x52)
accent_bg.line.fill.background()
txt(s2, "This is a readiness problem, not a talent problem.",
    Inches(7.12), Inches(3.76), Inches(5.56), Inches(0.4),
    size=13, bold=True, color=WHITE)

for i, bullet in enumerate([
    "Coordination restarts from zero at every trigger",
    "The strategic window closes before execution begins",
]):
    yt = Inches(4.32) + i * Inches(0.65)
    txt(s2, "—", Inches(7.0), yt, Inches(0.35), Pt(24), size=14, bold=True, color=GOLD)
    txt(s2, bullet, Inches(7.4), yt, Inches(5.4), Pt(24), size=14, color=MUTED)

div = s2.shapes.add_shape(1, Inches(6.5), Inches(0.4), Pt(1.5), Inches(7.0))
div.fill.solid(); div.fill.fore_color.rgb = MID; div.line.fill.background()
slide_num(s2, 2)

# ═══════════════════════════════════════════════════════════════
# SLIDE 3 — Problem Is Already Here (3 scenario cards)
# ═══════════════════════════════════════════════════════════════
s3 = new_slide()
gold_bar(s3)

lbl(s3, "The Problem Is Already Here", Inches(0.5), Inches(0.45))
headline(s3, "One of these is forming in your organization right now",
    Inches(0.5), Inches(0.78), Inches(12.33), Inches(0.85), size=26, align=PP_ALIGN.CENTER)

for i, (conf, domain, name, meta, accent, pct) in enumerate([
    ("95%", "Risk & Resilience",   "Ransomware\nAttack Confirmed",  "Signal detected · 248 data points",  TEAL, 95),
    ("87%", "Regulatory",          "Regulatory\nInquiry Opened",    "Signal detected · threshold crossed", GOLD, 87),
    ("82%", "Growth & Positioning","Market Entry\nWindow Opening",  "Opportunity signal · live monitoring",GOLD, 82),
]):
    cx = Inches(0.42 + i * 4.32); cy = Inches(1.78)
    cw = Inches(4.1); ch = Inches(4.6)
    box(s3, cx, cy, cw, ch, color=RGBColor(0x10, 0x18, 0x42),
        stroke=RGBColor(0x28, 0x34, 0x68))
    txt(s3, conf, cx + Inches(2.7), cy + Inches(0.15), Inches(1.2), Inches(0.55),
        size=22, bold=True, color=accent, align=PP_ALIGN.RIGHT)
    txt(s3, domain.upper(), cx + Inches(0.18), cy + Inches(0.18), Inches(2.5), Pt(22),
        size=9, bold=True, color=TEAL)
    headline(s3, name, cx + Inches(0.18), cy + Inches(0.65), Inches(3.7), Inches(1.1), size=22)
    txt(s3, meta, cx + Inches(0.18), cy + Inches(1.92), Inches(3.7), Pt(22),
        size=12, color=MUTED)
    bar_bg = s3.shapes.add_shape(1, cx + Inches(0.18), cy + Inches(2.42), Inches(3.74), Pt(4))
    bar_bg.fill.solid(); bar_bg.fill.fore_color.rgb = MID; bar_bg.line.fill.background()
    bar_f = s3.shapes.add_shape(1, cx + Inches(0.18), cy + Inches(2.42),
        Inches(3.74 * pct / 100), Pt(4))
    bar_f.fill.solid(); bar_f.fill.fore_color.rgb = accent; bar_f.line.fill.background()

# Footer strip
strip = s3.shapes.add_shape(1, Inches(0.4), Inches(6.57), Inches(12.53), Inches(0.48))
strip.fill.solid(); strip.fill.fore_color.rgb = RGBColor(0x10, 0x18, 0x42)
strip.line.fill.background()
txt(s3, "221 triggers monitored  ·  248 data points  ·  refreshed every 15 minutes",
    Inches(0.5), Inches(6.62), Inches(12.33), Inches(0.4),
    size=11, bold=True, color=RGBColor(0x44, 0x58, 0x80), align=PP_ALIGN.CENTER)
slide_num(s3, 3)

# ═══════════════════════════════════════════════════════════════
# SLIDE 4 — Solution
# ═══════════════════════════════════════════════════════════════
s4 = new_slide()
gold_bar(s4)

glow = s4.shapes.add_shape(1, Inches(7.5), 0, Inches(6), Inches(3.8))
glow.fill.solid(); glow.fill.fore_color.rgb = RGBColor(0x10, 0x1C, 0x4A)
glow.line.fill.background()

lbl(s4, "The Answer", Inches(0.5), Inches(0.45), center=True)
headline(s4, "The response is ready",
    Inches(1.0), Inches(0.82), Inches(11.33), Inches(1.15), size=54, align=PP_ALIGN.CENTER)
headline(s4, "before the trigger fires.",
    Inches(1.0), Inches(1.88), Inches(11.33), Inches(1.15), size=54, color=GOLD, align=PP_ALIGN.CENTER)
txt(s4, "Preparation  →  Readiness  →  Fearless",
    Inches(1.0), Inches(3.0), Inches(11.33), Pt(28),
    size=16, italic=True, color=MUTED, align=PP_ALIGN.CENTER, font="Cormorant Garamond")

rule(s4, Inches(4.17), Inches(3.6), Inches(5.0))

for i, (num, sub) in enumerate([
    ("170", "Readiness Protocols"),
    ("221", "Strategic Triggers"),
    ("12 MIN", "Execution Window"),
]):
    px = Inches(0.6 + i * 4.2)
    rule(s4, px, Inches(3.75), Inches(3.9))
    sz = 58 if num != "12 MIN" else 42
    txt(s4, num, px, Inches(3.9), Inches(3.9), Inches(1.2),
        size=sz, bold=True, color=GOLD, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s4, sub, px, Inches(5.05), Inches(3.9), Pt(26),
        size=13, color=WHITE, align=PP_ALIGN.CENTER)

tagline_bg = s4.shapes.add_shape(1, Inches(2.0), Inches(6.1), Inches(9.33), Inches(0.52))
tagline_bg.fill.solid(); tagline_bg.fill.fore_color.rgb = RGBColor(0x0A, 0x0F, 0x2E)
tagline_bg.line.color.rgb = RGBColor(0x44, 0x52, 0x80); tagline_bg.line.width = Pt(1)
txt(s4, "AI monitors.   Executives authorize.   Teams execute.",
    Inches(2.1), Inches(6.17), Inches(9.13), Inches(0.44),
    size=14, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
slide_num(s4, 4)

# ═══════════════════════════════════════════════════════════════
# SLIDE 5 — Moat (4 pillars)
# ═══════════════════════════════════════════════════════════════
s5 = new_slide()
gold_bar(s5)

lbl(s5, "Why This Is Defensible", Inches(0.5), Inches(0.45))
headline(s5, "Built into the architecture — not bolted on",
    Inches(0.5), Inches(0.78), Inches(12.33), Inches(0.82), size=28, align=PP_ALIGN.LEFT)

pw = Inches(3.0); ph = Inches(4.0); py = Inches(1.78)
for i, (icon_txt, title, body) in enumerate([
    ("[ ]",
     "Pre-Staged Protocols",
     "170 protocols ready before the trigger fires.\nZero ramp-up. Zero coordination delay."),
    (" → ",
     "Trigger-to-Protocol Mapping",
     "221 triggers mapped to exact protocol,\nstakeholders, and tasks. Detection becomes execution."),
    (" ○ ",
     "Human Authorization Gate",
     "No protocol activates without executive sign-off.\nDecision velocity preserved. Human authority intact."),
    (" ■ ",
     "Audit & Governance Layer",
     "Every activation logged, attributed, and\nboard-reportable. Governance built in, not added later."),
]):
    px = Inches(0.42 + i * 3.24)
    box(s5, px, py, Inches(3.08), ph, color=RGBColor(0x0F, 0x16, 0x3C),
        stroke=RGBColor(0x28, 0x34, 0x60))
    txt(s5, icon_txt, px + Inches(0.22), py + Inches(0.2), Inches(2.64), Inches(0.5),
        size=18, bold=True, color=GOLD, font="Barlow Condensed")
    txt(s5, title.upper(), px + Inches(0.22), py + Inches(0.72), Inches(2.64), Inches(0.7),
        size=11, bold=True, color=GOLD)
    txt(s5, body, px + Inches(0.22), py + Inches(1.52), Inches(2.64), Inches(2.2),
        size=13, color=MUTED)

accent_bar = s5.shapes.add_shape(1, Inches(0.4), Inches(5.95), Inches(12.53), Inches(0.72))
accent_bar.fill.solid(); accent_bar.fill.fore_color.rgb = RGBColor(0x0A, 0x10, 0x30)
accent_bar.line.color.rgb = RGBColor(0x28, 0x34, 0x60); accent_bar.line.width = Pt(1)
txt(s5,
    "Three years to build. Proprietary IDEA Framework. The orchestration layer above the Microsoft stack.",
    Inches(0.6), Inches(6.03), Inches(12.1), Inches(0.55),
    size=13, color=MUTED, align=PP_ALIGN.CENTER)
slide_num(s5, 5)

# ═══════════════════════════════════════════════════════════════
# SLIDE 6 — Mic-Drop: Signal → Execution
# ═══════════════════════════════════════════════════════════════
s6 = new_slide()
gold_bar(s6)

lbl(s6, "Proof of Production", Inches(0.5), Inches(0.45))
headline(s6, "From Signal to Authorized Execution in 12 Minutes",
    Inches(0.5), Inches(0.72), Inches(12.33), Inches(0.78), size=28, align=PP_ALIGN.CENTER)

framed_img(s6, "screenshots/deck_signals.jpg",
    Inches(0.35), Inches(1.55), Inches(6.27), Inches(4.22),
    caption="Live trigger detected with confidence scoring")
framed_img(s6, "screenshots/pptx_how_executes.jpg",
    Inches(6.71), Inches(1.55), Inches(6.27), Inches(4.22),
    caption="Pre-staged protocol, stakeholders, authority & tasks ready before pressure")

tagline_bg = s6.shapes.add_shape(1, 0, Inches(5.94), W, Inches(0.82))
tagline_bg.fill.solid(); tagline_bg.fill.fore_color.rgb = RGBColor(0x08, 0x0D, 0x26)
tagline_bg.line.fill.background()
txt(s6, "AI monitors.   Executives authorize.   Teams execute.",
    Inches(0.5), Inches(6.02), Inches(12.33), Inches(0.52),
    size=22, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
txt(s6,
    "170 protocols  ·  221 triggers  ·  248 data points  ·  refreshed every 15 minutes",
    Inches(0.5), Inches(6.65), Inches(12.33), Inches(0.38),
    size=10, color=MUTED, align=PP_ALIGN.CENTER)
slide_num(s6, 6)

# ═══════════════════════════════════════════════════════════════
# SLIDE 7 — Business Value / ROI
# ═══════════════════════════════════════════════════════════════
s7 = new_slide()
gold_bar(s7)

lbl(s7, "Business Value", Inches(0.5), Inches(0.45))
headline(s7, "Readiness is not overhead.",
    Inches(0.5), Inches(0.75), Inches(8.0), Inches(0.88), size=36)
headline(s7, "It is value protection.",
    Inches(0.5), Inches(1.55), Inches(8.0), Inches(0.88), size=36, color=GOLD)
rule(s7, Inches(0.5), Inches(2.52), Inches(12.33))

# Left — big number + bullets
txt(s7, "3,600\u00d7", Inches(0.5), Inches(2.72), Inches(5.5), Inches(1.4),
    size=72, bold=True, color=GOLD, font="Cormorant Garamond")
txt(s7, "Execution head start vs. old mobilization model",
    Inches(0.5), Inches(3.95), Inches(5.5), Pt(26),
    size=12, color=MUTED)
rule(s7, Inches(0.5), Inches(4.35), Inches(5.5))

for i, (bullet, col) in enumerate([
    ("\u25b6  Founding Partner: $75K / 90-day validation", GOLD),
    ("\u25b6  Growth tiers: $75K\u2013$250K annually", WHITE),
    ("\u25b6  If one strategic window is preserved, readiness pays for itself quickly", TEAL),
]):
    yt = Inches(4.55) + i * Inches(0.62)
    txt(s7, bullet, Inches(0.5), yt, Inches(5.5), Inches(0.6),
        size=14, color=col)

# Right — commercial table
right_box = box(s7, Inches(6.8), Inches(2.68), Inches(6.13), Inches(4.46),
    color=RGBColor(0x0D, 0x14, 0x3A))
txt(s7, "Commercial Logic", Inches(6.8), Inches(2.8), Inches(6.0), Pt(18),
    size=9, bold=True, color=GOLD)
txt(s7,
    "Replaces the $400K\u2013$800K consulting retainer.\nBreak-even before the 2nd activation.",
    Inches(7.0), Inches(3.05), Inches(5.7), Inches(0.75),
    size=13, italic=True, color=MUTED, font="Cormorant Garamond")
for i, (k, v, vc) in enumerate([
    ("Founding Partner", "$75K / 90 days", GOLD),
    ("Growth Tier",      "$75K\u2013$250K annually", WHITE),
    ("Cohort",           "startup to Fortune 500", WHITE),
    ("Board Line",       "Cost of delay > cost of readiness", TEAL),
]):
    yt = Inches(3.98) + i * Inches(0.66)
    sep = s7.shapes.add_shape(1, Inches(7.0), yt - Pt(2), Inches(5.6), Pt(0.8))
    sep.fill.solid(); sep.fill.fore_color.rgb = RGBColor(0x28, 0x34, 0x58)
    sep.line.fill.background()
    txt(s7, k.upper(), Inches(7.0), yt, Inches(2.4), Pt(24), size=9, bold=True, color=MUTED)
    txt(s7, v, Inches(9.5), yt, Inches(3.1), Pt(24), size=14, bold=(vc == GOLD), color=vc)

slide_num(s7, 7)

# ═══════════════════════════════════════════════════════════════
# SLIDE 8 — Built. Live. In Production.
# ═══════════════════════════════════════════════════════════════
s8 = new_slide()
gold_bar(s8)

lbl(s8, "Built. Live. In Production.", Inches(0.5), Inches(0.45))
headline(s8, "Not a roadmap \u2014 operating now",
    Inches(0.5), Inches(0.78), Inches(12.33), Inches(0.72), size=30, align=PP_ALIGN.CENTER)

for i, (num, sub, col) in enumerate([
    ("170",  "Protocols",   GOLD),
    ("221",  "Triggers",    GOLD),
    ("248",  "Data Points", TEAL),
    ("15m",  "Refresh",     GOLD),
]):
    sx = Inches(0.4 + i * 3.24)
    box(s8, sx, Inches(1.62), Inches(3.1), Inches(1.12), color=DARK2)
    txt(s8, num, sx, Inches(1.67), Inches(3.1), Inches(0.68),
        size=40, bold=True, color=col, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s8, sub, sx, Inches(2.3), Inches(3.1), Pt(26),
        size=12, color=MUTED, align=PP_ALIGN.CENTER)

live = s8.shapes.add_shape(1, Inches(3.3), Inches(2.92), Inches(6.6), Inches(0.38))
live.fill.solid(); live.fill.fore_color.rgb = RGBColor(0x12, 0x22, 0x1C)
live.line.color.rgb = TEAL; live.line.width = Pt(1)
txt(s8, "\u25cf  Signal Detection Active · Updated Every 15 Minutes · vaughnmartin.com",
    Inches(3.4), Inches(2.96), Inches(6.4), Inches(0.35),
    size=10, bold=True, color=TEAL, align=PP_ALIGN.CENTER)

framed_img(s8, "screenshots/deck_signals.jpg",
    Inches(0.35), Inches(3.47), Inches(12.63), Inches(3.67),
    caption="Signal Intelligence feed · vaughnmartin.com · Live detections · production")
slide_num(s8, 8)

# ═══════════════════════════════════════════════════════════════
# SLIDE 9 — Why Now (ivory)
# ═══════════════════════════════════════════════════════════════
s9 = new_slide(dark=False)
gold_bar(s9)

lbl(s9, "Why Now", Inches(0.5), Inches(0.48), color=RGBColor(0x44, 0x4C, 0x66))
headline(s9, "AI capability is accelerating faster than enterprise readiness.",
    Inches(0.5), Inches(0.75), Inches(12.33), Inches(1.12), size=32, color=NAVY)
rule(s9, Inches(0.5), Inches(2.02), Inches(12.33), color=GOLD)

for i, (num, bullet) in enumerate([
    ("01", "Organizations can detect more than ever, but still mobilize too slowly."),
    ("02", "Governance and execution readiness are now the competitive bottleneck."),
    ("03", "The winners will be companies that pair AI sensing with governed execution speed."),
]):
    yt = Inches(2.22) + i * Inches(1.2)
    txt(s9, num, Inches(0.5), yt, Inches(0.55), Inches(0.9),
        size=22, bold=True, color=GOLD)
    txt(s9, bullet, Inches(1.12), yt, Inches(11.7), Inches(0.9),
        size=18, color=RGBColor(0x1A, 0x23, 0x48))

txt(s9, "Sources: Stanford HAI AI Index 2026  ·  Gartner Autonomous Business",
    Inches(0.5), Inches(5.88), Inches(12.33), Pt(22),
    size=11, italic=True, color=MUTED)
slide_num(s9, 9)

# ═══════════════════════════════════════════════════════════════
# SLIDE 10 — The Ask
# ═══════════════════════════════════════════════════════════════
s10 = new_slide()
gold_bar(s10)

# Left panel
left10 = box(s10, Inches(0.4), Inches(0.55), Inches(5.85), Inches(6.6),
    color=RGBColor(0x0D, 0x14, 0x38))
lbl(s10, "The Ask", Inches(0.7), Inches(0.75))
headline(s10, "Twelve founding partners.\nOne defining cohort.",
    Inches(0.7), Inches(1.1), Inches(5.2), Inches(2.1), size=30)
txt(s10, "Partners who want readiness as competitive advantage.",
    Inches(0.7), Inches(3.28), Inches(5.2), Inches(0.7),
    size=15, italic=True, color=MUTED, font="Cormorant Garamond")
rule(s10, Inches(0.7), Inches(4.08), Inches(4.8))
txt(s10, "We're not looking for customers.\nWe're selecting partners who will define the category.",
    Inches(0.7), Inches(4.25), Inches(5.2), Inches(0.95),
    size=14, color=RGBColor(0xCC, 0xD2, 0xE0))

# Right panel
right10 = box(s10, Inches(6.7), Inches(0.55), Inches(6.23), Inches(6.6),
    color=RGBColor(0x0D, 0x14, 0x38))
lbl(s10, "Program Details", Inches(7.0), Inches(0.75))

for i, (k, v, vc) in enumerate([
    ("Program",    "Founding Partner · 90-Day Validation", WHITE),
    ("Commercial", "$75K / 90 days",                       GOLD),
    ("Cohort",     "12 startup to Fortune 500 organizations", WHITE),
    ("Delivery",   "Right-sized by company maturity",      WHITE),
    ("Raise",      "Open strategic raise · conversations underway", MUTED),
]):
    yt = Inches(1.2) + i * Inches(0.98)
    sep = s10.shapes.add_shape(1, Inches(7.0), yt - Pt(2), Inches(5.6), Pt(0.8))
    sep.fill.solid(); sep.fill.fore_color.rgb = RGBColor(0x28, 0x34, 0x58)
    sep.line.fill.background()
    txt(s10, k.upper(), Inches(7.0), yt, Inches(2.1), Pt(24), size=9, bold=True, color=MUTED)
    fsize = 18 if vc == GOLD else 14
    txt(s10, v, Inches(9.2), yt, Inches(3.4), Pt(24),
        size=fsize, bold=(vc == GOLD), color=vc)

cta_bg = s10.shapes.add_shape(1, Inches(7.0), Inches(6.0), Inches(5.6), Inches(0.55))
cta_bg.fill.solid(); cta_bg.fill.fore_color.rgb = RGBColor(0x0A, 0x0F, 0x2E)
cta_bg.line.color.rgb = GOLD; cta_bg.line.width = Pt(1)
txt(s10, "Apply for Founding Partner Access",
    Inches(7.1), Inches(6.08), Inches(5.4), Inches(0.44),
    size=12, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

div10 = s10.shapes.add_shape(1, Inches(6.5), Inches(0.4), Pt(1.5), Inches(7.0))
div10.fill.solid(); div10.fill.fore_color.rgb = MID; div10.line.fill.background()
slide_num(s10, 10)

# ═══════════════════════════════════════════════════════════════
# SLIDE 11 — Close
# ═══════════════════════════════════════════════════════════════
s11 = new_slide()
gold_bar(s11)

lbl(s11, "Three lines. That's the pitch.", Inches(0.5), Inches(0.45), center=True)

for i, (tag, accent, body_txt) in enumerate([
    ("Problem", GOLD,
     "Enterprises detect more signals, but still mobilize too slowly."),
    ("Solution", GOLD,
     "VaughnMartin pre-stages response so executives authorize in minutes."),
    ("Outcome", TEAL,
     "Earlier detection + faster execution protects value before the window closes."),
]):
    yt = Inches(1.1) + i * Inches(1.72)
    row_bg = box(s11, Inches(0.7), yt, Inches(11.93), Inches(1.55), color=DARK3)
    bar = s11.shapes.add_shape(1, Inches(0.7), yt, Pt(4), Inches(1.55))
    bar.fill.solid(); bar.fill.fore_color.rgb = accent; bar.line.fill.background()
    txt(s11, tag.upper(), Inches(0.9), yt + Pt(13), Inches(1.8), Pt(28),
        size=9, bold=True, color=MUTED)
    txt(s11, body_txt, Inches(0.9), yt + Inches(0.46), Inches(11.4), Inches(0.92),
        size=19, color=GOLD if accent == GOLD else WHITE, font="Barlow Condensed")

cta_bg = box(s11, Inches(1.8), Inches(6.35), Inches(9.73), Inches(0.66),
    color=NAVY, stroke=GOLD)
txt(s11,
    "Apply for Founding Partner Access  ·  vaughnmartin.com/founding-partner-program",
    Inches(1.9), Inches(6.44), Inches(9.53), Inches(0.52),
    size=13, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

txt(s11, "\u201cStrategic triggers are inevitable. Delay is optional.\u201d",
    Inches(0.5), Inches(7.1), Inches(12.33), Pt(20),
    size=11, italic=True, color=RGBColor(0x40, 0x48, 0x68), align=PP_ALIGN.CENTER,
    font="Cormorant Garamond")
slide_num(s11, 11)

# ─────────────────────────────────────────────────────────────
prs.save("attached_assets/VaughnMartin-Investor-Pitch-Deck-v10.pptx")
print("PPTX v10 \u2192 attached_assets/VaughnMartin-Investor-Pitch-Deck-v10.pptx  (11 slides)")
