from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
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
RED   = colors.HexColor("#FF5050")
DARK  = colors.HexColor("#121A44")
MID   = colors.HexColor("#1E2755")

c = rl_canvas.Canvas(OUT, pagesize=(PW, PH))
c.setTitle("VaughnMartin Readiness OS — Investor Pitch Deck")
c.setAuthor("VaughnMartin")
c.setSubject("Founding Partner Program · Enterprise Readiness OS")

# ── helpers ───────────────────────────────────────────
def navy_bg():
    c.setFillColor(NAVY)
    c.rect(0, 0, PW, PH, fill=1, stroke=0)

def light_bg():
    c.setFillColor(colors.HexColor("#F5F4F0"))
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(0, 0, 5.8*inch, PH, fill=1, stroke=0)

def gold_bar():
    c.setFillColor(GOLD)
    c.rect(0, PH - 5, PW, 5, fill=1, stroke=0)

def label_txt(text, x, y, color=GOLD, size=9, bold=True):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    c.drawString(x, y, text.upper())

def body_txt(text, x, y, color=WHITE, size=13, font="Helvetica", maxwidth=None):
    c.setFillColor(color)
    c.setFont(font, size)
    if maxwidth:
        lines = wrap_text(text, font, size, maxwidth)
        line_h = size * 1.4
        for i, line in enumerate(lines):
            c.drawString(x, y - i * line_h, line)
    else:
        c.drawString(x, y, text)

def centered_txt(text, y, color=WHITE, size=14, font="Helvetica-Bold"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawCentredString(PW / 2, y, text)

def wrap_text(text, font_name, font_size, max_width):
    words = text.split()
    lines = []; line = ""
    for word in words:
        test = (line + " " + word).strip()
        w = c.stringWidth(test, font_name, font_size)
        if w <= max_width:
            line = test
        else:
            if line: lines.append(line)
            line = word
    if line: lines.append(line)
    return lines

def gold_rule(x, y, w=4*inch):
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(x, y, x + w, y)

def divider_h(x, y, w, color=MID, lw=0.5):
    c.setStrokeColor(color)
    c.setLineWidth(lw)
    c.line(x, y, x + w, y)

def stat_big(num, sub, x, y, col=GOLD, subsize=12):
    c.setFillColor(col)
    c.setFont("Helvetica-Bold", 64)
    c.drawString(x, y, num)
    body_txt(sub, x, y - 14, color=MUTED, size=subsize)

def embed_img(path, x, y, w, h, opacity=1.0):
    if os.path.exists(path):
        try:
            img = ImageReader(path)
            c.saveState()
            c.drawImage(img, x, y, width=w, height=h,
                        preserveAspectRatio=True, mask='auto')
            c.restoreState()
        except Exception as e:
            print(f"  img error {path}: {e}")

def slide_num(n, total=11):
    c.setFillColor(colors.HexColor("#444E70"))
    c.setFont("Helvetica-Bold", 9)
    c.drawRightString(PW - 0.3*inch, 0.25*inch, f"{n:02d} / {total:02d}")

def pill_box(text, x, y, w, h, fill=DARK, stroke=GOLD, text_color=GOLD, tsize=11):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, 3, fill=1, stroke=1)
    c.setFillColor(text_color)
    c.setFont("Helvetica-Bold", tsize)
    c.drawCentredString(x + w/2, y + h/2 - 4, text)

def section_box(x, y, w, h, fill=DARK):
    c.setFillColor(fill)
    c.rect(x, y, w, h, fill=1, stroke=0)

# ══════════════════════════════════════════════════
# SLIDE 1 — Hook Question
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 34)
c.drawCentredString(PW/2, PH - 1.4*inch, "When a strategic trigger fires—")
c.setFillColor(GOLD)
c.setFont("Helvetica-BoldOblique", 28)
c.drawCentredString(PW/2, PH - 2.05*inch, "how long does it take to mobilize a coordinated response?")

chips = [("Activist Investor · 91%", True), ("Ransomware · 95%", True), ("Regulatory Inquiry · 87%", False)]
for i, (chip, hot) in enumerate(chips):
    cx = 1.3*inch + i * 3.8*inch
    cy = PH - 3.9*inch
    cw = 3.5*inch; ch = 0.45*inch
    pill_box(chip, cx, cy, cw, ch,
        fill=colors.HexColor("#281C0A") if hot else DARK,
        stroke=GOLD if hot else colors.HexColor("#444E70"),
        text_color=GOLD if hot else MUTED)

