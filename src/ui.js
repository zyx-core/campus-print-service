import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


export const renderLogin = () => {
  console.log("renderLogin called");
  const app = document.querySelector('#app');
  console.log("App element:", app);
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Campus Print Service</h2>
        <div id="errorMessage" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600"></p>
        </div>
        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <button type="submit" id="loginBtn" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
        
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button id="googleSignInBtn" class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p class="mt-4 text-center text-sm">
          Don't have an account? <a href="#" id="showSignup" class="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  `;
  console.log("innerHTML set");

  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const loginBtn = document.getElementById('loginBtn');
  const googleSignInBtn = document.getElementById('googleSignInBtn'); // Get Google button

  const showError = (message) => {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
  };

  const hideError = () => {
    errorMessage.classList.add('hidden');
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      console.log("Login form submitted");
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      console.log("Attempting login with:", email);

      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in...';

      try {
        await signInWithEmailAndPassword(auth, email, password);

        console.log("Login successful");
      } catch (error) {
        console.error("Login error:", error);
        showError(error.message || 'Invalid email or password');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
      }
    });
  } else {
    console.error("Login form not found!");
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
        console.log("Google sign-in successful");
      } catch (error) {
        console.error("Google sign-in error:", error);
        showError(error.message || 'Failed to sign in with Google');
        googleSignInBtn.disabled = false;
        googleSignInBtn.innerHTML = `
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        `;
      }
    });
  }


  const showSignupBtn = document.getElementById('showSignup');
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Switching to Signup");
      renderSignup();
    });
  } else {
    console.error("Show Signup button not found!");
  }
};

export const renderSignup = () => {
  console.log("renderSignup called");
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div id="errorMessage" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600"></p>
        </div>
        <form id="signupForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <button type="submit" id="signupBtn" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up</button>
        </form>
        <p class="mt-4 text-center text-sm">
          Already have an account? <a href="#" id="showLogin" class="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  `;

  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');
  const signupBtn = document.getElementById('signupBtn');

  const showError = (message) => {
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message;
  };

  const hideError = () => {
    errorMessage.classList.add('hidden');
  };

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();

      console.log("Signup form submitted");
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      console.log("Attempting signup with:", email);

      signupBtn.disabled = true;
      signupBtn.textContent = 'Creating account...';

      try {
        await createUserWithEmailAndPassword(auth, email, password);

        console.log("Signup successful");
        // Profile setup will be handled in auth state change if needed
      } catch (error) {
        console.error("Signup error:", error);
        showError(error.message || 'Failed to create account');
        signupBtn.disabled = false;
        signupBtn.textContent = 'Sign Up';
      }
    });
  } else {
    console.error("Signup form not found!");
  }

  const showLoginBtn = document.getElementById('showLogin');
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Switching to Login");
      renderLogin();
    });
  } else {
    console.error("Show Login button not found!");
  }
};
