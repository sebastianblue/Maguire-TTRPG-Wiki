Codex Prompt: Oz TTRPG Interactive Wiki Builder
Multi-Step Build Process

This project builds a comprehensive, interactive HTML wiki for a Maguire Oz TTRPG setting. The build is broken into 9 sequential steps. Wait for the user to say "ok time for step [X]" before proceeding to each step.
Reference Materials

    Primary Index: oz_ttrpg_wiki_index.md in this repository — Contains the full structure and all entries that need pages
    Formatting Reference: https://www.dandwiki.com — Study how they format race pages, class pages, monster stat blocks, spell listings, equipment tables
    Lore Source: Gregory Maguire's Oz novels (Wicked, Son of a Witch, A Lion Among Men, Out of Oz)

STEP 1: App Foundation

Trigger: User says "ok time for step 1" or similar
Objectives

Build the core HTML application shell with navigation and tab system.
Deliverables
1.1 File Structure

Create this directory structure:

/oz-wiki
  index.html
  /css
    styles.css
    dark-mode.css
    print.css
  /js
    app.js
    tabs.js
    navigation.js
    storage.js
  /data
    pages.json (empty structure for now)
  /pages
    (empty, will be populated later)

1.2 HTML Shell (index.html)

    Header with:
        Wiki title "Maguire Oz TTRPG Wiki"
        Search bar (UI only, functionality in Step 2)
        Dark/light mode toggle
        Font size controls (+/-)
    Sidebar with:
        Collapsible category tree matching the index structure
        Categories: Character, Magic, Equipment, Creatures, Religion, Conditions, Exploration, Underground, Objects, Factions, History, Notable Figures, Appendices, DM Resources
        Each category expands to show subcategories
        Clicking a leaf item should (eventually) open that page
    Main content area with:
        Tab bar at top (for multiple open pages)
        Content display area below tabs
        Placeholder welcome page
    Footer with:
        "Edit Page" button (UI only)
        "Bookmark" button (UI only)
        "Print" button

1.3 Tab System (tabs.js)

Implement functional tabs:

    Add new tab when clicking sidebar items
    Tab shows page title (truncated if long)
    Close button (X) on each tab
    Click tab to switch to that page
    Drag tabs to reorder
    Maximum 10 tabs (warn user if exceeded)
    "Close Other Tabs" right-click option
    Active tab visually distinguished

1.4 Sidebar Navigation (navigation.js)

    Collapsible/expandable categories (click to toggle)
    Visual indicators for expanded/collapsed state
    Remember expanded state in localStorage
    Highlight currently active page in sidebar

1.5 Basic Styling (styles.css)

    Clean, readable design
    Sidebar: fixed left, scrollable
    Content area: flexible, scrollable
    Tab bar: horizontal scroll if many tabs
    Responsive breakpoints for tablet (sidebar becomes hamburger menu)
    Print styles: hide sidebar, tabs, buttons

1.6 Dark Mode (dark-mode.css)

    Toggle switches between light and dark
    Dark mode: dark background, light text, adjusted colors
    Preference saved to localStorage

1.7 Storage Foundation (storage.js)

Set up localStorage wrapper functions:

    saveToStorage(key, value)
    loadFromStorage(key, defaultValue)
    removeFromStorage(key)
    Store: theme preference, sidebar state, open tabs

Completion Criteria

    App loads without errors
    Sidebar displays all categories from index
    Tabs can be opened, closed, reordered
    Dark/light mode works and persists
    Responsive on tablet width
    Placeholder content displays in main area

Stop here and wait for "ok time for step 2"
STEP 2: Core Functionality

Trigger: User says "ok time for step 2"
Objectives

Implement search, editing system, and data persistence.
Deliverables
2.1 Data Structure (pages.json)

Create the JSON structure for storing pages:

{
  "meta": {
    "version": "1.0",
    "lastUpdated": "ISO-DATE"
  },
  "pages": {
    "character/races/humans/gillikinese": {
      "id": "character/races/humans/gillikinese",
      "title": "Gillikinese",
      "category": ["Character", "Races", "Humans"],
      "content": "# Gillikinese\n\n[Content here in Markdown]",
      "related": ["character/races/humans/emerald-city-native", "exploration/gillikin"],
      "tags": ["race", "human", "gillikin", "playable"],
      "lastModified": "ISO-DATE"
    }
  }
}

    (DEFERRED - Stub population happens in Steps 4-8 as actual content is created)
    Placeholder system in place - shows editable placeholders for pages not yet in JSON
    Every page in oz_ttrpg_wiki_index.md will get an entry during content steps

2.2 Search System (search.js)

