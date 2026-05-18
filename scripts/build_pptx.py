from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import os

NAVY  = RGBColor(0x0A, 0x0F, 0x2E)
GOLD  = RGBColor(0xC9, 0xA8, 0x4C)
TEAL  = RGBColor(0x2B, 0x8A, 0x6E)
IVORY = RGBColor(0xF0, 0xED, 0xE4)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
MUTED = RGBColor(0x99, 0xA5, 0xBB)
RED   = RGBColor(0xFF, 0x50, 0x50)

W = Inches(13.33)
H = Inches(7.5)

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

blank_layout = prs.slide_layouts[6]

def add_slide(dark=True):
    s = prs.slides.add_slide(blank_layout)
    bg = s.background.fill
    bg.solid()
    bg.fore_color.rgb = NAVY if dark else RGBColor(0xF5, 0xF4, 0xF0)
    return s

def gold_bar(s, height_pt=5):
    bar = s.shapes.add_shape(1, 0, 0, W, Pt(height_pt))
    bar.fill.solid(); bar.fill.fore_color.rgb = GOLD
    bar.line.fill.background()

def txt(s, text, l, t, w, h, size=16, bold=False, color=WHITE, align=PP_ALIGN.LEFT,
        font="Barlow", italic=False, word_wrap=True):
    tx = s.shapes.add_textbox(l, t, w, h)
    tf = tx.text_frame
    tf.word_wrap = word_wrap
    p = tf.paragraphs[0]
    p.alignment = align
    r = p.add_run()
    r.text = text
    r.font.name = font
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = color
    return tx

def label(s, text, l, t, w=Inches(10), color=GOLD, center=False):
    txt(s, text.upper(), l, t, w, Pt(20), size=9, bold=True, color=color,
        align=PP_ALIGN.CENTER if center else PP_ALIGN.LEFT, font="Barlow Condensed")

def headline(s, text, l, t, w, h, size=38, color=WHITE, align=PP_ALIGN.LEFT, italic_part=None):
    tx = s.shapes.add_textbox(l, t, w, h)
    tf = tx.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run(); r.text = text
    r.font.name = "Cormorant Garamond"; r.font.size = Pt(size)
    r.font.bold = True; r.font.color.rgb = color
    return tx

def gold_rule(s, l, t, w=Inches(4)):
    line = s.shapes.add_shape(1, l, t, w, Pt(1.5))
    line.fill.solid(); line.fill.fore_color.rgb = GOLD
    line.line.fill.background()

def stat_block(s, num, sub, l, t, num_size=52, color=GOLD, sub_color=MUTED, w=Inches(2.2)):
    txt(s, num, l, t, w, Inches(1), size=num_size, bold=True, color=color, font="Cormorant Garamond")
    txt(s, sub, l, t + Inches(0.85), w, Inches(0.7), size=13, color=sub_color, font="Barlow")

def check_row(s, check, text, l, t, w=Inches(5.5), check_color=TEAL, text_color=WHITE):
    txt(s, check, l, t, Inches(0.4), Pt(28), size=16, bold=True, color=check_color, font="Barlow")
    txt(s, text, l + Inches(0.4), t, w, Pt(28), size=14, color=text_color, font="Barlow")

def add_image(s, path, l, t, w, h):
    if os.path.exists(path):
        pic = s.shapes.add_picture(path, l, t, w, h)
        return pic

def divider(s, l, t, w, color=GOLD, thickness=1):
    line = s.shapes.add_shape(1, l, t, w, Pt(thickness))
    line.fill.solid(); line.fill.fore_color.rgb = color
    line.line.fill.background()

# ─────────────────────────────────────────────
# SLIDE 1 — Hook Question
# ─────────────────────────────────────────────
s1 = add_slide()
gold_bar(s1)

headline(s1,
    "When a strategic trigger fires—",
    Inches(1.2), Inches(1.0), Inches(10.5), Inches(1.0),
    size=36, align=PP_ALIGN.CENTER)
