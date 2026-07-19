from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
SRC = DOCS / 'ASSIGNMENT_TASK_STEPS.md'
OUT = DOCS / 'ASSIGNMENT_TASK_STEPS.pdf'
PAGES_DIR = DOCS / 'assignment_steps_pages'
PAGES_DIR.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = 1240, 1754
LEFT = 70
TOP = 220
BOTTOM = 120
NAVY = '#0f172a'
GREEN = '#0f7b35'
TEXT = '#1a2433'
SUB = '#5b6b83'
BG = '#ffffff'


def font(size, bold=False):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/dejavu/DejaVuSans.ttf',
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

F16 = font(16)
F18 = font(18)
F20 = font(20)
F24 = font(24, True)
F32 = font(32, True)
F38 = font(38, True)


def lh(f):
    return f.size + 9


def wrap(text, n):
    if not text.strip():
        return ['']
    return textwrap.wrap(text, width=n, replace_whitespace=False, drop_whitespace=False)


def parse(md):
    blocks = []
    for raw in md.splitlines():
        line = raw.rstrip()
        if not line:
            blocks.append(('blank', ''))
        elif line.startswith('## '):
            blocks.append(('h2', line[3:].strip()))
        elif line.startswith('# '):
            blocks.append(('h1', line[2:].strip()))
        elif line.startswith('- [ ] '):
            blocks.append(('check', line[6:].strip()))
        elif line.startswith('- '):
            blocks.append(('bullet', line[2:].strip()))
        elif len(line) > 3 and line[:2].isdigit() and line[2:4] == '. ':
            blocks.append(('num', line.strip()))
        elif line.startswith('```'):
            blocks.append(('skip', ''))
        else:
            blocks.append(('p', line))
    return blocks


def bheight(kind, text):
    if kind == 'blank': return 16
    if kind == 'h1': return lh(F38) + 8
    if kind == 'h2': return lh(F24) + 8
    if kind in ('bullet', 'check'): return len(wrap(text, 84)) * lh(F20) + 6
    if kind == 'num': return len(wrap(text, 88)) * lh(F20) + 6
    if kind == 'skip': return 10
    return len(wrap(text, 94)) * lh(F18) + 6


def draw_page(page_no):
    img = Image.new('RGB', (PAGE_W, PAGE_H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, PAGE_W, 165), fill=NAVY)
    d.text((LEFT, 42), 'NADRA LinkOps AI', fill='white', font=F38)
    d.text((LEFT, 100), 'Assignment task-by-task completion guide', fill='#d5e4ff', font=F20)
    d.rounded_rectangle((956, 38, 1162, 114), radius=18, fill=GREEN)
    d.text((1059, 76), f'Page {page_no}', fill='white', font=F20, anchor='mm')
    d.line((LEFT, 165, PAGE_W - LEFT, 165), fill='#dbe5ea', width=2)
    d.line((LEFT, PAGE_H - 78, PAGE_W - LEFT, PAGE_H - 78), fill='#dbe5ea', width=2)
    d.text((LEFT, PAGE_H - 56), 'Use this guide to test, publish, deploy, and submit the project correctly.', fill=SUB, font=F16)
    return img, d


def draw_block(d, y, kind, text):
    if kind == 'blank':
        return y + 16
    if kind == 'h1':
        d.text((LEFT, y), text, fill='#10231a', font=F32)
        return y + lh(F32) + 8
    if kind == 'h2':
        d.text((LEFT, y), text, fill=GREEN, font=F24)
        return y + lh(F24) + 8
    if kind == 'bullet':
        lines = wrap(text, 84)
        d.ellipse((LEFT, y + 8, LEFT + 12, y + 20), fill=GREEN)
        yy = y
        for line in lines:
            d.text((LEFT + 24, yy), line, fill=TEXT, font=F20)
            yy += lh(F20)
        return yy + 4
    if kind == 'check':
        d.rounded_rectangle((LEFT, y + 4, LEFT + 14, y + 18), radius=3, outline=GREEN, width=2)
        yy = y
        for line in wrap(text, 84):
            d.text((LEFT + 26, yy), line, fill=TEXT, font=F20)
            yy += lh(F20)
        return yy + 4
    if kind == 'num':
        yy = y
        for line in wrap(text, 88):
            d.text((LEFT, yy), line, fill=TEXT, font=F20)
            yy += lh(F20)
        return yy + 4
    if kind == 'skip':
        return y + 8
    yy = y
    for line in wrap(text, 94):
        d.text((LEFT, yy), line, fill=TEXT, font=F18)
        yy += lh(F18)
    return yy + 4


def main():
    blocks = parse(SRC.read_text(encoding='utf-8'))
    pages = []
    current = []
    curh = TOP
    limit = PAGE_H - BOTTOM
    for block in blocks:
      h = bheight(*block)
      if current and curh + h > limit:
        pages.append(current)
        current = [block]
        curh = TOP + h
      else:
        current.append(block)
        curh += h
    if current:
      pages.append(current)

    img_paths = []
    for i, blocks in enumerate(pages, start=1):
      img, d = draw_page(i)
      y = TOP
      for block in blocks:
        y = draw_block(d, y, *block)
      path = PAGES_DIR / f'assignment-steps-{i:02d}.png'
      img.save(path)
      img_paths.append(path)

    try:
      images = [Image.open(p).convert('RGB') for p in img_paths]
      images[0].save(OUT, save_all=True, append_images=images[1:])
    except Exception:
      subprocess.run(['convert', *[str(p) for p in img_paths], str(OUT)], check=True)

    print(f'Generated {OUT}')

if __name__ == '__main__':
    main()
