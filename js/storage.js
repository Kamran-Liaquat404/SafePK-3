/*
   SafePK - Local Client State Storage Manager
   Urdu Comment: Client browser ki local storage reads aur writes ko standard parameters k sath sync karne ka clean logic.
   Author: SafePK Platform Engineering
*/

const SafePK_Storage = {
    // Save items array to custom key
    set: function (key, dataArray) {
        try {
            localStorage.setItem(`safepk_${key}`, JSON.stringify(dataArray));
            return true;
        } catch (e) {
            console.error('[SafePK Storage] Failed to write item:', e);
            return false;
        }
    },

    // Read items array
    get: function (key) {
        try {
            const raw = localStorage.getItem(`safepk_${key}`);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('[SafePK Storage] Failed to read item:', e);
            return null;
        }
    },

    // Remove item
    remove: function (key) {
        localStorage.removeItem(`safepk_${key}`);
    },

    // Wipe all platform items from local browser memory
    clearAll: function () {
        // Only clear keys prefixed with safepk_
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('safepk_')) {
                localStorage.removeItem(key);
            }
        });
    }
};

// Global Checklist Items structured details
const AUDIT_CHECKLIST_DATA = [
    {
        id: 'chk-1',
        title: 'Two-Step WhatsApp Verification',
        category: 'accounts',
        desc: 'Turn on Two-Step Verification inside WhatsApp settings and set a secure 6-digit backup PIN.',
        hint: 'Go to WhatsApp > Settings > Account > Two-Step Verification > Turn On.'
    },
    {
        id: 'chk-2',
        title: 'Different Passwords for Apps',
        category: 'accounts',
        desc: 'Make sure your bank logins, personal emails, and social media accounts use different, strong passwords.',
        hint: 'Never use the same password for different website or app accounts.'
    },
    {
        id: 'chk-3',
        title: 'Do Not Share SMS OTPs',
        category: 'accounts',
        desc: 'Never share SMS code verification numbers with anyone on phone calls or messages.',
        hint: 'No official bank or courier will ever ask you for live verification codes.'
    },
    {
        id: 'chk-4',
        title: 'Strong Phone Screen Lock',
        category: 'devices',
        desc: 'Turn on secure fingerprint scanning, face unlock, or a strong PIN number on your phone.',
        hint: 'Avoid mechanical pattern lines (such as "L" or "Z") which are easily observable.'
    },
    {
        id: 'chk-5',
        title: 'Check App Permissions',
        category: 'devices',
        desc: 'Check your downloaded mobile apps and turn off permissions you do not use (like camera, calendar, contacts, or location).',
        hint: 'Deauthorize unnecessary permissions for standalone utilities.'
    },
    {
        id: 'chk-6',
        title: 'Enable Phone Lock Screen Security',
        category: 'devices',
        desc: 'Make sure your phone screen lock (PIN, password, or fingerprint) is turned on to keep your phone data safe.',
        hint: 'Go to Settings > Security to verify your lock screen security.'
    },
    {
        id: 'chk-7',
        title: 'Avoid Public Wi-Fi for Banking',
        category: 'network',
        desc: 'Do not log into your bank or mobile wallet (like EasyPaisa) when using free public Wi-Fi in shops, markets, or cafes.',
        hint: 'Always switch to your mobile networks data (cellular data) for bank apps.'
    },
    {
        id: 'chk-8',
        title: 'Change Default Home Wi-Fi Password',
        category: 'network',
        desc: 'Change default router credentials (such as "admin" usernames) to unique values.',
        hint: 'Open your Wi-Fi router settings page to change default passwords.'
    },
    {
        id: 'chk-9',
        title: 'Clear Web History',
        category: 'personal',
        desc: 'Regularly clear your internet browser history, cookies, and search traces inside settings.',
        hint: 'Use private/incognito tabs or clear history from browser settings.'
    },
    {
        id: 'chk-10',
        title: 'Call to Confirm Money Requests',
        category: 'personal',
        desc: 'Always call your friends on a real voice phone call if they send urgent messages asking for money on EasyPaisa or JazzCash.',
        hint: 'Do not transfer any money without speaking to them directly on a real phone call first.'
    }
];