headline(s1,
    "how long does it take to mobilize a coordinated response?",
    Inches(1.2), Inches(1.9), Inches(10.5), Inches(1.3),
    size=32, color=GOLD, align=PP_ALIGN.CENTER)

chips_t = Inches(3.5)
for i, (chip_txt, hot) in enumerate([
    ("Activist Investor · 91%", True),
    ("Ransomware · 95%", True),
    ("Regulatory Inquiry · 87%", False)
]):
    cx = Inches(1.5 + i * 3.7)
    chip = s1.shapes.add_shape(1, cx, chips_t, Inches(3.3), Inches(0.5))
    chip.fill.solid()
    chip.fill.fore_color.rgb = RGBColor(0x20, 0x28, 0x50) if not hot else RGBColor(0x28, 0x1C, 0x0A)
    chip.line.color.rgb = GOLD if hot else RGBColor(0x44, 0x50, 0x70)
    chip.line.width = Pt(1)
    txt(s1, chip_txt, cx + Inches(0.1), chips_t + Pt(8), Inches(3.1), Inches(0.5),
        size=13, bold=True, color=GOLD if hot else MUTED, align=PP_ALIGN.CENTER, font="Barlow Condensed")

txt(s1, "These are live signal detections. Production. Right now.",
    Inches(1.2), Inches(4.3), Inches(10.5), Pt(28),
    size=15, color=MUTED, align=PP_ALIGN.CENTER, font="Barlow", italic=True)

txt(s1, "VaughnMartin  ·  Readiness OS",
    Inches(0.5), Inches(6.7), Inches(5), Pt(22),
    size=12, bold=True, color=GOLD, font="Barlow Condensed")
