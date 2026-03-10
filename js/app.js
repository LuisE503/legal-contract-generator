/* ═══════════════════════════════════════════════════════════════
   App — Main Application Controller
   Routing, template rendering, event binding, and initialization
   ═══════════════════════════════════════════════════════════════ */

// ── Toast Notification System ──
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ── Main Application ──
const App = (() => {
    let currentView = 'home';

    function init() {
        // Initialize i18n first, then set up everything else once translations load
        I18n.init().then(() => {
            setupRouting();
            setupNavigation();
            setupMobileMenu();
            renderTemplateCards();
            bindExportButtons();
            ContractEditor.init();
            handleInitialRoute();

            // Re-render on language change
            window.addEventListener('languageChanged', () => {
                renderTemplateCards();
                ContractEditor.setupClauseLibrary();
                // Re-render generator if active
                if (currentView === 'generator' && ContractGenerator.getCurrentTemplate()) {
                    ContractGenerator.renderTemplateInfo();
                    ContractGenerator.renderForm();
                    ContractGenerator.renderOptionalClauses();
                    ContractGenerator.renderLegalChecklist();
                }
            });
        });
    }

    // ── Routing ──
    function setupRouting() {
        window.addEventListener('hashchange', () => {
            handleRoute(window.location.hash);
        });
    }

    function handleInitialRoute() {
        const hash = window.location.hash || '#home';
        handleRoute(hash);
    }

    function handleRoute(hash) {
        // Parse hash: #view or #generator/template-id
        const parts = hash.replace('#', '').split('/');
        const view = parts[0] || 'home';
        const param = parts[1];

        if (view === 'generator' && param) {
            showView('generator');
            ContractGenerator.loadTemplate(param);
        } else if (['home', 'templates', 'editor'].includes(view)) {
            showView(view);
        } else {
            showView('home');
        }
    }

    function showView(viewName) {
        currentView = viewName;

        // Update view visibility
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const viewEl = document.getElementById(`view-${viewName}`);
        if (viewEl) viewEl.classList.add('active');

        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkView = link.dataset.view;
            link.classList.toggle('active', linkView === viewName);
        });

        // Close mobile menu
        document.querySelector('.main-nav')?.classList.remove('open');
        document.getElementById('mobile-menu-btn')?.classList.remove('active');

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // ── Navigation ──
    function setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.location.hash = href;
            });
        });

        // Logo click => home
        document.getElementById('logo-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#home';
        });

        // Back to templates button
        document.getElementById('back-to-templates')?.addEventListener('click', () => {
            window.location.hash = '#templates';
        });
    }

    // ── Mobile Menu ──
    function setupMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const nav = document.querySelector('.main-nav');

        btn?.addEventListener('click', () => {
            btn.classList.toggle('active');
            nav?.classList.toggle('open');
        });
    }

    // ── Template Cards ──
    function renderTemplateCards() {
        const grid = document.getElementById('templates-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const templates = ContractTemplates.getAllTemplates();

        templates.forEach(template => {
            const card = createTemplateCard(template);
            grid.appendChild(card);
        });

        // Setup filter buttons
        setupTemplateFilters();
    }

    function createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.dataset.category = template.category;
        card.id = `template-card-${template.id}`;

        const name = I18n.t(`templates.${template.id}.name`);
        const desc = I18n.t(`templates.${template.id}.description`);
        let tagsData = I18n.t(`templates.${template.id}.tags`);

        // Compute tags safely
        let tags = [];
        if (Array.isArray(tagsData)) {
            tags = tagsData;
        } else if (typeof tagsData === 'string' && tagsData !== `templates.${template.id}.tags`) {
            tags = [tagsData];
        }

        card.innerHTML = `
            <div class="template-card-icon">${template.icon}</div>
            <h3 class="template-card-title">${name}</h3>
            <p class="template-card-desc">${desc}</p>
            <div class="template-card-tags">
                ${tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
            </div>
            <div class="template-card-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.hash = `#generator/${template.id}`;
        });

        return card;
    }

    function setupTemplateFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                document.querySelectorAll('.template-card').forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                        card.style.animation = 'viewFadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ── Export Buttons ──
    function bindExportButtons() {
        // Generator export buttons
        document.getElementById('export-md-btn')?.addEventListener('click', () => {
            ExportMarkdown.exportFromGenerator();
        });
        document.getElementById('export-pdf-btn')?.addEventListener('click', () => {
            ExportPDF.exportFromGenerator();
        });

        // Editor export buttons
        document.getElementById('editor-export-md')?.addEventListener('click', () => {
            ExportMarkdown.exportFromEditor();
        });
        document.getElementById('editor-export-pdf')?.addEventListener('click', () => {
            ExportPDF.exportFromEditor();
        });
    }

    return { init };
})();

// ── Start the application ──
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
