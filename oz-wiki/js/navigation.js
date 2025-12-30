/**
 * Maguire Oz TTRPG Wiki - Navigation Module
 * Handles sidebar navigation and collapsible categories
 */

const Navigation = (function() {
  'use strict';

  // DOM Elements
  let sidebar = null;
  let sidebarNav = null;
  let hamburgerBtn = null;
  let bookmarksList = null;

  // State
  let expandedCategories = [];
  let currentPage = 'welcome';

  /**
   * Initialize the navigation module
   */
  function init() {
    // Get DOM elements
    sidebar = document.getElementById('sidebar');
    sidebarNav = document.getElementById('sidebar-nav');
    hamburgerBtn = document.getElementById('hamburger-btn');
    bookmarksList = document.getElementById('bookmarks-list');

    if (!sidebar || !sidebarNav) {
      console.error('Navigation: Required elements not found');
      return;
    }

    // Load saved state
    expandedCategories = Storage.sidebarState.load();

    // Set up event listeners
    setupEventListeners();

    // Apply saved expanded state
    applyExpandedState();

    // Render bookmarks
    renderBookmarks();

    console.log('Navigation module initialized');
  }

  /**
   * Set up event listeners for navigation
   */
  function setupEventListeners() {
    // Hamburger menu toggle
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMobileSidebar);
    }

    // Category headers - expand/collapse
    const categoryHeaders = sidebarNav.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
      header.addEventListener('click', handleCategoryClick);
    });

    // Nav items - open page
    const navItems = sidebarNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', handleNavItemClick);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', handleOutsideClick);

    // Listen for bookmark changes
    document.addEventListener('bookmarksChanged', renderBookmarks);
  }

  /**
   * Handle category header click - expand/collapse
   * @param {Event} event
   */
  function handleCategoryClick(event) {
    event.stopPropagation();

    const header = event.currentTarget;
    const categoryElement = header.closest('.category, .subcategory');

    if (!categoryElement) return;

    const categoryPath = categoryElement.dataset.category;
    const isExpanded = categoryElement.classList.contains('expanded');

    if (isExpanded) {
      collapseCategory(categoryElement, categoryPath);
    } else {
      expandCategory(categoryElement, categoryPath);
    }

    // Save state
    Storage.sidebarState.save(expandedCategories);
  }

  /**
   * Expand a category
   * @param {HTMLElement} element
   * @param {string} path
   */
  function expandCategory(element, path) {
    element.classList.add('expanded');
    if (!expandedCategories.includes(path)) {
      expandedCategories.push(path);
    }
  }

  /**
   * Collapse a category
   * @param {HTMLElement} element
   * @param {string} path
   */
  function collapseCategory(element, path) {
    element.classList.remove('expanded');
    expandedCategories = expandedCategories.filter(p => p !== path);
  }

  /**
   * Apply saved expanded state to categories
   */
  function applyExpandedState() {
    expandedCategories.forEach(path => {
      const element = sidebarNav.querySelector(`[data-category="${path}"]`);
      if (element) {
        element.classList.add('expanded');
      }
    });
  }

  /**
   * Handle nav item click - open page
   * @param {Event} event
   */
  function handleNavItemClick(event) {
    event.stopPropagation();

    const navItem = event.currentTarget;
    const pageId = navItem.dataset.page;

    if (!pageId) return;

    // Open page in tabs
    if (typeof Tabs !== 'undefined' && Tabs.openTab) {
      Tabs.openTab(pageId, navItem.textContent.trim());
    }

    // Update active state
    setActivePage(pageId);

    // Close mobile sidebar
    if (window.innerWidth <= 1024) {
      closeMobileSidebar();
    }
  }

  /**
   * Set the active page in the sidebar
   * @param {string} pageId
   */
  function setActivePage(pageId) {
    // Remove current active
    const currentActive = sidebarNav.querySelector('.nav-item.active');
    if (currentActive) {
      currentActive.classList.remove('active');
    }

    // Set new active
    const newActive = sidebarNav.querySelector(`[data-page="${pageId}"]`);
    if (newActive) {
      newActive.classList.add('active');

      // Expand parent categories
      expandToItem(newActive);
    }

    currentPage = pageId;

    // Update page path in footer
    updatePagePath(pageId);
  }

  /**
   * Expand all parent categories to show an item
   * @param {HTMLElement} item
   */
  function expandToItem(item) {
    let parent = item.parentElement;

    while (parent && parent !== sidebarNav) {
      if (parent.classList.contains('category') || parent.classList.contains('subcategory')) {
        const path = parent.dataset.category;
        if (path && !expandedCategories.includes(path)) {
          expandCategory(parent, path);
        }
      }
      parent = parent.parentElement;
    }

    // Save state
    Storage.sidebarState.save(expandedCategories);
  }

  /**
   * Update the page path in the footer
   * @param {string} pageId
   */
  function updatePagePath(pageId) {
    const pagePath = document.getElementById('page-path');
    if (pagePath) {
      // Convert path to readable format
      const parts = pageId.split('/');
      const formatted = parts.map(part => {
        return part.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }).join(' > ');

      pagePath.textContent = formatted;
    }
  }

  /**
   * Toggle mobile sidebar
   */
  function toggleMobileSidebar() {
    sidebar.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
  }

  /**
   * Close mobile sidebar
   */
  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('active');
    }
  }

  /**
   * Handle clicks outside sidebar on mobile
   * @param {Event} event
   */
  function handleOutsideClick(event) {
    if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        closeMobileSidebar();
      }
    }
  }

  /**
   * Render bookmarks in the sidebar
   */
  function renderBookmarks() {
    if (!bookmarksList) return;

    const bookmarks = Storage.bookmarks.load();
    const bookmarksSection = document.getElementById('bookmarks-section');

    // Clear existing
    bookmarksList.innerHTML = '';

    if (bookmarks.length === 0) {
      bookmarksSection.style.display = 'none';
      return;
    }

    bookmarksSection.style.display = 'block';

    // Add bookmark items
    bookmarks.forEach(bookmark => {
      const li = document.createElement('li');
      li.className = 'nav-item bookmark-item';
      li.dataset.page = bookmark.id;
      li.textContent = bookmark.title;

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof Tabs !== 'undefined' && Tabs.openTab) {
          Tabs.openTab(bookmark.id, bookmark.title);
        }
        setActivePage(bookmark.id);
        if (window.innerWidth <= 1024) {
          closeMobileSidebar();
        }
      });

      bookmarksList.appendChild(li);
    });

    // Set up bookmarks section expand/collapse
    const bookmarksHeader = bookmarksSection.querySelector('.category-header');
    if (bookmarksHeader && !bookmarksHeader.dataset.initialized) {
      bookmarksHeader.dataset.initialized = 'true';
      bookmarksHeader.addEventListener('click', () => {
        bookmarksSection.classList.toggle('expanded');
      });
      // Start expanded
      bookmarksSection.classList.add('expanded');
    }
  }

  /**
   * Navigate to a specific page
   * @param {string} pageId
   * @param {string} title
   */
  function navigateTo(pageId, title) {
    if (typeof Tabs !== 'undefined' && Tabs.openTab) {
      Tabs.openTab(pageId, title || pageId);
    }
    setActivePage(pageId);
  }

  /**
   * Expand all categories
   */
  function expandAll() {
    const categories = sidebarNav.querySelectorAll('.category, .subcategory');
    categories.forEach(cat => {
      const path = cat.dataset.category;
      if (path) {
        expandCategory(cat, path);
      }
    });
    Storage.sidebarState.save(expandedCategories);
  }

  /**
   * Collapse all categories
   */
  function collapseAll() {
    const categories = sidebarNav.querySelectorAll('.category.expanded, .subcategory.expanded');
    categories.forEach(cat => {
      const path = cat.dataset.category;
      if (path) {
        collapseCategory(cat, path);
      }
    });
    Storage.sidebarState.save(expandedCategories);
  }

  /**
   * Get the current active page
   * @returns {string} Current page ID
   */
  function getCurrentPage() {
    return currentPage;
  }

  // Public API
  return {
    init,
    setActivePage,
    navigateTo,
    expandAll,
    collapseAll,
    getCurrentPage,
    renderBookmarks,
    closeMobileSidebar
  };
})();

// Make available globally
window.Navigation = Navigation;
