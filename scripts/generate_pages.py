import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "oz_ttrpg_wiki_index.md"
DATA_PATH = ROOT / "wiki" / "data" / "pages.json"
GEN_PATH = ROOT / "wiki" / "generated_pages"

slug_invalid = re.compile(r"[^a-z0-9-]")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = slug_invalid.sub("", text)
    return text.strip("-") or "page"


def clean_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^[-\s]+", "", text)
    text = text.replace("**", "")
    text = text.replace("`", "")
    return text.strip()


class Node:
    def __init__(self, title: str, text: str, level: int, parent=None, kind="section"):
        self.title = title
        self.text = text
        self.level = level
        self.parent = parent
        self.kind = kind
        self.children = []
        self.slug = None

    def add_child(self, node):
        self.children.append(node)

    def breadcrumbs(self):
        crumbs = []
        node = self.parent
        while node:
            crumbs.append(node.title)
            node = node.parent
        return list(reversed(crumbs))

    def path_titles(self):
        return self.breadcrumbs() + [self.title]


root = Node("Encyclopedia", "Generated root", 0, parent=None)


with INDEX_PATH.open() as f:
    lines = [ln.rstrip("\n") for ln in f]

heading_stack = []  # nodes per heading level (1-based for #)
bullet_stack = []  # stack of tuples (indent_level, node)

current_heading = root

nodes = [root]

for ln in lines:
    if not ln.strip():
        continue
    if ln.startswith("#"):
        hashes, title = ln.split(" ", 1)
        level = len(hashes)
        title = title.strip()
        node = Node(title, f"Section for {title}", level, parent=None, kind="heading")
        # attach to parent heading one level up if exists
        if level > 1 and len(heading_stack) >= level - 1:
            parent = heading_stack[level - 2]
        else:
            parent = root
        node.parent = parent
        parent.add_child(node)
        if len(heading_stack) < level:
            heading_stack.extend([None] * (level - len(heading_stack)))
        heading_stack[level - 1] = node
        heading_stack = heading_stack[:level]
        current_heading = node
        bullet_stack = []
        nodes.append(node)
        continue
    if ln.lstrip().startswith("-"):
        indent = len(ln) - len(ln.lstrip(" "))
        level = indent // 2  # bullet nesting level
        text = clean_text(ln.lstrip())
        node = Node(text, text, level, parent=None, kind="entry")
        # find parent: last bullet with lower level else current heading
        while bullet_stack and bullet_stack[-1][0] >= level:
            bullet_stack.pop()
        if bullet_stack:
            parent = bullet_stack[-1][1]
        else:
            parent = current_heading
        node.parent = parent
        parent.add_child(node)
        bullet_stack.append((level, node))
        nodes.append(node)
        continue

# assign slugs now that paths are known
used_slugs = set()
for node in nodes:
    slug_base = slugify("-".join(node.path_titles()))
    slug = slug_base
    counter = 2
    while slug in used_slugs:
        slug = f"{slug_base}-{counter}"
        counter += 1
    node.slug = slug
    used_slugs.add(slug)

pages = []

for node in nodes:
    if node is root:
        continue
    breadcrumbs = node.breadcrumbs()
    tags = [t.lower() for t in breadcrumbs]
    # body: include text and child links
    body_parts = []
    if node.text:
        body_parts.append(f"<p>{node.text}</p>")
    if node.children:
        body_parts.append("<h3>Related Subtopics</h3><ul>")
        for child in node.children:
            body_parts.append(f'<li data-related="{child.slug}"><a href="#" data-link="{child.slug}">{child.title}</a></li>')
        body_parts.append("</ul>")
    page = {
        "id": node.slug,
        "title": node.title,
        "summary": node.text,
        "category": breadcrumbs[0] if breadcrumbs else "General",
        "breadcrumbs": breadcrumbs,
        "tags": tags,
        "body": "\n".join(body_parts),
    }
    pages.append(page)

DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
with DATA_PATH.open("w") as f:
    json.dump(pages, f, indent=2)

GEN_PATH.mkdir(parents=True, exist_ok=True)
page_template = """<!doctype html>
<html><head><meta charset='utf-8'><title>{title}</title></head>
<body>
<nav>{breadcrumbs}</nav>
<article>
<h1>{title}</h1>
{body}
</article>
</body></html>"""

for page in pages:
    crumbs = " / ".join(page["breadcrumbs"])
    html = page_template.format(title=page["title"], breadcrumbs=crumbs, body=page["body"])
    (GEN_PATH / f"{page['id']}.html").write_text(html)

print(f"Generated {len(pages)} pages")
