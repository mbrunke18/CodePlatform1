"""
VaughnMartin Investor Pitch Deck — PDF builder (v10 final, 11 slides)
Matches VaughnMartin-Investor-Pitch-Deck-v10.html exactly.
"""
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
import os

OUT = "attached_assets/VaughnMartin-Investor-Pitch-Deck-v10.pdf"
PW  = 13.33 * inch
PH  = 7.5  * inch
TOTAL = 11

NAVY  = colors.HexColor("#0A0F2E")
GOLD  = colors.HexColor("#C9A84C")
TEAL  = colors.HexColor("#2B8A6E")
IVORY = colors.HexColor("#F0EDE4")
WHITE = colors.white
MUTED = colors.HexColor("#99A5BB")
DARK2 = colors.HexColor("#121A44")
DARK3 = colors.HexColor("#0E1640")
MID   = colors.HexColor("#1E2755")
RED   = colors.HexColor("#FF5050")
NAVY2 = colors.HexColor("#0D1438")
NAVY3 = colors.HexColor("#0F163C")

c = rl_canvas.Canvas(OUT, pagesize=(PW, PH))
c.setTitle("VaughnMartin Readiness OS — Investor Pitch Deck v10")
c.setAuthor("VaughnMartin")
c.setSubject("Founding Partner Program · Startup to Fortune 500")

# ── Helpers ────────────────────────────────────────────────────
def navy_bg():
    c.setFillColor(NAVY); c.rect(0, 0, PW, PH, fill=1, stroke=0)

def ivory_bg():
    c.setFillColor(colors.HexColor("#F2F0EB")); c.rect(0, 0, PW, PH, fill=1, stroke=0)

def gold_bar():
    c.setFillColor(GOLD); c.rect(0, PH - 4, PW, 4, fill=1, stroke=0)

def lbl(text, x, y, col=GOLD, size=9):
    c.setFillColor(col); c.setFont("Helvetica-Bold", size)
    c.drawString(x, y, text.upper())

def fill_rect(x, y, w, h, col=DARK2, stroke_col=None, sw=0.8):
    c.setFillColor(col); c.rect(x, y, w, h, fill=1, stroke=0)
    if stroke_col:
        c.setStrokeColor(stroke_col); c.setLineWidth(sw)
        c.rect(x, y, w, h, fill=0, stroke=1)

def rule_h(x, y, w=4*inch, col=GOLD, lw=1.5):
    c.setStrokeColor(col); c.setLineWidth(lw); c.line(x, y, x + w, y)

def rule_v(x, y1, y2, col=MID, lw=0.5):
    c.setStrokeColor(col); c.setLineWidth(lw); c.line(x, y1, x, y2)

def body_wrap(text, x, y, col=WHITE, size=13, maxw=5 * inch, lh=None):
    if lh is None: lh = size * 1.45
    words = text.split(); lines = []; line = ""
    for w in words:
        t = (line + " " + w).strip()
        if c.stringWidth(t, "Helvetica", size) <= maxw: line = t
        else:
            if line: lines.append(line)
            line = w
    if line: lines.append(line)
    c.setFillColor(col); c.setFont("Helvetica", size)
    for i, ln in enumerate(lines):
        c.drawString(x, y - i * lh, ln)

def img_hero(path, x, y, w, h):
    if os.path.exists(path):
        try:
            c.drawImage(ImageReader(path), x, y, width=w, height=h,
                        preserveAspectRatio=True, mask="auto")
        except Exception as e:
            print(f"  img warn: {e}")
    c.setStrokeColor(GOLD); c.setLineWidth(1.2)
    c.rect(x, y, w, h, fill=0, stroke=1)

def framed_img(path, x, y, w, h, caption=None):
    img_hero(path, x, y, w, h)
    if caption:
        fill_rect(x, y, w, 0.26 * inch, col=colors.HexColor("#080D26"))
        c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 0.1 * inch, y + 0.08 * inch, caption.upper())

def slide_num(n):
    c.setFillColor(colors.HexColor("#444E70")); c.setFont("Helvetica-Bold", 9)
    c.drawRightString(PW - 0.3 * inch, 0.22 * inch, f"{n:02d} / {TOTAL:02d}")