Create new file and implement:

    Build search index on app load from pages.json
    Index: titles, tags, first 500 chars of content
    Real-time search as user types (debounced 200ms)
    Results dropdown below search bar showing:
        Page title
        Category breadcrumb
        Snippet with highlighted match
    Click result to open page in new tab
    Keyboard navigation (arrow keys, enter to select)
    Ctrl+K / Cmd+K focuses search bar
    "No results" message with suggestions
    Filter by category option

2.3 Page Rendering

    Load page content from pages.json (or localStorage override)
    Parse Markdown to HTML (simple built-in parser)
    Render to content area
    Auto-link: (DEFERRED to Step 9 - will scan content for mentions of other page titles and convert to clickable links once actual content exists)
    Clicking internal link opens that page in new tab

2.4 Editing System (editor.js)

Create new file and implement:

    "Edit Page" button switches to edit mode
    Edit mode shows:
        Textarea with raw Markdown content
        Preview pane (side by side or toggle)
        Save button
        Cancel button
        "Revert to Original" button (restore from pages.json)
    Ctrl+E enters edit mode
    Ctrl+S saves edits
    Escape cancels edit mode
    Edits saved to localStorage, keyed by page ID
    Edited pages marked with indicator in sidebar

2.5 Version History

    On save, store previous version
    Keep last 5 versions per page in localStorage
    "History" button shows list of versions with timestamps
    Click version to preview
    "Restore" button to restore a version

2.6 Export/Import (storage.js additions)

    (DEFERRED to Step 3 - will add export/import buttons alongside GM tools)
    "Export" button in header/menu
        Exports all user edits as JSON file download
        Exports bookmarks, notes, preferences
    "Import" button
        File picker for JSON
        Merge or replace options
        Validation before import

2.7 Bookmarks

    "Bookmark" button toggles bookmark on current page
    Bookmarked pages stored in localStorage
    Bookmarks section in sidebar (collapsible)
    Remove bookmark option

2.8 Keyboard Shortcuts

Implement all shortcuts:

    Ctrl+K — Focus search
    Ctrl+E — Edit current page
    Ctrl+S — Save edits
    Ctrl+W — Close current tab
    Ctrl+Tab — Next tab
    Ctrl+Shift+Tab — Previous tab
    Escape — Cancel edit / close modal
    Show shortcuts help modal (? key)

Completion Criteria

    Search finds pages and shows results
    Clicking search result opens page
    Pages render Markdown correctly
    Internal links work and open new tabs
    Edit mode works with preview
    Edits persist in localStorage
    Export downloads JSON file
    Import restores data
    Bookmarks work
    All keyboard shortcuts functional

Stop here and wait for "ok time for step 3"
STEP 3: GM Tools

Trigger: User says "ok time for step 3"
Objectives

Build the Game Master utility panel with tools for running sessions.
Deliverables
3.1 GM Tools Panel (gm-tools.js)

Create slide-out panel (right side) with tabs for different tools:

    Toggle button always visible on right edge
    Panel slides in/out
    Can be pinned open
    Resizable width
    State persists in localStorage

3.2 Dice Roller

Tab 1 of GM panel:

    Common dice buttons: d4, d6, d8, d10, d12, d20, d100
    Custom roll input (e.g., "2d6+5", "4d6 drop lowest")
    Roll button
    Results display with:
        Individual dice shown
        Total
        Roll history (last 20 rolls)
    Clear history button
    "Roll with advantage/disadvantage" quick buttons for d20

3.3 Initiative Tracker

Tab 2 of GM panel:

    Add combatant: Name + Initiative (manual or roll button)
    List sorted by initiative (highest first)
    Current turn indicator
    "Next Turn" button (cycles through)
    "Previous Turn" button
    Remove combatant (X button)
    Edit initiative value
    Add HP tracking (optional field)
    Damage/heal buttons if HP tracked
    Conditions dropdown (add condition badges)
    Clear all button
    Save/load encounter to localStorage

3.4 Quick Notes

All notes should allow easy linking to pages for quick access to information

Tab 3 of GM panel:

    Simple textarea for scratch notes
    Auto-saves on change (debounced)
    Persists in localStorage
    Clear button with confirmation
    "Copy to clipboard" button

3.5 Session Notes

Tab 4 of GM panel:

    Create named sessions
    Each session has:
        Title
        Date
        Notes textarea (larger)
        Referenced pages list
    List of past sessions
    Delete session option
    Export session notes as text/markdown

3.6 Conditions Reference

Tab 5 of GM panel:

    List of 5e conditions (Blinded, Charmed, etc.)
    Plus Oz-specific conditions from the index:
        Witch-Touched
        Time-Slipped
        Green-Blind
        Name-Lost
        Silenced
        Grimmerie-Corrupted
        Puppet-State
        Scraped
        Dragon-Burned
        Hive-Linked
    Click to expand description
    Search/filter conditions

