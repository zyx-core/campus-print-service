import { navigateTo } from './router.js';

export const renderInstallPage = () => {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen bg-neo-cream p-4 md:p-8">
      <div class="max-w-3xl mx-auto">
        
        <!-- Header -->
        <div class="bg-white border-4 border-black shadow-neo-lg rounded-xl p-6 mb-8 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" class="h-12 w-auto object-contain">
            <h1 class="text-2xl font-bold text-black">Install App</h1>
          </div>
          <button id="backBtn" class="neo-btn-secondary px-4 py-2 rounded-lg text-sm font-bold">
            ← Back
          </button>
        </div>

        <!-- Instructions Grid -->
        <div class="grid md:grid-cols-2 gap-8">
          
          <!-- iOS Instructions -->
          <div class="bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden">
            <div class="bg-black p-4">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="text-2xl">🍎</span> iOS (iPhone/iPad)
              </h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-start gap-4">
                <span class="bg-neo-yellow border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-bold">1</span>
                <p class="font-bold text-gray-800">Open in <span class="text-blue-600">Safari</span> browser.</p>
              </div>
              <div class="flex items-start gap-4">
                <span class="bg-neo-yellow border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-bold">2</span>
                <p class="font-bold text-gray-800">Tap the <span class="text-blue-600">Share</span> button (square with arrow).</p>
              </div>
              <div class="flex items-start gap-4">
                <span class="bg-neo-yellow border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-bold">3</span>
                <p class="font-bold text-gray-800">Scroll down and tap <span class="bg-gray-100 border border-gray-300 px-2 rounded">Add to Home Screen</span>.</p>
              </div>
            </div>
          </div>

          <!-- Android Instructions -->
          <div class="bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden">
            <div class="bg-neo-green p-4 border-b-4 border-black">
              <h2 class="text-xl font-bold text-black flex items-center gap-2">
                <span class="text-2xl">🤖</span> Android
              </h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-start gap-4">
                <span class="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-bold">1</span>
                <p class="font-bold text-gray-800">Open in <span class="text-green-600">Chrome</span> browser.</p>
              </div>
              <div class="flex items-start gap-4">
                <span class="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-bold">2</span>
                <p class="font-bold text-gray-800">Tap the <span class="font-bold">three dots</span> menu (⋮).</p>
              </div>
              <div class="flex items-start gap-4">
                <span class="bg-white border-2 border-black w-8 h-8 flex items-center justify-center rounded-full font-bold">3</span>
                <p class="font-bold text-gray-800">Tap <span class="bg-gray-100 border border-gray-300 px-2 rounded">Install App</span> or "Add to Home Screen".</p>
              </div>
            </div>
          </div>

          <!-- Desktop Instructions -->
          <div class="md:col-span-2 bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden">
            <div class="bg-neo-purple p-4 border-b-4 border-black">
              <h2 class="text-xl font-bold text-black flex items-center gap-2">
                <span class="text-2xl">💻</span> Desktop (Chrome/Edge)
              </h2>
            </div>
            <div class="p-6 flex flex-col md:flex-row items-center gap-6">
              <div class="flex-1 space-y-4">
                 <p class="font-bold text-lg">Look for the install icon in your address bar!</p>
                 <p class="text-gray-600">It usually looks like a computer monitor with a download arrow.</p>
                 <button id="installActionBtn" class="neo-btn-primary px-6 py-3 rounded-xl w-full md:w-auto hidden">
                    Click to Install Now 🚀
                 </button>
              </div>
              <div class="bg-gray-100 border-2 border-black p-4 rounded-lg">
                 <div class="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-full shadow-sm">
                    <span class="text-gray-400 text-sm">portprint.com</span>
                    <div class="ml-auto bg-blue-100 text-blue-600 p-1 rounded-full">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </div>
                 </div>
                 <p class="text-center text-xs font-bold mt-2 text-gray-500">Address Bar</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
  });

  // Check if install prompt is available for the button
  import('./install-prompt.js').then(({ isInstallAvailable, showInstallPrompt }) => {
      if (isInstallAvailable()) {
          const btn = document.getElementById('installActionBtn');
          btn.classList.remove('hidden');
          btn.addEventListener('click', showInstallPrompt);
      }
  });
};
