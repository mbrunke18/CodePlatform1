"""
VaughnMartin Investor Pitch Deck — PDF builder (reportlab)
Philosophy: dark navy backgrounds PRESERVED, product screenshots are HEROES not decorations.
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
MID   = colors.HexColor("#1E2755")
RED   = colors.HexColor("#FF5050")
DARK3 = colors.HexColor("#0E1438")

c = rl_canvas.Canvas(OUT, pagesize=(PW, PH))
c.setTitle("VaughnMartin Readiness OS — Investor Pitch Deck")
c.setAuthor("VaughnMartin"); c.setSubject("Founding Partner Program · Enterprise Readiness OS")

# ── Core helpers ───────────────────────────────────────────────
def navy_bg():
    c.setFillColor(NAVY); c.rect(0, 0, PW, PH, fill=1, stroke=0)

def light_bg():
    c.setFillColor(colors.HexColor("#F2F0EB")); c.rect(0, 0, PW, PH, fill=1, stroke=0)
    c.setFillColor(NAVY); c.rect(0, 0, 5.8*inch, PH, fill=1, stroke=0)

def gold_bar():
    c.setFillColor(GOLD); c.rect(0, PH-5, PW, 5, fill=1, stroke=0)

def lbl(text, x, y, color=GOLD, size=9):
    c.setFillColor(color); c.setFont("Helvetica-Bold", size)
    c.drawString(x, y, text.upper())

def body(text, x, y, color=WHITE, size=13, font="Helvetica", bold=False):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold" if bold else font, size)
    c.drawString(x, y, text)

def body_wrap(text, x, y, color=WHITE, size=13, maxw=5*inch, line_h=None):
    if line_h is None: line_h = size * 1.45
    words = text.split()
    lines = []; line = ""
    for w in words:
        t = (line + " " + w).strip()
        if c.stringWidth(t, "Helvetica", size) <= maxw: line = t
        else:
            if line: lines.append(line)
            line = w
    if line: lines.append(line)
    c.setFillColor(color); c.setFont("Helvetica", size)
    for i, ln in enumerate(lines):
        c.drawString(x, y - i*line_h, ln)

def centered(text, y, color=WHITE, size=14, bold=True):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    c.drawCentredString(PW/2, y, text)

def rule_h(x, y, w=4*inch, color=GOLD, lw=1.5):
    c.setStrokeColor(color); c.setLineWidth(lw); c.line(x, y, x+w, y)

def rule_v(x, y1, y2, color=MID, lw=0.5):
    c.setStrokeColor(color); c.setLineWidth(lw); c.line(x, y1, x, y2)

def fill_rect(x, y, w, h, color=DARK2):
    c.setFillColor(color); c.rect(x, y, w, h, fill=1, stroke=0)

def pill(text, x, y, w, h, fill=DARK2, stroke=GOLD, tc=GOLD, ts=11):
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, 3, fill=1, stroke=1)
    c.setFillColor(tc); c.setFont("Helvetica-Bold", ts)
    c.drawCentredString(x+w/2, y+h/2-4, text)

def img_hero(path, x, y, w, h):
    """Embed image as hero with gold border frame."""
    if os.path.exists(path):
        try:
            c.drawImage(ImageReader(path), x, y, width=w, height=h,
                        preserveAspectRatio=True, mask='auto')
        except Exception as e:
            print(f"  img warn: {e}")
    c.setStrokeColor(GOLD); c.setLineWidth(1.2)
    c.rect(x, y, w, h, fill=0, stroke=1)

def img_caption(text, x, y, w, h):
    """Draw caption bar at bottom of image area."""
    cap_h = 0.3*inch
    fill_rect(x, y, w, cap_h, color=colors.HexColor("#080D26"))
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 0.12*inch, y + 0.09*inch, text.upper())

def framed_img(path, x, y, w, h, caption=None):
    img_hero(path, x, y, w, h)
    if caption: img_caption(caption, x, y, w, h)

def slide_num(n):
    c.setFillColor(colors.HexColor("#444E70")); c.setFont("Helvetica-Bold", 9)
    c.drawRightString(PW - 0.3*inch, 0.22*inch, f"{n:02d} / 11")

# ══════════════════════════════════════════════════════════════
# SLIDE 1 — Hook Question + Command Tower inset
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 38)
c.drawCentredString(PW/2, PH - 1.4*inch, "When a strategic trigger fires—")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 31)
c.drawCentredString(PW/2, PH - 2.05*inch, "how long does it take to mobilize a coordinated response?")

for i, (chip, hot) in enumerate([
    ("Activist Investor · 91%", True),
    ("Ransomware · 95%", True),
    ("Regulatory Inquiry · 87%", False)
]):
    cx = 1.1*inch + i * 3.8*inch
    pill(chip, cx, PH - 3.85*inch, 3.5*inch, 0.45*inch,
         fill=colors.HexColor("#281C0A") if hot else DARK2,
         stroke=GOLD if hot else colors.HexColor("#333D60"),
         tc=GOLD if hot else MUTED)

c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 14)
c.drawCentredString(PW/2, PH - 4.65*inch, "These are live signal detections. Production. Right now.")

# Command Tower inset — LARGE hero strip
framed_img("screenshots/pptx_command_tower.jpg",
    1.8*inch, 0.55*inch, 9.73*inch, 2.3*inch,
    "Command Tower · Live production · 221 Triggers Armed · 20 Active Detections · 170 Protocols Ready")

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 11)
c.drawString(0.4*inch, 0.3*inch, "VaughnMartin  ·  Readiness OS")
slide_num(1); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 2 — The Reality: 30 Days + FULL PANEL demo trigger screenshot
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("THE REALITY", 0.45*inch, PH - 0.72*inch)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 110)
c.drawString(0.45*inch, PH - 2.7*inch, "30")
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawString(0.45*inch, PH - 3.28*inch, "Days")
rule_h(0.45*inch, PH - 3.68*inch, 3.9*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 13)
c.drawString(0.45*inch, PH - 4.0*inch, "Average mobilization time before")
c.drawString(0.45*inch, PH - 4.25*inch, "any execution begins.")
c.setFillColor(colors.HexColor("#CCD2E0")); c.setFont("Helvetica", 13)
c.drawString(0.45*inch, PH - 4.68*inch, "That's not execution time.")
c.drawString(0.45*inch, PH - 4.93*inch, "That's figuring out who's in the room.")

# RIGHT SIDE: Demo trigger screenshot — full panel hero
lbl("THIS IS WHAT A TRIGGER LOOKS LIKE — RIGHT NOW", 4.85*inch, PH - 0.72*inch)
framed_img("screenshots/pptx_demo.jpg",
    4.85*inch, 0.55*inch, 8.1*inch, PH - 1.4*inch,
    "Live simulation · M&A trigger · Risk 88/100 — HIGH · No response pre-staged")

rule_v(4.75*inch, 0.3*inch, PH - 0.3*inch)
slide_num(2); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 3 — The Problem Is Already Here
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("THE PROBLEM IS ALREADY HERE", 0.45*inch, PH - 0.72*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 26)
c.drawCentredString(PW/2, PH - 1.22*inch, "One of these is forming in your portfolio right now")

for i, (conf, domain, name, status, accent) in enumerate([
    ("95%","RISK & RESILIENCE","Ransomware\nAttack Confirmed","248 data points",TEAL),
    ("91%","GROWTH & POSITIONING","Activist Investor\nPressure Rising","Live Monitoring",GOLD),
    ("87%","RISK & RESILIENCE","Regulatory Inquiry\nOpened","Threshold Forming",TEAL),
]):
    cx = 0.4*inch + i * 4.3*inch
    cy = PH - 4.7*inch
    fill_rect(cx, cy, 4.1*inch, 3.2*inch, DARK2)
    c.setStrokeColor(MID); c.setLineWidth(0.7)
    c.rect(cx, cy, 4.1*inch, 3.2*inch, fill=0, stroke=1)
    c.setFillColor(accent); c.setFont("Helvetica-Bold", 18)
    c.drawRightString(cx + 3.9*inch, cy + 3.2*inch - 0.44*inch, conf)
    lbl(domain, cx + 0.18*inch, cy + 3.2*inch - 0.44*inch, color=TEAL, size=8)
    c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 19)
    for j, ln in enumerate(name.split("\n")):
        c.drawString(cx+0.18*inch, cy + 2.6*inch - j*0.3*inch, ln)
    fill_rect(cx+0.18*inch, cy + 1.15*inch, 3.74*inch, 0.06*inch, color=MID)
    fw = 3.74 * int(conf[:-1])/100
    fill_rect(cx+0.18*inch, cy + 1.15*inch, fw*inch, 0.06*inch, color=accent)
    c.setFillColor(TEAL); c.setFont("Helvetica", 10)
    c.drawString(cx+0.18*inch, cy + 0.8*inch, f"● Signal Detected · {status}")

# LARGE signal screenshot — fills lower 42% of slide
framed_img("screenshots/deck_signals.jpg",
    0.35*inch, 0.48*inch, PW - 0.7*inch, PH - 4.85*inch,
    "Signal Intelligence feed · vaughnmartin.com · Live detections · production")

slide_num(3); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 4 — Main Claim + Pillars + how-it-executes inset
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
fill_rect(7.5*inch, PH - 4.0*inch, 5.83*inch, 4.0*inch, color=colors.HexColor("#0E1C4A"))

c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 52)
c.drawCentredString(PW/2, PH - 1.5*inch, "The response is ready")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 52)
c.drawCentredString(PW/2, PH - 2.3*inch, "before the trigger fires.")
c.setFillColor(MUTED); c.setFont("Helvetica", 16)
c.drawCentredString(PW/2, PH - 2.95*inch, "Preparation  →  Readiness  →  Fearless")

for i, (num, sub) in enumerate([
    ("170","Readiness Protocols"), ("221","Strategic Triggers"), ("12 MIN","Full Execution Cycle")
]):
    px = 0.4*inch + i * 4.3*inch
    rule_h(px, PH - 3.6*inch, 4.1*inch)
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 56 if num != "12 MIN" else 40)
    c.drawCentredString(px + 2.05*inch, PH - 4.5*inch, num)
    c.setFillColor(WHITE); c.setFont("Helvetica", 13)
    c.drawCentredString(px + 2.05*inch, PH - 4.85*inch, sub)

# How-it-executes inset
framed_img("screenshots/pptx_how_executes.jpg",
    2.8*inch, 0.5*inch, 7.73*inch, 1.6*inch,
    "vaughnmartin.com/how-it-executes · Animated 12-minute execution chain")

slide_num(4); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 5 — Comparison
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
fill_rect(0, 0, 6.3*inch, PH, color=colors.HexColor("#0E1334"))
lbl("EVERY OTHER VENDOR", 0.4*inch, PH - 0.72*inch, color=RED)
c.setFillColor(MUTED); c.setFont("Helvetica-BoldOblique", 20)
c.drawString(0.4*inch, PH - 1.32*inch, '"Bolted AI onto the old model"')

for i, line in enumerate([
    "Faster summaries from the same slow meeting",
    "Smarter notes. Same 30-day mobilization cycle.",
    "AI tools. No operating model change.",
    "Competes with Copilot. We don't.",
]):
    yt = PH - 2.1*inch - i*1.06*inch
    c.setFillColor(RED); c.setFont("Helvetica-Bold", 15); c.drawString(0.4*inch, yt, "✕")
    c.setFillColor(MUTED); c.setFont("Helvetica", 13); c.drawString(0.9*inch, yt, line)

lbl("VAUGHNMARTIN", 6.6*inch, PH - 0.72*inch, color=GOLD)
c.setFillColor(WHITE); c.setFont("Helvetica-BoldOblique", 19)
c.drawString(6.5*inch, PH - 1.32*inch, '"Rebuilt the operating model"')

for i, line in enumerate([
    "Pre-staged before any trigger fires",
    "Proprietary IDEA Framework — 3 years to build",
    "Orchestrates the Microsoft stack — doesn't replace it",
    "Competes with the 40-year-old meeting model",
]):
    yt = PH - 2.1*inch - i*1.06*inch
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 15); c.drawString(6.5*inch, yt, "✓")
    c.setFillColor(WHITE); c.setFont("Helvetica", 13); c.drawString(7.0*inch, yt, line)

rule_v(6.4*inch, 0.3*inch, PH - 0.3*inch)
slide_num(5); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 6 — How It Executes (chain + LARGE screenshot)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("HOW IT EXECUTES", 0.5*inch, PH - 0.72*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 22)
c.drawCentredString(PW/2, PH - 1.2*inch,
    "Signal detected → Protocol activates → Executive authorizes → 12 minutes")

for i, (abbr, lbl_txt, hero) in enumerate([
    ("SIG","Signal\nDetected",False), ("SCR","Scored &\nClassified",False),
    ("PRO","Protocol\nActivates",True), ("STK","Stakeholders\nNotified",False),
    ("AUTH","Executive\nAuthorizes",False), ("EXE","Execution\nBegins",True)
]):
    cx = 0.55*inch + i * 2.18*inch
    cy = PH - 3.5*inch
    r = 0.65*inch
    c.setFillColor(GOLD if hero else colors.HexColor("#151F52"))
    c.setStrokeColor(GOLD); c.setLineWidth(1.5 if not hero else 0)
    c.circle(cx+r, cy+r, r, fill=1, stroke=0 if hero else 1)
    c.setFillColor(NAVY if hero else GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(cx+r, cy+r-4, abbr)
    c.setFillColor(WHITE); c.setFont("Helvetica", 10)
    for j, ln in enumerate(lbl_txt.split("\n")):
        c.drawCentredString(cx+r, cy - 0.2*inch - j*0.17*inch, ln)
    if i < 5:
        c.setFillColor(GOLD)
        c.rect(cx + 2*r + 0.03*inch, cy + r - 1.5, 0.55*inch, 3, fill=1, stroke=0)

fill_rect(0.45*inch, PH - 4.2*inch, 6.4*inch, 0.5*inch, color=colors.HexColor("#15281C"))
c.setStrokeColor(TEAL); c.setLineWidth(0.8)
c.rect(0.45*inch, PH - 4.2*inch, 6.4*inch, 0.5*inch, fill=0, stroke=1)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 13)
c.drawString(0.65*inch, PH - 3.97*inch, "✓  Complete in 12 minutes — 30 days compressed")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 12)
c.drawString(7.1*inch, PH - 3.97*inch, "The alternative: 30 days before execution begins")

# LARGE how-it-executes screenshot — fills lower 44% of slide
framed_img("screenshots/pptx_how_executes.jpg",
    0.35*inch, 0.48*inch, PW - 0.7*inch, PH - 4.38*inch,
    "vaughnmartin.com/how-it-executes · Live animated execution chain · 12-minute sequence")

slide_num(6); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 7 — Return on Readiness (stats left + ROI SCREENSHOT right)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("RETURN ON READINESS", 0.4*inch, PH - 0.72*inch)

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 78)
c.drawString(0.4*inch, PH - 2.5*inch, "3,600\u00d7")
c.setFillColor(MUTED); c.setFont("Helvetica", 13)
c.drawString(0.4*inch, PH - 2.75*inch, "Execution Head Start vs. Old Model")

c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 52)
c.drawString(0.4*inch, PH - 3.6*inch, "$120K")
c.setFillColor(MUTED); c.setFont("Helvetica", 13)
c.drawString(0.4*inch, PH - 3.85*inch, "Platform Cost · Annual")

rule_h(0.4*inch, PH - 4.22*inch, 4.4*inch)

c.setFillColor(WHITE); c.setFont("Helvetica", 14)
c.drawString(0.4*inch, PH - 4.5*inch, "Replaces $400K\u2013$800K consulting retainer")
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 14)
c.drawString(0.4*inch, PH - 4.85*inch, "Break-even before the 2nd activation.")
c.setFillColor(WHITE); c.setFont("Helvetica", 14)
c.drawString(0.4*inch, PH - 5.2*inch, "The budget line already exists.")

rule_h(0.4*inch, PH - 5.58*inch, 4.4*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 11)
c.drawString(0.4*inch, PH - 5.82*inch,
    '"We\'re replacing a line item every Fortune 1000 already pays."')

# RIGHT: ROI Calculator screenshot — FULL PANEL HERO
lbl("LIVE AT VAUGHNMARTIN.COM/ROI-CALCULATOR", 5.0*inch, PH - 0.72*inch)
framed_img("screenshots/pptx_roi.jpg",
    5.0*inch, 0.5*inch, 7.93*inch, PH - 1.38*inch,
    "ROI Calculator · Estimates $61.3M+ annual value · 3,600\u00d7 execution head start")

rule_v(4.9*inch, 0.3*inch, PH - 0.3*inch)
slide_num(7); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 8 — Built. In Production. (stats + TWO LARGE screenshots)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("BUILT. IN PRODUCTION. RIGHT NOW.", 0.45*inch, PH - 0.72*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 26)
c.drawCentredString(PW/2, PH - 1.22*inch, "The system is live — not a demo, not a roadmap")

for i, (num, sub, col) in enumerate([
    ("170","Readiness Protocols Pre-Staged",GOLD),
    ("221","Strategic Triggers Mapped",GOLD),
    ("248","Data Points Every 15 Min",TEAL),
    ("12","Compound Protocols",GOLD),
]):
    sx = 0.35*inch + i * 3.24*inch
    fill_rect(sx, PH - 3.0*inch, 3.1*inch, 1.5*inch, DARK2)
    c.setFillColor(col); c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(sx + 1.55*inch, PH - 1.95*inch, num)
    c.setFillColor(MUTED); c.setFont("Helvetica", 10)
    for j, ln in enumerate(sub.split("Pre-Staged") if "Pre-Staged" in sub else [sub]):
        part = (sub.split("Pre-Staged") if "Pre-Staged" in sub else [sub])
        c.drawCentredString(sx+1.55*inch, PH - 2.6*inch - j*0.18*inch, sub.split()[0] + (" Pre-Staged" if j == 0 and "Pre-Staged" in sub else ""))
    c.setFillColor(MUTED); c.setFont("Helvetica", 10)
    c.drawCentredString(sx+1.55*inch, PH - 2.65*inch, sub)

fill_rect(3.2*inch, PH - 3.15*inch, 6.9*inch, 0.42*inch, color=colors.HexColor("#122218"))
c.setStrokeColor(TEAL); c.setLineWidth(0.8)
c.rect(3.2*inch, PH - 3.15*inch, 6.9*inch, 0.42*inch, fill=0, stroke=1)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW/2, PH - 2.92*inch,
    "●  Signal Detection Active · Updated Every 15 Minutes · vaughnmartin.com")

# TWO LARGE screenshots side by side — command tower + protocol library
framed_img("screenshots/pptx_command_tower.jpg",
    0.35*inch, 0.45*inch, 6.2*inch, 3.55*inch,
    "Command Tower · 221 Triggers Armed · 20 Active Detections · 170 Protocols Ready")

framed_img("screenshots/pptx_protocols.jpg",
    6.78*inch, 0.45*inch, 6.2*inch, 3.55*inch,
    "Readiness Protocol Library · 170 protocols · Every strategic scenario covered")

slide_num(8); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 9 — Market Opportunity (text left + LARGE protocol screenshot right)
# ══════════════════════════════════════════════════════════════
light_bg(); gold_bar()

div_bar = c.saveState()
c.setStrokeColor(GOLD); c.setLineWidth(4)
c.line(0.42*inch, PH - 0.85*inch, 0.42*inch, PH - 4.6*inch)
c.restoreState()

lbl("THE MARKET OPPORTUNITY", 0.6*inch, PH - 0.72*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 32)
for i, ln in enumerate(["Preparation", "infrastructure", "does not exist yet."]):
    c.drawString(0.6*inch, PH - 1.55*inch - i*0.62*inch, ln)
rule_h(0.6*inch, PH - 3.98*inch, 4.8*inch)
c.setFillColor(IVORY); c.setFont("Helvetica-Oblique", 17)
c.drawString(0.6*inch, PH - 4.3*inch, "That's not a problem.")
c.drawString(0.6*inch, PH - 4.6*inch, "That's the entire opportunity.")
c.setFillColor(MUTED); c.setFont("Helvetica", 13)
body_wrap("Every Fortune 1000 has Microsoft's AI stack. None have the operating model to use it at trigger speed.",
    0.6*inch, PH - 5.2*inch, color=MUTED, size=13, maxw=4.8*inch)

# RIGHT: Protocol library screenshot — FULL RIGHT PANEL HERO
lbl("WHY NOW · WHY VAUGHNMARTIN", 6.0*inch, PH - 0.72*inch,
    color=colors.HexColor("#222C44"))
framed_img("screenshots/pptx_protocols.jpg",
    6.0*inch, 0.5*inch, 6.93*inch, PH - 1.38*inch,
    "170 Readiness Protocols · A pre-staged response for every strategic scenario")

slide_num(9); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 10 — Founding Partner Program
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
lbl("FOUNDING PARTNER PROGRAM", 0.45*inch, PH - 0.72*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 44)
for i, ln in enumerate(["Twelve", "organizations.", "One first cohort."]):
    c.drawString(0.45*inch, PH - 1.6*inch - i*0.72*inch, ln)
rule_h(0.45*inch, PH - 4.05*inch, 5.1*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 16)
c.drawString(0.45*inch, PH - 4.38*inch, "We're not looking for customers.")
c.drawString(0.45*inch, PH - 4.68*inch, "We're selecting partners who will define the category.")

lbl("THE ASK", 6.25*inch, PH - 0.72*inch)
for i, (lbl_t, val, vcol) in enumerate([
    ("PROGRAM","Founding Partner Program · 90-Day Validation",WHITE),
    ("COHORT SIZE","12 Organizations · Fortune 1000",GOLD),
    ("USE OF FUNDS","Protocol Expansion · Sales Infrastructure · Category Establishment",WHITE),
    ("WHY THIS ROOM","Investors who see the category before the category exists",GOLD),
]):
    yt = PH - 1.22*inch - i*1.45*inch
    fill_rect(6.25*inch, yt - 0.72*inch, 6.65*inch, 1.26*inch,
        color=DARK2 if i%2==0 else DARK3)
    lbl(lbl_t, 6.45*inch, yt, color=MUTED, size=9)
    c.setFillColor(vcol); c.setFont("Helvetica-Bold", 13)
    lines = []
    words = val.split()
    line = ""
    for w in words:
        t = (line+" "+w).strip()
        if c.stringWidth(t,"Helvetica-Bold",13) <= 5.9*inch: line=t
        else:
            if line: lines.append(line)
            line = w
    if line: lines.append(line)
    for j, ln in enumerate(lines):
        c.drawString(6.45*inch, yt - 0.2*inch - j*0.22*inch, ln)

rule_v(6.15*inch, 0.3*inch, PH - 0.3*inch)
slide_num(10); c.showPage()

# ══════════════════════════════════════════════════════════════
# SLIDE 11 — Three Sentences (clean close)
# ══════════════════════════════════════════════════════════════
navy_bg(); gold_bar()
fill_rect(8.2*inch, 0, 5.13*inch, 3.6*inch, color=colors.HexColor("#0C1640"))

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 12)
c.drawCentredString(PW/2, PH - 0.72*inch, "Three sentences. That's the whole pitch.")

for i, (tag, accent, body_txt) in enumerate([
    ("PROBLEM", GOLD,
     "No preparation infrastructure exists. Strategic triggers arrive in real time — the mobilization cycle still averages 30 days."),
    ("SOLUTION", GOLD,
     "We rebuilt the operating model. Pre-staged execution replaces real-time coordination — 12 minutes, not 30 days."),
    ("ROI", TEAL,
     "At $120K, we replace a $400K\u2013$800K retainer. Break-even before the second activation. The budget line already exists."),
]):
    yt = PH - 1.4*inch - i * 1.78*inch
    fill_rect(0.65*inch, yt - 0.85*inch, 12.03*inch, 1.58*inch, color=colors.HexColor("#0D1640"))
    c.setStrokeColor(accent); c.setLineWidth(3.5)
    c.line(0.65*inch, yt - 0.85*inch, 0.65*inch, yt + 0.73*inch)
    lbl(tag, 0.9*inch, yt, color=MUTED, size=9)
    words = body_txt.split()
    line = ""; lines = []
    for w in words:
        t = (line+" "+w).strip()
        if c.stringWidth(t,"Helvetica-Bold",15) <= 10.5*inch: line=t
        else:
            if line: lines.append(line)
            line = w
    if line: lines.append(line)
    c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 15)
    for j, ln in enumerate(lines):
        c.drawString(2.0*inch, yt - 0.08*inch - j*0.27*inch, ln)

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 14)
c.drawCentredString(PW/2, 1.0*inch, "vaughnmartin.com/founding-partner-program")
c.setFillColor(colors.HexColor("#444E70")); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW/2, 0.65*inch,
    "VaughnMartin · Readiness OS · The response is ready before the trigger fires")
slide_num(11); c.showPage()

c.save()
kb = os.path.getsize(OUT) // 1024
print(f"PDF → {OUT}  ({kb} KB, 11 pages)")
print("Screenshots featured:")
print("  S1: Command Tower hero strip (bottom)")
print("  S2: Demo trigger screenshot (full right panel)")
print("  S3: Signal Intelligence feed (large lower 42%)")
print("  S4: How-It-Executes inset (bottom)")
print("  S6: How-It-Executes large (lower 44%)")
print("  S7: ROI Calculator $61.3M (full right panel)")
print("  S8: Command Tower + Protocol Library (two large lower images)")
print("  S9: Protocol Library 170 protocols (full right panel)")
