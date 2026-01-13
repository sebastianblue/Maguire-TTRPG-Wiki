# Maguire Oz TTRPG Wiki

This `/wiki` folder hosts the browser-based reference for the Maguire Oz tabletop setting.

## Running
Open `wiki/index.html` directly in a browser (no build step required). All data is loaded from `data/pages.json` and localStorage.

## Adding or updating content
1. Edit `oz_ttrpg_wiki_index.md` to reflect the new outline entry.
2. Run `python scripts/generate_pages.py` to regenerate `data/pages.json` and HTML stubs under `wiki/generated_pages`. The script walks every heading and bullet entry to guarantee coverage.
3. If you want bespoke prose, open the page in the app, click **Edit**, write in markdown or rich text, and save. These edits are stored in localStorage with version history; export them to share.
4. To cross-link manually, include the exact title of the target entry in your text—the renderer will turn title matches into links automatically.

## Keyboard shortcuts
- **Ctrl+K** focus search
- **Ctrl+E** toggle editor
- **Ctrl+S** save current edit
- **Ctrl+W** close tab
- **Ctrl+Tab** rotate tabs (in-app handler)

## GM tools
Dice roller, initiative tracker, session notes, condition references, and lightweight stat-block popups live in the sidebar and store their state locally.
