from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import textwrap

ROOT = Path(__file__).resolve().parents[1]
SHOT_DIR = ROOT / 'assets' / 'screenshots'
SHOT_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1440, 920
BG = '#f4f8f5'
WHITE = '#ffffff'
GREEN = '#0f7b35'
GREEN2 = '#149545'
NAVY = '#0f172a'
TEXT = '#10231a'
MUTED = '#5f6f65'
BORDER = '#d7e3d9'
LIGHT = '#f8fcf8'
SOFT = '#edf6ef'
WARN = '#b45309'
RED = '#d92d20'
BLUE = '#1d4ed8'


def font(size, bold=False):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/dejavu/DejaVuSans.ttf'
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()

F12 = font(12)
F14 = font(14)
F16 = font(16)
F18 = font(18)
F22 = font(22, True)
F26 = font(26, True)
F34 = font(34, True)
F46 = font(46, True)


def rounded(draw, xy, fill, outline=None, radius=18, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def txt(draw, xy, text, fill=TEXT, font_obj=F16, anchor=None):
    draw.text(xy, text, fill=fill, font=font_obj, anchor=anchor)


def para(draw, xy, text, width_chars, fill=TEXT, font_obj=F16, gap=6):
    y = xy[1]
    for line in textwrap.wrap(text, width=width_chars):
        draw.text((xy[0], y), line, fill=fill, font=font_obj)
        y += font_obj.size + gap
    return y


def frame(title, active='Dashboard'):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, 48), fill=NAVY)
    txt(d, (36, 15), 'Government of Pakistan • NADRA • Regional Network Operations', fill='#d6e2f6', font_obj=F14)
    rounded(d, (26, 68, 1414, 154), WHITE, BORDER, 24)
    txt(d, (54, 92), 'NADRA LinkOps AI', fill=TEXT, font_obj=F34)
    txt(d, (54, 126), 'Complaint Desk, Disruption Reporting, Telecom Escalation, and AD Support Tracker', fill=MUTED, font_obj=F14)
    rounded(d, (1142, 92, 1278, 132), LIGHT, BORDER, 14)
    rounded(d, (1290, 92, 1390, 132), GREEN, None, 14)
    txt(d, (1210, 112), 'Reload Data', fill=TEXT, font_obj=F14, anchor='mm')
    txt(d, (1340, 112), 'Export', fill=WHITE, font_obj=F14, anchor='mm')
    rounded(d, (26, 176, 932, 316), WHITE, BORDER, 24)
    rounded(d, (956, 176, 1414, 316), WHITE, BORDER, 24)
    txt(d, (54, 206), 'Empowerment through Connectivity', fill=TEXT, font_obj=F34)
    para(d, (54, 252), 'Manage complaints from NADRA DAUs across Quetta Region, track genuine vs non-connectivity issues, generate monthly disruption reports, and respond faster with AI-assisted telecom escalations.', 78, fill=MUTED, font_obj=F16)
    tabs = ['Dashboard', 'Complaints', 'AD Support', 'Reports', 'AI Assistant']
    x = 26
    y = 338
    for tab in tabs:
        active_tab = tab == active
        rounded(d, (x, y, x + 156, y + 44), GREEN if active_tab else WHITE, None if active_tab else BORDER, 22)
        txt(d, (x + 78, y + 22), tab, fill=WHITE if active_tab else TEXT, font_obj=F14, anchor='mm')
        x += 168
    return img, d