c.setFillColor(MUTED)
c.setFont("Helvetica-Oblique", 14)
c.drawCentredString(PW/2, PH - 4.7*inch, "These are live signal detections. Production. Right now.")

c.setFillColor(GOLD)
c.setFont("Helvetica-Bold", 12)
c.drawString(0.4*inch, 0.4*inch, "VaughnMartin  ·  Readiness OS")
slide_num(1)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 2 — The Reality: 30 Days
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
label_txt("THE REALITY", 0.5*inch, PH - 0.75*inch)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 108)
c.drawString(0.5*inch, PH - 2.65*inch, "30")
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 26)
c.drawString(0.5*inch, PH - 3.25*inch, "Days")
gold_rule(0.5*inch, PH - 3.65*inch, 4.0*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 14)
c.drawString(0.5*inch, PH - 3.95*inch, "That's not execution time.")
c.drawString(0.5*inch, PH - 4.25*inch, "That's mobilization time before execution begins.")

c.setStrokeColor(MID); c.setLineWidth(0.5); c.line(5.0*inch, 0.3*inch, 5.0*inch, PH - 0.3*inch)
label_txt("THE OLD MODEL — EVERY TIME", 5.2*inch, PH - 0.75*inch)

steps = [
    ("Trigger fires", "Signal detected — no protocol exists. Emails go out.", True),
    ("Days 1–5: Who's in the room?", "Executives align on who should lead.", False),
    ("Days 6–14: What's the plan?", "Strategy formed. Consultants engaged.", False),
    ("Days 15–25: Alignment cycle", "Stakeholders aligned. Approvals queued.", False),
    ("Day 30+: Execution begins", "After 30 days of coordination. If you're lucky.", False),
]
for i, (h, b, active) in enumerate(steps):
    yt = PH - 1.15*inch - i * 1.12*inch
    dot_col = GOLD if active else colors.HexColor("#333D60")
    c.setFillColor(dot_col)
    c.circle(5.35*inch, yt + 0.12*inch, 5, fill=1, stroke=0)
    c.setFillColor(WHITE if active else colors.HexColor("#CCd2E0"))
    c.setFont("Helvetica-Bold", 13)
    c.drawString(5.6*inch, yt, h)
    c.setFillColor(MUTED); c.setFont("Helvetica", 11)
    c.drawString(5.6*inch, yt - 14, b)
    if i < 4: divider_h(5.6*inch, yt - 22, 7.3*inch)

slide_num(2)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 3 — The Problem Is Already Here
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
label_txt("THE PROBLEM IS ALREADY HERE", 1.0*inch, PH - 0.75*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawCentredString(PW/2, PH - 1.25*inch, "One of these is forming in your portfolio right now")

cards = [
    ("95%", "RISK & RESILIENCE", "Ransomware\nAttack Confirmed", "248 data points", TEAL),
    ("91%", "GROWTH & POSITIONING", "Activist Investor\nPressure Rising", "Live Monitoring", GOLD),
    ("87%", "RISK & RESILIENCE", "Regulatory Inquiry\nOpened", "Threshold Forming", TEAL),
]
for i, (conf, domain, name, status, accent) in enumerate(cards):
    cx = 0.4*inch + i * 4.3*inch
    cy = PH - 5.7*inch
    cw = 4.1*inch; ch = 3.9*inch
    section_box(cx, cy, cw, ch, fill=colors.HexColor("#121A44"))
    c.setStrokeColor(MID); c.setLineWidth(0.7)
    c.rect(cx, cy, cw, ch, fill=0, stroke=1)
    c.setFillColor(accent); c.setFont("Helvetica-Bold", 18)
    c.drawRightString(cx + cw - 0.2*inch, cy + ch - 0.45*inch, conf)
    label_txt(domain, cx + 0.2*inch, cy + ch - 0.45*inch, color=TEAL, size=8)
    c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 20)
    lines = name.split("\n")
    for j, ln in enumerate(lines):
        c.drawString(cx + 0.2*inch, cy + ch - 0.95*inch - j*0.28*inch, ln)
    c.setFillColor(colors.HexColor("#1E2855"))
    c.rect(cx + 0.2*inch, cy + 1.1*inch, 3.7*inch, 0.06*inch, fill=1, stroke=0)
    fill_w = 3.7 * int(conf[:-1]) / 100
    c.setFillColor(accent)
    c.rect(cx + 0.2*inch, cy + 1.1*inch, fill_w*inch, 0.06*inch, fill=1, stroke=0)
    c.setFillColor(TEAL); c.setFont("Helvetica", 10)
    c.drawString(cx + 0.2*inch, cy + 0.75*inch, f"● Signal Detected · {status}")

