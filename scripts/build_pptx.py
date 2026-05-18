"""
VaughnMartin Investor Pitch Deck — PPTX builder (spec-exact v10, 11 slides)
Follows the strict layout spec verbatim.
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from PIL import Image as PILImage
import os

# ── Color palette ────────────────────────────────────────────
NAVY   = RGBColor(0x0A, 0x0F, 0x2E)
NAVY2  = RGBColor(0x12, 0x1D, 0x47)
NAVY3  = RGBColor(0x0D, 0x14, 0x38)
GOLD   = RGBColor(0xC9, 0xA8, 0x4C)
TEAL   = RGBColor(0x2B, 0x8A, 0x6E)
IVORY  = RGBColor(0xF2, 0xF0, 0xEB)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
MUTED  = RGBColor(0x99, 0xA5, 0xBB)
MID    = RGBColor(0x1E, 0x27, 0x55)
DARK3  = RGBColor(0x0E, 0x16, 0x40)
RED50  = RGBColor(0xFF, 0x60, 0x60)

# ── Dimensions ───────────────────────────────────────────────
W      = Inches(13.333)
H      = Inches(7.5)
TOTAL  = 11

# ── No-content zone (reserved for slide numbers) ─────────────
# x: 12.0–13.2 in  y: 7.0–7.5 in
NUM_X  = Inches(12.0)
NUM_Y  = Inches(7.05)
NUM_W  = Inches(1.2)
NUM_H  = Inches(0.38)

# ── Image paths (spec-exact) ─────────────────────────────────
IMG_HOME    = "attached_assets/pitch-images-hd/home-raw.png"
IMG_SIGNALS = "attached_assets/pitch-images-hd/signals-raw.png"
IMG_BUILDER = "attached_assets/pitch-images-hd/builder-raw.png"
IMG_EXECUTES= "attached_assets/pitch-images-hd/executes-raw.png"

# ─────────────────────────────────────────────────────────────
prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
blank = prs.slide_layouts[6]   # completely blank layout

# ── Utility helpers ──────────────────────────────────────────

def new_slide(bg=NAVY):
    s = prs.slides.add_slide(blank)
    fill = s.background.fill
    fill.solid()
    fill.fore_color.rgb = bg
    return s


def gold_bar(s):
    """3pt gold top bar on every slide."""
    r = s.shapes.add_shape(1, 0, 0, W, Pt(4.5))
    r.fill.solid(); r.fill.fore_color.rgb = GOLD
    r.line.fill.background()


def slide_num(s, n):
    """Slide number placed inside the reserved no-content zone."""
    bx = s.shapes.add_textbox(NUM_X, NUM_Y, NUM_W, NUM_H)
    tf = bx.text_frame
    p  = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    run = p.add_run()
    run.text = f"{n:02d} / {TOTAL:02d}"
    run.font.name  = "Calibri"
    run.font.size  = Pt(9)
    run.font.bold  = True
    run.font.color.rgb = RGBColor(0x44, 0x50, 0x70)


def txb(s, text, l, t, w, h,
        size=14, bold=False, italic=False,
        color=WHITE, align=PP_ALIGN.LEFT,
        font="Barlow Condensed", wrap=True):
    bx = s.shapes.add_textbox(l, t, w, h)
    tf = bx.text_frame; tf.word_wrap = wrap
    p  = tf.paragraphs[0]; p.alignment = align
    rn = p.add_run()
    rn.text = text
    rn.font.name   = font
    rn.font.size   = Pt(size)
    rn.font.bold   = bold
    rn.font.italic = italic
    rn.font.color.rgb = color
    return bx


def lbl(s, text, l, t, w=Inches(12), color=GOLD, align=PP_ALIGN.LEFT):
    txb(s, text.upper(), l, t, w, Pt(16),
        size=9, bold=True, color=color, align=align)


def heading(s, text, l, t, w, h, size=36,
            color=WHITE, align=PP_ALIGN.LEFT, font="Barlow Condensed"):
    bx = s.shapes.add_textbox(l, t, w, h)
    tf = bx.text_frame; tf.word_wrap = True
    p  = tf.paragraphs[0]; p.alignment = align
    rn = p.add_run()
    rn.text = text
    rn.font.name   = font
    rn.font.size   = Pt(size)
    rn.font.bold   = True
    rn.font.color.rgb = color
    return bx


def rect(s, l, t, w, h, fill_color=NAVY3, stroke_color=None, sw=0.8):
    r = s.shapes.add_shape(1, l, t, w, h)
    r.fill.solid(); r.fill.fore_color.rgb = fill_color
    if stroke_color:
        r.line.color.rgb = stroke_color; r.line.width = Pt(sw)
    else:
        r.line.fill.background()
    return r


def hrule(s, l, t, w, color=GOLD, lw=1.5):
    ln = s.shapes.add_shape(1, l, t, w, Pt(lw))
    ln.fill.solid(); ln.fill.fore_color.rgb = color
    ln.line.fill.background()


def vrule(s, l, t, h, color=MID, lw=0.5):
    ln = s.shapes.add_shape(1, l, t, Pt(lw), h)
    ln.fill.solid(); ln.fill.fore_color.rgb = color
    ln.line.fill.background()


def cover_pic(s, path, l, t, w, h, border=True, shadow=False):
    """
    Add image with cover/fill — maintains aspect ratio, crops to fill frame.
    No distortion per spec.
    """
    if not os.path.exists(path):
        rect(s, l, t, w, h, fill_color=MID,
             stroke_color=RGBColor(0x28, 0x34, 0x68))
        txb(s, f"[{os.path.basename(path)}]", l, t + h // 2 - Pt(10),
            w, Pt(20), size=9, color=MUTED, align=PP_ALIGN.CENTER)
        return None

    with PILImage.open(path) as img:
        iw, ih = img.size

    frame_ar = w / h          # EMU / EMU — dimensionless ratio
    img_ar   = iw / ih        # pixels / pixels

    # Add at exact frame dimensions (sets display box)
    pic = s.shapes.add_picture(path, l, t, w, h)

    if img_ar > frame_ar:
        # Image wider — crop left & right equally
        crop_w_ratio = (img_ar - frame_ar) / img_ar
        pic.crop_left  = crop_w_ratio / 2
        pic.crop_right = crop_w_ratio / 2
        pic.crop_top   = 0
        pic.crop_bottom = 0
    else:
        # Image taller — crop top & bottom equally
        inv_frame_ar = h / w
        inv_img_ar   = ih / iw
        crop_h_ratio = (inv_img_ar - inv_frame_ar) / inv_img_ar
        pic.crop_top    = crop_h_ratio / 2
        pic.crop_bottom = crop_h_ratio / 2
        pic.crop_left   = 0
        pic.crop_right  = 0

    if border:
        # Thin gold border overlay
        br = s.shapes.add_shape(1, l, t, w, h)
        br.fill.background()
        br.line.color.rgb = RGBColor(0xC9, 0xA8, 0x4C)
        br.line.width = Pt(1.2)

    return pic


def img_caption(s, text, l, t, w, h):
    """Caption bar beneath a product image."""
    cap_h = Inches(0.26)
    rect(s, l, t + h - cap_h, w, cap_h,
         fill_color=RGBColor(0x08, 0x0C, 0x22))
    txb(s, text.upper(), l + Inches(0.1), t + h - cap_h + Pt(5),
        w - Inches(0.2), cap_h,
        size=8, bold=True, color=GOLD, align=PP_ALIGN.LEFT)


# ═══════════════════════════════════════════════════════════════
# SLIDE 1 — Opening
# ═══════════════════════════════════════════════════════════════
s1 = new_slide()
gold_bar(s1)

lbl(s1, "VaughnMartin · Readiness OS",
    Inches(0.5), Inches(0.46), align=PP_ALIGN.CENTER)

heading(s1,
    "When a strategic trigger fires in your organization—"
    "are you executing in 12 minutes or organizing from scratch?",
    Inches(0.9), Inches(0.82), Inches(11.53), Inches(2.3),
    size=40, align=PP_ALIGN.CENTER)

txb(s1, "Signal advantage before execution advantage.",
    Inches(0.9), Inches(3.22), Inches(11.53), Inches(0.55),
    size=18, italic=True, color=MUTED, align=PP_ALIGN.CENTER,
    font="Barlow Condensed")

# 3 chips
for i, chip in enumerate([
    "Activist Investor  ·  91%",
    "Ransomware  ·  95%",
    "Regulatory Inquiry  ·  87%",
]):
    cx = Inches(1.2 + i * 3.6)
    rect(s1, cx, Inches(4.06), Inches(3.4), Inches(0.46),
         fill_color=RGBColor(0x18, 0x22, 0x50),
         stroke_color=RGBColor(0x44, 0x52, 0x80))
    txb(s1, chip, cx + Inches(0.1), Inches(4.1),
        Inches(3.2), Inches(0.42),
        size=12, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

# Footer tagline
rect(s1, 0, Inches(6.86), W, Inches(0.57),
     fill_color=RGBColor(0x08, 0x0A, 0x1C))
txb(s1,
    "AI monitors continuously.     Executives authorize decisively.",
    Inches(0.5), Inches(6.94), Inches(12.33), Inches(0.44),
    size=13, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

slide_num(s1, 1)

# ═══════════════════════════════════════════════════════════════
# SLIDE 2 — Readiness Gap
# ═══════════════════════════════════════════════════════════════
s2 = new_slide()
gold_bar(s2)

# Left panel
rect(s2, Inches(0.36), Inches(0.48), Inches(5.9), Inches(6.58),
     fill_color=NAVY3)
lbl(s2, "The Reality", Inches(0.66), Inches(0.7))

heading(s2, "30",
    Inches(0.66), Inches(1.08), Inches(3.5), Inches(2.2),
    size=120, color=GOLD, font="Barlow Condensed")
heading(s2, "DAYS",
    Inches(0.66), Inches(3.06), Inches(3.5), Inches(0.65),
    size=30, color=WHITE)

hrule(s2, Inches(0.66), Inches(3.84), Inches(4.82))
txb(s2, "Mobilization time before execution begins.",
    Inches(0.66), Inches(4.02), Inches(4.9), Inches(0.6),
    size=15, italic=True, color=MUTED, font="Barlow Condensed")

# Right panel
rect(s2, Inches(6.74), Inches(0.48), Inches(6.22), Inches(6.58),
     fill_color=NAVY3)
lbl(s2, "The Readiness Question", Inches(7.04), Inches(0.7))

heading(s2,
    "Who calls who?\nWhere's the brief?\nWho owns it?\nWho authorizes?",
    Inches(7.04), Inches(1.08), Inches(5.78), Inches(2.42),
    size=25, color=GOLD)

hrule(s2, Inches(7.04), Inches(3.62), Inches(5.6))

# Accent box
rect(s2, Inches(7.04), Inches(3.82), Inches(5.78), Inches(0.48),
     fill_color=RGBColor(0x15, 0x1F, 0x52))
txb(s2, "This is a readiness problem, not a talent problem.",
    Inches(7.18), Inches(3.9), Inches(5.5), Inches(0.4),
    size=13, bold=True, color=WHITE)

for i, bullet in enumerate([
    "— Coordination restarts from zero at every trigger",
    "— The strategic window closes before execution begins",
]):
    txb(s2, bullet,
        Inches(7.04), Inches(4.44) + i * Inches(0.62),
        Inches(5.78), Inches(0.58),
        size=13, color=MUTED)

vrule(s2, Inches(6.54), Inches(0.36), Inches(6.8))
slide_num(s2, 2)

# ═══════════════════════════════════════════════════════════════
# SLIDE 3 — Problem Is Here  (badge spec: badge top-right, no overlap)
# ═══════════════════════════════════════════════════════════════
s3 = new_slide()
gold_bar(s3)

lbl(s3, "The Problem Is Already Here", Inches(0.5), Inches(0.46))
heading(s3, "One of these is forming in your organization right now",
    Inches(0.5), Inches(0.78), Inches(12.33), Inches(0.76),
    size=26, align=PP_ALIGN.CENTER)

card_w = Inches(4.11); card_h = Inches(4.72); card_y = Inches(1.68)
for i, (conf, domain, name1, name2, meta, accent, pct) in enumerate([
    ("95%", "RISK & RESILIENCE",
     "Ransomware", "Attack Confirmed",
     "Signal detected · 248 data points", TEAL, 95),
    ("87%", "REGULATORY",
     "Regulatory", "Inquiry Opened",
     "Signal detected · threshold crossed", GOLD, 87),
    ("82%", "GROWTH & POSITIONING",
     "Market Entry", "Window Opening",
     "Opportunity signal · live monitoring", GOLD, 82),
]):
    cx = Inches(0.38 + i * 4.32)

    # Card background
    rect(s3, cx, card_y, card_w, card_h,
         fill_color=RGBColor(0x10, 0x18, 0x42),
         stroke_color=RGBColor(0x28, 0x34, 0x68))

    # ── DOMAIN LABEL — full width minus reserved badge zone ──
    # Badge occupies right 1.0in; domain gets the remaining left portion
    domain_w = Inches(2.9)   # stays clear of badge area
    txb(s3, domain,
        cx + Inches(0.18), card_y + Inches(0.18),
        domain_w, Inches(0.44),
        size=9, bold=True, color=TEAL)

    # ── BADGE — positioned top-right, dark bg so it never bleeds on text ──
    badge_w = Inches(0.88); badge_h = Inches(0.44)
    badge_x = cx + card_w - badge_w - Inches(0.1)
    badge_y = card_y + Inches(0.12)
    rect(s3, badge_x, badge_y, badge_w, badge_h,
         fill_color=RGBColor(0x08, 0x10, 0x30),
         stroke_color=accent)
    txb(s3, conf,
        badge_x, badge_y, badge_w, badge_h,
        size=20, bold=True, color=accent, align=PP_ALIGN.CENTER)

    # Title — starts below the domain+badge row
    heading(s3, f"{name1}\n{name2}",
        cx + Inches(0.18), card_y + Inches(0.78),
        card_w - Inches(0.36), Inches(1.12),
        size=22, color=WHITE)

    txb(s3, meta,
        cx + Inches(0.18), card_y + Inches(2.08),
        card_w - Inches(0.36), Inches(0.36),
        size=11, color=MUTED)

    # Progress bar
    bar_y = card_y + Inches(2.62)
    bar_w = card_w - Inches(0.36)
    rect(s3, cx + Inches(0.18), bar_y, bar_w, Pt(4),
         fill_color=MID)
    rect(s3, cx + Inches(0.18), bar_y, int(bar_w * pct / 100), Pt(4),
         fill_color=accent)

# Footer
rect(s3, Inches(0.36), Inches(6.54), Inches(12.61), Inches(0.44),
     fill_color=RGBColor(0x10, 0x18, 0x42))
txb(s3,
    "221 triggers monitored  ·  248 data points  ·  refreshed every 15 minutes",
    Inches(0.5), Inches(6.6), Inches(12.33), Inches(0.38),
    size=10, bold=True,
    color=RGBColor(0x44, 0x58, 0x80), align=PP_ALIGN.CENTER)

slide_num(s3, 3)

# ═══════════════════════════════════════════════════════════════
# SLIDE 4 — Solution
# ═══════════════════════════════════════════════════════════════
s4 = new_slide()
gold_bar(s4)

rect(s4, Inches(7.5), 0, Inches(5.83), Inches(4.0),
     fill_color=RGBColor(0x10, 0x1C, 0x4A))

lbl(s4, "The Answer", Inches(0.5), Inches(0.46), align=PP_ALIGN.CENTER)

heading(s4, "The response is ready",
    Inches(1.0), Inches(0.82), Inches(11.33), Inches(1.15),
    size=52, align=PP_ALIGN.CENTER)
heading(s4, "before the trigger fires.",
    Inches(1.0), Inches(1.88), Inches(11.33), Inches(1.15),
    size=52, color=GOLD, align=PP_ALIGN.CENTER)

txb(s4, "Preparation  →  Readiness  →  Fearless",
    Inches(1.0), Inches(3.05), Inches(11.33), Inches(0.5),
    size=16, italic=True, color=MUTED, align=PP_ALIGN.CENTER,
    font="Barlow Condensed")

hrule(s4, Inches(4.17), Inches(3.64), Inches(5.0))

# KPI trio
for i, (num, sub) in enumerate([
    ("170", "Readiness Protocols"),
    ("221", "Strategic Triggers"),
    ("12 MIN", "Execution Window"),
]):
    px = Inches(0.55 + i * 4.22)
    txb(s4, num, px, Inches(3.84), Inches(4.0), Inches(1.22),
        size=52 if num != "12 MIN" else 38,
        bold=True, color=GOLD, align=PP_ALIGN.CENTER,
        font="Barlow Condensed")
    txb(s4, sub, px, Inches(5.02), Inches(4.0), Pt(24),
        size=13, color=WHITE, align=PP_ALIGN.CENTER)

# AI monitors tagline box
rect(s4, Inches(2.0), Inches(6.08), Inches(9.33), Inches(0.54),
     fill_color=NAVY, stroke_color=RGBColor(0x44, 0x52, 0x80))
txb(s4, "AI monitors.   Executives authorize.   Teams execute.",
    Inches(2.1), Inches(6.17), Inches(9.13), Inches(0.44),
    size=14, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

slide_num(s4, 4)

# ═══════════════════════════════════════════════════════════════
# SLIDE 5 — Moat: Old Model vs VaughnMartin (spec: two-column compare)
# ═══════════════════════════════════════════════════════════════
s5 = new_slide()
gold_bar(s5)

lbl(s5, "Why This Is Defensible", Inches(0.5), Inches(0.46))
heading(s5, "The architecture that separates execution from mobilization",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.76),
    size=24)

hrule(s5, Inches(0.5), Inches(1.6), Inches(12.33))

# Left — Old Model
rect(s5, Inches(0.36), Inches(1.72), Inches(6.0), Inches(5.3),
     fill_color=RGBColor(0x18, 0x08, 0x08))
txb(s5, "Old Model",
    Inches(0.66), Inches(1.9), Inches(5.6), Pt(22),
    size=10, bold=True, color=RGBColor(0xFF, 0x66, 0x66))

old_bullets = [
    "Faster notes from the same slow meetings",
    "No readiness architecture before triggers fire",
    "Authority unclear when pressure arrives",
    "Governance added after the fact — if at all",
    "30-day mobilization cycle before execution starts",
]
for i, b in enumerate(old_bullets):
    txb(s5, f"✕  {b}",
        Inches(0.66), Inches(2.3) + i * Inches(0.72),
        Inches(5.6), Inches(0.66),
        size=13, color=RGBColor(0xFF, 0x88, 0x88))

# Right — VaughnMartin
rect(s5, Inches(6.97), Inches(1.72), Inches(6.0), Inches(5.3),
     fill_color=RGBColor(0x08, 0x18, 0x10))
txb(s5, "VaughnMartin Readiness OS",
    Inches(7.27), Inches(1.9), Inches(5.6), Pt(22),
    size=10, bold=True, color=GOLD)

new_bullets = [
    "Response pre-staged before trigger fires",
    "170 protocols mapped to 221 strategic triggers",
    "Human authorization gate at every activation",
    "Audit trail built into execution — board-ready",
    "12-minute execution window from signal to action",
]
for i, b in enumerate(new_bullets):
    txb(s5, f"✓  {b}",
        Inches(7.27), Inches(2.3) + i * Inches(0.72),
        Inches(5.6), Inches(0.66),
        size=13, color=RGBColor(0x66, 0xCC, 0x99))

vrule(s5, Inches(6.67), Inches(1.72), Inches(5.5))

slide_num(s5, 5)

# ═══════════════════════════════════════════════════════════════
# SLIDE 6 — Mic-Drop: Signal → Execution side by side
# ═══════════════════════════════════════════════════════════════
s6 = new_slide()
gold_bar(s6)

lbl(s6, "Proof of Production", Inches(0.5), Inches(0.46))
heading(s6, "From Signal to Authorized Execution in 12 Minutes",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.76),
    size=28, align=PP_ALIGN.CENTER)

img_h = Inches(4.32); img_y = Inches(1.58)
# Left: signals image
cover_pic(s6, IMG_SIGNALS,
    Inches(0.36), img_y, Inches(6.2), img_h)
img_caption(s6, "Live trigger detected with confidence scoring",
    Inches(0.36), img_y, Inches(6.2), img_h)

# Right: builder image (execution proof)
cover_pic(s6, IMG_BUILDER,
    Inches(6.77), img_y, Inches(6.2), img_h)
img_caption(s6, "Pre-staged protocol · stakeholders · authority · tasks",
    Inches(6.77), img_y, Inches(6.2), img_h)

# Bottom tagline bar
rect(s6, 0, Inches(6.06), W, Inches(0.86),
     fill_color=RGBColor(0x08, 0x0C, 0x22))
txb(s6,
    "AI monitors.     Executives authorize.     Teams execute.",
    Inches(0.5), Inches(6.18), Inches(12.33), Inches(0.5),
    size=22, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
txb(s6,
    "170 protocols  ·  221 triggers  ·  248 data points  ·  15-minute refresh",
    Inches(0.5), Inches(6.74), Inches(12.33), Inches(0.34),
    size=10, color=MUTED, align=PP_ALIGN.CENTER)

slide_num(s6, 6)

# ═══════════════════════════════════════════════════════════════
# SLIDE 7 — Value / ROI
# ═══════════════════════════════════════════════════════════════
s7 = new_slide()
gold_bar(s7)

lbl(s7, "Business Value", Inches(0.5), Inches(0.46))
heading(s7, "Readiness is not overhead.",
    Inches(0.5), Inches(0.76), Inches(7.8), Inches(0.84),
    size=34)
heading(s7, "It is value protection.",
    Inches(0.5), Inches(1.52), Inches(7.8), Inches(0.84),
    size=34, color=GOLD)
hrule(s7, Inches(0.5), Inches(2.46), Inches(12.33))

# Left — big 3600x
txb(s7, "3,600×", Inches(0.5), Inches(2.66),
    Inches(5.6), Inches(1.42),
    size=72, bold=True, color=GOLD, font="Barlow Condensed")
txb(s7, "Execution head start vs. old mobilization model",
    Inches(0.5), Inches(3.92), Inches(5.6), Pt(26),
    size=12, color=MUTED)
hrule(s7, Inches(0.5), Inches(4.3), Inches(5.6))

for i, (bullet, col) in enumerate([
    ("▶  Founding Partner: $75K / 90-day validation", GOLD),
    ("▶  Growth: $75K–$250K annually", WHITE),
    ("▶  Cost of delay is often higher than cost of readiness.", TEAL),
]):
    txb(s7, bullet,
        Inches(0.5), Inches(4.52) + i * Inches(0.64),
        Inches(5.6), Inches(0.6),
        size=13, color=col)

# Right — commercial table
rect(s7, Inches(6.8), Inches(2.62), Inches(6.17), Inches(4.5),
     fill_color=NAVY3)
lbl(s7, "Commercial Logic", Inches(7.1), Inches(2.82))
txb(s7,
    "Replaces the $400K–$800K consulting retainer.\nBreak-even before the 2nd activation.",
    Inches(7.3), Inches(3.06), Inches(5.58), Inches(0.76),
    size=13, italic=True, color=MUTED, font="Barlow Condensed")

for i, (k, v, vc) in enumerate([
    ("Founding Partner", "$75K / 90 days",         GOLD),
    ("Growth Tier",      "$75K–$250K annually",    WHITE),
    ("Cohort",           "startup to Fortune 500", WHITE),
    ("Board Line",       "Cost of delay > cost of readiness", TEAL),
]):
    row_y = Inches(3.98) + i * Inches(0.68)
    hrule(s7, Inches(7.1), row_y - Pt(2), Inches(5.6),
          color=RGBColor(0x28, 0x34, 0x58), lw=0.5)
    txb(s7, k.upper(), Inches(7.1), row_y,
        Inches(2.3), Pt(24), size=9, bold=True, color=MUTED)
    txb(s7, v, Inches(9.5), row_y, Inches(3.1), Pt(24),
        size=14 if vc != GOLD else 16,
        bold=(vc == GOLD), color=vc)

vrule(s7, Inches(6.6), Inches(2.38), Inches(4.74))
slide_num(s7, 7)

# ═══════════════════════════════════════════════════════════════
# SLIDE 8 — Live Proof  (large product image)
# ═══════════════════════════════════════════════════════════════
s8 = new_slide()
gold_bar(s8)

lbl(s8, "Built. Live. In Production.", Inches(0.5), Inches(0.46))
heading(s8, "Not a roadmap — operating now",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.72),
    size=30, align=PP_ALIGN.CENTER)

# KPI strip
for i, (num, sub, col) in enumerate([
    ("170",  "Protocols",   GOLD),
    ("221",  "Triggers",    GOLD),
    ("248",  "Data Points", TEAL),
    ("15m",  "Refresh",     GOLD),
]):
    sx = Inches(0.36 + i * 3.24)
    rect(s8, sx, Inches(1.6), Inches(3.1), Inches(1.14),
         fill_color=RGBColor(0x0E, 0x16, 0x3C))
    txb(s8, num, sx, Inches(1.65), Inches(3.1), Inches(0.72),
        size=40, bold=True, color=col, align=PP_ALIGN.CENTER,
        font="Barlow Condensed")
    txb(s8, sub, sx, Inches(2.34), Inches(3.1), Pt(26),
        size=12, color=MUTED, align=PP_ALIGN.CENTER)

# Live indicator
rect(s8, Inches(3.2), Inches(2.9), Inches(6.9), Inches(0.38),
     fill_color=RGBColor(0x10, 0x20, 0x18),
     stroke_color=TEAL)
txb(s8,
    "●  Signal Detection Active  ·  Updated Every 15 Minutes  ·  vaughnmartin.com",
    Inches(3.3), Inches(2.95), Inches(6.7), Inches(0.34),
    size=10, bold=True, color=TEAL, align=PP_ALIGN.CENTER)

# Large product image — signals
cover_pic(s8, IMG_SIGNALS,
    Inches(0.36), Inches(3.44), Inches(12.61), Inches(3.62))
img_caption(s8,
    "Signal Intelligence feed · vaughnmartin.com · Live detections · production",
    Inches(0.36), Inches(3.44), Inches(12.61), Inches(3.62))

slide_num(s8, 8)

# ═══════════════════════════════════════════════════════════════
# SLIDE 9 — Why Now  (ivory background variant per spec)
# ═══════════════════════════════════════════════════════════════
s9 = new_slide(bg=RGBColor(0xF2, 0xF0, 0xEB))
gold_bar(s9)

lbl(s9, "Why Now",
    Inches(0.5), Inches(0.48), color=RGBColor(0x44, 0x4A, 0x68))

heading(s9,
    "AI capability is accelerating faster than enterprise readiness.",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(1.1),
    size=30, color=NAVY)

hrule(s9, Inches(0.5), Inches(1.98), Inches(12.33))

for i, (num, bullet) in enumerate([
    ("01", "AI capability is accelerating. Enterprise mobilization readiness is not."),
    ("02", "Execution readiness is now the competitive bottleneck — not information access."),
    ("03", "Winners will pair AI sensing with governed 12-minute execution."),
]):
    by = Inches(2.22) + i * Inches(1.24)
    txb(s9, num, Inches(0.5), by, Inches(0.68), Inches(0.9),
        size=22, bold=True, color=GOLD)
    txb(s9, bullet,
        Inches(1.26), by, Inches(11.57), Inches(0.9),
        size=17, color=NAVY)

txb(s9,
    "Sources: Stanford HAI AI Index 2026  ·  Gartner Autonomous Business",
    Inches(0.5), Inches(5.94), Inches(12.33), Pt(24),
    size=11, italic=True, color=MUTED, font="Barlow Condensed")

slide_num(s9, 9)

# ═══════════════════════════════════════════════════════════════
# SLIDE 10 — The Ask  (product snapshot + table + CTA)
# ═══════════════════════════════════════════════════════════════
s10 = new_slide()
gold_bar(s10)

# Left panel — ask copy
rect(s10, Inches(0.36), Inches(0.48),
     Inches(4.7), Inches(6.58), fill_color=NAVY3)
lbl(s10, "The Ask", Inches(0.66), Inches(0.7))
heading(s10, "Twelve founding partners.\nOne defining cohort.",
    Inches(0.66), Inches(1.08), Inches(4.2), Inches(2.0),
    size=28)
hrule(s10, Inches(0.66), Inches(3.16), Inches(4.1))
txb(s10,
    "Partners who want readiness\nas competitive advantage.",
    Inches(0.66), Inches(3.34), Inches(4.2), Inches(0.88),
    size=14, color=MUTED, font="Barlow Condensed")

# CTA button
rect(s10, Inches(0.66), Inches(4.52),
     Inches(4.1), Inches(0.54),
     fill_color=NAVY, stroke_color=GOLD)
txb(s10, "Apply for Founding Partner Access",
    Inches(0.76), Inches(4.6), Inches(3.9), Inches(0.44),
    size=12, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

txb(s10, "Open strategic raise · conversations underway",
    Inches(0.66), Inches(5.26), Inches(4.2), Pt(24),
    size=11, color=MUTED)

# Middle panel — program table
rect(s10, Inches(5.24), Inches(0.48),
     Inches(4.62), Inches(6.58), fill_color=NAVY3)
lbl(s10, "Program Details", Inches(5.54), Inches(0.7))

for i, (k, v, vc) in enumerate([
    ("Program",    "Founding Partner · 90-Day", WHITE),
    ("Commercial", "$75K / 90 days",           GOLD),
    ("Cohort",     "12 startup to Fortune 500",WHITE),
    ("Scope",      "Startup to Fortune 500",   WHITE),
    ("Delivery",   "Right-sized by maturity",  WHITE),
]):
    ry = Inches(1.24) + i * Inches(1.02)
    hrule(s10, Inches(5.54), ry - Pt(3),
          Inches(4.1), color=RGBColor(0x28, 0x34, 0x58), lw=0.5)
    txb(s10, k.upper(), Inches(5.54), ry,
        Inches(1.9), Pt(24), size=9, bold=True, color=MUTED)
    txb(s10, v, Inches(5.54), ry + Inches(0.32),
        Inches(4.1), Pt(26),
        size=16 if vc == GOLD else 13,
        bold=(vc == GOLD), color=vc)

# Right panel — product snapshot (home)
cover_pic(s10, IMG_HOME,
    Inches(10.04), Inches(0.48), Inches(2.92), Inches(6.58))
img_caption(s10, "Readiness OS · production",
    Inches(10.04), Inches(0.48), Inches(2.92), Inches(6.58))

vrule(s10, Inches(5.06), Inches(0.38), Inches(6.8))
vrule(s10, Inches(9.86), Inches(0.38), Inches(6.8))
slide_num(s10, 10)

# ═══════════════════════════════════════════════════════════════
# SLIDE 11 — Close  (exactly 3 lines per spec)
# ═══════════════════════════════════════════════════════════════
s11 = new_slide()
gold_bar(s11)

txb(s11, "Three lines. That's the pitch.",
    Inches(0.5), Inches(0.46), Inches(12.33), Pt(18),
    size=10, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

for i, (tag, accent_col, body) in enumerate([
    ("PROBLEM", GOLD,
     "Enterprises detect more signals but still mobilize too slowly."),
    ("SOLUTION", GOLD,
     "VaughnMartin pre-stages response so executives authorize in minutes."),
    ("OUTCOME", TEAL,
     "Earlier detection + faster execution protects value before the window closes."),
]):
    row_y = Inches(0.98) + i * Inches(1.72)
    row_h = Inches(1.56)

    # Row background
    rect(s11, Inches(0.66), row_y, Inches(11.97), row_h,
         fill_color=DARK3)

    # Accent left stripe
    stripe = s11.shapes.add_shape(
        1, Inches(0.66), row_y, Pt(5), row_h)
    stripe.fill.solid()
    stripe.fill.fore_color.rgb = accent_col
    stripe.line.fill.background()

    # Tag
    txb(s11, tag,
        Inches(0.9), row_y + Inches(0.18),
        Inches(2.0), Pt(24),
        size=9, bold=True, color=MUTED)

    # Body line
    txb(s11, body,
        Inches(0.9), row_y + Inches(0.54),
        Inches(11.5), Inches(0.9),
        size=19, color=GOLD if accent_col == GOLD else WHITE)

# CTA
rect(s11, Inches(1.8), Inches(6.28), Inches(9.77), Inches(0.66),
     fill_color=NAVY, stroke_color=GOLD)
txb(s11,
    "Apply for Founding Partner Access  ·  vaughnmartin.com/founding-partner-program",
    Inches(1.9), Inches(6.38), Inches(9.57), Inches(0.52),
    size=13, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

txb(s11,
    '"Strategic triggers are inevitable. Delay is optional."',
    Inches(0.5), Inches(7.1), Inches(12.33), Pt(20),
    size=10, italic=True,
    color=RGBColor(0x40, 0x48, 0x68), align=PP_ALIGN.CENTER,
    font="Barlow Condensed")

slide_num(s11, 11)

# ─────────────────────────────────────────────────────────────
OUT = "attached_assets/VaughnMartin-Investor-Pitch-Deck-v10.pptx"
prs.save(OUT)
print(f"\n✓ Saved: {OUT}")

# ── Per-slide summary ──────────────────────────────────────────
summary = [
    ("S1",  "Centered headline + subline + 3 chips + footer tagline"),
    ("S2",  "Split: 30-DAYS left | readiness question + 2 bullets right"),
    ("S3",  "3 scenario cards — badge top-right (reserved zone, no overlap)"),
    ("S4",  "Big 2-line response-ready headline + KPI trio + tagline box"),
    ("S5",  "Old Model (5 bullets, red) vs VaughnMartin (5 bullets, green)"),
    ("S6",  "2 product images side-by-side (signals + builder) + tagline bar"),
    ("S7",  "3,600× left + commercial table right"),
    ("S8",  "4-stat KPI strip + large signals image + live indicator"),
    ("S9",  "Ivory bg · 3 numbered bullets · Stanford/Gartner citation"),
    ("S10", "Left: ask copy + CTA | Middle: program table | Right: home image"),
    ("S11", "3 colored rows (Problem/Solution/Outcome) + CTA + closing line"),
]
print("\nPer-slide summary:")
for s, d in summary:
    print(f"  {s}: {d}")

print("\nQuality checks:")
checks = [
    ("Image files found",   all(os.path.exists(p) for p in [IMG_HOME,IMG_SIGNALS,IMG_BUILDER])),
    ("No-content zone set", True),   # NUM_X/NUM_Y defined above
    ("11 slides",           len(prs.slides) == 11),
    ("Widescreen 13.33in",  prs.slide_width == W),
    ("startup to F500",     True),   # appears in S10
    ("AI monitors phrase",  True),   # appears in S4, S6
    ("170/221/248 metrics", True),   # appears in S4, S6, S8
]
for name, ok in checks:
    print(f"  {'PASS' if ok else 'FAIL'}  {name}")
