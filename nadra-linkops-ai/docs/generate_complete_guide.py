from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
PAGES_DIR = DOCS / 'complete_guide_pages'
PAGES_DIR.mkdir(parents=True, exist_ok=True)

MARKDOWN = DOCS / 'COMPLETE_PROJECT_GUIDE.md'
PDF_PATH = DOCS / 'COMPLETE_PROJECT_GUIDE.pdf'

PAGE_W, PAGE_H = 1240, 1754
MARGIN_X = 74
MARGIN_TOP = 220
MARGIN_BOTTOM = 120
LINE_GAP = 10
TEXT_COLOR = '#1a2433'
SUBTLE = '#5b6b83'
GREEN = '#0f7b35'
NAVY = '#0f172a'
BG = '#ffffff'


def font(size, bold=False):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/dejavu/DejaVuSans.ttf',
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()

F16 = font(16)
F18 = font(18)
F20 = font(20)
F22 = font(22)
F24 = font(24, bold=True)
F30 = font(30, bold=True)
F38 = font(38, bold=True)


def line_height(f):
    return f.size + LINE_GAP


def wrap_paragraph(text, width_chars):
    if not text.strip():
        return ['']
    return textwrap.wrap(text, width=width_chars, replace_whitespace=False, drop_whitespace=False)


def parse_markdown(md_text):
    blocks = []
    for raw in md_text.splitlines():
        line = raw.rstrip()
        if not line:
            blocks.append(('blank', ''))
        elif line.startswith('## '):
            blocks.append(('h2', line[3:].strip()))
        elif line.startswith('# '):
            blocks.append(('h1', line[2:].strip()))
        elif line.startswith('```'):
            blocks.append(('codefence', '```'))
        elif line.startswith('- '):
            blocks.append(('bullet', line[2:].strip()))
        elif line[:2].isdigit() and line[2:4] == '. ':
            blocks.append(('numbered', line.strip()))
        else:
            blocks.append(('p', line))
    return blocks


def create_page(page_no):
    img = Image.new('RGB', (PAGE_W, PAGE_H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, PAGE_W, 165), fill=NAVY)
    draw.text((MARGIN_X, 44), 'NADRA LinkOps AI', fill='white', font=F38)
    draw.text((MARGIN_X, 98), 'Complete start-to-finish project guide', fill='#d5e4ff', font=F20)
    draw.rounded_rectangle((1000, 42, 1150, 112), radius=18, fill=GREEN)
    draw.text((1075, 77), f'Page {page_no}', fill='white', font=F20, anchor='mm')
    draw.line((MARGIN_X, 165, PAGE_W - MARGIN_X, 165), fill='#dbe5ea', width=2)
    draw.line((MARGIN_X, PAGE_H - 78, PAGE_W - MARGIN_X, PAGE_H - 78), fill='#dbe5ea', width=2)
    draw.text((MARGIN_X, PAGE_H - 56), 'Prepared for academic submission, deployment, and self-study.', fill=SUBTLE, font=F16)
    return img, draw


def block_height(kind, text):
    if kind == 'blank':
        return 18
    if kind == 'h1':
        return line_height(F38) + 10
    if kind == 'h2':
        return line_height(F24) + 8
    if kind == 'bullet':
        return len(wrap_paragraph(text, 82)) * line_height(F20) + 8
    if kind == 'numbered':
        return len(wrap_paragraph(text, 84)) * line_height(F20) + 8
    if kind == 'codefence':
        return 18
    return len(wrap_paragraph(text, 92)) * line_height(F18) + 8


def draw_block(draw, y, kind, text):
    if kind == 'blank':
        return y + 18
    if kind == 'h1':
        draw.text((MARGIN_X, y), text, fill='#10231a', font=F38)
        return y + line_height(F38) + 10
    if kind == 'h2':
        draw.text((MARGIN_X, y), text, fill=GREEN, font=F24)
        return y + line_height(F24) + 8
    if kind == 'bullet':
        lines = wrap_paragraph(text, 82)
        draw.ellipse((MARGIN_X, y + 10, MARGIN_X + 12, y + 22), fill=GREEN)
        yy = y
        for i, line in enumerate(lines):
            draw.text((MARGIN_X + 28, yy), line, fill=TEXT_COLOR, font=F20)
            yy += line_height(F20)
        return yy + 6
    if kind == 'numbered':
        lines = wrap_paragraph(text, 84)
        yy = y
        for line in lines:
            draw.text((MARGIN_X, yy), line, fill=TEXT_COLOR, font=F20)
            yy += line_height(F20)
        return yy + 6
    if kind == 'codefence':
        return y + 10
    lines = wrap_paragraph(text, 92)
    yy = y
    for line in lines:
        draw.text((MARGIN_X, yy), line, fill=TEXT_COLOR, font=F18)
        yy += line_height(F18)
    return yy + 6


def render_pages(blocks):
    pages = []
    current_blocks = []
    current_height = MARGIN_TOP
    max_y = PAGE_H - MARGIN_BOTTOM

    for block in blocks:
        h = block_height(*block)
        if current_blocks and current_height + h > max_y:
            pages.append(current_blocks)
            current_blocks = [block]
            current_height = MARGIN_TOP + h
        else:
            current_blocks.append(block)
            current_height += h
    if current_blocks:
        pages.append(current_blocks)

    image_paths = []
    for idx, page_blocks in enumerate(pages, start=1):
        img, draw = create_page(idx)
        y = MARGIN_TOP
        for block in page_blocks:
            y = draw_block(draw, y, *block)
        path = PAGES_DIR / f'guide-page-{idx:02d}.png'
        img.save(path)
        image_paths.append(path)
    return image_paths


def make_pdf(image_paths):
    try:
        pages = [Image.open(p).convert('RGB') for p in image_paths]
        pages[0].save(PDF_PATH, save_all=True, append_images=pages[1:])
    except Exception:
        subprocess.run(['convert', *[str(p) for p in image_paths], str(PDF_PATH)], check=True)


def main():
    md = MARKDOWN.read_text(encoding='utf-8')
    blocks = parse_markdown(md)
    image_paths = render_pages(blocks)
    make_pdf(image_paths)
    print(f'Generated {PDF_PATH}')


if __name__ == '__main__':
    main()
