// Trackers Module - Secrets, Seals, Timeline, Puzzle Box, etc.
const DashboardTrackers = (function() {
  'use strict';

  let state = null;

  function init(dashboardState) {
    state = dashboardState;

    renderSecrets();
    renderSeals();
    renderTimeline();
    renderPuzzleBox();
    renderHandouts();
    renderDiscoveries();
    renderNotes();

    setupTimer();
  }

  // === SECRETS TRACKER ===
  function renderSecrets() {
    const container = document.getElementById('secrets-content');
    if (!container) return;

    const secrets = Object.values(state.secrets);
    const collected = secrets.filter(s => s.revealed && s.yacklePresent).length;

    document.getElementById('secrets-count').textContent = `${collected}/7`;

    container.innerHTML = '';

    secrets.forEach(secret => {
      const secretEl = document.createElement('div');
      secretEl.className = 'secret-item';

      if (secret.revealed && secret.yacklePresent) {
        secretEl.classList.add('collected');
      }

      secretEl.innerHTML = `
        <div class="secret-header">
          <span class="secret-name">${secret.binding} — ${secret.character}</span>
        </div>
        <div>${secret.summary}</div>
        <div class="secret-checks">
          <label class="checkbox-label">
            <input type="checkbox" ${secret.revealed ? 'checked' : ''}
                   data-secret="${secret.id}" data-field="revealed">
            Revealed?
          </label>
          <label class="checkbox-label">
            <input type="checkbox" ${secret.yacklePresent ? 'checked' : ''}
                   data-secret="${secret.id}" data-field="yacklePresent">
            Yackle Present?
          </label>
        </div>
        <div class="secret-effect">
          → ${secret.combatEffect}
        </div>
      `;

      container.appendChild(secretEl);
    });

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const secretId = e.target.dataset.secret;
        const field = e.target.dataset.field;
        state.secrets[secretId][field] = e.target.checked;
        DashboardState.save();
        renderSecrets();
        updateCombatSummary();
      });
    });

    // Warning if 7/7
    if (collected >= 7) {
      const warning = document.createElement('div');
      warning.style.cssText = 'background: #d9534f; color: white; padding: 1rem; margin-top: 1rem; border-radius: 4px; font-weight: 600;';
      warning.textContent = '⚠️ WARNING: 7/7 secrets collected! Phase 4 Ascension imminent!';
      container.appendChild(warning);
    }
  }

  function updateCombatSummary() {
    const secrets = Object.values(state.secrets);
    const collected = secrets.filter(s => s.revealed && s.yacklePresent).length;

    // Update Yackle's legendary actions
    state.combat.yackle.legendaryActions = 3 + collected;
    DashboardState.save();
  }

  // === SEALS TRACKER ===
  function renderSeals() {
    const container = document.getElementById('seals-content');
    if (!container) return;

    const seals = Object.values(state.seals);
    const completed = seals.filter(s => s.status === 'complete').length;

    document.getElementById('seals-count').textContent = `${completed}/7`;

    container.innerHTML = '';

    seals.forEach(seal => {
      const sealEl = document.createElement('div');
      sealEl.className = 'seal-item';

      if (seal.status === 'complete') {
        sealEl.classList.add('completed');
      }

      const statusOptions = ['incomplete', 'inprogress', 'complete'];
      const statusSelect = `
        <select data-seal="${seal.id}">
          ${statusOptions.map(opt => `
            <option value="${opt}" ${seal.status === opt ? 'selected' : ''}>
              ${opt === 'inprogress' ? 'In Progress' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          `).join('')}
        </select>
      `;

      sealEl.innerHTML = `
        <div class="seal-header">
          <span class="seal-name">${seal.name}</span>
        </div>
        <div><strong>Location:</strong> ${seal.location}</div>
        <div><strong>Puzzle:</strong> ${seal.puzzle}</div>
        <div class="seal-status">
          <label>Status: ${statusSelect}</label>
        </div>
        <div class="seal-reward">
          <strong>Reward:</strong> ${seal.reward}<br>
          <strong>Mastery:</strong> ${seal.mastery}
        </div>
      `;

      container.appendChild(sealEl);
    });

    // Add event listeners
    container.querySelectorAll('select').forEach(select => {
      select.addEventListener('change', (e) => {
        const sealId = e.target.dataset.seal;
        state.seals[sealId].status = e.target.value;
        DashboardState.save();
        renderSeals();
        DashboardMap.renderMap(); // Update map to remove seal markers
      });
    });

    // All seals complete bonus
    if (completed === 7) {
      const bonus = document.createElement('div');
      bonus.style.cssText = 'background: #5cb85c; color: white; padding: 1rem; margin-top: 1rem; border-radius: 4px; font-weight: 600;';
      bonus.textContent = '✓ ALL SEALS COMPLETE! Yackle starts Phase 1 at HALF HP (100)';
      container.appendChild(bonus);
    }
  }

  // === TIMELINE TRACKER ===
  function renderTimeline() {
    const container = document.getElementById('timeline-content');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(state.timeline).forEach(([hourKey, hour]) => {
      const hourEl = document.createElement('div');
      hourEl.className = 'timeline-item';

      const checkedCount = hour.checkpoints.filter(c => c.checked).length;
      const totalCount = hour.checkpoints.length;
      const progress = (checkedCount / totalCount) * 100;

      hourEl.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.5rem;">${hour.name}</div>
        <div style="background: #ddd; height: 10px; border-radius: 5px; margin-bottom: 0.5rem; overflow: hidden;">
          <div style="background: #5cb85c; height: 100%; width: ${progress}%;"></div>
        </div>
        ${hour.checkpoints.map(cp => `
          <label class="checkbox-label" style="display: block; margin: 0.25rem 0;">
            <input type="checkbox" ${cp.checked ? 'checked' : ''} data-checkpoint="${cp.id}">
            ${cp.text}
          </label>
        `).join('')}
      `;

      container.appendChild(hourEl);
    });

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const checkpointId = e.target.dataset.checkpoint;

        // Find and update checkpoint
        Object.values(state.timeline).forEach(hour => {
          const checkpoint = hour.checkpoints.find(cp => cp.id === checkpointId);
          if (checkpoint) {
            checkpoint.checked = e.target.checked;
          }
        });

        DashboardState.save();
        renderTimeline();
      });
    });
  }

  // === TIMER ===
  function setupTimer() {
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');

    function updateDisplay() {
      const elapsed = state.timer.elapsed;
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      timerDisplay.textContent =
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    let interval = null;

    startBtn.addEventListener('click', () => {
      state.timer.running = true;
      state.timer.startTime = Date.now() - (state.timer.elapsed * 1000);
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      DashboardState.save();

      interval = setInterval(() => {
        state.timer.elapsed = Math.floor((Date.now() - state.timer.startTime) / 1000);
        updateDisplay();
      }, 1000);
    });

    pauseBtn.addEventListener('click', () => {
      state.timer.running = false;
      clearInterval(interval);
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      DashboardState.save();
    });

    resetBtn.addEventListener('click', () => {
      if (confirm('Reset timer to 0:00:00?')) {
        state.timer.running = false;
        state.timer.elapsed = 0;
        state.timer.startTime = null;
        clearInterval(interval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        updateDisplay();
        DashboardState.save();
      }
    });

    updateDisplay();

    // Resume timer if it was running
    if (state.timer.running) {
      startBtn.click();
    }
  }

  // === PUZZLE BOX ===
  function renderPuzzleBox() {
    const container = document.getElementById('puzzle-content');
    if (!container) return;

    const letters = state.puzzleBox.letters;
    const foundCount = Object.values(letters).filter(l => l.found).length;
    const code = Object.keys(letters).map(l => letters[l].found ? l : '_').join(' ');

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">
          ${code}
        </div>
        <div style="color: #666; font-size: 0.9rem;">
          ${foundCount}/6 letters found
        </div>
      </div>
      <div class="puzzle-letters">
        ${Object.entries(letters).map(([letter, data]) => `
          <div class="puzzle-letter ${data.found ? 'found' : ''}" data-letter="${letter}">
            ${letter}
          </div>
        `).join('')}
      </div>
      <div class="puzzle-clues" style="margin-top: 1rem; font-size: 0.85rem;">
        ${Object.entries(letters).map(([letter, data]) => `
          <div class="puzzle-clue">
            <span><strong>${letter}</strong> — ${data.location}</span>
            <span style="color: ${data.found ? '#5cb85c' : '#999'};">
              ${data.found ? '✓ FOUND' : 'NOT FOUND'}
            </span>
          </div>
        `).join('')}
      </div>
    `;

    // Add click handlers
    container.querySelectorAll('.puzzle-letter').forEach(el => {
      el.addEventListener('click', () => {
        const letter = el.dataset.letter;
        letters[letter].found = !letters[letter].found;
        DashboardState.save();
        renderPuzzleBox();
      });
    });

    // Show reward if complete
    if (foundCount === 6) {
      const reward = document.createElement('div');
      reward.style.cssText = 'background: #5cb85c; color: white; padding: 1rem; margin-top: 1rem; border-radius: 4px;';
      reward.innerHTML = `
        <strong>✓ PUZZLE SOLVED!</strong><br>
        Rewards: Map to Heart Chamber, Lurline's Word (4d10 radiant), Flash of Genius
      `;
      container.appendChild(reward);
    }
  }

  // === HANDOUTS ===
  function renderHandouts() {
    const container = document.getElementById('handouts-content');
    if (!container) return;

    const handouts = state.handouts;
    const givenCount = handouts.filter(h => h.given).length;

    document.getElementById('handouts-count').textContent = `${givenCount}/${handouts.length}`;

    container.innerHTML = handouts.map(handout => `
      <div class="handout-item ${handout.given ? 'given' : ''}">
        <label class="checkbox-label">
          <input type="checkbox" ${handout.given ? 'checked' : ''} data-handout="${handout.id}">
          ${handout.name}
        </label>
        <span style="font-size: 0.8rem; color: #666;">${handout.location}</span>
      </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const handoutId = e.target.dataset.handout;
        const handout = handouts.find(h => h.id === handoutId);
        if (handout) {
          handout.given = e.target.checked;
          DashboardState.save();
          renderHandouts();
        }
      });
    });
  }

  // === DISCOVERY ABILITIES ===
  function renderDiscoveries() {
    const container = document.getElementById('discoveries-content');
    if (!container) return;

    const discoveries = state.discoveries;

    container.innerHTML = discoveries.map(disc => {
      const useDots = disc.uses < 100 ?
        Array(disc.uses).fill(0).map((_, i) =>
          `<span class="dot ${i < disc.usesRemaining ? '' : 'used'}"></span>`
        ).join('') :
        `<span>${disc.usesRemaining} uses</span>`;

      return `
        <div class="discovery-item" style="background: #f5f5f5; padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 4px; ${!disc.earned ? 'opacity: 0.5;' : ''}">
          <label class="checkbox-label">
            <input type="checkbox" ${disc.earned ? 'checked' : ''} data-discovery="${disc.id}">
            <strong>${disc.name}</strong>
          </label>
          <div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">
            ${disc.source}
          </div>
          ${disc.earned ? `<div class="resource-dots" style="margin-top: 0.5rem;">${useDots}</div>` : ''}
        </div>
      `;
    }).join('');

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const discId = e.target.dataset.discovery;
        const discovery = discoveries.find(d => d.id === discId);
        if (discovery) {
          discovery.earned = e.target.checked;
          if (e.target.checked) {
            discovery.usesRemaining = discovery.uses;
          }
          DashboardState.save();
          renderDiscoveries();
        }
      });
    });

    // Add use tracking
    container.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const item = e.target.closest('.discovery-item');
        const checkbox = item.querySelector('input[type="checkbox"]');
        const discId = checkbox.dataset.discovery;
        const discovery = discoveries.find(d => d.id === discId);
        if (discovery && discovery.earned) {
          // Toggle dot
          if (e.target.classList.contains('used')) {
            e.target.classList.remove('used');
            discovery.usesRemaining++;
          } else {
            e.target.classList.add('used');
            discovery.usesRemaining--;
          }
          DashboardState.save();
        }
      });
    });
  }

  // === SESSION NOTES ===
  function renderNotes() {
    const textarea = document.getElementById('session-notes');
    const exportBtn = document.getElementById('export-notes');

    if (!textarea) return;

    textarea.value = DashboardState.loadNotes();

    textarea.addEventListener('input', () => {
      DashboardState.saveNotes(textarea.value);
    });

    exportBtn.addEventListener('click', () => {
      DashboardState.exportNotes();
    });
  }

  // === ROOM DETAILS ===
  function renderRoomDetails(room) {
    const container = document.getElementById('room-details-content');
    if (!container) return;

    const markExploredBtn = document.getElementById('mark-explored');
    markExploredBtn.textContent = room.explored ? 'Mark Unexplored' : 'Mark Explored';
    markExploredBtn.onclick = () => {
      room.explored = !room.explored;
      DashboardState.save();
      DashboardMap.renderMap();
      renderRoomDetails(room);
    };

    // Get room description from wiki data
    const roomDescription = RoomDescriptions[room.id] || '';

    container.innerHTML = `
      <div class="room-header">
        <div>
          <div class="room-title">${room.name}</div>
          <div class="room-floor">${room.floor.charAt(0).toUpperCase() + room.floor.slice(1)} Floor</div>
        </div>
      </div>
      ${room.hasSeal ? `
        <div style="background: #f0e6ff; padding: 0.75rem; margin-top: 1rem; border-radius: 4px; border-left: 4px solid #9c27b0;">
          <strong>⭐ Contains ${state.seals[room.sealId]?.name || 'a Seal'}</strong>
        </div>
      ` : ''}
      ${room.hasHandout ? `
        <div style="background: #e3f2fd; padding: 0.75rem; margin-top: 1rem; border-radius: 4px; border-left: 4px solid #2196f3;">
          <strong>📄 Contains Handout(s)</strong>
        </div>
      ` : ''}
      <div style="margin-top: 1rem; max-height: 500px; overflow-y: auto;">
        ${roomDescription ? roomDescription : `
          <p style="color: #666; font-style: italic;">
            No description available for this room.
          </p>
        `}
      </div>
    `;
  }

  return {
    init,
    renderSecrets,
    renderSeals,
    renderTimeline,
    renderPuzzleBox,
    renderHandouts,
    renderDiscoveries,
    renderRoomDetails
  };
})();
