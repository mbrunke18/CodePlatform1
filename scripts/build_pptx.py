"""
VaughnMartin Investor Pitch Deck — PPTX builder (10/10 final)
12 slides. Dark navy backgrounds. Product screenshots as heroes.
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

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
blank = prs.slide_layouts[6]

def new_slide(dark=True):
    s = prs.slides.add_slide(blank)
    bg = s.background.fill; bg.solid()
    bg.fore_color.rgb = NAVY if dark else RGBColor(0xF2, 0xF0, 0xEB)
    return s

def gold_bar(s):
    r = s.shapes.add_shape(1, 0, 0, W, Pt(5))
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
        cap_h = Inches(0.32)
        cap_bg = s.shapes.add_shape(1, l, t + h - cap_h, w, cap_h)
        cap_bg.fill.solid(); cap_bg.fill.fore_color.rgb = RGBColor(0x08,0x0D,0x26)
        cap_bg.line.fill.background()
        txt(s, caption, l + Inches(0.1), t + h - cap_h + Pt(5),
            w - Inches(0.2), cap_h, size=9, bold=True, color=GOLD, align=PP_ALIGN.LEFT)

def slide_num(s, n, total=12):
    txt(s, f"{n:02d} / {total:02d}",
        Inches(12.3), Inches(7.15), Inches(1), Pt(16),
        size=10, bold=True, color=RGBColor(0x44,0x50,0x70),
        align=PP_ALIGN.RIGHT)

# ─────────────────────────────────────────────────────────────────
# SLIDE 1 — Hook Question
# ─────────────────────────────────────────────────────────────────
s1 = new_slide()
gold_bar(s1)

headline(s1,
    "When a strategic trigger fires in your organization—",
    Inches(1.0), Inches(0.82), Inches(11.3), Inches(1.05),
    size=38, align=PP_ALIGN.CENTER)
headline(s1,
    "are you executing in 12 minutes or organizing from scratch?",
    Inches(1.0), Inches(1.82), Inches(11.3), Inches(1.35),
    size=34, color=GOLD, align=PP_ALIGN.CENTER)

txt(s1, "Signal advantage before execution advantage.",
    Inches(1.0), Inches(3.1), Inches(11.3), Pt(26),
    size=15, italic=True, color=MUTED, align=PP_ALIGN.CENTER, font="Barlow Condensed")

for i, (chip, hot) in enumerate([
    ("Activist Investor · 91%", True),
    ("Ransomware · 95%", True),
    ("Regulatory Inquiry · 87%", False)
]):
    cx = Inches(1.3 + i * 3.75); cy = Inches(3.65)
    chip_bg = s1.shapes.add_shape(1, cx, cy, Inches(3.5), Inches(0.48))
    chip_bg.fill.solid()
    chip_bg.fill.fore_color.rgb = RGBColor(0x28,0x1C,0x0A) if hot else RGBColor(0x18,0x22,0x50)
    chip_bg.line.color.rgb = GOLD if hot else RGBColor(0x33,0x3D,0x60)
    chip_bg.line.width = Pt(1)
    txt(s1, chip, cx + Inches(0.12), cy + Pt(8), Inches(3.26), Inches(0.48),
        size=12, bold=True, color=GOLD if hot else MUTED, align=PP_ALIGN.CENTER)

framed_img(s1, "screenshots/pptx_command_tower.jpg",
    Inches(2.0), Inches(4.5), Inches(9.33), Inches(2.1),
    caption="Command Tower · Live production · 221 triggers armed · 20 active detections · 170 protocols ready")

txt(s1, "AI monitors continuously.  Executives authorize decisively.",
    Inches(0.4), Inches(7.18), Inches(12.5), Pt(18),
    size=11, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
slide_num(s1, 1)

# ─────────────────────────────────────────────────────────────────
# SLIDE 2 — 30 Days + trigger demo screenshot
# ─────────────────────────────────────────────────────────────────
s2 = new_slide()
gold_bar(s2)

lbl(s2, "The Reality", Inches(0.5), Inches(0.5))
txt(s2, "30", Inches(0.5), Inches(0.9), Inches(3.2), Inches(2.2),
    size=120, bold=True, color=GOLD, font="Cormorant Garamond")
txt(s2, "Days", Inches(0.5), Inches(2.85), Inches(3.2), Inches(0.55),
    size=30, bold=True, color=WHITE)
rule(s2, Inches(0.5), Inches(3.55), Inches(3.8))
txt(s2, "Mobilization time before any execution begins.",
    Inches(0.5), Inches(3.73), Inches(4.0), Inches(0.6),
    size=14, italic=True, color=MUTED, font="Barlow Condensed")
txt(s2, "Coordination starts from zero at every trigger.\nThe window closes before execution begins.",
    Inches(0.5), Inches(4.55), Inches(4.1), Inches(0.9),
    size=13, color=RGBColor(0xCC,0xD2,0xE0), font="Barlow Condensed")

lbl(s2, "This is what a trigger looks like — right now", Inches(5.0), Inches(0.5))
framed_img(s2, "screenshots/pptx_demo.jpg",
    Inches(5.0), Inches(0.85), Inches(7.9), Inches(6.0),
    caption="Live simulation · M&A trigger · Risk 88/100 — HIGH · No response pre-staged")
slide_num(s2, 2)

# ─────────────────────────────────────────────────────────────────
# SLIDE 3 — The Problem Is Already Here
# ─────────────────────────────────────────────────────────────────
s3 = new_slide()
gold_bar(s3)

lbl(s3, "The Problem Is Already Here", Inches(0.5), Inches(0.45))
headline(s3, "One of these is forming in your portfolio right now",
    Inches(0.5), Inches(0.8), Inches(12.3), Inches(0.9), size=26, align=PP_ALIGN.CENTER)

for i, (conf, domain, name, status, accent) in enumerate([
    ("95%", "Risk & Resilience", "Ransomware\nAttack Confirmed", "248 data points", TEAL),
    ("91%", "Growth & Positioning", "Activist Investor\nPressure Rising", "Live Monitoring", GOLD),
    ("87%", "Risk & Resilience", "Regulatory Inquiry\nOpened", "Threshold Forming", TEAL),
]):
    cx = Inches(0.45 + i * 4.3); cy = Inches(1.8)
    cw = Inches(4.05); ch = Inches(2.9)
    box(s3, cx, cy, cw, ch, color=RGBColor(0x10,0x18,0x42), stroke=RGBColor(0x28,0x34,0x68))
    txt(s3, conf, cx + Inches(2.7), cy + Inches(0.15), Inches(1.2), Inches(0.55),
        size=20, bold=True, color=accent, align=PP_ALIGN.RIGHT)
    txt(s3, domain.upper(), cx + Inches(0.18), cy + Inches(0.18), Inches(2.5), Pt(22),
        size=9, bold=True, color=TEAL)
    headline(s3, name, cx + Inches(0.18), cy + Inches(0.65), Inches(3.7), Inches(0.95), size=20)
    bar_bg = s3.shapes.add_shape(1, cx+Inches(0.18), cy+Inches(1.72), Inches(3.7), Pt(5))
    bar_bg.fill.solid(); bar_bg.fill.fore_color.rgb = MID; bar_bg.line.fill.background()
    fw = Inches(3.7 * int(conf[:-1]) / 100)
    bar_f = s3.shapes.add_shape(1, cx+Inches(0.18), cy+Inches(1.72), fw, Pt(5))
    bar_f.fill.solid(); bar_f.fill.fore_color.rgb = accent; bar_f.line.fill.background()
    txt(s3, f"● Signal Detected · {status}", cx+Inches(0.18), cy+Inches(2.0),
        Inches(3.7), Pt(22), size=10, color=TEAL)

framed_img(s3, "screenshots/deck_signals.jpg",
    Inches(0.4), Inches(4.85), Inches(12.53), Inches(2.3),
    caption="Signal Intelligence feed · vaughnmartin.com · Live detections · production")
slide_num(s3, 3)

# ─────────────────────────────────────────────────────────────────
# SLIDE 4 — The Answer
# ─────────────────────────────────────────────────────────────────
s4 = new_slide()
gold_bar(s4)

glow = s4.shapes.add_shape(1, Inches(7.5), 0, Inches(6), Inches(3.8))
glow.fill.solid(); glow.fill.fore_color.rgb = RGBColor(0x10,0x1C,0x4A); glow.line.fill.background()

headline(s4, "The response is ready",
    Inches(1.0), Inches(0.82), Inches(11.3), Inches(1.2), size=54, align=PP_ALIGN.CENTER)
headline(s4, "before the trigger fires.",
    Inches(1.0), Inches(1.92), Inches(11.3), Inches(1.2), size=54, color=GOLD, align=PP_ALIGN.CENTER)
txt(s4, "Preparation  →  Readiness  →  Fearless",
    Inches(1.0), Inches(3.08), Inches(11.3), Pt(28),
    size=15, color=MUTED, align=PP_ALIGN.CENTER, font="Barlow Condensed", italic=True)

for i, (num, lbl_txt) in enumerate([
    ("170", "Readiness Protocols"),
    ("221", "Strategic Triggers"),
    ("12 MIN", "Full Execution Cycle")
]):
    px = Inches(0.6 + i * 4.2)
    rule(s4, px, Inches(3.75), Inches(3.9))
    sz = 58 if num != "12 MIN" else 42
    txt(s4, num, px, Inches(3.9), Inches(3.9), Inches(1.2),
        size=sz, bold=True, color=GOLD, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s4, lbl_txt, px, Inches(5.05), Inches(3.9), Pt(26),
        size=13, color=WHITE, align=PP_ALIGN.CENTER)

framed_img(s4, "screenshots/pptx_how_executes.jpg",
    Inches(3.0), Inches(5.58), Inches(7.33), Inches(1.55),
    caption="vaughnmartin.com/how-it-executes · Live animated 12-minute execution chain")
slide_num(s4, 4)

# ─────────────────────────────────────────────────────────────────
# SLIDE 5 — Old Model vs VaughnMartin (3 bullets each)
# ─────────────────────────────────────────────────────────────────
s5 = new_slide()
gold_bar(s5)

left_bg = s5.shapes.add_shape(1, 0, 0, Inches(6.3), H)
left_bg.fill.solid(); left_bg.fill.fore_color.rgb = RGBColor(0x0E,0x13,0x34)
left_bg.line.fill.background()

txt(s5, "Old Model", Inches(0.45), Inches(0.55), Inches(5.5), Pt(20),
    size=9, bold=True, color=RED)
headline(s5, '"Bolted AI onto the old model"',
    Inches(0.45), Inches(0.95), Inches(5.7), Inches(0.95), size=21, color=MUTED)

for i, line in enumerate([
    "Faster notes from the same slow meetings",
    "No readiness architecture before triggers fire",
    "Authority unclear when pressure arrives",
]):
    yt = Inches(2.05) + i * Inches(1.1)
    txt(s5, "✕", Inches(0.45), yt, Inches(0.45), Pt(28), size=16, bold=True, color=RED)
    txt(s5, line, Inches(0.95), yt, Inches(5.1), Pt(28), size=15, color=MUTED, font="Barlow Condensed")

lbl(s5, "VaughnMartin", Inches(6.8), Inches(0.55), color=GOLD)
headline(s5, '"Rebuilt the operating model from first principles"',
    Inches(6.5), Inches(0.95), Inches(6.4), Inches(0.95), size=19, color=WHITE)

for i, line in enumerate([
    "Response pre-staged before trigger fires",
    "AI monitors. Executives authorize. Teams execute.",
    "Governance and auditability built into execution",
]):
    yt = Inches(2.05) + i * Inches(1.1)
    txt(s5, "✓", Inches(6.5), yt, Inches(0.45), Pt(28), size=16, bold=True, color=TEAL)
    txt(s5, line, Inches(7.0), yt, Inches(5.9), Pt(28), size=15, color=WHITE, font="Barlow Condensed")

div = s5.shapes.add_shape(1, Inches(6.45), Inches(0.35), Pt(1.5), Inches(7.0))
div.fill.solid(); div.fill.fore_color.rgb = MID; div.line.fill.background()
slide_num(s5, 5)

# ─────────────────────────────────────────────────────────────────
# SLIDE 6 — Execution Chain + Protocol Builder screenshot
# ─────────────────────────────────────────────────────────────────
s6 = new_slide()
gold_bar(s6)

lbl(s6, "From Detection to Authorized Execution", Inches(0.5), Inches(0.45))
headline(s6, "Signal detected → Protocol activates → Executive authorizes → 12 minutes",
    Inches(0.5), Inches(0.78), Inches(12.3), Inches(0.75), size=21, align=PP_ALIGN.CENTER)

for i, (abbr, lbl_txt, hero) in enumerate([
    ("SIG","Signal\nDetected",False), ("SCR","Scored &\nClassified",False),
    ("PRO","Protocol\nActivates",True), ("STK","Stakeholders\nNotified",False),
    ("AUTH","Executive\nAuthorizes",False), ("EXE","Execution\nBegins",True)
]):
    cx = Inches(0.55 + i * 2.17); cy = Inches(1.62)
    circ = s6.shapes.add_shape(9, cx, cy, Inches(1.6), Inches(1.6))
    circ.fill.solid()
    circ.fill.fore_color.rgb = GOLD if hero else RGBColor(0x15,0x1F,0x52)
    circ.line.color.rgb = GOLD; circ.line.width = Pt(1.5 if not hero else 0)
    txt(s6, abbr, cx, cy + Inches(0.5), Inches(1.6), Inches(0.6),
        size=12, bold=True, color=NAVY if hero else GOLD, align=PP_ALIGN.CENTER)
    txt(s6, lbl_txt, cx, cy + Inches(1.65), Inches(1.6), Inches(0.6),
        size=11, color=WHITE, align=PP_ALIGN.CENTER)
    if i < 5:
        arr = s6.shapes.add_shape(1, cx+Inches(1.62), cy+Inches(0.77), Inches(0.53), Pt(2))
        arr.fill.solid(); arr.fill.fore_color.rgb = GOLD; arr.line.fill.background()

time_bg = s6.shapes.add_shape(1, Inches(0.5), Inches(3.48), Inches(6.5), Inches(0.5))
time_bg.fill.solid(); time_bg.fill.fore_color.rgb = RGBColor(0x15,0x28,0x1C)
time_bg.line.color.rgb = TEAL; time_bg.line.width = Pt(1)
txt(s6, "✓  Complete in 12 minutes — 30 days compressed",
    Inches(0.65), Inches(3.53), Inches(6.2), Inches(0.46),
    size=14, bold=True, color=TEAL)
txt(s6, "The alternative: 30 days of mobilization before any execution begins",
    Inches(7.2), Inches(3.55), Inches(5.7), Inches(0.46),
    size=12, italic=True, color=MUTED, font="Barlow Condensed")

framed_img(s6, "screenshots/pitch_builder.jpg",
    Inches(0.4), Inches(4.12), Inches(12.53), Inches(2.98),
    caption="Protocol Builder · Pre-staged execution architecture · Live in production")
slide_num(s6, 6)

# ─────────────────────────────────────────────────────────────────
# SLIDE 7 — Business Value
# ─────────────────────────────────────────────────────────────────
s7 = new_slide()
gold_bar(s7)

lbl(s7, "Business Value", Inches(0.5), Inches(0.45))
headline(s7, "Readiness is not overhead. It is value protection.",
    Inches(0.5), Inches(0.75), Inches(12.3), Inches(1.15), size=36, align=PP_ALIGN.LEFT)

rule(s7, Inches(0.5), Inches(2.05), Inches(12.33))

for i, (bullet, color) in enumerate([
    ("Founding Partner: $75K / 90-day validation", GOLD),
    ("Growth tiers: $75K–$250K annually", WHITE),
    ("If one strategic window is preserved, readiness can pay for itself quickly", TEAL),
]):
    yt = Inches(2.25) + i * Inches(1.22)
    arrow = s7.shapes.add_shape(1, Inches(0.5), yt + Pt(8), Inches(0.18), Inches(0.18))
    arrow.fill.solid(); arrow.fill.fore_color.rgb = color; arrow.line.fill.background()
    txt(s7, bullet, Inches(0.82), yt, Inches(11.8), Inches(1.0),
        size=18, color=color, font="Barlow Condensed")

rule(s7, Inches(0.5), Inches(5.98), Inches(12.33))
txt(s7, "The cost of delay is usually higher than the cost of readiness.",
    Inches(0.5), Inches(6.12), Inches(12.33), Inches(0.65),
    size=18, bold=True, italic=True, color=GOLD, align=PP_ALIGN.CENTER, font="Barlow Condensed")

slide_num(s7, 7)

# ─────────────────────────────────────────────────────────────────
# SLIDE 8 — Built. Live. In Production. + SIGNALS screenshot
# ─────────────────────────────────────────────────────────────────
s8 = new_slide()
gold_bar(s8)

lbl(s8, "Built. Live. In Production.", Inches(0.5), Inches(0.45))
headline(s8, "Not a roadmap — operating now",
    Inches(0.5), Inches(0.78), Inches(12.3), Inches(0.72), size=30, align=PP_ALIGN.CENTER)

for i, (num, sub, col) in enumerate([
    ("170", "Protocols", GOLD),
    ("221", "Triggers", GOLD),
    ("248", "Data Points", TEAL),
    ("15 MIN", "Refresh", GOLD),
]):
    sx = Inches(0.4 + i * 3.24)
    box(s8, sx, Inches(1.62), Inches(3.1), Inches(1.15), color=DARK2)
    txt(s8, num, sx, Inches(1.67), Inches(3.1), Inches(0.7),
        size=40, bold=True, color=col, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s8, sub, sx, Inches(2.3), Inches(3.1), Pt(26),
        size=12, color=MUTED, align=PP_ALIGN.CENTER)

live = s8.shapes.add_shape(1, Inches(3.3), Inches(2.97), Inches(6.6), Inches(0.4))
live.fill.solid(); live.fill.fore_color.rgb = RGBColor(0x12,0x22,0x1C)
live.line.color.rgb = TEAL; live.line.width = Pt(1)
txt(s8, "●  Signal Detection Active · Updated Every 15 Minutes · vaughnmartin.com",
    Inches(3.4), Inches(3.02), Inches(6.4), Inches(0.38),
    size=10, bold=True, color=TEAL, align=PP_ALIGN.CENTER)

framed_img(s8, "screenshots/deck_signals.jpg",
    Inches(0.35), Inches(3.55), Inches(12.63), Inches(3.58),
    caption="Signal Intelligence feed · Live detections · vaughnmartin.com")
slide_num(s8, 8)

# ─────────────────────────────────────────────────────────────────
# SLIDE 9 — MIC-DROP: Signal → Execution side by side
# ─────────────────────────────────────────────────────────────────
s9 = new_slide()
gold_bar(s9)

lbl(s9, "Proof of Production", Inches(0.5), Inches(0.45))
headline(s9, "From Signal to Authorized Execution in 12 Minutes",
    Inches(0.5), Inches(0.72), Inches(12.3), Inches(0.78), size=28, align=PP_ALIGN.CENTER)

framed_img(s9, "screenshots/deck_signals.jpg",
    Inches(0.35), Inches(1.52), Inches(6.27), Inches(4.08),
    caption="Live trigger detected with confidence scoring.")
framed_img(s9, "screenshots/pptx_how_executes.jpg",
    Inches(6.71), Inches(1.52), Inches(6.27), Inches(4.08),
    caption="Pre-staged protocol, stakeholders, authority, and tasks ready before pressure.")

tagline_bg = s9.shapes.add_shape(1, 0, Inches(5.77), W, Inches(0.88))
tagline_bg.fill.solid(); tagline_bg.fill.fore_color.rgb = RGBColor(0x08,0x0D,0x26)
tagline_bg.line.fill.background()
txt(s9, "AI monitors.   Executives authorize.   Teams execute.",
    Inches(0.5), Inches(5.85), Inches(12.33), Inches(0.55),
    size=22, bold=True, color=GOLD, align=PP_ALIGN.CENTER, font="Barlow Condensed")

txt(s9,
    "170 protocols  ·  221 triggers  ·  248 data points  ·  refreshed every 15 minutes",
    Inches(0.5), Inches(6.73), Inches(12.33), Inches(0.38),
    size=10, color=MUTED, align=PP_ALIGN.CENTER)
slide_num(s9, 9)

# ─────────────────────────────────────────────────────────────────
# SLIDE 10 — Why Now (ivory background)
# ─────────────────────────────────────────────────────────────────
s10 = new_slide(dark=False)
gold_bar(s10)

lbl(s10, "Why Now", Inches(0.5), Inches(0.48), color=RGBColor(0x44,0x4C,0x66))
headline(s10, "AI capability is accelerating faster than enterprise readiness.",
    Inches(0.5), Inches(0.75), Inches(12.3), Inches(1.15), size=32, color=NAVY)

rule(s10, Inches(0.5), Inches(2.05), Inches(12.33), color=GOLD)

for i, bullet in enumerate([
    "Organizations can detect more than ever, but still mobilize too slowly.",
    "Governance and execution readiness are now the competitive bottleneck.",
    "The winners will be companies that pair AI sensing with governed execution speed.",
]):
    yt = Inches(2.22) + i * Inches(1.15)
    arrow = s10.shapes.add_shape(1, Inches(0.5), yt + Pt(8), Inches(0.16), Inches(0.16))
    arrow.fill.solid(); arrow.fill.fore_color.rgb = GOLD; arrow.line.fill.background()
    txt(s10, bullet, Inches(0.82), yt, Inches(11.8), Inches(0.95),
        size=17, color=RGBColor(0x1A,0x23,0x48), font="Barlow Condensed")

txt(s10, "Sources: Stanford HAI AI Index 2026  ·  Gartner Autonomous Business",
    Inches(0.5), Inches(5.78), Inches(12.33), Pt(22),
    size=11, italic=True, color=MUTED)
slide_num(s10, 10)

# ─────────────────────────────────────────────────────────────────
# SLIDE 11 — The Ask / Founding Partner
# ─────────────────────────────────────────────────────────────────
s11 = new_slide()
gold_bar(s11)

lbl(s11, "The Ask", Inches(0.5), Inches(0.45))
headline(s11, "Twelve founding partners. One defining cohort.",
    Inches(0.5), Inches(0.75), Inches(7.5), Inches(1.15), size=34)
txt(s11, "Partners who want readiness as competitive advantage.",
    Inches(0.5), Inches(2.05), Inches(7.5), Inches(0.55),
    size=15, italic=True, color=MUTED, font="Barlow Condensed")

for i, (row_lbl, val, vcol) in enumerate([
    ("Program",    "Founding Partner  ·  90-Day Validation", WHITE),
    ("Commercial", "$75K / 90 days", GOLD),
    ("Cohort",     "12 startup to Fortune 500 organizations", WHITE),
    ("Raise",      "Open strategic raise  ·  active conversations underway", MUTED),
]):
    yt = Inches(2.82) + i * Inches(0.97)
    row_bg = box(s11, Inches(0.4), yt, Inches(12.53), Inches(0.9),
        color=DARK2 if i % 2 == 0 else DARK3)
    txt(s11, row_lbl.upper(), Inches(0.6), yt + Pt(12), Inches(2.4), Pt(24),
        size=9, bold=True, color=MUTED)
    txt(s11, val, Inches(3.1), yt + Pt(11), Inches(9.7), Pt(24),
        size=16, bold=(vcol == GOLD), color=vcol, font="Barlow Condensed")

slide_num(s11, 11)

# ─────────────────────────────────────────────────────────────────
# SLIDE 12 — Close (inevitable)
# ─────────────────────────────────────────────────────────────────
s12 = new_slide()
gold_bar(s12)

lbl(s12, "Three lines. That's the pitch.", Inches(0.5), Inches(0.45), center=True)

for i, (tag, accent, body_txt) in enumerate([
    ("Problem", GOLD,
     "Enterprises detect more signals, but still mobilize too slowly."),
    ("Solution", GOLD,
     "VaughnMartin pre-stages response so executives authorize in minutes."),
    ("Outcome", TEAL,
     "Earlier detection + faster execution protects value before the window closes."),
]):
    yt = Inches(1.12) + i * Inches(1.75)
    row_bg = box(s12, Inches(0.7), yt, Inches(11.93), Inches(1.58), color=DARK3)
    bar = s12.shapes.add_shape(1, Inches(0.7), yt, Pt(4), Inches(1.58))
    bar.fill.solid(); bar.fill.fore_color.rgb = accent; bar.line.fill.background()
    txt(s12, tag.upper(), Inches(0.9), yt + Pt(14), Inches(1.8), Pt(28),
        size=9, bold=True, color=MUTED)
    txt(s12, body_txt, Inches(0.9), yt + Inches(0.48), Inches(11.4), Inches(0.92),
        size=19, color=GOLD if accent == GOLD else WHITE, font="Barlow Condensed")

cta_bg = box(s12, Inches(1.8), Inches(6.35), Inches(9.73), Inches(0.68),
    color=NAVY, stroke=GOLD)
txt(s12, "Apply for Founding Partner Access  ·  vaughnmartin.com/founding-partner-program",
    Inches(1.9), Inches(6.44), Inches(9.53), Inches(0.52),
    size=13, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
slide_num(s12, 12)

# ─────────────────────────────────────────────────────────────────
prs.save("attached_assets/VaughnMartin-Investor-Pitch-Deck.pptx")

print("PPTX → attached_assets/VaughnMartin-Investor-Pitch-Deck.pptx  (12 slides)")
print("Screenshots featured:")
print("  S1: Command Tower inset")
print("  S2: Demo trigger (full right panel)")
print("  S3: Signal Intelligence feed (lower 42%)")
print("  S4: How-it-executes inset")
print("  S6: Protocol Builder (lower 44%)")
print("  S8: Signal Detection feed (full lower)")
print("  S9: Signals (left) + How-it-executes (right) — MIC-DROP")
