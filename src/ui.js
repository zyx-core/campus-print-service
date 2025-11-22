import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


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