embed_img("screenshots/deck_signals.jpg", 0, 0.45*inch, PW, 1.35*inch)
c.setFillColorRGB(0.04, 0.06, 0.18, alpha=0.72)
c.rect(0, 0.45*inch, PW, 1.35*inch, fill=1, stroke=0)
c.setFillColor(GOLD)
c.setFont("Helvetica-Bold", 9)
c.drawCentredString(PW/2, 0.9*inch,
    "● LIVE SIGNAL DETECTIONS FROM VAUGHNMARTIN.COM PRODUCTION — NOT HYPOTHETICAL")

slide_num(3)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 4 — Main Claim + Pillars
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 50)
c.drawCentredString(PW/2, PH - 1.5*inch, "The response is ready")
c.setFillColor(GOLD); c.setFont("Helvetica-BoldOblique", 50)
c.drawCentredString(PW/2, PH - 2.25*inch, "before the trigger fires.")
c.setFillColor(MUTED); c.setFont("Helvetica", 15)
c.drawCentredString(PW/2, PH - 2.9*inch, "Preparation  →  Readiness  →  Fearless")

pillars = [("170", "Readiness\nProtocols"), ("221", "Strategic Triggers\nMapped"), ("12 MIN", "Full Execution\nCycle")]
for i, (num, lbl) in enumerate(pillars):
    px = 0.4*inch + i * 4.4*inch
    py = PH - 5.8*inch
    divider_h(px, py + 2.2*inch, 4.0*inch, color=MID)
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 58 if num != "12 MIN" else 42)
    c.drawCentredString(px + 2.0*inch, py + 0.9*inch, num)
    c.setFillColor(WHITE); c.setFont("Helvetica", 13)
    for j, ln in enumerate(lbl.split("\n")):
        c.drawCentredString(px + 2.0*inch, py + 0.35*inch - j * 0.2*inch, ln)

slide_num(4)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 5 — Comparison
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
c.setFillColor(colors.HexColor("#101435"))
c.rect(0, 0, 6.3*inch, PH, fill=1, stroke=0)
label_txt("EVERY OTHER VENDOR", 0.4*inch, PH - 0.75*inch, color=RED)
c.setFillColor(MUTED); c.setFont("Helvetica-BoldOblique", 20)
c.drawString(0.4*inch, PH - 1.35*inch, '"Bolted AI onto the old model"')

old = ["Faster summaries from the same slow meeting",
       "Smarter notes. Same 30-day mobilization cycle.",
       "AI tools. No operating model change.",
       "Competes with Copilot. We don't."]
for i, line in enumerate(old):
    yt = PH - 2.15*inch - i * 1.05*inch
    c.setFillColor(RED); c.setFont("Helvetica-Bold", 15)
    c.drawString(0.4*inch, yt, "✕")
    c.setFillColor(MUTED); c.setFont("Helvetica", 13)
    c.drawString(0.9*inch, yt, line)

label_txt("VAUGHNMARTIN", 6.6*inch, PH - 0.75*inch, color=GOLD)
c.setFillColor(WHITE); c.setFont("Helvetica-BoldOblique", 19)
c.drawString(6.5*inch, PH - 1.35*inch, '"Rebuilt the operating model"')

new = ["Pre-staged before any trigger fires",
       "Proprietary IDEA Framework — 3 years to build",
       "Orchestrates the Microsoft stack — doesn't replace it",
       "Competes with the 40-year-old meeting model"]
for i, line in enumerate(new):
    yt = PH - 2.15*inch - i * 1.05*inch
    c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 15)
    c.drawString(6.5*inch, yt, "✓")
    c.setFillColor(WHITE); c.setFont("Helvetica", 13)
    c.drawString(7.0*inch, yt, line)

c.setStrokeColor(MID); c.setLineWidth(0.5); c.line(6.4*inch, 0.3*inch, 6.4*inch, PH - 0.3*inch)
slide_num(5)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 6 — How It Executes
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
label_txt("HOW IT EXECUTES", 0.5*inch, PH - 0.75*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 24)
c.drawCentredString(PW/2, PH - 1.2*inch, "The preparation architecture that exists before the trigger fires")

