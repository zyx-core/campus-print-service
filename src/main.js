import './style.css'
import { initAuth } from './auth.js'

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
