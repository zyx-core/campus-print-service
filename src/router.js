import { auth } from './firebase.js';

/**
 * Simple hash-based router for the campus print service
 * Handles navigation between public pages (landing, login, signup) 
 * and protected pages (dashboard, admin)
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.defaultRoute = '/';
    }

    /**
     * Register a route with its handler function
     * @param {string} path - Route path (e.g., '/', '/login', '/dashboard')
     * @param {Function} handler - Function to call when route is accessed
     * @param {boolean} requiresAuth - Whether the route requires authentication
     */
    register(path, handler, requiresAuth = false) {
        this.routes[path] = {
            handler,
            requiresAuth
        };
    }

    /**
     * Navigate to a specific route
     * @param {string} path - Route path to navigate to
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Get the current route path from URL hash
     * @returns {string} Current route path
     */
    getCurrentPath() {
        const hash = window.location.hash.slice(1);
        return hash || this.defaultRoute;
    }

    /**
     * Initialize the router and set up hash change listener
     */
    init() {
        console.log('[Router] Initializing router');

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            console.log('[Router] Hash changed to:', window.location.hash);
            this.handleRoute();
        });

        // Handle initial route
        this.handleRoute();
    }

    /**
     * Handle the current route - check auth and call appropriate handler
     */
    handleRoute() {
        const path = this.getCurrentPath();
        const route = this.routes[path];

        console.log('[Router] Handling route:', path);

        // Route not found - redirect to default
        if (!route) {
            console.warn('[Router] Route not found:', path, '- redirecting to', this.defaultRoute);
            this.navigate(this.defaultRoute);
            return;
        }

        // Check if route requires authentication
        if (route.requiresAuth) {
            const user = auth.currentUser;

            if (!user) {
                console.log('[Router] Auth required but no user - redirecting to /login');
                this.navigate('/login');
                return;
            }

            console.log('[Router] Auth verified for user:', user.email);
        }

        // Update current route
        this.currentRoute = path;

        // Call the route handler
        try {
            console.log('[Router] Calling handler for:', path);
            route.handler();
        } catch (error) {
            console.error('[Router] Error executing route handler:', error);
        }
    }

    /**
     * Check if a route requires authentication
     * @param {string} path - Route path to check
     * @returns {boolean} Whether route requires auth
     */
    requiresAuth(path) {
        const route = this.routes[path];
        return route ? route.requiresAuth : false;
    }

    /**
     * Get the current user from Firebase auth
     * @returns {Object|null} Current user or null
     */
    getCurrentUser() {
        return auth.currentUser;
    }
}

// Create and export a single router instance
export const router = new Router();

// Export helper function to navigate
export const navigateTo = (path) => {
    router.navigate(path);
};

// Export auth check helper
export const isAuthenticated = () => {
    return auth.currentUser !== null;
};
