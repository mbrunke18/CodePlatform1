"""
VaughnMartin Investor Pitch Deck — PDF builder (10/10 final, 12 slides)
Dark navy backgrounds. Product screenshots as heroes.
"""
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
import os

OUT = "attached_assets/VaughnMartin-Investor-Pitch-Deck.pdf"
PW = 13.33 * inch
PH = 7.5  * inch

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
NAVY2 = colors.HexColor("#0E1334")

c = rl_canvas.Canvas(OUT, pagesize=(PW, PH))
c.setTitle("VaughnMartin Readiness OS — Investor Pitch Deck")
c.setAuthor("VaughnMartin")
c.setSubject("Founding Partner Program · Startup to Fortune 500")

# ── Helpers ────────────────────────────────────────────────────
def navy_bg():
    c.setFillColor(NAVY); c.rect(0, 0, PW, PH, fill=1, stroke=0)

def ivory_bg():
    c.setFillColor(colors.HexColor("#F2F0EB")); c.rect(0, 0, PW, PH, fill=1, stroke=0)

def gold_bar():
    c.setFillColor(GOLD); c.rect(0, PH - 5, PW, 5, fill=1, stroke=0)

def lbl(text, x, y, color=GOLD, size=9):
    c.setFillColor(color); c.setFont("Helvetica-Bold", size)
    c.drawString(x, y, text.upper())

def fill_rect(x, y, w, h, color=DARK2):
    c.setFillColor(color); c.rect(x, y, w, h, fill=1, stroke=0)

def rule_h(x, y, w=4*inch, color=GOLD, lw=1.5):
    c.setStrokeColor(color); c.setLineWidth(lw); c.line(x, y, x + w, y)

def rule_v(x, y1, y2, color=MID, lw=0.5):
    c.setStrokeColor(color); c.setLineWidth(lw); c.line(x, y1, x, y2)

def pill(text, x, y, w, h, fill=DARK2, stroke=GOLD, tc=GOLD, ts=11):
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, 3, fill=1, stroke=1)
    c.setFillColor(tc); c.setFont("Helvetica-Bold", ts)
    c.drawCentredString(x + w / 2, y + h / 2 - 4, text)

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
        cap_h = 0.28 * inch
        fill_rect(x, y, w, cap_h, color=colors.HexColor("#080D26"))
        c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 0.1 * inch, y + 0.08 * inch, caption.upper())

def body_wrap(text, x, y, color=WHITE, size=13, maxw=5 * inch, line_h=None):
    if line_h is None: line_h = size * 1.45
    words = text.split(); lines = []; line = ""
    for w in words:
        t = (line + " " + w).strip()
        if c.stringWidth(t, "Helvetica", size) <= maxw:
            line = t
        else:
            if line: lines.append(line)
            line = w
    if line: lines.append(line)
    c.setFillColor(color); c.setFont("Helvetica", size)
    for i, ln in enumerate(lines):
        c.drawString(x, y - i * line_h, ln)

def slide_num(n, total=12):
    c.setFillColor(colors.HexColor("#444E70")); c.setFont("Helvetica-Bold", 9)
    c.drawRightString(PW - 0.3 * inch, 0.22 * inch, f"{n:02d} / {total:02d}")

# ══════════════════════════════════════════════════════════════
# SLIDE 1 — Hook Question
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 36)
c.drawCentredString(PW / 2, PH - 1.38 * inch,
    "When a strategic trigger fires in your organization\u2014")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 30)
c.drawCentredString(PW / 2, PH - 2.05 * inch,
    "are you executing in 12 minutes or organizing from scratch?")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 14)
c.drawCentredString(PW / 2, PH - 2.7 * inch, "Signal advantage before execution advantage.")

for i, (chip, hot) in enumerate([
    ("Activist Investor \u00b7 91%", True),
    ("Ransomware \u00b7 95%", True),
    ("Regulatory Inquiry \u00b7 87%", False),
]):
    cx = 1.1 * inch + i * 3.8 * inch
    pill(chip, cx, PH - 3.72 * inch, 3.5 * inch, 0.45 * inch,
         fill=colors.HexColor("#281C0A") if hot else DARK2,
         stroke=GOLD if hot else colors.HexColor("#333D60"),
         tc=GOLD if hot else MUTED)

framed_img("screenshots/pptx_command_tower.jpg",
    1.8 * inch, 0.72 * inch, 9.73 * inch, 2.05 * inch,
    "Command Tower \u00b7 Live production \u00b7 221 Triggers Armed \u00b7 170 Protocols Ready")

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 11)
c.drawCentredString(PW / 2, 0.3 * inch,
    "AI monitors continuously.  Executives authorize decisively.")
