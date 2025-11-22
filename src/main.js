import './style.css'
import { initAuth } from './auth.js'
import { initInstallPrompt } from './install-prompt.js'

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-pulse text-xl text-blue-600">Loading Campus Print Service...</div>
  </div>
`

window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global Error:", message, "at", source, ":", lineno);
};

window.addEventListener('unhandledrejection', function (event) {
  console.error("Unhandled Rejection:", event.reason);
});

console.log("Calling initAuth...");
initAuth();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[PWA] New service worker found, installing...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New content available, please refresh.');
              // You can show a notification to the user here
            }
          });
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}

// Initialize PWA install prompt
initInstallPrompt();