def shot_dashboard():
    img, d = frame('Dashboard', 'Dashboard')
    cards = [
        ('Total Complaints', '10', GREEN), ('Resolved', '5', GREEN2), ('Open / In Progress', '2', WARN),
        ('Genuine Connectivity', '6', GREEN), ('Non-Connectivity', '4', RED), ('Average Downtime', '3.0h', BLUE)
    ]
    x0, y0 = 26, 410
    for i, (label, val, color) in enumerate(cards):
        col, row = i % 3, i // 3
        x = x0 + col * 462
        y = y0 + row * 154
        rounded(d, (x, y, x + 434, y + 126), WHITE, BORDER, 22)
        txt(d, (x + 18, y + 20), label, fill=MUTED, font_obj=F16)
        txt(d, (x + 18, y + 58), val, fill=color, font_obj=F46)
        txt(d, (x + 18, y + 98), 'Live KPI from saved complaint records', fill=MUTED, font_obj=F12)
    rounded(d, (26, 722, 820, 892), WHITE, BORDER, 22)
    rounded(d, (844, 722, 1414, 892), WHITE, BORDER, 22)
    txt(d, (50, 748), 'Provider-wise complaint volume', font_obj=F26)
    providers = [('PTCL DSL', 4), ('Wateen', 2), ('VSAT', 1), ('DRS', 1), ('3G/4G', 2)]
    yy = 794
    for n, v in providers:
        txt(d, (50, yy), n, fill=TEXT, font_obj=F16)
        rounded(d, (220, yy + 4, 690, yy + 20), SOFT, None, 8)
        rounded(d, (220, yy + 4, 220 + v * 105, yy + 20), GREEN, None, 8)
        txt(d, (714, yy), str(v), font_obj=F16)
        yy += 28
    txt(d, (868, 748), 'Recent complaints', font_obj=F26)
    headers = ['ID', 'DAU', 'Provider', 'Status']
    xs = [868, 1038, 1170, 1290]
    for h, x in zip(headers, xs):
        txt(d, (x, 792), h, fill=MUTED, font_obj=F14)
    rows = [
        ('1007', 'Khuzdar', 'PTCL', 'Open'),
        ('1002', 'Chaman', 'Wateen', 'In Progress'),
        ('1001', 'Pishin', 'PTCL', 'Resolved'),
    ]
    yy = 826
    for row in rows:
        d.line((860, yy - 8, 1390, yy - 8), fill=BORDER, width=1)
        for i, (v, x) in enumerate(zip(row, xs)):
            fill = TEXT
            if i == 3 and v == 'Open': fill = WARN
            if i == 3 and v == 'In Progress': fill = BLUE
            if i == 3 and v == 'Resolved': fill = GREEN
            txt(d, (x, yy), v, fill=fill, font_obj=F14)
        yy += 26
    return img


def shot_complaints():
    img, d = frame('Complaints', 'Complaints')
    rounded(d, (26, 410, 1414, 486), WHITE, BORDER, 22)
    txt(d, (50, 436), 'Formal complaint desk', fill=GREEN, font_obj=F14)
    txt(d, (50, 456), 'The complaint page is now separated into clear blocks: public site directory, complaint intake form, and complaint register.', fill=MUTED, font_obj=F16)
    rounded(d, (26, 508, 1414, 892), WHITE, BORDER, 22)
    txt(d, (50, 536), 'Complaint intake form', font_obj=F26)
    txt(d, (50, 566), 'Section A — Site details', fill=GREEN, font_obj=F18)
    fields = [
        ('Site Template', 'NRC Pishin'), ('DAU / Site Name', 'NRC Pishin'), ('District / City', 'Pishin'), ('Incharge Name', 'Muhammad Bilal'),
        ('Provider / Media', 'PTCL DSL'), ('Issue Type', 'Link Down'), ('Disruption Start', '2026-07-19 09:20'), ('Status', 'Open')
    ]
    x0, y0 = 50, 604
    for i, (lab, val) in enumerate(fields):
        col, row = i % 2, i // 2
        x = x0 + col * 660
        y = y0 + row * 82
        txt(d, (x, y), lab, fill=MUTED, font_obj=F14)
        rounded(d, (x, y + 22, x + 610, y + 62), WHITE, BORDER, 14)
        txt(d, (x + 16, y + 34), val, fill=TEXT, font_obj=F14)
    rounded(d, (50, 784, 1368, 836), SOFT, BORDER, 16)
    txt(d, (66, 803), 'Public site note: address and timing appear here after selecting a Quetta-region site template.', fill=MUTED, font_obj=F14)
    rounded(d, (50, 848, 180, 882), GREEN, None, 14)
    rounded(d, (194, 848, 316, 882), WHITE, BORDER, 14)
    txt(d, (115, 865), 'Save Complaint', fill=WHITE, font_obj=F14, anchor='mm')
    txt(d, (255, 865), 'Clear Form', fill=TEXT, font_obj=F14, anchor='mm')
    return img


