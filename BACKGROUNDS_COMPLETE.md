# Backgrounds Complete - Step 5 Phase 3

## Summary
All 34 background pages for the Maguire Oz TTRPG have been successfully added to the wiki from the user-provided background-text.json file.

## Backgrounds Added

### Academic Backgrounds (4)
1. **Shiz University Student/Graduate** - Elite university education
2. **Crage Hall Attendee** - Science and engineering focus
3. **Three Queens College Alumnus** - Women's college, radical politics
4. **Briscoe Hall** - Traditional, conservative education

### Religious Backgrounds (3)
5. **Courts of Justice Clerk** - Legal/judicial religious service
6. **Mauntery Escapee** - Fled monastic life
7. **Mauntery Devotee** - Dedicated religious adherent
8. **Pleasure Faith Apostate** - Left hedonistic religion

### Government/Military Backgrounds (4)
9. **Wizard's Bureaucrat** - Current regime official
10. **Emperor's Administrator** - Previous regime official
11. **Gale Force Veteran** - Military service
12. **Palace Servant** - Royal household staff

### Resistance Backgrounds (5)
13. **Resistance Courier** - Underground messenger
14. **Conference of the Birds Veteran** - Animal uprising participant
15. **Underground Railroad Operator** - Helps Animals escape
16. **Free Munchkinland Revolutionary** - Independence fighter
17. **Kiamo Ko Retainer** - Servant to Elphaba/resistance

### Trauma/Survivor Backgrounds (6)
18. **Southstairs Survivor** - Survived brutal battle
19. **Apple Press Farm Survivor** - Witnessed childhood trauma
20. **Quadling Genocide Survivor** - Survived ethnic cleansing
21. **Orphan of the Animal Purges** - Lost family to persecution
22. **Former Animal (Stripped of Speech)** - Had consciousness suppressed
23. **Dragon Survivor** - Survived dragon attack

### Cultural/Regional Backgrounds (5)
24. **Quadling Marsh Dweller** - Traditional Quadling culture
25. **Emerald City Urchin** - Urban poverty
26. **Vinkus Tribal Exile** - Banished from tribal lands
27. **Arjiki Royal Connection** - Connected to Vinkus royalty
28. **Animal Passing as animal** - Hiding consciousness

### Service/Trade Backgrounds (7)
29. **Colwen Grounds Servant** - Manor house staff
30. **Travelling Player** - Performer/entertainer
31. **Black Market Dealer** - Criminal commerce
32. **Forger/Identity Maker** - Creates false documents
33. **Thropp Family Connection** - Connected to Elphaba's family
34. **Foreign Diplomat** - International relations

## Format and Structure

Each background page includes:
- **Title and Quote** - Thematic introduction
- **Overview** - 2-3 paragraphs of background context
- **Applicable Races** - Which races commonly have this background
- **Skill Proficiencies** - 2 skills gained
- **Tool Proficiencies** - Tools or additional skills
- **Languages** - Language options
- **Equipment** - Starting gear with Oz flavor
- **Feature** - Special background ability
- **Suggested Characteristics** - Random tables for:
  - Personality Traits (d8 table)
  - Ideals (d6 table with alignment)
  - Bonds (d6 table)
  - Flaws (d6 table)
- **GM Notes** - Advice for using this background
- **Related Pages** - Links to relevant wiki pages

## Design Principles

### Deep Oz Integration
- Every background reflects the political and social context of Maguire's Oz
- Many backgrounds deal directly with trauma, persecution, and resistance
- Backgrounds reference specific locations, events, and NPCs from the novels

### Mechanical Balance
- All backgrounds follow 5e D&D standards
- 2 skill proficiencies + tools/languages
- Equipment packages worth 10-25 gp equivalent
- Features provide narrative/social benefits without breaking game balance

### Narrative Depth
- Characteristics tables are specific and flavorful
- GM notes provide hooks for campaigns
- Many backgrounds create instant plot connections

### Moral Complexity
- Backgrounds span the political spectrum (regime loyalists to revolutionaries)
- No background is purely "good" or "evil"
- Many backgrounds involve difficult choices and compromises

## Cross-References

### Backgrounds Reference These Locations:
- Shiz University
- Southstairs
- Kiamo Ko
- Apple Press Farm
- Colwen Grounds
- Emerald City
- Quadling Country
- The Vinkus
- Munchkinland

### Backgrounds Reference These Factions:
- The Wizard's regime
- Gale Force (military)
- Unionist Church
- Mauntery system
- Animal Resistance
- Free Munchkinland movement
- Underground Railroad
- Criminal networks

### Backgrounds Reference These Events:
- The Wizard's coup
- Emperor Shell's reign
- Southstairs massacre
- Apple Press Farm incident
- Quadling genocide
- Animal purges
- Conference of the Birds uprising
- Dragon attacks

### Backgrounds Reference These NPCs/Families:
- Elphaba Thropp
- The Thropp family
- Arjiki royalty
- The Wizard
- Gale Force commanders

## Technical Implementation

### Processing Method
- User provided background-text.json (Python code generating HTML)
- Created process_backgrounds.py to execute the code and extract pages
- Added helper functions (dtable, ideals_rows, related_entries_html)
- Fixed make_entry function to properly separate content from metadata
- Successfully processed 34 complete backgrounds

### HTML Quality
- All pages use proper HTML structure
- Random tables formatted as proper HTML tables
- Inline links use onclick format for wiki navigation
- Blockquotes for thematic quotes
- Proper heading hierarchy

## Statistics

- **Total Backgrounds:** 34 (note: 35th "Loyal Oz Patriot" incomplete in source)
- **Average Page Length:** ~150-200 lines of HTML
- **Total New Pages Added:** 34
- **Cross-References:** 10-15 per background

## Wiki Status Update

- **Previous Total:** 43 pages (24 races + 9 classes + 5 spell traditions + 5 other)
- **After Backgrounds:** 77 pages
- **Remaining for Step 5:** Special Skills pages (~15 pages)

## Next Steps

Step 5 can now move to:
- **Phase 4:** Special Skills pages (Animal Special Skills, Class Features, etc.)
- **Phase 5:** Integration and cross-linking

Alternatively, continue with Step 6:
- **6.2:** Magical Phenomena (11 pages)
- **6.3:** Equipment pages (8 pages)
- **6.4:** Magic Items (70 pages)

## Files Modified
- `/data/pages.json` - Added 34 new background pages
- Created `process_backgrounds.py` helper script
- This completion summary

---

**Completion Date:** Step 5 Phase 3 Complete
**Total Wiki Pages Now:** 77
**Quality:** Full D&D 5e-compatible backgrounds with deep Oz lore integration
**User Contribution:** All 34 backgrounds written by user, successfully processed and added
