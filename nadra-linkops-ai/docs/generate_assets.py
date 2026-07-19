from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import textwrap

ROOT = Path(__file__).resolve().parents[1]
SHOT_DIR = ROOT / 'assets' / 'screenshots'
DOCS_DIR = ROOT / 'docs'
TUTORIAL_DIR = DOCS_DIR / 'tutorial_pages'
SHOT_DIR.mkdir(parents=True, exist_ok=True)
TUTORIAL_DIR.mkdir(parents=True, exist_ok=True)

BG = '#0b1220'
PANEL = '#121b2e'
PANEL2 = '#16233d'
BORDER = '#253554'
TEXT = '#e8eefc'
MUTED = '#9fb0d6'
ACCENT = '#5ad0ff'
GREEN = '#84f0b2'
YELLOW = '#ffcf66'
RED = '#ff6b81'
WHITE = '#ffffff'


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
F20 = font(20)
F22 = font(22)
F24 = font(24, bold=True)
F28 = font(28, bold=True)
F38 = font(38, bold=True)
F48 = font(48, bold=True)


def rounded(draw, xy, fill, outline=None, radius=18, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, fill=TEXT, font_obj=F16, anchor=None):
    draw.text(xy, value, fill=fill, font=font_obj, anchor=anchor)


def wrapped(draw, xy, value, width_chars, fill=TEXT, font_obj=F16, line_gap=6):
    lines = textwrap.wrap(value, width=width_chars)
    y = xy[1]
    for line in lines:
        draw.text((xy[0], y), line, fill=fill, font=font_obj)
        y += font_obj.size + line_gap
    return y


def canvas(title, subtitle='Quetta Region network operations app preview'):
    img = Image.new('RGB', (1440, 920), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 1440, 920), fill=BG)
    # topbar
    rounded(draw, (30, 24, 1410, 110), fill=PANEL, outline=BORDER, radius=22)
    text(draw, (56, 52), 'NADRA LinkOps AI', font_obj=F28, fill=WHITE)
    text(draw, (56, 84), subtitle, font_obj=F14, fill=MUTED)
    rounded(draw, (1100, 46, 1230, 86), fill='#223452', outline=BORDER, radius=14)
    rounded(draw, (1250, 46, 1384, 86), fill=ACCENT, outline=None, radius=14)
    text(draw, (1165, 66), 'Sample Data', font_obj=F14, fill=TEXT, anchor='mm')
    text(draw, (1318, 66), 'Export JSON', font_obj=F14, fill='#06111c', anchor='mm')
    text(draw, (56, 140), title, font_obj=F38, fill=WHITE)
    return img, draw


def draw_tabs(draw, active_idx=0):
    tabs = ['Dashboard', 'Complaints', 'AD Support', 'Reports', 'AI Assistant', 'Docs']
    x = 56
    y1 = 200
    for i, label in enumerate(tabs):
        fill = '#24436a' if i == active_idx else PANEL
        outline = ACCENT if i == active_idx else BORDER
        rounded(draw, (x, y1, x + 155, y1 + 44), fill=fill, outline=outline, radius=14)
        text(draw, (x + 77, y1 + 23), label, font_obj=F14, fill=WHITE, anchor='mm')
        x += 166


