/*
   SafePK - Global Application Logic
   Urdu Comment: Platform loading aur status trace check setup shamil hai.
   Author: SafePK Platform Engineering
*/

document.addEventListener('DOMContentLoaded', () => {
    // Log platform loaded successfully
    console.log('%c[SafePK]%c Threat Mitigation Platform Core Active.', 'color: #10b981; font-weight: bold;', 'color: inherit;');
    
    // Register Service Worker for offline PWA support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => {
                    console.log('SafePK ServiceWorker registered successfully:', reg.scope);
                })
                .catch(err => {
                    console.warn('SafePK ServiceWorker registration failed:', err);
                });
        });
    }
});
