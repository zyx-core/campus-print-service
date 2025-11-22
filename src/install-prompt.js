// PWA Install Prompt Handler
let deferredPrompt = null;
let installButton = null;

export function initInstallPrompt() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] Install prompt available');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Save the event so it can be triggered later
        deferredPrompt = e;
        // Show install button if it exists
        showInstallButton();
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        deferredPrompt = null;
        hideInstallButton();
        // You can track this event with analytics
    });

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('[PWA] App is running in standalone mode');
    }
}

export function showInstallPrompt() {
    if (!deferredPrompt) {
        console.log('[PWA] Install prompt not available');
        return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }
        deferredPrompt = null;
    });

    return true;
}

function showInstallButton() {
    installButton = document.getElementById('pwa-install-button');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', showInstallPrompt);
    }
}

function hideInstallButton() {
    if (installButton) {
        installButton.style.display = 'none';
    }
}

// Export function to check if install is available
export function isInstallAvailable() {
    return deferredPrompt !== null;
}