chain = [("SIG","Signal\nDetected",False),("SCR","Scored &\nClassified",False),
         ("PRO","Protocol\nActivates",True),("STK","Stakeholders\nNotified",False),
         ("AUTH","Executive\nAuthorizes",False),("EXE","Execution\nBegins",True)]
for i, (abbr, lbl, hero) in enumerate(chain):
    cx = 0.7*inch + i * 2.1*inch
    cy = PH - 3.6*inch
    r = 0.65*inch
    c.setFillColor(GOLD if hero else colors.HexColor("#182252"))
    c.setStrokeColor(GOLD); c.setLineWidth(1.5)
    c.circle(cx + r, cy + r, r, fill=1, stroke=0 if hero else 1)
    c.setFillColor(NAVY if hero else GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(cx + r, cy + r - 4, abbr)
    c.setFillColor(WHITE); c.setFont("Helvetica", 10)
    for j, ln in enumerate(lbl.split("\n")):
        c.drawCentredString(cx + r, cy - 0.22*inch - j*0.17*inch, ln)
    if i < 5:
        c.setFillColor(GOLD)
        c.rect(cx + 2*r + 0.03*inch, cy + r - 1.5, 0.5*inch, 3, fill=1, stroke=0)

c.setFillColor(colors.HexColor("#182620"))
c.rect(0.5*inch, PH - 4.4*inch, 5.8*inch, 0.45*inch, fill=1, stroke=0)
c.setStrokeColor(TEAL); c.setLineWidth(0.8)
c.rect(0.5*inch, PH - 4.4*inch, 5.8*inch, 0.45*inch, fill=0, stroke=1)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 13)
c.drawString(0.7*inch, PH - 4.2*inch, "✓  Complete in 12 minutes")
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 12)
c.drawString(6.5*inch, PH - 4.2*inch, "The alternative: 30 days before execution begins")

embed_img("screenshots/slide_mission_control.jpg",
    0.5*inch, 0.6*inch, 8.5*inch, 2.45*inch)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 10)
c.drawString(9.2*inch, PH - 5.8*inch, "Mission Control")
c.drawString(9.2*inch, PH - 6.05*inch, "Executive-authorized execution")
c.drawString(9.2*inch, PH - 6.3*inch, "Live in production")

slide_num(6)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 7 — Return on Readiness
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
label_txt("RETURN ON READINESS", 0.5*inch, PH - 0.75*inch)
stat_big("3,600×", "Execution Head Start vs. Old Model", 0.5*inch, PH - 2.3*inch)
stat_big("$120K", "Platform Cost · Annual", 0.5*inch, PH - 3.9*inch, col=WHITE, subsize=12)
gold_rule(0.5*inch, PH - 4.55*inch, 4.5*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 15)
c.drawString(0.5*inch, PH - 4.85*inch, "Breaks even before the second activation.")

label_txt("THE BUSINESS CASE", 5.5*inch, PH - 0.75*inch)
roi_rows = [
    ("Consulting Retainer Replaced", "$400K – $800K / yr", GOLD),
    ("Platform Cost", "$60K – $240K / yr", WHITE),
    ("Break-Even Point", "2nd Activation", TEAL),
    ("3-Year Net Value", "Live at /roi-calculator", GOLD),
    ("Budget Line Already Exists", "Replaces existing retainer", TEAL),
]
for i, (lbl, val, vcol) in enumerate(roi_rows):
    yt = PH - 1.2*inch - i * 1.03*inch
    bg_col = colors.HexColor("#121A44") if i % 2 == 0 else colors.HexColor("#0E1438")
    c.setFillColor(bg_col)
    c.rect(5.5*inch, yt - 0.45*inch, 7.3*inch, 0.88*inch, fill=1, stroke=0)
    c.setFillColor(MUTED); c.setFont("Helvetica", 12)
    c.drawString(5.7*inch, yt, lbl)
    c.setFillColor(vcol); c.setFont("Helvetica-Bold", 12)
    c.drawRightString(PW - 0.35*inch, yt, val)

c.setFillColor(colors.HexColor("#0C1236"))
c.rect(5.5*inch, 0.35*inch, 7.3*inch, 0.88*inch, fill=1, stroke=0)
c.setStrokeColor(GOLD); c.setLineWidth(2)
c.line(5.5*inch, 0.35*inch, 5.5*inch, 1.23*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 10)
c.drawString(5.7*inch, 0.8*inch,
    '"We\'re not adding to the budget. We\'re replacing a line item every Fortune 1000 already pays."')

