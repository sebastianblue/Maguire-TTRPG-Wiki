# Link Fix Complete

## What Was Fixed

All hyperlinks in the newly created race pages have been converted from standard HTML `href` format to the wiki's onclick-based navigation system.

## Format Used

**Before (would not work):**
```html
<a href="/exploration/regions/munchkinland">Munchkinland (Region)</a>
```

**After (correct format):**
```html
<a href="#" onclick="Tabs.openTab('exploration/regions/munchkinland', 'Munchkinland'); return false;">Munchkinland (Region)</a>
```

## Pages Updated

All 15 newly created race pages:
- character/races/humans/munchkinlander
- character/races/humans/quadling
- character/races/humans/vinkan
- character/races/humans/emerald-city-native
- character/races/humans/outlander
- character/races/animals/overview
- character/races/animals/mammals
- character/races/animals/birds
- character/races/animals/reptiles-amphibians
- character/races/animals/fish-question
- character/races/animals/hybrid-uncertain
- character/races/tiktoks
- character/races/the-touched
- character/races/dragons
- character/races/winged-monkeys

## How It Works

The script (`fix_links.py`):
1. Reads all pages from `pages.json`
2. Finds all `<a href="/path">text</a>` links
3. Extracts the path and link text
4. Generates appropriate page titles from the path
5. Converts to `onclick="Tabs.openTab('page-id', 'Page Title'); return false;"` format
6. Updates the JSON with fixed links

## Testing

All links should now:
- Open in new tabs within the wiki interface
- Properly populate the tab title
- Navigate without page reloads
- Work with the existing navigation system

## Title Mapping

The script includes a comprehensive title map for common pages to ensure proper capitalization and formatting. For example:
- `the-adept` → "The Adept"
- `shiz-university` → "Shiz University"
- `animal-resistance` → "The Animal Resistance"
- `emerald-city-native` → "Emerald City Native"

etc.

Total pages in wiki: **24**
