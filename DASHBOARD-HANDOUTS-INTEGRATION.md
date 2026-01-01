# Dashboard Handouts Integration Guide

## How Handouts Connect to the GM Dashboard

The GM Dashboard at `dashboard.html` has a **Handouts Panel** that tracks which handouts players have found. Here's how the printed handouts integrate with the dashboard system.

---

## Dashboard Handouts Panel

### What the Dashboard Shows

```
┌─────────────────────────────────┐
│ 📄 Handouts           0/12      │
├─────────────────────────────────┤
│ ☐ The Will (Foyer)              │
│ ☐ Cemetery Epitaphs              │
│ ☐ Sheet Music (Music Room)      │
│ ☐ Servant's Guide (Quarters)    │
│ ☐ Telescope Note (Observatory)  │
│ ☐ Family Tree (Cabinet 6)       │
│ ☐ Yackle's Letter (Cabinet 8)   │
│ ☐ I LOVE U Carving (Cabinet 8)  │
│ ☐ [4 more discovery handouts]   │
└─────────────────────────────────┘
```

### How to Use During Play

1. **When players find a handout** (e.g., discover the sheet music in Music Room):
   - Give them the printed handout from your folder
   - Click the checkbox in the dashboard's Handouts panel
   - Counter updates: "1/12" → "2/12" etc.

2. **Dashboard tracks exploration progress:**
   - Players can see how many handouts they've found vs. total available
   - Encourages thorough exploration of the estate

---

## Handout-to-Dashboard Mapping

### Story Handouts (Found in Rooms)

| Printed Handout | Dashboard Entry | Room Location | How Players Get It |
|-----------------|----------------|---------------|---------------------|
| 01-the-will | "The Will" | Foyer | Automatic at session start |
| 04-cemetery-epitaphs | "Cemetery Epitaphs" | Cemetery (Grounds) | When exploring graves |
| 05-music-room-sheet-music | "Sheet Music" | Music Room (Seal 1) | When examining piano |
| 02-servants-daily-rounds | "Servant's Guide" | Servant Quarters (Seal 4) | When finding notebook |
| 09-telescope-note | "Telescope Note" | Observatory (Seal 5) | When unscrewing telescope |

### Cabinet Handouts (Found in Yackle's Study)

| Printed Handout | Dashboard Entry | Cabinet | Unlock Requirement |
|-----------------|----------------|---------|---------------------|
| 10-family-tree-partial | "Family Tree" | Cabinet 6 | Blood-Sealed (claim Ostrega name) |
| 03-yackles-last-letter | "Yackle's Letter" | Cabinet 8 | All 7 seals broken |
| 07-i-love-u-carving | "I LOVE U Carving" | Cabinet 8 | All 7 seals broken |

### Props (Not in Dashboard Handouts Panel)

These are **physical props** at the table, not handouts to click off:

| Printed Handout | Usage | Not in Dashboard Because... |
|-----------------|-------|----------------------------|
| 06-dining-room-name-cards | Pre-placed at table | It's a prop, not a discovery |
| 08-cabinet-labels | Attached to boxes | It's labels, not content |
| 12-reward-tokens-and-items | Given as rewards | Tracked in Seals/Cabinet panels instead |

---

## Dashboard Seals Panel Integration

### What the Dashboard Shows

```
┌─────────────────────────────────┐
│ ⭐ Seals Tracker      0/7       │
├─────────────────────────────────┤
│ ☐ SEAL 1: MEMORY                │
│   Location: Music Room           │
│   Prop: 4 Music Boxes           │
│   Reward: Reroll Token          │
│                                 │
│ ☐ SEAL 2: BLOOD                 │
│   Location: Portrait Gallery     │
│   Prop: 8 Textile Swatches      │
│   Reward: Death's Denial        │
│   ... (5 more seals)            │
└─────────────────────────────────┘
```

### Using Seal Rewards

When players complete a seal:
1. **Check off seal** in dashboard's Seals panel
2. **Give reward card** from handout 12 (cut-out cards)
3. Counter updates: "1/7" → "2/7"
4. Track who received which reward token

**Example:**
- Players solve Seal 1 (Memory) by placing Simple Wood music box on piano
- GM clicks "SEAL 1: MEMORY" checkbox in dashboard
- GM gives "Reroll Token" card (from handout 12) to one player
- Dashboard now shows "1/7 Seals Complete"

---

## Dashboard Cabinet System Integration

The dashboard can track cabinet openings too:

```
[Custom Tracker]
Cabinet 1 (Star-Lock): ☐ Opened
Cabinet 2 (Bone-Lock): ☐ Opened
Cabinet 3 (Smoke-Glass): ☐ Opened
... etc
```

When players open a cabinet:
1. **Give loot cards** from handout 12
2. **Give story handouts** if applicable (e.g., Family Tree from Cabinet 6)
3. **Mark cabinet as opened** in your notes or dashboard

---

## Dashboard Room Descriptions Integration

### The Current Room Panel

```
┌─────────────────────────────────┐
│ 📍 Current Room                 │
│ [Mark Explored]                 │
├─────────────────────────────────┤
│ THE MUSIC ROOM                  │
│ Ground Floor                    │
│                                 │
│ ⭐ Contains SEAL 1: MEMORY      │
│                                 │
│ [Full room description shows    │
│  here from room-data.js]        │
└─────────────────────────────────┘
```

When you **click a room** on the dashboard map:
- Full description appears (already implemented!)
- Shows if room has a seal or handout
- You can mark room as "Explored"