slide_num(7)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 8 — Built. In Production.
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
label_txt("BUILT. IN PRODUCTION. RIGHT NOW.", 0.5*inch, PH - 0.75*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 28)
c.drawCentredString(PW/2, PH - 1.25*inch, "The system is live — not a demo, not a roadmap")

stats = [("170","Readiness Protocols\nPre-Staged",GOLD),
         ("221","Strategic Triggers\nMapped",GOLD),
         ("248","Data Points Monitored\nEvery 15 Minutes",TEAL),
         ("12","Compound Protocols\nMulti-Domain",GOLD)]
for i, (num, sub, col) in enumerate(stats):
    sx = 0.35*inch + i * 3.25*inch
    c.setFillColor(DARK)
    c.rect(sx, PH - 3.45*inch, 3.1*inch, 1.6*inch, fill=1, stroke=0)
    c.setFillColor(col); c.setFont("Helvetica-Bold", 44)
    c.drawCentredString(sx + 1.55*inch, PH - 2.3*inch, num)
    c.setFillColor(MUTED); c.setFont("Helvetica", 11)
    for j, ln in enumerate(sub.split("\n")):
        c.drawCentredString(sx + 1.55*inch, PH - 2.95*inch - j*0.18*inch, ln)

c.setFillColor(colors.HexColor("#182620"))
c.rect(3.1*inch, PH - 4.05*inch, 7.0*inch, 0.45*inch, fill=1, stroke=0)
c.setStrokeColor(TEAL); c.setLineWidth(0.8)
c.rect(3.1*inch, PH - 4.05*inch, 7.0*inch, 0.45*inch, fill=0, stroke=1)
c.setFillColor(TEAL); c.setFont("Helvetica-Bold", 11)
c.drawCentredString(PW/2, PH - 3.83*inch,
    "●  vaughnmartin.com · Signal Detection Active · Updated Every 15 Minutes")

shots = [("screenshots/deck_signals.jpg","Signal Intelligence · Live detections"),
         ("screenshots/deck_protocol_library.jpg","170 Readiness Protocols · Pre-staged"),
         ("screenshots/deck_roi_calc.jpg","ROI Calculator · Value quantified")]
for i, (path, cap) in enumerate(shots):
    ix = 0.35*inch + i * 4.35*inch
    iy = 0.6*inch
    embed_img(path, ix, iy + 0.22*inch, 4.1*inch, 2.55*inch)
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(ix + 2.05*inch, iy + 0.05*inch, cap.upper())

slide_num(8)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 9 — Market Opportunity
# ══════════════════════════════════════════════════
light_bg(); gold_bar()

c.setStrokeColor(GOLD); c.setLineWidth(3.5)
c.line(0.5*inch, PH - 0.92*inch, 0.5*inch, PH - 0.85*inch)
label_txt("THE MARKET OPPORTUNITY", 0.6*inch, PH - 0.78*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 32)
for i, ln in enumerate(["Preparation", "infrastructure", "does not exist yet."]):
    c.drawString(0.6*inch, PH - 1.55*inch - i * 0.6*inch, ln)
gold_rule(0.6*inch, PH - 4.0*inch, 4.5*inch)
c.setFillColor(IVORY); c.setFont("Helvetica-Oblique", 17)
c.drawString(0.6*inch, PH - 4.35*inch, "That's not a problem.")
c.drawString(0.6*inch, PH - 4.65*inch, "That's the entire opportunity.")

label_txt("WHY NOW · WHY VAUGHNMARTIN", 6.2*inch, PH - 0.78*inch, color=NAVY)
points = [
    ("01", "Every Fortune 1000 has Microsoft's AI stack. None have the operating model to use it at trigger speed. Readiness OS is the layer above."),
    ("02", "The category doesn't exist yet. First-mover advantage in preparation infrastructure is the same position ERP held in the 1990s."),
    ("03", "Enterprise AI budgets are growing. The operating model gap is growing faster. That gap is our product."),
    ("04", "We built the IDEA Framework — 170 protocols across 3 years. Not recreatable in a product cycle. A structural moat."),
]
for i, (num, text) in enumerate(points):
    yt = PH - 1.15*inch - i * 1.4*inch
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 22)
    c.drawString(6.2*inch, yt, num)
    lines = wrap_text(text, "Helvetica", 12, 5.8*inch)
    c.setFillColor(colors.HexColor("#222B44"))
    c.setFont("Helvetica", 12)
    for j, ln in enumerate(lines):
        c.drawString(6.9*inch, yt - j * 0.2*inch, ln)
    if i < 3: divider_h(6.2*inch, yt - 0.7*inch, 6.7*inch, color=colors.HexColor("#CCC8BE"))

