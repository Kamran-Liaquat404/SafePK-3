/*
   SafePK - Progressive Web App Service Worker
   Urdu Comment: Static assets ko local storage ya cache memory me store karne ka background flow jo offline status track karta hai.
   Author: SafePK Platform Engineering
*/

const CACHE_NAME = 'safepk-shield-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './tools.html',
  './learn.html',
  './report.html',
  './contact.html',
  './css/main.css',
  './css/components.css',
  './css/responsive.css',
  './js/app.js',
  './js/navbar.js',
  './js/theme.js',
  './js/storage.js',
  './js/tools/password-checker.js',
  './js/tools/password-generator.js',
  './js/tools/checklist.js',
  './js/tools/quiz.js',
  './manifest.json',
  'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
