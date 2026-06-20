/*
   SafePK - Scenario Cyber Vigilance Assessment Quiz module
   Urdu Comment: Scenario-based cyber safety vigilance assessment quiz controller jo elements dynamically update aur track karta hai.
   Author: SafePK Platform Engineering
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // Core screens
    const startScreen = document.getElementById('quiz-screen-start');
    const activeScreen = document.getElementById('quiz-screen-active');
    const endScreen = document.getElementById('quiz-screen-end');

    // UI elements selector pointers
    const startBtn = document.getElementById('quiz-btn-start');
    const nextBtn = document.getElementById('quiz-btn-next');
    const restartBtn = document.getElementById('quiz-btn-restart');
    
    const counterLabel = document.getElementById('quiz-counter');
    const questionText = document.getElementById('quiz-question-txt');
    const optionsWrapper = document.getElementById('quiz-options-wrapper');
    
    const explanationBox = document.getElementById('quiz-explanation-box');
    const alertTitle = document.getElementById('quiz-alert-title');
    const explanationText = document.getElementById('quiz-explanation-txt');

    const resultScore = document.getElementById('quiz-result-score');
    const resultLevel = document.getElementById('quiz-result-level');
    const resultAdvice = document.getElementById('quiz-result-advice');

    // 10-scenario cyber check questions list array
    const QUIZ_DATA = [
        {
            question: "Someone calls claiming to be from your bank's head office, telling you your account will be locked immediately unless you verify the SMS secure OTP code sent to your phone. What should you do?",
            options: [
                "Share the OTP since they know your official name and account balance details.",
                "Provide only the login pin but keep the transactional passwords private.",
                "Politely decline, disconnect, and call your bank's verified helpline directly to verify."
            ],
            correct: 2,
            explanation: "No official banking officer will ever ask you to verify a secure OTP over the telephone. Helplines listed on the physical bank card are the only safe verifications channels."
        },
        {
            question: "You receive a sudden WhatsApp message from a familiar friend claiming they are in a critical medical crisis and need an instant Rs. 20,000 money transfer via JazzCash/EasyPaisa. How should you react?",
            options: [
                "Decline or ignore it because lending cash causes personal relationship strains.",
                "Instantly transfer the balance because you trust their family completely.",
                "Disconnect and call your friend on a direct mobile network call to verbally confirm identity."
            ],
            correct: 2,
            explanation: "Scammers take over personal social profiles to borrow money from friends. Verification by making an offline cellular call is the best protective shield."
        },
        {
            question: "An unknown number text asks you to share a 6-digit WhatsApp registration code they claimed was accidentally routed to your line. What should you do?",
            options: [
                "Forward the digit sequence, assuming it refers to a standard shipping transaction code.",
                "Decline, block the caller, and verify your Two-Step Verification is active.",
                "Share the code but immediately clear your chat histories to stay secure."
            ],
            correct: 1,
            explanation: "Sharing your WhatsApp 6-digit code lets attackers hijack your account and lockout your device profile instantly. Never share registration codes."
        },
        {
            question: "A popular phone utility tool requests permissions to access call records, device storage directories, and live location coordinate histories. How do you assess this?",
            options: [
                "Authorize all requests so you don't face lag or access limits.",
                "Decline the requested permissions and uninstall the app if it locks you out.",
                "Authorize permissions for 1 hour to see if the utility compiles any errors."
            ],
            correct: 1,
            explanation: "Utility tools (such as flashlights, pdf readers) don't need contact logs or location histories. Granting these access logs is a major privacy threat."
        },
        {
            question: "You are connected to an open, free, unencrypted Wi-Fi hotspot at a crowded railway terminal or coffee shop. What is your safe transaction strategy?",
            options: [
                "Log into your mobile banking app to check statements since you think the browser is safe.",
                "Decline to process credentials and only use mobile cellular data values or a secured VPN connection.",
                "Only access social media apps to minimize structural leaks risks."
            ],
            correct: 1,
            explanation: "Hackers deploy sniffing scripts on open public networks to capture data packet headers. Switch to private cellular arrays for active logins."
        },
        {
            question: "You see an unlabeled USB flash drive lying on the ground inside your local workspace lobby area. What is the most appropriate action?",
            options: [
                "Plug the device into your laptop temporarily to locate files referencing its owner.",
                "Pick it up and hand it over to security/IT team, or safely throw it in the trash.",
                "Mount it on your old computer or suggest a colleague inspect it to check features."
            ],
            correct: 1,
            explanation: "USB scattering is a common malware penetration tactic. Plugging foreign chips into personal devices triggers background software compromises."
        },
        {
            question: "An email congratulations alert states you won a major cash grant lottery and requests an initial Rs. 5,000 regulatory processing fee upfront. What should you do?",
            options: [
                "Transfer the processing balance immediately so you don't miss the lottery payment.",
                "Reject and delete the email thread, and mark the sender's domain as static spam.",
                "Reply to check if they can deduct the validation balance from your lottery prize."
            ],
            correct: 1,
            explanation: "Legal rewards programs never demand payment from prize winners upfront. These are financial phishing scams designed to steal deposits."
        },
        {
            question: "A random browser pop-up screen flashes warning alerts claiming your computer is heavily corrupted and demands you click a free cleaner utility link. What is the plan?",
            options: [
                "Authorize the download link so the security software scrubs the virus blocks.",
                "Ignore the prompt, close the browser tab immediately, and avoid clicking any pop-up areas.",
                "Call the provided toll-free coordinate support code to talk to safe operators."
            ],
            correct: 1,
            explanation: "Corrupted systems warnings are deceptive click-bait models designed to trick users into downloading trojans. Close the tabs cleanly."
        },
        {
            question: "When installing utility application softwares on personal desktop computers, you should...",
            options: [
                "Rely on cracked software mirrors, game modifiers, and free serial key sites to save costs.",
                "Only acquire installers directly from official developer sites or verified store panels.",
                "Accept default configurations and check 'Express Installation' without reviewing rules."
            ],
            correct: 1,
            explanation: "Cracked software mirrors house dangerous hidden payloads like keyloggers and info-stealers in background operating libraries. Download only verified sources."
        },
        {
            question: "A stranger on Facebook offering a high price wants to purchase ownership codes of your personal digital game characters or old accounts. How do you assess this?",
            options: [
                "Accept and hand over login passwords since you don't use the accounts anymore anyway.",
                "Decline. Handing over account setups opens your associated personal identities to illegal proxy activities.",
                "Submit inputs details first to verify prompt payment transactions integrity."
            ],
            correct: 1,
            explanation: "Selling profiles or keys exposes your digital identity. Attackers use bought configurations to process scam networks or bypass localized KYC tracking checks."
        }
    ];

    let currentQuestionIdx = 0;
    let score = 0;

    // Urdu Comment: Quiz screen layout switching logic
    function initiateQuiz() {
        currentQuestionIdx = 0;
        score = 0;

        if (startScreen) startScreen.classList.add('hidden');
        if (endScreen) endScreen.classList.add('hidden');
        if (activeScreen) activeScreen.classList.remove('hidden');

        renderQuestion();
    }

    function renderQuestion() {
        if (explanationBox) explanationBox.classList.add('hidden');
        if (nextBtn) {
            nextBtn.classList.add('pointer-events-none', 'bg-slate-950', 'border-slate-850', 'text-slate-400');
            nextBtn.setAttribute('disabled', 'true');
        }

        const activeQuestion = QUIZ_DATA[currentQuestionIdx];
        if (counterLabel) {
            counterLabel.textContent = `Scenario ${currentQuestionIdx + 1} of ${QUIZ_DATA.length}`;
        }
        if (questionText) {
            questionText.textContent = activeQuestion.question;
        }

        if (optionsWrapper) {
            optionsWrapper.innerHTML = '';
            activeQuestion.options.forEach((optText, idx) => {
                const btn = document.createElement('button');
                btn.className = 'w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl text-left text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer select-text text-slate-300';
                btn.innerHTML = `
                    <span>${optText}</span>
                    <span class="icon-placeholder shrink-0 ml-3 text-slate-500">
                        <i data-lucide="circle" class="h-4 w-4"></i>
                    </span>
                `;

                // Bind triggers on clicking individual options
                btn.addEventListener('click', () => handleOptionClick(idx));
                optionsWrapper.appendChild(btn);
            });
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    // Urdu Comment: Option clicks feedback layout processor
    function handleOptionClick(selectedIdx) {
        if (!optionsWrapper) return;
        const activeQuestion = QUIZ_DATA[currentQuestionIdx];
        const correctIdx = activeQuestion.correct;
        const optionButtons = optionsWrapper.querySelectorAll('button');

        // Check response parity
        const isCorrect = selectedIdx === correctIdx;
        if (isCorrect) {
            score++;
        }

        // Freeze all buttons from clicking again
        optionButtons.forEach((btn, idx) => {
            btn.classList.add('pointer-events-none');
            
            const isThisCorrect = idx === correctIdx;
            const isThisSelected = idx === selectedIdx;
            
            const iconPlaceholder = btn.querySelector('.icon-placeholder');

            if (isThisCorrect) {
                // Correct answer is highlighted green always
                btn.className = 'w-full flex items-center justify-between p-4 bg-emerald-950/25 border border-emerald-500/30 rounded-xl text-left text-xs md:text-sm font-bold text-emerald-300 transition-all';
                if (iconPlaceholder) iconPlaceholder.innerHTML = '<i data-lucide="check-circle" class="h-4.5 w-4.5 text-emerald-400"></i>';
            } else if (isThisSelected) {
                // Incorrect chosen is highlighted red
                btn.className = 'w-full flex items-center justify-between p-4 bg-rose-950/25 border border-rose-500/35 rounded-xl text-left text-xs md:text-sm font-bold text-rose-400 transition-all';
                if (iconPlaceholder) iconPlaceholder.innerHTML = '<i data-lucide="alert-triangle" class="h-4.5 w-4.5 text-rose-400"></i>';
            } else {
                // Other buttons faded out
                btn.className = 'w-full flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-xl text-left text-xs md:text-sm font-medium opacity-50 text-slate-500 transition-all';
            }
        });

        // Toggle explanation alerts display card
        if (explanationBox) {
            explanationBox.classList.remove('hidden');
            if (isCorrect) {
                explanationBox.className = 'p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl space-y-1';
                if (alertTitle) {
                    alertTitle.textContent = 'Correct! Good Choice.';
                    alertTitle.className = 'flex items-center gap-2 font-mono font-bold text-emerald-400';
                    alertTitle.innerHTML = '<i data-lucide="check-circle-2" class="h-4 w-4"></i> Correct! Good Choice.';
                }
            } else {
                explanationBox.className = 'p-4 bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs rounded-xl space-y-1';
                if (alertTitle) {
                    alertTitle.textContent = 'Wrong! Be Careful.';
                    alertTitle.className = 'flex items-center gap-2 font-mono font-bold text-rose-400';
                    alertTitle.innerHTML = '<i data-lucide="alert-triangle" class="h-4 w-4"></i> Wrong! Be Careful.';
                }
            }
        }

        if (explanationText) {
            explanationText.textContent = activeQuestion.explanation;
        }

        // Unlock proceeded button
        if (nextBtn) {
            nextBtn.classList.remove('pointer-events-none', 'bg-slate-950', 'border-slate-850', 'text-slate-400');
            nextBtn.className = 'px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-mono text-xs font-bold transition-all cursor-pointer';
            nextBtn.removeAttribute('disabled');
        }

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    // Urdu Comment: Proceed to next button action block
    function advanceQuestion() {
        currentQuestionIdx++;
        if (currentQuestionIdx < QUIZ_DATA.length) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }

    // Dynamic advice assessment details
    function endQuiz() {
        if (activeScreen) activeScreen.classList.add('hidden');
        if (endScreen) endScreen.classList.remove('hidden');

        if (resultScore) {
            resultScore.textContent = `${score} / ${QUIZ_DATA.length}`;
        }

        // Rate system vigilance category level
        let level = '';
        let advice = '';

        if (score <= 4) {
            level = 'High Risk (Vulnerability Detected)';
            if (resultLevel) resultLevel.className = 'text-base sm:text-lg font-bold text-rose-400 mt-1';
            advice = 'Vulnerabilities detected. Your profile matches risk indicators for tactics like social spoofing and credential extraction. Review the "Learn" section and utilize the Safety Checklist to reinforce your security parameters.';
        } else if (score <= 8) {
            level = 'Secure (Standard)';
            if (resultLevel) resultLevel.className = 'text-base sm:text-lg font-bold text-amber-400 mt-1';
            advice = 'You demonstrate standard safety awareness, but exposing factors remain in public network hygiene and verification profiles. Utilize the Safety Checklist to mitigate risk vectors.';
        } else {
            level = 'High Integrity (Optimal)';
            if (resultLevel) resultLevel.className = 'text-base sm:text-lg font-bold text-emerald-300 mt-1';
            advice = 'Optimal score achieved. Your security practices demonstrate strong resistance against spoofing and social engineering. Circulate these guidelines to secure connected contacts.';
        }

        if (resultLevel) {
            resultLevel.textContent = level;
        }
        if (resultAdvice) {
            resultAdvice.textContent = advice;
        }
    }

    // Bind event clicks
    if (startBtn) startBtn.addEventListener('click', initiateQuiz);
    if (nextBtn) nextBtn.addEventListener('click', advanceQuestion);
    if (restartBtn) restartBtn.addEventListener('click', initiateQuiz);
});