# ══════════════════════════════════════════════════════════════
# SLIDE 1 — Opening
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("VaughnMartin \u00b7 Readiness OS", PW / 2, PH - 0.66 * inch,
    col=colors.HexColor("#998060"), size=9)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 40)
c.drawCentredString(PW / 2, PH - 1.38 * inch,
    "When a strategic trigger fires in your organization\u2014")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 34)
c.drawCentredString(PW / 2, PH - 2.1 * inch,
    "are you executing in 12 minutes or organizing from scratch?")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 16)
c.drawCentredString(PW / 2, PH - 2.72 * inch,
    "Signal advantage before execution advantage.")

for i, chip in enumerate(["Activist Investor \u00b7 91%", "Ransomware \u00b7 95%", "Regulatory Inquiry \u00b7 87%"]):
    cx = 1.3 * inch + i * 3.55 * inch
    fill_rect(cx, PH - 3.68 * inch, 3.3 * inch, 0.44 * inch,
        col=colors.HexColor("#182250"), stroke_col=colors.HexColor("#445280"))
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(cx + 1.65 * inch, PH - 3.42 * inch, chip)

fill_rect(0, 0.55 * inch, PW, 0.52 * inch, col=colors.HexColor("#08091A"))
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 12)
c.drawCentredString(PW / 2, 0.76 * inch,
    "AI monitors continuously.   Executives authorize decisively.")
slide_num(1); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 2 — Readiness Question
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()

fill_rect(0.35 * inch, 0.42 * inch, 5.85 * inch, PH - 0.84 * inch, col=NAVY2)
lbl("The Reality", 0.65 * inch, PH - 0.72 * inch)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 110)
c.drawString(0.65 * inch, PH - 2.62 * inch, "30")
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawString(0.65 * inch, PH - 3.18 * inch, "DAYS")
rule_h(0.65 * inch, PH - 3.6 * inch, 4.7 * inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 14)
c.drawString(0.65 * inch, PH - 3.9 * inch, "Mobilization time before any execution begins.")

fill_rect(6.6 * inch, 0.42 * inch, 6.38 * inch, PH - 0.84 * inch, col=NAVY2)
lbl("The Readiness Question", 6.9 * inch, PH - 0.72 * inch)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 24)
for j, ln in enumerate(["Who calls who?", "Where's the brief?", "Who owns it? Who authorizes?"]):
    c.drawString(6.9 * inch, PH - 1.45 * inch - j * 0.52 * inch, ln)

rule_h(6.9 * inch, PH - 3.2 * inch, 5.5 * inch)

fill_rect(6.9 * inch, PH - 3.7 * inch, 5.7 * inch, 0.45 * inch,
    col=colors.HexColor("#151F52"))
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 12)
c.drawString(7.05 * inch, PH - 3.48 * inch,
    "This is a readiness problem, not a talent problem.")

c.setFillColor(MUTED); c.setFont("Helvetica", 13)
c.drawString(6.9 * inch, PH - 4.3 * inch,
    "\u2014  Coordination restarts from zero at every trigger")
c.drawString(6.9 * inch, PH - 4.68 * inch,
    "\u2014  The strategic window closes before execution begins")

rule_v(6.4 * inch, 0.3 * inch, PH - 0.3 * inch)
slide_num(2); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 3 — Problem Is Already Here
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("The Problem Is Already Here", 0.45 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 24)
c.drawCentredString(PW / 2, PH - 1.2 * inch,
    "One of these is forming in your organization right now")