3.7 Floating Stat Blocks

    When viewing a creature page, "Pop Out" button
    Opens stat block in floating window
    Window is:
        Draggable
        Resizable
        Always on top of content
        Closable
    Multiple stat blocks can be open
    Position persists during session

3.8 Split View

    Button in tab bar: "Split View"
    Splits content area vertically (two panes)
    Each pane has own tab bar
    Can view different pages side-by-side
    "Close Split" button to return to single view
    State persists

Completion Criteria

    GM panel slides in/out smoothly
    Dice roller handles all standard dice and custom rolls
    Initiative tracker sorts, tracks turns, handles HP
    Quick notes auto-save
    Session notes create/save/load properly
    Conditions reference shows all conditions
    Floating stat blocks work and are draggable
    Split view allows two pages side-by-side

Stop here and wait for "ok time for step 4"
STEP 4: Page Templates

Trigger: User says "ok time for step 4"
Objectives

Create standardized templates for each page type with full structure (content to be filled in later steps).
Deliverables
4.1 Race Page Template

Create example: character/races/humans/gillikinese

# Gillikinese

> *"The Gillikinese have always believed themselves the natural aristocracy of Oz—educated, refined, and conveniently forgetful of how that refinement was purchased."*

## Overview
[2-3 paragraphs of lore about this human subgroup]

## Racial Traits

|
 Trait 
|
 Description 
|

|
-------
|
-------------
|

|
 
**
Ability Score Increase
**
 
|
 Your Intelligence score increases by 1, and one other ability score of your choice increases by 1. 
|

|
 
**
Age
**
 
|
 Gillikinese mature at the same rate as other humans and live less than a century. 
|

|
 
**
Size
**
 
|
 Medium 
|

|
 
**
Speed
**
 
|
 30 feet 
|

|
 
**
Languages
**
 
|
 Common (Ozian), plus one of your choice 
|


### Gillikinese Education
You gain proficiency in one skill of your choice from: Arcana, History, Investigation, or Religion.

### Social Graces
You have advantage on Charisma checks when interacting with Gillikinese nobility or academic institutions.

## Culture
[Paragraph on Gillikinese society, values, customs]

## Naming Conventions
[Common names, naming traditions]

## Roleplaying a Gillikinese
[Personality traits, ideals, bonds, flaws suggestions]

## GM Notes
[How to use in campaigns, plot hooks, notable Gillikinese NPCs]

## Related Entries
- [Gillikin (Region)](/exploration/regions/gillikin)
- [Shiz University](/exploration/locations/shiz-university)
- [Emerald City Native](/character/races/humans/emerald-city-native)

4.2 Class Page Template

Create example: character/classes/the-adept

# The Adept

> *Those who read the Grimmerie walk a path of power and madness. The Adept has chosen to walk it anyway.*

## Overview
[2-3 paragraphs on class concept and lore]

## Class Features

### Hit Points
- **Hit Dice:** 1d6 per Adept level
- **Hit Points at 1st Level:** 6 + your Constitution modifier
- **Hit Points at Higher Levels:** 1d6 (or 4) + your Constitution modifier per Adept level after 1st

### Proficiencies
- **Armor:** None
- **Weapons:** Daggers, darts, slings, quarterstaffs
- **Tools:** Calligrapher's supplies
- **Saving Throws:** Intelligence, Wisdom
- **Skills:** Choose two from Arcana, History, Insight, Investigation, Medicine, Religion

### Equipment
You start with the following equipment, in addition to the equipment granted by your background:
- (a) a quarterstaff or (b) a dagger
- (a) a scholar's pack or (b) an explorer's pack
- Calligrapher's supplies and a journal

## The Adept Table

|
 Level 
|
 Prof. Bonus 
|
 Features 
|
 Cantrips Known 
|
 Spells Known 
|
 1st 
|
 2nd 
|
 3rd 
|
 4th 
|
 5th 
|

|
-------
|
-------------
|
----------
|
----------------
|
--------------
|
-----
|
-----
|
-----
|
-----
|
-----
|

|
 1st 
|
 +2 
|
 Spellcasting, Grimmerie Initiate 
|
 3 
|
 2 
|
 2 
|
 — 
|
 — 
|
 — 
|
 — 
|

|
 2nd 
|
 +2 
|
 Arcane Tradition 
|
 3 
|
 3 
|
 3 
|
 — 
|
 — 
|
 — 
|
 — 
|

|
 3rd 
|
 +2 
|
 — 
|
 3 
