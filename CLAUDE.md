# Maguire Oz TTRPG Wiki

## Project Overview
An interactive HTML wiki for a tabletop RPG setting based on Gregory Maguire's Oz novels (Wicked, Son of a Witch, A Lion Among Men, Out of Oz). This is a single-page application with no build tools required - just static HTML, CSS, and JavaScript.

## Current Status
**Step 1 Complete** - App foundation built
**Step 2 In Progress** - Core functionality (search, editing, data)

## Directory Structure
```
/oz-wiki
  index.html           # Main app shell with sidebar navigation
  /css
    styles.css         # Base styling, responsive design
    dark-mode.css      # Dark theme
    print.css          # Print styles
  /js
    app.js             # Main initialization, keyboard shortcuts
    storage.js         # localStorage wrapper utilities
    navigation.js      # Sidebar navigation, collapsible categories
    tabs.js            # Tab system with drag-and-drop
    search.js          # (Step 2) Search functionality
    editor.js          # (Step 2) Page editing
  /data
    pages.json         # All wiki page content
  /pages
    (empty - content stored in pages.json)
```

## Build Process (9 Steps)
1. **App Foundation** ✅ - HTML shell, tabs, navigation, styling
2. **Core Functionality** 🔄 - Search, editing, data persistence
3. **GM Tools** - Dice roller, initiative tracker, notes
4. **Page Templates** - Standardized formats for races, classes, etc.
5. **Content: Characters** - Races, classes, backgrounds
6. **Content: Magic & Equipment** - Spells, items, gear
7. **Content: Creatures** - Monsters, NPCs, stat blocks
8. **Content: World** - Regions, factions, history
9. **Integration & Polish** - Cross-linking, testing

## Key Files
- `oz_ttrpg_wiki_index.md` - Master index of all wiki content structure
- `oz-wiki/index.html` - Main application
- `oz-wiki/data/pages.json` - All page content in JSON format

## Tech Stack
- Vanilla HTML5, CSS3, JavaScript (ES6+)
- No frameworks or build tools
- localStorage for persistence
- Markdown content rendered to HTML

## Coding Conventions
- Module pattern with IIFEs for JS files
- CSS custom properties for theming
- BEM-ish class naming
- Mobile-first responsive design

## Testing
Open `oz-wiki/index.html` directly in a browser - no server required.

## Reference Materials
- **Formatting Reference:** https://www.dandwiki.com (for D&D 5e page formatting)
- **Lore Source:** Gregory Maguire's Oz novels