for i, (conf, domain, name, meta, accent, pct) in enumerate([
    ("95%", "RISK & RESILIENCE",   "Ransomware\nAttack Confirmed",  "Signal detected \u00b7 248 data points",  TEAL, 95),
    ("87%", "REGULATORY",          "Regulatory\nInquiry Opened",    "Signal detected \u00b7 threshold crossed", GOLD, 87),
    ("82%", "GROWTH & POSITIONING","Market Entry\nWindow Opening",  "Opportunity signal \u00b7 live monitoring",GOLD, 82),
]):
    cx = 0.38 * inch + i * 4.32 * inch; cy = PH - 4.9 * inch
    fill_rect(cx, cy, 4.1 * inch, 3.5 * inch, col=colors.HexColor("#10184A"),
        stroke_col=colors.HexColor("#283468"))
    c.setFillColor(accent); c.setFont("Helvetica-Bold", 20)
    c.drawRightString(cx + 3.9 * inch, cy + 3.5 * inch - 0.42 * inch, conf)
    lbl(domain, cx + 0.18 * inch, cy + 3.5 * inch - 0.42 * inch, col=TEAL, size=8)
    c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 18)
    for j, ln in enumerate(name.split("\n")):
        c.drawString(cx + 0.18 * inch, cy + 2.72 * inch - j * 0.3 * inch, ln)
    c.setFillColor(MUTED); c.setFont("Helvetica", 11)
    c.drawString(cx + 0.18 * inch, cy + 0.92 * inch, meta)
    fill_rect(cx + 0.18 * inch, cy + 0.58 * inch, 3.74 * inch, 0.05 * inch,
        col=MID)
    fill_rect(cx + 0.18 * inch, cy + 0.58 * inch, 3.74 * pct / 100 * inch, 0.05 * inch,
        col=accent)

fill_rect(0.38 * inch, 0.45 * inch, PW - 0.76 * inch, 0.44 * inch,
    col=colors.HexColor("#101842"))
c.setFillColor(colors.HexColor("#445880")); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW / 2, 0.64 * inch,
    "221 triggers monitored  \u00b7  248 data points  \u00b7  refreshed every 15 minutes")
slide_num(3); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 4 — Solution
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
fill_rect(7.5 * inch, PH - 4.0 * inch, 5.83 * inch, 4.0 * inch,
    col=colors.HexColor("#101C4A"))
lbl("The Answer", PW / 2, PH - 0.68 * inch,
    col=colors.HexColor("#998060"), size=9)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 52)
c.drawCentredString(PW / 2, PH - 1.52 * inch, "The response is ready")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 52)
c.drawCentredString(PW / 2, PH - 2.32 * inch, "before the trigger fires.")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 16)
c.drawCentredString(PW / 2, PH - 2.95 * inch, "Preparation  \u2192  Readiness  \u2192  Fearless")

for i, (num, sub) in enumerate([
    ("170", "Readiness Protocols"),
    ("221", "Strategic Triggers"),
    ("12 MIN", "Execution Window"),
]):
    px = 0.4 * inch + i * 4.3 * inch
    rule_h(px, PH - 3.6 * inch, 4.1 * inch)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 52 if num != "12 MIN" else 38)
    c.drawCentredString(px + 2.05 * inch, PH - 4.52 * inch, num)
    c.setFillColor(WHITE); c.setFont("Helvetica", 13)
    c.drawCentredString(px + 2.05 * inch, PH - 4.85 * inch, sub)

fill_rect(2.0 * inch, 0.68 * inch, 9.33 * inch, 0.5 * inch,
    col=NAVY, stroke_col=colors.HexColor("#445280"))
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 13)
c.drawCentredString(PW / 2, 0.87 * inch,
    "AI monitors.   Executives authorize.   Teams execute.")
slide_num(4); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 5 — Moat (4 pillars)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("Why This Is Defensible", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 26)
c.drawString(0.5 * inch, PH - 1.2 * inch,
    "Built into the architecture \u2014 not bolted on")

