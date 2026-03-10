/* ═══════════════════════════════════════════════════════════════
   Custom Contract Editor
   Rich-text editor with toolbar, clause library, auto-save
   ═══════════════════════════════════════════════════════════════ */

const ContractEditor = (() => {
    const STORAGE_KEY = 'lcg_editor_content';
    let autoSaveTimer = null;

    // Clause library organized by category
    const CLAUSE_LIBRARY = {
        general: ['entire_agreement', 'amendments', 'severability', 'governing_law', 'notice_requirements'],
        confidentiality: ['confidentiality_obligation', 'return_of_materials'],
        payment: ['late_payment'],
        termination: ['early_termination', 'force_majeure'],
        liability: ['indemnification', 'limitation_of_liability', 'warranty_disclaimer'],
        intellectual_property: ['intellectual_property', 'ip_ownership', 'non_compete', 'non_solicitation']
    };

    function init() {
        setupToolbar();
        setupClauseLibrary();
        loadSavedContent();
        setupAutoSave();
        setupWordCount();
    }

    function setupToolbar() {
        const toolbar = document.getElementById('editor-toolbar');
        if (!toolbar) return;

        toolbar.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                executeAction(action);
            });
        });

        // Keyboard shortcuts
        const editor = document.getElementById('editor-area');
        if (editor) {
            editor.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch (e.key.toLowerCase()) {
                        case 'b': e.preventDefault(); executeAction('bold'); break;
                        case 'i': e.preventDefault(); executeAction('italic'); break;
                        case 'u': e.preventDefault(); executeAction('underline'); break;
                    }
                }
            });
        }
    }

    function executeAction(action) {
        const editor = document.getElementById('editor-area');
        if (!editor) return;
        editor.focus();

        switch (action) {
            case 'bold':
                document.execCommand('bold', false, null);
                break;
            case 'italic':
                document.execCommand('italic', false, null);
                break;
            case 'underline':
                document.execCommand('underline', false, null);
                break;
            case 'h1':
                document.execCommand('formatBlock', false, '<h1>');
                break;
            case 'h2':
                document.execCommand('formatBlock', false, '<h2>');
                break;
            case 'h3':
                document.execCommand('formatBlock', false, '<h3>');
                break;
            case 'ul':
                document.execCommand('insertUnorderedList', false, null);
                break;
            case 'ol':
                document.execCommand('insertOrderedList', false, null);
                break;
            case 'clause':
                insertClauseBlock();
                break;
            case 'variable':
                insertVariable();
                break;
            case 'signature':
                insertSignatureBlock();
                break;
            case 'date':
                insertDate();
                break;
            case 'clear':
                clearEditor();
                break;
        }

        triggerAutoSave();
        updateWordCount();
    }

    function insertClauseBlock() {
        const html = `<div class="clause-block"><p><strong>§ Clause Title</strong></p><p>Clause content here...</p></div><p><br></p>`;
        document.execCommand('insertHTML', false, html);
    }

    function insertVariable() {
        const name = prompt(I18n.t('editor.variablePrompt'));
        if (name) {
            const html = `<span class="contract-variable">{{${name}}}</span>&nbsp;`;
            document.execCommand('insertHTML', false, html);
        }
    }

    function insertSignatureBlock() {
        const html = `<div class="sig-block"><p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement.</p><br><p>________________________</p><p>Signature / Name / Date</p><br><p>________________________</p><p>Signature / Name / Date</p></div><p><br></p>`;
        document.execCommand('insertHTML', false, html);
    }

    function insertDate() {
        const today = new Date().toLocaleDateString(I18n.getCurrentLang(), {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        document.execCommand('insertText', false, today);
    }

    function clearEditor() {
        if (confirm(I18n.t('editor.clearConfirm'))) {
            const editor = document.getElementById('editor-area');
            if (editor) {
                editor.innerHTML = '';
                localStorage.removeItem(STORAGE_KEY);
                showToast(I18n.t('toast.editorCleared'), 'success');
                updateWordCount();
            }
        }
    }

    function setupClauseLibrary() {
        const container = document.getElementById('clause-categories');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(CLAUSE_LIBRARY).forEach(([category, clauseIds]) => {
            const catDiv = document.createElement('div');
            catDiv.className = 'clause-category';

            const title = document.createElement('div');
            title.className = 'clause-category-title';
            title.textContent = I18n.t(`editor.clauseCategories.${category}`);
            catDiv.appendChild(title);

            clauseIds.forEach(clauseId => {
                const btn = document.createElement('button');
                btn.className = 'clause-insert-btn';
                btn.textContent = I18n.t(`clauses.${clauseId}.name`);
                btn.title = I18n.t(`clauses.${clauseId}.desc`);
                btn.addEventListener('click', () => insertLibraryClause(clauseId));
                catDiv.appendChild(btn);
            });

            container.appendChild(catDiv);
        });
    }

    function insertLibraryClause(clauseId) {
        const editor = document.getElementById('editor-area');
        if (!editor) return;

        const name = I18n.t(`clauses.${clauseId}.name`);
        const desc = I18n.t(`clauses.${clauseId}.desc`);

        const html = `<div class="clause-block"><p><strong>§ ${name}</strong></p><p>${desc}</p></div><p><br></p>`;

        editor.focus();
        // Insert at end if no selection
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) {
            editor.innerHTML += html;
        } else {
            document.execCommand('insertHTML', false, html);
        }

        triggerAutoSave();
        updateWordCount();
    }

    function loadSavedContent() {
        const editor = document.getElementById('editor-area');
        if (!editor) return;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            editor.innerHTML = saved;
            updateWordCount();
        }
    }

    function setupAutoSave() {
        const editor = document.getElementById('editor-area');
        if (!editor) return;

        editor.addEventListener('input', () => {
            triggerAutoSave();
            updateWordCount();
        });
    }

    function triggerAutoSave() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            const editor = document.getElementById('editor-area');
            if (editor) {
                localStorage.setItem(STORAGE_KEY, editor.innerHTML);
                const statusEl = document.getElementById('editor-autosave');
                if (statusEl) {
                    statusEl.textContent = I18n.t('editor.autoSaved');
                    statusEl.style.opacity = '1';
                    setTimeout(() => { statusEl.style.opacity = '0.6'; }, 2000);
                }
            }
        }, 1000);
    }

    function setupWordCount() {
        updateWordCount();
    }

    function updateWordCount() {
        const editor = document.getElementById('editor-area');
        const counter = document.getElementById('editor-wordcount');
        if (!editor || !counter) return;

        const text = editor.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        counter.textContent = `${words} words`;
    }

    return { init, setupClauseLibrary };
})();
