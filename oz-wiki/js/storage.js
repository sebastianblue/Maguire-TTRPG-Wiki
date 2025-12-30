/**
 * Maguire Oz TTRPG Wiki - Storage Module
 * Handles localStorage operations for persistence
 */

const Storage = (function() {
  'use strict';

  const STORAGE_PREFIX = 'oz_wiki_';

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON serialized)
   * @returns {boolean} Success status
   */
  function saveToStorage(key, value) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Retrieved value or default
   */
  function loadFromStorage(key, defaultValue = null) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const item = localStorage.getItem(prefixedKey);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  function removeFromStorage(key) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Existence status
   */
  function hasKey(key) {
    const prefixedKey = STORAGE_PREFIX + key;
    return localStorage.getItem(prefixedKey) !== null;
  }

  /**
   * Get all keys with the wiki prefix
   * @returns {string[]} Array of keys (without prefix)
   */
  function getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key.substring(STORAGE_PREFIX.length));
      }
    }
    return keys;
  }

  /**
   * Clear all wiki-related storage
   * @returns {boolean} Success status
   */
  function clearAll() {
    try {
      const keys = getAllKeys();
      keys.forEach(key => removeFromStorage(key));
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   * @returns {object} Storage usage statistics
   */
  function getStorageInfo() {
    const keys = getAllKeys();
    let totalSize = 0;
    const items = {};

    keys.forEach(key => {
      const prefixedKey = STORAGE_PREFIX + key;
      const value = localStorage.getItem(prefixedKey) || '';
      const size = new Blob([value]).size;
      totalSize += size;
      items[key] = { size, chars: value.length };
    });

    return {
      itemCount: keys.length,
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      items
    };
  }

  // ===================================
  // Specific Storage Helpers
  // ===================================

  /**
   * Theme preference management
   */
  const theme = {
    save: function(isDark) {
      return saveToStorage('theme', isDark ? 'dark' : 'light');
    },
    load: function() {
      const theme = loadFromStorage('theme', 'light');
      return theme === 'dark';
    }
  };

  /**
   * Font size preference management
   */
  const fontSize = {
    save: function(size) {
      return saveToStorage('fontSize', size);
    },
    load: function() {
      return loadFromStorage('fontSize', 16);
    }
  };

  /**
   * Sidebar state management
   */
  const sidebarState = {
    save: function(expandedCategories) {
      return saveToStorage('sidebarState', expandedCategories);
    },
    load: function() {
      return loadFromStorage('sidebarState', []);
    }
  };

  /**
   * Open tabs management
   */
  const openTabs = {
    save: function(tabs) {
      return saveToStorage('openTabs', tabs);
    },
    load: function() {
      return loadFromStorage('openTabs', [{ id: 'welcome', title: 'Welcome' }]);
    },
    saveActiveTab: function(tabId) {
      return saveToStorage('activeTab', tabId);
    },
    loadActiveTab: function() {
      return loadFromStorage('activeTab', 'welcome');
    }
  };

  /**
   * Bookmarks management
   */
  const bookmarks = {
    save: function(bookmarkList) {
      return saveToStorage('bookmarks', bookmarkList);
    },
    load: function() {
      return loadFromStorage('bookmarks', []);
    },
    add: function(pageId, title) {
      const current = this.load();
      if (!current.find(b => b.id === pageId)) {
        current.push({ id: pageId, title, addedAt: new Date().toISOString() });
        return this.save(current);
      }
      return true;
    },
    remove: function(pageId) {
      const current = this.load();
      const filtered = current.filter(b => b.id !== pageId);
      return this.save(filtered);
    },
    has: function(pageId) {
      const current = this.load();
      return current.some(b => b.id === pageId);
    }
  };

  /**
   * Page edits management (user modifications to pages)
   */
  const pageEdits = {
    save: function(pageId, content) {
      const edits = loadFromStorage('pageEdits', {});
      edits[pageId] = {
        content,
        lastModified: new Date().toISOString()
      };
      return saveToStorage('pageEdits', edits);
    },
    load: function(pageId) {
      const edits = loadFromStorage('pageEdits', {});
      return edits[pageId] || null;
    },
    remove: function(pageId) {
      const edits = loadFromStorage('pageEdits', {});
      delete edits[pageId];
      return saveToStorage('pageEdits', edits);
    },
    getAll: function() {
      return loadFromStorage('pageEdits', {});
    },
    hasEdit: function(pageId) {
      const edits = loadFromStorage('pageEdits', {});
      return pageId in edits;
    }
  };

  /**
   * Page history management (version history for edits)
   */
  const pageHistory = {
    MAX_VERSIONS: 5,

    save: function(pageId, content) {
      const historyKey = 'history_' + pageId;
      const history = loadFromStorage(historyKey, []);

      // Add new version at the beginning
      history.unshift({
        content,
        timestamp: new Date().toISOString()
      });

      // Keep only last MAX_VERSIONS
      if (history.length > this.MAX_VERSIONS) {
        history.length = this.MAX_VERSIONS;
      }

      return saveToStorage(historyKey, history);
    },
    load: function(pageId) {
      const historyKey = 'history_' + pageId;
      return loadFromStorage(historyKey, []);
    },
    clear: function(pageId) {
      const historyKey = 'history_' + pageId;
      return removeFromStorage(historyKey);
    }
  };

  /**
   * GM Tools state management
   */
  const gmTools = {
    saveState: function(state) {
      return saveToStorage('gmToolsState', state);
    },
    loadState: function() {
      return loadFromStorage('gmToolsState', {
        isOpen: false,
        isPinned: false,
        width: 350,
        activeTab: 'dice'
      });
    },
    saveNotes: function(notes) {
      return saveToStorage('gmQuickNotes', notes);
    },
    loadNotes: function() {
      return loadFromStorage('gmQuickNotes', '');
    },
    saveInitiative: function(combatants) {
      return saveToStorage('gmInitiative', combatants);
    },
    loadInitiative: function() {
      return loadFromStorage('gmInitiative', []);
    },
    saveDiceHistory: function(history) {
      return saveToStorage('gmDiceHistory', history);
    },
    loadDiceHistory: function() {
      return loadFromStorage('gmDiceHistory', []);
    },
    saveSessions: function(sessions) {
      return saveToStorage('gmSessions', sessions);
    },
    loadSessions: function() {
      return loadFromStorage('gmSessions', []);
    }
  };

  /**
   * Export all user data as JSON
   * @returns {object} All exportable data
   */
  function exportAllData() {
    return {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        theme: loadFromStorage('theme'),
        fontSize: loadFromStorage('fontSize'),
        bookmarks: bookmarks.load(),
        pageEdits: pageEdits.getAll(),
        gmQuickNotes: gmTools.loadNotes(),
        gmSessions: gmTools.loadSessions(),
        sidebarState: sidebarState.load()
      }
    };
  }

  /**
   * Import user data from JSON
   * @param {object} data - Exported data object
   * @param {boolean} merge - Whether to merge with existing data
   * @returns {boolean} Success status
   */
  function importData(data, merge = false) {
    try {
      if (!data || !data.data) {
        throw new Error('Invalid import data format');
      }

      const importData = data.data;

      if (!merge) {
        // Clear existing data first
        clearAll();
      }

      // Import each data type
      if (importData.theme) {
        saveToStorage('theme', importData.theme);
      }
      if (importData.fontSize) {
        saveToStorage('fontSize', importData.fontSize);
      }
      if (importData.bookmarks) {
        if (merge) {
          const existing = bookmarks.load();
          const merged = [...existing];
          importData.bookmarks.forEach(b => {
            if (!merged.find(e => e.id === b.id)) {
              merged.push(b);
            }
          });
          bookmarks.save(merged);
        } else {
          bookmarks.save(importData.bookmarks);
        }
      }
      if (importData.pageEdits) {
        if (merge) {
          const existing = pageEdits.getAll();
          const merged = { ...existing, ...importData.pageEdits };
          saveToStorage('pageEdits', merged);
        } else {
          saveToStorage('pageEdits', importData.pageEdits);
        }
      }
      if (importData.gmQuickNotes) {
        gmTools.saveNotes(importData.gmQuickNotes);
      }
      if (importData.gmSessions) {
        if (merge) {
          const existing = gmTools.loadSessions();
          const merged = [...existing, ...importData.gmSessions];
          gmTools.saveSessions(merged);
        } else {
          gmTools.saveSessions(importData.gmSessions);
        }
      }
      if (importData.sidebarState) {
        sidebarState.save(importData.sidebarState);
      }

      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  // Public API
  return {
    save: saveToStorage,
    load: loadFromStorage,
    remove: removeFromStorage,
    has: hasKey,
    getAllKeys,
    clearAll,
    getStorageInfo,
    theme,
    fontSize,
    sidebarState,
    openTabs,
    bookmarks,
    pageEdits,
    pageHistory,
    gmTools,
    exportAllData,
    importData
  };
})();

// Make available globally
window.Storage = Storage;
