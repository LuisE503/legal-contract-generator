/* ═══════════════════════════════════════════════════════════════
   Markdown Export Module
   ═══════════════════════════════════════════════════════════════ */

const ExportMarkdown = (() => {

    function htmlToMarkdown(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;

        let md = '';

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return '';

            const tag = node.tagName.toLowerCase();
            const children = Array.from(node.childNodes).map(processNode).join('');

            switch (tag) {
                case 'h1': return `# ${children}\n\n`;
                case 'h2': return `## ${children}\n\n`;
                case 'h3': return `### ${children}\n\n`;
                case 'p': return `${children}\n\n`;
                case 'strong': case 'b': return `**${children}**`;
                case 'em': case 'i': return `*${children}*`;
                case 'u': return `_${children}_`;
                case 'span':
                    if (node.classList.contains('contract-variable')) {
                        if (node.classList.contains('empty')) return `[________]`;
                        return `**${children}**`;
                    }
                    return children;
                case 'br': return '\n';
                case 'ul': return children + '\n';
                case 'ol': return children + '\n';
                case 'li': return `- ${children}\n`;
                case 'div':
                    if (node.classList.contains('contract-preview')) return children;
                    if (node.classList.contains('signature-block')) {
                        return '\n---\n\n' + children;
                    }
                    if (node.classList.contains('signature-line')) {
                        return `\n________________________\n${children}\n`;
                    }
                    if (node.classList.contains('contract-date')) {
                        return `*${children}*\n\n`;
                    }
                    return children + '\n';
                default: return children;
            }
        }

        md = processNode(temp);

        // Clean up extra newlines
        md = md.replace(/\n{3,}/g, '\n\n');
        return md.trim();
    }

    function exportFromGenerator() {
        const html = ContractGenerator.getContractHTML();
        if (!html) return;
        const md = htmlToMarkdown(html);
        downloadFile(md, getFilename(), 'text/markdown');
        showToast(I18n.t('toast.exportMdSuccess'), 'success');
    }

    function exportFromEditor() {
        const editorEl = document.getElementById('editor-area');
        if (!editorEl) return;
        const md = htmlToMarkdown(editorEl.innerHTML);
        downloadFile(md, 'custom-contract.md', 'text/markdown');
        showToast(I18n.t('toast.exportMdSuccess'), 'success');
    }

    function getFilename() {
        const template = ContractGenerator.getCurrentTemplate();
        const name = template ? template.id.replace(/_/g, '-') : 'contract';
        const date = new Date().toISOString().split('T')[0];
        return `${name}-${date}.md`;
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return {
        exportFromGenerator,
        exportFromEditor,
        htmlToMarkdown
    };
})();
