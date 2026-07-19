from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
TMP1 = DOCS / 'visual_project_notes_pages'
TMP2 = DOCS / 'portal_demo_pages'
TMP1.mkdir(exist_ok=True, parents=True)
TMP2.mkdir(exist_ok=True, parents=True)

NOTES_PDF = DOCS / 'PROJECT_NOTES_VISUAL_GUIDE.pdf'
DEMO_PDF = DOCS / 'PORTAL_DEMO_USER_GUIDE.pdf'

W, H = 1240, 1754
NAVY = '#0f172a'
GREEN = '#0f7b35'
GREEN2 = '#22a44c'
BG = '#ffffff'
TEXT = '#132118'
SUB = '#60707f'
BORDER = '#d8e5dc'
SOFT = '#f6fbf7'
WARN = '#fff7ed'
INFO = '#eef6ff'
PINK = '#fff5f5'


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

F14 = font(14)
F16 = font(16)
F18 = font(18)
F20 = font(20)
F22 = font(22, True)
F24 = font(24, True)
F28 = font(28, True)
F34 = font(34, True)
F42 = font(42, True)


def rounded(draw, box, fill, outline=BORDER, radius=22, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, fill=TEXT, font_obj=F18, anchor=None):
    draw.text(xy, value, fill=fill, font=font_obj, anchor=anchor)


def wrapped(draw, xy, value, width_chars, font_obj=F18, fill=TEXT, gap=8):
    import textwrap
    y = xy[1]
    for line in textwrap.wrap(value, width=width_chars):
        draw.text((xy[0], y), line, fill=fill, font=font_obj)
        y += font_obj.size + gap
    return y


def arrow(draw, start, end, fill=GREEN, width=6):
    draw.line((start, end), fill=fill, width=width)
    x1, y1 = end
    if abs(end[0] - start[0]) > abs(end[1] - start[1]):
        draw.polygon([(x1, y1), (x1 - 18, y1 - 10), (x1 - 18, y1 + 10)], fill=fill)
    else:
        draw.polygon([(x1, y1), (x1 - 10, y1 - 18), (x1 + 10, y1 - 18)], fill=fill)


def page(title, subtitle, number, tag='PROJECT NOTES'):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, W, 170), fill=NAVY)
    text(d, (70, 42), 'NADRA Network Complaint Management System', fill='white', font_obj=F34)
    text(d, (70, 95), 'RHO Quetta Region', fill='#dbe7ff', font_obj=F20)
    rounded(d, (945, 38, 1165, 118), GREEN, outline=None, radius=20, width=0)
    text(d, (1055, 78), f'{tag}\nPage {number}', fill='white', font_obj=F18, anchor='mm')
    text(d, (70, 220), title, fill=TEXT, font_obj=F42)
    wrapped(d, (70, 282), subtitle, 86, font_obj=F20, fill=SUB)
    return img, d


def box_list(draw, x, y, w, title, items, fill=SOFT):
    h = 80 + len(items) * 48
    rounded(draw, (x, y, x + w, y + h), fill)
    text(draw, (x + 24, y + 24), title, font_obj=F22)
    yy = y + 70
    for item in items:
        draw.ellipse((x + 24, yy + 8, x + 38, yy + 22), fill=GREEN)
        wrapped(draw, (x + 54, yy), item, 34 if w < 430 else 52, font_obj=F16, fill=TEXT, gap=6)
        yy += 46
    return h


def flow_box(draw, box, title, desc, fill=SOFT):
    rounded(draw, box, fill)
    text(draw, (box[0] + 18, box[1] + 16), title, font_obj=F20)
    wrapped(draw, (box[0] + 18, box[1] + 52), desc, 26, font_obj=F16, fill=SUB, gap=5)


