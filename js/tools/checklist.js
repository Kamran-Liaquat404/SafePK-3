/*
   SafePK - Hygiene Audit Checklist Module
   Urdu Comment: Secure audit checklists checklist-items-list dynamically construct, persistent state check aur score metric updater shamil hai.
   Author: SafePK Platform Engineering
*/

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('checklist-items-list');
    const pctLabel = document.getElementById('checklist-progress-pct');
    const progressBar = document.getElementById('checklist-progress-bar');
    const adviceText = document.getElementById('checklist-progress-adv');

    const filterBtns = {
        all: document.getElementById('chk-filter-all'),
        accounts: document.getElementById('chk-filter-accounts'),
        devices: document.getElementById('chk-filter-devices'),
        network: document.getElementById('chk-filter-network'),
        personal: document.getElementById('chk-filter-personal')
    };

    let selectedFilterId = 'all';
    let checklistAnswers = {};

    // Load initial answers
    function loadAnswers() {
        // Urdu Comment: Local checklist parameters state loader
        const saved = localStorage.getItem('safepk_checklist_answers');
        if (saved) {
            try {
                checklistAnswers = JSON.parse(saved);
            } catch (e) {
                checklistAnswers = {};
            }
        } else {
            checklistAnswers = {};
        }
    }

    function saveAnswers() {
        localStorage.setItem('safepk_checklist_answers', JSON.stringify(checklistAnswers));
        calculateProgress();
    }

    // Dynamic percent display updater
    function calculateProgress() {
        if (typeof AUDIT_CHECKLIST_DATA === 'undefined') return;
        const totalCount = AUDIT_CHECKLIST_DATA.length;
        if (totalCount === 0) return;

        let checkedCount = 0;
        AUDIT_CHECKLIST_DATA.forEach(item => {
            if (checklistAnswers[item.id]) {
                checkedCount++;
            }
        });

        const percent = Math.round((checkedCount / totalCount) * 100);
        if (pctLabel) {
            pctLabel.textContent = `${percent}% Protected`;
        }
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }

        // Dynamic coaching suggestions based on scores
        if (adviceText) {
            if (percent === 0) {
                adviceText.textContent = 'Check the items below to start checking your safety!';
                adviceText.className = 'text-[10px] text-slate-500 font-mono leading-relaxed text-center font-bold';
            } else if (percent < 40) {
                adviceText.textContent = 'A bit low! Try checking more items to make yourself safer.';
                adviceText.className = 'text-[10px] text-rose-400 font-mono leading-relaxed text-center font-bold ';
            } else if (percent < 80) {
                adviceText.textContent = 'Good job! Check a few more items to get fully safe.';
                adviceText.className = 'text-[10px] text-yellow-400 font-mono leading-relaxed text-center font-bold';
            } else if (percent < 100) {
                adviceText.textContent = 'Very safe! You are doing an amazing job protecting yourself.';
                adviceText.className = 'text-[10px] text-emerald-400 font-mono leading-relaxed text-center font-bold';
            } else {
                adviceText.textContent = '100% Protected! You have checked all safety items. Excellent job!';
                adviceText.className = 'text-[10px] text-emerald-300 font-mono leading-relaxed text-center font-bold animate-pulse';
            }
        }
    }

    // Urdu Comment: Dynamic HTML checklist lines builder
    function renderChecklist() {
        if (!listContainer || typeof AUDIT_CHECKLIST_DATA === 'undefined') return;
        listContainer.innerHTML = '';

        const itemsToRender = AUDIT_CHECKLIST_DATA.filter(item => {
            if (selectedFilterId === 'all') return true;
            return item.category === selectedFilterId;
        });

        itemsToRender.forEach(item => {
            const isChecked = !!checklistAnswers[item.id];
            
            const card = document.createElement('div');
            card.className = `p-4 rounded-xl border transition-all duration-200 select-none ${
                isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-850 hover:border-slate-800'
            }`;

            card.innerHTML = `
                <div class="flex items-start gap-3">
                    <input type="checkbox" id="chk-box-${item.id}" ${isChecked ? 'checked' : ''} class="w-4 h-4 rounded border-slate-800 text-emerald-500 bg-slate-900 focus:ring-emerald-500/50 mt-1 cursor-pointer">
                    <div class="space-y-1 select-text">
                        <label for="chk-box-${item.id}" class="text-xs md:text-sm font-bold block cursor-pointer transition-colors ${isChecked ? 'text-emerald-300' : 'text-slate-200'}">
                            ${item.title}
                        </label>
                        <p class="text-[11px] text-slate-400 leading-normal">${item.desc}</p>
                        
                        <!-- Details / Help accordion instructions -->
                        <div class="pt-2">
                            <details class="text-[10px] font-mono text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">
                                <summary class="outline-none font-bold">Show instructions</summary>
                                <div class="p-2 bg-slate-950 rounded border border-slate-900 leading-normal text-slate-402 text-slate-400 mt-1 font-sans">
                                    ${item.hint}
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            `;

            // Bind triggers inside items
            const box = card.querySelector('input[type="checkbox"]');
            if (box) {
                box.addEventListener('change', () => {
                    checklistAnswers[item.id] = box.checked;
                    saveAnswers();
                    renderChecklist();
                });
            }

            listContainer.appendChild(card);
        });
    }

    // Urdu Comment: Category switching visual triggers
    function switchChecklistFilter(targetFilter) {
        selectedFilterId = targetFilter;
        
        Object.keys(filterBtns).forEach(key => {
            const btn = filterBtns[key];
            if (!btn) return;
            if (key === targetFilter) {
                btn.className = 'chk-filter-btn px-3 py-1.5 border rounded bg-emerald-950/40 border-emerald-500/30 text-emerald-300';
            } else {
                btn.className = 'chk-filter-btn px-3 py-1.5 border border-transparent rounded text-slate-400 hover:text-slate-200 hover:bg-slate-850';
            }
        });

        renderChecklist();
    }

    // Attach click events on filter elements
    Object.keys(filterBtns).forEach(key => {
        const btn = filterBtns[key];
        if (btn) {
            btn.addEventListener('click', () => switchChecklistFilter(key));
        }
    });

    // Initialize checklist module sequence
    loadAnswers();
    calculateProgress();
    renderChecklist();
});