|
 4 
|
 4 
|
 2 
|
 — 
|
 — 
|
 — 
|

[Continue to level 20]

## Class Features (Detailed)

### Spellcasting (Level 1)
[Full spellcasting rules, spellcasting ability, etc.]

### Grimmerie Initiate (Level 1)
[Description of the feature]

### Arcane Tradition (Level 2)
At 2nd level, you choose an arcane tradition that shapes your practice...

## Arcane Traditions

### Reader
You have learned to read the Grimmerie directly...

#### Reader Features
|
 Adept Level 
|
 Feature 
|

|
-------------
|
---------
|

|
 2nd 
|
 Direct Reading, Corruption Resistance 
|

|
 6th 
|
 Improved Reading 
|

|
 10th 
|
 Master Reader 
|

|
 14th 
|
 Grimmerie Bond 
|


##### Direct Reading (Level 2)
[Description]

[Continue for all subclasses: Reader, Echoer, Vessel, Domingon]

## Multiclassing
**Prerequisites:** Intelligence 13
**Proficiencies Gained:** None

## GM Notes
[Balance considerations, campaign integration, notable Adepts in lore]

4.3 Creature Page Template

Create example: creatures/monsters/constructs/tiktok-servitor

# Tiktok (Servitor)

> *"It wound down mid-sentence, mouth still open, eyes still bright. Three hours later someone remembered to wind it back up, and it finished its thought as if nothing had happened."*

## Lore
[2-3 paragraphs on Tiktok servitors in Oz society, their creation, their status]

## Stat Block

___
> ## Tiktok Servitor
> *Medium construct, unaligned*
> ___
> - **Armor Class** 14 (natural armor)
> - **Hit Points** 33 (6d8 + 6)
> - **Speed** 25 ft.
> ___
> | STR | DEX | CON | INT | WIS | CHA |
> |:---:|:---:|:---:|:---:|:---:|:---:|
> | 14 (+2) | 10 (+0) | 12 (+1) | 8 (-1) | 10 (+0) | 6 (-2) |
> ___
> - **Damage Immunities** poison, psychic
> - **Condition Immunities** charmed, exhaustion, frightened, paralyzed, petrified, poisoned
> - **Senses** darkvision 60 ft., passive Perception 10
> - **Languages** understands Common but cannot speak, responds with gestures and written notes
> - **Challenge** 1 (200 XP)
> ___
> ### Traits
> ***Winding Down.*** The Tiktok must be wound every 24 hours. If not wound, it becomes incapacitated until wound again. Winding takes 1 minute.
>
> ***False Appearance.*** While motionless, the Tiktok is indistinguishable from an ordinary mechanical statue.
>
> ***Immutable Form.*** The Tiktok is immune to any spell or effect that would alter its form.
>
> ### Actions
> ***Slam.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (1d10 + 2) bludgeoning damage.
>
> ***Helpful Task.*** The Tiktok performs a simple task it has been instructed to do, such as carrying objects, cleaning, or standing guard.

## Tactics
[How this creature behaves in combat]

## Variants

### Tiktok Guardian
[Higher CR version with better combat abilities]

### Tiktok Companion
[Lower CR, more social abilities]

## Encounter Ideas
[Suggested encounters using this creature]

## GM Notes
[Roleplaying a Tiktok, the question of their souls, plot hooks]