slide_num(1); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 2 — 30 Days + demo screenshot
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("The Reality", 0.45 * inch, PH - 0.72 * inch)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 110)
c.drawString(0.45 * inch, PH - 2.7 * inch, "30")
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawString(0.45 * inch, PH - 3.28 * inch, "Days")
rule_h(0.45 * inch, PH - 3.68 * inch, 3.9 * inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 13)
c.drawString(0.45 * inch, PH - 3.98 * inch, "Mobilization time before any execution begins.")
c.setFillColor(colors.HexColor("#CCD2E0")); c.setFont("Helvetica", 13)
c.drawString(0.45 * inch, PH - 4.42 * inch, "Coordination starts from zero at every trigger.")
c.drawString(0.45 * inch, PH - 4.68 * inch, "The window closes before execution begins.")

lbl("This is what a trigger looks like \u2014 right now", 4.85 * inch, PH - 0.72 * inch)
framed_img("screenshots/pptx_demo.jpg",
    4.85 * inch, 0.55 * inch, 8.1 * inch, PH - 1.4 * inch,
    "Live simulation \u00b7 M&A trigger \u00b7 Risk 88/100 \u2014 HIGH \u00b7 No response pre-staged")
rule_v(4.75 * inch, 0.3 * inch, PH - 0.3 * inch)
slide_num(2); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 3 — The Problem Is Already Here
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("The Problem Is Already Here", 0.45 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 24)
c.drawCentredString(PW / 2, PH - 1.22 * inch,
    "One of these is forming in your portfolio right now")

for i, (conf, domain, name, status, accent) in enumerate([
    ("95%", "RISK & RESILIENCE", "Ransomware\nAttack Confirmed", "248 data points", TEAL),
    ("91%", "GROWTH & POSITIONING", "Activist Investor\nPressure Rising", "Live Monitoring", GOLD),
    ("87%", "RISK & RESILIENCE", "Regulatory Inquiry\nOpened", "Threshold Forming", TEAL),
]):
    cx = 0.4 * inch + i * 4.3 * inch; cy = PH - 4.7 * inch
    fill_rect(cx, cy, 4.1 * inch, 3.2 * inch, DARK2)
    c.setStrokeColor(MID); c.setLineWidth(0.7)
    c.rect(cx, cy, 4.1 * inch, 3.2 * inch, fill=0, stroke=1)
    c.setFillColor(accent); c.setFont("Helvetica-Bold", 18)
    c.drawRightString(cx + 3.9 * inch, cy + 3.2 * inch - 0.44 * inch, conf)
    lbl(domain, cx + 0.18 * inch, cy + 3.2 * inch - 0.44 * inch, color=TEAL, size=8)
    c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 18)
    for j, ln in enumerate(name.split("\n")):
        c.drawString(cx + 0.18 * inch, cy + 2.58 * inch - j * 0.3 * inch, ln)
    fill_rect(cx + 0.18 * inch, cy + 1.15 * inch, 3.74 * inch, 0.06 * inch, color=MID)
    fw = 3.74 * int(conf[:-1]) / 100
    fill_rect(cx + 0.18 * inch, cy + 1.15 * inch, fw * inch, 0.06 * inch, color=accent)
    c.setFillColor(TEAL); c.setFont("Helvetica", 10)
    c.drawString(cx + 0.18 * inch, cy + 0.78 * inch, f"\u25cf Signal Detected \u00b7 {status}")

framed_img("screenshots/deck_signals.jpg",
    0.35 * inch, 0.48 * inch, PW - 0.7 * inch, PH - 4.85 * inch,
    "Signal Intelligence feed \u00b7 vaughnmartin.com \u00b7 Live detections \u00b7 production")
slide_num(3); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 4 — The Answer
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
fill_rect(7.5 * inch, PH - 4.0 * inch, 5.83 * inch, 4.0 * inch,
    color=colors.HexColor("#0E1C4A"))
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 52)
c.drawCentredString(PW / 2, PH - 1.5 * inch, "The response is ready")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 52)
c.drawCentredString(PW / 2, PH - 2.3 * inch, "before the trigger fires.")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 15)
c.drawCentredString(PW / 2, PH - 2.95 * inch, "Preparation  \u2192  Readiness  \u2192  Fearless")

