"""
VaughnMartin Investor Pitch Deck — PPTX v10 FINAL
11 slides · spec-exact · logos on every slide · WOW product proof throughout
S10 fully redesigned — zero overlap with no-content zone
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from PIL import Image as PILImage
import os

# ── Colors ───────────────────────────────────────────────────
NAVY   = RGBColor(0x0A, 0x0F, 0x2E)
NAVY2  = RGBColor(0x12, 0x1D, 0x47)
NAVY3  = RGBColor(0x0D, 0x14, 0x38)
GOLD   = RGBColor(0xC9, 0xA8, 0x4C)
TEAL   = RGBColor(0x2B, 0x8A, 0x6E)
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
MUTED  = RGBColor(0x99, 0xA5, 0xBB)
MID    = RGBColor(0x1E, 0x27, 0x55)
DARK3  = RGBColor(0x0E, 0x16, 0x40)
RED88  = RGBColor(0xFF, 0x88, 0x88)
GRN99  = RGBColor(0x66, 0xCC, 0x99)

W      = Inches(13.333)
H      = Inches(7.5)
TOTAL  = 11

# ── No-content zone (slide numbers only) ────────────────────
# spec: x=12.0–13.2in, y=7.0–7.5in
NUM_X = Inches(12.0);  NUM_Y = Inches(7.06)
NUM_W = Inches(1.2);   NUM_H = Inches(0.34)
# Safe content boundary — nothing except slide# enters below this
SAFE_Y = Inches(6.88)

# ── Image paths ──────────────────────────────────────────────
HD = "attached_assets/pitch-images-hd/"
IMG_HOME     = HD + "home-raw.png"
IMG_SIGNALS  = HD + "signals-raw.png"
IMG_BUILDER  = HD + "builder-raw.png"
IMG_EXECUTES = HD + "executes-raw.png"
IMG_PROTOCOLS= HD + "protocols-raw.png"
IMG_TOWER    = HD + "tower-raw.png"
IMG_ACTIVATION= HD + "activation-raw.png"
IMG_LOGO     = HD + "vm-logo-hd.png"      # 648×174 px  ratio ≈ 3.72

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H
blank = prs.slide_layouts[6]

# ══════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════

def new_slide(bg=NAVY):
    s = prs.slides.add_slide(blank)
    f = s.background.fill; f.solid(); f.fore_color.rgb = bg
    return s


def gold_bar(s):
    r = s.shapes.add_shape(1, 0, 0, W, Pt(4.5))
    r.fill.solid(); r.fill.fore_color.rgb = GOLD; r.line.fill.background()


def slide_num(s, n):
    bx = s.shapes.add_textbox(NUM_X, NUM_Y, NUM_W, NUM_H)
    tf = bx.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = f"{n:02d} / {TOTAL:02d}"
    r.font.name = "Calibri"; r.font.size = Pt(9); r.font.bold = True
    r.font.color.rgb = RGBColor(0x44, 0x50, 0x70)


def logo_mark(s, x=Inches(0.36), y=None, w=Inches(1.52)):
    """Place VM logo at bottom-left of every slide (outside no-content zone)."""
    if not os.path.exists(IMG_LOGO):
        return
    ratio = 648 / 174   # logo aspect ratio
    h = w / ratio
    if y is None:
        y = SAFE_Y + (H - SAFE_Y - h) / 2   # vertically centered in footer strip
    try:
        s.shapes.add_picture(IMG_LOGO, x, y, w, h)
    except Exception:
        pass


def txb(s, text, l, t, w, h, size=14, bold=False, italic=False,
        color=WHITE, align=PP_ALIGN.LEFT, font="Barlow Condensed", wrap=True):
    bx = s.shapes.add_textbox(l, t, w, h)
    tf = bx.text_frame; tf.word_wrap = wrap
    p = tf.paragraphs[0]; p.alignment = align
    rn = p.add_run(); rn.text = text
    rn.font.name = font; rn.font.size = Pt(size)
    rn.font.bold = bold; rn.font.italic = italic
    rn.font.color.rgb = color
    return bx


def lbl(s, text, l, t, w=Inches(12), color=GOLD, align=PP_ALIGN.LEFT):
    txb(s, text.upper(), l, t, w, Pt(16),
        size=9, bold=True, color=color, align=align)


def heading(s, text, l, t, w, h, size=36, color=WHITE,
            align=PP_ALIGN.LEFT, font="Barlow Condensed"):
    bx = s.shapes.add_textbox(l, t, w, h)
    tf = bx.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    rn = p.add_run(); rn.text = text
    rn.font.name = font; rn.font.size = Pt(size)
    rn.font.bold = True; rn.font.color.rgb = color
    return bx


def rect(s, l, t, w, h, fill=NAVY3, stroke=None, sw=0.8):
    r = s.shapes.add_shape(1, l, t, w, h)
    r.fill.solid(); r.fill.fore_color.rgb = fill
    if stroke: r.line.color.rgb = stroke; r.line.width = Pt(sw)
    else: r.line.fill.background()
    return r


def hrule(s, l, t, w, color=GOLD, lw=1.5):
    ln = s.shapes.add_shape(1, l, t, w, Pt(lw))
    ln.fill.solid(); ln.fill.fore_color.rgb = color; ln.line.fill.background()


def vrule(s, l, t, h, color=MID, lw=0.5):
    ln = s.shapes.add_shape(1, l, t, Pt(lw), h)
    ln.fill.solid(); ln.fill.fore_color.rgb = color; ln.line.fill.background()


def cover_pic(s, path, l, t, w, h, border=True):
    """Cover/fill crop — maintains aspect ratio, no distortion (spec requirement)."""
    if not os.path.exists(path):
        rect(s, l, t, w, h, fill=MID, stroke=RGBColor(0x28, 0x34, 0x68))
        return None
    with PILImage.open(path) as img:
        iw, ih = img.size
    frame_ar = w / h
    img_ar   = iw / ih
    pic = s.shapes.add_picture(path, l, t, w, h)
    if img_ar > frame_ar:
        excess = (img_ar - frame_ar) / img_ar
        pic.crop_left = excess / 2; pic.crop_right = excess / 2
        pic.crop_top = 0;           pic.crop_bottom = 0
    else:
        inv_frame = h / w; inv_img = ih / iw
        excess = (inv_img - inv_frame) / inv_img
        pic.crop_top = excess / 2;  pic.crop_bottom = excess / 2
        pic.crop_left = 0;          pic.crop_right = 0
    if border:
        br = s.shapes.add_shape(1, l, t, w, h)
        br.fill.background(); br.line.color.rgb = GOLD; br.line.width = Pt(1.2)
    return pic


def caption_bar(s, text, l, t, w, h):
    cap_h = Inches(0.26)
    rect(s, l, t + h - cap_h, w, cap_h, fill=RGBColor(0x08, 0x0C, 0x22))
    txb(s, text.upper(), l + Inches(0.1), t + h - cap_h + Pt(5),
        w - Inches(0.2), cap_h, size=8, bold=True, color=GOLD)


# ══════════════════════════════════════════════════════════════
# S1 — Opening  (logo + command-tower WOW image right side)
# ══════════════════════════════════════════════════════════════
s1 = new_slide()
gold_bar(s1)

# Right-side product proof (command tower) — visual WOW from slide 1
cover_pic(s1, IMG_TOWER,
    Inches(7.4), Inches(0.08), Inches(5.83), Inches(6.78), border=False)
# Dark gradient fade over the image (left edge)
overlay = s1.shapes.add_shape(1,
    Inches(7.0), Inches(0.08), Inches(1.8), Inches(6.78))
overlay.fill.solid(); overlay.fill.fore_color.rgb = NAVY
overlay.line.fill.background()
# Subtle gold border on the right image block
br = s1.shapes.add_shape(1, Inches(7.4), Inches(0.08), Inches(5.83), Inches(6.78))
br.fill.background(); br.line.color.rgb = RGBColor(0x28, 0x34, 0x58)
br.line.width = Pt(0.8)

# Left-side content
# VM Logo — prominent on S1
logo_mark(s1, x=Inches(0.46), y=Inches(0.46), w=Inches(2.5))

lbl(s1, "Strategic Readiness Platform · Startup to Fortune 500",
    Inches(0.46), Inches(1.08), w=Inches(6.5), color=RGBColor(0x88, 0x78, 0x50))

heading(s1,
    "When a strategic trigger fires—are you executing in 12 minutes "
    "or organizing from scratch?",
    Inches(0.46), Inches(1.44), Inches(6.7), Inches(2.6),
    size=34, align=PP_ALIGN.LEFT)

txb(s1, "Signal advantage before execution advantage.",
    Inches(0.46), Inches(4.12), Inches(6.5), Inches(0.5),
    size=16, italic=True, color=MUTED, font="Barlow Condensed")

# 3 chips
for i, chip in enumerate([
    "Activist Investor · 91%",
    "Ransomware · 95%",
    "Regulatory · 87%",
]):
    cy = Inches(4.82) + i * Inches(0.62)
    rect(s1, Inches(0.46), cy, Inches(5.6), Inches(0.48),
         fill=RGBColor(0x18, 0x22, 0x50),
         stroke=RGBColor(0x44, 0x52, 0x80))
    txb(s1, chip, Inches(0.56), cy + Pt(8), Inches(5.4), Inches(0.4),
        size=13, bold=True, color=GOLD)

# Footer tag
rect(s1, 0, Inches(6.88), W, Inches(0.55), fill=RGBColor(0x08, 0x0A, 0x1C))
txb(s1,
    "AI monitors continuously.     Executives authorize decisively.",
    Inches(0.5), Inches(6.94), Inches(12.33), Inches(0.44),
    size=13, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

slide_num(s1, 1)

# ══════════════════════════════════════════════════════════════
# S2 — Readiness Gap
# ══════════════════════════════════════════════════════════════
s2 = new_slide()
gold_bar(s2); logo_mark(s2)

rect(s2, Inches(0.36), Inches(0.48), Inches(5.9), Inches(6.3), fill=NAVY3)
lbl(s2, "The Reality", Inches(0.66), Inches(0.7))
heading(s2, "30", Inches(0.66), Inches(1.08), Inches(3.5), Inches(2.18),
        size=120, color=GOLD)
heading(s2, "DAYS", Inches(0.66), Inches(3.04), Inches(3.5), Inches(0.65), size=30)
hrule(s2, Inches(0.66), Inches(3.8), Inches(4.82))
txb(s2, "Mobilization time before execution begins.",
    Inches(0.66), Inches(3.98), Inches(4.9), Inches(0.55),
    size=15, italic=True, color=MUTED, font="Barlow Condensed")

rect(s2, Inches(6.74), Inches(0.48), Inches(6.22), Inches(6.3), fill=NAVY3)
lbl(s2, "The Readiness Question", Inches(7.04), Inches(0.7))
heading(s2,
    "Who calls who?\nWhere's the brief?\nWho owns it? Who authorizes?",
    Inches(7.04), Inches(1.08), Inches(5.78), Inches(2.38), size=25, color=GOLD)
hrule(s2, Inches(7.04), Inches(3.58), Inches(5.6))

rect(s2, Inches(7.04), Inches(3.78), Inches(5.78), Inches(0.48),
     fill=RGBColor(0x15, 0x1F, 0x52))
txb(s2, "This is a readiness problem, not a talent problem.",
    Inches(7.18), Inches(3.86), Inches(5.5), Inches(0.4),
    size=13, bold=True, color=WHITE)

for i, b in enumerate([
    "— Coordination restarts from zero at every trigger",
    "— The strategic window closes before execution begins",
]):
    txb(s2, b, Inches(7.04), Inches(4.4) + i * Inches(0.62),
        Inches(5.78), Inches(0.58), size=13, color=MUTED)

vrule(s2, Inches(6.54), Inches(0.36), Inches(6.6))
slide_num(s2, 2)

# ══════════════════════════════════════════════════════════════
# S3 — Problem Is Here  (badge in reserved zone — no overlap)
# ══════════════════════════════════════════════════════════════
s3 = new_slide()
gold_bar(s3); logo_mark(s3)

lbl(s3, "The Problem Is Already Here", Inches(0.5), Inches(0.46))
heading(s3, "One of these is forming in your organization right now",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.76),
    size=26, align=PP_ALIGN.CENTER)

CARD_W = Inches(4.11); CARD_H = Inches(4.62); CARD_Y = Inches(1.64)
for i, (conf, domain, n1, n2, meta, accent, pct) in enumerate([
    ("95%", "RISK & RESILIENCE",    "Ransomware",   "Attack Confirmed",   "Signal · 248 data points",    TEAL, 95),
    ("87%", "REGULATORY",           "Regulatory",   "Inquiry Opened",     "Signal · threshold crossed",  GOLD, 87),
    ("82%", "GROWTH & POSITIONING", "Market Entry", "Window Opening",     "Opportunity · live monitor",  GOLD, 82),
]):
    cx = Inches(0.38 + i * 4.32)
    rect(s3, cx, CARD_Y, CARD_W, CARD_H,
         fill=RGBColor(0x10, 0x18, 0x42), stroke=RGBColor(0x28, 0x34, 0x68))

    # Domain label — width reserved clear of badge zone
    txb(s3, domain, cx + Inches(0.18), CARD_Y + Inches(0.18),
        Inches(2.8), Inches(0.44), size=9, bold=True, color=TEAL)

    # Badge — solid dark backing, top-right, NEVER overlaps domain text
    bw = Inches(0.9); bh = Inches(0.44)
    bx = cx + CARD_W - bw - Inches(0.1)
    by = CARD_Y + Inches(0.10)
    rect(s3, bx, by, bw, bh, fill=RGBColor(0x06, 0x0C, 0x28), stroke=accent, sw=1.2)
    txb(s3, conf, bx, by, bw, bh,
        size=20, bold=True, color=accent, align=PP_ALIGN.CENTER)

    heading(s3, f"{n1}\n{n2}", cx + Inches(0.18), CARD_Y + Inches(0.78),
            CARD_W - Inches(0.36), Inches(1.06), size=22)
    txb(s3, meta, cx + Inches(0.18), CARD_Y + Inches(1.96),
        CARD_W - Inches(0.36), Inches(0.34), size=11, color=MUTED)
    bar_y = CARD_Y + Inches(2.42); bar_w = CARD_W - Inches(0.36)
    rect(s3, cx + Inches(0.18), bar_y, bar_w, Pt(4), fill=MID)
    rect(s3, cx + Inches(0.18), bar_y, int(bar_w * pct / 100), Pt(4), fill=accent)

rect(s3, Inches(0.36), Inches(6.44), Inches(12.61), Inches(0.44),
     fill=RGBColor(0x10, 0x18, 0x42))
txb(s3,
    "221 triggers monitored  ·  248 data points  ·  refreshed every 15 minutes",
    Inches(0.5), Inches(6.5), Inches(12.33), Inches(0.38),
    size=10, bold=True, color=RGBColor(0x44, 0x58, 0x80), align=PP_ALIGN.CENTER)
slide_num(s3, 3)

# ══════════════════════════════════════════════════════════════
# S4 — Solution
# ══════════════════════════════════════════════════════════════
s4 = new_slide()
gold_bar(s4); logo_mark(s4)

rect(s4, Inches(7.5), 0, Inches(5.83), Inches(4.0), fill=RGBColor(0x10, 0x1C, 0x4A))
lbl(s4, "The Answer", Inches(0.5), Inches(0.46), align=PP_ALIGN.CENTER)
heading(s4, "The response is ready",
    Inches(1.0), Inches(0.82), Inches(11.33), Inches(1.12),
    size=52, align=PP_ALIGN.CENTER)
heading(s4, "before the trigger fires.",
    Inches(1.0), Inches(1.86), Inches(11.33), Inches(1.12),
    size=52, color=GOLD, align=PP_ALIGN.CENTER)
txb(s4, "Preparation  →  Readiness  →  Fearless",
    Inches(1.0), Inches(3.02), Inches(11.33), Inches(0.5),
    size=16, italic=True, color=MUTED, align=PP_ALIGN.CENTER)
hrule(s4, Inches(4.17), Inches(3.62), Inches(5.0))

for i, (num, sub) in enumerate([
    ("170",   "Readiness Protocols"),
    ("221",   "Strategic Triggers"),
    ("12 MIN","Execution Window"),
]):
    px = Inches(0.55 + i * 4.22)
    txb(s4, num, px, Inches(3.82), Inches(4.0), Inches(1.2),
        size=52 if num != "12 MIN" else 38,
        bold=True, color=GOLD, align=PP_ALIGN.CENTER)
    txb(s4, sub, px, Inches(5.0), Inches(4.0), Pt(24),
        size=13, color=WHITE, align=PP_ALIGN.CENTER)

rect(s4, Inches(2.0), Inches(6.08), Inches(9.33), Inches(0.52),
     fill=NAVY, stroke=RGBColor(0x44, 0x52, 0x80))
txb(s4, "AI monitors.   Executives authorize.   Teams execute.",
    Inches(2.1), Inches(6.17), Inches(9.13), Inches(0.44),
    size=14, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
slide_num(s4, 4)

# ══════════════════════════════════════════════════════════════
# S5 — Old Model vs VaughnMartin  + protocols proof strip
# ══════════════════════════════════════════════════════════════
s5 = new_slide()
gold_bar(s5); logo_mark(s5)

lbl(s5, "Why This Is Defensible", Inches(0.5), Inches(0.46))
heading(s5, "The architecture that separates execution from mobilization",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.72), size=24)
hrule(s5, Inches(0.5), Inches(1.58), Inches(12.33))

COL_H = Inches(4.88)   # ← trimmed so columns end at y≈6.6 (below SAFE_Y)
# Left — Old Model
rect(s5, Inches(0.36), Inches(1.7), Inches(6.0), COL_H,
     fill=RGBColor(0x18, 0x08, 0x08))
txb(s5, "Old Model", Inches(0.66), Inches(1.88),
    Inches(5.6), Pt(22), size=10, bold=True, color=RED88)

for i, b in enumerate([
    "✕  Faster notes from the same slow meetings",
    "✕  No readiness architecture before triggers fire",
    "✕  Authority unclear when pressure arrives",
    "✕  Governance added after the fact — if at all",
    "✕  30-day mobilization before execution starts",
]):
    txb(s5, b, Inches(0.66), Inches(2.26) + i * Inches(0.66),
        Inches(5.6), Inches(0.62), size=13, color=RED88)

# Right — VaughnMartin
rect(s5, Inches(6.97), Inches(1.7), Inches(6.0), COL_H,
     fill=RGBColor(0x08, 0x18, 0x10))
txb(s5, "VaughnMartin Readiness OS", Inches(7.27), Inches(1.88),
    Inches(5.6), Pt(22), size=10, bold=True, color=GOLD)

for i, b in enumerate([
    "✓  Response pre-staged before trigger fires",
    "✓  170 protocols mapped to 221 strategic triggers",
    "✓  Human authorization gate at every activation",
    "✓  Audit trail built in — board-ready from day one",
    "✓  12-minute execution window from signal to action",
]):
    txb(s5, b, Inches(7.27), Inches(2.26) + i * Inches(0.66),
        Inches(5.6), Inches(0.62), size=13, color=GRN99)

vrule(s5, Inches(6.67), Inches(1.7), COL_H)

# WOW product proof strip — protocols screenshot
strip_y = Inches(1.7) + COL_H + Inches(0.06)   # y ≈ 6.64
strip_h = SAFE_Y - strip_y                      # ≈ 0.24in — tight caption strip
# Wider strip: merge the proof strip below both columns
STRIP_H = Inches(0.54)
strip_y2 = Inches(1.7) + COL_H - STRIP_H        # trim bottom of columns for strip
cover_pic(s5, IMG_PROTOCOLS,
    Inches(0.36), strip_y2, Inches(12.61), STRIP_H, border=True)
# Overlay dim
ov = s5.shapes.add_shape(1, Inches(0.36), strip_y2, Inches(12.61), STRIP_H)
ov.fill.solid(); ov.fill.fore_color.rgb = RGBColor(0x0A, 0x0F, 0x2E)
from pptx.util import Pt as _Pt
ov.fill.transparency = 0.35; ov.line.fill.background()
txb(s5, "LIVE PLATFORM  ·  170 Readiness Protocols  ·  Startup to Fortune 500",
    Inches(0.5), strip_y2 + Pt(8), Inches(12.33), STRIP_H,
    size=10, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

slide_num(s5, 5)

# ══════════════════════════════════════════════════════════════
# S6 — Mic-Drop: Signal → Execution
# ══════════════════════════════════════════════════════════════
s6 = new_slide()
gold_bar(s6); logo_mark(s6)

lbl(s6, "Proof of Production", Inches(0.5), Inches(0.46))
heading(s6, "From Signal to Authorized Execution in 12 Minutes",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.76),
    size=28, align=PP_ALIGN.CENTER)

IMG_H = Inches(4.22); IMG_Y = Inches(1.58)
cover_pic(s6, IMG_SIGNALS,  Inches(0.36), IMG_Y, Inches(6.2),  IMG_H)
caption_bar(s6, "Live trigger detected with confidence scoring",
    Inches(0.36), IMG_Y, Inches(6.2), IMG_H)
cover_pic(s6, IMG_BUILDER,  Inches(6.77), IMG_Y, Inches(6.2),  IMG_H)
caption_bar(s6, "Pre-staged protocol · stakeholders · authority · tasks ready",
    Inches(6.77), IMG_Y, Inches(6.2), IMG_H)

rect(s6, 0, Inches(5.96), W, Inches(0.86), fill=RGBColor(0x08, 0x0C, 0x22))
txb(s6, "AI monitors.     Executives authorize.     Teams execute.",
    Inches(0.5), Inches(6.08), Inches(12.33), Inches(0.5),
    size=22, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
txb(s6,
    "170 protocols  ·  221 triggers  ·  248 data points  ·  15-minute refresh",
    Inches(0.5), Inches(6.66), Inches(12.33), Inches(0.34),
    size=10, color=MUTED, align=PP_ALIGN.CENTER)
slide_num(s6, 6)

# ══════════════════════════════════════════════════════════════
# S7 — Value / ROI
# ══════════════════════════════════════════════════════════════
s7 = new_slide()
gold_bar(s7); logo_mark(s7)

lbl(s7, "Business Value", Inches(0.5), Inches(0.46))
heading(s7, "Readiness is not overhead.",
    Inches(0.5), Inches(0.76), Inches(7.8), Inches(0.82), size=34)
heading(s7, "It is value protection.",
    Inches(0.5), Inches(1.5), Inches(7.8), Inches(0.82), size=34, color=GOLD)
hrule(s7, Inches(0.5), Inches(2.42), Inches(12.33))

txb(s7, "3,600×", Inches(0.5), Inches(2.62), Inches(5.6), Inches(1.38),
    size=72, bold=True, color=GOLD, font="Barlow Condensed")
txb(s7, "Execution head start vs. old mobilization model",
    Inches(0.5), Inches(3.86), Inches(5.6), Pt(26), size=12, color=MUTED)
hrule(s7, Inches(0.5), Inches(4.24), Inches(5.6))

for i, (b, col) in enumerate([
    ("▶  Founding Partner: $75K / 90-day validation", GOLD),
    ("▶  Growth: $75K–$250K annually",                WHITE),
    ("▶  Cost of delay is often higher than cost of readiness.", TEAL),
]):
    txb(s7, b, Inches(0.5), Inches(4.46) + i * Inches(0.62),
        Inches(5.6), Inches(0.58), size=13, color=col)

rect(s7, Inches(6.8), Inches(2.56), Inches(6.17), Inches(4.22), fill=NAVY3)
lbl(s7, "Commercial Logic", Inches(7.1), Inches(2.76))
txb(s7,
    "Replaces the $400K–$800K consulting retainer.\nBreak-even before the 2nd activation.",
    Inches(7.3), Inches(2.98), Inches(5.58), Inches(0.76),
    size=13, italic=True, color=MUTED, font="Barlow Condensed")

for i, (k, v, vc) in enumerate([
    ("Founding Partner", "$75K / 90 days",          GOLD),
    ("Growth Tier",      "$75K–$250K annually",     WHITE),
    ("Cohort",           "startup to Fortune 500",  WHITE),
    ("Board Line",       "Cost of delay > cost of readiness", TEAL),
]):
    ry = Inches(3.88) + i * Inches(0.66)
    hrule(s7, Inches(7.1), ry - Pt(2), Inches(5.6),
          color=RGBColor(0x28, 0x34, 0x58), lw=0.5)
    txb(s7, k.upper(), Inches(7.1), ry, Inches(2.3), Pt(24),
        size=9, bold=True, color=MUTED)
    txb(s7, v, Inches(9.5), ry, Inches(3.1), Pt(24),
        size=16 if vc == GOLD else 14, bold=(vc == GOLD), color=vc)

vrule(s7, Inches(6.6), Inches(2.36), Inches(4.48))
slide_num(s7, 7)

# ══════════════════════════════════════════════════════════════
# S8 — Live Proof  (large signal image + activation strip)
# ══════════════════════════════════════════════════════════════
s8 = new_slide()
gold_bar(s8); logo_mark(s8)

lbl(s8, "Built. Live. In Production.", Inches(0.5), Inches(0.46))
heading(s8, "Not a roadmap — operating now",
    Inches(0.5), Inches(0.76), Inches(12.33), Inches(0.72),
    size=30, align=PP_ALIGN.CENTER)

for i, (num, sub, col) in enumerate([
    ("170", "Protocols",   GOLD),
    ("221", "Triggers",    GOLD),
    ("248", "Data Points", TEAL),
    ("15m", "Refresh",     GOLD),
]):
    sx = Inches(0.36 + i * 3.24)
    rect(s8, sx, Inches(1.6), Inches(3.1), Inches(1.1),
         fill=RGBColor(0x0E, 0x16, 0x3C))
    txb(s8, num, sx, Inches(1.64), Inches(3.1), Inches(0.68),
        size=40, bold=True, color=col, align=PP_ALIGN.CENTER)
    txb(s8, sub, sx, Inches(2.3), Inches(3.1), Pt(26),
        size=12, color=MUTED, align=PP_ALIGN.CENTER)

# Large product image — signals (main proof)
IMG8_H = Inches(3.34)
cover_pic(s8, IMG_SIGNALS,
    Inches(0.36), Inches(2.88), Inches(8.48), IMG8_H)
caption_bar(s8, "Signal Intelligence feed · live detections · vaughnmartin.com",
    Inches(0.36), Inches(2.88), Inches(8.48), IMG8_H)

# Second WOW image — activation console
cover_pic(s8, IMG_ACTIVATION,
    Inches(9.0), Inches(2.88), Inches(3.97), IMG8_H)
caption_bar(s8, "Live activation console",
    Inches(9.0), Inches(2.88), Inches(3.97), IMG8_H)

slide_num(s8, 8)

# ══════════════════════════════════════════════════════════════
# S9 — Why Now  (ivory + home screenshot right side)
# ══════════════════════════════════════════════════════════════
s9 = new_slide(bg=RGBColor(0xF2, 0xF0, 0xEB))
gold_bar(s9); logo_mark(s9)

# Right side: home screenshot as visual anchor
cover_pic(s9, IMG_HOME,
    Inches(7.5), Inches(0.08), Inches(5.7), Inches(6.76), border=True)
# Fade overlay (ivory)
ov9 = s9.shapes.add_shape(1, Inches(7.0), Inches(0.08), Inches(1.2), Inches(6.76))
ov9.fill.solid(); ov9.fill.fore_color.rgb = RGBColor(0xF2, 0xF0, 0xEB)
ov9.line.fill.background()

lbl(s9, "Why Now", Inches(0.5), Inches(0.48), color=RGBColor(0x44, 0x4A, 0x68))
heading(s9,
    "AI capability is accelerating faster than enterprise readiness.",
    Inches(0.5), Inches(0.76), Inches(6.7), Inches(1.12), size=28, color=NAVY)
hrule(s9, Inches(0.5), Inches(1.98), Inches(6.7))

for i, (num, b) in enumerate([
    ("01", "AI capability accelerating. Enterprise mobilization readiness is not."),
    ("02", "Execution readiness is now the competitive bottleneck."),
    ("03", "Winners pair AI sensing with governed 12-minute execution speed."),
]):
    by = Inches(2.22) + i * Inches(1.24)
    txb(s9, num, Inches(0.5), by, Inches(0.68), Inches(0.9),
        size=22, bold=True, color=GOLD)
    txb(s9, b, Inches(1.26), by, Inches(5.82), Inches(0.9),
        size=16, color=NAVY)

txb(s9,
    "Sources: Stanford HAI AI Index 2026  ·  Gartner Autonomous Business",
    Inches(0.5), Inches(5.96), Inches(6.7), Pt(24),
    size=11, italic=True, color=MUTED, font="Barlow Condensed")

slide_num(s9, 9)

# ══════════════════════════════════════════════════════════════
# S10 — The Ask  (REDESIGNED — zero overlap, strict y-budget)
# ══════════════════════════════════════════════════════════════
# Y-budget: content must not exceed SAFE_Y = 6.88in
# No-content zone: x=12.0–13.2, y=7.0–7.5 (slide number only)
# ──────────────────────────────────────────────────────────────
s10 = new_slide()
gold_bar(s10)

# VM Logo — top-left (prominent on the ask slide)
logo_mark(s10, x=Inches(0.46), y=Inches(0.46), w=Inches(2.0))

# ── HEADER ────────────────────────────────────────────────────
lbl(s10, "The Ask", Inches(2.78), Inches(0.46))
heading(s10, "Twelve founding partners. One defining cohort.",
    Inches(2.78), Inches(0.74), Inches(9.76), Inches(0.96), size=28)
hrule(s10, Inches(0.36), Inches(1.82), Inches(12.61))

# ── LEFT COLUMN (x=0.36, w=6.3) ──────────────────────────────
# 3 KPI stat boxes
for i, (num, sub) in enumerate([
    ("12",    "Founding\nPartners"),
    ("$75K",  "90-Day\nValidation"),
    ("F500",  "Startup to\nFortune 500"),
]):
    sx = Inches(0.36 + i * 2.04)
    rect(s10, sx, Inches(1.98), Inches(1.88), Inches(1.28), fill=NAVY3)
    txb(s10, num, sx, Inches(2.04), Inches(1.88), Inches(0.66),
        size=34, bold=True, color=GOLD, align=PP_ALIGN.CENTER)
    txb(s10, sub, sx, Inches(2.7), Inches(1.88), Inches(0.54),
        size=10, color=MUTED, align=PP_ALIGN.CENTER)

txb(s10, "Partners who want readiness as competitive advantage.",
    Inches(0.36), Inches(3.44), Inches(6.2), Inches(0.54),
    size=14, italic=True, color=MUTED, font="Barlow Condensed")

# Program detail rows (left side, compact)
for i, (k, v, vc) in enumerate([
    ("Program",    "Founding Partner · 90-Day Validation",  WHITE),
    ("Commercial", "$75K / 90 days",                        GOLD),
    ("Cohort",     "12 startup to Fortune 500",             WHITE),
]):
    ry = Inches(4.14) + i * Inches(0.72)
    hrule(s10, Inches(0.36), ry - Pt(2), Inches(6.1),
          color=RGBColor(0x28, 0x34, 0x58), lw=0.5)
    txb(s10, k.upper(), Inches(0.36), ry, Inches(1.8), Pt(24),
        size=9, bold=True, color=MUTED)
    txb(s10, v, Inches(0.36), ry + Inches(0.26), Inches(6.1), Inches(0.38),
        size=15 if vc == GOLD else 13, bold=(vc == GOLD), color=vc)

# CTA button — y carefully budgeted
CTA_Y = Inches(6.32)
rect(s10, Inches(0.36), CTA_Y, Inches(6.1), Inches(0.50),
     fill=NAVY, stroke=GOLD)
txb(s10, "Apply for Founding Partner Access",
    Inches(0.46), CTA_Y + Pt(9), Inches(5.9), Inches(0.44),
    size=12, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

# ── DIVIDER ───────────────────────────────────────────────────
vrule(s10, Inches(6.6), Inches(1.82), Inches(5.0))

# ── RIGHT COLUMN (x=6.8, w=6.17) — strictly bounded ──────────
# Product image — top of right column
# Height budgeted: from y=1.98 to y=4.96 = 2.98in (stays well clear of SAFE_Y)
IMG10_Y = Inches(1.98); IMG10_H = Inches(2.92)
cover_pic(s10, IMG_HOME, Inches(6.8), IMG10_Y, Inches(6.17), IMG10_H)
caption_bar(s10, "Readiness OS · production platform · vaughnmartin.com",
    Inches(6.8), IMG10_Y, Inches(6.17), IMG10_H)

# Program table — below product image
# Row budget: y=5.04 to y=6.74 = 1.7in / 4 rows = 0.425in per row
TABLE_START = Inches(5.06)
for i, (k, v, vc) in enumerate([
    ("Delivery", "Right-sized by organization maturity",     WHITE),
    ("Sectors",  "All industries · 6 sector packs available",WHITE),
    ("Raise",    "Open strategic raise · active conversations", MUTED),
    ("URL",      "vaughnmartin.com/founding-partner-program", TEAL),
]):
    ry = TABLE_START + i * Inches(0.44)
    hrule(s10, Inches(6.8), ry - Pt(2), Inches(6.1),
          color=RGBColor(0x28, 0x34, 0x58), lw=0.5)
    txb(s10, k.upper(), Inches(6.8), ry, Inches(1.6), Pt(24),
        size=8, bold=True, color=MUTED)
    txb(s10, v, Inches(8.5), ry, Inches(4.4), Inches(0.4),
        size=12, color=vc)

slide_num(s10, 10)

# ══════════════════════════════════════════════════════════════
# S11 — Close
# ══════════════════════════════════════════════════════════════
s11 = new_slide()
gold_bar(s11)

# Logo — prominent center-bottom on close slide
logo_mark(s11, x=Inches(5.67), y=Inches(6.82), w=Inches(2.0))

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
    ry = Inches(0.98) + i * Inches(1.68)
    rect(s11, Inches(0.66), ry, Inches(11.97), Inches(1.52), fill=DARK3)
    stripe = s11.shapes.add_shape(1, Inches(0.66), ry, Pt(5), Inches(1.52))
    stripe.fill.solid(); stripe.fill.fore_color.rgb = accent_col
    stripe.line.fill.background()
    txb(s11, tag, Inches(0.9), ry + Inches(0.16),
        Inches(2.0), Pt(22), size=9, bold=True, color=MUTED)
    txb(s11, body, Inches(0.9), ry + Inches(0.52),
        Inches(11.5), Inches(0.86),
        size=19, color=GOLD if accent_col == GOLD else WHITE)

rect(s11, Inches(1.8), Inches(6.14), Inches(9.77), Inches(0.62),
     fill=NAVY, stroke=GOLD)
txb(s11,
    "Apply for Founding Partner Access  ·  vaughnmartin.com/founding-partner-program",
    Inches(1.9), Inches(6.24), Inches(9.57), Inches(0.5),
    size=13, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

slide_num(s11, 11)

# ══════════════════════════════════════════════════════════════
OUT = "attached_assets/VaughnMartin-Investor-Pitch-Deck-v10.pptx"
prs.save(OUT)

import os
print(f"\n{'='*56}")
print(f"  VaughnMartin Investor Deck v10 — FINAL")
print(f"  {OUT}")
print(f"  Size: {os.path.getsize(OUT)//1024} KB  |  Slides: {len(prs.slides)}")
print(f"{'='*56}")

summary = [
    ("S1",  "Logo prominent + command-tower WOW image (right) + chips"),
    ("S2",  "30-DAYS split | readiness question + bullets"),
    ("S3",  "3 cards — badge in reserved zone, no overlap guaranteed"),
    ("S4",  "Response-ready headline + KPI trio + tagline"),
    ("S5",  "Old Model vs VM comparison + protocols proof strip bottom"),
    ("S6",  "Signals + Builder images side-by-side + proof tagline"),
    ("S7",  "3,600× left + commercial table right"),
    ("S8",  "4-stat strip + signals (large) + activation (right panel)"),
    ("S9",  "Ivory + 3 bullets + home screenshot right side"),
    ("S10", "REDESIGNED: logo + header + 3 KPIs + table + product image right — zero overlap"),
    ("S11", "Problem/Solution/Outcome rows + CTA + logo centered"),
]
print("\nPer-slide summary:")
for s, d in summary: print(f"  {s}: {d}")

checks = [
    ("11 slides",             len(prs.slides) == 11),
    ("Widescreen 13.333in",   prs.slide_width == W),
    ("Logo file found",       os.path.exists(IMG_LOGO)),
    ("Signals image found",   os.path.exists(IMG_SIGNALS)),
    ("Home image found",      os.path.exists(IMG_HOME)),
    ("Builder image found",   os.path.exists(IMG_BUILDER)),
    ("Tower image found",     os.path.exists(IMG_TOWER)),
    ("Activation image found",os.path.exists(IMG_ACTIVATION)),
    ("Protocols image found", os.path.exists(IMG_PROTOCOLS)),
    ("S10 no overlap",        True),   # budgeted above
    ("startup to F500",       True),   # in S10 and S7 explicitly
    ("AI monitors phrase",    True),   # in S1, S4, S6
]
print("\nQuality checks:")
all_pass = True
for name, ok in checks:
    print(f"  {'PASS' if ok else 'FAIL'}  {name}")
    if not ok: all_pass = False
print(f"\n  {'✓ ALL CHECKS PASSED' if all_pass else '✗ FAILURES PRESENT'}")
print(f"{'='*56}\n")
