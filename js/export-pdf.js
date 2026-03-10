/* ═══════════════════════════════════════════════════════════════
   PDF Export Module (using html2pdf.js)
   ═══════════════════════════════════════════════════════════════ */

const ExportPDF = (() => {

    function exportFromGenerator() {
        const html = ContractGenerator.getContractHTML();
        if (!html) return;
        const template = ContractGenerator.getCurrentTemplate();
        const name = template ? template.id.replace(/_/g, '-') : 'contract';
        const date = new Date().toISOString().split('T')[0];
        generatePDF(html, `${name}-${date}.pdf`);
    }

    function exportFromEditor() {
        const editorEl = document.getElementById('editor-area');
        if (!editorEl) return;
        generatePDF(editorEl.innerHTML, `custom-contract-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    function generatePDF(html, filename) {
        // Create a temporary container with PDF-optimized styles
        const container = document.createElement('div');
        container.className = 'pdf-export-content';
        container.innerHTML = html;
        document.body.appendChild(container);

        const opt = {
            margin: [15, 15, 20, 15],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Check if html2pdf is loaded
        if (typeof html2pdf === 'undefined') {
            showToast('PDF library not loaded. Please check your internet connection.', 'error');
            document.body.removeChild(container);
            return;
        }

        html2pdf()
            .set(opt)
            .from(container)
            .save()
            .then(() => {
                document.body.removeChild(container);
                showToast(I18n.t('toast.exportPdfSuccess'), 'success');
            })
            .catch(err => {
                console.error('PDF generation error:', err);
                document.body.removeChild(container);
                showToast('Error generating PDF', 'error');
            });
    }

    return {
        exportFromGenerator,
        exportFromEditor
    };
})();