def make_project_notes_pages():
    paths = []

    img, d = page('Project Notes Visual Guide', 'A redesigned visual guide to explain the portal structure, modules, roles, reporting logic, and site/media relationships in a more presentation-friendly way.', 1)
    rounded(d, (70, 380, 1160, 660), '#f2fbf4')
    text(d, (100, 415), 'What the portal covers', font_obj=F28)
    for i, item in enumerate([
        'Complaint intake, closure, and telecom escalation',
        'Balochistan map with site-level complaint visibility',
        'Site directory with primary/secondary media and bandwidth',
        'AD support, technical task tracking, inventory, and reporting'
    ]):
        yy = 485 + i * 44
        d.ellipse((102, yy + 4, 116, yy + 18), fill=GREEN)
        text(d, (134, yy), item, font_obj=F18)
    rounded(d, (70, 720, 530, 1110), INFO)
    text(d, (95, 752), 'Main operational pages', font_obj=F22)
    for i, label in enumerate(['Dashboard', 'Complaint Desk', 'Reports', 'Balochistan Map', 'Site Directory', 'Inventory', 'Technical Tasks', 'AD Support', 'User Management']):
        text(d, (100, 810 + i * 32), f'• {label}', font_obj=F18)
    rounded(d, (565, 720, 1160, 1110), WARN)
    text(d, (590, 752), 'Why this matters for viva/report', font_obj=F22)
    wrapped(d, (590, 810), 'This project is no longer just a complaint form. It now demonstrates operational tracking, role-based access, technical support workflows, site/media management, and management-level visibility for higher authorities.', 45, font_obj=F18, fill=TEXT)
    rounded(d, (70, 1170, 1160, 1510), PINK)
    text(d, (100, 1200), 'Best explanation in one line', font_obj=F22)
    wrapped(d, (100, 1260), 'The portal is a regional operations control desk for NADRA RHO Quetta Region where complaints, AD requests, technical jobs, inventory, site media, and reporting are managed from one place.', 80, font_obj=F22, fill=TEXT)
    path = TMP1 / 'notes-01.png'; img.save(path); paths.append(path)

    img, d = page('Portal Architecture Overview', 'This page shows how the operational modules depend on each other so the examiner can understand the complete system quickly.', 2)
    flow_box(d, (90, 380, 330, 560), 'Site Directory', 'Stores site type, location, primary media, secondary media, bandwidth, and map placement.', '#f3fbf5')
    flow_box(d, (460, 380, 780, 560), 'Complaint Desk', 'Uses site directory data so the complaint is launched against the correct media and location.', '#fefbf3')
    flow_box(d, (810, 380, 1130, 560), 'Reports', 'Aggregates complaints, AD support, inventory, and technical tasks for authorities.', '#eef6ff')
    arrow(d, (330, 470), (460, 470))
    arrow(d, (780, 470), (810, 470))
    flow_box(d, (90, 660, 330, 840), 'Inventory', 'Records device make, model, serials, firewall, switch, IP addresses, and media IPs.', '#fefbf3')
    flow_box(d, (460, 660, 780, 840), 'Balochistan Map', 'Shows configured sites and complaint counts visually for rapid understanding.', '#eef6ff')
    flow_box(d, (810, 660, 1130, 840), 'User Management', 'Admin controls access for Network Engineer and Network Technician roles.', '#f3fbf5')
    arrow(d, (330, 750), (460, 750))
    arrow(d, (780, 750), (810, 750))
    flow_box(d, (90, 940, 420, 1120), 'AD Support', 'Tracks OU transfers, password resets, and account unlock requests.', '#f3fbf5')
    flow_box(d, (470, 940, 810, 1120), 'Technical Tasks', 'Tracks installation, upgradation, replacement, and field support jobs.', '#fefbf3')
    flow_box(d, (860, 940, 1130, 1120), 'AI Assistant', 'Creates formal escalation drafts and site updates from complaint records.', '#eef6ff')
    arrow(d, (420, 1030), (470, 1030))
    arrow(d, (810, 1030), (860, 1030))
    rounded(d, (90, 1220, 1130, 1500), SOFT)
    text(d, (118, 1250), 'Operational logic', font_obj=F22)
    wrapped(d, (118, 1310), 'The most important dependency is that the Site Directory controls site identity, map visibility, and media profile. That same site data is then reused in complaint launch, inventory records, technical tasks, and reports.', 82, font_obj=F20, fill=TEXT)
    path = TMP1 / 'notes-02.png'; img.save(path); paths.append(path)

    img, d = page('Role-Based Access Model', 'This page explains who can use which part of the portal.', 3)
    box_list(d, 70, 380, 330, 'Admin', ['Full access to all modules', 'Can create/update/delete users', 'Can create/update/delete site directory records', 'Can manage inventory records', 'Can reset or reload sample data'], '#f3fbf5')
    box_list(d, 455, 380, 330, 'Network Engineer', ['Can launch complaints', 'Can manage inventory', 'Can manage technical tasks', 'Can use reports and AI assistant', 'Cannot manage user accounts'], '#eef6ff')
    box_list(d, 840, 380, 330, 'Network Technician', ['Can view inventory', 'Can work on complaint desk', 'Can use map and technical task pages', 'No admin user control'], '#fefbf3')
    rounded(d, (70, 980, 1160, 1480), WARN)
    text(d, (100, 1012), 'Practical authority logic', font_obj=F28)
    wrapped(d, (100, 1075), 'This role model reflects a realistic office environment: admin manages the system, the network engineer handles operational oversight and reporting, and the technician supports field and device-side tasks. This makes the project more complete and credible.', 82, font_obj=F22, fill=TEXT)
    path = TMP1 / 'notes-03.png'; img.save(path); paths.append(path)

    img, d = page('Data Quality and Error Reduction', 'This page visually explains how the portal reduces mistakes during complaint launch.', 4)
    flow_box(d, (90, 390, 440, 580), 'Before', 'User might select a wrong provider or choose a media that is not available at the site.', '#fff7f6')
    flow_box(d, (780, 390, 1130, 580), 'After', 'Site Directory defines primary and secondary media plus bandwidth, and the complaint form uses that configuration.', '#f3fbf5')
    arrow(d, (440, 485), (780, 485))
    rounded(d, (90, 680, 1130, 1460), SOFT)
    text(d, (120, 715), 'Fields now linked through the site profile', font_obj=F28)
    for i, item in enumerate([
        'Site Directory stores primary media and secondary media.',
        'Complaint Desk reads the site profile and narrows provider selection.',
        'Reports show the configured media profile for management visibility.',
        'Inventory reuses the same media profile and lets you add IP-level detail.',
        'Map shows the configured sites and lets you inspect site complaint counts quickly.'
    ]):
        yy = 805 + i * 96
        rounded(d, (120, yy, 1100, yy + 68), '#ffffff')
        text(d, (145, yy + 18), f'{i+1}. {item}', font_obj=F20)
    path = TMP1 / 'notes-04.png'; img.save(path); paths.append(path)

    img, d = page('Reporting Design for Higher Authorities', 'This page summarizes how the reporting section can be presented to supervisors and decision-makers.', 5)
    rounded(d, (80, 390, 560, 1080), '#eef6ff')
    text(d, (110, 425), 'Complaint Reporting', font_obj=F24)
    for i, item in enumerate(['Status comparisons', 'Provider comparisons', 'Issue comparisons', 'Monthly trends', 'Critical alerts', 'Map-based complaint visibility']):
        text(d, (120, 485 + i * 50), f'• {item}', font_obj=F18)
    rounded(d, (650, 390, 1140, 1080), '#f3fbf5')
    text(d, (680, 425), 'Support / Asset Reporting', font_obj=F24)
    for i, item in enumerate(['AD support counts', 'Repeated reset/unlock employee alerts', 'Technical task origin comparison', 'Technical task type comparison', 'Inventory media distribution', 'Inventory snapshot table']):
        text(d, (690, 485 + i * 50), f'• {item}', font_obj=F18)
    rounded(d, (80, 1140, 1140, 1480), '#fffaf2')
    text(d, (110, 1175), 'Reporting conclusion', font_obj=F24)
    wrapped(d, (110, 1235), 'The design makes the portal suitable for routine operations and monthly review. Supervisors can quickly identify open critical complaints, repeated support burdens, media distribution, and site-level concerns without reading every record manually.', 82, font_obj=F22, fill=TEXT)
    path = TMP1 / 'notes-05.png'; img.save(path); paths.append(path)

    img, d = page('Deployment and Submission View', 'This page is formatted as a final quick reference for the student.', 6)
    flow_box(d, (90, 390, 340, 540), '1. Test', 'Login, complaint launch, map, AD support, technical tasks, and reports.', '#f3fbf5')
    flow_box(d, (390, 390, 640, 540), '2. GitHub', 'Upload the full project to your public repository.', '#eef6ff')
    flow_box(d, (690, 390, 940, 540), '3. Vercel', 'Deploy and test the live URL.', '#fefbf3')
    flow_box(d, (990, 390, 1140, 540), '4. Submit', 'Submit only the public GitHub link.', '#fff7f6')
    arrow(d, (340, 465), (390, 465)); arrow(d, (640, 465), (690, 465)); arrow(d, (940, 465), (990, 465))
    rounded(d, (90, 650, 1140, 1450), SOFT)
    text(d, (118, 685), 'Best final checklist', font_obj=F28)
    checks = [
        'Repo is public and opens in incognito mode.',
        'Live deployment works and login screen appears.',
        'Complaint launch, reports, map, AD support, inventory, and technical tasks all work.',
        'README contains correct live URL, GitHub link, screenshots, AI prompt, and setup steps.',
        'No API keys or secrets are committed into the repository.'
    ]
    for i, item in enumerate(checks):
        y = 785 + i * 110
        rounded(d, (118, y, 1110, y + 72), '#ffffff')
        text(d, (145, y + 18), f'✓ {item}', font_obj=F20)
    path = TMP1 / 'notes-06.png'; img.save(path); paths.append(path)
    return paths


