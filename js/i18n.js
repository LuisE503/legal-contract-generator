/* ═══════════════════════════════════════════════════════════════
   i18n — Internationalization Engine
   Supports: en, es, fr, pt, zh, ja
   ═══════════════════════════════════════════════════════════════ */

const I18n = (() => {
    const SUPPORTED_LANGS = ['en', 'es', 'fr', 'pt', 'zh', 'ja'];
    const DEFAULT_LANG = 'en';
    const STORAGE_KEY = 'lcg_language';

    const FLAGS = {
        en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷',
        pt: '🇧🇷', zh: '🇨🇳', ja: '🇯🇵'
    };

    const LANG_NAMES = {
        en: 'English', es: 'Español', fr: 'Français',
        pt: 'Português', zh: '中文', ja: '日本語'
    };

    let currentLang = DEFAULT_LANG;
    let translations = {};
    let loadedLangs = {};

    // Detect language from URL param, localStorage, or browser
    function detectLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

        const browserLang = navigator.language?.split('-')[0];
        if (browserLang && SUPPORTED_LANGS.includes(browserLang)) return browserLang;

        return DEFAULT_LANG;
    }

    // Load a language file
    async function loadLanguage(lang) {
        if (loadedLangs[lang]) {
            translations = loadedLangs[lang];
            return;
        }
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            loadedLangs[lang] = await response.json();
            translations = loadedLangs[lang];
        } catch (err) {
            console.warn(`Failed to load language: ${lang}`, err);
            if (lang !== DEFAULT_LANG) {
                await loadLanguage(DEFAULT_LANG);
            }
        }
    }

    // Get a translation by dot-notation key
    function t(key, replacements = {}) {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }
        if (typeof value !== 'string') return key;

        // Replace {{variable}} placeholders
        return value.replace(/\{\{(\w+)\}\}/g, (_, name) => {
            return replacements[name] !== undefined ? replacements[name] : `{{${name}}}`;
        });
    }

    // Apply translations to all elements with data-i18n
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = t(key);
            if (translated !== key) {
                el.textContent = translated;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translated = t(key);
            if (translated !== key) {
                el.placeholder = translated;
            }
        });

        // Update title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translated = t(key);
            if (translated !== key) {
                el.title = translated;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = currentLang;

        // Update page title
        const pageTitle = t('meta.title');
        if (pageTitle !== 'meta.title') {
            document.title = pageTitle;
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const descText = t('meta.description');
        if (metaDesc && descText !== 'meta.description') {
            metaDesc.content = descText;
        }

        // Update language switcher display
        updateLangSwitcher();
    }

    // Update the language switcher UI
    function updateLangSwitcher() {
        const flagEl = document.getElementById('lang-flag');
        const codeEl = document.getElementById('lang-code');
        if (flagEl) flagEl.textContent = FLAGS[currentLang] || '🌐';
        if (codeEl) codeEl.textContent = currentLang.toUpperCase();

        // Mark active option
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    // Set language
    async function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        await loadLanguage(lang);
        applyTranslations();

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    // Initialize
    async function init() {
        currentLang = detectLanguage();
        await loadLanguage(currentLang);
        applyTranslations();
        setupLanguageSwitcher();
    }

    // Setup language switcher
    function setupLanguageSwitcher() {
        const switcher = document.getElementById('lang-switcher');
        const btn = document.getElementById('lang-btn');
        const dropdown = document.getElementById('lang-dropdown');

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                switcher.classList.toggle('open');
            });
        }

        if (dropdown) {
            dropdown.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', () => {
                    const lang = option.dataset.lang;
                    setLanguage(lang);
                    switcher.classList.remove('open');
                });
            });
        }

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            switcher?.classList.remove('open');
        });
    }

    return {
        init,
        t,
        setLanguage,
        getCurrentLang: () => currentLang,
        applyTranslations,
        SUPPORTED_LANGS,
        FLAGS,
        LANG_NAMES
    };
})();
