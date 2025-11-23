import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { showInstallPrompt, isInstallAvailable } from './install-prompt.js';
import { navigateTo } from './router.js';


export const renderLogin = () => {
  console.log("[Login] Rendering login page");
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-[#111]">
      <div class="w-full max-w-[400px] flex flex-col items-center">
        <!-- Logo -->
        <div class="mb-8">
          <div class="w-12 h-12 bg-[#043873] rounded-xl flex items-center justify-center shadow-md">
            <span class="text-white text-xl font-bold">P</span>
          </div>
        </div>

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold tracking-tight mb-2 text-[#043873]">Welcome to Port Print</h1>
          <p class="text-gray-500 font-medium">Start printing now.</p>
        </div>

        <!-- Error Message -->
        <div id="errorMessage" class="hidden w-full mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p class="text-sm text-red-600 text-center"></p>
        </div>

        <!-- Google Sign-In Button -->
        <button id="googleSignInBtn" class="w-full bg-[#043873] text-white h-12 rounded-lg font-medium hover:bg-[#032d5e] transition-all flex items-center justify-center gap-3 mb-6 shadow-sm hover:shadow-md">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <!-- Divider -->
        <div class="relative w-full mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs font-medium text-gray-400">
            <span class="px-4 bg-white">OR</span>
          </div>
        </div>

        <!-- Email/Password Form -->
        <form id="loginForm" class="w-full space-y-3">
          <div>
            <input 
              type="email" 
              id="email" 
              class="w-full bg-gray-50 border-none rounded-lg px-4 h-12 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#4F9CF9] transition-all" 
              placeholder="Enter your work email..."
              required
            >
          </div>

          <div>
            <input 
              type="password" 
              id="password" 
              class="w-full bg-gray-50 border-none rounded-lg px-4 h-12 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#4F9CF9] transition-all" 
              placeholder="Password"
              required
            >
          </div>

          <button 
            type="submit" 
            id="loginBtn" 
            class="w-full bg-[#4F9CF9] text-white h-12 rounded-lg font-bold hover:bg-[#2F7ACF] transition-all mt-2 shadow-sm hover:shadow-md"
          >
            Continue
          </button>
        </form>

        <!-- Sign Up Link -->
        <p class="mt-8 text-sm text-gray-500">
          Don't have an account? 
          <a href="#" id="showSignup" class="text-[#4F9CF9] font-bold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  `;

  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const loginBtn = document.getElementById('loginBtn');
  const googleSignInBtn = document.getElementById('googleSignInBtn');

  const showError = (message) => {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
  };

  const hideError = () => {
    errorMessage.classList.add('hidden');
  };

  // Email/Password Login Handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      console.log("[Login] Form submitted");
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in...';

      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("[Login] Login successful");
        // Auth state change will handle navigation
      } catch (error) {
        console.error("[Login] Error:", error);

        let errorMsg = 'Invalid email or password';
        if (error.code === 'auth/user-not-found') {
          errorMsg = 'No account found with this email. Try signing up instead.';
        } else if (error.code === 'auth/wrong-password') {
          errorMsg = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
          errorMsg = 'Please enter a valid email address.';
        } else if (error.message) {
          errorMsg = error.message;
        }

        showError(errorMsg);
        loginBtn.disabled = false;
        loginBtn.textContent = 'Continue';
      }
    });
  } else {
    console.error("[Login] Login form not found!");
  }

  // Google Sign-In Handler
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
      hideError();
      googleSignInBtn.disabled = true;
      googleSignInBtn.textContent = 'Signing in...';

      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        console.log("[Login] Google sign-in successful");
        // Auth state change will handle navigation
      } catch (error) {
        console.error("[Login] Google sign-in error:", error);

        let errorMsg = 'Failed to sign in with Google';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMsg = 'Sign-in cancelled. Please try again.';
        } else if (error.message) {
          errorMsg = error.message;
        }

        showError(errorMsg);
        googleSignInBtn.disabled = false;
        googleSignInBtn.innerHTML = `
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        `;
      }
    });
  }

  // Navigate to Signup
  const showSignupBtn = document.getElementById('showSignup');
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("[Login] Switching to Signup");
      navigateTo('/signup');
    });
  } else {
    console.error("[Login] Show Signup button not found!");
  }

  // PWA Install Button Handler
  const pwaInstallBtn = document.getElementById('pwa-install-button');
  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', () => {
      showInstallPrompt();
    });
  }
};


