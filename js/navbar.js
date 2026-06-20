/*
   SafePK - SPALite Simple Hash Router and Dynamic Navbar Controller
   Urdu Comment: Yeh script hashes (#home, #tools, etc.) ko read kar kay corresponding full-screen divs toggle karti hai.
   No more external pages needed, sub kuch index.html say hi open hoga aur PK users k liye pro responsive experience milay ga.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ALL MAIN VIEW CONTAINERS IN THE DOCUMENT
    // Urdu Comment: Har major section ki div ko represent karne wale elements select karein.
    const views = {
        'home': document.getElementById('view-home'),
        'about': document.getElementById('view-about'),
        'tools': document.getElementById('view-tools'),
        'learn': document.getElementById('view-learn'),
        'report': document.getElementById('view-report'),
        'contact': document.getElementById('view-contact')
    };

    // Mobile Hamburger Elements
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // 2. HAMBURGER TOGGLE LOGIC
    // Urdu Comment: Mobile menu drawer open / close handler block
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuToggle.innerHTML = '<i data-lucide="x" class="h-6 w-6"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuToggle.innerHTML = '<i data-lucide="menu" class="h-6 w-6"></i>';
            }
            lucide.createIcons();
        });
    }

    // 3. MAIN ROUTING CONTROLLER FUNCTION
    // Urdu Comment: Active hash detect kr k appropriate views render krna aur highlight modify krna.
    function navigateToSection() {
        // Default to home if no hash
        let hash = window.location.hash.slice(1) || 'home';
        
        // Handle parameters (like ?tool=checker)
        if (hash.includes('?')) {
            hash = hash.split('?')[0];
        }

        // If specified section doesn't exist, default to home
        if (!views[hash]) {
            hash = 'home';
        }

        // Hide all views, show active view
        Object.keys(views).forEach(key => {
            const el = views[key];
            if (el) {
                if (key === hash) {
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('hidden');
                }
            }
        });

        // Close mobile drawer if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (mobileMenuToggle) {
                mobileMenuToggle.innerHTML = '<i data-lucide="menu" class="h-6 w-6"></i>';
            }
        }

        // Update Nav Menu active highlights
        // Urdu Comment: Desktop aur mobile nav links k styles adjust krna selected sections k mutabik
        const navLinks = document.querySelectorAll('nav a, #mobile-menu a');
        navLinks.forEach(link => {
            const hrefAttr = link.getAttribute('href');
            if (!hrefAttr) return;

            // Check if link target matches the hash
            const isMatch = hrefAttr === `#${hash}` || (hash === 'home' && hrefAttr === '#home');

            if (isMatch) {
                // Style applied for highlighted active link
                link.className = "px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-all duration-250 bg-emerald-950/65 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]";
            } else {
                // Normal link style
                if (link.closest('#mobile-menu')) {
                    link.className = "block w-full text-left px-4 py-3 rounded-md text-base font-medium text-slate-300 hover:bg-slate-850 hover:text-white";
                } else {
                    link.className = "px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 text-slate-300 hover:bg-slate-850 hover:text-white border border-transparent";
                }
            }
        });

        // Scroll immediately to top for natural navigation feeling
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Force Icons render
        lucide.createIcons();

        // Check if we need to auto-trigger tool inner tab transitions
        const urlParams = new URLSearchParams(window.location.search);
        const subTool = urlParams.get('tool');
        if (hash === 'tools' && subTool && typeof window.switchTab === 'function') {
            window.switchTab(subTool);
        }
    }

    // 4. THEME SWAP LOGIC (BLACK/WHITE LIGHT MODE AND SLATE DARK MODE)
    // Urdu Comment: Theme dynamically swap aur store karne ka complete handler
    const themeBtnDesktop = document.getElementById('theme-swap-btn');
    const themeBtnMobile = document.getElementById('theme-swap-mobile-btn');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mono');
            if (themeBtnDesktop) themeBtnDesktop.innerHTML = '<i data-lucide="moon" class="h-4 w-4"></i>';
            if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="moon" class="h-4.5 w-4.5"></i>';
        } else {
            document.body.classList.remove('light-mono');
            if (themeBtnDesktop) themeBtnDesktop.innerHTML = '<i data-lucide="sun" class="h-4 w-4"></i>';
            if (themeBtnMobile) themeBtnMobile.innerHTML = '<i data-lucide="sun" class="h-4.5 w-4.5"></i>';
        }
        localStorage.setItem('safepk-theme', theme);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem('safepk-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    if (themeBtnDesktop) {
        themeBtnDesktop.addEventListener('click', toggleTheme);
    }
    if (themeBtnMobile) {
        themeBtnMobile.addEventListener('click', toggleTheme);
    }

    // Initialize stored theme selection
    const savedTheme = localStorage.getItem('safepk-theme') || 'dark';
    applyTheme(savedTheme);

    // Bind route changes listeners
    window.addEventListener('hashchange', navigateToSection);
    window.addEventListener('load', navigateToSection);
    navigateToSection(); // Run on absolute immediate load
});
