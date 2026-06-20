/*
   SafePK - Local Password Entropy & Security Checker
   Urdu Comment: Real-time password checking logic jo password sequence analyze kar k visual warnings display karta hai.
   Author: SafePK Platform Engineering
*/

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('checker-password-input');
    const revealBtn = document.getElementById('checker-reveal-btn');
    
    const scoreLabel = document.getElementById('checker-score-label');
    const entropyVal = document.getElementById('checker-entropy-val');
    const entropyDesc = document.getElementById('checker-entropy-desc');
    
    const leakAlerts = document.getElementById('checker-leak-alerts');
    const leaksList = document.getElementById('checker-leaks-list');
    
    const scoreBars = [
        document.getElementById('score-bar-1'),
        document.getElementById('score-bar-2'),
        document.getElementById('score-bar-3'),
        document.getElementById('score-bar-4'),
        document.getElementById('score-bar-5')
    ];

    const criteria = {
        len: { el: document.getElementById('criteria-len'), check: (val) => val.length >= 12 },
        upper: { el: document.getElementById('criteria-upper'), check: (val) => /[A-Z]/.test(val) },
        lower: { el: document.getElementById('criteria-lower'), check: (val) => /[a-z]/.test(val) },
        digit: { el: document.getElementById('criteria-digit'), check: (val) => /[0-9]/.test(val) },
        special: { el: document.getElementById('criteria-special'), check: (val) => /[^A-Za-z0-9]/.test(val) }
    };

    // Urdu Comment: Eye button k clicks per password toggle view option
    if (revealBtn && passwordInput) {
        revealBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isText = passwordInput.type === 'text';
            passwordInput.type = isText ? 'password' : 'text';
            revealBtn.innerHTML = isText 
                ? '<i data-lucide="eye" class="h-5 w-5"></i>' 
                : '<i data-lucide="eye-off" class="h-5 w-5"></i>';
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        });
    }

    // Urdu Comment: Password text analysis core function
    function checkPassword() {
        const value = passwordInput ? passwordInput.value : '';
        if (!value) {
            resetChecker();
            return;
        }

        // 1. Evaluate Criteria Checks and update colors
        let CriteriaPassedCount = 0;
        Object.keys(criteria).forEach(key => {
            const rule = criteria[key];
            const passed = rule.check(value);
            if (passed) {
                CriteriaPassedCount++;
                if (rule.el) {
                    rule.el.classList.remove('text-slate-500', 'bg-slate-950/40', 'border-transparent');
                    rule.el.classList.add('text-emerald-400', 'bg-emerald-950/20', 'border-emerald-500/10');
                    const icon = rule.el.querySelector('i');
                    if (icon) icon.setAttribute('data-lucide', 'check-circle-2');
                }
            } else {
                if (rule.el) {
                    rule.el.classList.add('text-slate-500', 'bg-slate-950/40', 'border-transparent');
                    rule.el.classList.remove('text-emerald-400', 'bg-emerald-950/20', 'border-emerald-500/10');
                    const icon = rule.el.querySelector('i');
                    if (icon) icon.setAttribute('data-lucide', 'clock');
                }
            }
        });

        // 2. Calculate bits entropy: Entropy = length * log2(charset_size)
        let charsetSize = 0;
        if (/[a-z]/.test(value)) charsetSize += 26;
        if (/[A-Z]/.test(value)) charsetSize += 26;
        if (/[0-9]/.test(value)) charsetSize += 10;
        if (/[^a-zA-Z0-9]/.test(value)) charsetSize += 33;

        const entropy = Math.round(value.length * Math.log2(charsetSize || 1));
        if (entropyVal) {
            entropyVal.textContent = `${entropy} bits`;
        }

        // Classification label based on entropy
        let level = 0;
        let descText = 'Please type a password above to test.';
        let descClass = 'text-slate-400 font-sans leading-relaxed';
        let scoreText = 'NOT CHECKED YET';
        let scoreClass = 'text-rose-500 font-bold uppercase';

        if (entropy < 40) {
            level = 1;
            descText = 'Critical Vulnerability (HIGH RISK)';
            descClass = 'text-rose-500 font-bold';
            scoreText = 'Highly Insecure (Brute-force vulnerable)';
            scoreClass = 'text-rose-500 font-bold';
        } else if (entropy < 65) {
            level = 2;
            descText = 'Moderate Vulnerability (RISK POTENTIAL)';
            descClass = 'text-amber-500 font-bold';
            scoreText = 'Medium Risk (Insufficient complexity)';
            scoreClass = 'text-amber-500 font-bold';
        } else if (entropy < 85) {
            level = 3;
            descText = 'Adequate Complexity';
            descClass = 'text-yellow-400 font-bold';
            scoreText = 'Standard Security Level';
            scoreClass = 'text-yellow-400 font-bold';
        } else if (entropy < 105) {
            level = 4;
            descText = 'Strong Complexity (Optimal)';
            descClass = 'text-emerald-400 font-bold';
            scoreText = 'Highly Secure';
            scoreClass = 'text-emerald-400 font-bold';
        } else {
            level = 5;
            descText = 'Maximum Complexity (Excellent)';
            descClass = 'text-emerald-300 font-bold';
            scoreText = 'Maximum Integrity';
            scoreClass = 'text-emerald-300 font-bold';
        }

        if (entropyDesc) {
            entropyDesc.textContent = descText;
            entropyDesc.className = descClass;
        }
        if (scoreLabel) {
            scoreLabel.textContent = scoreText;
            scoreLabel.className = scoreClass;
        }

        // Apply progressive visual color highlights
        scoreBars.forEach((bar, idx) => {
            if (!bar) return;
            if (idx < level) {
                bar.classList.remove('bg-slate-850');
                if (level <= 1) bar.className = 'h-full w-1/5 rounded-full transition-all duration-300 bg-rose-500';
                else if (level <= 2) bar.className = 'h-full w-1/5 rounded-full transition-all duration-300 bg-amber-500';
                else if (level <= 3) bar.className = 'h-full w-1/5 rounded-full transition-all duration-300 bg-yellow-400';
                else bar.className = 'h-full w-1/5 rounded-full transition-all duration-300 bg-emerald-400';
            } else {
                bar.className = 'h-full w-1/5 rounded-full transition-all duration-300 bg-slate-850';
            }
        });

        // 3. Scan for regional pattern and sequential leaks warnings
        const warningAlertsList = [];
        const lowerVal = value.toLowerCase();

        // Standard sequence check
        if (/1234|qwerty|asdf|password/i.test(value)) {
            warningAlertsList.push('Identified sequential strings (e.g., "1234", "qwerty", "password"). These are highly vulnerable to basic dictionary guessing attacks.');
        }

        // Regional match check
        const regionalPatterns = {
            'pakistan': 'Identified national identifier ("pakistan"). Avoid national names as they are primary targets in regional credential stuffing.',
            'karachi': 'Identified regional city marker ("karachi"). Avoid geographical terms as they are susceptible to targeted brute-force attacks.',
            'lahore': 'Identified regional city marker ("lahore"). Avoid geographical terms as they are susceptible to targeted brute-force attacks.',
            'islamabad': 'Identified regional city marker ("islamabad"). Avoid geographical terms as they are susceptible to targeted brute-force attacks.',
            'admin': 'Identified system keyword ("admin"). Avoid standard dictionary terms that are primary brute-force vectors.',
            'easypaisa': 'Identified platform term ("easypaisa"). Avoid application names to prevent credential profiling.',
            'jazzcash': 'Identified platform term ("jazzcash"). Avoid application names to prevent credential profiling.',
            'mobile': 'Identified generic word ("mobile"). Standard dictionary nouns are highly guessable.'
        };

        Object.keys(regionalPatterns).forEach(pattern => {
            if (lowerVal.includes(pattern)) {
                warningAlertsList.push(regionalPatterns[pattern]);
            }
        });

        // Repeated adjacent chars check
        if (/(.)\1\1\1/.test(value)) {
            warningAlertsList.push('Identified repeated characters (e.g., "aaaa" or "1111"). Repeated structures are easily verified by automated brute-force tools.');
        }

        if (warningAlertsList.length > 0) {
            if (leakAlerts) {
                leakAlerts.classList.remove('hidden');
            }
            if (leaksList) {
                leaksList.innerHTML = '';
                warningAlertsList.forEach(warn => {
                    const li = document.createElement('li');
                    li.className = 'flex items-start gap-2 text-rose-455 text-rose-300';
                    li.innerHTML = `<i data-lucide="alert-circle" class="h-4 w-4 shrink-0 mt-0.5"></i> <span>${warn}</span>`;
                    leaksList.appendChild(li);
                });
            }
        } else {
            if (leakAlerts) {
                leakAlerts.classList.add('hidden');
            }
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    function resetChecker() {
        if (scoreLabel) {
            scoreLabel.textContent = 'Enter a Password';
            scoreLabel.className = 'text-slate-500 font-bold';
        }
        
        if (entropyVal) {
            entropyVal.textContent = '0%';
        }
        if (entropyDesc) {
            entropyDesc.textContent = 'No values yet';
            entropyDesc.className = 'text-slate-400 font-bold';
        }
        
        if (leakAlerts) {
            leakAlerts.classList.add('hidden');
        }
        if (leaksList) {
            leaksList.innerHTML = '';
        }

        scoreBars.forEach(bar => {
            if (bar) {
                bar.className = 'h-full w-1/5 rounded-full transition-all duration-300 bg-slate-850';
            }
        });

        Object.keys(criteria).forEach(key => {
            const rule = criteria[key];
            if (rule && rule.el) {
                rule.el.classList.add('text-slate-500', 'bg-slate-950/40', 'border-transparent');
                rule.el.classList.remove('text-emerald-400', 'bg-emerald-950/25', 'border-emerald-500/15');
                const icon = rule.el.querySelector('i');
                if (icon) icon.setAttribute('data-lucide', 'clock');
            }
        });
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', checkPassword);
    }
});