pdata = [
    ("[ ]", "Pre-Staged Protocols",
     ["170 protocols ready before the trigger fires.", "Zero ramp-up. Zero coordination delay."]),
    (" \u2192 ", "Trigger-to-Protocol Mapping",
     ["221 triggers mapped to exact protocol,", "stakeholders, and tasks. Detection becomes execution."]),
    (" \u25cb ", "Human Authorization Gate",
     ["No protocol activates without executive sign-off.", "Decision velocity preserved. Human authority intact."]),
    (" \u25a0 ", "Audit & Governance Layer",
     ["Every activation logged, attributed,", "and board-reportable. Governance built in."]),
]
pw4 = 2.98 * inch; ph4 = 3.92 * inch; py4 = PH - 5.38 * inch
for i, (icon, title, body_lines) in enumerate(pdata):
    px4 = 0.38 * inch + i * 3.18 * inch
    fill_rect(px4, py4, pw4, ph4, col=NAVY3, stroke_col=colors.HexColor("#283460"))
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 16)
    c.drawString(px4 + 0.2 * inch, py4 + ph4 - 0.52 * inch, icon)
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 10)
    c.drawString(px4 + 0.2 * inch, py4 + ph4 - 0.92 * inch, title.upper())
    c.setFillColor(MUTED); c.setFont("Helvetica", 12)
    for j, ln in enumerate(body_lines):
        c.drawString(px4 + 0.2 * inch, py4 + ph4 - 1.5 * inch - j * 0.24 * inch, ln)

fill_rect(0.38 * inch, 0.42 * inch, PW - 0.76 * inch, 0.68 * inch,
    col=colors.HexColor("#0A1030"), stroke_col=colors.HexColor("#283460"))
c.setFillColor(MUTED); c.setFont("Helvetica", 12)
c.drawCentredString(PW / 2, 0.7 * inch,
    "Three years to build. Proprietary IDEA Framework. The orchestration layer above the Microsoft stack.")
slide_num(5); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 6 — Mic-Drop
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("Proof of Production", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 26)
c.drawCentredString(PW / 2, PH - 1.22 * inch,
    "From Signal to Authorized Execution in 12 Minutes")

framed_img("screenshots/deck_signals.jpg",
    0.35 * inch, PH - 5.6 * inch, 6.27 * inch, 4.18 * inch,
    "Live trigger detected with confidence scoring")
framed_img("screenshots/pptx_how_executes.jpg",
    6.71 * inch, PH - 5.6 * inch, 6.27 * inch, 4.18 * inch,
    "Pre-staged protocol, stakeholders, authority & tasks ready before pressure")

fill_rect(0, PH - 6.62 * inch, PW, 0.82 * inch, col=colors.HexColor("#080D26"))
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 19)
c.drawCentredString(PW / 2, PH - 6.28 * inch,
    "AI monitors.   Executives authorize.   Teams execute.")
c.setFillColor(MUTED); c.setFont("Helvetica", 10)
c.drawCentredString(PW / 2, PH - 7.1 * inch,
    "170 protocols  \u00b7  221 triggers  \u00b7  248 data points  \u00b7  refreshed every 15 minutes")
slide_num(6); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 7 — Business Value / ROI
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("Business Value", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 34)
c.drawString(0.5 * inch, PH - 1.42 * inch, "Readiness is not overhead.")
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 34)
c.drawString(0.5 * inch, PH - 1.98 * inch, "It is value protection.")
rule_h(0.5 * inch, PH - 2.42 * inch, PW - inch)

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 72)
c.drawString(0.5 * inch, PH - 3.88 * inch, "3,600\u00d7")
c.setFillColor(MUTED); c.setFont("Helvetica", 12)
c.drawString(0.5 * inch, PH - 4.1 * inch, "Execution head start vs. old mobilization model")
rule_h(0.5 * inch, PH - 4.42 * inch, 5.5 * inch)

for i, (bullet, col) in enumerate([
    ("\u25b6  Founding Partner: $75K / 90-day validation", GOLD),
    ("\u25b6  Growth tiers: $75K\u2013$250K annually", WHITE),
    ("\u25b6  If one strategic window is preserved, readiness pays for itself quickly", TEAL),
]):
    c.setFillColor(col); c.setFont("Helvetica", 13)
    c.drawString(0.5 * inch, PH - 4.75 * inch - i * 0.6 * inch, bullet)

# Right panel
fill_rect(6.72 * inch, PH - 6.88 * inch, 6.25 * inch, 4.42 * inch, col=NAVY2)
lbl("Commercial Logic", 6.98 * inch, PH - 2.78 * inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 12)
c.drawString(6.98 * inch, PH - 3.05 * inch,
    "Replaces the $400K\u2013$800K consulting retainer.")
c.drawString(6.98 * inch, PH - 3.28 * inch, "Break-even before the 2nd activation.")

