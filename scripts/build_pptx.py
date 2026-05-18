"""
VaughnMartin Investor Pitch Deck — PPTX builder
Philosophy: dark navy backgrounds PRESERVED, product screenshots are HEROES not decorations.
Each screenshot slide: image fills 45-60% of slide area.
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os
from lxml import etree
from pptx.oxml.ns import qn

NAVY  = RGBColor(0x0A, 0x0F, 0x2E)
GOLD  = RGBColor(0xC9, 0xA8, 0x4C)
TEAL  = RGBColor(0x2B, 0x8A, 0x6E)
IVORY = RGBColor(0xF0, 0xED, 0xE4)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
MUTED = RGBColor(0x99, 0xA5, 0xBB)
DARK2 = RGBColor(0x12, 0x1A, 0x44)
MID   = RGBColor(0x1E, 0x27, 0x55)
RED   = RGBColor(0xFF, 0x50, 0x50)

W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
blank = prs.slide_layouts[6]

# ─── Helper functions ──────────────────────────────────────────
def new_slide(dark=True):
    s = prs.slides.add_slide(blank)
    bg = s.background.fill
    bg.solid()
    bg.fore_color.rgb = NAVY if dark else RGBColor(0xF2, 0xF0, 0xEB)
    return s

def gold_bar(s):
    r = s.shapes.add_shape(1, 0, 0, W, Pt(5))
    r.fill.solid(); r.fill.fore_color.rgb = GOLD; r.line.fill.background()

def txt(s, text, l, t, w, h, size=14, bold=False, color=WHITE, align=PP_ALIGN.LEFT,
        font="Barlow", italic=False):
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
        align=PP_ALIGN.CENTER if center else PP_ALIGN.LEFT, font="Barlow Condensed")

def headline(s, text, l, t, w, h, size=38, color=WHITE, align=PP_ALIGN.LEFT):
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

def img(s, path, l, t, w, h):
    if os.path.exists(path):
        return s.shapes.add_picture(path, l, t, w, h)

def slide_num(s, n, total=11):
    txt(s, f"{n:02d} / {total:02d}",
        Inches(12.3), Inches(7.15), Inches(1), Pt(16),
        size=10, bold=True, color=RGBColor(0x44,0x50,0x70),
        font="Barlow Condensed", align=PP_ALIGN.RIGHT)

def framed_img(s, path, l, t, w, h, caption=None):
    """Add image with gold border frame and optional caption bar."""
    if os.path.exists(path):
        s.shapes.add_picture(path, l, t, w, h)
    # Gold border frame
    frame = s.shapes.add_shape(1, l, t, w, h)
    frame.fill.background(); frame.line.color.rgb = GOLD; frame.line.width = Pt(1.2)
    if caption:
        cap_h = Inches(0.35)
        cap_bg = s.shapes.add_shape(1, l, t + h - cap_h, w, cap_h)
        cap_bg.fill.solid(); cap_bg.fill.fore_color.rgb = RGBColor(0x08,0x0D,0x26)
        cap_bg.line.fill.background()
        txt(s, caption.upper(), l + Inches(0.12), t + h - cap_h + Pt(6),
            w - Inches(0.24), cap_h,
            size=9, bold=True, color=GOLD, font="Barlow Condensed", align=PP_ALIGN.LEFT)

# ─────────────────────────────────────────────────────────────────
# SLIDE 1 — Hook Question (+ live product inset)
# ─────────────────────────────────────────────────────────────────
s1 = new_slide()
gold_bar(s1)

headline(s1,
    "When a strategic trigger fires in your organization—",
    Inches(1.0), Inches(0.85), Inches(11.3), Inches(1.1),
    size=38, align=PP_ALIGN.CENTER)
headline(s1,
    "how long does it take to mobilize a coordinated response?",
    Inches(1.0), Inches(1.9), Inches(11.3), Inches(1.4),
    size=34, color=GOLD, align=PP_ALIGN.CENTER)

for i, (chip, hot) in enumerate([
    ("Activist Investor · 91%", True),
    ("Ransomware · 95%", True),
    ("Regulatory Inquiry · 87%", False)
]):
    cx = Inches(1.3 + i * 3.75)
    cy = Inches(3.5)
    chip_bg = s1.shapes.add_shape(1, cx, cy, Inches(3.5), Inches(0.5))
    chip_bg.fill.solid()
    chip_bg.fill.fore_color.rgb = RGBColor(0x28,0x1C,0x0A) if hot else RGBColor(0x18,0x22,0x50)
    chip_bg.line.color.rgb = GOLD if hot else RGBColor(0x33,0x3D,0x60)
    chip_bg.line.width = Pt(1)
    txt(s1, chip, cx + Inches(0.12), cy + Pt(9),
        Inches(3.26), Inches(0.5), size=13, bold=True,
        color=GOLD if hot else MUTED, font="Barlow Condensed", align=PP_ALIGN.CENTER)

txt(s1, "These are live signal detections. Production. Right now.",
    Inches(1.0), Inches(4.2), Inches(11.3), Pt(26),
    size=15, italic=True, color=MUTED, align=PP_ALIGN.CENTER, font="Barlow")

# Live product inset — command tower stats
framed_img(s1, "screenshots/pptx_command_tower.jpg",
    Inches(2.0), Inches(5.0), Inches(9.33), Inches(2.1),
    caption="Command Tower · Live production · 221 triggers armed · 20 active detections · 170 protocols ready")

txt(s1, "VaughnMartin  ·  Readiness OS",
    Inches(0.4), Inches(7.18), Inches(5), Pt(18),
    size=11, bold=True, color=GOLD, font="Barlow Condensed")
slide_num(s1, 1)

# ─────────────────────────────────────────────────────────────────
# SLIDE 2 — The Reality: 30 Days + trigger demo screenshot
# ─────────────────────────────────────────────────────────────────
s2 = new_slide()
gold_bar(s2)

# Left: the stark "30 Days" stat
lbl(s2, "The Reality", Inches(0.5), Inches(0.5))
txt(s2, "30", Inches(0.5), Inches(0.9), Inches(3.2), Inches(2.2),
    size=120, bold=True, color=GOLD, font="Cormorant Garamond")
txt(s2, "Days", Inches(0.5), Inches(2.85), Inches(3.2), Inches(0.55),
    size=30, bold=True, color=WHITE, font="Barlow Condensed")
rule(s2, Inches(0.5), Inches(3.55), Inches(3.8))
txt(s2, "Average mobilization time before\nany execution begins.",
    Inches(0.5), Inches(3.73), Inches(4.0), Inches(0.9),
    size=15, italic=True, color=MUTED, font="Barlow")
txt(s2, "That's not execution time.\nThat's just figuring out who's in the room.",
    Inches(0.5), Inches(4.7), Inches(4.1), Inches(0.9),
    size=14, color=RGBColor(0xCC,0xD2,0xE0), font="Barlow")

# Right: LARGE demo trigger screenshot — shows what firing looks like
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

lbl(s3, "The Problem Is Already Here", Inches(0.5), Inches(0.45), center=False, color=GOLD)
headline(s3, "One of these is forming in your portfolio right now",
    Inches(0.5), Inches(0.8), Inches(12.3), Inches(0.9), size=28, align=PP_ALIGN.CENTER)

for i, (conf, domain, name, status, accent) in enumerate([
    ("95%", "Risk & Resilience", "Ransomware\nAttack Confirmed", "248 data points", TEAL),
    ("91%", "Growth & Positioning", "Activist Investor\nPressure Rising", "Live Monitoring", GOLD),
    ("87%", "Risk & Resilience", "Regulatory Inquiry\nOpened", "Threshold Forming", TEAL),
]):
    cx = Inches(0.45 + i * 4.3)
    cy = Inches(1.8)
    cw = Inches(4.05); ch = Inches(2.9)
    box(s3, cx, cy, cw, ch, color=RGBColor(0x10,0x18,0x42),
        stroke=RGBColor(0x28,0x34,0x68))
    txt(s3, conf, cx + Inches(2.7), cy + Inches(0.15), Inches(1.2), Inches(0.55),
        size=20, bold=True, color=accent, font="Barlow Condensed", align=PP_ALIGN.RIGHT)
    txt(s3, domain.upper(), cx + Inches(0.18), cy + Inches(0.18), Inches(2.5), Pt(22),
        size=9, bold=True, color=TEAL, font="Barlow Condensed")
    headline(s3, name, cx + Inches(0.18), cy + Inches(0.65), Inches(3.7), Inches(0.95), size=21)
    bar_bg = s3.shapes.add_shape(1, cx + Inches(0.18), cy + Inches(1.72), Inches(3.7), Pt(5))
    bar_bg.fill.solid(); bar_bg.fill.fore_color.rgb = MID; bar_bg.line.fill.background()
    fill_w = Inches(3.7 * int(conf[:-1]) / 100)
    bar_f = s3.shapes.add_shape(1, cx + Inches(0.18), cy + Inches(1.72), fill_w, Pt(5))
    bar_f.fill.solid(); bar_f.fill.fore_color.rgb = accent; bar_f.line.fill.background()
    txt(s3, f"● Signal Detected · {status}", cx + Inches(0.18), cy + Inches(2.0),
        Inches(3.7), Pt(22), size=10, color=TEAL, font="Barlow")

# LARGE signal detection screenshot — fills lower 42% of slide
framed_img(s3, "screenshots/deck_signals.jpg",
    Inches(0.4), Inches(4.85), Inches(12.53), Inches(2.3),
    caption="Signal Intelligence feed · vaughnmartin.com · Live detections · production")

slide_num(s3, 3)

# ─────────────────────────────────────────────────────────────────
# SLIDE 4 — Main Claim + 3 Pillars
# ─────────────────────────────────────────────────────────────────
s4 = new_slide()
gold_bar(s4)

glow = s4.shapes.add_shape(1, Inches(7.5), 0, Inches(6), Inches(3.8))
glow.fill.solid(); glow.fill.fore_color.rgb = RGBColor(0x10,0x1C,0x4A); glow.line.fill.background()

headline(s4, "The response is ready",
    Inches(1.0), Inches(0.85), Inches(11.3), Inches(1.2), size=54, align=PP_ALIGN.CENTER)
headline(s4, "before the trigger fires.",
    Inches(1.0), Inches(1.95), Inches(11.3), Inches(1.2), size=54, color=GOLD, align=PP_ALIGN.CENTER)
txt(s4, "Preparation  →  Readiness  →  Fearless",
    Inches(1.0), Inches(3.1), Inches(11.3), Pt(28),
    size=16, color=MUTED, align=PP_ALIGN.CENTER, font="Barlow")

for i, (num, lbl_txt) in enumerate([
    ("170", "Readiness Protocols"), ("221", "Strategic Triggers"), ("12 MIN", "Full Execution Cycle")
]):
    px = Inches(0.6 + i * 4.2)
    rule(s4, px, Inches(3.75), Inches(3.9))
    sz = 60 if num != "12 MIN" else 44
    txt(s4, num, px, Inches(3.9), Inches(3.9), Inches(1.2),
        size=sz, bold=True, color=GOLD, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s4, lbl_txt, px, Inches(5.05), Inches(3.9), Pt(26),
        size=13, color=WHITE, font="Barlow", align=PP_ALIGN.CENTER)

# How-it-executes product screenshot — bottom strip showing the live chain page
framed_img(s4, "screenshots/pptx_how_executes.jpg",
    Inches(3.0), Inches(5.6), Inches(7.33), Inches(1.55),
    caption="vaughnmartin.com/how-it-executes · Live animated execution chain")

slide_num(s4, 4)

# ─────────────────────────────────────────────────────────────────
# SLIDE 5 — Comparison (text-focused, no screenshot needed)
# ─────────────────────────────────────────────────────────────────
s5 = new_slide()
gold_bar(s5)

left_bg = s5.shapes.add_shape(1, 0, 0, Inches(6.3), H)
left_bg.fill.solid(); left_bg.fill.fore_color.rgb = RGBColor(0x0E,0x13,0x34)
left_bg.line.fill.background()

txt(s5, "Every Other Vendor", Inches(0.45), Inches(0.55), Inches(5.5), Pt(20),
    size=9, bold=True, color=RED, font="Barlow Condensed")
headline(s5, '"Bolted AI onto the old model"',
    Inches(0.45), Inches(0.95), Inches(5.7), Inches(1.0), size=22, color=MUTED)

for i, line in enumerate([
    "Faster summaries from the same slow meeting",
    "Smarter notes. Same 30-day mobilization cycle.",
    "AI tools. No operating model change.",
    "Competes with Copilot. We don't.",
]):
    yt = Inches(2.1) + i * Inches(0.95)
    txt(s5, "✕", Inches(0.45), yt, Inches(0.45), Pt(28), size=16, bold=True, color=RED, font="Barlow")
    txt(s5, line, Inches(0.95), yt, Inches(5.1), Pt(28), size=14, color=MUTED, font="Barlow")

lbl(s5, "VaughnMartin", Inches(6.8), Inches(0.55), color=GOLD)
headline(s5, '"Rebuilt the operating model from first principles"',
    Inches(6.5), Inches(0.95), Inches(6.4), Inches(1.1), size=20, color=WHITE)

for i, line in enumerate([
    "Pre-staged before any trigger fires",
    "Proprietary IDEA Framework — 3 years to build",
    "Orchestrates the Microsoft stack — doesn't replace it",
    "Competes with the 40-year-old meeting model",
]):
    yt = Inches(2.1) + i * Inches(0.95)
    txt(s5, "✓", Inches(6.5), yt, Inches(0.45), Pt(28), size=16, bold=True, color=TEAL, font="Barlow")
    txt(s5, line, Inches(7.0), yt, Inches(5.9), Pt(28), size=14, color=WHITE, font="Barlow")

rule(s5, Inches(6.45), Inches(0.4), Inches(0.0))
div = s5.shapes.add_shape(1, Inches(6.45), Inches(0.35), Pt(1.5), Inches(7.0))
div.fill.solid(); div.fill.fore_color.rgb = MID; div.line.fill.background()

slide_num(s5, 5)

# ─────────────────────────────────────────────────────────────────
# SLIDE 6 — How It Executes (execution chain + LARGE screenshot)
# ─────────────────────────────────────────────────────────────────
s6 = new_slide()
gold_bar(s6)

lbl(s6, "How It Executes", Inches(0.5), Inches(0.45), w=Inches(12), color=GOLD)
headline(s6, "Signal detected → Protocol activates → Executive authorizes → 12 minutes",
    Inches(0.5), Inches(0.78), Inches(12.3), Inches(0.8), size=22, align=PP_ALIGN.CENTER)

for i, (abbr, lbl_txt, hero) in enumerate([
    ("SIG","Signal\nDetected",False), ("SCR","Scored &\nClassified",False),
    ("PRO","Protocol\nActivates",True), ("STK","Stakeholders\nNotified",False),
    ("AUTH","Executive\nAuthorizes",False), ("EXE","Execution\nBegins",True)
]):
    cx = Inches(0.55 + i * 2.17)
    cy = Inches(1.65)
    circ = s6.shapes.add_shape(9, cx, cy, Inches(1.6), Inches(1.6))
    circ.fill.solid()
    circ.fill.fore_color.rgb = GOLD if hero else RGBColor(0x15,0x1F,0x52)
    circ.line.color.rgb = GOLD; circ.line.width = Pt(1.5 if not hero else 0)
    txt(s6, abbr, cx, cy + Inches(0.5), Inches(1.6), Inches(0.6),
        size=12, bold=True,
        color=NAVY if hero else GOLD, font="Barlow Condensed", align=PP_ALIGN.CENTER)
    txt(s6, lbl_txt, cx, cy + Inches(1.65), Inches(1.6), Inches(0.6),
        size=11, color=WHITE, font="Barlow", align=PP_ALIGN.CENTER)
    if i < 5:
        arr = s6.shapes.add_shape(1, cx + Inches(1.62), cy + Inches(0.77), Inches(0.53), Pt(2))
        arr.fill.solid(); arr.fill.fore_color.rgb = GOLD; arr.line.fill.background()

time_bg = s6.shapes.add_shape(1, Inches(0.5), Inches(3.5), Inches(6.5), Inches(0.52))
time_bg.fill.solid(); time_bg.fill.fore_color.rgb = RGBColor(0x15,0x28,0x1C)
time_bg.line.color.rgb = TEAL; time_bg.line.width = Pt(1)
txt(s6, "✓  Complete in 12 minutes — 30 days compressed",
    Inches(0.65), Inches(3.55), Inches(6.2), Inches(0.48),
    size=14, bold=True, color=TEAL, font="Barlow")
txt(s6, "The alternative: 30 days of mobilization before any execution begins",
    Inches(7.2), Inches(3.57), Inches(5.7), Inches(0.48),
    size=13, italic=True, color=MUTED, font="Barlow")

# Protocol Builder screenshot — proof of production execution tool
framed_img(s6, "screenshots/pitch_builder.jpg",
    Inches(0.4), Inches(4.15), Inches(12.53), Inches(2.95),
    caption="Protocol Builder · Pre-staged execution architecture · Live in production")

slide_num(s6, 6)

# ─────────────────────────────────────────────────────────────────
# SLIDE 7 — Return on Readiness (stats left + ROI SCREENSHOT right)
# ─────────────────────────────────────────────────────────────────
s7 = new_slide()
gold_bar(s7)

lbl(s7, "Return on Readiness", Inches(0.45), Inches(0.45))
txt(s7, "3,600×", Inches(0.45), Inches(0.85), Inches(4.6), Inches(1.6),
    size=72, bold=True, color=GOLD, font="Cormorant Garamond")
txt(s7, "Execution Head Start vs. Old Model",
    Inches(0.45), Inches(2.2), Inches(4.6), Pt(28), size=13, color=MUTED, font="Barlow")

txt(s7, "$120K", Inches(0.45), Inches(2.75), Inches(4.6), Inches(0.95),
    size=50, bold=True, color=WHITE, font="Cormorant Garamond")
txt(s7, "Platform Cost · Annual",
    Inches(0.45), Inches(3.55), Inches(4.6), Pt(24), size=13, color=MUTED, font="Barlow")

rule(s7, Inches(0.45), Inches(3.97), Inches(4.6))

txt(s7, "Replaces $400K–$800K consulting retainer",
    Inches(0.45), Inches(4.1), Inches(4.6), Pt(28), size=14, color=WHITE, font="Barlow")
txt(s7, "Break-even before the 2nd activation.",
    Inches(0.45), Inches(4.5), Inches(4.6), Pt(28), size=14, color=TEAL, font="Barlow")
txt(s7, "The budget line already exists.",
    Inches(0.45), Inches(4.9), Inches(4.6), Pt(28), size=14, color=WHITE, font="Barlow")

rule(s7, Inches(0.45), Inches(5.42), Inches(4.6))
txt(s7, '"We\'re replacing a line item every Fortune 1000 already pays."',
    Inches(0.45), Inches(5.55), Inches(4.6), Inches(0.8),
    size=12, italic=True, color=MUTED, font="Barlow")

# RIGHT SIDE: ROI calculator screenshot as FULL PANEL HERO
lbl(s7, "Live at vaughnmartin.com/roi-calculator", Inches(5.2), Inches(0.45))
framed_img(s7, "screenshots/pptx_roi.jpg",
    Inches(5.2), Inches(0.82), Inches(7.73), Inches(6.28),
    caption="ROI Calculator · Estimates $61.3M+ annual value · 3,600× execution head start")

slide_num(s7, 7)

# ─────────────────────────────────────────────────────────────────
# SLIDE 8 — Built. In Production. (stats + TWO LARGE screenshots)
# ─────────────────────────────────────────────────────────────────
s8 = new_slide()
gold_bar(s8)

lbl(s8, "Built. In Production. Right Now.", Inches(0.5), Inches(0.45), color=GOLD)
headline(s8, "The system is live — not a demo, not a roadmap",
    Inches(0.5), Inches(0.78), Inches(12.3), Inches(0.75), size=28, align=PP_ALIGN.CENTER)

for i, (num, sub, col) in enumerate([
    ("170","Readiness Protocols Pre-Staged",GOLD),
    ("221","Strategic Triggers Mapped",GOLD),
    ("248","Data Points Every 15 Min",TEAL),
    ("12","Compound Protocols",GOLD),
]):
    sx = Inches(0.4 + i * 3.24)
    sb = box(s8, sx, Inches(1.65), Inches(3.1), Inches(1.25), color=DARK2)
    txt(s8, num, sx + Inches(0.1), Inches(1.7), Inches(2.9), Inches(0.7),
        size=40, bold=True, color=col, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s8, sub, sx + Inches(0.1), Inches(2.35), Inches(2.9), Inches(0.5),
        size=11, color=MUTED, font="Barlow", align=PP_ALIGN.CENTER)

live = s8.shapes.add_shape(1, Inches(3.3), Inches(3.0), Inches(6.6), Inches(0.42))
live.fill.solid(); live.fill.fore_color.rgb = RGBColor(0x12,0x22,0x1C)
live.line.color.rgb = TEAL; live.line.width = Pt(1)
txt(s8, "●  Signal Detection Active · Updated Every 15 Minutes · vaughnmartin.com",
    Inches(3.4), Inches(3.05), Inches(6.4), Inches(0.4),
    size=11, bold=True, color=TEAL, font="Barlow", align=PP_ALIGN.CENTER)

# THREE-image WOW strip: Live Readiness · Signal Detection · Protocol Builder
img_w = Inches(4.11)
img_h = Inches(2.85)
img_y = Inches(3.7)
for xi, (path, cap) in enumerate([
    ("screenshots/pitch_home.jpg",    "Live Readiness Experience"),
    ("screenshots/deck_signals.jpg",  "Signal Detection Feed"),
    ("screenshots/pitch_builder.jpg", "Protocol Builder"),
]):
    x = Inches(0.35) + xi * (img_w + Inches(0.27))
    framed_img(s8, path, x, img_y, img_w, img_h, caption=cap)

slide_num(s8, 8)

# ─────────────────────────────────────────────────────────────────
# SLIDE 9 — Market Opportunity (text left + protocol screenshot right)
# ─────────────────────────────────────────────────────────────────
s9 = new_slide(dark=False)
gold_bar(s9)

left_bg = s9.shapes.add_shape(1, 0, 0, Inches(5.8), H)
left_bg.fill.solid(); left_bg.fill.fore_color.rgb = NAVY; left_bg.line.fill.background()

div9 = s9.shapes.add_shape(1, Inches(0.42), Inches(0.8), Pt(4), Inches(3.6))
div9.fill.solid(); div9.fill.fore_color.rgb = GOLD; div9.line.fill.background()

lbl(s9, "The Market Opportunity", Inches(0.6), Inches(0.5), color=GOLD)
headline(s9, "Preparation\ninfrastructure\ndoes not exist yet.",
    Inches(0.6), Inches(0.8), Inches(5.0), Inches(3.0), size=34)
rule(s9, Inches(0.6), Inches(4.05), Inches(4.8))
txt(s9, "That's not a problem.\nThat's the entire opportunity.",
    Inches(0.6), Inches(4.22), Inches(5.0), Inches(1.1),
    size=18, italic=True, color=IVORY, font="Barlow")

txt(s9, "Every Fortune 1000 has Microsoft's AI stack.\nNone have the operating model to use it at trigger speed.",
    Inches(0.6), Inches(5.4), Inches(5.0), Inches(1.2),
    size=13, color=MUTED, font="Barlow")

# Right side: LARGE protocol library screenshot
lbl(s9, "Why Now · Why VaughnMartin", Inches(6.1), Inches(0.5), color=RGBColor(0x22,0x2C,0x44))
framed_img(s9, "screenshots/pptx_protocols.jpg",
    Inches(6.1), Inches(0.82), Inches(6.83), Inches(6.28),
    caption="170 Readiness Protocols · A pre-staged response for every strategic scenario")

slide_num(s9, 9)

# ─────────────────────────────────────────────────────────────────
# SLIDE 10 — Founding Partner Program / The Ask
# ─────────────────────────────────────────────────────────────────
s10 = new_slide()
gold_bar(s10)

lbl(s10, "Founding Partner Program", Inches(0.5), Inches(0.45))
headline(s10, "Twelve\norganizations.\nOne first cohort.",
    Inches(0.5), Inches(0.82), Inches(5.6), Inches(3.0), size=44)
rule(s10, Inches(0.5), Inches(4.0), Inches(5.0))
txt(s10, "We're not looking for customers.\nWe're selecting partners who will\ndefine the category with us.",
    Inches(0.5), Inches(4.18), Inches(5.3), Inches(1.5),
    size=17, italic=True, color=MUTED, font="Barlow")

lbl(s10, "The Ask", Inches(6.3), Inches(0.45))
for i, (lbl_t, val, vcol) in enumerate([
    ("Program", "Founding Partner Program · 90-Day Validation", WHITE),
    ("Cohort Size", "12 Organizations · Fortune 1000", GOLD),
    ("Use of Funds", "Protocol Expansion · Sales Infrastructure · Category Establishment", WHITE),
    ("Why This Room", "Investors who see the category before the category exists", GOLD),
]):
    yt = Inches(0.82) + i * Inches(1.4)
    row_bg = box(s10, Inches(6.3), yt, Inches(6.6), Inches(1.25),
        color=DARK2 if i % 2 == 0 else RGBColor(0x0E,0x14,0x38))
    txt(s10, lbl_t.upper(), Inches(6.5), yt + Pt(8), Inches(3), Pt(18),
        size=9, bold=True, color=MUTED, font="Barlow Condensed")
    txt(s10, val, Inches(6.5), yt + Pt(26), Inches(6.2), Pt(38),
        size=14, bold=True, color=vcol, font="Barlow")

slide_num(s10, 10)

# ─────────────────────────────────────────────────────────────────
# SLIDE 11 — Three Sentences (clean close)
# ─────────────────────────────────────────────────────────────────
s11 = new_slide()
gold_bar(s11)

glow11 = s11.shapes.add_shape(1, Inches(8.0), 0, Inches(5.5), Inches(3.5))
glow11.fill.solid(); glow11.fill.fore_color.rgb = RGBColor(0x0E,0x18,0x44)
glow11.line.fill.background()

txt(s11, "Three sentences. That's the whole pitch.",
    Inches(0.5), Inches(0.5), Inches(12.3), Pt(22),
    size=12, bold=True, color=GOLD, font="Barlow Condensed", align=PP_ALIGN.CENTER)

for i, (tag, accent, body) in enumerate([
    ("Problem", GOLD,
     "Enterprises detect more signals, but still mobilize too slowly."),
    ("Solution", GOLD,
     "Readiness OS pre-stages response so executives authorize in minutes."),
    ("Outcome", TEAL,
     "Earlier detection + faster execution protects value before the window closes."),
]):
    yt = Inches(1.05) + i * Inches(1.75)
    row = box(s11, Inches(0.7), yt, Inches(11.9), Inches(1.58), color=RGBColor(0x0E,0x16,0x40))
    bar = s11.shapes.add_shape(1, Inches(0.7), yt, Pt(4), Inches(1.58))
    bar.fill.solid(); bar.fill.fore_color.rgb = accent; bar.line.fill.background()
    txt(s11, tag.upper(), Inches(0.95), yt + Pt(12), Inches(1.2), Pt(26),
        size=9, bold=True, color=RGBColor(0x80,0x8A,0xA0), font="Barlow Condensed")
    txt(s11, body, Inches(2.15), yt + Pt(10), Inches(10.2), Pt(50),
        size=15, bold=True, color=WHITE, font="Barlow")

txt(s11, "vaughnmartin.com/founding-partner-program",
    Inches(1.5), Inches(6.25), Inches(10.3), Pt(36),
    size=14, bold=True, color=GOLD, align=PP_ALIGN.CENTER, font="Barlow Condensed")
txt(s11, "VaughnMartin · Readiness OS · The response is ready before the trigger fires",
    Inches(1.5), Inches(6.78), Inches(10.3), Pt(20),
    size=10, bold=True, color=RGBColor(0x44,0x50,0x70),
    align=PP_ALIGN.CENTER, font="Barlow Condensed")
slide_num(s11, 11)

# ─────────────────────────────────────────────────────────────────
out = "attached_assets/VaughnMartin-Investor-Pitch-Deck.pptx"
prs.save(out)
kb = os.path.getsize(out) // 1024
print(f"PPTX → {out}  ({kb} KB, {len(prs.slides)} slides)")
print("Screenshots featured:")
print("  S1: Command Tower (inset strip) · live 221/20/170 stats")
print("  S2: Demo trigger screenshot · M&A · Risk 88/100 HIGH (full right panel)")
print("  S3: Signal Intelligence feed (large lower 42%)")
print("  S4: How-It-Executes page (lower strip)")
print("  S6: How-It-Executes page (large lower 44%)")
print("  S7: ROI Calculator — $61.3M hero (full right panel)")
print("  S8: Command Tower + Protocol Library (two large lower images)")
print("  S9: Protocol Library 170 protocols (full right panel)")