export const renderSignup = () => {
  console.log("[Signup] Rendering signup page");
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen bg-[#E5E5E5] flex items-center justify-center p-4 font-sans">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
        
        <!-- Left Side: Marketing Content (Deep Blue Theme) -->
        <div class="w-full md:w-1/2 bg-[#043873] p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <!-- Decorative Element -->
          <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#4F9CF9] opacity-10 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#FFE492] opacity-5 blur-3xl"></div>

          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-6">
              <!-- Logo Icon -->
              <div class="w-10 h-10 bg-[#4F9CF9] rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
              <h1 class="text-3xl font-bold tracking-tight">Port Print</h1>
            </div>
            
            <h2 class="text-3xl font-bold mb-4 leading-tight">🚀 Join Port Print!</h2>
            
            <p class="mb-6 text-gray-200 text-base leading-relaxed">
              Create your free account and start printing smarter!<br/>
              <span class="text-[#FFE492] font-semibold">No credit card required.</span> 🎉
            </p>

            <div class="bg-white bg-opacity-5 rounded-lg p-4 mb-6 border border-white border-opacity-10">
              <p class="text-gray-100 mb-3">
                ✨ <span class="font-bold text-white">What you get:</span>
              </p>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-[#FFE492]">✓</span>
                  <span class="text-gray-200">Instant access to print services</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#FFE492]">✓</span>
                  <span class="text-gray-200">Upload unlimited PDFs (up to 300MB each)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#FFE492]">✓</span>
                  <span class="text-gray-200">Track your print requests in real-time</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[#FFE492]">✓</span>
                  <span class="text-gray-200">Next-day campus pickup guaranteed</span>
                </div>
              </div>
            </div>

            <div class="bg-[#4F9CF9] bg-opacity-15 rounded-lg p-4 mb-6 border border-[#4F9CF9] border-opacity-30">
              <p class="text-white text-sm leading-relaxed">
                💡 <span class="font-bold">Pro tip:</span> Use your college email for faster verification and exclusive student discounts!
              </p>
            </div>

            <p class="text-gray-300 text-sm italic">
              Already printing smart with 500+ students...<br/>
              <span class="text-[#FFE492] font-bold not-italic">Join them now! 🎓✨</span>
            </p>
          </div>
        </div>

        <!-- Right Side: Signup Form -->
        <div class="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-white">
          <div class="w-full max-w-md">
            <h2 class="text-3xl font-bold mb-2 text-[#043873]">Create Account</h2>
            <p class="text-gray-500 mb-8">Start your printing journey today</p>

            <div id="errorMessage" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600"></p>
            </div>

            <form id="signupForm" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-[#043873] mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  class="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm p-3 focus:ring-[#4F9CF9] focus:border-[#4F9CF9] transition-all bg-gray-50" 
                  placeholder="student@ukfcet.ac.in" 
                  required
                >
                <p class="text-xs text-gray-500 mt-1">Use your college email for verification</p>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-[#043873] mb-1">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  class="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm p-3 focus:ring-[#4F9CF9] focus:border-[#4F9CF9] transition-all bg-gray-50" 
                  placeholder="••••••••" 
                  minlength="6"
                  required
                >
                <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#043873] mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  class="mt-1 block w-full border border-gray-200 rounded-lg shadow-sm p-3 focus:ring-[#4F9CF9] focus:border-[#4F9CF9] transition-all bg-gray-50" 
                  placeholder="••••••••" 
                  required
                >
              </div>

              <div class="flex items-start">
                <input 
                  type="checkbox" 
                  id="terms" 
                  class="mt-1 rounded border-gray-300 text-[#4F9CF9] focus:ring-[#4F9CF9]" 
                  required
                >
                <label for="terms" class="ml-2 text-sm text-gray-600">
                  I agree to the <a href="#" class="text-[#4F9CF9] hover:underline">Terms of Service</a> and <a href="#" class="text-[#4F9CF9] hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button 
                type="submit" 
                id="signupBtn" 
                class="w-full bg-[#4F9CF9] text-white py-3.5 rounded-lg font-bold hover:bg-[#2F7ACF] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Account
              </button>
            </form>
            
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-400">Or sign up with</span>
              </div>
            </div>

            <button id="googleSignUpBtn" class="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm hover:shadow-md">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <p class="mt-8 text-center text-sm text-gray-500">
              Already have an account? <a href="#" id="showLogin" class="text-[#4F9CF9] font-bold hover:underline">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');
  const signupBtn = document.getElementById('signupBtn');
  const googleSignUpBtn = document.getElementById('googleSignUpBtn');

  const showError = (message) => {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
  };

  const hideError = () => {
    errorMessage.classList.add('hidden');
  };

  // Email/Password Signup Handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      console.log("[Signup] Form submitted");
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const termsAccepted = document.getElementById('terms').checked;

      // Validation
      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
      }

      if (!termsAccepted) {
        showError('You must accept the Terms of Service and Privacy Policy');
        return;
      }

      console.log("[Signup] Attempting signup with:", email);

      signupBtn.disabled = true;
      signupBtn.textContent = 'Creating account...';

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("[Signup] Account created successfully");
        // Auth state change will handle navigation to dashboard
      } catch (error) {
        console.error("[Signup] Error:", error);

        // User-friendly error messages
        let errorMsg = 'Failed to create account';
        if (error.code === 'auth/email-already-in-use') {
          errorMsg = 'This email is already registered. Try logging in instead.';
        } else if (error.code === 'auth/invalid-email') {
          errorMsg = 'Please enter a valid email address';
        } else if (error.code === 'auth/weak-password') {
          errorMsg = 'Password is too weak. Use a stronger password.';
        } else if (error.message) {
          errorMsg = error.message;
        }

        showError(errorMsg);
        signupBtn.disabled = false;
        signupBtn.textContent = 'Create Account';
      }
    });
  } else {
    console.error("[Signup] Signup form not found!");
  }

  // Google Sign-Up Handler
  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener('click', async () => {
      hideError();
      googleSignUpBtn.disabled = true;
      googleSignUpBtn.textContent = 'Signing up...';

      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        console.log("[Signup] Google sign-up successful");
        // Auth state change will handle navigation
      } catch (error) {
        console.error("[Signup] Google sign-up error:", error);

        let errorMsg = 'Failed to sign up with Google';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMsg = 'Sign-up cancelled. Please try again.';
        } else if (error.message) {
          errorMsg = error.message;
        }

        showError(errorMsg);
        googleSignUpBtn.disabled = false;
        googleSignUpBtn.innerHTML = `
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        `;
      }
    });
  }

  // Navigate to Login
  const showLoginBtn = document.getElementById('showLogin');
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("[Signup] Switching to Login");
      navigateTo('/login');
    });
  } else {
    console.error("[Signup] Show Login button not found!");
  }
};
