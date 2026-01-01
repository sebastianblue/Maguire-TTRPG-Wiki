// Main Dashboard Initialization
(function() {
  'use strict';

  let state = null;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing GM Dashboard...');

    // Initialize state
    state = DashboardState.init();

    // Initialize all modules
    DashboardMap.init(state);
    DashboardTrackers.init(state);
    DashboardCombat.init(state);

    // Setup global controls
    setupGlobalControls();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Apply dark mode if saved
    applyDarkMode();

    console.log('GM Dashboard initialized successfully');
  });

  function setupGlobalControls() {
    // Dark mode toggle
    document.getElementById('toggle-dark-mode')?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('dashboard-dark-mode', isDark);
    });

    // Reset state
    document.getElementById('reset-state')?.addEventListener('click', () => {
      DashboardState.reset();
    });

    // Force save
    document.getElementById('save-state')?.addEventListener('click', () => {
      DashboardState.save();
      alert('State saved successfully!');
    });

    // Help modal
    document.getElementById('help-shortcuts')?.addEventListener('click', () => {
      showHelpModal();
    });

    document.getElementById('close-help')?.addEventListener('click', () => {
      hideHelpModal();
    });

    // Close modals on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideHelpModal();
      }
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      // N - Next turn
      if (e.key === 'n' || e.key === 'N') {
        document.getElementById('next-round')?.click();
      }

      // Space - Pause/resume timer
      if (e.key === ' ') {
        e.preventDefault();
        const timerRunning = state.timer.running;
        if (timerRunning) {
          document.getElementById('timer-pause')?.click();
        } else {
          document.getElementById('timer-start')?.click();
        }
      }

      // 1-5 - Switch floor tabs
      if (e.key >= '1' && e.key <= '5') {
        const floors = ['grounds', 'ground', 'upper', 'attic', 'cellar'];
        const floorIndex = parseInt(e.key) - 1;
        if (floorIndex < floors.length) {
          const tabs = document.querySelectorAll('.floor-tab');
          tabs[floorIndex]?.click();
        }
      }

      // Ctrl+S - Force save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        DashboardState.save();
        console.log('State force-saved');
      }

      // ? - Show help
      if (e.key === '?') {
        showHelpModal();
      }
    });
  }

  function showHelpModal() {
    document.getElementById('help-modal')?.classList.remove('hidden');
  }

  function hideHelpModal() {
    document.getElementById('help-modal')?.classList.add('hidden');
  }

  function applyDarkMode() {
    const isDark = localStorage.getItem('dashboard-dark-mode') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
    }
  }

  // Auto-save every 30 seconds
  setInterval(() => {
    DashboardState.save();
  }, 30000);

  // Warn before unload if timer is running
  window.addEventListener('beforeunload', (e) => {
    if (state && state.timer.running) {
      e.preventDefault();
      e.returnValue = 'Timer is running. Are you sure you want to leave?';
      return e.returnValue;
    }
  });
})();
