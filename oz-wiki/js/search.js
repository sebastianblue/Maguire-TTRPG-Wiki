/**
 * Maguire Oz TTRPG Wiki - Search Module
 * Handles search functionality with live results
 */

const Search = (function() {
  'use strict';

  // DOM Elements
  let searchInput = null;
  let searchResults = null;

  // State
  let pagesIndex = [];
  let isIndexBuilt = false;

  /**
   * Initialize the search module
   */
  function init() {
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) {
      console.error('Search: Required elements not found');
      return;
    }

    // Set up event listeners
    setupEventListeners();

    // Build search index
    buildSearchIndex();

    console.log('Search module initialized');
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Input event for live search
    searchInput.addEventListener('input', handleSearchInput);

    // Focus/blur events
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('blur', handleSearchBlur);

    // Keyboard navigation
    searchInput.addEventListener('keydown', handleSearchKeydown);

    // Click outside to close results
    document.addEventListener('click', handleOutsideClick);
  }

  /**
   * Build search index from pages.json and navigation
   */
  async function buildSearchIndex() {
    pagesIndex = [];

    // Load pages.json
    try {
      const response = await fetch('data/pages.json');
      const data = await response.json();

      // Index all pages from pages.json
      if (data.pages) {
        Object.keys(data.pages).forEach(pageId => {
          const page = data.pages[pageId];
          pagesIndex.push({
            id: pageId,
            title: page.title || formatTitle(pageId),
            content: stripHtml(page.content || ''),
            category: getCategoryFromId(pageId),
            keywords: page.keywords || []
          });
        });
      }
    } catch (error) {
      console.warn('Could not load pages.json:', error);
    }

    // Also index navigation items (even if not in pages.json yet)
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
      const pageId = item.dataset.page;

      // Don't duplicate if already indexed
      if (!pagesIndex.find(p => p.id === pageId)) {
        pagesIndex.push({
          id: pageId,
          title: item.textContent.trim(),
          content: '',
          category: getCategoryFromId(pageId),
          keywords: []
        });
      }
    });

    isIndexBuilt = true;
    console.log(`Search index built: ${pagesIndex.length} pages`);
  }

  /**
   * Handle search input
   * @param {Event} event
   */
  function handleSearchInput(event) {
    const query = event.target.value.trim();

    if (query.length === 0) {
      hideResults();
      return;
    }

    if (query.length < 2) {
      searchResults.innerHTML = '<div class="search-hint">Type at least 2 characters...</div>';
      searchResults.classList.add('active');
      return;
    }

    performSearch(query);
  }

  /**
   * Perform search and display results
   * @param {string} query
   */
  function performSearch(query) {
    if (!isIndexBuilt) {
      searchResults.innerHTML = '<div class="search-hint">Building search index...</div>';
      searchResults.classList.add('active');
      return;
    }

    const results = searchPages(query);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      searchResults.classList.add('active');
      return;
    }

    displayResults(results, query);
  }

  /**
   * Search pages for query
   * @param {string} query
   * @returns {Array} Search results with scores
   */
  function searchPages(query) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);

    const results = pagesIndex
      .map(page => {
        let score = 0;

        // Exact title match (highest priority)
        if (page.title.toLowerCase() === queryLower) {
          score += 1000;
        }

        // Title starts with query
        if (page.title.toLowerCase().startsWith(queryLower)) {
          score += 500;
        }

        // Title contains query
        if (page.title.toLowerCase().includes(queryLower)) {
          score += 100;
        }

        // Each query word in title
        queryWords.forEach(word => {
          if (page.title.toLowerCase().includes(word)) {
            score += 50;
          }
        });

        // Category matches
        if (page.category.toLowerCase().includes(queryLower)) {
          score += 30;
        }

        // Content matches
        if (page.content.toLowerCase().includes(queryLower)) {
          score += 20;
        }

        // Keyword matches
        page.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(queryLower)) {
            score += 40;
          }
        });

        return { page, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 results

    return results;
  }

  /**
   * Display search results
   * @param {Array} results
   * @param {string} query
   */
  function displayResults(results, query) {
    const html = results.map((result, index) => {
      const { page } = result;
      const highlightedTitle = highlightMatch(page.title, query);
      const snippet = getSnippet(page.content, query);

      return `
        <div class="search-result-item" data-page="${page.id}" data-index="${index}">
          <div class="search-result-title">${highlightedTitle}</div>
          <div class="search-result-category">${page.category}</div>
          ${snippet ? `<div class="search-result-snippet">${snippet}</div>` : ''}
        </div>
      `;
    }).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('active');

    // Add click handlers
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('mousedown', handleResultClick);
      item.addEventListener('mouseenter', handleResultHover);
    });
  }

  /**
   * Get snippet of content around query match
   * @param {string} content
   * @param {string} query
   * @returns {string}
   */
  function getSnippet(content, query) {
    if (!content) return '';

    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const matchIndex = contentLower.indexOf(queryLower);

    if (matchIndex === -1) return '';

    const snippetLength = 100;
    const start = Math.max(0, matchIndex - 40);
    const end = Math.min(content.length, matchIndex + snippetLength);

    let snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return highlightMatch(snippet, query);
  }

  /**
   * Highlight query match in text
   * @param {string} text
   * @param {string} query
   * @returns {string}
   */
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape special regex characters
   * @param {string} str
   * @returns {string}
   */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Handle search result click
   * @param {Event} event
   */
  function handleResultClick(event) {
    const item = event.currentTarget;
    const pageId = item.dataset.page;
    const title = item.querySelector('.search-result-title').textContent;

    // Open page
    if (typeof Tabs !== 'undefined') {
      Tabs.openTab(pageId, title);
    }

    // Clear search
    searchInput.value = '';
    hideResults();
    searchInput.blur();
  }

  /**
   * Handle result hover
   * @param {Event} event
   */
  function handleResultHover(event) {
    // Remove active class from all results
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add to hovered item
    event.currentTarget.classList.add('active');
  }

  /**
   * Handle keyboard navigation in search
   * @param {Event} event
   */
  function handleSearchKeydown(event) {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    const activeItem = searchResults.querySelector('.search-result-item.active');
    let currentIndex = activeItem ? parseInt(activeItem.dataset.index) : -1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        currentIndex = Math.min(currentIndex + 1, items.length - 1);
        setActiveResult(currentIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
        setActiveResult(currentIndex);
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0) {
          items[currentIndex].click();
        }
        break;

      case 'Escape':
        event.preventDefault();
        searchInput.value = '';
        hideResults();
        searchInput.blur();
        break;
    }
  }

  /**
   * Set active search result
   * @param {number} index
   */
  function setActiveResult(index) {
    const items = searchResults.querySelectorAll('.search-result-item');

    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    // Scroll into view
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Handle search focus
   */
  function handleSearchFocus() {
    if (searchInput.value.trim().length >= 2) {
      searchResults.classList.add('active');
    }
  }

  /**
   * Handle search blur - delayed to allow clicks
   */
  function handleSearchBlur() {
    setTimeout(() => {
      hideResults();
    }, 200);
  }

  /**
   * Handle click outside search
   * @param {Event} event
   */
  function handleOutsideClick(event) {
    if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
      hideResults();
    }
  }

  /**
   * Hide search results
   */
  function hideResults() {
    searchResults.classList.remove('active');
  }

  /**
   * Format page ID to title
   * @param {string} pageId
   * @returns {string}
   */
  function formatTitle(pageId) {
    const parts = pageId.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get category from page ID
   * @param {string} pageId
   * @returns {string}
   */
  function getCategoryFromId(pageId) {
    const parts = pageId.split('/');
    return parts
      .map(part => part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(' > ');
  }

  /**
   * Strip HTML tags from content
   * @param {string} html
   * @returns {string}
   */
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Rebuild search index (call after page data changes)
   */
  function rebuildIndex() {
    buildSearchIndex();
  }

  // Public API
  return {
    init,
    rebuildIndex
  };
})();

// Make available globally
window.Search = Search;
