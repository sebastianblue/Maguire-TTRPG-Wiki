/**
 * Maguire Oz TTRPG Wiki - Tabs Module
 * Handles tab management with drag-and-drop reordering
 */

const Tabs = (function() {
  'use strict';

  // Constants
  const MAX_TABS = 10;

  // DOM Elements
  let tabsContainer = null;
  let pageContent = null;
  let contextMenu = null;

  // State
  let tabs = [];
  let activeTabId = 'welcome';
  let draggedTab = null;

  /**
   * Initialize the tabs module
   */
  function init() {
    // Get DOM elements
    tabsContainer = document.getElementById('tabs-container');
    pageContent = document.getElementById('page-content');
    contextMenu = document.getElementById('tab-context-menu');

    if (!tabsContainer || !pageContent) {
      console.error('Tabs: Required elements not found');
      return;
    }

    // Load saved tabs
    tabs = Storage.openTabs.load();
    activeTabId = Storage.openTabs.loadActiveTab();

    // Render tabs
    renderTabs();

    // Set up event listeners
    setupEventListeners();

    // Load active tab content
    if (activeTabId) {
      loadPageContent(activeTabId);
    }

    console.log('Tabs module initialized');
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Context menu items
    if (contextMenu) {
      contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', handleContextMenuAction);
      });

      // Close context menu on outside click
      document.addEventListener('click', () => {
        contextMenu.classList.remove('active');
      });
    }

    // Quick link cards on welcome page
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.quick-link-card');
      if (card && card.dataset.page) {
        const title = card.querySelector('h3')?.textContent || card.dataset.page;
        openTab(card.dataset.page, title);
      }
    });
  }

  /**
   * Render all tabs
   */
  function renderTabs() {
    tabsContainer.innerHTML = '';

    tabs.forEach(tab => {
      const tabElement = createTabElement(tab);
      tabsContainer.appendChild(tabElement);
    });

    // Ensure active tab is visible
    scrollToActiveTab();
  }

  /**
   * Create a tab DOM element
   * @param {object} tab - Tab data
   * @returns {HTMLElement}
   */
  function createTabElement(tab) {
    const tabEl = document.createElement('div');
    tabEl.className = 'tab' + (tab.id === activeTabId ? ' active' : '');
    tabEl.dataset.page = tab.id;
    tabEl.draggable = true;

    // Tab title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'tab-title';
    titleSpan.textContent = truncateTitle(tab.title);
    titleSpan.title = tab.title;
    tabEl.appendChild(titleSpan);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tab-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close tab');
    tabEl.appendChild(closeBtn);

    // Event listeners
    tabEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab-close')) {
        activateTab(tab.id);
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });

    // Right-click context menu
    tabEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(e, tab.id);
    });

    // Drag and drop
    tabEl.addEventListener('dragstart', handleDragStart);
    tabEl.addEventListener('dragend', handleDragEnd);
    tabEl.addEventListener('dragover', handleDragOver);
    tabEl.addEventListener('drop', handleDrop);

    return tabEl;
  }

  /**
   * Truncate tab title if too long
   * @param {string} title
   * @returns {string}
   */
  function truncateTitle(title) {
    const maxLength = 20;
    if (title.length > maxLength) {
      return title.substring(0, maxLength - 2) + '...';
    }
    return title;
  }

  /**
   * Open a new tab or activate existing one
   * @param {string} pageId
   * @param {string} title
   */
  function openTab(pageId, title) {
    // Check if tab already exists
    const existingTab = tabs.find(t => t.id === pageId);

    if (existingTab) {
      activateTab(pageId);
      return;
    }

    // Check max tabs
    if (tabs.length >= MAX_TABS) {
      showMaxTabsWarning();
      return;
    }

    // Create new tab
    const newTab = {
      id: pageId,
      title: title || pageId
    };

    tabs.push(newTab);
    activeTabId = pageId;

    // Save and render
    saveState();
    renderTabs();
    loadPageContent(pageId);

    // Update navigation
    if (typeof Navigation !== 'undefined') {
      Navigation.setActivePage(pageId);
    }
  }

  /**
   * Activate an existing tab
   * @param {string} tabId
   */
  function activateTab(tabId) {
    if (activeTabId === tabId) return;

    activeTabId = tabId;

    // Update tab classes
    tabsContainer.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === tabId);
    });

    // Save and load content
    saveState();
    loadPageContent(tabId);

    // Update navigation
    if (typeof Navigation !== 'undefined') {
      Navigation.setActivePage(tabId);
    }
  }

  /**
   * Close a tab
   * @param {string} tabId
   */
  function closeTab(tabId) {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    // Don't close last tab
    if (tabs.length === 1) {
      return;
    }

    // Remove tab
    tabs.splice(tabIndex, 1);

    // If closing active tab, activate another
    if (activeTabId === tabId) {
      // Prefer the tab to the left, or the first remaining tab
      const newIndex = Math.min(tabIndex, tabs.length - 1);
      activeTabId = tabs[newIndex].id;
      loadPageContent(activeTabId);

      if (typeof Navigation !== 'undefined') {
        Navigation.setActivePage(activeTabId);
      }
    }

    saveState();
    renderTabs();
  }

  /**
   * Close all tabs except the specified one
   * @param {string} exceptTabId
   */
  function closeOtherTabs(exceptTabId) {
    tabs = tabs.filter(t => t.id === exceptTabId);
    activeTabId = exceptTabId;
    saveState();
    renderTabs();
    loadPageContent(activeTabId);
  }

  /**
   * Close tabs to the right of specified tab
   * @param {string} tabId
   */
  function closeTabsToRight(tabId) {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    tabs = tabs.slice(0, tabIndex + 1);

    // If active tab was closed, activate the specified tab
    if (!tabs.find(t => t.id === activeTabId)) {
      activeTabId = tabId;
      loadPageContent(activeTabId);
    }

    saveState();
    renderTabs();
  }

  /**
   * Load page content
   * @param {string} pageId
   */
  function loadPageContent(pageId) {
    if (pageId === 'welcome') {
      // Show welcome page (already in HTML)
      showWelcomePage();
      return;
    }

    // Show loading state
    pageContent.innerHTML = `
      <div class="loading-page">
        <p>Loading ${pageId}...</p>
      </div>
    `;

    // Check for user edits first
    const userEdit = Storage.pageEdits.load(pageId);

    if (userEdit) {
      renderPageContent(pageId, userEdit.content, true);
      return;
    }

    // Load from pages.json (will be implemented in Step 2)
    // For now, show placeholder
    renderPlaceholderPage(pageId);
  }

  /**
   * Show welcome page
   */
  function showWelcomePage() {
    pageContent.innerHTML = `
      <div class="welcome-page">
        <h1>Welcome to the Maguire Oz TTRPG Wiki</h1>
        <p class="subtitle">A comprehensive reference for tabletop roleplaying in Gregory Maguire's Oz</p>

        <div class="welcome-intro">
          <blockquote>
            "The Unnamed God must never be named. Naming limits divine power."
            <cite>— Unionist Doctrine</cite>
          </blockquote>

          <p>This wiki contains everything you need to run campaigns set in the world of <em>Wicked</em>, <em>Son of a Witch</em>, <em>A Lion Among Men</em>, and <em>Out of Oz</em>. Navigate using the sidebar, search for specific topics, or explore the categories below.</p>
        </div>

        <div class="quick-links">
          <h2>Quick Start</h2>
          <div class="quick-links-grid">
            <div class="quick-link-card" data-page="character/races/humans/gillikinese">
              <h3>Races</h3>
              <p>Humans, Animals, Tiktoks, and more</p>
            </div>
            <div class="quick-link-card" data-page="character/classes/the-adept">
              <h3>Classes</h3>
              <p>10 unique classes with subclasses</p>
            </div>
            <div class="quick-link-card" data-page="magic/spells/grimmerie">
              <h3>Magic</h3>
              <p>5 magical traditions and phenomena</p>
            </div>
            <div class="quick-link-card" data-page="exploration/regions/emerald-city">
              <h3>Exploration</h3>
              <p>The lands and locations of Oz</p>
            </div>
            <div class="quick-link-card" data-page="factions/government/the-palace">
              <h3>Factions</h3>
              <p>Political powers and secret societies</p>
            </div>
            <div class="quick-link-card" data-page="dm-resources/session-zero">
              <h3>DM Resources</h3>
              <p>Tools for running your campaign</p>
            </div>
          </div>
        </div>

        <div class="keyboard-shortcuts-hint">
          <p>Press <kbd>?</kbd> for keyboard shortcuts</p>
        </div>
      </div>
    `;
  }

  /**
   * Render placeholder page for pages not yet created
   * @param {string} pageId
   */
  function renderPlaceholderPage(pageId) {
    const parts = pageId.split('/');
    const title = parts[parts.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const breadcrumb = parts
      .map(part => part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(' > ');

    pageContent.innerHTML = `
      <div class="page">
        <nav class="breadcrumb">${breadcrumb}</nav>
        <h1>${title}</h1>
        <div class="placeholder-content">
          <p><em>This page is a placeholder. Content will be generated in later steps.</em></p>
          <p>Page ID: <code>${pageId}</code></p>
        </div>
      </div>
    `;
  }

  /**
   * Render actual page content
   * @param {string} pageId
   * @param {string} content
   * @param {boolean} isEdited
   */
  function renderPageContent(pageId, content, isEdited = false) {
    const parts = pageId.split('/');
    const breadcrumb = parts
      .map(part => part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(' > ');

    pageContent.innerHTML = `
      <div class="page">
        <nav class="breadcrumb">${breadcrumb}</nav>
        ${isEdited ? '<span class="edited-badge">Edited</span>' : ''}
        <div class="page-body">${content}</div>
      </div>
    `;
  }

  /**
   * Show max tabs warning
   */
  function showMaxTabsWarning() {
    // Simple alert for now - could be improved with a modal
    alert(`Maximum of ${MAX_TABS} tabs reached. Please close some tabs first.`);
  }

  /**
   * Show context menu
   * @param {Event} event
   * @param {string} tabId
   */
  function showContextMenu(event, tabId) {
    if (!contextMenu) return;

    contextMenu.dataset.tabId = tabId;
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.classList.add('active');
  }

  /**
   * Handle context menu action
   * @param {Event} event
   */
  function handleContextMenuAction(event) {
    const action = event.target.dataset.action;
    const tabId = contextMenu.dataset.tabId;

    contextMenu.classList.remove('active');

    switch (action) {
      case 'close':
        closeTab(tabId);
        break;
      case 'close-others':
        closeOtherTabs(tabId);
        break;
      case 'close-right':
        closeTabsToRight(tabId);
        break;
    }
  }

  // ===================================
  // Drag and Drop
  // ===================================

  function handleDragStart(event) {
    draggedTab = event.target;
    draggedTab.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedTab.dataset.page);
  }

  function handleDragEnd(event) {
    if (draggedTab) {
      draggedTab.classList.remove('dragging');
      draggedTab = null;
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const target = event.target.closest('.tab');
    if (!target || target === draggedTab) return;

    const rect = target.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;

    if (event.clientX < midpoint) {
      target.style.marginLeft = '40px';
      target.style.marginRight = '0';
    } else {
      target.style.marginRight = '40px';
      target.style.marginLeft = '0';
    }
  }

  function handleDrop(event) {
    event.preventDefault();

    const target = event.target.closest('.tab');
    if (!target || !draggedTab) return;

    // Reset margins
    tabsContainer.querySelectorAll('.tab').forEach(tab => {
      tab.style.marginLeft = '';
      tab.style.marginRight = '';
    });

    // Get indices
    const draggedId = draggedTab.dataset.page;
    const targetId = target.dataset.page;

    const draggedIndex = tabs.findIndex(t => t.id === draggedId);
    const targetIndex = tabs.findIndex(t => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder
    const [draggedItem] = tabs.splice(draggedIndex, 1);
    tabs.splice(targetIndex, 0, draggedItem);

    saveState();
    renderTabs();
  }

  /**
   * Scroll to make active tab visible
   */
  function scrollToActiveTab() {
    const activeTab = tabsContainer.querySelector('.tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  /**
   * Save current state
   */
  function saveState() {
    Storage.openTabs.save(tabs);
    Storage.openTabs.saveActiveTab(activeTabId);
  }

  /**
   * Navigate to next tab
   */
  function nextTab() {
    const currentIndex = tabs.findIndex(t => t.id === activeTabId);
    const nextIndex = (currentIndex + 1) % tabs.length;
    activateTab(tabs[nextIndex].id);
  }

  /**
   * Navigate to previous tab
   */
  function previousTab() {
    const currentIndex = tabs.findIndex(t => t.id === activeTabId);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    activateTab(tabs[prevIndex].id);
  }

  /**
   * Close current tab
   */
  function closeCurrentTab() {
    closeTab(activeTabId);
  }

  /**
   * Get current active tab ID
   * @returns {string}
   */
  function getActiveTabId() {
    return activeTabId;
  }

  /**
   * Get all open tabs
   * @returns {Array}
   */
  function getAllTabs() {
    return [...tabs];
  }

  // Public API
  return {
    init,
    openTab,
    closeTab,
    activateTab,
    closeOtherTabs,
    closeCurrentTab,
    nextTab,
    previousTab,
    getActiveTabId,
    getAllTabs,
    loadPageContent,
    renderPageContent
  };
})();

// Make available globally
window.Tabs = Tabs;