slide_num(9)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 10 — Founding Partner Program
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()
label_txt("FOUNDING PARTNER PROGRAM", 0.5*inch, PH - 0.75*inch)
c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 42)
for i, ln in enumerate(["Twelve", "organizations.", "One first cohort."]):
    c.drawString(0.5*inch, PH - 1.55*inch - i * 0.7*inch, ln)
gold_rule(0.5*inch, PH - 4.0*inch, 5.0*inch)
c.setFillColor(MUTED); c.setFont("Helvetica-Oblique", 16)
c.drawString(0.5*inch, PH - 4.3*inch, "We're not looking for customers.")
c.drawString(0.5*inch, PH - 4.6*inch, "We're selecting partners who will define the category.")

label_txt("THE ASK", 6.3*inch, PH - 0.75*inch)
ask_items = [
    ("PROGRAM", "Founding Partner Program · 90-Day Validation", WHITE),
    ("COHORT SIZE", "12 Organizations · Fortune 1000", GOLD),
    ("USE OF FUNDS", "Protocol Expansion · Sales Infrastructure · Category Establishment", WHITE),
    ("WHY THIS ROOM", "Investors who see the category before the category exists", GOLD),
]
for i, (lbl, val, vcol) in enumerate(ask_items):
    yt = PH - 1.15*inch - i * 1.4*inch
    bg_col = colors.HexColor("#121A44") if i % 2 == 0 else colors.HexColor("#0E1438")
    c.setFillColor(bg_col)
    c.rect(6.3*inch, yt - 0.65*inch, 6.6*inch, 1.2*inch, fill=1, stroke=0)
    label_txt(lbl, 6.5*inch, yt, color=MUTED, size=9)
    c.setFillColor(vcol); c.setFont("Helvetica-Bold", 13)
    lines = wrap_text(val, "Helvetica-Bold", 13, 5.9*inch)
    for j, ln in enumerate(lines):
        c.drawString(6.5*inch, yt - 0.18*inch - j*0.22*inch, ln)

c.setStrokeColor(MID); c.setLineWidth(0.5); c.line(6.25*inch, 0.3*inch, 6.25*inch, PH - 0.3*inch)
slide_num(10)
c.showPage()

# ══════════════════════════════════════════════════
# SLIDE 11 — Three Sentences
# ══════════════════════════════════════════════════
navy_bg(); gold_bar()

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 12)
c.drawCentredString(PW/2, PH - 0.75*inch, "Three sentences. That's the whole pitch.")

sentences = [
    ("PROBLEM", GOLD, "No preparation infrastructure exists. Strategic triggers arrive in real time — the mobilization cycle still averages 30 days."),
    ("SOLUTION", GOLD, "We rebuilt the operating model. Pre-staged execution replaces real-time coordination — 12 minutes, not 30 days."),
    ("ROI", TEAL, "At $120K, we replace a $400K–$800K retainer. Break-even before the second activation. The budget line already exists."),
]
for i, (tag, accent, body) in enumerate(sentences):
    yt = PH - 1.3*inch - i * 1.7*inch
    c.setFillColor(colors.HexColor("#101842"))
    c.rect(0.7*inch, yt - 0.8*inch, 11.9*inch, 1.5*inch, fill=1, stroke=0)
    c.setStrokeColor(accent); c.setLineWidth(3.5)
    c.line(0.7*inch, yt - 0.8*inch, 0.7*inch, yt + 0.7*inch)
    label_txt(tag, 0.95*inch, yt, color=MUTED, size=9)
    lines = wrap_text(body, "Helvetica-Bold", 15, 10.5*inch)
    c.setFillColor(WHITE); c.setFont("Helvetica-Bold", 15)
    for j, ln in enumerate(lines):
        c.drawString(2.1*inch, yt - 0.1*inch - j*0.25*inch, ln)

c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 14)
c.drawCentredString(PW/2, 1.0*inch, "vaughnmartin.com/founding-partner-program")
c.setFillColor(colors.HexColor("#444E70")); c.setFont("Helvetica-Bold", 10)
c.drawCentredString(PW/2, 0.65*inch,
    "VaughnMartin · Readiness OS · The response is ready before the trigger fires")

slide_num(11)
c.showPage()

c.save()
import os
size_kb = os.path.getsize(OUT) // 1024
print(f"PDF saved → {OUT}  ({size_kb} KB, 11 pages)")
