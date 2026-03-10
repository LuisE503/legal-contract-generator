/* ═══════════════════════════════════════════════════════════════
   Contract Generator Engine
   Handles form generation, validation, and live preview
   ═══════════════════════════════════════════════════════════════ */

const ContractGenerator = (() => {
    let currentTemplate = null;
    let currentValues = {};
    let selectedClauses = [];

    function loadTemplate(templateId) {
        currentTemplate = ContractTemplates.getTemplate(templateId);
        if (!currentTemplate) return;

        currentValues = {};
        selectedClauses = [];

        renderTemplateInfo();
        renderForm();
        renderOptionalClauses();
        renderLegalChecklist();
        updatePreview();
    }

    function renderTemplateInfo() {
        const nameEl = document.getElementById('template-name');
        const descEl = document.getElementById('template-description');
        if (nameEl) nameEl.textContent = I18n.t(`templates.${currentTemplate.id}.name`);
        if (descEl) descEl.textContent = I18n.t(`templates.${currentTemplate.id}.description`);
    }

    function renderForm() {
        const form = document.getElementById('generator-form');
        if (!form) return;

        form.innerHTML = '';

        currentTemplate.fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';

            const label = document.createElement('label');
            label.className = 'form-label';
            label.setAttribute('for', `field-${field.id}`);
            label.textContent = I18n.t(`fields.${field.id}`);
            if (field.required) {
                const req = document.createElement('span');
                req.className = 'required';
                req.textContent = '*';
                label.appendChild(req);
            }

            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'form-textarea';
                input.rows = 3;
            } else if (field.type === 'date') {
                input = document.createElement('input');
                input.type = 'date';
                input.className = 'form-input';
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-input';
            }

            input.id = `field-${field.id}`;
            input.name = field.id;
            if (field.placeholder) input.placeholder = field.placeholder;
            if (field.required) input.required = true;

            // Live update on input
            input.addEventListener('input', () => {
                currentValues[field.id] = input.value;
                clearError(group);
                updatePreview();
            });

            const error = document.createElement('span');
            error.className = 'form-error';
            error.textContent = I18n.t('generator.fieldRequired');

            group.appendChild(label);
            group.appendChild(input);
            group.appendChild(error);
            form.appendChild(group);
        });
    }

    function renderOptionalClauses() {
        const container = document.getElementById('clauses-list');
        if (!container) return;

        container.innerHTML = '';

        currentTemplate.optionalClauses.forEach(clauseId => {
            const clauseName = I18n.t(`clauses.${clauseId}.name`);
            const clauseDesc = I18n.t(`clauses.${clauseId}.desc`);

            const toggle = document.createElement('div');
            toggle.className = 'clause-toggle';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `clause-${clauseId}`;
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    selectedClauses.push(clauseId);
                } else {
                    selectedClauses = selectedClauses.filter(c => c !== clauseId);
                }
                updatePreview();
            });

            const label = document.createElement('label');
            label.className = 'clause-label';
            label.setAttribute('for', `clause-${clauseId}`);
            label.innerHTML = `<span class="clause-name">${clauseName}</span><span class="clause-desc">${clauseDesc}</span>`;

            toggle.appendChild(checkbox);
            toggle.appendChild(label);
            container.appendChild(toggle);
        });
    }

    function renderLegalChecklist() {
        const container = document.getElementById('checklist-items');
        if (!container) return;

        container.innerHTML = '';

        currentTemplate.checklist.forEach(itemId => {
            const item = document.createElement('div');
            item.className = 'checklist-item';
            item.textContent = I18n.t(`checklist.${itemId}`);
            item.addEventListener('click', () => {
                item.classList.toggle('checked');
            });
            container.appendChild(item);
        });
    }

    function updatePreview() {
        const previewEl = document.getElementById('preview-content');
        if (!previewEl || !currentTemplate) return;

        const hasAnyValue = Object.values(currentValues).some(v => v && v.trim());

        if (!hasAnyValue) {
            previewEl.innerHTML = `<div class="preview-placeholder">${I18n.t('generator.previewPlaceholder')}</div>`;
            return;
        }

        const content = currentTemplate.generateContent(
            currentValues,
            selectedClauses,
            I18n.t.bind(I18n)
        );

        previewEl.innerHTML = `<div class="contract-preview">${content}</div>`;
    }

    function validateForm() {
        let isValid = true;
        const form = document.getElementById('generator-form');
        if (!form) return false;

        currentTemplate.fields.forEach(field => {
            if (field.required) {
                const input = document.getElementById(`field-${field.id}`);
                const group = input?.closest('.form-group');
                if (!input?.value?.trim()) {
                    isValid = false;
                    if (group) {
                        group.classList.add('has-error');
                        input.classList.add('error');
                    }
                }
            }
        });

        return isValid;
    }

    function clearError(group) {
        group.classList.remove('has-error');
        const input = group.querySelector('.form-input, .form-textarea');
        if (input) input.classList.remove('error');
    }

    function getContractHTML() {
        if (!currentTemplate) return '';
        return currentTemplate.generateContent(
            currentValues,
            selectedClauses,
            I18n.t.bind(I18n)
        );
    }

    function getCurrentTemplate() {
        return currentTemplate;
    }

    return {
        loadTemplate,
        updatePreview,
        validateForm,
        getContractHTML,
        getCurrentTemplate,
        renderTemplateInfo,
        renderForm,
        renderOptionalClauses,
        renderLegalChecklist
    };
})();