def shot_ai():
    img, d = frame('AI Assistant', 'AI Assistant')
    rounded(d, (26, 410, 520, 892), WHITE, BORDER, 22)
    rounded(d, (544, 410, 1414, 892), WHITE, BORDER, 22)
    txt(d, (50, 438), 'AI escalation assistant', font_obj=F26)
    txt(d, (50, 486), 'Select Complaint', fill=MUTED, font_obj=F14)
    rounded(d, (50, 510, 488, 552), WHITE, BORDER, 14)
    txt(d, (66, 524), 'NADRA-NET-2026-1007 — Khuzdar (PTCL DSL)', font_obj=F14)
    txt(d, (50, 590), 'Extra context', fill=MUTED, font_obj=F14)
    rounded(d, (50, 614, 488, 760), WHITE, BORDER, 14)
    para(d, (66, 630), 'NMS shows primary PTCL down. Branch operations affected. HQ must be kept in CC. Backup SIM also not passing traffic.', 42, fill=TEXT, font_obj=F14)
    rounded(d, (50, 786, 212, 826), GREEN, None, 14)
    rounded(d, (226, 786, 378, 826), WHITE, BORDER, 14)
    txt(d, (131, 806), 'Draft AI Response', fill=WHITE, font_obj=F14, anchor='mm')
    txt(d, (302, 806), 'Show Prompt', fill=TEXT, font_obj=F14, anchor='mm')
    txt(d, (568, 438), 'AI output', font_obj=F26)
    rounded(d, (568, 474, 1388, 864), LIGHT, BORDER, 18)
    content = [
        ('Classification', 'Genuine connectivity issue — likely WAN/provider-side disruption.'),
        ('Severity', 'Critical'),
        ('Escalation Email', 'Subject: Urgent Connectivity Issue at NRC Khuzdar - NADRA-NET-2026-1007. Dear PTCL Support Team...'),
        ('DAU Update', 'Dear site incharge, your complaint has been checked and escalated. HQ is informed.'),
        ('Next Technical Steps', '1. Reconfirm alarms. 2. Verify power/router. 3. Follow up telco ticket. 4. Record final restoration time.')
    ]
    yy = 500
    for title, body in content:
        txt(d, (590, yy), title, fill=GREEN, font_obj=F18)
        yy += 26
        yy = para(d, (590, yy), body, 72, fill=TEXT, font_obj=F14, gap=4) + 10
    return img


def shot_reports():
    img, d = frame('Reports', 'Reports')
    rounded(d, (26, 410, 1000, 892), WHITE, BORDER, 22)
    rounded(d, (1024, 410, 1414, 892), WHITE, BORDER, 22)
    txt(d, (50, 438), 'Monthly disruption report', font_obj=F26)
    rounded(d, (702, 430, 824, 470), WHITE, BORDER, 14)
    rounded(d, (838, 430, 986, 470), GREEN, None, 14)
    txt(d, (763, 450), '2026-07', font_obj=F14, anchor='mm')
    txt(d, (912, 450), 'Generate', fill=WHITE, font_obj=F14, anchor='mm')
    rounded(d, (50, 492, 972, 570), SOFT, BORDER, 16)
    para(d, (66, 514), 'Month: 2026-07 | Total Complaints: 7 | Resolved: 3 | Open/In Progress: 2 | Genuine Connectivity Issues: 4 | Non-Connectivity: 3 | Provider Mix: PTCL DSL: 2 | Wateen: 1 | VSAT: 1 | DRS: 1 | 3G/4G SIM: 2', 104, fill=MUTED, font_obj=F16)
    headers = ['DAU Name', 'Incharge', 'Complaint ID', 'Issue', 'Provider', 'Status']
    xs = [50, 230, 390, 570, 740, 880]
    for h, x in zip(headers, xs):
        txt(d, (x, 614), h, fill=MUTED, font_obj=F14)
    rows = [
        ('Khuzdar', 'Shabbir', '1007', 'Link Down', 'PTCL', 'Open'),
        ('Chaman', 'Qadir', '1002', 'Flapping', 'Wateen', 'In Progress'),
        ('Pishin', 'Bilal', '1001', 'Link Down', 'PTCL', 'Resolved')
    ]
    yy = 648
    for row in rows:
        d.line((50, yy - 8, 956, yy - 8), fill=BORDER, width=1)
        for i, (v, x) in enumerate(zip(row, xs)):
            fill = TEXT
            if i == 5 and v == 'Open': fill = WARN
            if i == 5 and v == 'In Progress': fill = BLUE
            if i == 5 and v == 'Resolved': fill = GREEN
            txt(d, (x, yy), v, fill=fill, font_obj=F14)
        yy += 38
    txt(d, (1048, 438), 'Backup & actions', font_obj=F22)
    buttons = ['Download sample dataset', 'Import backup JSON', 'Clear local data']
    by = 492
    for i, b in enumerate(buttons):
        rounded(d, (1048, by, 1386, by + 46), GREEN if i == 0 else WHITE, None if i == 0 else BORDER, 14)
        txt(d, (1217, by + 23), b, fill=WHITE if i == 0 else TEXT, font_obj=F14, anchor='mm')
        by += 62
    rounded(d, (1048, 706, 1386, 862), SOFT, BORDER, 16)
    para(d, (1066, 726), 'This demo stores data in browser localStorage for easy deployment. A future production version can use Supabase or PostgreSQL.', 30, fill=MUTED, font_obj=F16)
    return img


def main():
    images = {
        'dashboard.png': shot_dashboard(),
        'complaints.png': shot_complaints(),
        'ai-assistant.png': shot_ai(),
        'reports.png': shot_reports(),
    }
    for name, img in images.items():
        img.save(SHOT_DIR / name)
    print('Updated screenshots saved.')

if __name__ == '__main__':
    main()
