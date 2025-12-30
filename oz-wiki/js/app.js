/**
 * Maguire Oz TTRPG Wiki - Main Application
 * Initializes all modules and handles global functionality
 */

const App = (function() {
  'use strict';

  // State
  let isInitialized = false;

  /**
   * Initialize the application
   */
  function init() {
    if (isInitialized) return;

    console.log('Initializing Oz TTRPG Wiki...');

    // Initialize modules in order
    initTheme();
    initFontSize();

    // Initialize navigation first, then tabs
    if (typeof Navigation !== 'undefined') {
      Navigation.init();
    }

    if (typeof Tabs !== 'undefined') {
      Tabs.init();
    }

    // Initialize search
    if (typeof Search !== 'undefined') {
      Search.init();
    }

    // Initialize editor
    if (typeof Editor !== 'undefined') {
      Editor.init();
    }

    // Initialize GM Tools
    if (typeof GMTools !== 'undefined') {
      GMTools.init();
    }

    // Set up global event listeners
    setupKeyboardShortcuts();
    setupThemeToggle();
    setupFontControls();
    setupFooterButtons();
    setupModals();
    setupExportImport();

    isInitialized = true;
    console.log('Oz TTRPG Wiki initialized successfully');
  }

  /**
   * Initialize theme from saved preference
   */
  function initTheme() {
    const isDark = Storage.theme.load();
    if (isDark) {
      document.body.classList.add('dark-mode');
    }
  }

  /**
   * Initialize font size from saved preference
   */
  function initFontSize() {
    const fontSize = Storage.fontSize.load();
    document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
  }

  /**
   * Set up theme toggle button
   */
  function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      Storage.theme.save(isDark);
    });
  }

  /**
   * Set up font size controls
   */
  function setupFontControls() {
    const decreaseBtn = document.getElementById('font-decrease');
    const increaseBtn = document.getElementById('font-increase');

    const minSize = 12;
    const maxSize = 24;
    const step = 2;

    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        let currentSize = Storage.fontSize.load();
        if (currentSize > minSize) {
          currentSize -= step;
          Storage.fontSize.save(currentSize);
          document.documentElement.style.setProperty('--font-size-base', currentSize + 'px');
        }
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        let currentSize = Storage.fontSize.load();
        if (currentSize < maxSize) {
          currentSize += step;
          Storage.fontSize.save(currentSize);
          document.documentElement.style.setProperty('--font-size-base', currentSize + 'px');
        }
      });
    }
  }

  /**
   * Set up footer buttons
   */
  function setupFooterButtons() {
    const editBtn = document.getElementById('edit-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');
    const printBtn = document.getElementById('print-btn');

    // Edit button - handled by Editor module
    // No setup needed here

    // Bookmark button
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', toggleBookmark);
      // Update bookmark button state on tab change
      document.addEventListener('tabChanged', updateBookmarkButton);
    }

    // Print button
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /**
   * Toggle bookmark on current page
   */
  function toggleBookmark() {
    const currentPage = Tabs.getActiveTabId();
    if (currentPage === 'welcome') return;

    const bookmarkBtn = document.getElementById('bookmark-btn');
    const tabs = Tabs.getAllTabs();
    const currentTab = tabs.find(t => t.id === currentPage);
    const title = currentTab ? currentTab.title : currentPage;

    if (Storage.bookmarks.has(currentPage)) {
      Storage.bookmarks.remove(currentPage);
      bookmarkBtn.classList.remove('bookmarked');
      bookmarkBtn.querySelector('.btn-icon').innerHTML = '&#9734;';
    } else {
      Storage.bookmarks.add(currentPage, title);
      bookmarkBtn.classList.add('bookmarked');
      bookmarkBtn.querySelector('.btn-icon').innerHTML = '&#9733;';
    }

    // Trigger bookmarks update in navigation
    document.dispatchEvent(new CustomEvent('bookmarksChanged'));
  }

  /**
   * Update bookmark button state
   */
  function updateBookmarkButton() {
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (!bookmarkBtn) return;

    const currentPage = Tabs.getActiveTabId();
    const isBookmarked = Storage.bookmarks.has(currentPage);

    if (isBookmarked) {
      bookmarkBtn.classList.add('bookmarked');
      bookmarkBtn.querySelector('.btn-icon').innerHTML = '&#9733;';
    } else {
      bookmarkBtn.classList.remove('bookmarked');
      bookmarkBtn.querySelector('.btn-icon').innerHTML = '&#9734;';
    }
  }

  /**
   * Set up keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyboardShortcut);
  }

  /**
   * Handle keyboard shortcut
   * @param {KeyboardEvent} event
   */
  function handleKeyboardShortcut(event) {
    // Ignore if typing in input/textarea
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Allow Escape to blur
      if (event.key === 'Escape') {
        target.blur();
      }
      return;
    }

    // Check for modifier keys
    const ctrlOrCmd = event.ctrlKey || event.metaKey;

    // Shortcuts with Ctrl/Cmd
    if (ctrlOrCmd) {
      switch (event.key.toLowerCase()) {
        case 'k':
          // Focus search
          event.preventDefault();
          focusSearch();
          break;

        case 'e':
          // Edit mode
          event.preventDefault();
          if (typeof Editor !== 'undefined') {
            Editor.toggleEditMode();
          }
          break;

        case 's':
          // Save handled by Editor module when in edit mode
          // This will be caught by the editor's keydown handler
          break;

        case 'w':
          // Close current tab
          event.preventDefault();
          if (typeof Tabs !== 'undefined') {
            Tabs.closeCurrentTab();
          }
          break;

        case 'tab':
          // Next/Previous tab
          event.preventDefault();
          if (typeof Tabs !== 'undefined') {
            if (event.shiftKey) {
              Tabs.previousTab();
            } else {
              Tabs.nextTab();
            }
          }
          break;
      }
      return;
    }

    // Shortcuts without modifier
    switch (event.key) {
      case 'Escape':
        // Close modals
        closeAllModals();
        break;

      case '?':
        // Show shortcuts help
        event.preventDefault();
        showShortcutsModal();
        break;
    }
  }

  /**
   * Focus the search input
   */
  function focusSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      // On mobile, show the search container first
      const searchContainer = searchInput.closest('.search-container');
      if (searchContainer && window.innerWidth <= 768) {
        searchContainer.classList.add('mobile-open');
      }
      searchInput.focus();
      searchInput.select();
    }
  }

  /**
   * Set up modals
   */
  function setupModals() {
    // Shortcuts modal
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const shortcutsClose = document.getElementById('shortcuts-close');

    if (shortcutsModal && shortcutsClose) {
      shortcutsClose.addEventListener('click', () => {
        shortcutsModal.classList.remove('active');
      });

      shortcutsModal.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
          shortcutsModal.classList.remove('active');
        }
      });
    }
  }

  /**
   * Show keyboard shortcuts modal
   */
  function showShortcutsModal() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  /**
   * Close all open modals
   */
  function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });

    // Also close context menus
    document.querySelectorAll('.context-menu.active').forEach(menu => {
      menu.classList.remove('active');
    });

    // Close mobile search
    const searchContainer = document.querySelector('.search-container.mobile-open');
    if (searchContainer) {
      searchContainer.classList.remove('mobile-open');
    }
  }

  /**
   * Show a notification message
   * @param {string} message
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {number} duration - milliseconds
   */
  function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles if not already in CSS
    notification.style.cssText = `
      position: fixed;
      bottom: 60px;
      right: 20px;
      padding: 12px 20px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
      notification.style.borderLeftColor = 'var(--success-color)';
      notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
      notification.style.borderLeftColor = 'var(--error-color)';
      notification.style.borderLeftWidth = '4px';
    } else if (type === 'warning') {
      notification.style.borderLeftColor = 'var(--warning-color)';
      notification.style.borderLeftWidth = '4px';
    }

    document.body.appendChild(notification);

    // Auto-remove
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }

  /**
   * Debug function to show storage info
   */
  function debugStorage() {
    const info = Storage.getStorageInfo();
    console.log('Storage Info:', info);
    return info;
  }

  /**
   * Set up export/import buttons
   */
  function setupExportImport() {
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');

    if (exportBtn) {
      exportBtn.addEventListener('click', exportData);
    }

    if (importBtn && importFileInput) {
      importBtn.addEventListener('click', () => {
        importFileInput.click();
      });

      importFileInput.addEventListener('change', handleImportFile);
    }
  }

  /**
   * Export all user data as JSON file
   */
  function exportData() {
    const data = Storage.exportAllData();

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `oz-wiki-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully', 'success');
  }

  /**
   * Handle import file selection
   */
  function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);

        // Confirm import
        const merge = confirm(
          'Import data?\n\n' +
          'OK = Merge with existing data\n' +
          'Cancel = Replace all data'
        );

        const success = Storage.importData(data, merge);

        if (success) {
          showNotification('Data imported successfully', 'success');

          // Reload page to apply changes
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showNotification('Import failed - invalid data format', 'error');
        }
      } catch (error) {
        console.error('Import error:', error);
        showNotification('Import failed - invalid JSON file', 'error');
      }
    };

    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  }

  // Public API
  return {
    init,
    showNotification,
    focusSearch,
    showShortcutsModal,
    closeAllModals,
    debugStorage,
    exportData,
    importData: handleImportFile
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Make available globally
window.App = App;
