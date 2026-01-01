// Combat Panel Module
const DashboardCombat = (function() {
  'use strict';

  let state = null;

  function init(dashboardState) {
    state = dashboardState;

    setupCombatPanel();
    renderCombatPanel();
  }

  function setupCombatPanel() {
    const header = document.getElementById('combat-header');
    const panel = document.querySelector('.panel-combat');

    header.addEventListener('click', () => {
      panel.classList.toggle('collapsed');
    });
  }

  function renderCombatPanel() {
    const container = document.getElementById('combat-content');
    const phaseIndicator = document.getElementById('phase-indicator');

    if (!container) return;

    // Update phase indicator
    const phaseNames = {
      'exploration': 'Exploration',
      'combat-1': 'Phase 1: Revealed Witch',
      'combat-2': 'Phase 2: House Itself',
      'combat-3': 'Phase 3: Heart Chamber',
      'combat-4': 'Phase 4: Ascendant'
    };
    phaseIndicator.textContent = phaseNames[state.currentPhase] || 'Exploration';

    if (state.currentPhase === 'exploration') {
      container.innerHTML = `
        <p style="text-align: center; padding: 2rem; color: #666;">
          Combat panel will activate when you enter combat phase.
        </p>
        <div style="text-align: center;">
          <button id="start-combat" class="btn-toggle">Start Combat</button>
        </div>
      `;

      document.getElementById('start-combat')?.addEventListener('click', () => {
        state.currentPhase = 'combat-1';
        DashboardState.save();
        renderCombatPanel();
        document.querySelector('.panel-combat').classList.remove('collapsed');
      });

      return;
    }

    // Combat is active
    const yackle = state.combat.yackle;
    const hpPercent = (yackle.hp / yackle.maxHp) * 100;

    container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem;">Yackle</h3>
        <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center;">
          <div>
            <button id="yackle-damage" class="btn-toggle" style="padding: 0.25rem 0.5rem;">-</button>
            <button id="yackle-heal" class="btn-toggle" style="padding: 0.25rem 0.5rem; margin-left: 0.25rem;">+</button>
          </div>
          <div>
            <div class="hp-bar">
              <div class="hp-bar-fill" style="width: ${hpPercent}%;"></div>
            </div>
          </div>
          <div style="font-weight: 600;">
            ${yackle.hp} / ${yackle.maxHp} HP
          </div>
        </div>
      </div>

      <div class="yackle-resources">
        <div class="resource-item">
          <div><strong>Legendary Actions</strong></div>
          <div style="font-size: 0.85rem; color: #666;">
            ${yackle.legendaryActionsUsed}/${yackle.legendaryActions} used
          </div>
          <div class="resource-dots" style="margin-top: 0.5rem;">
            ${Array(yackle.legendaryActions).fill(0).map((_, i) =>
              `<div class="dot ${i < yackle.legendaryActionsUsed ? 'used' : ''}" data-resource="legendary" data-index="${i}"></div>`
            ).join('')}
          </div>
        </div>

        <div class="resource-item">
          <div><strong>Legendary Resistances</strong></div>
          <div style="font-size: 0.85rem; color: #666;">
            ${yackle.legendaryResistancesUsed}/${yackle.legendaryResistances} used
          </div>
          <div class="resource-dots" style="margin-top: 0.5rem;">
            ${Array(yackle.legendaryResistances).fill(0).map((_, i) =>
              `<div class="dot ${i < yackle.legendaryResistancesUsed ? 'used' : ''}" data-resource="resistance" data-index="${i}"></div>`
            ).join('')}
          </div>
        </div>

        <div class="resource-item">
          <div><strong>Round</strong></div>
          <div style="font-size: 2rem; font-weight: 600; margin-top: 0.5rem;">
            ${state.combat.round}
          </div>
          <button id="next-round" class="btn-toggle" style="margin-top: 0.5rem; width: 100%;">Next Round</button>
        </div>
      </div>

      ${state.currentPhase === 'combat-2' ? renderLairActions() : ''}
      ${state.currentPhase === 'combat-3' ? renderAnchors() : ''}

      <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button id="phase-prev" class="btn-toggle" ${state.currentPhase === 'combat-1' ? 'disabled' : ''}>← Previous Phase</button>
        <button id="phase-next" class="btn-toggle" ${state.currentPhase === 'combat-4' ? 'disabled' : ''}>Next Phase →</button>
        <button id="end-combat" class="btn-toggle" style="margin-left: auto;">End Combat</button>
      </div>
    `;

    setupCombatListeners();
  }

  function renderLairActions() {
    const lairActions = [
      'Grasping Walls',
      'Shifting Corridors',
      'Memory Flood',
      'Summon Shade',
      'Collapsing Floor',
      'Extinguish'
    ];

    return `
      <div style="margin-top: 1.5rem; background: #2a2a2a; padding: 1rem; border-radius: 4px;">
        <h3 style="margin-bottom: 0.5rem;">Lair Actions (Init 20)</h3>
        <div style="font-size: 0.85rem; color: #999; margin-bottom: 0.5rem;">
          Last used: ${state.combat.yackle.lairActionUsed || 'None'} (cannot repeat)
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
          ${lairActions.map(action => `
            <button class="lair-action-btn btn-toggle"
                    data-action="${action}"
                    ${state.combat.yackle.lairActionUsed === action ? 'disabled' : ''}
                    style="padding: 0.5rem; font-size: 0.85rem;">
              ${action}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderAnchors() {
    const anchors = state.combat.anchors;

    return `
      <div style="margin-top: 1.5rem; background: #2a2a2a; padding: 1rem; border-radius: 4px;">
        <h3 style="margin-bottom: 0.5rem;">Ritual Anchors</h3>
        <div style="font-size: 0.85rem; color: #999; margin-bottom: 0.5rem;">
          Destroying anchor: 20 damage to Yackle, -1 Legendary Action
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          ${anchors.map((hp, i) => `
            <div style="text-align: center;">
              <div style="font-weight: 600;">Anchor ${i + 1}</div>
              <div style="font-size: 1.5rem; margin: 0.5rem 0;">${hp}/30</div>
              <div style="display: flex; gap: 0.25rem; justify-content: center;">
                <button class="anchor-btn btn-toggle" data-anchor="${i}" data-change="-5" style="padding: 0.25rem 0.5rem;">-5</button>
                <button class="anchor-btn btn-toggle" data-anchor="${i}" data-change="-10" style="padding: 0.25rem 0.5rem;">-10</button>
              </div>
              ${hp <= 0 ? '<div style="color: #d9534f; margin-top: 0.5rem;">✗ DESTROYED</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function setupCombatListeners() {
    // Yackle damage/heal
    document.getElementById('yackle-damage')?.addEventListener('click', () => {
      const amount = prompt('Damage amount:');
      if (amount && !isNaN(amount)) {
        state.combat.yackle.hp = Math.max(0, state.combat.yackle.hp - parseInt(amount));
        DashboardState.save();
        renderCombatPanel();
      }
    });

    document.getElementById('yackle-heal')?.addEventListener('click', () => {
      const amount = prompt('Heal amount:');
      if (amount && !isNaN(amount)) {
        state.combat.yackle.hp = Math.min(state.combat.yackle.maxHp, state.combat.yackle.hp + parseInt(amount));
        DashboardState.save();
        renderCombatPanel();
      }
    });

    // Resource dots
    document.querySelectorAll('.dot[data-resource]').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const resource = e.target.dataset.resource;
        const index = parseInt(e.target.dataset.index);

        if (resource === 'legendary') {
          // Toggle
          if (index < state.combat.yackle.legendaryActionsUsed) {
            state.combat.yackle.legendaryActionsUsed--;
          } else {
            state.combat.yackle.legendaryActionsUsed++;
          }
        } else if (resource === 'resistance') {
          if (index < state.combat.yackle.legendaryResistancesUsed) {
            state.combat.yackle.legendaryResistancesUsed--;
          } else {
            state.combat.yackle.legendaryResistancesUsed++;
          }
        }

        DashboardState.save();
        renderCombatPanel();
      });
    });

    // Next round
    document.getElementById('next-round')?.addEventListener('click', () => {
      state.combat.round++;
      state.combat.yackle.legendaryActionsUsed = 0;
      DashboardState.save();
      renderCombatPanel();
    });

    // Lair actions
    document.querySelectorAll('.lair-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        state.combat.yackle.lairActionUsed = action;
        DashboardState.save();
        renderCombatPanel();
      });
    });

    // Anchors
    document.querySelectorAll('.anchor-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const anchorIndex = parseInt(e.target.dataset.anchor);
        const change = parseInt(e.target.dataset.change);
        state.combat.anchors[anchorIndex] = Math.max(0, state.combat.anchors[anchorIndex] + change);

        // Check if anchor destroyed
        if (state.combat.anchors[anchorIndex] === 0) {
          state.combat.yackle.hp -= 20;
          state.combat.yackle.legendaryActions = Math.max(1, state.combat.yackle.legendaryActions - 1);
        }

        DashboardState.save();
        renderCombatPanel();
      });
    });

    // Phase navigation
    document.getElementById('phase-prev')?.addEventListener('click', () => {
      const phases = ['exploration', 'combat-1', 'combat-2', 'combat-3', 'combat-4'];
      const currentIndex = phases.indexOf(state.currentPhase);
      if (currentIndex > 0) {
        state.currentPhase = phases[currentIndex - 1];
        DashboardState.save();
        renderCombatPanel();
      }
    });

    document.getElementById('phase-next')?.addEventListener('click', () => {
      const phases = ['exploration', 'combat-1', 'combat-2', 'combat-3', 'combat-4'];
      const currentIndex = phases.indexOf(state.currentPhase);
      if (currentIndex < phases.length - 1) {
        state.currentPhase = phases[currentIndex + 1];

        // Update Yackle stats for new phase
        if (state.currentPhase === 'combat-2') {
          state.combat.yackle.hp = 150;
          state.combat.yackle.maxHp = 150;
        } else if (state.currentPhase === 'combat-3') {
          state.combat.yackle.hp = 175;
          state.combat.yackle.maxHp = 175;
          state.combat.anchors = [30, 30, 30];
        } else if (state.currentPhase === 'combat-4') {
          state.combat.yackle.hp = 250;
          state.combat.yackle.maxHp = 250;
        }

        DashboardState.save();
        renderCombatPanel();
      }
    });

    document.getElementById('end-combat')?.addEventListener('click', () => {
      if (confirm('End combat and return to exploration?')) {
        state.currentPhase = 'exploration';
        state.combat.round = 0;
        state.combat.yackle.hp = 200;
        state.combat.yackle.maxHp = 200;
        state.combat.yackle.legendaryActionsUsed = 0;
        state.combat.yackle.legendaryResistancesUsed = 0;
        state.combat.yackle.lairActionUsed = null;
        DashboardState.save();
        renderCombatPanel();
      }
    });
  }

  return {
    init,
    renderCombatPanel
  };
})();