**Your workflow:**
1. Click "Music Room" on dashboard map
2. Read room description to players
3. When they examine piano, give handout 05 (sheet music)
4. When they solve seal, give reward card from handout 12
5. Check off seal in Seals panel

---

## Complete Handout Workflow Example

### Scenario: Players Enter Music Room (Seal 1)

**Step 1: Navigation**
- GM clicks "Music Room" on dashboard map
- Dashboard shows: "⭐ Contains SEAL 1: MEMORY"
- Room description appears in Current Room panel

**Step 2: Exploration**
- GM reads room description aloud
- Players say "I examine the piano and music stand"
- GM gives **handout 05** (sheet music) to players

**Step 3: Puzzle Solving**
- Players wind music boxes, compare to sheet music
- They figure out Simple Wood box is correct
- They place it on piano → seal breaks!

**Step 4: Reward**
- GM gives **Reroll Token card** from handout 12 to one player
- GM clicks checkbox in Seals panel
- Dashboard updates: "Seals Tracker 1/7"

**Step 5: Tracking**
- GM marks Music Room as "Explored"
- GM notes in Session Notes: "Seal 1 complete, Averic has Reroll Token"

---

## Dashboard Session Notes Integration

Use the **Session Notes** panel at bottom of dashboard to track handout distribution:

```
SESSION NOTES:

12:00 — Session start, gave The Will (handout 01)
12:15 — Players found Cemetery, gave Epitaphs (handout 04)
12:45 — Seal 1 (Memory) complete, Averic received Reroll Token
1:20 — Cabinet 1 opened, party got Healing Potion + Scroll
1:45 — Seal 2 (Blood) complete, Liir received Death's Denial
2:30 — Cabinet 6 opened, gave Family Tree (handout 10), revealed lineage fraud
3:15 — All 7 seals broken! Cabinet 8 opened, gave Last Letter + I LOVE U carving
3:20 — THE REVEAL — Viridian is Yackle, combat begins!
```

---

## Quick Reference: What Goes Where

### In the Dashboard (Digital Tracking)

| Panel | Tracks | Updates When |
|-------|--------|--------------|
| **Seals Tracker** | 7 seals completion | Seal puzzle solved |
| **Handouts Panel** | 12 discoverable handouts | Players find/given handout |
| **Current Room** | Active room description | Room clicked on map |
| **Session Notes** | Your personal tracking | You type notes |

### On the Table (Physical Props)

| Location | Contains | From Handout |
|----------|----------|--------------|
| **Your Left** | Story handouts folder | 01-05, 09-10 |
| **Your Right** | Reward card envelopes | 12 (cut into cards) |
| **Center Table** | Cabinet boxes | 08 (labels) + contents |
| **By Rooms** | Seal props in bags | Music boxes, fabric, cards, etc. |
| **Gaming Table** | REAL CANDLE + matches | For Seal 5! |

---

## Printing for Dashboard Reference

### Recommended: Print This Integration Guide

Print this file (`DASHBOARD-HANDOUTS-INTEGRATION.md`) and keep it **next to your laptop** running the dashboard. It shows you exactly when to give which handout based on dashboard activity.

### Dashboard + Handouts Dual-Monitor Setup

**Ideal Setup:**
- **Monitor/Laptop 1:** Dashboard running at `dashboard.html`
  - Track seals, rooms, timeline
- **Monitor/Laptop 2 or Tablet:** Handout 00 (Master Guide) open
  - Reference when to give each handout
- **Physical Table:** Organized handouts and props

**Single Monitor Setup:**
- Dashboard full-screen on laptop
- Printed handout guide (00-HANDOUTS-GUIDE.html) on table
- Glance between screen and paper as needed

---

## Dashboard Handout Counter Explained

### Why "0/12" Not "0/13"?

The dashboard tracks **12 handouts** because:

**Counted (12 handouts):**
1. The Will (01)
2. Cemetery Epitaphs (04)
3. Sheet Music (05)
4. Servant's Guide (02)
5. Telescope Note (09)
6. Family Tree (10)
7. Yackle's Letter (03)
8. I LOVE U Carving (07)
9-12. [4 additional discovery handouts in full adventure]

**Not Counted:**
- Name Cards (06) — Pre-placed prop
- Cabinet Labels (08) — Labels, not discoveries
- Props Checklist (11) — GM reference only
- Reward Cards (12) — Tracked in Seals/Cabinet panels
- Master Guide (00) — GM reference only

---

## Tips for Smooth Integration

### Before Session
- [ ] Open dashboard in browser
- [ ] Print handout 00 (Master Guide) for reference
- [ ] Have handouts 01-10 organized in folder by number
- [ ] Have handout 12 cut into cards in envelopes
- [ ] Test clicking rooms on dashboard to see descriptions

### During Session
- [ ] When players enter room: Click room on dashboard
- [ ] When players find handout: Give printed copy + check dashboard
- [ ] When seal completed: Give reward card + check Seals panel
- [ ] When cabinet opened: Give loot cards + mark in notes
- [ ] Update Session Notes panel regularly

### End of Session
- [ ] Dashboard auto-saves state to localStorage
- [ ] Export session notes if desired (Export button)
- [ ] Next session, dashboard loads right where you left off

---

## You're All Set! 🎉

The handouts in `handouts-pdf/` and the GM Dashboard work together perfectly:

**Dashboard = Digital tracking & room info**
**Handouts = Physical props & story reveals**
**Together = Seamless GM experience**

Just print the files, organize them, and you're ready to run an incredible session!
