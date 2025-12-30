/**
 * Maguire Oz TTRPG Wiki - GM Tools Module
 * Slide-out panel with dice roller, initiative tracker, notes, and conditions reference
 */

const GMTools = (function() {
  'use strict';

  // DOM Elements
  let panel = null;
  let toggleBtn = null;
  let tabButtons = null;
  let tabPanes = null;

  // State
  let isPanelOpen = false;
  let isPinned = false;
  let activeTab = 'dice';
  let panelWidth = 350;

  /**
   * Initialize GM Tools
   */
  function init() {
    createPanel();
    loadState();
    setupEventListeners();
    initDiceRoller();
    initInitiativeTracker();
    initQuickNotes();
    initSessionNotes();
    initConditionsReference();

    console.log('GM Tools initialized');
  }

  /**
   * Create the GM Tools panel HTML
   */
  function createPanel() {
    // Create toggle button (always visible on right edge)
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'gm-tools-toggle';
    toggleBtn.className = 'gm-tools-toggle';
    toggleBtn.innerHTML = '🎲';
    toggleBtn.setAttribute('aria-label', 'Toggle GM Tools');
    toggleBtn.title = 'GM Tools (Alt+G)';
    document.body.appendChild(toggleBtn);

    // Create panel
    panel = document.createElement('div');
    panel.id = 'gm-tools-panel';
    panel.className = 'gm-tools-panel';
    panel.innerHTML = `
      <div class="gm-tools-header">
        <h3>GM Tools</h3>
        <div class="gm-tools-controls">
          <button class="gm-btn gm-btn-icon" id="gm-pin-btn" title="Pin panel open">
            <span class="pin-icon">📌</span>
          </button>
          <button class="gm-btn gm-btn-icon" id="gm-close-btn" title="Close">
            ✕
          </button>
        </div>
      </div>

      <div class="gm-tools-tabs">
        <button class="gm-tab active" data-tab="dice">🎲 Dice</button>
        <button class="gm-tab" data-tab="initiative">⚔️ Initiative</button>
        <button class="gm-tab" data-tab="notes">📝 Notes</button>
        <button class="gm-tab" data-tab="session">📖 Session</button>
        <button class="gm-tab" data-tab="conditions">💫 Conditions</button>
      </div>

      <div class="gm-tools-content">
        <!-- Dice Roller Tab -->
        <div class="gm-tab-pane active" id="gm-tab-dice">
          <div class="dice-quick-rolls">
            <button class="dice-btn" data-dice="d4">d4</button>
            <button class="dice-btn" data-dice="d6">d6</button>
            <button class="dice-btn" data-dice="d8">d8</button>
            <button class="dice-btn" data-dice="d10">d10</button>
            <button class="dice-btn" data-dice="d12">d12</button>
            <button class="dice-btn" data-dice="d20">d20</button>
            <button class="dice-btn" data-dice="d100">d100</button>
          </div>

          <div class="dice-d20-special">
            <button class="dice-btn dice-btn-advantage" id="roll-advantage">
              d20 Advantage
            </button>
            <button class="dice-btn dice-btn-disadvantage" id="roll-disadvantage">
              d20 Disadvantage
            </button>
          </div>

          <div class="dice-custom">
            <input
              type="text"
              id="custom-roll-input"
              class="dice-input"
              placeholder="e.g., 2d6+5, 4d6dl1"
              autocomplete="off"
            />
            <button class="dice-btn dice-btn-primary" id="roll-custom">Roll</button>
          </div>

          <div class="dice-history" id="dice-history">
            <div class="dice-history-header">
              <span>Roll History</span>
              <button class="gm-btn-text" id="clear-dice-history">Clear</button>
            </div>
            <div class="dice-history-list" id="dice-history-list">
              <div class="dice-history-empty">No rolls yet</div>
            </div>
          </div>
        </div>

        <!-- Initiative Tracker Tab -->
        <div class="gm-tab-pane" id="gm-tab-initiative">
          <div class="initiative-controls">
            <input
              type="text"
              id="combatant-name"
              class="initiative-input"
              placeholder="Combatant name"
              autocomplete="off"
            />
            <div class="initiative-input-group">
              <input
                type="number"
                id="combatant-init"
                class="initiative-input initiative-input-number"
                placeholder="Init"
                min="0"
                max="99"
              />
              <button class="gm-btn" id="roll-init-btn" title="Roll d20">🎲</button>
            </div>
            <button class="gm-btn gm-btn-primary" id="add-combatant">Add</button>
          </div>

          <div class="initiative-turn-controls">
            <button class="gm-btn" id="prev-turn">← Prev</button>
            <button class="gm-btn gm-btn-primary" id="next-turn">Next Turn →</button>
            <button class="gm-btn" id="clear-initiative">Clear All</button>
          </div>

          <div class="initiative-list" id="initiative-list">
            <div class="initiative-empty">No combatants yet</div>
          </div>
        </div>

        <!-- Quick Notes Tab -->
        <div class="gm-tab-pane" id="gm-tab-notes">
          <div class="notes-controls">
            <button class="gm-btn" id="copy-notes">📋 Copy</button>
            <button class="gm-btn" id="clear-notes">Clear</button>
          </div>
          <textarea
            id="quick-notes"
            class="notes-textarea"
            placeholder="Quick notes for your session... Auto-saves as you type."
          ></textarea>
        </div>

        <!-- Session Notes Tab -->
        <div class="gm-tab-pane" id="gm-tab-session">
          <div class="session-controls">
            <input
              type="text"
              id="session-title"
              class="session-input"
              placeholder="Session title"
              autocomplete="off"
            />
            <button class="gm-btn gm-btn-primary" id="save-session">Save Session</button>
          </div>
          <textarea
            id="session-notes"
            class="notes-textarea session-notes-textarea"
            placeholder="Session notes..."
          ></textarea>
          <div class="session-list-header">
            <h4>Past Sessions</h4>
          </div>
          <div class="session-list" id="session-list">
            <div class="session-empty">No saved sessions</div>
          </div>
        </div>

        <!-- Conditions Reference Tab -->
        <div class="gm-tab-pane" id="gm-tab-conditions">
          <input
            type="text"
            id="condition-search"
            class="condition-search"
            placeholder="Search conditions..."
            autocomplete="off"
          />
          <div class="conditions-list" id="conditions-list"></div>
        </div>
      </div>

      <div class="gm-tools-resize-handle" id="gm-resize-handle"></div>
    `;

    document.body.appendChild(panel);

    // Cache DOM references
    tabButtons = panel.querySelectorAll('.gm-tab');
    tabPanes = panel.querySelectorAll('.gm-tab-pane');
  }

  /**
   * Load saved state
   */
  function loadState() {
    const state = Storage.gmTools.loadState();
    isPanelOpen = state.isOpen;
    isPinned = state.isPinned;
    panelWidth = state.width || 350;
    activeTab = state.activeTab || 'dice';

    // Apply state
    panel.style.width = panelWidth + 'px';

    if (isPanelOpen) {
      openPanel();
    }

    if (isPinned) {
      pinPanel();
    }

    // Set active tab
    switchTab(activeTab);
  }

  /**
   * Save current state
   */
  function saveState() {
    Storage.gmTools.saveState({
      isOpen: isPanelOpen,
      isPinned: isPinned,
      width: panelWidth,
      activeTab: activeTab
    });
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Toggle button
    toggleBtn.addEventListener('click', togglePanel);

    // Pin button
    const pinBtn = document.getElementById('gm-pin-btn');
    pinBtn.addEventListener('click', togglePin);

    // Close button
    const closeBtn = document.getElementById('gm-close-btn');
    closeBtn.addEventListener('click', closePanel);

    // Tab buttons
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Resize handle
    const resizeHandle = document.getElementById('gm-resize-handle');
    resizeHandle.addEventListener('mousedown', startResize);

    // Keyboard shortcut Alt+G
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        togglePanel();
      }
    });

    // Click outside to close (if not pinned)
    document.addEventListener('click', (e) => {
      if (!isPinned && isPanelOpen &&
          !panel.contains(e.target) &&
          !toggleBtn.contains(e.target)) {
        closePanel();
      }
    });
  }

  /**
   * Toggle panel open/close
   */
  function togglePanel() {
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  /**
   * Open panel
   */
  function openPanel() {
    isPanelOpen = true;
    panel.classList.add('open');
    toggleBtn.classList.add('active');
    saveState();
  }

  /**
   * Close panel
   */
  function closePanel() {
    if (isPinned) return;
    isPanelOpen = false;
    panel.classList.remove('open');
    toggleBtn.classList.remove('active');
    saveState();
  }

  /**
   * Toggle pin
   */
  function togglePin() {
    if (isPinned) {
      unpinPanel();
    } else {
      pinPanel();
    }
  }

  /**
   * Pin panel open
   */
  function pinPanel() {
    isPinned = true;
    panel.classList.add('pinned');
    document.getElementById('gm-pin-btn').classList.add('active');
    document.body.classList.add('gm-panel-pinned');
    saveState();
  }

  /**
   * Unpin panel
   */
  function unpinPanel() {
    isPinned = false;
    panel.classList.remove('pinned');
    document.getElementById('gm-pin-btn').classList.remove('active');
    document.body.classList.remove('gm-panel-pinned');
    saveState();
  }

  /**
   * Switch to a different tab
   */
  function switchTab(tabName) {
    activeTab = tabName;

    // Update tab buttons
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab panes
    tabPanes.forEach(pane => {
      const paneId = 'gm-tab-' + tabName;
      pane.classList.toggle('active', pane.id === paneId);
    });

    saveState();
  }

  /**
   * Start resizing panel
   */
  function startResize(e) {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = panelWidth;

    function resize(e) {
      const diff = startX - e.clientX;
      const newWidth = Math.max(300, Math.min(600, startWidth + diff));
      panelWidth = newWidth;
      panel.style.width = newWidth + 'px';
    }

    function stopResize() {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      saveState();
    }

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  }

  // ===================================
  // DICE ROLLER
  // ===================================

  let diceHistory = [];

  function initDiceRoller() {
    // Load history
    diceHistory = Storage.gmTools.loadDiceHistory();
    renderDiceHistory();

    // Quick roll buttons
    document.querySelectorAll('.dice-btn[data-dice]').forEach(btn => {
      btn.addEventListener('click', () => rollDice(btn.dataset.dice));
    });

    // Advantage/Disadvantage
    document.getElementById('roll-advantage').addEventListener('click', () => {
      rollAdvantage(true);
    });

    document.getElementById('roll-disadvantage').addEventListener('click', () => {
      rollAdvantage(false);
    });

    // Custom roll
    document.getElementById('roll-custom').addEventListener('click', rollCustomDice);
    document.getElementById('custom-roll-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') rollCustomDice();
    });

    // Clear history
    document.getElementById('clear-dice-history').addEventListener('click', clearDiceHistory);
  }

  function rollDice(diceType) {
    const sides = parseInt(diceType.substring(1));
    const result = Math.floor(Math.random() * sides) + 1;

    addDiceRoll({
      expression: diceType,
      results: [result],
      total: result,
      timestamp: new Date().toISOString()
    });
  }

  function rollAdvantage(isAdvantage) {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const result = isAdvantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);

    addDiceRoll({
      expression: isAdvantage ? 'd20 Advantage' : 'd20 Disadvantage',
      results: [roll1, roll2],
      total: result,
      timestamp: new Date().toISOString()
    });
  }

  function rollCustomDice() {
    const input = document.getElementById('custom-roll-input');
    const expression = input.value.trim();

    if (!expression) return;

    try {
      const result = parseDiceExpression(expression);
      addDiceRoll({
        expression: expression,
        results: result.rolls,
        total: result.total,
        timestamp: new Date().toISOString()
      });
      input.value = '';
    } catch (error) {
      alert('Invalid dice expression: ' + error.message);
    }
  }

  function parseDiceExpression(expr) {
    // Simple parser for expressions like "2d6+5", "4d6dl1", "3d8-2"
    expr = expr.toLowerCase().replace(/\s/g, '');

    let rolls = [];
    let total = 0;

    // Handle basic XdY+Z format
    const match = expr.match(/^(\d+)?d(\d+)([+-]\d+)?$/);
    if (match) {
      const count = parseInt(match[1] || '1');
      const sides = parseInt(match[2]);
      const modifier = parseInt(match[3] || '0');

      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      total += modifier;
      return { rolls, total };
    }

    // Handle drop lowest (4d6dl1)
    const dlMatch = expr.match(/^(\d+)d(\d+)dl(\d+)$/);
    if (dlMatch) {
      const count = parseInt(dlMatch[1]);
      const sides = parseInt(dlMatch[2]);
      const dropCount = parseInt(dlMatch[3]);

      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }

      rolls.sort((a, b) => a - b);
      const kept = rolls.slice(dropCount);
      total = kept.reduce((sum, r) => sum + r, 0);
      return { rolls, total };
    }

    throw new Error('Unsupported format. Try: 2d6+5, 4d6dl1, etc.');
  }

  function addDiceRoll(roll) {
    diceHistory.unshift(roll);
    if (diceHistory.length > 20) {
      diceHistory = diceHistory.slice(0, 20);
    }
    Storage.gmTools.saveDiceHistory(diceHistory);
    renderDiceHistory();
  }

  function renderDiceHistory() {
    const list = document.getElementById('dice-history-list');

    if (diceHistory.length === 0) {
      list.innerHTML = '<div class="dice-history-empty">No rolls yet</div>';
      return;
    }

    list.innerHTML = diceHistory.map(roll => `
      <div class="dice-history-item">
        <div class="dice-history-expression">${escapeHtml(roll.expression)}</div>
        <div class="dice-history-results">
          ${roll.results.map(r => `<span class="dice-result">${r}</span>`).join(' ')}
        </div>
        <div class="dice-history-total">= ${roll.total}</div>
      </div>
    `).join('');
  }

  function clearDiceHistory() {
    if (confirm('Clear all dice roll history?')) {
      diceHistory = [];
      Storage.gmTools.saveDiceHistory([]);
      renderDiceHistory();
    }
  }

  // ===================================
  // INITIATIVE TRACKER
  // ===================================

  let combatants = [];
  let currentTurn = -1;

  function initInitiativeTracker() {
    combatants = Storage.gmTools.loadInitiative();
    renderInitiativeList();

    // Add combatant
    document.getElementById('add-combatant').addEventListener('click', addCombatant);
    document.getElementById('combatant-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addCombatant();
    });

    // Roll initiative
    document.getElementById('roll-init-btn').addEventListener('click', () => {
      const roll = Math.floor(Math.random() * 20) + 1;
      document.getElementById('combatant-init').value = roll;
    });

    // Turn controls
    document.getElementById('next-turn').addEventListener('click', nextTurn);
    document.getElementById('prev-turn').addEventListener('click', prevTurn);
    document.getElementById('clear-initiative').addEventListener('click', clearInitiative);
  }

  function addCombatant() {
    const nameInput = document.getElementById('combatant-name');
    const initInput = document.getElementById('combatant-init');

    const name = nameInput.value.trim();
    const initiative = parseInt(initInput.value) || 0;

    if (!name) return;

    combatants.push({
      id: Date.now(),
      name: name,
      initiative: initiative,
      hp: null,
      maxHp: null,
      conditions: []
    });

    combatants.sort((a, b) => b.initiative - a.initiative);

    nameInput.value = '';
    initInput.value = '';

    saveInitiative();
    renderInitiativeList();
  }

  function removeCombatant(id) {
    combatants = combatants.filter(c => c.id !== id);
    if (currentTurn >= combatants.length) {
      currentTurn = combatants.length - 1;
    }
    saveInitiative();
    renderInitiativeList();
  }

  function updateCombatantHP(id, change) {
    const combatant = combatants.find(c => c.id === id);
    if (!combatant) return;

    if (combatant.hp === null) {
      const hp = prompt('Current HP:');
      if (hp === null) return;
      combatant.hp = parseInt(hp) || 0;
      combatant.maxHp = combatant.hp;
    }

    combatant.hp = Math.max(0, Math.min(combatant.maxHp, combatant.hp + change));
    saveInitiative();
    renderInitiativeList();
  }

  function nextTurn() {
    if (combatants.length === 0) return;
    currentTurn = (currentTurn + 1) % combatants.length;
    renderInitiativeList();
  }

  function prevTurn() {
    if (combatants.length === 0) return;
    currentTurn = currentTurn <= 0 ? combatants.length - 1 : currentTurn - 1;
    renderInitiativeList();
  }

  function clearInitiative() {
    if (confirm('Clear all combatants?')) {
      combatants = [];
      currentTurn = -1;
      saveInitiative();
      renderInitiativeList();
    }
  }

  function saveInitiative() {
    Storage.gmTools.saveInitiative(combatants);
  }

  function renderInitiativeList() {
    const list = document.getElementById('initiative-list');

    if (combatants.length === 0) {
      list.innerHTML = '<div class="initiative-empty">No combatants yet</div>';
      return;
    }

    list.innerHTML = combatants.map((c, index) => `
      <div class="initiative-item ${index === currentTurn ? 'current-turn' : ''}">
        <div class="initiative-item-header">
          <div class="initiative-init">${c.initiative}</div>
          <div class="initiative-name">${escapeHtml(c.name)}</div>
          <button class="gm-btn-icon" onclick="GMTools.removeCombatant(${c.id})">✕</button>
        </div>
        ${c.hp !== null ? `
          <div class="initiative-hp">
            <button class="hp-btn" onclick="GMTools.updateHP(${c.id}, -1)">−</button>
            <div class="hp-display">${c.hp} / ${c.maxHp} HP</div>
            <button class="hp-btn" onclick="GMTools.updateHP(${c.id}, 1)">+</button>
          </div>
        ` : `
          <button class="gm-btn-text" onclick="GMTools.setHP(${c.id})">Add HP</button>
        `}
      </div>
    `).join('');
  }

  function setHP(id) {
    const combatant = combatants.find(c => c.id === id);
    if (!combatant) return;

    const hp = prompt('Current HP:');
    if (hp === null) return;

    combatant.hp = parseInt(hp) || 0;
    combatant.maxHp = combatant.hp;
    saveInitiative();
    renderInitiativeList();
  }

  // ===================================
  // QUICK NOTES
  // ===================================

  function initQuickNotes() {
    const textarea = document.getElementById('quick-notes');

    // Load saved notes
    textarea.value = Storage.gmTools.loadNotes();

    // Auto-save on input (debounced)
    let saveTimeout;
    textarea.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        Storage.gmTools.saveNotes(textarea.value);
      }, 500);
    });

    // Copy to clipboard
    document.getElementById('copy-notes').addEventListener('click', () => {
      textarea.select();
      document.execCommand('copy');
      if (typeof App !== 'undefined') {
        App.showNotification('Notes copied to clipboard', 'success');
      }
    });

    // Clear notes
    document.getElementById('clear-notes').addEventListener('click', () => {
      if (confirm('Clear all quick notes?')) {
        textarea.value = '';
        Storage.gmTools.saveNotes('');
      }
    });
  }

  // ===================================
  // SESSION NOTES
  // ===================================

  let sessions = [];

  function initSessionNotes() {
    sessions = Storage.gmTools.loadSessions();
    renderSessionList();

    // Save session
    document.getElementById('save-session').addEventListener('click', saveSession);
  }

  function saveSession() {
    const titleInput = document.getElementById('session-title');
    const notesTextarea = document.getElementById('session-notes');

    const title = titleInput.value.trim() || 'Untitled Session';
    const notes = notesTextarea.value.trim();

    if (!notes) {
      alert('Please add some notes before saving.');
      return;
    }

    sessions.unshift({
      id: Date.now(),
      title: title,
      date: new Date().toISOString(),
      notes: notes
    });

    Storage.gmTools.saveSessions(sessions);

    titleInput.value = '';
    notesTextarea.value = '';

    renderSessionList();

    if (typeof App !== 'undefined') {
      App.showNotification('Session saved', 'success');
    }
  }

  function loadSession(id) {
    const session = sessions.find(s => s.id === id);
    if (!session) return;

    document.getElementById('session-title').value = session.title;
    document.getElementById('session-notes').value = session.notes;
  }

  function deleteSession(id) {
    if (!confirm('Delete this session?')) return;

    sessions = sessions.filter(s => s.id !== id);
    Storage.gmTools.saveSessions(sessions);
    renderSessionList();
  }

  function renderSessionList() {
    const list = document.getElementById('session-list');

    if (sessions.length === 0) {
      list.innerHTML = '<div class="session-empty">No saved sessions</div>';
      return;
    }

    list.innerHTML = sessions.map(s => {
      const date = new Date(s.date).toLocaleDateString();
      return `
        <div class="session-item">
          <div class="session-item-header">
            <div class="session-title">${escapeHtml(s.title)}</div>
            <button class="gm-btn-icon" onclick="GMTools.deleteSession(${s.id})">✕</button>
          </div>
          <div class="session-date">${date}</div>
          <div class="session-preview">${escapeHtml(s.notes.substring(0, 100))}${s.notes.length > 100 ? '...' : ''}</div>
          <button class="gm-btn-text" onclick="GMTools.loadSession(${s.id})">Load</button>
        </div>
      `;
    }).join('');
  }

  // ===================================
  // CONDITIONS REFERENCE
  // ===================================

  const CONDITIONS = [
    // Standard 5e conditions
    { name: 'Blinded', description: 'A blinded creature can\'t see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage.' },
    { name: 'Charmed', description: 'A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature.' },
    { name: 'Deafened', description: 'A deafened creature can\'t hear and automatically fails any ability check that requires hearing.' },
    { name: 'Frightened', description: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can\'t willingly move closer to the source of its fear.' },
    { name: 'Grappled', description: 'A grappled creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed. The condition ends if the grappler is incapacitated or if an effect removes the grappled creature from the reach of the grappler.' },
    { name: 'Incapacitated', description: 'An incapacitated creature can\'t take actions or reactions.' },
    { name: 'Invisible', description: 'An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature\'s location can be detected by any noise it makes or any tracks it leaves. Attack rolls against the creature have disadvantage, and the creature\'s attack rolls have advantage.' },
    { name: 'Paralyzed', description: 'A paralyzed creature is incapacitated and can\'t move or speak. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.' },
    { name: 'Petrified', description: 'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging. The creature is incapacitated, can\'t move or speak, and is unaware of its surroundings. Attack rolls against the creature have advantage. The creature automatically fails Strength and Dexterity saving throws. The creature has resistance to all damage. The creature is immune to poison and disease.' },
    { name: 'Poisoned', description: 'A poisoned creature has disadvantage on attack rolls and ability checks.' },
    { name: 'Prone', description: 'A prone creature\'s only movement option is to crawl, unless it stands up and thereby ends the condition. The creature has disadvantage on attack rolls. An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.' },
    { name: 'Restrained', description: 'A restrained creature\'s speed becomes 0, and it can\'t benefit from any bonus to its speed. Attack rolls against the creature have advantage, and the creature\'s attack rolls have disadvantage. The creature has disadvantage on Dexterity saving throws.' },
    { name: 'Stunned', description: 'A stunned creature is incapacitated, can\'t move, and can speak only falteringly. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.' },
    { name: 'Unconscious', description: 'An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings. The creature drops whatever it\'s holding and falls prone. The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.' },

    // Oz-specific conditions
    { name: 'Witch-Touched', description: 'A character marked by contact with powerful magic. They have advantage on Intelligence (Arcana) checks related to magic, but may suffer strange side effects or draw unwanted attention.' },
    { name: 'Time-Slipped', description: 'The character exists slightly out of sync with time. Once per short rest, they can reroll an initiative check. However, they have disadvantage on concentration saves.' },
    { name: 'Green-Blind', description: 'The character cannot perceive anything related to greenness or green magic. They automatically fail Wisdom (Perception) checks to notice the Green Effect and cannot benefit from green magic.' },
    { name: 'Name-Lost', description: 'The character has forgotten their true name or had it stolen. They have disadvantage on Charisma checks and cannot benefit from effects that target them by name.' },
    { name: 'Silenced', description: 'The character has been magically silenced and cannot speak or make vocal sounds. They cannot cast spells with verbal components or communicate verbally.' },
    { name: 'Grimmerie-Corrupted', description: 'Exposure to the Grimmerie has corrupted the character. They gain advantage on spell attack rolls but take 1d4 psychic damage at the start of each of their turns.' },
    { name: 'Puppet-State', description: 'The character is being magically controlled. They are charmed by the controller and must obey verbal commands to the best of their ability.' },
    { name: 'Scraped', description: 'The character\'s memories, personality, or soul have been partially scraped away. They have disadvantage on all Intelligence, Wisdom, and Charisma checks and saving throws.' },
    { name: 'Dragon-Burned', description: 'Burned by dragon fire. The character takes 1d6 fire damage at the start of each turn until they receive magical healing or spend an action to extinguish the flames.' },
    { name: 'Hive-Linked', description: 'The character is connected to a bee collective consciousness. They can communicate telepathically with other hive-linked creatures within 100 feet but have disadvantage on saves against mind-affecting effects.' }
  ];

  function initConditionsReference() {
    const searchInput = document.getElementById('condition-search');
    const list = document.getElementById('conditions-list');

    renderConditions('');

    searchInput.addEventListener('input', (e) => {
      renderConditions(e.target.value.toLowerCase());
    });
  }

  function renderConditions(search) {
    const list = document.getElementById('conditions-list');

    const filtered = CONDITIONS.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
      list.innerHTML = '<div class="condition-empty">No conditions found</div>';
      return;
    }

    list.innerHTML = filtered.map((c, index) => `
      <div class="condition-item">
        <div class="condition-name" onclick="GMTools.toggleCondition(${index}, '${search}')">${c.name}</div>
        <div class="condition-description">${c.description}</div>
      </div>
    `).join('');
  }

  function toggleCondition(index, search) {
    const items = document.querySelectorAll('.condition-item');
    if (items[index]) {
      items[index].classList.toggle('expanded');
    }
  }

  /**
   * Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public API
  return {
    init,
    removeCombatant,
    updateHP: updateCombatantHP,
    setHP,
    deleteSession,
    loadSession,
    toggleCondition
  };
})();

// Make available globally
window.GMTools = GMTools;