for i, (num, sub) in enumerate([
    ("170", "Readiness Protocols"),
    ("221", "Strategic Triggers"),
    ("12 MIN", "Full Execution Cycle"),
]):
    px = 0.4 * inch + i * 4.3 * inch
    rule_h(px, PH - 3.6 * inch, 4.1 * inch)
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 54 if num != "12 MIN" else 38)
    c.drawCentredString(px + 2.05 * inch, PH - 4.5 * inch, num)
    c.setFillColor(WHITE); c.setFont("Helvetica", 13)
    c.drawCentredString(px + 2.05 * inch, PH - 4.85 * inch, sub)

framed_img("screenshots/pptx_how_executes.jpg",
    2.8 * inch, 0.5 * inch, 7.73 * inch, 1.6 * inch,
    "vaughnmartin.com/how-it-executes \u00b7 Animated 12-minute execution chain")
slide_num(4); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 5 — Old Model vs VaughnMartin (3 bullets each)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
fill_rect(0, 0, 6.3 * inch, PH, color=NAVY2)
lbl("Old Model", 0.4 * inch, PH - 0.72 * inch, color=RED)
c.setFillColor(MUTED); c.setFont("Helvetica-BoldOblique", 19)
c.drawString(0.4 * inch, PH - 1.3 * inch, '"Bolted AI onto the old model"')

for i, line in enumerate([
    "Faster notes from the same slow meetings",
    "No readiness architecture before triggers fire",
    "Authority unclear when pressure arrives",
]):
    yt = PH - 2.1 * inch - i * 1.1 * inch
    c.setFillColor(RED); c.setFont("Helvetica-Bold", 15)
    c.drawString(0.4 * inch, yt, "\u2715")
    c.setFillColor(MUTED); c.setFont("Helvetica", 14)
    c.drawString(0.9 * inch, yt, line)

lbl("VaughnMartin", 6.6 * inch, PH - 0.72 * inch, color=GOLD)
c.setFillColor(WHITE); c.setFont("Helvetica-BoldOblique", 18)
c.drawString(6.5 * inch, PH - 1.3 * inch, '"Rebuilt the operating model"')

for i, line in enumerate([
    "Response pre-staged before trigger fires",
    "AI monitors. Executives authorize. Teams execute.",
    "Governance and auditability built into execution",
]):
    yt = PH - 2.1 * inch - i * 1.1 * inch
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 15)
    c.drawString(6.5 * inch, yt, "\u2713")
    c.setFillColor(WHITE); c.setFont("Helvetica", 14)
    c.drawString(7.0 * inch, yt, line)

rule_v(6.4 * inch, 0.3 * inch, PH - 0.3 * inch)
slide_num(5); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 6 — Execution Chain + Protocol Builder screenshot
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("From Detection to Authorized Execution", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 20)
c.drawCentredString(PW / 2, PH - 1.2 * inch,
    "Signal detected \u2192 Protocol activates \u2192 Executive authorizes \u2192 12 minutes")

for i, (abbr, lbl_txt, hero) in enumerate([
    ("SIG", "Signal\nDetected", False),
    ("SCR", "Scored &\nClassified", False),
    ("PRO", "Protocol\nActivates", True),
    ("STK", "Stakeholders\nNotified", False),
    ("AUTH", "Executive\nAuthorizes", False),
    ("EXE", "Execution\nBegins", True),
]):
    cx = 0.55 * inch + i * 2.18 * inch; cy = PH - 3.5 * inch; r = 0.65 * inch
    c.setFillColor(GOLD if hero else colors.HexColor("#151F52"))
    c.setStrokeColor(GOLD); c.setLineWidth(1.5 if not hero else 0)
    c.circle(cx + r, cy + r, r, fill=1, stroke=0 if hero else 1)
    c.setFillColor(NAVY if hero else GOLD); c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(cx + r, cy + r - 4, abbr)
    c.setFillColor(WHITE); c.setFont("Helvetica", 10)
    for j, ln in enumerate(lbl_txt.split("\n")):
        c.drawCentredString(cx + r, cy - 0.2 * inch - j * 0.17 * inch, ln)
    if i < 5:
        c.setFillColor(GOLD)
        c.rect(cx + 2 * r + 0.03 * inch, cy + r - 1.5, 0.55 * inch, 3, fill=1, stroke=0)

fill_rect(0.45 * inch, PH - 4.2 * inch, 6.4 * inch, 0.5 * inch,
    color=colors.HexColor("#15281C"))
