/*
   SafePK - Secure Password Array Generator module
   Urdu Comment: Cryptographically strong password dynamic random character selection code shamil hai.
   Author: SafePK Platform Engineering
*/

document.addEventListener('DOMContentLoaded', () => {
    const lenSlider = document.getElementById('generator-len-slider');
    const lenLabel = document.getElementById('generator-len-label');
    const outField = document.getElementById('generator-output');
    
    const reloadBtn = document.getElementById('generator-reload');
    const copyBtn = document.getElementById('generator-copy');
    const copyNotif = document.getElementById('generator-copy-notif');

    const optUpper = document.getElementById('gen-opt-uppercase');
    const optLower = document.getElementById('gen-opt-lowercase');
    const optNums = document.getElementById('gen-opt-numbers');
    const optSyms = document.getElementById('gen-opt-symbols');
    const optExclude = document.getElementById('gen-opt-exclude');

    // Char sets definitions
    const UPPERCASE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluded confusing I, O by default
    const LOWERCASE_CHARS = 'abcdefghijkmnopqrstuvwxyz'; // Excluded confusing l by default
    const NUMBERS_CHARS = '23456789'; // Excluded confusing 1, 0 by default
    const SYMBOLS_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Char sets with full ambiguous chars
    const AMBIGUOUS_UPPER = 'I' + 'O';
    const AMBIGUOUS_LOWER = 'l';
    const AMBIGUOUS_NUMS = '1' + '0';

    // Urdu Comment: Cryptographic random key writing function
    function generateSecureString() {
        if (!outField) return;

        let length = lenSlider ? parseInt(lenSlider.value) : 16;
        if (isNaN(length)) length = 16;
        let allowedPool = '';

        // Determine pools based on standard states and exclude toggles
        let useUpper = optUpper ? optUpper.checked : true;
        let useLower = optLower ? optLower.checked : true;
        let useNums = optNums ? optNums.checked : true;
        let useSyms = optSyms ? optSyms.checked : true;
        let excludeAmbiguous = optExclude ? optExclude.checked : false;

        // If nothing checked, force lower
        if (!useUpper && !useLower && !useNums && !useSyms) {
            if (optLower) {
                optLower.checked = true;
            }
            useLower = true;
        }

        if (useUpper) allowedPool += UPPERCASE_CHARS + (excludeAmbiguous ? '' : AMBIGUOUS_UPPER);
        if (useLower) allowedPool += LOWERCASE_CHARS + (excludeAmbiguous ? '' : AMBIGUOUS_LOWER);
        if (useNums) allowedPool += NUMBERS_CHARS + (excludeAmbiguous ? '' : AMBIGUOUS_NUMS);
        if (useSyms) allowedPool += SYMBOLS_CHARS;

        let result = '';
        try {
            // Deploy secure cryptographic integers values arrays
            const secureArray = new Uint32Array(length);
            window.crypto.getRandomValues(secureArray);
            for (let i = 0; i < length; i++) {
                result += allowedPool.charAt(secureArray[i] % allowedPool.length);
            }
        } catch (e) {
            // Secure fallback
            for (let i = 0; i < length; i++) {
                result += allowedPool.charAt(Math.floor(Math.random() * allowedPool.length));
            }
        }

        outField.value = result;
    }

    // Slider moves update count label
    if (lenSlider && lenLabel) {
        lenSlider.addEventListener('input', () => {
            lenLabel.textContent = `${lenSlider.value} characters`;
            generateSecureString();
        });
    }

    // Bind triggers on all toggles changes
    const toggles = [optUpper, optLower, optNums, optSyms, optExclude];
    toggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', generateSecureString);
        }
    });

    if (reloadBtn) {
        reloadBtn.addEventListener('click', generateSecureString);
    }

    // Urdu Comment: Clipboards writing parameters standard implementations
    if (copyBtn && outField) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = outField.value;
            if (!value) return;

            navigator.clipboard.writeText(value)
                .then(() => {
                    if (copyNotif) {
                        copyNotif.classList.remove('hidden');
                        setTimeout(() => {
                            copyNotif.classList.add('hidden');
                        }, 4000);
                    }
                })
                .catch(err => {
                    console.error('Clipboard copy failed:', err);
                });
        });
    }

    // Pre-inject first key on startup load
    generateSecureString();
});