txt(s1, "01 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 2 — The Reality: 30 Days
# ─────────────────────────────────────────────
s2 = add_slide()
gold_bar(s2)

label(s2, "The Reality", Inches(0.6), Inches(0.6))
txt(s2, "30", Inches(0.6), Inches(1.0), Inches(3), Inches(2),
    size=110, bold=True, color=GOLD, font="Cormorant Garamond")
txt(s2, "Days", Inches(0.6), Inches(2.8), Inches(3), Inches(0.5),
    size=28, bold=True, color=WHITE, font="Barlow Condensed")
gold_rule(s2, Inches(0.6), Inches(3.4), Inches(3.5))
txt(s2, "That's not execution time.\nThat's mobilization time before any execution begins.",
    Inches(0.6), Inches(3.6), Inches(3.8), Inches(1.5),
    size=15, color=MUTED, font="Barlow", italic=True)

divider(s2, Inches(5), Inches(0.5), Pt(1), color=RGBColor(0x22,0x2B,0x52), thickness=1)
label(s2, "The Old Model — Every Time", Inches(5.3), Inches(0.5))

steps = [
    ("Trigger fires", "Signal detected — no protocol exists. Emails go out.", True),
    ("Days 1–5: Who's in the room?", "Executives align on who should lead. Calendars negotiated.", False),
    ("Days 6–14: What's the plan?", "Strategy formed. Consultants engaged.", False),
    ("Days 15–25: Alignment cycle", "Stakeholders aligned. Approvals queued.", False),
    ("Day 30+: Execution begins", "After 30 days of coordination. If you're lucky.", False),
]
for i, (heading, body, active) in enumerate(steps):
    yt = Inches(0.9) + i * Inches(1.15)
    dot = s2.shapes.add_shape(1, Inches(5.3), yt + Inches(0.1), Pt(8), Pt(8))
    dot.fill.solid(); dot.fill.fore_color.rgb = GOLD if active else RGBColor(0x33,0x3D,0x60)
    dot.line.fill.background()
    txt(s2, heading, Inches(5.65), yt, Inches(7), Pt(22), size=14, bold=True,
        color=WHITE if active else RGBColor(0xCC,0xD2,0xE0), font="Barlow")
    txt(s2, body, Inches(5.65), yt + Pt(20), Inches(7.2), Pt(22), size=12,
        color=MUTED, font="Barlow")
    if i < 4:
        divider(s2, Inches(5.65), yt + Pt(46), Inches(7), color=RGBColor(0x1E,0x27,0x50))

txt(s2, "02 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 3 — The Problem Is Already Here
# ─────────────────────────────────────────────
s3 = add_slide()
gold_bar(s3)

label(s3, "The Problem Is Already Here", Inches(1.2), Inches(0.5), center=False, w=Inches(10), color=GOLD)
headline(s3, "One of these is forming in your portfolio right now",
    Inches(1.2), Inches(0.85), Inches(10.5), Inches(1.0), size=30, align=PP_ALIGN.CENTER)

cards = [
    ("95%", "Risk & Resilience", "Ransomware\nAttack Confirmed", "248 data points", TEAL),
    ("91%", "Growth & Positioning", "Activist Investor\nPressure Rising", "Live Monitoring", GOLD),
    ("87%", "Risk & Resilience", "Regulatory Inquiry\nOpened", "Threshold Forming", TEAL),
]
for i, (conf, domain, name, status, accent) in enumerate(cards):
    cx = Inches(0.5 + i * 4.3)
    cy = Inches(1.9)
    cw = Inches(4.0); ch = Inches(3.8)
    card = s3.shapes.add_shape(1, cx, cy, cw, ch)
    card.fill.solid(); card.fill.fore_color.rgb = RGBColor(0x12, 0x1A, 0x44)
    card.line.color.rgb = RGBColor(0x2A, 0x36, 0x66); card.line.width = Pt(1)
    txt(s3, conf, cx + Inches(2.7), cy + Inches(0.15), Inches(1.2), Inches(0.6),
        size=20, bold=True, color=accent, font="Barlow Condensed", align=PP_ALIGN.RIGHT)
    txt(s3, domain.upper(), cx + Inches(0.2), cy + Inches(0.2), Inches(2.4), Inches(0.4),
        size=9, bold=True, color=TEAL, font="Barlow Condensed")
    txt(s3, name, cx + Inches(0.2), cy + Inches(0.75), Inches(3.6), Inches(1.0),
        size=22, bold=True, color=WHITE, font="Cormorant Garamond")
    bar_bg = s3.shapes.add_shape(1, cx + Inches(0.2), cy + Inches(1.95), Inches(3.6), Pt(4))
    bar_bg.fill.solid(); bar_bg.fill.fore_color.rgb = RGBColor(0x1E,0x28,0x55)
    bar_bg.line.fill.background()
    fill_w = Inches(3.6 * int(conf[:-1]) / 100)
    bar_fill = s3.shapes.add_shape(1, cx + Inches(0.2), cy + Inches(1.95), fill_w, Pt(4))
    bar_fill.fill.solid(); bar_fill.fill.fore_color.rgb = accent
    bar_fill.line.fill.background()
    txt(s3, f"● Signal Detected · {status}", cx + Inches(0.2), cy + Inches(2.2),
        Inches(3.6), Pt(20), size=10, color=TEAL, font="Barlow")

add_image(s3, "screenshots/deck_signals.jpg",
    Inches(0), Inches(5.7), Inches(13.33), Inches(1.6))

txt(s3, "● Live signal detections from vaughnmartin.com production — not hypothetical",
    Inches(1.2), Inches(5.8), Inches(10.5), Pt(20),
    size=10, bold=True, color=GOLD, align=PP_ALIGN.CENTER, font="Barlow Condensed")
txt(s3, "03 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 4 — Main Claim + 3 Pillars
# ─────────────────────────────────────────────
s4 = add_slide()
gold_bar(s4)

glow = s4.shapes.add_shape(1, Inches(8), Inches(0), Inches(6), Inches(4))
glow.fill.solid(); glow.fill.fore_color.rgb = RGBColor(0x12,0x1F,0x4A)
glow.line.fill.background()

headline(s4, "The response is ready", Inches(1.5), Inches(1.0), Inches(10), Inches(1.2),
    size=52, align=PP_ALIGN.CENTER)
headline(s4, "before the trigger fires.", Inches(1.5), Inches(1.95), Inches(10), Inches(1.2),
    size=52, color=GOLD, align=PP_ALIGN.CENTER)

txt(s4, "Preparation  →  Readiness  →  Fearless",
    Inches(1.5), Inches(3.1), Inches(10), Pt(28),
    size=16, color=MUTED, align=PP_ALIGN.CENTER, font="Barlow")

pillars = [("170", "Readiness\nProtocols"), ("221", "Strategic\nTriggers Mapped"), ("12 MIN", "Full Execution\nCycle")]
for i, (num, lbl) in enumerate(pillars):
    px = Inches(1.5 + i * 3.8)
    py = Inches(4.0)
    divider(s4, px, py - Pt(4), Inches(3.5), color=RGBColor(0x22,0x2B,0x55))
    sz = 60 if num != "12 MIN" else 42
    txt(s4, num, px, py, Inches(3.5), Inches(1.2),
        size=sz, bold=True, color=GOLD, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s4, lbl, px, py + Inches(1.0), Inches(3.5), Inches(0.7),
        size=14, color=WHITE, font="Barlow", align=PP_ALIGN.CENTER)

txt(s4, "04 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 5 — Comparison
# ─────────────────────────────────────────────
s5 = add_slide()
gold_bar(s5)

left_bg = s5.shapes.add_shape(1, 0, 0, Inches(6), H)
left_bg.fill.solid(); left_bg.fill.fore_color.rgb = RGBColor(0x10,0x14,0x35)
left_bg.line.fill.background()

txt(s5, "Every Other Vendor", Inches(0.5), Inches(0.6), Inches(5), Pt(20),
    size=9, bold=True, color=RGBColor(0xFF,0x50,0x50), font="Barlow Condensed")
headline(s5, '"Bolted AI onto the old model"',
    Inches(0.5), Inches(1.0), Inches(5.5), Inches(1.0), size=22, color=MUTED)

old = [
    "Faster summaries from the same slow meeting",
    "Smarter notes. Same 30-day mobilization cycle.",
    "AI tools. No operating model change.",
    "Competes with Copilot. We don't.",
]
for i, line in enumerate(old):
    yt = Inches(2.2) + i * Inches(0.95)
    txt(s5, "✕", Inches(0.5), yt, Inches(0.4), Pt(28), size=16, bold=True, color=RED, font="Barlow")
    txt(s5, line, Inches(1.0), yt, Inches(4.8), Pt(28), size=14, color=MUTED, font="Barlow")

label(s5, "VaughnMartin", Inches(6.8), Inches(0.6), color=GOLD)
headline(s5, '"Rebuilt the operating model from first principles"',
    Inches(6.5), Inches(1.0), Inches(6.3), Inches(1.2), size=20, color=WHITE)

new = [
    "Pre-staged before any trigger fires",
    "Proprietary IDEA Framework — 3 years to build",
    "Orchestrates the Microsoft stack — doesn't replace it",
    "Competes with the 40-year-old meeting model",
]
for i, line in enumerate(new):
    yt = Inches(2.2) + i * Inches(0.95)
    txt(s5, "✓", Inches(6.5), yt, Inches(0.4), Pt(28), size=16, bold=True, color=TEAL, font="Barlow")
    txt(s5, line, Inches(7.0), yt, Inches(5.8), Pt(28), size=14, color=WHITE, font="Barlow")

divider(s5, Inches(6.45), Inches(0.5), Pt(1.5), color=RGBColor(0x22,0x2B,0x55))
txt(s5, "05 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 6 — How It Executes
# ─────────────────────────────────────────────
s6 = add_slide()
gold_bar(s6)

label(s6, "How It Executes", Inches(0.5), Inches(0.5), center=False, w=Inches(12), color=GOLD)
headline(s6, "The preparation architecture that exists before the trigger fires",
    Inches(0.8), Inches(0.8), Inches(11.5), Inches(0.9), size=26, align=PP_ALIGN.CENTER)

chain_nodes = [
    ("SIG", "Signal\nDetected", False),
    ("SCR", "Scored &\nClassified", False),
    ("PRO", "Protocol\nActivates", True),
    ("STK", "Stakeholders\nNotified", False),
    ("AUTH", "Executive\nAuthorizes", False),
    ("EXE", "Execution\nBegins", True),
]
for i, (abbr, lbl, hero) in enumerate(chain_nodes):
    cx = Inches(0.6 + i * 2.1)
    cy = Inches(1.9)
    circle = s6.shapes.add_shape(9, cx, cy, Inches(1.5), Inches(1.5))
    circle.fill.solid()
    circle.fill.fore_color.rgb = GOLD if hero else RGBColor(0x18,0x22,0x52)
    circle.line.color.rgb = GOLD; circle.line.width = Pt(1.5 if not hero else 0)
    txt(s6, abbr, cx, cy + Inches(0.45), Inches(1.5), Inches(0.6),
        size=12, bold=True, color=NAVY if hero else GOLD,
        font="Barlow Condensed", align=PP_ALIGN.CENTER)
    txt(s6, lbl, cx, cy + Inches(1.6), Inches(1.5), Inches(0.7),
        size=11, color=WHITE, font="Barlow", align=PP_ALIGN.CENTER)
    if i < 5:
        arrow = s6.shapes.add_shape(1, cx + Inches(1.52), cy + Inches(0.69),
            Inches(0.56), Pt(2))
        arrow.fill.solid(); arrow.fill.fore_color.rgb = GOLD
        arrow.line.fill.background()

time_bg = s6.shapes.add_shape(1, Inches(0.5), Inches(3.75), Inches(5.5), Inches(0.55))
time_bg.fill.solid(); time_bg.fill.fore_color.rgb = RGBColor(0x20,0x30,0x1A)
time_bg.line.color.rgb = TEAL; time_bg.line.width = Pt(1)
txt(s6, "✓  Complete in 12 minutes", Inches(0.6), Inches(3.8), Inches(5.3), Inches(0.5),
    size=15, bold=True, color=TEAL, font="Barlow")
txt(s6, "The alternative: 30 days of mobilization before execution begins",
    Inches(6.3), Inches(3.85), Inches(6.5), Pt(28),
    size=13, color=MUTED, font="Barlow", italic=True)

add_image(s6, "screenshots/slide_mission_control.jpg",
    Inches(0.5), Inches(4.45), Inches(8.5), Inches(2.4))
txt(s6, "Mission Control · Executive-authorized execution · Live in production",
    Inches(9.2), Inches(5.0), Inches(3.8), Inches(1.5),
    size=12, color=GOLD, font="Barlow Condensed", italic=False)
txt(s6, "06 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 7 — Return on Readiness
# ─────────────────────────────────────────────
s7 = add_slide()
gold_bar(s7)

label(s7, "Return on Readiness", Inches(0.5), Inches(0.5), color=GOLD)

stat_block(s7, "3,600×", "Execution Head Start\nvs. Old Model",
    Inches(0.5), Inches(1.0), num_size=58)
stat_block(s7, "$120K", "Platform Cost · Annual",
    Inches(0.5), Inches(2.8), num_size=44, color=WHITE)
gold_rule(s7, Inches(0.5), Inches(3.9), Inches(4.5))
txt(s7, "Breaks even before\nthe second activation.",
    Inches(0.5), Inches(4.0), Inches(4.5), Inches(1.0),
    size=16, color=MUTED, font="Barlow", italic=True)

label(s7, "The Business Case", Inches(5.5), Inches(0.5), color=GOLD)

roi_rows = [
    ("Consulting Retainer Replaced", "$400K – $800K / yr", GOLD),
    ("Platform Cost", "$60K – $240K / yr", WHITE),
    ("Break-Even Point", "2nd Activation", TEAL),
    ("3-Year Net Value", "Live at /roi-calculator", GOLD),
    ("Budget Line Already Exists", "Replaces existing retainer", TEAL),
]
for i, (lbl, val, vcol) in enumerate(roi_rows):
    yt = Inches(1.0) + i * Inches(1.05)
    row_bg = s7.shapes.add_shape(1, Inches(5.5), yt, Inches(7.2), Inches(0.9))
    row_bg.fill.solid()
    row_bg.fill.fore_color.rgb = RGBColor(0x12,0x1A,0x44) if i % 2 == 0 else RGBColor(0x0E,0x14,0x38)
    row_bg.line.fill.background()
    txt(s7, lbl, Inches(5.7), yt + Pt(10), Inches(4), Pt(30), size=13, color=MUTED, font="Barlow")
    txt(s7, val, Inches(9.9), yt + Pt(10), Inches(2.6), Pt(30), size=13, bold=True,
        color=vcol, font="Barlow", align=PP_ALIGN.RIGHT)

quote_bg = s7.shapes.add_shape(1, Inches(5.5), Inches(6.2), Inches(7.2), Inches(0.9))
quote_bg.fill.solid(); quote_bg.fill.fore_color.rgb = RGBColor(0x0C,0x12,0x36)
quote_bg.line.fill.background()
divider(s7, Inches(5.5), Inches(6.2), Pt(3), color=GOLD)
txt(s7, "\u201cWe\u2019re not adding to the budget. We\u2019re replacing a line item that every Fortune 1000 already pays.\u201d",
    Inches(5.65), Inches(6.25), Inches(6.9), Inches(0.8),
    size=11, color=MUTED, font="Barlow", italic=True)
txt(s7, "07 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 8 — Built. In Production.
# ─────────────────────────────────────────────
s8 = add_slide()
gold_bar(s8)

label(s8, "Built. In Production. Right Now.", Inches(0.5), Inches(0.5), w=Inches(12), color=GOLD, center=False)
headline(s8, "The system is live — not a demo, not a roadmap",
    Inches(1), Inches(0.8), Inches(11), Inches(0.85), size=30, align=PP_ALIGN.CENTER)

stats = [("170", "Readiness Protocols\nPre-Staged"), ("221", "Strategic Triggers\nMapped"),
         ("248", "Data Points Monitored\nEvery 15 Minutes"), ("12", "Compound Protocols\nMulti-Domain")]
for i, (num, sub) in enumerate(stats):
    sx = Inches(0.5 + i * 3.2)
    block = s8.shapes.add_shape(1, sx, Inches(1.85), Inches(3.0), Inches(1.5))
    block.fill.solid(); block.fill.fore_color.rgb = RGBColor(0x12,0x1A,0x44)
    block.line.fill.background()
    txt(s8, num, sx + Inches(0.15), Inches(1.9), Inches(2.7), Inches(0.9),
        size=44, bold=True, color=GOLD if i != 2 else TEAL, font="Cormorant Garamond", align=PP_ALIGN.CENTER)
    txt(s8, sub, sx + Inches(0.1), Inches(2.75), Inches(2.8), Inches(0.65),
        size=12, color=MUTED, font="Barlow", align=PP_ALIGN.CENTER)

live_bg = s8.shapes.add_shape(1, Inches(3.5), Inches(3.55), Inches(6.2), Inches(0.45))
live_bg.fill.solid(); live_bg.fill.fore_color.rgb = RGBColor(0x18,0x26,0x20)
live_bg.line.color.rgb = TEAL; live_bg.line.width = Pt(1)
txt(s8, "●  vaughnmartin.com · Signal Detection Active · Updated Every 15 Minutes",
    Inches(3.6), Inches(3.6), Inches(5.9), Pt(26),
    size=11, color=TEAL, font="Barlow", align=PP_ALIGN.CENTER)

shots = [
    ("screenshots/deck_signals.jpg", "Signal Intelligence · Live detections"),
    ("screenshots/deck_protocol_library.jpg", "170 Readiness Protocols · Pre-staged"),
    ("screenshots/deck_roi_calc.jpg", "ROI Calculator · Value quantified"),
]
for i, (path, cap) in enumerate(shots):
    ix = Inches(0.4 + i * 4.3)
    add_image(s8, path, ix, Inches(4.2), Inches(4.1), Inches(2.55))
    txt(s8, cap, ix, Inches(6.82), Inches(4.1), Pt(18),
        size=9, bold=True, color=GOLD, font="Barlow Condensed", align=PP_ALIGN.CENTER)

txt(s8, "08 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 9 — Market Opportunity
# ─────────────────────────────────────────────
s9 = add_slide(dark=False)
gold_bar(s9)

left_bg = s9.shapes.add_shape(1, 0, 0, Inches(5.8), H)
left_bg.fill.solid(); left_bg.fill.fore_color.rgb = NAVY
left_bg.line.fill.background()

divider(s9, Inches(0.5), Inches(0.9), Pt(3.5), color=GOLD)
label(s9, "The Market Opportunity", Inches(0.6), Inches(0.55), color=GOLD)
headline(s9, "Preparation\ninfrastructure\ndoes not exist yet.",
    Inches(0.6), Inches(0.9), Inches(5.0), Inches(3.0), size=34)
gold_rule(s9, Inches(0.6), Inches(4.1), Inches(4.5))
txt(s9, "That's not a problem.\nThat's the entire opportunity.",
    Inches(0.6), Inches(4.25), Inches(5.0), Inches(1.2),
    size=18, color=IVORY, font="Barlow", italic=True)

label(s9, "Why Now · Why VaughnMartin", Inches(6.2), Inches(0.55), color=NAVY)

points = [
    ("01", "Every Fortune 1000 has Microsoft's AI stack. None have the operating model to use it at trigger speed. Readiness OS is the layer above."),
    ("02", "The category doesn't exist yet. First-mover advantage in preparation infrastructure is the same position ERP held in the 1990s."),
    ("03", "Enterprise AI budgets are growing. The operating model gap is growing faster. That gap is our product."),
    ("04", "We built the IDEA Framework — 170 protocols across 3 years. This is not recreatable in a product cycle. It is a structural moat."),
]
for i, (num, text) in enumerate(points):
    yt = Inches(0.9) + i * Inches(1.4)
    txt(s9, num, Inches(6.2), yt, Inches(0.65), Inches(0.7),
        size=22, bold=True, color=GOLD, font="Cormorant Garamond")
    txt(s9, text, Inches(6.9), yt, Inches(6.0), Inches(1.2),
        size=13, color=RGBColor(0x22,0x2B,0x44), font="Barlow")
    if i < 3:
        divider(s9, Inches(6.2), yt + Inches(1.3), Inches(6.7), color=RGBColor(0xCC,0xC8,0xBE))

txt(s9, "09 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x88,0x8A,0x90), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 10 — Founding Partner Program / The Ask
# ─────────────────────────────────────────────
s10 = add_slide()
gold_bar(s10)

label(s10, "Founding Partner Program", Inches(0.5), Inches(0.5), color=GOLD)
headline(s10, "Twelve\norganizations.\nOne first cohort.",
    Inches(0.5), Inches(0.85), Inches(5.5), Inches(3.0), size=44)
gold_rule(s10, Inches(0.5), Inches(4.1), Inches(5.0))
txt(s10, "We're not looking for customers.\nWe're selecting partners who will\ndefine the category with us.",
    Inches(0.5), Inches(4.25), Inches(5.2), Inches(1.5),
    size=17, color=MUTED, font="Barlow", italic=True)

label(s10, "The Ask", Inches(6.3), Inches(0.55), color=GOLD)

ask_items = [
    ("Program", "Founding Partner Program · 90-Day Validation", WHITE),
    ("Cohort Size", "12 Organizations · Fortune 1000", GOLD),
    ("Use of Funds", "Protocol Expansion · Sales Infrastructure · Category Establishment", WHITE),
    ("Why This Room", "Investors who see the category before the category exists", GOLD),
]
for i, (lbl, val, vcol) in enumerate(ask_items):
    yt = Inches(0.9) + i * Inches(1.35)
    row_bg = s10.shapes.add_shape(1, Inches(6.3), yt, Inches(6.5), Inches(1.2))
    row_bg.fill.solid()
    row_bg.fill.fore_color.rgb = RGBColor(0x12,0x1A,0x44) if i % 2 == 0 else RGBColor(0x0E,0x14,0x38)
    row_bg.line.fill.background()
    txt(s10, lbl.upper(), Inches(6.5), yt + Pt(8), Inches(3), Pt(18),
        size=9, bold=True, color=MUTED, font="Barlow Condensed")
    txt(s10, val, Inches(6.5), yt + Pt(28), Inches(6.1), Pt(34),
        size=14, bold=True, color=vcol, font="Barlow")

divider(s10, Inches(6.25), Inches(0.5), Pt(2), color=RGBColor(0x22,0x2B,0x55))
txt(s10, "10 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
# SLIDE 11 — Three Sentences
# ─────────────────────────────────────────────
s11 = add_slide()
gold_bar(s11)

glow11 = s11.shapes.add_shape(1, Inches(8.5), 0, Inches(5), Inches(3.5))
glow11.fill.solid(); glow11.fill.fore_color.rgb = RGBColor(0x10,0x1C,0x48)
glow11.line.fill.background()

txt(s11, "Three sentences. That's the whole pitch.",
    Inches(0.5), Inches(0.5), Inches(12.3), Pt(22),
    size=12, bold=True, color=GOLD, font="Barlow Condensed", align=PP_ALIGN.CENTER)

sentences = [
    ("Problem", GOLD,
     "No preparation infrastructure exists. Strategic triggers arrive in real time — the mobilization cycle still averages 30 days."),
    ("Solution", GOLD,
     "We rebuilt the operating model. Pre-staged execution replaces real-time coordination — 12 minutes, not 30 days."),
    ("ROI", TEAL,
     "At $120K, we replace a $400K–$800K retainer. Break-even before the second activation. The budget line already exists."),
]
for i, (tag, accent, body) in enumerate(sentences):
    yt = Inches(1.0) + i * Inches(1.65)
    row_bg = s11.shapes.add_shape(1, Inches(0.8), yt, Inches(11.7), Inches(1.5))
    row_bg.fill.solid(); row_bg.fill.fore_color.rgb = RGBColor(0x10,0x18,0x42)
    row_bg.line.fill.background()
    divider(s11, Inches(0.8), yt, Pt(4), color=accent)
    txt(s11, tag.upper(), Inches(1.0), yt + Pt(12), Inches(1.2), Pt(26),
        size=9, bold=True, color=RGBColor(0x80,0x8A,0xA0), font="Barlow Condensed")
    txt(s11, body, Inches(2.3), yt + Pt(10), Inches(10.0), Pt(42),
        size=15, bold=True, color=WHITE, font="Barlow")

txt(s11, "vaughnmartin.com/founding-partner-program",
    Inches(1.5), Inches(6.0), Inches(10), Pt(36),
    size=14, bold=True, color=GOLD, align=PP_ALIGN.CENTER, font="Barlow Condensed")
txt(s11, "VaughnMartin · Readiness OS · The response is ready before the trigger fires",
    Inches(1.5), Inches(6.55), Inches(10), Pt(22),
    size=10, color=RGBColor(0x44,0x50,0x70), align=PP_ALIGN.CENTER, font="Barlow Condensed", bold=True)
txt(s11, "11 / 11", Inches(12.3), Inches(7.1), Inches(1), Pt(18), size=10, color=RGBColor(0x44,0x50,0x70), font="Barlow Condensed", bold=True)

# ─────────────────────────────────────────────
out_path = "attached_assets/VaughnMartin-Investor-Pitch-Deck.pptx"
prs.save(out_path)
import os
size_kb = os.path.getsize(out_path) // 1024
print(f"PPTX saved → {out_path}  ({size_kb} KB, {len(prs.slides)} slides)")
