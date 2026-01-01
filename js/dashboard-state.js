// State Management for GM Dashboard
const DashboardState = (function() {
  'use strict';

  const STORAGE_KEY = 'witchs-wake-dashboard-state';
  const NOTES_KEY = 'witchs-wake-session-notes';

  let state = null;

  // Initialize state from localStorage or defaults
  function init() {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (savedState) {
      try {
        state = JSON.parse(savedState);
        console.log('State loaded from localStorage');
      } catch (e) {
        console.error('Failed to parse saved state, using defaults');
        state = getDefaultState();
      }
    } else {
      state = getDefaultState();
    }

    return state;
  }

  // Get default state from DashboardData
  function getDefaultState() {
    return {
      rooms: JSON.parse(JSON.stringify(DashboardData.rooms)),
      secrets: JSON.parse(JSON.stringify(DashboardData.secrets)),
      seals: JSON.parse(JSON.stringify(DashboardData.seals)),
      timeline: JSON.parse(JSON.stringify(DashboardData.timeline)),
      puzzleBox: JSON.parse(JSON.stringify(DashboardData.puzzleBox)),
      handouts: JSON.parse(JSON.stringify(DashboardData.handouts)),
      discoveries: JSON.parse(JSON.stringify(DashboardData.discoveries)),

      currentFloor: 'grounds',
      currentRoom: null,
      currentPhase: 'exploration', // exploration, combat-1, combat-2, combat-3, combat-4

      timer: {
        running: false,
        elapsed: 0,
        startTime: null
      },

      combat: {
        round: 0,
        initiative: [],
        yackle: {
          hp: 200,
          maxHp: 200,
          legendaryActions: 3,
          legendaryActionsUsed: 0,
          legendaryResistances: 3,
          legendaryResistancesUsed: 0,
          lairActionUsed: null
        },
        anchors: [30, 30, 30]
      }
    };
  }

  // Save state to localStorage
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('State saved');
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // Get current state
  function get() {
    return state;
  }

  // Update state
  function update(path, value) {
    const keys = path.split('.');
    let current = state;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    save();
  }

  // Reset state to defaults
  function reset() {
    if (confirm('Reset all trackers to default state? This cannot be undone.')) {
      state = getDefaultState();
      save();
      location.reload();
    }
  }

  // Session notes
  function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, notes);
  }

  function loadNotes() {
    return localStorage.getItem(NOTES_KEY) || '';
  }

  // Export state as JSON
  function exportState() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = 'witchs-wake-state-' + timestamp + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Export notes as text
  function exportNotes() {
    const notes = loadNotes();
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = 'witchs-wake-notes-' + timestamp + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    init,
    get,
    update,
    save,
    reset,
    saveNotes,
    loadNotes,
    exportState,
    exportNotes
  };
})();
