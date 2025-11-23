import './style.css'
import { initAuth } from './auth.js'
import { initInstallPrompt } from './install-prompt.js'
import { renderLanding } from './landing.js'
import { renderLogin, renderSignup } from './ui.js'
import { renderStudentDashboard } from './student.js'
import { renderAdminDashboard } from './admin.js'
import { router } from './router.js'
import { auth } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

// Show initial loading
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

console.log("[Main] Initializing app...");

// Register all routes
console.log('[Main] Registering routes...');
router.register('/', renderLanding, false);        // Public landing page
router.register('/login', renderLogin, false);      // Public login page
router.register('/signup', renderSignup, false);    // Public signup page
router.register('/dashboard', (user) => {
  renderStudentDashboard(user || auth.currentUser);
}, true);  // Protected student dashboard 
router.register('/admin', (user) => {
  renderAdminDashboard(user || auth.currentUser);
}, true);  // Protected admin dashboard

// Initialize the router FIRST
console.log('[Main] Initializing router...');
router.init();

// Set up auth state observer
let authInitialized = false;

onAuthStateChanged(auth, (user) => {
  console.log('[Main] Auth state changed:', user ? user.email : 'No user');

  if (!authInitialized) {
    // First auth state check - determine where to navigate
    authInitialized = true;

    if (user) {
      // User is logged in - redirect to dashboard if on public page
      console.log('[Main] Initial auth: User authenticated:', user.email);
      const userRole = localStorage.getItem('userRole') || 'student';
      const currentPath = router.getCurrentPath();

      if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
        console.log('[Main] User on public page, redirecting to dashboard');
        if (userRole === 'admin') {
          router.navigate('/admin');
        } else {
          router.navigate('/dashboard');
        }
      }
    } else {
      // Not logged in - stay on public page or redirect to login
      console.log('[Main] Initial auth: No user, navigating to landing');
      const currentPath = router.getCurrentPath();

      if (router.requiresAuth(currentPath)) {
        console.log('[Main] User trying to access protected route, redirecting to login');
        router.navigate('/login');
      }
    }
  } else {
    // Subsequent auth state changes (login/logout)
    if (user) {
      //User just logged in - redirect to appropriate dashboard
      console.log('[Main] User logged in:', user.email);
      const userRole = localStorage.getItem('userRole') || 'student';

      if (userRole === 'admin') {
        router.navigate('/admin');
      } else {
        router.navigate('/dashboard');
      }
    } else {
      // User just logged out - redirect to landing page
      console.log('[Main] User logged out, redirecting to landing');
      router.navigate('/');
    }
  }
});


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