def make_demo_pages():
    paths = []

    img, d = page('Portal Demo User Guide', 'A visual walk-through for a layman or non-technical reviewer to understand how to use the portal step by step.', 1, tag='PORTAL DEMO')
    rounded(d, (80, 400, 1140, 900), SOFT)
    text(d, (110, 438), 'Main user journey', font_obj=F28)
    flow_box(d, (110, 540, 300, 680), 'Login', 'Sign in with your role-based account.', '#ffffff')
    flow_box(d, (360, 540, 550, 680), 'Dashboard', 'See alerts, charts, and quick actions.', '#ffffff')
    flow_box(d, (610, 540, 800, 680), 'Work Module', 'Open complaints, map, AD, tasks, or inventory.', '#ffffff')
    flow_box(d, (860, 540, 1050, 680), 'Reports', 'Generate monthly and management reports.', '#ffffff')
    arrow(d, (300, 610), (360, 610)); arrow(d, (550, 610), (610, 610)); arrow(d, (800, 610), (860, 610))
    rounded(d, (80, 980, 1140, 1450), INFO)
    text(d, (110, 1015), 'Who can use this guide', font_obj=F24)
    wrapped(d, (110, 1075), 'This PDF is suitable for the student, teacher, supervisor, or any layman who wants to understand the portal by looking at the process visually rather than reading the full technical documentation.', 82, font_obj=F20, fill=TEXT)
    path = TMP2 / 'demo-01.png'; img.save(path); paths.append(path)

    img, d = page('Step 1 — Login and Open Dashboard', 'The first step is only to sign in and confirm the dashboard loads correctly.', 2, tag='PORTAL DEMO')
    box_list(d, 80, 390, 460, 'What to do', ['Enter the demo username and password.', 'Click Sign In.', 'Confirm the dashboard opens and summary cards appear.'], '#f3fbf5')
    box_list(d, 620, 390, 520, 'What to look for', ['Total complaints', 'Open / In Progress / Closed view', 'Critical alerts', 'Quick navigation buttons'], '#eef6ff')
    rounded(d, (80, 980, 1140, 1430), WARN)
    text(d, (110, 1018), 'Layman interpretation', font_obj=F24)
    wrapped(d, (110, 1080), 'If the dashboard opens after login and you can see complaint summaries and alerts, then the portal is working at a basic level.', 82, font_obj=F22, fill=TEXT)
    path = TMP2 / 'demo-02.png'; img.save(path); paths.append(path)

    img, d = page('Step 2 — Launch a Complaint', 'This is the most important daily-use flow in the portal.', 3, tag='PORTAL DEMO')
    flow_box(d, (90, 410, 340, 560), 'Choose Site', 'Select a configured site template such as NRC Pishin.', '#f3fbf5')
    flow_box(d, (390, 410, 640, 560), 'See Media Profile', 'Primary and secondary media appear from site settings.', '#eef6ff')
    flow_box(d, (690, 410, 940, 560), 'Record Issue', 'Enter issue type, status, and remarks.', '#fefbf3')
    flow_box(d, (990, 410, 1140, 560), 'Save', 'Complaint is stored in the register.', '#fff7f6')
    arrow(d, (340, 485), (390, 485)); arrow(d, (640, 485), (690, 485)); arrow(d, (940, 485), (990, 485))
    rounded(d, (90, 700, 1140, 1450), SOFT)
    text(d, (118, 735), 'Why this step matters', font_obj=F24)
    wrapped(d, (118, 790), 'The site profile reduces errors by ensuring the complaint is linked with the correct media and bandwidth. After saving, the complaint becomes visible in dashboards, reports, and the site map.', 80, font_obj=F22, fill=TEXT)
    path = TMP2 / 'demo-03.png'; img.save(path); paths.append(path)

    img, d = page('Step 3 — Use Map, Directory, and Inventory', 'These pages help identify where the issue is happening and what equipment or media the site has.', 4, tag='PORTAL DEMO')
    box_list(d, 80, 390, 330, 'Site Directory', ['View DAUs, sections, MRV, and project sites.', 'Check primary and secondary media.', 'Check bandwidth profile.'], '#f3fbf5')
    box_list(d, 455, 390, 330, 'Balochistan Map', ['See configured sites visually.', 'Hover or click markers to review complaint counts.', 'Use type filter for DAU, section, MRV, and project site.'], '#eef6ff')
    box_list(d, 830, 390, 330, 'Inventory', ['Check firewall, switch, LAN IP, media IPs, and serial numbers.', 'Use this page for on-spot field reference.'], '#fefbf3')
    rounded(d, (80, 1020, 1140, 1450), INFO)
    text(d, (110, 1055), 'Layman interpretation', font_obj=F24)
    wrapped(d, (110, 1115), 'These three pages answer three different questions: Where is the site? What media does the site have? What hardware and IP information is available for the site?', 82, font_obj=F22, fill=TEXT)
    path = TMP2 / 'demo-04.png'; img.save(path); paths.append(path)

    img, d = page('Step 4 — Use AD Support and Technical Tasks', 'The portal also records non-network support work that still belongs to the same operational workflow.', 5, tag='PORTAL DEMO')
    flow_box(d, (90, 410, 500, 600), 'AD Support', 'Log password reset, account unlock, and OU transfer requests. Use the charts to identify repeated support burdens.', '#f3fbf5')
    flow_box(d, (620, 410, 1130, 600), 'Technical Tasks', 'Log installation, upgradation, replacement, repair, and preventive maintenance work for sections, field sites, or MRV.', '#eef6ff')
    rounded(d, (90, 720, 1130, 1450), SOFT)
    text(d, (118, 755), 'Why these pages matter', font_obj=F24)
    wrapped(d, (118, 820), 'They show that the portal is not only for telecom complaints. It also tracks user support and on-ground technical work, which makes the project more complete and more useful in real operations.', 82, font_obj=F22, fill=TEXT)
    path = TMP2 / 'demo-05.png'; img.save(path); paths.append(path)

    img, d = page('Step 5 — Generate Reports and Finish', 'The final stage is using the report section and closing the working cycle.', 6, tag='PORTAL DEMO')
    flow_box(d, (90, 410, 340, 560), 'Open Reports', 'Choose the report month.', '#f3fbf5')
    flow_box(d, (390, 410, 640, 560), 'Generate', 'Status, provider, issue, AD, technical, and inventory summaries appear.', '#eef6ff')
    flow_box(d, (690, 410, 940, 560), 'Export', 'Save CSV or print to PDF.', '#fefbf3')
    flow_box(d, (990, 410, 1140, 560), 'Logout', 'End the session safely.', '#fff7f6')
    arrow(d, (340, 485), (390, 485)); arrow(d, (640, 485), (690, 485)); arrow(d, (940, 485), (990, 485))
    rounded(d, (90, 700, 1140, 1450), WARN)
    text(d, (118, 735), 'Simple final message', font_obj=F24)
    wrapped(d, (118, 800), 'If a user can log in, launch a complaint, view the map, check the inventory, record AD or technical work, and generate a report, then the portal is functioning as a complete end-to-end system.', 80, font_obj=F22, fill=TEXT)
    path = TMP2 / 'demo-06.png'; img.save(path); paths.append(path)
    return paths


def save_pdf(paths, out_path):
    try:
        imgs = [Image.open(path).convert('RGB') for path in paths]
        imgs[0].save(out_path, save_all=True, append_images=imgs[1:])
    except Exception:
        subprocess.run(['convert', *[str(p) for p in paths], str(out_path)], check=True)


def main():
    notes = make_project_notes_pages()
    demo = make_demo_pages()
    save_pdf(notes, NOTES_PDF)
    save_pdf(demo, DEMO_PDF)
    print('Generated', NOTES_PDF)
    print('Generated', DEMO_PDF)

if __name__ == '__main__':
    main()