def screenshot_dashboard():
    img, draw = canvas('Dashboard overview')
    draw_tabs(draw, 0)
    stats = [
        ('Total Complaints', '10', ACCENT),
        ('Resolved', '5', GREEN),
        ('Open / In Progress', '2', YELLOW),
        ('Genuine Connectivity', '6', ACCENT),
        ('Non-Connectivity', '4', RED),
        ('Average Downtime', '3.0h', GREEN),
    ]
    x, y = 56, 270
    for i, (label, value, color) in enumerate(stats):
        col = i % 3
        row = i // 3
        lx = x + col * 442
        ty = y + row * 150
        rounded(draw, (lx, ty, lx + 414, ty + 122), fill=PANEL, outline=BORDER, radius=20)
        text(draw, (lx + 20, ty + 22), label, font_obj=F16, fill=MUTED)
        text(draw, (lx + 20, ty + 64), value, font_obj=F48, fill=color)
        text(draw, (lx + 20, ty + 98), 'Live KPI from complaint records', font_obj=F12, fill=MUTED)
    # provider chart
    rounded(draw, (56, 590, 810, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (80, 620), 'Provider-wise complaint volume', font_obj=F24, fill=WHITE)
    providers = [('PTCL DSL', 4), ('Wateen', 2), ('VSAT', 1), ('DRS', 1), ('3G/4G', 2)]
    maxv = max(v for _, v in providers)
    yy = 678
    for name, val in providers:
        text(draw, (82, yy), name, font_obj=F16, fill=TEXT)
        rounded(draw, (260, yy + 4, 710, yy + 22), fill='#0a1527', outline=BORDER, radius=10)
        rounded(draw, (260, yy + 4, 260 + int((val / maxv) * 450), yy + 22), fill=ACCENT, radius=10)
        text(draw, (735, yy + 2), str(val), font_obj=F16, fill=WHITE)
        yy += 38
    # recent complaints table
    rounded(draw, (836, 590, 1384, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (860, 620), 'Recent complaints', font_obj=F24, fill=WHITE)
    table_rows = [
        ('NADRA-NET-2026-1007', 'Khuzdar', 'PTCL DSL', 'Open'),
        ('NADRA-NET-2026-1002', 'Chaman', 'Wateen', 'In Progress'),
        ('NADRA-NET-2026-1001', 'Pishin', 'PTCL DSL', 'Resolved'),
        ('NADRA-NET-2026-1008', 'K. Abdullah', '3G/4G', 'Not Connectivity'),
    ]
    headers = ['ID', 'DAU', 'Provider', 'Status']
    xs = [860, 1035, 1140, 1260]
    for h, hx in zip(headers, xs):
        text(draw, (hx, 662), h, font_obj=F14, fill=MUTED)
    yy = 698
    for row in table_rows:
        draw.line((852, yy - 8, 1368, yy - 8), fill=BORDER, width=1)
        for cell, hx in zip(row, xs):
            color = TEXT
            if cell == 'Open': color = YELLOW
            if cell == 'In Progress': color = ACCENT
            if cell == 'Resolved': color = GREEN
            if cell == 'Not Connectivity': color = RED
            text(draw, (hx, yy), cell, font_obj=F14, fill=color if hx == 1260 else TEXT)
        yy += 40
    return img


def screenshot_complaints():
    img, draw = canvas('Complaint register and disruption logging')
    draw_tabs(draw, 1)
    rounded(draw, (56, 270, 550, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (80, 302), 'Log a connectivity complaint', font_obj=F24, fill=WHITE)
    labels = ['DAU Name', 'District', 'Incharge Name', 'Complaint ID', 'Provider', 'Disruption Start', 'Status', 'Remarks']
    coords = [(80, 350), (80, 430), (80, 510), (80, 590), (80, 670), (300, 670), (300, 590), (80, 750)]
    for (lab, (x, y)) in zip(labels, coords):
        text(draw, (x, y), lab, font_obj=F14, fill=MUTED)
        rounded(draw, (x, y + 24, x + (180 if x < 250 else 200), y + 62), fill='#0a1527', outline=BORDER, radius=12)
    text(draw, (102, 398), 'NADRA DAU Pishin', font_obj=F14, fill=TEXT)
    text(draw, (102, 478), 'Pishin', font_obj=F14, fill=TEXT)
    text(draw, (102, 558), 'Muhammad Bilal', font_obj=F14, fill=TEXT)
    text(draw, (102, 638), 'NADRA-NET-2026-1001', font_obj=F14, fill=TEXT)
    text(draw, (102, 718), 'PTCL DSL', font_obj=F14, fill=TEXT)
    text(draw, (322, 638), 'Resolved', font_obj=F14, fill=GREEN)
    text(draw, (322, 718), '2026-07-17 09:10', font_obj=F14, fill=TEXT)
    text(draw, (102, 798), 'NMS checked, PTCL escalated, HQ CC.', font_obj=F14, fill=TEXT)
    rounded(draw, (80, 824, 220, 856), fill=ACCENT, radius=12)
    rounded(draw, (234, 824, 354, 856), fill='#223452', outline=BORDER, radius=12)
    text(draw, (150, 840), 'Save Complaint', font_obj=F14, fill='#06111c', anchor='mm')
    text(draw, (294, 840), 'Clear', font_obj=F14, fill=TEXT, anchor='mm')

    rounded(draw, (576, 270, 1384, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (600, 302), 'Complaint Register', font_obj=F24, fill=WHITE)
    rounded(draw, (1020, 290, 1205, 330), fill='#0a1527', outline=BORDER, radius=12)
    rounded(draw, (1218, 290, 1334, 330), fill='#0a1527', outline=BORDER, radius=12)
    text(draw, (1112, 310), 'Search...', font_obj=F14, fill=MUTED, anchor='mm')
    text(draw, (1276, 310), 'All Statuses', font_obj=F14, fill=MUTED, anchor='mm')

    cols = [600, 750, 880, 1020, 1138, 1262, 1334]
    headers = ['ID', 'DAU', 'Incharge', 'Provider', 'Issue', 'Status', 'Actions']
    for h, x in zip(headers, cols):
        text(draw, (x, 368), h, font_obj=F14, fill=MUTED)
    rows = [
        ('1007', 'Khuzdar', 'Shabbir', 'PTCL DSL', 'Link Down', 'Open'),
        ('1002', 'Chaman', 'A. Qadir', 'Wateen', 'Flapping', 'In Progress'),
        ('1001', 'Pishin', 'M. Bilal', 'PTCL DSL', 'Link Down', 'Resolved'),
        ('1004', 'Nushki', 'Aamir Shah', '3G/4G', 'LAN Issue', 'Not Connectivity')
    ]
    yy = 410
    for row in rows:
        draw.line((592, yy - 10, 1368, yy - 10), fill=BORDER, width=1)
        values = list(row) + ['Edit  AI  Delete']
        xs = cols
        for idx, (val, x) in enumerate(zip(values, xs)):
            fill = TEXT
            if idx == 5 and val == 'Open': fill = YELLOW
            if idx == 5 and val == 'In Progress': fill = ACCENT
            if idx == 5 and val == 'Resolved': fill = GREEN
            if idx == 5 and val == 'Not Connectivity': fill = RED
            text(draw, (x, yy), val, font_obj=F14, fill=fill)
        yy += 52
    return img


def screenshot_ai():
    img, draw = canvas('AI assistant for escalation drafting')
    draw_tabs(draw, 4)
    rounded(draw, (56, 270, 520, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (80, 302), 'AI escalation assistant', font_obj=F24, fill=WHITE)
    text(draw, (80, 346), 'Select Complaint', font_obj=F14, fill=MUTED)
    rounded(draw, (80, 372, 490, 414), fill='#0a1527', outline=BORDER, radius=12)
    text(draw, (100, 386), 'NADRA-NET-2026-1007 — NADRA DAU Khuzdar', font_obj=F14, fill=TEXT)
    text(draw, (80, 452), 'Extra context', font_obj=F14, fill=MUTED)
    rounded(draw, (80, 478, 490, 652), fill='#0a1527', outline=BORDER, radius=12)
    wrapped(draw, (100, 496), 'NMS shows primary PTCL down. Branch operations affected. HQ must be kept in CC. Backup SIM also not passing traffic.', 38, fill=TEXT, font_obj=F14)
    rounded(draw, (80, 684, 230, 724), fill=ACCENT, radius=12)
    rounded(draw, (244, 684, 396, 724), fill='#223452', outline=BORDER, radius=12)
    text(draw, (155, 704), 'Draft AI Response', font_obj=F14, fill='#06111c', anchor='mm')
    text(draw, (320, 704), 'Show Prompt', font_obj=F14, fill=TEXT, anchor='mm')
    rounded(draw, (80, 754, 490, 834), fill='#18263f', outline=BORDER, radius=14)
    wrapped(draw, (98, 774), 'Live deployment tip: add OPENROUTER_API_KEY in Vercel. Fallback mode still works for demo.', 43, fill=MUTED, font_obj=F14)

    rounded(draw, (548, 270, 1384, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (572, 302), 'AI output', font_obj=F24, fill=WHITE)
    rounded(draw, (572, 336, 1356, 838), fill='#08111f', outline='#1e4b63', radius=14)
    sections = [
        ('Classification', 'Genuine connectivity issue — likely WAN/provider-side.'),
        ('Severity', 'Critical'),
        ('Escalation Email', 'Subject: Urgent Connectivity Issue at NADRA DAU Khuzdar (PTCL DSL) - NADRA-NET-2026-1007\nDear PTCL Support Team, please note both primary and backup services are affected...'),
        ('DAU Update', 'Dear Shabbir Bizenjo, your complaint has been escalated and HQ is informed.'),
        ('Next Technical Steps', '1. Reconfirm alarms. 2. Verify power/router. 3. Follow up PTCL ticket. 4. Record final restoration.')
    ]
    yy = 364
    for title, content in sections:
        text(draw, (594, yy), title, font_obj=F18, fill=GREEN)
        yy += 28
        yy = wrapped(draw, (594, yy), content, 74, fill=TEXT, font_obj=F14, line_gap=5) + 14
    return img


def screenshot_reports():
    img, draw = canvas('Monthly reporting and export workflow')
    draw_tabs(draw, 3)
    rounded(draw, (56, 270, 1008, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (80, 302), 'Monthly disruption report', font_obj=F24, fill=WHITE)
    rounded(draw, (700, 288, 830, 328), fill='#0a1527', outline=BORDER, radius=12)
    rounded(draw, (846, 288, 986, 328), fill=ACCENT, radius=12)
    text(draw, (765, 308), '2026-07', font_obj=F14, fill=TEXT, anchor='mm')
    text(draw, (916, 308), 'Generate Report', font_obj=F14, fill='#06111c', anchor='mm')
    rounded(draw, (80, 350, 984, 440), fill='#18263f', outline=BORDER, radius=14)
    wrapped(draw, (104, 372), 'Month: 2026-07 | Total Complaints: 7 | Resolved: 3 | Open/In Progress: 2 | Genuine Connectivity Issues: 4 | Non-Connectivity / False Alarm: 3 | Provider Mix: PTCL DSL: 2 | Wateen: 1 | VSAT: 1 | DRS: 1 | 3G/4G SIM: 2', 108, fill=MUTED, font_obj=F16)
    headers = ['DAU Name', 'Incharge', 'Complaint ID', 'Disruption Time', 'Nature', 'Provider', 'Status']
    xs = [80, 260, 390, 560, 720, 835, 930]
    for h, x in zip(headers, xs):
        text(draw, (x, 478), h, font_obj=F14, fill=MUTED)
    rows = [
        ('Khuzdar', 'Shabbir', '1007', '19 Jul 09:20', 'Link Down', 'PTCL', 'Open'),
        ('Chaman', 'A. Qadir', '1002', '18 Jul 11:00', 'Flapping', 'Wateen', 'In Progress'),
        ('Pishin', 'M. Bilal', '1001', '17 Jul 09:10', 'Link Down', 'PTCL', 'Resolved'),
        ('Zhob', 'Sajid Ali', '1003', '16 Jul 15:20', 'Latency', 'VSAT', 'Resolved'),
    ]
    yy = 520
    for row in rows:
        draw.line((80, yy - 12, 970, yy - 12), fill=BORDER, width=1)
        for idx, (val, x) in enumerate(zip(row, xs)):
            fill = TEXT
            if idx == 6 and val == 'Open': fill = YELLOW
            if idx == 6 and val == 'In Progress': fill = ACCENT
            if idx == 6 and val == 'Resolved': fill = GREEN
            text(draw, (x, yy), val, font_obj=F14, fill=fill)
        yy += 54

    rounded(draw, (1034, 270, 1384, 868), fill=PANEL, outline=BORDER, radius=20)
    text(draw, (1058, 302), 'Backup & quick actions', font_obj=F24, fill=WHITE)
    buttons = ['Download Sample Dataset', 'Import Backup JSON', 'Clear All Local Data']
    by = 360
    for i, label in enumerate(buttons):
        fill = ACCENT if i == 0 else '#223452'
        rounded(draw, (1062, by, 1358, by + 48), fill=fill, outline=BORDER if i else None, radius=14)
        text(draw, (1210, by + 24), label, font_obj=F14, fill='#06111c' if i == 0 else TEXT, anchor='mm')
        by += 66
    rounded(draw, (1062, 602, 1358, 824), fill='#18263f', outline=BORDER, radius=14)
    wrapped(draw, (1084, 624), 'This demo stores data in browser localStorage for easy hosting. For a future production version it can be upgraded to Supabase or PostgreSQL.', 30, fill=MUTED, font_obj=F16)
    return img


def tutorial_page(title, bullets, footer, page_no, accent=ACCENT, big_note=None):
    img = Image.new('RGB', (1240, 1754), '#ffffff')
    draw = ImageDraw.Draw(img)
    # header bar
    draw.rectangle((0, 0, 1240, 180), fill='#0b1220')
    text(draw, (70, 54), 'NADRA LinkOps AI', font_obj=F38, fill=WHITE)
    text(draw, (70, 108), 'Visual tutorial for final project completion', font_obj=F20, fill='#cdd9f5')
    rounded(draw, (980, 46, 1166, 122), fill=accent, radius=18)
    text(draw, (1073, 84), f'Page {page_no}', font_obj=F20, fill='#06111c', anchor='mm')
    text(draw, (70, 240), title, font_obj=F38, fill='#0b1220')
    y = 320
    for bullet in bullets:
        draw.ellipse((72, y + 8, 92, y + 28), fill=accent)
        y = wrapped(draw, (110, y), bullet, 78, fill='#1a2433', font_obj=F24, line_gap=10) + 28
    if big_note:
        rounded(draw, (70, 1220, 1170, 1490), fill='#f5f9ff', outline='#d5e5ff', radius=22)
        text(draw, (100, 1258), 'Example / Note', font_obj=F28, fill='#0b1220')
        wrapped(draw, (100, 1314), big_note, 88, fill='#31405a', font_obj=F22, line_gap=10)
    draw.line((70, 1650, 1170, 1650), fill='#d0d9ea', width=2)
    text(draw, (70, 1688), footer, font_obj=F18, fill='#5a6885')
    return img


def build_tutorial_pages():
    pages = []
    pages.append(tutorial_page(
        '1. Understand the assignment',
        [
            'You must build your own original app, not a tutorial clone or renamed template.',
            'The app must be complete end to end, with a real AI feature inside it.',
            'You must submit a public GitHub repository and a working live deployed URL.',
            'The README acts as your full report, so it must include problem, features, AI prompt, tools, screenshots, and setup steps.'
        ],
        'Goal: prepare a strong, original final project package.',
        1,
        big_note='This project uses a real problem from NADRA Quetta Region: daily connectivity complaints from 85 DAUs plus AD support tasks.'
    ))
    pages.append(tutorial_page(
        '2. Select a real problem and define the idea',
        [
            'Problem: it is hard to track which DAU complained, when the disruption started, whether the complaint was genuine, and how many cases were resolved by month end.',
            'Secondary problem: AD tasks like OU transfers, password resets, and account unlocks are also handled manually and are difficult to report.',
            'Solution idea: create one app called NADRA LinkOps AI for complaint logging, reporting, AD support tracking, and AI-powered telecom escalation.'
        ],
        'This is the originality part of the assignment.',
        2,
        accent=GREEN,
        big_note='Because the idea comes from your own real work context in Pakistan, it is strong for grading under IDEA and COMPLETION.'
    ))
    pages.append(tutorial_page(
        '3. Build the app screens',
        [
            'Use index.html for layout, styles.css for design, and script.js for logic.',
            'Create tabs for Dashboard, Complaints, AD Support, Reports, AI Assistant, and Project Notes.',
            'Use browser localStorage to keep the demo simple and fully deployable without a database.'
        ],
        'Files used: index.html, styles.css, script.js',
        3,
        big_note='The app already includes sample complaints from PTCL DSL, Wateen, VSAT, DRS, and 3G/4G links in Quetta-region DAUs like Pishin, Chaman, Zhob, and Khuzdar.'
    ))
    pages.append(tutorial_page(
        '4. Add the AI feature',
        [
            'Create a serverless function in api/ai-draft.js.',
            'Write your own system prompt so the model knows how to classify issues and draft escalation emails.',
            'Pass complaint context, provider, issue type, and remarks into the AI request.',
            'Return a practical answer with Classification, Severity, Escalation Email, DAU Update, and Next Technical Steps.'
        ],
        'Assignment match: AI feature with your own instructions.',
        4,
        accent=ACCENT,
        big_note='If you do not configure an API key yet, the app still demonstrates a fallback draft so you can test the workflow before deployment.'
    ))
    pages.append(tutorial_page(
        '5. Test locally before publishing',
        [
            'Open index.html directly or run python -m http.server 8000.',
            'Test adding a complaint, editing it, filtering it, and exporting CSV.',
            'Test an AD request for OU transfer or password reset.',
            'Generate the monthly disruption report and try Print/Save PDF from the browser.'
        ],
        'Always test before pushing to GitHub.',
        5,
        accent=YELLOW,
        big_note='Good demo test: select the Khuzdar or Chaman complaint and click AI Draft to generate the escalation email workflow.'
    ))
    pages.append(tutorial_page(
        '6. Publish to GitHub',
        [
            'Create a new repository on your own GitHub account and keep it PUBLIC.',
            'Run git init, git add ., git commit -m, git branch -M main, git remote add origin, and git push -u origin main.',
            'Open the repository in incognito mode to verify it does not ask for login.'
        ],
        'Public GitHub repo is mandatory in the assignment.',
        6,
        accent=GREEN,
        big_note='Do not commit API keys. Keep them only in environment variables on your hosting platform.'
    ))
    pages.append(tutorial_page(
        '7. Deploy on Vercel',
        [
            'Import your public repository into Vercel.',
            'Deploy the project with default settings.',
            'Add environment variables: OPENROUTER_API_KEY, OPENROUTER_MODEL, and PUBLIC_APP_URL.',
            'Redeploy and test the live site in incognito mode.'
        ],
        'Live public URL is mandatory in the assignment.',
        7,
        accent=ACCENT,
        big_note='Example model value: openai/gpt-4.1-mini. Example PUBLIC_APP_URL: https://your-vercel-project.vercel.app'
    ))
    pages.append(tutorial_page(
        '8. Final README and submission',
        [
            'Update README.md with your real GitHub link and your real deployed live URL.',
            'Make sure README includes: app name, problem solved, features list, AI prompt, tools/services/models, screenshots, and run instructions.',
            'Submit only the public GitHub repository link on the portal before the deadline.'
        ],
        'Final check: repo public, URL working, README complete.',
        8,
        accent=GREEN,
        big_note='This project folder already includes a README template, PNG screenshots, a system prompt file, and a submission checklist to help you finish quickly.'
    ))
    return pages


def save_images():
    screenshots = {
        'dashboard.png': screenshot_dashboard(),
        'complaints.png': screenshot_complaints(),
        'ai-assistant.png': screenshot_ai(),
        'reports.png': screenshot_reports(),
    }
    for name, img in screenshots.items():
        img.save(SHOT_DIR / name)

    pages = build_tutorial_pages()
    page_paths = []
    for i, img in enumerate(pages, start=1):
        path = TUTORIAL_DIR / f'page-{i:02d}.png'
        img.save(path)
        page_paths.append(path)

    pdf_path = DOCS_DIR / 'NADRA_LinkOps_AI_Visual_Tutorial.pdf'
    try:
        rgb_pages = [Image.open(path).convert('RGB') for path in page_paths]
        rgb_pages[0].save(pdf_path, save_all=True, append_images=rgb_pages[1:])
    except Exception:
        import subprocess
        subprocess.run(['convert', *[str(p) for p in page_paths], str(pdf_path)], check=True)
    print('Created screenshots and PDF tutorial:')
    for path in list(screenshots.keys()):
        print(' -', SHOT_DIR / path)
    print(' -', pdf_path)


if __name__ == '__main__':
    save_images()
