(async function () {
  const state = {
    pages: [],
    tabs: [],
    active: null,
    secondary: null,
    bookmarks: new Set(JSON.parse(localStorage.getItem('bookmarks') || '[]')),
    recent: JSON.parse(localStorage.getItem('recent') || '[]'),
    edits: JSON.parse(localStorage.getItem('edits') || '{}'),
  };

  const elements = {
    navTree: document.getElementById('navTree'),
    searchInput: document.getElementById('searchInput'),
    filterCategory: document.getElementById('filterCategory'),
    fuzzyToggle: document.getElementById('fuzzyToggle'),
    bookmarks: document.getElementById('bookmarks'),
    recent: document.getElementById('recent'),
    breadcrumbs: document.getElementById('breadcrumbs'),
    pageContent: document.getElementById('pageContent'),
    related: document.getElementById('related'),
    tabbar: document.getElementById('tabbar'),
    splitToggle: document.getElementById('splitToggle'),
    secondaryView: document.getElementById('secondaryView'),
    bookmarkToggle: document.getElementById('bookmarkToggle'),
    editToggle: document.getElementById('editToggle'),
    editor: document.getElementById('editor'),
    markdownArea: document.getElementById('markdownArea'),
    richArea: document.getElementById('richArea'),
    history: document.getElementById('history'),
    saveEdit: document.getElementById('saveEdit'),
    cancelEdit: document.getElementById('cancelEdit'),
    exportPage: document.getElementById('exportPage'),
    importPage: document.getElementById('importPage'),
    importPageBtn: document.getElementById('importPageBtn'),
    modeToggle: document.getElementById('modeToggle'),
    fontSize: document.getElementById('fontSize'),
    printBtn: document.getElementById('printBtn'),
    exportEdits: document.getElementById('exportEdits'),
    importEdits: document.getElementById('importEdits'),
    importEditsBtn: document.getElementById('importEditsBtn'),
    sessionNotes: document.getElementById('sessionNotes'),
    diceExpr: document.getElementById('diceExpr'),
    rollDice: document.getElementById('rollDice'),
    diceResult: document.getElementById('diceResult'),
    initName: document.getElementById('initName'),
    initRoll: document.getElementById('initRoll'),
    addInit: document.getElementById('addInit'),
    initList: document.getElementById('initList'),
    conditions: document.getElementById('conditions'),
    statQuery: document.getElementById('statQuery'),
    statBlock: document.getElementById('statBlock'),
    openHistory: document.getElementById('openHistory'),
  };

  async function loadPages() {
    const res = await fetch('data/pages.json');
    state.pages = await res.json();
    buildNavTree();
    restoreTabs();
    renderBookmarks();
    renderRecent();
    loadSessionNotes();
    renderConditions();
  }

  function buildNavTree() {
    const tree = {};
    state.pages.forEach((p) => {
      const top = p.breadcrumbs[0] || 'General';
      tree[top] = tree[top] || [];
      tree[top].push(p);
    });
    const navList = document.createElement('ul');
    Object.entries(tree).forEach(([section, items]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${section}</strong>`;
      const ul = document.createElement('ul');
      items.slice(0, 30).forEach((p) => {
        const cli = document.createElement('li');
        cli.innerHTML = `<a href="#" data-link="${p.id}">${p.title}</a>`;
        ul.appendChild(cli);
      });
      li.appendChild(ul);
      navList.appendChild(li);
    });
    elements.navTree.innerHTML = '';
    elements.navTree.appendChild(navList);
  }

  function searchPages(query, filterTag, fuzzy) {
    const q = query.toLowerCase();
    const f = filterTag.toLowerCase();
    const score = (text) => {
      if (!fuzzy) return text.includes(q) ? text.length - q.length : Infinity;
      // simple fuzzy: count mismatches
      let i = 0, j = 0, dist = 0;
      while (i < q.length && j < text.length) {
        if (q[i] === text[j]) { i++; j++; }
        else { dist++; j++; }
      }
      dist += (q.length - i);
      return dist;
    };
    const matches = state.pages
      .filter((p) => !f || p.tags.includes(f))
      .map((p) => ({
        page: p,
        val: Math.min(score(p.title.toLowerCase()), score(p.summary.toLowerCase()))
      }))
      .filter((m) => m.val < Infinity)
      .sort((a, b) => a.val - b.val)
      .slice(0, 25);
    const list = document.createElement('ul');
    matches.forEach((m) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-link="${m.page.id}">${m.page.title}</a>`;
      list.appendChild(li);
    });
    elements.navTree.innerHTML = '';
    elements.navTree.appendChild(list);
  }

  function setActiveTab(id, secondary = false) {
    const target = state.pages.find((p) => p.id === id);
    if (!target) return;
    if (secondary) {
      state.secondary = id;
      renderPage(target, elements.secondaryView, true);
      elements.secondaryView.classList.add('active');
    } else {
      state.active = id;
      openTab(target);
      renderPage(target, elements.pageContent);
      updateBreadcrumbs(target);
      addRecent(target.id);
    }
    renderTabs();
    renderBookmarks();
  }

  function openTab(page) {
    if (!state.tabs.includes(page.id)) {
      state.tabs.push(page.id);
    }
    persistTabs();
  }

  function renderTabs() {
    elements.tabbar.innerHTML = '';
    state.tabs.forEach((id) => {
      const page = state.pages.find((p) => p.id === id);
      const tab = document.createElement('div');
      tab.className = 'tab' + (state.active === id ? ' active' : '');
      tab.innerHTML = `<span data-link="${id}">${page ? page.title : id}</span> <button data-close="${id}">×</button>`;
      elements.tabbar.appendChild(tab);
    });
  }

  function renderPage(page, target, inSplit = false) {
    const edits = state.edits[page.id];
    const latest = edits?.versions?.at(-1)?.content;
    const body = latest || page.body;
    const html = linkify(body);
    target.innerHTML = `<h1>${page.title}</h1>${html}`;
    if (!inSplit) {
      renderRelated(page);
      elements.bookmarkToggle.textContent = state.bookmarks.has(page.id) ? 'Bookmarked' : 'Bookmark';
    }
  }

  function renderRelated(page) {
    const related = state.pages.filter((p) => p.category === page.category && p.id !== page.id).slice(0, 8);
    elements.related.innerHTML = '<h3>Related</h3><ul>' + related.map(r => `<li><a href="#" data-link="${r.id}">${r.title}</a></li>`).join('') + '</ul>';
  }

  function updateBreadcrumbs(page) {
    elements.breadcrumbs.textContent = page.breadcrumbs.join(' / ');
  }

  function persistTabs() {
    localStorage.setItem('tabs', JSON.stringify({ tabs: state.tabs, active: state.active }));
  }

  function restoreTabs() {
    const saved = JSON.parse(localStorage.getItem('tabs') || '{}');
    if (saved.tabs) state.tabs = saved.tabs;
    if (saved.active) state.active = saved.active;
    renderTabs();
    if (state.active) setActiveTab(state.active);
  }

  function renderBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify([...state.bookmarks]));
    elements.bookmarks.innerHTML = '';
    state.bookmarks.forEach((id) => {
      const p = state.pages.find((pg) => pg.id === id);
      if (!p) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-link="${id}">${p.title}</a>`;
      elements.bookmarks.appendChild(li);
    });
  }

  function addRecent(id) {
    state.recent = [id, ...state.recent.filter((r) => r !== id)].slice(0, 15);
    localStorage.setItem('recent', JSON.stringify(state.recent));
    renderRecent();
  }

  function renderRecent() {
    elements.recent.innerHTML = '';
    state.recent.forEach((id) => {
      const p = state.pages.find((pg) => pg.id === id);
      if (!p) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-link="${id}">${p.title}</a>`;
      elements.recent.appendChild(li);
    });
  }

  function toggleBookmark() {
    if (!state.active) return;
    if (state.bookmarks.has(state.active)) state.bookmarks.delete(state.active);
    else state.bookmarks.add(state.active);
    renderBookmarks();
    elements.bookmarkToggle.textContent = state.bookmarks.has(state.active) ? 'Bookmarked' : 'Bookmark';
  }

  function toggleEdit() {
    if (!state.active) return;
    elements.editor.classList.toggle('active');
    const page = state.pages.find((p) => p.id === state.active);
    const edits = state.edits[page.id];
    const latest = edits?.versions?.at(-1);
    const body = latest?.content || page.body;
    elements.markdownArea.value = bodyToMarkdown(body);
    elements.richArea.innerHTML = body;
    renderHistory(page.id);
  }

  function saveEdit() {
    if (!state.active) return;
    const pageId = state.active;
    const mode = elements.richArea.style.display === 'none' ? 'markdown' : 'rich';
    const content = mode === 'markdown' ? markdownToHtml(elements.markdownArea.value) : elements.richArea.innerHTML;
    const record = { timestamp: new Date().toISOString(), content, mode };
    if (!state.edits[pageId]) state.edits[pageId] = { versions: [] };
    state.edits[pageId].versions.push(record);
    localStorage.setItem('edits', JSON.stringify(state.edits));
    renderHistory(pageId);
    setActiveTab(pageId);
  }

  function renderHistory(id) {
    const versions = state.edits[id]?.versions || [];
    elements.history.innerHTML = versions.map((v, i) => `<div><button data-restore="${i}">Restore</button> ${new Date(v.timestamp).toLocaleString()}</div>`).join('');
  }

  function restoreVersion(pageId, index) {
    const v = state.edits[pageId]?.versions?.[index];
    if (!v) return;
    state.edits[pageId].versions.push({ ...v, timestamp: new Date().toISOString(), restored: true });
    localStorage.setItem('edits', JSON.stringify(state.edits));
    setActiveTab(pageId);
  }

  function exportEdits() {
    const blob = new Blob([JSON.stringify(state.edits, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'wiki-edits.json');
  }

  function importEdits(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state.edits = JSON.parse(reader.result);
        localStorage.setItem('edits', JSON.stringify(state.edits));
      } catch (e) {
        alert('Invalid edits file');
      }
    };
    reader.readAsText(file);
  }

  function exportPage() {
    if (!state.active) return;
    const page = state.pages.find((p) => p.id === state.active);
    const content = state.edits[page.id]?.versions?.at(-1)?.content || page.body;
    const blob = new Blob([content], { type: 'text/html' });
    downloadBlob(blob, `${page.id}.html`);
  }

  function importPage(file) {
    const reader = new FileReader();
    reader.onload = () => {
      elements.richArea.innerHTML = reader.result;
      elements.markdownArea.value = bodyToMarkdown(reader.result);
    };
    reader.readAsText(file);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function bodyToMarkdown(html) {
    return html.replace(/<[^>]+>/g, '').trim();
  }

  function markdownToHtml(md) {
    return md
      .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
      .replace(/^\*\s(.+)$/gm, '<li>$1</li>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n{2,}/g, '<br/><br/>');
  }

  function linkify(html) {
    let output = html;
    state.pages.slice(0, 300).forEach((p) => {
      const re = new RegExp(`(\\b${p.title.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b)`, 'g');
      output = output.replace(re, `<a href='#' data-link='${p.id}'>$1</a>`);
    });
    return output;
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  function restoreTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  function setFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
  }

  function restoreFontSize() {
    const size = localStorage.getItem('fontSize');
    if (size) {
      elements.fontSize.value = size;
      setFontSize(size);
    }
  }

  function loadSessionNotes() {
    elements.sessionNotes.value = localStorage.getItem('sessionNotes') || '';
  }

  function saveSessionNotes() {
    localStorage.setItem('sessionNotes', elements.sessionNotes.value);
  }

  function roll(expression) {
    const match = expression.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) return 'Invalid';
    const [, count, size, mod] = match;
    let total = 0;
    const rolls = [];
    for (let i = 0; i < Number(count); i++) {
      const r = 1 + Math.floor(Math.random() * Number(size));
      rolls.push(r);
      total += r;
    }
    const modifier = mod ? Number(mod) : 0;
    return `${rolls.join(', ')} => ${total + modifier}`;
  }

  function addInitiative() {
    const name = elements.initName.value.trim();
    const rollVal = Number(elements.initRoll.value || 0);
    if (!name) return;
    const list = JSON.parse(localStorage.getItem('init') || '[]');
    list.push({ name, roll: rollVal });
    list.sort((a, b) => b.roll - a.roll);
    localStorage.setItem('init', JSON.stringify(list));
    renderInitiative(list);
    elements.initName.value = '';
    elements.initRoll.value = '';
  }

  function renderInitiative(list = JSON.parse(localStorage.getItem('init') || '[]')) {
    elements.initList.innerHTML = list.map((i) => `<li>${i.name}: ${i.roll}</li>`).join('');
  }

  const conditionData = [
    { name: 'Blinded', effect: 'Auto-fail sight checks, attack disadvantage.' },
    { name: 'Charmed', effect: 'Cannot target charmer; advantage on social.' },
    { name: 'Deafened', effect: 'Auto-fail hearing checks.' },
    { name: 'Frightened', effect: 'Disadvantage while source in sight; cannot move closer.' },
    { name: 'Grappled', effect: 'Speed 0; ends on escape.' },
  ];

  function renderConditions() {
    elements.conditions.innerHTML = conditionData.map((c) => `<li><strong>${c.name}</strong>: ${c.effect}</li>`).join('');
  }

  function renderStatBlock() {
    const query = elements.statQuery.value.toLowerCase();
    if (!query) { elements.statBlock.innerHTML = ''; return; }
    elements.statBlock.innerHTML = `<div class="gm-tool"><strong>${query}</strong><br/>AC 13 | HP 22 | Speed 30ft<br/>Str +1 Dex +2 Con +1 Int +0 Wis +0 Cha +2<br/>Traits: Pop-up summary for ${query} drawn from lore.</div>`;
  }

  function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); elements.searchInput.focus(); }
      if (e.ctrlKey && e.key.toLowerCase() === 'e') { e.preventDefault(); toggleEdit(); }
      if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); saveEdit(); }
      if (e.ctrlKey && e.key.toLowerCase() === 'w') { e.preventDefault(); closeTab(state.active); }
      if (e.ctrlKey && e.key === 'Tab') { e.preventDefault(); rotateTab(); }
    });
  }

  function closeTab(id) {
    state.tabs = state.tabs.filter((t) => t !== id);
    if (state.active === id) state.active = state.tabs.at(-1) || null;
    persistTabs();
    renderTabs();
    if (state.active) setActiveTab(state.active);
  }

  function rotateTab() {
    if (!state.tabs.length) return;
    const idx = state.tabs.indexOf(state.active);
    const next = state.tabs[(idx + 1) % state.tabs.length];
    setActiveTab(next);
  }

  // events
  elements.navTree.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (link) { e.preventDefault(); setActiveTab(link.dataset.link, e.metaKey); }
  });

  elements.tabbar.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    const close = e.target.dataset.close;
    if (link) setActiveTab(link.dataset.link);
    if (close) closeTab(close);
  });

  elements.searchInput.addEventListener('input', () => searchPages(elements.searchInput.value, elements.filterCategory.value, elements.fuzzyToggle.checked));
  elements.filterCategory.addEventListener('input', () => searchPages(elements.searchInput.value, elements.filterCategory.value, elements.fuzzyToggle.checked));
  elements.fuzzyToggle.addEventListener('change', () => searchPages(elements.searchInput.value, elements.filterCategory.value, elements.fuzzyToggle.checked));

  elements.splitToggle.addEventListener('click', () => {
    elements.secondaryView.classList.toggle('active');
    if (state.active) setActiveTab(state.active, true);
  });

  elements.bookmarkToggle.addEventListener('click', toggleBookmark);
  elements.editToggle.addEventListener('click', toggleEdit);
  elements.saveEdit.addEventListener('click', saveEdit);
  elements.cancelEdit.addEventListener('click', () => elements.editor.classList.remove('active'));
  elements.exportPage.addEventListener('click', exportPage);
  elements.importPageBtn.addEventListener('click', () => elements.importPage.click());
  elements.importPage.addEventListener('change', (e) => e.target.files?.[0] && importPage(e.target.files[0]));

  elements.modeToggle.addEventListener('click', toggleTheme);
  elements.fontSize.addEventListener('input', (e) => setFontSize(e.target.value));
  elements.printBtn.addEventListener('click', () => window.print());

  elements.exportEdits.addEventListener('click', exportEdits);
  elements.importEditsBtn.addEventListener('click', () => elements.importEdits.click());
  elements.importEdits.addEventListener('change', (e) => e.target.files?.[0] && importEdits(e.target.files[0]));

  elements.sessionNotes.addEventListener('input', saveSessionNotes);

  elements.rollDice.addEventListener('click', () => { elements.diceResult.textContent = roll(elements.diceExpr.value); });
  elements.addInit.addEventListener('click', addInitiative);
  elements.statQuery.addEventListener('input', renderStatBlock);
  elements.openHistory.addEventListener('click', () => { if (state.active) renderHistory(state.active); elements.editor.classList.add('active'); });

  elements.history.addEventListener('click', (e) => {
    if (e.target.dataset.restore) {
      restoreVersion(state.active, Number(e.target.dataset.restore));
    }
  });

  document.querySelectorAll('.editor-tabs button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.editor-tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      if (mode === 'markdown') {
        elements.markdownArea.style.display = 'block';
        elements.richArea.style.display = 'none';
      } else {
        elements.markdownArea.style.display = 'none';
        elements.richArea.style.display = 'block';
      }
    });
  });

  elements.editor.querySelector('[data-mode="markdown"]').click();

  elements.tabbar.addEventListener('dblclick', () => {
    const page = state.pages.find((p) => p.id === state.active);
    if (page) setActiveTab(page.id, true);
  });

  function initFromLocalStorage() {
    restoreTheme();
    restoreFontSize();
    renderInitiative();
  }

  initFromLocalStorage();
  setupShortcuts();
  await loadPages();
})();