c.setStrokeColor(TEAL); c.setLineWidth(0.8)
c.rect(0.45 * inch, PH - 4.2 * inch, 6.4 * inch, 0.5 * inch, fill=0, stroke=1)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 13)
c.drawString(0.65 * inch, PH - 3.97 * inch,
    "\u2713  Complete in 12 minutes \u2014 30 days compressed")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 11)
c.drawString(7.1 * inch, PH - 3.97 * inch,
    "The alternative: 30 days before execution begins")

framed_img("screenshots/pitch_builder.jpg",
    0.35 * inch, 0.48 * inch, PW - 0.7 * inch, PH - 4.38 * inch,
    "Protocol Builder \u00b7 Pre-staged execution architecture \u00b7 Live in production")
slide_num(6); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 7 — Business Value
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("Business Value", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 34)
c.drawString(0.5 * inch, PH - 1.45 * inch,
    "Readiness is not overhead.")
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 34)
c.drawString(0.5 * inch, PH - 2.02 * inch, "It is value protection.")

rule_h(0.5 * inch, PH - 2.48 * inch, PW - inch)

for i, (bullet, color) in enumerate([
    ("Founding Partner: $75K / 90-day validation", GOLD),
    ("Growth tiers: $75K\u2013$250K annually", WHITE),
    ("If one strategic window is preserved, readiness can pay for itself quickly", TEAL),
]):
    yt = PH - 3.0 * inch - i * 1.18 * inch
    c.setFillColor(color); c.setFont("Helvetica-Bold", 10)
    c.rect(0.5 * inch, yt + 4, 0.16 * inch, 0.16 * inch, fill=1, stroke=0)
    c.setFont("Helvetica", 16); c.setFillColor(color)
    c.drawString(0.82 * inch, yt, bullet)

rule_h(0.5 * inch, PH - 6.35 * inch, PW - inch)
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 16)
c.drawCentredString(PW / 2, PH - 6.72 * inch,
    "The cost of delay is usually higher than the cost of readiness.")
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
    ("170", "Protocols", GOLD),
    ("221", "Triggers", GOLD),
    ("248", "Data Points", TEAL),
    ("15 MIN", "Refresh", GOLD),
]):
    sx = 0.35 * inch + i * 3.24 * inch
    fill_rect(sx, PH - 3.0 * inch, 3.1 * inch, 1.42 * inch, DARK2)
    c.setFillColor(col); c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(sx + 1.55 * inch, PH - 1.92 * inch, num)
    c.setFillColor(MUTED); c.setFont("Helvetica", 11)
    c.drawCentredString(sx + 1.55 * inch, PH - 2.6 * inch, sub)

fill_rect(3.2 * inch, PH - 3.18 * inch, 6.9 * inch, 0.4 * inch,
    color=colors.HexColor("#122218"))
c.setStrokeColor(TEAL); c.setLineWidth(0.8)
c.rect(3.2 * inch, PH - 3.18 * inch, 6.9 * inch, 0.4 * inch, fill=0, stroke=1)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW / 2, PH - 2.95 * inch,
    "\u25cf  Signal Detection Active \u00b7 Updated Every 15 Minutes \u00b7 vaughnmartin.com")

framed_img("screenshots/deck_signals.jpg",
    0.35 * inch, 0.45 * inch, PW - 0.7 * inch, PH - 3.6 * inch,
    "Signal Intelligence feed \u00b7 Live detections \u00b7 vaughnmartin.com")
slide_num(8); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 9 — MIC-DROP: Signal + Execution side by side
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("Proof of Production", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 26)
c.drawCentredString(PW / 2, PH - 1.2 * inch,
    "From Signal to Authorized Execution in 12 Minutes")

framed_img("screenshots/deck_signals.jpg",
    0.35 * inch, PH - 5.42 * inch, 6.27 * inch, 4.08 * inch,
    "Live trigger detected with confidence scoring.")
framed_img("screenshots/pptx_how_executes.jpg",
    6.71 * inch, PH - 5.42 * inch, 6.27 * inch, 4.08 * inch,
    "Pre-staged protocol, stakeholders, authority, and tasks ready before pressure.")

fill_rect(0, PH - 6.55 * inch, PW, 0.88 * inch, color=colors.HexColor("#080D26"))
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 20)
c.drawCentredString(PW / 2, PH - 6.22 * inch,
    "AI monitors.   Executives authorize.   Teams execute.")
c.setFillColor(MUTED); c.setFont("Helvetica", 10)
c.drawCentredString(PW / 2, PH - 7.1 * inch,
    "170 protocols  \u00b7  221 triggers  \u00b7  248 data points  \u00b7  refreshed every 15 minutes")