for i, (k, v, vcol) in enumerate([
    ("Founding Partner", "$75K / 90 days",         GOLD),
    ("Growth Tier",      "$75K\u2013$250K annually", WHITE),
    ("Cohort",           "startup to Fortune 500",  WHITE),
    ("Board Line",       "Cost of delay > cost of readiness", TEAL),
]):
    yt = PH - 3.72 * inch - i * 0.68 * inch
    rule_h(6.98 * inch, yt + 0.5 * inch, 5.85 * inch,
        col=colors.HexColor("#283458"), lw=0.5)
    lbl(k, 6.98 * inch, yt, col=MUTED, size=9)
    c.setFillColor(vcol)
    c.setFont("Helvetica-Bold" if vcol == GOLD else "Helvetica",
              16 if vcol == GOLD else 13)
    c.drawString(9.4 * inch, yt, v)

rule_v(6.6 * inch, 0.3 * inch, PH - 0.3 * inch)
slide_num(7); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 8 — Built. Live. In Production.
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("Built. Live. In Production.", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawCentredString(PW / 2, PH - 1.22 * inch,
    "Not a roadmap \u2014 operating now")

for i, (num, sub, col) in enumerate([
    ("170",  "Protocols",   GOLD),
    ("221",  "Triggers",    GOLD),
    ("248",  "Data Points", TEAL),
    ("15m",  "Refresh",     GOLD),
]):
    sx = 0.35 * inch + i * 3.24 * inch
    fill_rect(sx, PH - 3.0 * inch, 3.1 * inch, 1.38 * inch, col=DARK2)
    c.setFillColor(col); c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(sx + 1.55 * inch, PH - 1.98 * inch, num)
    c.setFillColor(MUTED); c.setFont("Helvetica", 11)
    c.drawCentredString(sx + 1.55 * inch, PH - 2.62 * inch, sub)

fill_rect(3.2 * inch, PH - 3.18 * inch, 6.9 * inch, 0.38 * inch,
    col=colors.HexColor("#122218"), stroke_col=TEAL)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW / 2, PH - 2.97 * inch,
    "\u25cf  Signal Detection Active \u00b7 Updated Every 15 Minutes \u00b7 vaughnmartin.com")

framed_img("screenshots/deck_signals.jpg",
    0.35 * inch, 0.45 * inch, PW - 0.7 * inch, PH - 3.6 * inch,
    "Signal Intelligence feed \u00b7 vaughnmartin.com \u00b7 Live detections \u00b7 production")
slide_num(8); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 9 — Why Now (ivory)
# ══════════════════════════════════════════════════════════════
ivory_bg(); gold_bar()
lbl("Why Now", 0.5 * inch, PH - 0.72 * inch,
    col=colors.HexColor("#44496A"))
c.setFillColor(NAVY); c.setFont("Helvetica-Bold", 30)
c.drawString(0.5 * inch, PH - 1.42 * inch,
    "AI capability is accelerating faster")
c.drawString(0.5 * inch, PH - 1.98 * inch, "than enterprise readiness.")
rule_h(0.5 * inch, PH - 2.42 * inch, PW - inch, col=GOLD)

for i, (num, bullet) in enumerate([
    ("01", "Organizations can detect more than ever, but still mobilize too slowly."),
    ("02", "Governance and execution readiness are now the competitive bottleneck."),
    ("03", "The winners will be companies that pair AI sensing with governed execution speed."),
]):
    yt = PH - 3.08 * inch - i * 1.18 * inch
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 22)
    c.drawString(0.5 * inch, yt, num)
    c.setFillColor(colors.HexColor("#1A2348")); c.setFont("Helvetica", 16)
    c.drawString(1.12 * inch, yt, bullet)

c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 11)
c.drawString(0.5 * inch, 0.6 * inch,
    "Sources: Stanford HAI AI Index 2026  \u00b7  Gartner Autonomous Business")
slide_num(9); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 10 — The Ask
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()