## Related Entries
- [Tiktok (Race)](/character/races/tiktoks)
- [The Gump](/creatures/monsters/constructs/the-gump)
- [Tiktok Maker (Artisan Subclass)](/character/classes/the-artisan#tiktok-maker)

4.4 Location Page Template

Create example: exploration/regions/gillikin

# Gillikin

> *"The north was purple—in heather, in lilac, in the veins of marble quarried from the hills. Even the aristocrats dressed in shades of violet, as if they themselves might bruise."*

## Overview
Gillikin is the northern province of Oz, characterized by its rolling forested hills, prestigious academic institutions, and old-money aristocracy. The region's signature purple hues color everything from the local flora to the fashion of its inhabitants.

## Geography

### Terrain
[Description of landscape, climate, notable geographic features]

### Borders
- **North:** The Gillikin Mountains, impassable beyond
- **East:** The Emerald City, Munchkinland border
- **South:** The Emerald City
- **West:** The Vinkus

## Major Locations

### Shiz University
*See full entry: [Shiz University](/exploration/locations/shiz-university)*
[Brief description]

### The Pertha Hills
[Description, what's there, significance]

### Tenmeadows
[Description]

[Continue for all notable locations]

## Inhabitants

### Demographics
[Who lives here, in what proportions]

### Notable Figures
[Important NPCs, with links to their pages if they exist]

### Animals in Gillikin
[Status of Animals in this region]

## Culture

### Society
[Class structure, values, customs]

### Religion
[Dominant faiths, religious sites]

### Economy
[What they produce, trade, wealth sources]

## History
[Key historical events in this region]

## Current Situation
[What's happening now, tensions, opportunities]

## Hazards

### Environmental
[Natural dangers]

### Political
[Social dangers, surveillance, etc.]

### Creatures
[Dangerous fauna]

## Random Encounters

|
 d12 
|
 Encounter 
|

|
-----
|
-----------
|

|
 1 
|
 A traveling Unionist minister preaching on the road 
|

|
 2 
|
 A carriage of Shiz students heading to or from the university 
|

|
 3 
|
 Gale Force patrol checking travel papers 
|

|
 4-5 
|
 Merchant caravan 
|

|
 6 
|
 [Continue...] 
|


## Adventure Hooks
1. [Plot hook 1]
2. [Plot hook 2]
3. [Plot hook 3]

## GM Notes
[Running adventures in Gillikin, tone, themes]

## Related Entries
- [Gillikinese (Race)](/character/races/humans/gillikinese)
- [Shiz University](/exploration/locations/shiz-university)
- [The Pertha Hills](/exploration/locations/pertha-hills)

4.5 Spell Page Template

Create example: magic/spells/grimmerie/memory-jar

# Memory Jar

*2nd-level enchantment (Grimmerie Tradition)*

> *"She poured her grief into the glass, and it glowed like a firefly. When she corked it, she could no longer remember why she had been crying."*

## Spell Details

|
 Property 
|
 Value 
|

|
----------
|
-------
|

|
 
**
Level
**
 
|
 2nd 
|

|
 
**
School
**
 
|
 Enchantment 
|

|
 
**
Casting Time
**
 
|
 1 minute 
|

|
 
**
Range
**
 
|
 Touch 
|

|
 
**
Components
**
 
|
 V, S, M (a glass jar worth at least 10 gp, which the spell consumes) 
|

|
 
**
Duration
**
 
|
 Until dispelled 
|

|
 
**
Tradition
**
 
|
 Grimmerie 
|


## Description
You touch a willing creature and extract a specific memory from their mind, storing it in the material component. The target must clearly visualize the memory during the casting.

Once stored, the target can no longer recall the memory naturally, though they may be aware that something is missing. The memory appears as a faintly glowing substance within the jar.

The memory can be restored by breaking the jar while touching the original creature. The memory can also be implanted into a different willing creature by the same method, though it will feel foreign to them.

If the jar is broken without touching a creature, the memory is lost forever.

**At Higher Levels.** When you cast this spell using a spell slot of 4th level or higher, you can store multiple related memories (one additional memory per two slot levels above 2nd).

## Spell Lists
- The Adept

## GM Notes
[Creative uses, limitations, story implications]

## Related Entries
- [Memory Bead (Magic Item)](/objects/magic-items/common/memory-bead)
- [Memory Rot (Condition)](/conditions/magical/memory-rot)

4.6 Additional Templates

Create similar templates for:

    Background (equipment, feature, characteristics)
    Magic Item (rarity, attunement, description, properties)
    Faction (overview, goals, structure, notable members, resources, relationships)
    Historical Period (dates, overview, key events, figures, legacy)
    Disease/Condition (symptoms, mechanics, treatment)
    NPC Template (concept, stat suggestions, roleplaying notes)
    Trap/Hazard (detection, trigger, effect, countermeasures)

4.7 Template Documentation

Create a page: meta/templates documenting all templates for future content creation.
Completion Criteria

    All template types created with example content
    Templates follow consistent structure
    Templates include all mechanical and lore sections
    Template documentation page exists
    Example pages render correctly in the wiki

Stop here and wait for "ok time for step 5"
STEP 5: Content — Characters & Classes

Trigger: User says "ok time for step 5"
Objectives

Generate full content for all CHARACTER section pages.
Deliverables
5.1 Races — Humans (9 pages)

Generate full pages for:

    Gillikinese (Upper Gillikin, Lower Gillikin, Pertha Hills Isolates)
    Munchkinlander (Eminent Families, Farming Class, Rush Margins, Free Munchkinland)
    Quadling (Marsh-Born, Displaced, City-Assimilated, Resistance)
    Vinkan (Arjiki, Scrow, Yunamata, Mixed)
    Emerald City Native (Palace-Adjacent, Merchant, Slum-Born)
    Outlander (Evian, Ixian, Quoxian, Unknown)

Each page should have:

    Accurate Maguire lore
    Balanced 5e racial traits
    Cultural details
    Naming conventions
    GM notes with plot hooks

5.2 Races — Animals (6 pages)

    Mammals (Bears, Lions, Wolves, Tigers, Elephants, Badgers, Apes)
    Birds (Eagles, Crows, Owls, Songbirds, Conference history)
    Reptiles & Amphibians
    The Question of Fish
    Hybrid/Uncertain Status (Kalidahs discussion)

Include mechanics for:

    Animal size variations
    Natural weapons
    The social burden of Animal status
    "Passing" as animal (lowercase)

5.3 Races — Other (4 pages)

    Tiktoks (Servitor, Companion, Autonomous, Unique)
    The Touched (Grimmerie-Marked, Witch-Blooded, Time-Slipped, Kumbric Remnants, Dragon-Touched)
    Dragons (Lesser Dragons, The Time Dragon question)
    Winged Monkeys

5.4 Classes (10 pages, each with subclasses)

Full 20-level class builds for:

    The Adept (Reader, Echoer, Vessel, Domingon)
    The Unionist (Minister, Maunt, Flagellant, Ecstatic, Inquisitor)
    The Lurlinite (Pleasure Faith Keeper, Green Warden, Ozma Devotee, Fairy-Touched)
    The Witch (Hedge Witch, Kumbric Inheritor, Made Witch, La Mombey Tradition)
    The Agent (Gale Force, Animal Resistance, Palace Courtier, Foreign Interest, Menacier)
    The Scholar (Shiz Academic, Forbidden Archivist, Natural Philosopher, Animal Studies, Barrister)
    The Soldier (Gale Force, Arjiki Warrior, Quadling Guerrilla, Mercenary, Munchkin Militia, Home Guard)
    The Artisan (Tiktok Maker, Glassblower, Green-Smith, Apothecary, Beekeeper)
    The Traveler (Caravan Guide, Desert Walker, Gillikin Ranger, Clock-Keeper, Smuggler)
    The Performer (Clock Troupe, Palace Entertainer, Travelling Player, Propagandist)

5.5 Backgrounds (35 pages)

Full background pages for all backgrounds in the index, including:

    Feature
    Proficiencies
    Equipment
    Suggested characteristics (personality traits, ideals, bonds, flaws)
    Lore connections
    Variant options

5.6 Special Skills (15 pages)

Full pages for:

    Grimmerie Lore
    Animal Etiquette
    Unionist Doctrine
    Lurline Mysteries
    Political Navigation
    Witch-Sign Reading
    Tiktok Maintenance
    Green Sight
    Time Sense
    Kumbric Memory
    Domingon Trance
    Dragon Lore
    Bee Speaking
    Scraping Resistance
    Underground Navigation

Each skill page: what it does, when to roll, sample DCs, related feats/features.
Content Standards

    Use Maguire lore accurately
    Balance 5e mechanics appropriately (compare to official content)
    Cross-link to related pages
    Include GM notes on every page
    Avoid placeholder text

Completion Criteria

    All 19+ race pages complete with full lore and mechanics
    All 10 class pages complete with full 20-level progression
    All 35 background pages complete
    All 15 special skill pages complete
    All pages cross-linked appropriately
    Search index updated

Stop here and wait for "ok time for step 6"
STEP 6: Content — Magic & Equipment

Trigger: User says "ok time for step 6"
Objectives

Generate full content for MAGIC and EQUIPMENT sections.
Deliverables
6.1 Spells — Grimmerie Tradition (25+ spells)

Full spell pages for all spells listed in index:

    Cantrips through Higher Circles
    Proper formatting (level, school, casting time, etc.)
    Lore-appropriate descriptions
    GM notes on each

6.2 Spells — Domingon Tradition (12+ spells)

Quadling trance and spirit magic.
6.3 Spells — Unionist Tradition (15+ spells)

Divine magic of the Unnamed God.
6.4 Spells — Lurline Tradition (10+ spells)

Primal old ways magic.
6.5 Spells — Witch Tradition (15+ spells)

Hedge magic and Kumbric magic.
6.6 Magical Phenomena (10 pages)

Full pages on:

    Grimmerie Corruption
    Witch Marks
    Time Slippage
    The Green Effect
    Animal Awakening
    Tiktok Souls
    Dragon Fire Effects
    The Scraping (magical aspects)
    Tip's Condition
    Rain's Gift
    The Bees' Collective

6.7 Armor (1 comprehensive page + individual notable items)

Tables for all armor types, Oz-specific options.
6.8 Weapons (1 comprehensive page + individual notable items)

Tables for all weapon types, Oz-specific options.
6.9 Adventuring Gear (1 comprehensive page)

All Oz-specific gear with costs and descriptions.
6.10 Tools (1 comprehensive page)

Artisan's tools, professional tools, musical instruments, specialist tools.
6.11 Mounts and Vehicles (1 comprehensive page)

Including special entries for Witch's Broom, the Clock, Flying Monkeys.
6.12 Trade Goods (1 page)

Economy and trade in Oz.
6.13 Poisons (1 comprehensive page)

All poisons with mechanics.
6.14 Magic Items — All Rarities

Generate pages for ALL magic items in the index:

    Common (10 items)
    Uncommon (13 items)
    Rare (13 items)
    Very Rare (12 items)
    Legendary (11 items)
    Artifacts (The Grimmerie, The Clock, Lurline's Legacy — detailed multi-section pages)
    Cursed Items (8 items)

Each magic item page: rarity, attunement, full description, properties, lore, GM notes.
Completion Criteria

    All spell traditions complete with full spell lists
    Magical phenomena pages complete
    Equipment tables complete and functional
    All magic items have full pages
    Artifact pages are comprehensive (1000+ words each)
    All cross-links working

Stop here and wait for "ok time for step 7"
STEP 7: Content — Creatures & NPCs

Trigger: User says "ok time for step 7"
Objectives

Generate full content for CREATURES section with stat blocks.
Deliverables
7.1 Constructs (5+ creatures)

    Tiktok Servitor (CR 1)
    Tiktok Guardian (CR 3)
    Tiktok Companion (CR 1/4)
    The Gump (CR 5, unique)
    Animated Armor variants
    Clockwork Familiar

7.2 Undead (5+ creatures)

    Ghost of the Southstairs
    Witch's Servant
    Memory Shade
    The Restless
    Scraping Victim (not dead, but hollow)

7.3 Aberrations (4+ creatures)

    Grimmerie Manifestation
    Time-Wounded Being
    Sleeve of Ghosts Entity
    Kumbric Remnant

7.4 Dragons (4+ creatures)

    Lesser Dragon (CR 8)
    Dragon Wyrmling (CR 2)
    War Dragon (CR 10)
    The Time Dragon (CR ??, legendary)

7.5 Other Monster Types

    Kalidah (CR 4)
    Giant Spider (Quadling Marsh)
    Flying Monkey (CR 1/2)
    Winged Monkey Swarm (CR 3)
    Magical Bees (various)

7.6 NPC Stat Blocks by Faction (20+ templates)

Create NPC stat blocks for common types:

Government:

    Palace Guard (CR 1/2)
    Gale Force Soldier (CR 1)
    Gale Force Officer (CR 3)
    Menacier Agent (CR 4)

Religious:

    Unionist Minister (CR 1/2)
    Maunt Sister (CR 1/4)
    Inquisitor (CR 5)

Resistance:

    Animal Resistance Fighter (CR 1)
    Cell Leader (CR 3)
    Underground Railroad Conductor (CR 2)

Academic:

    Shiz Professor (CR 1/2)
    Forbidden Scholar (CR 2)

Military:

    Munchkinland Militia (CR 1/2)
    Home Guard (CR 1)
    Arjiki Warrior (CR 2)

Criminal:

    Black Market Dealer (CR 1)
    Smuggler (CR 2)
    Assassin (CR 5)

Other:

    Clock Troupe Performer (CR 1/4)
    Witch (various CRs)
    Yackle (CR ??, unique)

7.7 Notable NPC Pages (10+ individuals)

Full pages (not just stat blocks) for:

    Yackle (detailed, mysterious)
    Mr. Boss
    Generic "Cherrystone-type" officer
    Generic Morrible-type figure
    Other key NPC archetypes

7.8 NPC Template Pages

Templates from the index:

    The Corrupt Official
    The True Believer
    The Disillusioned Soldier
    The Animal in Hiding
    The Collaborator
    The Resistance Hero
    etc.

Completion Criteria

    All creature stat blocks complete and balanced
    Stat blocks render properly and can be popped out
    NPC templates cover all factions
    Notable NPC pages are detailed
    All creatures have lore sections and GM notes

Stop here and wait for "ok time for step 8"
STEP 8: Content — World & Lore

Trigger: User says "ok time for step 8"
Objectives

Generate full content for EXPLORATION, UNDERGROUND, FACTIONS, RELIGION, HISTORY, and CONDITIONS.
Deliverables
8.1 Regions (5 major pages)

Full detailed pages for:

    Gillikin
    Munchkinland (including Free vs. Loyal divide)
    Quadling Country
    The Vinkus
    The Emerald City

Each 2000+ words with all template sections.
8.2 Major Locations (15+ pages)

    Shiz University
    Kiamo Ko
    Southstairs
    The Sleeve of Ghosts
    The Deadly Desert
    Apple Press Farm
    Colwen Grounds
    The Pertha Hills
    The Clock's current location
    Various Maunteries
    Key city districts

8.3 The Underground (7 pages)

    Animal Underground Railroad (detailed)
    Southstairs Complete Guide
    Criminal Networks
    Secret Societies
    Hidden Locations
    Underground Routes
    Information Networks

8.4 Factions (20+ pages)

Full faction pages for all factions in index:

    Palace/Government (Wizard era, Shell era)
    Gale Force
    Unionist Church
    Mauntery System
    Lurlinite Remnants
    Animal Resistance
    Free Munchkinland Movement
    Criminal networks
    Academic institutions
    Military factions
    The Clock's People
    Secret organizations

8.5 Religion (6 pages)

    The Unnamed God (comprehensive)
    Lurline & The Old Ways
    The Kumbric Witch
    Foreign Pantheons
    Religious Conflicts
    Theological Debates

8.6 Historical Periods (8 pages)

    The Age Before (Kumbric)
    The Age of Lurline
    The Ozma Dynasty
    The Wizard's Arrival
    The Wizard's Reign
    The Witch Years
    The Interregnum
    Emperor Shell's Reign

8.7 Conditions & Diseases (15+ pages)

    All mundane diseases
    All magical diseases
    All Oz-specific conditions (full mechanical write-ups)
    Madness variants

8.8 Hazards & Traps (2 pages)

    Environmental hazards by region
    Trap types (mundane, magical, institutional)

Completion Criteria

    All region pages complete and detailed
    All major location pages complete
    Underground section comprehensive and useful
    All faction pages complete with structure and goals
    Religion section theologically detailed
    Historical timeline coherent
    All conditions have mechanical effects

Stop here and wait for "ok time for step 9"
STEP 9: Integration & Polish

Trigger: User says "ok time for step 9"
Objectives

Final integration, cross-linking audit, testing, and documentation.
Deliverables
9.1 Cross-Linking Audit

    Run automated check: every page title mentioned in content should be a link
    Fix broken links
    Add "Related Entries" sections where missing
    Ensure bidirectional linking (if A links to B, B should link to A where sensible)

9.2 Search Index Update

    Rebuild search index with all final content
    Test search for common queries
    Ensure all pages are findable

9.3 Random Tables (Appendix pages)

Create functional random tables:

    Encounter tables by region (rollable in GM tools)
    NPC generator tables
    Rumor tables by era
    Treasure tables
    Event tables
    Underground contact tables

9.4 Quick Reference Pages

    Oz calendar
    Currency conversion
    Travel times between locations
    Common phrases/slang
    Era timeline
    Who's alive when

9.5 Adventure Hooks (4 pages)

    By region
    By faction
    By theme
    By party composition

9.6 Campaign Frameworks (9 pages)

Full campaign outlines for:

    Animal Liberation Campaign
    Political Intrigue Campaign
    Witch Hunt Campaign
    Historical Mystery Campaign
    Revolution Campaign
    War Campaign
    Underground Railroad Campaign
    Dragon Hunter Campaign
    Ozma Restoration Campaign

9.7 DM Resources (4 pages)

    Tone Guide
    Safety Tools (comprehensive)
    Session Zero Guide
    The Witch's Wake One-Shot (full adventure)

9.8 Documentation

Create README.md and CONTRIBUTING.md:

    How to run the wiki locally
    How to add new pages
    How to edit existing pages
    Data format documentation
    Template usage guide

9.9 Testing

    Test all features in multiple browsers (Chrome, Firefox, Safari)
    Test tablet responsiveness
    Test all keyboard shortcuts
    Test export/import cycle
    Test offline functionality
    Performance test with all pages loaded

9.10 Final Polish

    Consistent formatting across all pages
    Spell-check all content
    Verify all stat blocks are balanced
    Final UI polish (spacing, alignment, colors)
    Loading states and error handling

Completion Criteria

    All cross-links working
    Search returns relevant results for any query
    Random tables are rollable
    All reference pages complete
    Campaign frameworks are usable
    DM resources comprehensive
    Documentation complete
    All tests pass
    Wiki is ready for use at the table

PROJECT COMPLETE

After Step 9, the wiki should be a fully functional, comprehensive, editable reference for running Maguire Oz TTRPG campaigns. It should support a GM at the table with quick lookups, multiple reference tabs, and utility tools.
Summary of Final Deliverables

    ~300+ individual wiki pages
    Full interactive web application
    GM tools (dice, initiative, notes)
    Search across all content
    Editable with local persistence
    Export/import for backup
    Documentation for future additions
    The Witch's Wake one-shot ready to run
