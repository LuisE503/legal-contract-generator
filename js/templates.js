/* ═══════════════════════════════════════════════════════════════
   Contract Templates — 10 Professional Templates
   Each template includes: fields, optional clauses, checklist,
   and a content generator function
   ═══════════════════════════════════════════════════════════════ */

const ContractTemplates = (() => {

    const TEMPLATES = {
        nda_mutual: {
            id: 'nda_mutual',
            icon: '🤝',
            category: 'nda',
            fields: [
                { id: 'party1_name', type: 'text', required: true },
                { id: 'party2_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'duration', type: 'text', required: true, placeholder: 'e.g., 2 years' },
                { id: 'jurisdiction', type: 'text', required: true },
                { id: 'confidential_scope', type: 'textarea', required: false, placeholder: 'e.g., business plans, financial data, trade secrets...' }
            ],
            optionalClauses: ['non_compete', 'non_solicitation', 'return_of_materials', 'dispute_resolution'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.nda_mutual.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.party1_name, t('fields.party1_name'))}</strong> ${t('contractContent.and')} <strong>${v(vars.party2_name, t('fields.party2_name'))}</strong></p>`;
                content += `<p>${t('contractContent.recitals')}</p>`;
                content += `<p>${t('contractContent.now_therefore')}</p>`;
                content += `<h2>1. ${t('clauses.confidentiality_obligation.name')}</h2>`;
                content += `<p>Both parties agree to hold in confidence and not disclose to any third party any Confidential Information received from the other party. Confidential Information includes${vars.confidential_scope ? ': ' + v(vars.confidential_scope) : ' all proprietary information, trade secrets, business plans, financial data, technical specifications, and any other information designated as confidential'}.</p>`;
                content += `<h2>2. ${t('fields.duration')}</h2>`;
                content += `<p>This Agreement shall remain in effect for a period of ${v(vars.duration, t('fields.duration'))} from the Effective Date. The confidentiality obligations shall survive termination for an additional period of two (2) years.</p>`;
                content += `<h2>3. Permitted Disclosures</h2>`;
                content += `<p>Confidential Information may be disclosed if: (a) it becomes publicly available through no fault of the receiving party; (b) it was known prior to disclosure; (c) it is independently developed; or (d) disclosure is required by law or court order.</p>`;
                if (clauses.includes('non_compete')) {
                    content += `<h2>4. ${t('clauses.non_compete.name')}</h2>`;
                    content += `<p>${t('clauses.non_compete.desc')} Neither party shall engage in any business that directly competes with the other party during the term of this Agreement and for a period of one (1) year following termination.</p>`;
                }
                if (clauses.includes('non_solicitation')) {
                    content += `<h2>${clauses.includes('non_compete') ? '5' : '4'}. ${t('clauses.non_solicitation.name')}</h2>`;
                    content += `<p>${t('clauses.non_solicitation.desc')} Neither party shall, directly or indirectly, solicit, recruit, or hire any employee, contractor, or consultant of the other party during the term oand for twelve (12) months following termination.</p>`;
                }
                if (clauses.includes('return_of_materials')) {
                    content += `<h2>${t('clauses.return_of_materials.name')}</h2>`;
                    content += `<p>${t('clauses.return_of_materials.desc')} Upon termination or expiration of this Agreement, each party shall promptly return or destroy all copies of Confidential Information in its possession.</p>`;
                }
                if (clauses.includes('dispute_resolution')) {
                    content += `<h2>${t('clauses.dispute_resolution.name')}</h2>`;
                    content += `<p>${t('clauses.dispute_resolution.desc')} Any dispute arising under this Agreement shall first be submitted to mediation. If mediation fails, the dispute shall be resolved by binding arbitration in ${v(vars.jurisdiction, t('fields.jurisdiction'))}.</p>`;
                }
                content += `<h2>${t('fields.jurisdiction')}</h2>`;
                content += `<p>This Agreement shall be governed by and construed in accordance with the laws of ${v(vars.jurisdiction, t('fields.jurisdiction'))}.</p>`;
                content += generateSignatureBlock(vars.party1_name, vars.party2_name, t);
                return content;
            }
        },

        nda_unilateral: {
            id: 'nda_unilateral',
            icon: '🔒',
            category: 'nda',
            fields: [
                { id: 'discloser_name', type: 'text', required: true },
                { id: 'receiver_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'duration', type: 'text', required: true, placeholder: 'e.g., 3 years' },
                { id: 'jurisdiction', type: 'text', required: true },
                { id: 'confidential_scope', type: 'textarea', required: false }
            ],
            optionalClauses: ['non_compete', 'return_of_materials', 'indemnification', 'governing_law'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.nda_unilateral.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.discloser_name, t('fields.discloser_name'))}</strong> ("Disclosing Party") ${t('contractContent.and')} <strong>${v(vars.receiver_name, t('fields.receiver_name'))}</strong> ("Receiving Party")</p>`;
                content += `<p>${t('contractContent.now_therefore')}</p>`;
                content += `<h2>1. ${t('clauses.confidentiality_obligation.name')}</h2>`;
                content += `<p>The Receiving Party agrees to hold in strict confidence all Confidential Information disclosed by the Disclosing Party. The Receiving Party shall not use the Confidential Information for any purpose other than evaluating or engaging in the proposed business relationship.</p>`;
                content += `<h2>2. ${t('fields.duration')}</h2>`;
                content += `<p>This Agreement shall be effective for ${v(vars.duration, t('fields.duration'))} from the Effective Date.</p>`;
                content += `<h2>3. Obligations</h2>`;
                content += `<p>The Receiving Party shall: (a) limit access to Confidential Information to those who need to know; (b) use at least the same degree of care as it uses for its own confidential information; (c) not reverse engineer, decompile, or disassemble any Confidential Information.</p>`;
                addOptionalClauses(content, clauses, vars, t);
                content += generateSignatureBlock(vars.discloser_name, vars.receiver_name, t);
                return content;
            }
        },

        freelance_services: {
            id: 'freelance_services',
            icon: '💼',
            category: 'services',
            fields: [
                { id: 'client_name', type: 'text', required: true },
                { id: 'freelancer_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'scope_of_work', type: 'textarea', required: true },
                { id: 'payment_amount', type: 'text', required: true },
                { id: 'payment_currency', type: 'text', required: true, placeholder: 'USD, EUR, etc.' },
                { id: 'payment_schedule', type: 'text', required: true, placeholder: 'e.g., 50% upfront, 50% on delivery' },
                { id: 'deadline', type: 'date', required: true },
                { id: 'revisions', type: 'text', required: false, placeholder: 'e.g., 3' },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['intellectual_property', 'non_compete', 'late_payment', 'early_termination', 'force_majeure'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.freelance_services.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.client_name, t('fields.client_name'))}</strong> ("Client") ${t('contractContent.and')} <strong>${v(vars.freelancer_name, t('fields.freelancer_name'))}</strong> ("Freelancer")</p>`;
                content += `<p>${t('contractContent.now_therefore')}</p>`;
                content += `<h2>1. Scope of Work</h2>`;
                content += `<p>${v(vars.scope_of_work, t('fields.scope_of_work'))}</p>`;
                content += `<h2>2. Payment</h2>`;
                content += `<p>The Client shall pay the Freelancer a total of ${v(vars.payment_amount, t('fields.payment_amount'))} ${v(vars.payment_currency, t('fields.payment_currency'))}. Payment schedule: ${v(vars.payment_schedule, t('fields.payment_schedule'))}.</p>`;
                content += `<h2>3. Timeline</h2>`;
                content += `<p>All deliverables shall be completed by ${v(vars.deadline, t('fields.deadline'))}.</p>`;
                if (vars.revisions) {
                    content += `<h2>4. Revisions</h2>`;
                    content += `<p>This agreement includes ${v(vars.revisions)} rounds of revisions. Additional revisions may be subject to additional charges.</p>`;
                }
                if (clauses.includes('intellectual_property')) {
                    content += `<h2>${t('clauses.intellectual_property.name')}</h2>`;
                    content += `<p>Upon full payment, all intellectual property rights in the deliverables shall be assigned to the Client. The Freelancer retains the right to display the work in their portfolio.</p>`;
                }
                if (clauses.includes('late_payment')) {
                    content += `<h2>${t('clauses.late_payment.name')}</h2>`;
                    content += `<p>Late payments shall incur a penalty of 1.5% per month on the outstanding balance. The Freelancer reserves the right to suspend work if payment is overdue by more than 15 days.</p>`;
                }
                if (clauses.includes('early_termination')) {
                    content += `<h2>${t('clauses.early_termination.name')}</h2>`;
                    content += `<p>Either party may terminate this Agreement with 14 days written notice. Upon termination, the Client shall pay for all work completed to date.</p>`;
                }
                if (clauses.includes('force_majeure')) {
                    content += `<h2>${t('clauses.force_majeure.name')}</h2>`;
                    content += `<p>${t('clauses.force_majeure.desc')}</p>`;
                }
                content += generateSignatureBlock(vars.client_name, vars.freelancer_name, t);
                return content;
            }
        },

        consulting: {
            id: 'consulting',
            icon: '📊',
            category: 'services',
            fields: [
                { id: 'consultant_name', type: 'text', required: true },
                { id: 'company_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'hourly_rate', type: 'text', required: true },
                { id: 'payment_currency', type: 'text', required: true, placeholder: 'USD, EUR, etc.' },
                { id: 'deliverables', type: 'textarea', required: true },
                { id: 'term', type: 'text', required: true, placeholder: 'e.g., 6 months' },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['intellectual_property', 'non_compete', 'non_solicitation', 'indemnification', 'early_termination'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.consulting.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.consultant_name, t('fields.consultant_name'))}</strong> ("Consultant") ${t('contractContent.and')} <strong>${v(vars.company_name, t('fields.company_name'))}</strong> ("Company")</p>`;
                content += `<p>${t('contractContent.now_therefore')}</p>`;
                content += `<h2>1. Services</h2>`;
                content += `<p>The Consultant shall provide professional consulting services to the Company. Deliverables include: ${v(vars.deliverables, t('fields.deliverables'))}.</p>`;
                content += `<h2>2. Compensation</h2>`;
                content += `<p>The Company shall compensate the Consultant at a rate of ${v(vars.hourly_rate, t('fields.hourly_rate'))} ${v(vars.payment_currency, t('fields.payment_currency'))} per hour. Invoices shall be submitted monthly and payment is due within 30 days.</p>`;
                content += `<h2>3. Term</h2>`;
                content += `<p>This Agreement shall be effective for ${v(vars.term, t('fields.term'))} from the Effective Date, unless terminated earlier.</p>`;
                content += `<h2>4. Independent Contractor</h2>`;
                content += `<p>The Consultant is an independent contractor and not an employee. The Consultant is responsible for their own taxes, insurance, and benefits.</p>`;
                if (clauses.includes('intellectual_property')) {
                    content += `<h2>${t('clauses.intellectual_property.name')}</h2>`;
                    content += `<p>All work product created during the engagement shall be the exclusive property of the Company.</p>`;
                }
                if (clauses.includes('non_compete')) {
                    content += `<h2>${t('clauses.non_compete.name')}</h2>`;
                    content += `<p>The Consultant agrees not to provide similar services to direct competitors during the term and for six (6) months after termination.</p>`;
                }
                content += generateSignatureBlock(vars.consultant_name, vars.company_name, t);
                return content;
            }
        },

        sale_of_goods: {
            id: 'sale_of_goods',
            icon: '🛒',
            category: 'commercial',
            fields: [
                { id: 'buyer_name', type: 'text', required: true },
                { id: 'seller_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'items_description', type: 'textarea', required: true },
                { id: 'total_price', type: 'text', required: true },
                { id: 'payment_currency', type: 'text', required: true, placeholder: 'USD, EUR, etc.' },
                { id: 'delivery_date', type: 'date', required: true },
                { id: 'warranty_period', type: 'text', required: false, placeholder: 'e.g., 12 months' },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['warranty_disclaimer', 'limitation_of_liability', 'force_majeure', 'dispute_resolution', 'governing_law'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.sale_of_goods.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.seller_name, t('fields.seller_name'))}</strong> ("Seller") ${t('contractContent.and')} <strong>${v(vars.buyer_name, t('fields.buyer_name'))}</strong> ("Buyer")</p>`;
                content += `<p>${t('contractContent.now_therefore')}</p>`;
                content += `<h2>1. Goods</h2>`;
                content += `<p>The Seller agrees to sell, and the Buyer agrees to purchase, the following goods: ${v(vars.items_description, t('fields.items_description'))}.</p>`;
                content += `<h2>2. Price and Payment</h2>`;
                content += `<p>The total purchase price is ${v(vars.total_price, t('fields.total_price'))} ${v(vars.payment_currency, t('fields.payment_currency'))}. Payment shall be made in full upon delivery unless otherwise agreed.</p>`;
                content += `<h2>3. Delivery</h2>`;
                content += `<p>The Seller shall deliver the goods by ${v(vars.delivery_date, t('fields.delivery_date'))}. Risk of loss passes to the Buyer upon delivery.</p>`;
                if (vars.warranty_period) {
                    content += `<h2>4. Warranty</h2>`;
                    content += `<p>The Seller warrants that the goods shall be free from defects for a period of ${v(vars.warranty_period)} from delivery.</p>`;
                }
                content += `<h2>5. Inspection and Acceptance</h2>`;
                content += `<p>The Buyer shall inspect the goods within 5 business days of delivery. Any defects must be reported in writing within this period.</p>`;
                if (clauses.includes('limitation_of_liability')) {
                    content += `<h2>${t('clauses.limitation_of_liability.name')}</h2>`;
                    content += `<p>The Seller's total liability shall not exceed the total purchase price.</p>`;
                }
                content += generateSignatureBlock(vars.seller_name, vars.buyer_name, t);
                return content;
            }
        },

        lease_rental: {
            id: 'lease_rental',
            icon: '🏠',
            category: 'commercial',
            fields: [
                { id: 'landlord_name', type: 'text', required: true },
                { id: 'tenant_name', type: 'text', required: true },
                { id: 'property_address', type: 'textarea', required: true },
                { id: 'monthly_rent', type: 'text', required: true },
                { id: 'payment_currency', type: 'text', required: true, placeholder: 'USD, EUR, etc.' },
                { id: 'start_date', type: 'date', required: true },
                { id: 'end_date', type: 'date', required: true },
                { id: 'security_deposit', type: 'text', required: true },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['early_termination', 'late_payment', 'governing_law', 'notice_requirements', 'dispute_resolution'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.lease_rental.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', { effective_date: vars.start_date || '________' })}</p>`;
                content += `<p><strong>${v(vars.landlord_name, t('fields.landlord_name'))}</strong> ("Landlord") ${t('contractContent.and')} <strong>${v(vars.tenant_name, t('fields.tenant_name'))}</strong> ("Tenant")</p>`;
                content += `<h2>1. Property</h2>`;
                content += `<p>The Landlord agrees to lease the following property: ${v(vars.property_address, t('fields.property_address'))}.</p>`;
                content += `<h2>2. Term</h2>`;
                content += `<p>The lease shall commence on ${v(vars.start_date, t('fields.start_date'))} and end on ${v(vars.end_date, t('fields.end_date'))}.</p>`;
                content += `<h2>3. Rent</h2>`;
                content += `<p>Monthly rent shall be ${v(vars.monthly_rent, t('fields.monthly_rent'))} ${v(vars.payment_currency, t('fields.payment_currency'))}, due on the first day of each month.</p>`;
                content += `<h2>4. Security Deposit</h2>`;
                content += `<p>The Tenant shall pay a security deposit of ${v(vars.security_deposit, t('fields.security_deposit'))} ${v(vars.payment_currency, t('fields.payment_currency'))} upon signing. The deposit shall be returned within 30 days of lease termination, less any deductions for damages.</p>`;
                content += `<h2>5. Maintenance</h2>`;
                content += `<p>The Tenant shall maintain the property in good condition. Major repairs are the responsibility of the Landlord.</p>`;
                if (clauses.includes('late_payment')) {
                    content += `<h2>${t('clauses.late_payment.name')}</h2>`;
                    content += `<p>A late fee of 5% shall apply to rent payments received more than 5 days after the due date.</p>`;
                }
                content += generateSignatureBlock(vars.landlord_name, vars.tenant_name, t);
                return content;
            }
        },

        partnership: {
            id: 'partnership',
            icon: '🤲',
            category: 'commercial',
            fields: [
                { id: 'partner1_name', type: 'text', required: true },
                { id: 'partner2_name', type: 'text', required: true },
                { id: 'business_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'contributions', type: 'textarea', required: true, placeholder: 'Describe each partner\'s capital contributions...' },
                { id: 'profit_split', type: 'text', required: true, placeholder: 'e.g., 50/50, 60/40' },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['non_compete', 'dispute_resolution', 'early_termination', 'governing_law', 'amendments'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.partnership.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.partner1_name, t('fields.partner1_name'))}</strong> ${t('contractContent.and')} <strong>${v(vars.partner2_name, t('fields.partner2_name'))}</strong></p>`;
                content += `<h2>1. Partnership Name</h2>`;
                content += `<p>The partnership shall operate under the name "${v(vars.business_name, t('fields.business_name'))}".</p>`;
                content += `<h2>2. Capital Contributions</h2>`;
                content += `<p>${v(vars.contributions, t('fields.contributions'))}</p>`;
                content += `<h2>3. Profit and Loss Distribution</h2>`;
                content += `<p>Profits and losses shall be divided ${v(vars.profit_split, t('fields.profit_split'))} between the partners.</p>`;
                content += `<h2>4. Management</h2>`;
                content += `<p>Both partners shall have equal rights in the management of the partnership. Major decisions require unanimous consent.</p>`;
                content += `<h2>5. Dissolution</h2>`;
                content += `<p>The partnership may be dissolved by mutual agreement or by written notice from either partner with 90 days advance notice.</p>`;
                content += generateSignatureBlock(vars.partner1_name, vars.partner2_name, t);
                return content;
            }
        },

        employment: {
            id: 'employment',
            icon: '👔',
            category: 'employment',
            fields: [
                { id: 'employer_name', type: 'text', required: true },
                { id: 'employee_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'position', type: 'text', required: true },
                { id: 'salary', type: 'text', required: true },
                { id: 'payment_currency', type: 'text', required: true, placeholder: 'USD, EUR, etc.' },
                { id: 'benefits', type: 'textarea', required: false, placeholder: 'e.g., health insurance, vacation days, retirement plan...' },
                { id: 'term', type: 'text', required: false, placeholder: 'e.g., Permanent, 1 year' },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['non_compete', 'non_solicitation', 'intellectual_property', 'confidentiality_obligation', 'early_termination'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.employment.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.employer_name, t('fields.employer_name'))}</strong> ("Employer") ${t('contractContent.and')} <strong>${v(vars.employee_name, t('fields.employee_name'))}</strong> ("Employee")</p>`;
                content += `<h2>1. Position</h2>`;
                content += `<p>The Employer hereby employs the Employee as ${v(vars.position, t('fields.position'))}. The Employee's duties shall be as reasonably assigned by the Employer.</p>`;
                content += `<h2>2. Compensation</h2>`;
                content += `<p>The Employee shall receive an annual salary of ${v(vars.salary, t('fields.salary'))} ${v(vars.payment_currency, t('fields.payment_currency'))}, payable in accordance with the Employer's standard payroll schedule.</p>`;
                if (vars.benefits) {
                    content += `<h2>3. Benefits</h2>`;
                    content += `<p>The Employee shall be entitled to the following benefits: ${v(vars.benefits)}.</p>`;
                }
                content += `<h2>${vars.benefits ? '4' : '3'}. Termination</h2>`;
                content += `<p>Either party may terminate this Agreement with 30 days written notice. The Employer may terminate immediately for cause.</p>`;
                if (clauses.includes('confidentiality_obligation')) {
                    content += `<h2>${t('clauses.confidentiality_obligation.name')}</h2>`;
                    content += `<p>The Employee agrees to maintain the confidentiality of all proprietary information during and after employment.</p>`;
                }
                if (clauses.includes('non_compete')) {
                    content += `<h2>${t('clauses.non_compete.name')}</h2>`;
                    content += `<p>For a period of one (1) year following termination, the Employee shall not engage in any competing business within the same geographic area.</p>`;
                }
                content += generateSignatureBlock(vars.employer_name, vars.employee_name, t);
                return content;
            }
        },

        loan: {
            id: 'loan',
            icon: '💰',
            category: 'commercial',
            fields: [
                { id: 'lender_name', type: 'text', required: true },
                { id: 'borrower_name', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'loan_amount', type: 'text', required: true },
                { id: 'payment_currency', type: 'text', required: true, placeholder: 'USD, EUR, etc.' },
                { id: 'interest_rate', type: 'text', required: true },
                { id: 'repayment_schedule', type: 'textarea', required: true, placeholder: 'e.g., Monthly installments of $500 for 24 months' },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['late_payment', 'early_termination', 'governing_law', 'dispute_resolution', 'notice_requirements'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'payment_terms', 'termination_conditions', 'jurisdiction_stated', 'signatures_prepared', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.loan.name')}</h1>`;
                content += `<p class="contract-date">${t('contractContent.preamble', vars)}</p>`;
                content += `<p><strong>${v(vars.lender_name, t('fields.lender_name'))}</strong> ("Lender") ${t('contractContent.and')} <strong>${v(vars.borrower_name, t('fields.borrower_name'))}</strong> ("Borrower")</p>`;
                content += `<h2>1. Loan Amount</h2>`;
                content += `<p>The Lender agrees to lend the Borrower the sum of ${v(vars.loan_amount, t('fields.loan_amount'))} ${v(vars.payment_currency, t('fields.payment_currency'))} (the "Principal").</p>`;
                content += `<h2>2. Interest</h2>`;
                content += `<p>Interest shall accrue at a rate of ${v(vars.interest_rate, t('fields.interest_rate'))}% per annum, calculated on the outstanding principal balance.</p>`;
                content += `<h2>3. Repayment</h2>`;
                content += `<p>${v(vars.repayment_schedule, t('fields.repayment_schedule'))}</p>`;
                content += `<h2>4. Prepayment</h2>`;
                content += `<p>The Borrower may prepay all or any portion of the outstanding balance without penalty at any time.</p>`;
                content += `<h2>5. Default</h2>`;
                content += `<p>The Borrower shall be in default if: (a) any payment is more than 15 days overdue; (b) the Borrower becomes insolvent; or (c) any representation proves materially false.</p>`;
                if (clauses.includes('late_payment')) {
                    content += `<h2>${t('clauses.late_payment.name')}</h2>`;
                    content += `<p>Late payments shall incur a penalty of 2% per month on the overdue amount.</p>`;
                }
                content += generateSignatureBlock(vars.lender_name, vars.borrower_name, t);
                return content;
            }
        },

        website_tos: {
            id: 'website_tos',
            icon: '🌐',
            category: 'services',
            fields: [
                { id: 'website_name', type: 'text', required: true },
                { id: 'website_url', type: 'text', required: true },
                { id: 'effective_date', type: 'date', required: true },
                { id: 'company_name', type: 'text', required: true },
                { id: 'jurisdiction', type: 'text', required: true }
            ],
            optionalClauses: ['limitation_of_liability', 'governing_law', 'dispute_resolution', 'amendments', 'severability'],
            checklist: ['parties_identified', 'dates_specified', 'obligations_clear', 'jurisdiction_stated', 'review_attorney'],
            generateContent: (vars, clauses, t) => {
                let content = `<h1>${t('templates.website_tos.name')}</h1>`;
                content += `<p class="contract-date">${v(vars.website_name, t('fields.website_name'))} — ${v(vars.website_url, t('fields.website_url'))}</p>`;
                content += `<p class="contract-date">Effective: ${v(vars.effective_date, t('fields.effective_date'))}</p>`;
                content += `<h2>1. Acceptance of Terms</h2>`;
                content += `<p>By accessing or using ${v(vars.website_name, t('fields.website_name'))} ("Website"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Website.</p>`;
                content += `<h2>2. Use of Services</h2>`;
                content += `<p>You agree to use the Website only for lawful purposes and in compliance with all applicable laws. You shall not: (a) use the Website to transmit harmful or unlawful content; (b) attempt to gain unauthorized access; (c) interfere with the Website's operation.</p>`;
                content += `<h2>3. Intellectual Property</h2>`;
                content += `<p>All content on the Website is the property of ${v(vars.company_name, t('fields.company_name'))} or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent.</p>`;
                content += `<h2>4. User Content</h2>`;
                content += `<p>By submitting content to the Website, you grant ${v(vars.company_name, t('fields.company_name'))} a non-exclusive, royalty-free license to use, display, and distribute such content.</p>`;
                content += `<h2>5. Privacy</h2>`;
                content += `<p>Your use of the Website is also governed by our Privacy Policy, which is incorporated by reference.</p>`;
                content += `<h2>6. Disclaimers</h2>`;
                content += `<p>The Website is provided "as is" without warranties of any kind. ${v(vars.company_name, t('fields.company_name'))} does not guarantee uninterrupted or error-free operation.</p>`;
                if (clauses.includes('limitation_of_liability')) {
                    content += `<h2>${t('clauses.limitation_of_liability.name')}</h2>`;
                    content += `<p>${v(vars.company_name, t('fields.company_name'))} shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Website.</p>`;
                }
                content += `<h2>Contact</h2>`;
                content += `<p>For questions about these Terms, contact ${v(vars.company_name, t('fields.company_name'))} at ${v(vars.website_url, t('fields.website_url'))}.</p>`;
                return content;
            }
        }
    };

    // Helper: format variable value
    function v(value, placeholder) {
        if (value && value.trim()) {
            return `<span class="contract-variable">${value}</span>`;
        }
        return `<span class="contract-variable empty">[${placeholder || '________'}]</span>`;
    }

    // Helper: generate signature block
    function generateSignatureBlock(party1, party2, t) {
        let block = `<h2>${t('contractContent.signatures_header')}</h2>`;
        block += `<div class="signature-block">`;
        block += `<div>`;
        block += `<div class="signature-line">${t('contractContent.signature')}</div>`;
        block += `<p><strong>${party1 || '________________'}</strong></p>`;
        block += `<div class="signature-line">${t('contractContent.printed_name')}</div>`;
        block += `<div class="signature-line">${t('contractContent.date')}: ________________</div>`;
        block += `</div>`;
        block += `<div>`;
        block += `<div class="signature-line">${t('contractContent.signature')}</div>`;
        block += `<p><strong>${party2 || '________________'}</strong></p>`;
        block += `<div class="signature-line">${t('contractContent.printed_name')}</div>`;
        block += `<div class="signature-line">${t('contractContent.date')}: ________________</div>`;
        block += `</div>`;
        block += `</div>`;
        return block;
    }

    function getTemplate(id) {
        return TEMPLATES[id] || null;
    }

    function getAllTemplates() {
        return Object.values(TEMPLATES);
    }

    function getTemplatesByCategory(category) {
        if (category === 'all') return getAllTemplates();
        return getAllTemplates().filter(t => t.category === category);
    }

    return {
        getTemplate,
        getAllTemplates,
        getTemplatesByCategory,
        TEMPLATES
    };
})();