fill_rect(0.35 * inch, 0.42 * inch, 5.85 * inch, PH - 0.84 * inch, col=NAVY2)
lbl("The Ask", 0.65 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawString(0.65 * inch, PH - 1.5 * inch, "Twelve founding partners.")
c.drawString(0.65 * inch, PH - 2.02 * inch, "One defining cohort.")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 14)
c.drawString(0.65 * inch, PH - 2.58 * inch,
    "Partners who want readiness as competitive advantage.")
rule_h(0.65 * inch, PH - 3.0 * inch, 4.8 * inch)
c.setFillColor(colors.HexColor("#CCD2E0")); c.setFont("Helvetica", 13)
c.drawString(0.65 * inch, PH - 3.32 * inch, "We're not looking for customers.")
c.drawString(0.65 * inch, PH - 3.58 * inch,
    "We're selecting partners who will define the category.")

fill_rect(6.6 * inch, 0.42 * inch, 6.38 * inch, PH - 0.84 * inch, col=NAVY2)
lbl("Program Details", 6.9 * inch, PH - 0.72 * inch)

for i, (k, v, vcol) in enumerate([
    ("Program",    "Founding Partner \u00b7 90-Day Validation", WHITE),
    ("Commercial", "$75K / 90 days",                          GOLD),
    ("Cohort",     "12 startup to Fortune 500 organizations", WHITE),
    ("Delivery",   "Right-sized by company maturity",         WHITE),
    ("Raise",      "Open strategic raise \u00b7 conversations underway", MUTED),
]):
    yt = PH - 1.38 * inch - i * 0.97 * inch
    rule_h(6.9 * inch, yt + 0.52 * inch, 5.85 * inch,
        col=colors.HexColor("#283458"), lw=0.5)
    lbl(k, 6.9 * inch, yt, col=MUTED, size=9)
    c.setFillColor(vcol)
    c.setFont("Helvetica-Bold" if vcol == GOLD else "Helvetica",
              17 if vcol == GOLD else 13)
    c.drawString(9.1 * inch, yt, v)

fill_rect(6.9 * inch, 0.65 * inch, 5.7 * inch, 0.52 * inch,
    col=NAVY, stroke_col=GOLD)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 11)
c.drawCentredString(6.9 * inch + 2.85 * inch, 0.85 * inch,
    "Apply for Founding Partner Access")

rule_v(6.4 * inch, 0.3 * inch, PH - 0.3 * inch)
slide_num(10); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 11 — Close
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW / 2, PH - 0.68 * inch,
    "THREE LINES. THAT\u2019S THE PITCH.")

for i, (tag, accent, body_txt) in enumerate([
    ("PROBLEM", GOLD,
     "Enterprises detect more signals, but still mobilize too slowly."),
    ("SOLUTION", GOLD,
     "VaughnMartin pre-stages response so executives authorize in minutes."),
    ("OUTCOME", TEAL,
     "Earlier detection + faster execution protects value before the window closes."),
]):
    yt = PH - 1.35 * inch - i * 1.72 * inch
    fill_rect(0.65 * inch, yt - 0.84 * inch, PW - 1.3 * inch, 1.52 * inch, col=DARK3)
    c.setStrokeColor(accent); c.setLineWidth(3.5)
    c.line(0.65 * inch, yt - 0.84 * inch, 0.65 * inch, yt + 0.68 * inch)
    lbl(tag, 0.88 * inch, yt, col=MUTED, size=9)
    c.setFillColor(GOLD if accent == GOLD else WHITE)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(0.88 * inch, yt - 0.38 * inch, body_txt)

fill_rect(1.8 * inch, 0.52 * inch, PW - 3.6 * inch, 0.62 * inch,
    col=NAVY, stroke_col=GOLD)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 12)
c.drawCentredString(PW / 2, 0.77 * inch,
    "Apply for Founding Partner Access  \u00b7  vaughnmartin.com/founding-partner-program")

c.setFillColor(colors.HexColor("#404868")); c.setFont("Helvetica-Oblique", 10)
c.drawCentredString(PW / 2, 0.28 * inch,
    "\u201cStrategic triggers are inevitable. Delay is optional.\u201d")
slide_num(11); c.showPage()

# ══════════════════════════════════════════════════════════════
c.save()
print(f"PDF v10 \u2192 {OUT}  (11 pages)")
