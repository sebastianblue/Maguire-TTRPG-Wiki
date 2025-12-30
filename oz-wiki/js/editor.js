/**
 * Maguire Oz TTRPG Wiki - Editor Module
 * Handles page editing with markdown support
 */

const Editor = (function() {
  'use strict';

  // State
  let isEditMode = false;
  let currentPageId = null;
  let originalContent = null;
  let editorElement = null;

  /**
   * Initialize the editor module
   */
  function init() {
    console.log('Editor module initialized');

    // Listen for edit button clicks
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', toggleEditMode);
    }

    // Listen for tab changes to exit edit mode
    document.addEventListener('tabChanged', exitEditMode);
  }

  /**
   * Toggle edit mode for current page
   */
  function toggleEditMode() {
    if (isEditMode) {
      exitEditMode();
    } else {
      enterEditMode();
    }
  }

  /**
   * Enter edit mode for current page
   */
  function enterEditMode() {
    if (typeof Tabs === 'undefined') return;

    currentPageId = Tabs.getActiveTabId();

    // Don't allow editing welcome page
    if (currentPageId === 'welcome') {
      if (typeof App !== 'undefined') {
        App.showNotification('Cannot edit the Welcome page', 'warning');
      }
      return;
    }

    // Get current page content
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    const pageElement = pageContent.querySelector('.page');
    if (!pageElement) return;

    // Store original content
    const pageBody = pageElement.querySelector('.page-body');
    originalContent = pageBody ? pageBody.innerHTML : '';

    // Check if there's a user edit
    const userEdit = Storage.pageEdits.load(currentPageId);
    let editContent = '';

    if (userEdit) {
      // Edit the user's version
      editContent = htmlToMarkdown(userEdit.content);
    } else if (originalContent && originalContent.includes('placeholder-content')) {
      // Placeholder page - start with empty template
      editContent = getPageTemplate(currentPageId);
    } else {
      // Convert existing HTML to markdown
      editContent = htmlToMarkdown(originalContent);
    }

    // Create editor UI
    createEditorUI(pageElement, editContent);

    // Update state
    isEditMode = true;

    // Update edit button
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
      editBtn.classList.add('active');
      editBtn.querySelector('.btn-icon').innerHTML = '&#10005;';
      editBtn.lastChild.textContent = ' Cancel';
    }

    // Show notification
    if (typeof App !== 'undefined') {
      App.showNotification('Edit mode enabled', 'info');
    }
  }

  /**
   * Exit edit mode without saving
   */
  function exitEditMode() {
    if (!isEditMode) return;

    // Restore original content
    if (currentPageId && originalContent !== null) {
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        // Reload the page
        if (typeof Tabs !== 'undefined') {
          Tabs.loadPageContent(currentPageId);
        }
      }
    }

    // Clean up
    isEditMode = false;
    currentPageId = null;
    originalContent = null;
    editorElement = null;

    // Update edit button
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
      editBtn.classList.remove('active');
      editBtn.querySelector('.btn-icon').innerHTML = '&#9998;';
      editBtn.lastChild.textContent = ' Edit';
    }
  }

  /**
   * Create editor UI
   * @param {HTMLElement} pageElement
   * @param {string} content
   */
  function createEditorUI(pageElement, content) {
    const breadcrumb = pageElement.querySelector('.breadcrumb');
    const breadcrumbHtml = breadcrumb ? breadcrumb.outerHTML : '';

    pageElement.innerHTML = `
      ${breadcrumbHtml}
      <div class="editor-container">
        <div class="editor-toolbar">
          <button class="editor-btn" id="editor-bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
          <button class="editor-btn" id="editor-italic" title="Italic (Ctrl+I)"><em>I</em></button>
          <button class="editor-btn" id="editor-heading" title="Heading">H1</button>
          <button class="editor-btn" id="editor-link" title="Link">🔗</button>
          <button class="editor-btn" id="editor-list" title="List">☰</button>
          <button class="editor-btn" id="editor-code" title="Code Block">&lt;/&gt;</button>
          <div class="editor-toolbar-spacer"></div>
          <button class="editor-btn editor-btn-preview" id="editor-preview">
            <span class="btn-icon">👁</span> Preview
          </button>
        </div>

        <div class="editor-split">
          <div class="editor-pane">
            <div class="editor-label">Markdown</div>
            <textarea class="editor-textarea" id="editor-textarea" placeholder="Write your content in markdown...">${escapeHtml(content)}</textarea>
          </div>

          <div class="editor-pane editor-preview-pane" id="editor-preview-pane">
            <div class="editor-label">Preview</div>
            <div class="editor-preview-content" id="editor-preview-content"></div>
          </div>
        </div>

        <div class="editor-footer">
          <div class="editor-help">
            <span>📝 <strong>Markdown supported:</strong> # Heading, **bold**, *italic*, [link](url), - list, \`code\`, \`\`\`code block\`\`\`</span>
          </div>
          <div class="editor-actions">
            <button class="btn btn-secondary" id="editor-cancel">Cancel</button>
            <button class="btn btn-primary" id="editor-save">Save Changes</button>
          </div>
        </div>
      </div>
    `;

    // Get editor elements
    editorElement = document.getElementById('editor-textarea');
    const previewContent = document.getElementById('editor-preview-content');
    const previewPane = document.getElementById('editor-preview-pane');
    const previewBtn = document.getElementById('editor-preview');

    // Set up event listeners
    const saveBtn = document.getElementById('editor-save');
    const cancelBtn = document.getElementById('editor-cancel');

    if (saveBtn) saveBtn.addEventListener('click', saveChanges);
    if (cancelBtn) cancelBtn.addEventListener('click', exitEditMode);

    // Toolbar buttons
    document.getElementById('editor-bold')?.addEventListener('click', () => insertMarkdown('**', '**'));
    document.getElementById('editor-italic')?.addEventListener('click', () => insertMarkdown('*', '*'));
    document.getElementById('editor-heading')?.addEventListener('click', () => insertMarkdown('# ', ''));
    document.getElementById('editor-link')?.addEventListener('click', () => insertMarkdown('[', '](url)'));
    document.getElementById('editor-list')?.addEventListener('click', () => insertMarkdown('- ', ''));
    document.getElementById('editor-code')?.addEventListener('click', () => insertMarkdown('```\n', '\n```'));

    // Preview toggle
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        previewPane.classList.toggle('active');
        previewBtn.classList.toggle('active');
        updatePreview();
      });
    }

    // Auto-update preview on input
    if (editorElement) {
      editorElement.addEventListener('input', debounce(updatePreview, 300));
    }

    // Keyboard shortcuts
    if (editorElement) {
      editorElement.addEventListener('keydown', handleEditorKeydown);
    }

    // Initial preview update
    updatePreview();

    // Focus editor
    editorElement.focus();
  }

  /**
   * Insert markdown formatting at cursor
   * @param {string} before
   * @param {string} after
   */
  function insertMarkdown(before, after) {
    if (!editorElement) return;

    const start = editorElement.selectionStart;
    const end = editorElement.selectionEnd;
    const text = editorElement.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);

    editorElement.value = newText;
    editorElement.focus();

    // Set cursor position
    const newCursorPos = start + before.length + selectedText.length;
    editorElement.setSelectionRange(newCursorPos, newCursorPos);

    updatePreview();
  }

  /**
   * Handle keyboard shortcuts in editor
   * @param {KeyboardEvent} event
   */
  function handleEditorKeydown(event) {
    const ctrlOrCmd = event.ctrlKey || event.metaKey;

    if (ctrlOrCmd) {
      switch (event.key.toLowerCase()) {
        case 'b':
          event.preventDefault();
          insertMarkdown('**', '**');
          break;

        case 'i':
          event.preventDefault();
          insertMarkdown('*', '*');
          break;

        case 's':
          event.preventDefault();
          saveChanges();
          break;
      }
    }
  }

  /**
   * Update preview pane
   */
  function updatePreview() {
    const previewContent = document.getElementById('editor-preview-content');
    if (!previewContent || !editorElement) return;

    const markdown = editorElement.value;
    const html = markdownToHtml(markdown);
    previewContent.innerHTML = html;
  }

  /**
   * Save changes
   */
  function saveChanges() {
    if (!editorElement || !currentPageId) return;

    const markdownContent = editorElement.value.trim();

    if (markdownContent.length === 0) {
      if (typeof App !== 'undefined') {
        App.showNotification('Content cannot be empty', 'error');
      }
      return;
    }

    // Convert markdown to HTML
    const htmlContent = markdownToHtml(markdownContent);

    // Save to storage
    Storage.pageEdits.save(currentPageId, htmlContent);

    // Save to history
    Storage.pageHistory.save(currentPageId, htmlContent);

    // Update current page display
    if (typeof Tabs !== 'undefined') {
      Tabs.renderPageContent(currentPageId, htmlContent, true);
    }

    // Exit edit mode
    isEditMode = false;
    currentPageId = null;
    originalContent = null;
    editorElement = null;

    // Update edit button
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
      editBtn.classList.remove('active');
      editBtn.querySelector('.btn-icon').innerHTML = '&#9998;';
      editBtn.lastChild.textContent = ' Edit';
    }

    // Show notification
    if (typeof App !== 'undefined') {
      App.showNotification('Changes saved successfully', 'success');
    }
  }

  /**
   * Convert HTML to Markdown (simple conversion)
   * @param {string} html
   * @returns {string}
   */
  function htmlToMarkdown(html) {
    if (!html) return '';

    // Remove placeholder content
    if (html.includes('placeholder-content')) {
      return getPageTemplate('');
    }

    let markdown = html;

    // Headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

    // Bold and italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Lists
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    markdown = markdown.replace(/<\/?ul[^>]*>/gi, '\n');
    markdown = markdown.replace(/<\/?ol[^>]*>/gi, '\n');

    // Code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```');

    // Paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Line breaks
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    markdown = decodeHtmlEntities(markdown);

    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    return markdown;
  }

  /**
   * Convert Markdown to HTML (simple conversion)
   * @param {string} markdown
   * @returns {string}
   */
  function markdownToHtml(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // Escape HTML first
    html = escapeHtml(html);

    // Headers (must be at start of line)
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Code blocks (before inline code)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks and paragraphs
    html = html.split('\n\n').map(para => {
      // Don't wrap headers, lists, or code blocks
      if (para.match(/^<(h[1-6]|ul|pre|code)/)) {
        return para;
      }
      return para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '';
    }).join('\n');

    return html;
  }

  /**
   * Get page template based on page type
   * @param {string} pageId
   * @returns {string}
   */
  function getPageTemplate(pageId) {
    // Basic template for now - can be enhanced based on page category
    return `# Page Title

## Description

Write your content here...

## Details

- Point 1
- Point 2
- Point 3

## Notes

Additional information...
`;
  }

  /**
   * Escape HTML characters
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Decode HTML entities
   * @param {string} text
   * @returns {string}
   */
  function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  /**
   * Debounce function
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Check if currently in edit mode
   * @returns {boolean}
   */
  function isEditing() {
    return isEditMode;
  }

  // Public API
  return {
    init,
    enterEditMode,
    exitEditMode,
    toggleEditMode,
    isEditing
  };
})();

// Make available globally
window.Editor = Editor;
