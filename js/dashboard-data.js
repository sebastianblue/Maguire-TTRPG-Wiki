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
      connections: ['foyer']
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
      connections: ['foyer', 'parlor']
    },
    'chapel': {
      id: 'chapel',
      name: 'The Chapel',
      floor: 'ground',
      position: { x: 80, y: 70 },
      explored: false,
      partyHere: false,
      hasSeal: true,
      sealId: 'sacrifice',
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
      hasSeal: true,
      sealId: 'service',
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
      hasSeal: false,
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
      hasSeal: true,
      sealId: 'witness',
      hasSecret: false,
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

  // The Seven Seals
  seals: {
    memory: {
      id: 'memory',
      name: 'SEAL 1: MEMORY',
      location: 'Music Room',
      puzzle: 'Reconstruct & play melody from fragments',
      status: 'incomplete', // incomplete, inprogress, complete
      recipient: null,
      reward: 'Reroll Token (force Yackle to reroll)',
      mastery: 'Force Yackle to reroll 1 attack/check per round'
    },
    blood: {
      id: 'blood',
      name: 'SEAL 2: BLOOD',
      location: 'Portrait Gallery',
      puzzle: 'Complete family tree using portraits',
      status: 'incomplete',
      recipient: null,
      reward: "Death's Denial (auto-stabilize at 0 HP once)",
      mastery: "Yackle's necrotic damage halved"
    },
    nature: {
      id: 'nature',
      name: 'SEAL 3: NATURE',
      location: 'Library',
      puzzle: 'Identify Animals vs animals in books',
      status: 'incomplete',
      recipient: null,
      reward: 'True Sight Token (see invisible/shapechangers)',
      mastery: 'Yackle cannot teleport or turn invisible'
    },
    service: {
      id: 'service',
      name: 'SEAL 4: SERVICE',
      location: 'Servant Quarters → Memorial',
      puzzle: 'Answer bell, light memorial candle',
      status: 'incomplete',
      recipient: null,
      reward: 'Swift Aid (Dash as bonus action 3x)',
      mastery: 'Party gains +2 to initiative'
    },
    sacrifice: {
      id: 'sacrifice',
      name: 'SEAL 5: SACRIFICE',
      location: 'Chapel',
      puzzle: 'Offer something precious, ritual prayer',
      status: 'incomplete',
      recipient: null,
      reward: "Martyr's Shield (transfer damage to self)",
      mastery: 'Party gains resistance to necrotic damage'
    },
    deed: {
      id: 'deed',
      name: 'SEAL 6: DEED',
      location: 'Hall of Mirrors',
      puzzle: 'Confront true reflection, accept past',
      status: 'incomplete',
      recipient: null,
      reward: 'Clear Conscience (advantage on Wis saves)',
      mastery: "Yackle's illusions/charms have disadvantage"
    },
    hunger: {
      id: 'hunger',
      name: 'SEAL 7: HUNGER',
      location: 'Dining Room',
      puzzle: 'Resist phantom feast, break plates',
      status: 'incomplete',
      recipient: null,
      reward: 'Satiation (no exhaustion for 24 hours)',
      mastery: 'Yackle cannot regain HP or legendary actions'
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
