// The Witch's Wake - GM Dashboard Data
const DashboardData = {
  // All 22 rooms + exterior areas
  rooms: {
    // Exterior
    'approach': {
      id: 'approach',
      name: 'The Approach',
      floor: 'grounds',
      position: { x: 50, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['cemetery', 'foyer']
    },
    'cemetery': {
      id: 'cemetery',
      name: 'The Cemetery',
      floor: 'grounds',
      position: { x: 20, y: 60 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: true,
      connections: ['approach']
    },

    // Ground Floor
    'foyer': {
      id: 'foyer',
      name: 'The Foyer',
      floor: 'ground',
      position: { x: 50, y: 50 },
      explored: false,
      partyHere: true,
      hasSeal: false,
      hasSecret: false,
      hasHandout: true,
      connections: ['parlor', 'music-room', 'library', 'chapel', 'dining-room']
    },
    'parlor': {
      id: 'parlor',
      name: 'The Parlor',
      floor: 'ground',
      position: { x: 20, y: 50 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['foyer', 'library']
    },
    'music-room': {
      id: 'music-room',
      name: 'The Music Room',
      floor: 'ground',
      position: { x: 80, y: 35 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'memory',
      hasSecret: false,
      hasHandout: false,
      connections: ['foyer'],
      description: `<p>A grand piano dominates the room. Four music boxes sit on a shelf beside sheet music.</p>
        <h4>SEAL 1: MEMORY - "The past is real"</h4>
        <p><strong>Prop:</strong> 4 Music Boxes (brass ornate, simple wood, painted flowers, black lacquer)</p>
        <p><strong>Puzzle:</strong> Wind each box, compare to sheet music. Place the <strong>Simple Wood</strong> box (plainest, original melody) on piano's fallboard.</p>
        <p><strong>Target:</strong> Averic (Scholar) - will be tempted by the better-sounding Brass Ornate box</p>
        <p><strong>Failure:</strong> Piano slams lid. DC 13 Dex save or 2d6 damage. After 3 failures, piano plays backward as hint, locks 10 min.</p>
        <p><strong>Reward:</strong> Reroll Token (reroll one failed d20, once)</p>`
    },
    'library': {
      id: 'library',
      name: 'The Library',
      floor: 'ground',
      position: { x: 20, y: 70 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'nature',
      hasSecret: false,
      hasHandout: true,
      connections: ['foyer', 'parlor'],
      description: `<p>Towering bookshelves filled with volumes on natural history and Animals. Four specific books glow faintly.</p>
        <h4>SEAL 3: NATURE - "Beings are their kind"</h4>
        <p><strong>Prop:</strong> 4 Animal Books + Sigil Pieces inside each</p>
        <p><strong>Puzzle:</strong> Arrange the 4 puzzle pieces (from inside the books) to form the complete Animal Liberation sigil.</p>
        <p><strong>Target:</strong> Frederick (Animal) - must openly claim Animal identity</p>
        <p><strong>Failure:</strong> Books slam shut. 1d6 force damage + DC 12 Str check to open again. After 3 failures, books speak: "You hide what you are. The seal knows."</p>
        <p><strong>Reward:</strong> True Sight Token (see through one illusion/disguise, auto-success)</p>`
    },
    'chapel': {
      id: 'chapel',
      name: 'The Chapel',
      floor: 'ground',
      position: { x: 80, y: 70 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['foyer']
    },
    'dining-room': {
      id: 'dining-room',
      name: 'The Dining Room',
      floor: 'ground',
      position: { x: 50, y: 30 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'hunger',
      hasSecret: false,
      hasHandout: false,
      connections: ['foyer', 'kitchen']
    },
    'kitchen': {
      id: 'kitchen',
      name: 'The Kitchen',
      floor: 'ground',
      position: { x: 80, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['dining-room', 'servant-quarters', 'greenhouse']
    },
    'servant-quarters': {
      id: 'servant-quarters',
      name: 'Servant Quarters',
      floor: 'ground',
      position: { x: 65, y: 15 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'service',
      hasSecret: false,
      hasHandout: false,
      connections: ['kitchen']
    },
    'greenhouse': {
      id: 'greenhouse',
      name: 'The Greenhouse',
      floor: 'ground',
      position: { x: 20, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['kitchen']
    },

    // Upper Floor
    'portrait-gallery': {
      id: 'portrait-gallery',
      name: 'Portrait Gallery',
      floor: 'upper',
      position: { x: 80, y: 50 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'blood',
      hasSecret: false,
      hasHandout: false,
      connections: ['master-bedroom', 'memorial-room']
    },
    'memorial-room': {
      id: 'memorial-room',
      name: 'Memorial Room',
      floor: 'upper',
      position: { x: 50, y: 50 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['portrait-gallery', 'master-bedroom']
    },
    'master-bedroom': {
      id: 'master-bedroom',
      name: 'Master Bedroom',
      floor: 'upper',
      position: { x: 20, y: 50 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: true,
      connections: ['memorial-room', 'portrait-gallery']
    },
    'guest-room-1': {
      id: 'guest-room-1',
      name: 'Guest Room 1 (Scholar)',
      floor: 'upper',
      position: { x: 20, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: []
    },
    'guest-room-2': {
      id: 'guest-room-2',
      name: 'Guest Room 2 (Soldier)',
      floor: 'upper',
      position: { x: 50, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: []
    },
    'guest-room-3': {
      id: 'guest-room-3',
      name: 'Guest Room 3 (Animal)',
      floor: 'upper',
      position: { x: 80, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: []
    },

    // Attic/Third Floor
    'nursery': {
      id: 'nursery',
      name: 'The Nursery',
      floor: 'attic',
      position: { x: 20, y: 40 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['yackle-study']
    },
    'yackle-study': {
      id: 'yackle-study',
      name: "Yackle's Study",
      floor: 'attic',
      position: { x: 50, y: 40 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['nursery', 'observatory']
    },
    'observatory': {
      id: 'observatory',
      name: 'The Observatory',
      floor: 'attic',
      position: { x: 80, y: 40 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'sacrifice',
      hasSecret: false,
      hasHandout: false,
      connections: ['yackle-study', 'hall-of-mirrors']
    },
    'hall-of-mirrors': {
      id: 'hall-of-mirrors',
      name: 'Hall of Mirrors',
      floor: 'attic',
      position: { x: 50, y: 65 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'deed',
      hasSecret: false,
      hasHandout: false,
      connections: ['observatory']
    },

    // Cellar
    'wine-cellar': {
      id: 'wine-cellar',
      name: 'Wine Cellar',
      floor: 'cellar',
      position: { x: 50, y: 20 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['main-cellar']
    },
    'main-cellar': {
      id: 'main-cellar',
      name: 'Main Cellar',
      floor: 'cellar',
      position: { x: 50, y: 50 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: false,
      hasHandout: false,
      connections: ['wine-cellar', 'heart-chamber']
    },
    'heart-chamber': {
      id: 'heart-chamber',
      name: 'The Heart Chamber',
      floor: 'cellar',
      position: { x: 50, y: 80 },
      explored: false,
      partyHere: false,
      hasSeal: false,
      hasSecret: true,
      hasHandout: false,
      connections: ['main-cellar']
    }
  },

  // The Eight Secrets
  secrets: {
    memory: {
      id: 'memory',
      character: 'Averic (Scholar)',
      binding: 'Memory',
      summary: 'Forged mentor\'s letters',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Disadvantage on Int saves; Yackle counters one spell free'
    },
    blood: {
      id: 'blood',
      character: 'Liir (Heir)',
      binding: 'Blood',
      summary: 'Knows Ostrega claim is false',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Yackle has advantage on attacks vs him; his damage -1d6'
    },
    nature: {
      id: 'nature',
      character: 'Frederick (Animal)',
      binding: 'Nature',
      summary: 'Is a Fox Animal passing as human',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Yackle can Dominate Person (no concentration)'
    },
    service: {
      id: 'service',
      character: 'Mareth (Debt-Holder)',
      binding: 'Service',
      summary: 'Murdered person she owed life-debt to',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Necrotic damage bypasses resistance/immunity'
    },
    sacrifice: {
      id: 'sacrifice',
      character: 'Shell (Former Maunt)',
      binding: 'Sacrifice',
      summary: 'Stole sacred relic to save own life',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Yackle forces reroll on saves (use lower)'
    },
    deed: {
      id: 'deed',
      character: 'Nessa (Widow)',
      binding: 'Deed',
      summary: 'Killed husband, framed another',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Disadvantage on Wis saves; Yackle has advantage on Insight vs her'
    },
    hunger: {
      id: 'hunger',
      character: 'Trism (Veteran)',
      binding: 'Hunger',
      summary: 'Killed prisoners for rations during siege',
      revealed: false,
      yacklePresent: false,
      combatEffect: 'Yackle heals for half damage dealt to him'
    }
  },

  // The Seven Seals (Updated with Physical Props & Failure Mechanics)
  seals: {
    memory: {
      id: 'memory',
      name: 'SEAL 1: MEMORY',
      binding: 'The past is real',
      location: 'Music Room',
      prop: '4 Music Boxes (brass ornate, simple wood, painted flowers, black lacquer)',
      puzzle: 'Select the music box that plays the original melody matching the sheet music',
      solution: 'Simple Wood box (plainest, original, unpolished)',
      targetCharacter: 'Averic (Scholar)',
      trap: 'Brass box sounds better but is a revision - Averic will want to choose the "improved" version',
      status: 'incomplete', // incomplete, inprogress, complete
      attempts: 0,
      recipient: null,
      reward: 'Reroll Token (reroll one failed d20, once)',
      failure: 'DC 13 Dex save or 2d6 bludgeoning + disadvantage on next check',
      after3Failures: 'Piano locks 10 min, plays melody backward as hint'
    },
    blood: {
      id: 'blood',
      name: 'SEAL 2: BLOOD',
      binding: 'Lineage is fixed',
      location: 'Portrait Gallery',
      prop: '8 Textile Swatches (dots, fish scales, stars, scrawled text, diamonds, flowers dense, waves, flowers sparse)',
      puzzle: 'Match textile swatches to 8 family portraits based on visual clues',
      solution: '7 correct matches + leave 8th bracket EMPTY (fraudulent branch)',
      targetCharacter: 'Liir (Heir)',
      trap: 'The Healer portrait (8th) has scratched-out name - Liir\'s false great-grandmother. Must leave empty or validate the lie.',
      status: 'incomplete',
      attempts: 0,
      recipient: null,
      reward: "Death's Denial (first time at 0 HP, stabilize automatically)",
      failure: 'DC 13 Wis save or 1d8 psychic + death vision of that ancestor',
      after3Failures: 'Portraits whisper accusations, disadvantage on Wis checks in room until short rest'
    },
    nature: {
      id: 'nature',
      name: 'SEAL 3: NATURE',
      binding: 'Beings are their kind',
      location: 'Library',
      prop: '4 Animal Books with Sigil Pieces (Badger Memoirs, Wren Poetry, Foxwood Debates, Kinderly Letters)',
      puzzle: 'Find 4 books written BY Animals (not about animals), collect sigil pieces, trace completed sigil',
      solution: 'Assemble 4 pieces to form Seal of Nature sigil (creature in mirror), trace it',
      targetCharacter: 'Frederick (Animal)',
      trap: 'Frederick recognizes Animal literature immediately - may expose how a "Munchkinlander clerk" knows these books',
      status: 'incomplete',
      attempts: 0,
      recipient: null,
      reward: 'True Sight Token (advantage on one Insight check, once)',
      failure: 'DC 12 Str save or pushed 10ft, prone, 1d6 force damage',
      after3Failures: 'Shelves rearrange, all progress lost, must restart from different locations'
    },
    service: {
      id: 'service',
      name: 'SEAL 4: SERVICE',
      binding: 'Duty creates bonds',
      location: 'Servant Quarters → Study',
      prop: 'Deck of Cards (A♠, 2♥, 3♣, 4♦, 5♥, 6♠, 7♦, 8♣)',
      puzzle: 'Read servant notebook, lay 8 specific cards in daily service order, go to Study when bell stills',
      solution: 'A♠→2♥→3♣→4♦→5♥→6♠→7♦→8♣ (Chapel→Kitchen→Library→Parlor→Dining→Gallery→Bedroom→Study), then say "I\'m here. What do you need?"',
      targetCharacter: 'Shell (Former Maunt)',
      trap: 'Shell recognizes servant routines intimately - reveals her background was more domestic service than contemplative',
      status: 'incomplete',
      attempts: 0,
      recipient: null,
      reward: 'Swift Aid (Help action as bonus action for rest of session)',
      failure: 'DC 13 Con save or deafened 1 minute, cards scatter',
      after3Failures: 'Cards show sequence for 3 seconds, disadvantage on Service checks for 1 hour'
    },
    sacrifice: {
      id: 'sacrifice',
      name: 'SEAL 5: SACRIFICE',
      binding: 'Giving creates value',
      location: 'Observatory',
      prop: 'Telescope with Hidden Matches + REAL CANDLE on gaming table',
      puzzle: 'Find matches hidden inside telescope, light real candle at actual gaming table',
      solution: 'Unscrew telescope (DC 14 Investigation), find matches, physically light real candle on table',
      targetCharacter: 'Sarima (Debt-Holder)',
      trap: 'Sarima will try to trade/use magic - both fail. Must watch someone simply GIVE without dealing.',
      status: 'incomplete',
      attempts: 0,
      recipient: null,
      reward: 'Last Strike (when dropped to 0 HP, make one free attack)',
      failure: 'Magic lighting fails silently (no damage)',
      after3Failures: 'Bowl speaks: "I cannot be bought. Do you understand the difference?"'
    },
    deed: {
      id: 'deed',
      name: 'SEAL 6: DEED',
      binding: 'Actions shape you',
      location: 'Hall of Mirrors',
      prop: 'Masquerade Mask (white porcelain, gold filigree)',
      puzzle: 'Put on mask, walk hall seeing reflections, stand before True Mirror, remove mask, acknowledge deeds, place mask on pedestal',
      solution: 'Wear mask → walk hall → face True Mirror → remove mask → say "That is me. I did that." → place mask down',
      targetCharacter: 'Mareth (Veteran)',
      trap: 'Mareth sees the massacre he didn\'t stop. Must say "That is me. I did that" without excuses.',
      status: 'incomplete',
      attempts: 0,
      recipient: null,
      reward: 'Resolve Token (reroll one failed saving throw, once)',
      failure: 'Mask attaches to face (DC 14 Str to remove), shows worst deed in all reflective surfaces',
      after3Failures: 'All in hall: DC 14 Wis save or frightened of mirrors 1 hour'
    },
    hunger: {
      id: 'hunger',
      name: 'SEAL 7: HUNGER',
      binding: 'Desire drives becoming',
      location: 'Dining Room',
      prop: 'Name Cards with epithets (Scholar Who Forged, Heir Without Blood, Beast in Human Skin, etc.)',
      puzzle: 'All 8 characters must answer "What do you truly want?" - compelled honesty',
      solution: 'Everyone answers truthfully including Viridian - triggers THE REVEAL when she says "I want to end"',
      targetCharacter: 'All / Viridian REVEAL',
      trap: 'Seven must admit they want despite being a construct. Viridian cannot lie and reveals her true face.',
      status: 'incomplete',
      attempts: 0,
      recipient: null,
      reward: 'Second Wind (recover one spent Hit Die)',
      failure: 'Lying: 2d6 psychic, truth spills out anyway. Silence: 1d6 psychic per round',
      after3Failures: 'Cannot be brute-forced - truth or pain until truth emerges. Doors sealed.'
    }
  },

  // Timeline checkpoints
  timeline: {
    hour1: {
      name: 'HOUR 1: ARRIVAL',
      checkpoints: [
        { id: 'h1-1', text: 'Players arrived', checked: false },
        { id: 'h1-2', text: 'Will reading complete', checked: false },
        { id: 'h1-3', text: 'Ground floor exploration', checked: false },
        { id: 'h1-4', text: 'FIRST TWIST: Survival mode revealed', checked: false }
      ]
    },
    hour2: {
      name: 'HOUR 2: ESCALATION',
      checkpoints: [
        { id: 'h2-1', text: 'First combat encounter', checked: false },
        { id: 'h2-2', text: 'Upper floors unlocked', checked: false },
        { id: 'h2-3', text: 'Puzzle box found', checked: false },
        { id: 'h2-4', text: 'Major lore discovery', checked: false }
      ]
    },
    hour3: {
      name: 'HOUR 3: THE UNRAVELING',
      checkpoints: [
        { id: 'h3-1', text: 'Seal 7 (Hunger) attempted', checked: false },
        { id: 'h3-2', text: 'THE REVEAL', checked: false },
        { id: 'h3-3', text: 'Phase 1 battle begins', checked: false }
      ]
    },
    hour4: {
      name: 'HOUR 4: THE RECKONING',
      checkpoints: [
        { id: 'h4-1', text: 'Phase 2: House chase', checked: false },
        { id: 'h4-2', text: 'Phase 3: Heart Chamber', checked: false },
        { id: 'h4-3', text: 'Resolution', checked: false }
      ]
    }
  },

  // Puzzle Box
  puzzleBox: {
    letters: {
      I: { found: false, location: 'Portrait Gallery (carved in frame)' },
      L: { found: false, location: 'Library (journal entry circled)' },
      O: { found: false, location: 'Music Room (sheet music title)' },
      V: { found: false, location: 'Chapel (altar inscription)' },
      E: { found: false, location: 'Greenhouse (dead flowers)' },
      U: { found: false, location: 'Master Bedroom (unfinished letter)' }
    }
  },

  // Handouts
  handouts: [
    { id: 'place-cards', name: 'Place Cards (8 epithets)', given: false, location: 'Foyer' },
    { id: 'gravestone', name: 'Gravestone Rubbing', given: false, location: 'Cemetery' },
    { id: 'journal-1', name: 'Journal Excerpt 1 (Year 347)', given: false, location: 'Library' },
    { id: 'journal-2', name: 'Journal Excerpt 2 (Year 612)', given: false, location: 'Library' },
    { id: 'journal-3', name: 'Journal Excerpt 3 (Year 901)', given: false, location: 'Library' },
    { id: 'family-tree', name: 'Family Tree Fragment', given: false, location: 'Portrait Gallery' },
    { id: 'unfinished-letter', name: 'Unfinished Letter', given: false, location: 'Master Bedroom' },
    { id: 'recipe-card', name: 'Recipe Card (Coded)', given: false, location: 'Kitchen' },
    { id: 'sheet-music', name: 'Sheet Music (Fragments)', given: false, location: 'Music Room' },
    { id: 'eight-windows', name: 'The Eight Windows (Poem)', given: false, location: 'Chapel' },
    { id: 'ozma-gambit', name: 'The Ozma Gambit (Essay)', given: false, location: 'Library' },
    { id: 'heir-journal', name: 'Previous Heir Journal', given: false, location: 'Wine Cellar' }
  ],

  // Discovery Abilities
  discoveries: [
    { id: 'flash', name: 'Flash of Genius', earned: false, uses: 3, usesRemaining: 3, source: 'Solve puzzle box' },
    { id: 'guidance', name: 'Guidance of the House', earned: false, uses: 999, usesRemaining: 999, source: 'Help ghost child (Holly)' },
    { id: 'inspiration', name: 'Inspiration of the Fallen', earned: false, uses: 3, usesRemaining: 3, source: 'Read names in Memorial Room' },
    { id: 'tell', name: "Yackle's Tell", earned: false, uses: 999, usesRemaining: 999, source: 'Notice Viridian unaffected (Insight DC 16)' },
    { id: 'lurline', name: "Lurline's Word", earned: false, uses: 1, usesRemaining: 1, source: 'Inside puzzle box' },
    { id: 'unmaking', name: 'Unmaking Phrase', earned: false, uses: 1, usesRemaining: 1, source: 'Piece together Eight Bindings lore' }
  ],

  // Quick NPC Reference
  npcs: {
    'mr-trism': {
      name: 'Mr. Trism',
      status: 'active', // active, revealed-dead, collapsed
      ac: 10,
      hp: 1,
      maxHp: 1,
      tells: [
        'Never eats or drinks',
        'Unusually cold to touch (Investigation DC 14)',
        'Eyes don\'t blink properly',
        'No breath visible in cold air',
        'Slight rigor mortis (Medicine DC 12)'
      ]
    },
    'holly': {
      name: 'Holly (Ghost Child)',
      status: 'neutral', // neutral, befriended, hostile
      ac: 11,
      hp: 16,
      maxHp: 16,
      location: 'Nursery',
      canGrant: 'Guidance of the House (if befriended)'
    }
  }
};