slide_num(9); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 10 — Why Now (ivory background)
# ══════════════════════════════════════════════════════════════
ivory_bg(); gold_bar()
lbl("Why Now", 0.5 * inch, PH - 0.72 * inch,
    color=colors.HexColor("#44496A"))
c.setFillColor(NAVY); c.setFont("Helvetica-Bold", 30)
c.drawString(0.5 * inch, PH - 1.42 * inch,
    "AI capability is accelerating faster")
c.drawString(0.5 * inch, PH - 1.98 * inch, "than enterprise readiness.")

rule_h(0.5 * inch, PH - 2.42 * inch, PW - inch, color=GOLD)

for i, bullet in enumerate([
    "Organizations can detect more than ever, but still mobilize too slowly.",
    "Governance and execution readiness are now the competitive bottleneck.",
    "The winners will pair AI sensing with governed execution speed.",
]):
    yt = PH - 3.02 * inch - i * 1.15 * inch
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 10)
    c.rect(0.5 * inch, yt + 4, 0.15 * inch, 0.15 * inch, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#1A2348")); c.setFont("Helvetica", 16)
    c.drawString(0.82 * inch, yt, bullet)

c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 11)
c.drawString(0.5 * inch, PH - 6.32 * inch,
    "Sources: Stanford HAI AI Index 2026  \u00b7  Gartner Autonomous Business")
slide_num(10); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 11 — The Ask
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("The Ask", 0.5 * inch, PH - 0.72 * inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 34)
c.drawString(0.5 * inch, PH - 1.52 * inch, "Twelve founding partners.")
c.drawString(0.5 * inch, PH - 2.08 * inch, "One defining cohort.")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 15)
c.drawString(0.5 * inch, PH - 2.62 * inch,
    "Partners who want readiness as competitive advantage.")

for i, (row_lbl, val, vcol) in enumerate([
    ("Program",    "Founding Partner  \u00b7  90-Day Validation", WHITE),
    ("Commercial", "$75K / 90 days", GOLD),
    ("Cohort",     "12 startup to Fortune 500 organizations", WHITE),
    ("Raise",      "Open strategic raise  \u00b7  active conversations underway", MUTED),
]):
    yt = PH - 3.42 * inch - i * 0.97 * inch
    fill_rect(0.4 * inch, yt - 0.58 * inch, PW - 0.8 * inch, 0.88 * inch,
        color=DARK2 if i % 2 == 0 else DARK3)
    lbl(row_lbl, 0.6 * inch, yt, color=MUTED, size=9)
    c.setFillColor(vcol)
    c.setFont("Helvetica-Bold" if vcol == GOLD else "Helvetica", 15)
    c.drawString(3.0 * inch, yt, val)

slide_num(11); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 12 — Close (inevitable)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 11)
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
    yt = PH - 1.38 * inch - i * 1.75 * inch
    fill_rect(0.65 * inch, yt - 0.85 * inch, PW - 1.3 * inch, 1.55 * inch, color=DARK3)
    c.setStrokeColor(accent); c.setLineWidth(3.5)
    c.line(0.65 * inch, yt - 0.85 * inch, 0.65 * inch, yt + 0.7 * inch)
    lbl(tag, 0.9 * inch, yt, color=MUTED, size=9)
    c.setFillColor(GOLD if accent == GOLD else WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.drawString(0.9 * inch, yt - 0.38 * inch, body_txt)

fill_rect(1.8 * inch, 0.55 * inch, PW - 3.6 * inch, 0.65 * inch, color=NAVY)
c.setStrokeColor(GOLD); c.setLineWidth(0.8)
c.rect(1.8 * inch, 0.55 * inch, PW - 3.6 * inch, 0.65 * inch, fill=0, stroke=1)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 12)
c.drawCentredString(PW / 2, 0.8 * inch,
    "Apply for Founding Partner Access  \u00b7  vaughnmartin.com/founding-partner-program")
slide_num(12); c.showPage()

# ══════════════════════════════════════════════════════════════
c.save()
print(f"PDF \u2192 {OUT}  (12 pages)")
print("Screenshots featured:")
print("  S1: Command Tower inset")
print("  S2: Demo trigger (full right panel)")
print("  S3: Signal Intelligence feed (lower 42%)")
print("  S4: How-it-executes inset")
print("  S6: Protocol Builder (full lower)")
print("  S8: Signal Detection feed (full lower)")
print("  S9: Signals (left) + How-it-executes (right) \u2014 MIC-DROP")
