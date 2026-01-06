import { navigateTo } from './router.js';
import { showInstallPrompt } from './install-prompt.js';

export const renderLanding = () => {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <!-- Paper Container with Border -->
    <div class="min-h-screen p-4 md:p-8">
      <div class="max-w-[1400px] mx-auto bg-white border-[8px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <!-- Content Wrapper -->
      <!-- Navigation Header -->
      <nav class="sticky top-0 w-full z-50 transition-all duration-300 bg-neo-yellow border-b-4 border-black" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <img src="/logo.png" alt="Port Print Logo" class="h-14 w-auto object-contain">
              <h1 class="text-2xl font-bold text-black tracking-tight">Port Print</h1>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-8">
              <a href="#features" class="text-black hover:text-neo-cyan font-bold transition-colors">Features</a>
              <a href="#pricing" class="text-black hover:text-neo-cyan font-bold transition-colors">Pricing</a>
              <a href="#how-it-works" class="text-black hover:text-neo-cyan font-bold transition-colors">How It Works</a>
              <a href="#faq" class="text-black hover:text-neo-cyan font-bold transition-colors">FAQ</a>
            </div>

            <!-- CTA Buttons -->
            <div class="flex items-center gap-4">
              <button id="pwa-install-button" class="hidden items-center gap-2 neo-btn-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Install
              </button>
              <button id="navLoginBtn" class="neo-btn-primary rounded-lg">
                Login
              </button>
            </div>
          </div>
        </div>
        
        <!-- Install Prompt Character -->
        <div id="install-character" class="hidden fixed top-32 right-6 z-40 animate-bounce">
          <div class="relative">
            <!-- Speech Bubble -->
            <div class="absolute bottom-full right-0 mb-1 bg-white rounded-xl border-3 border-black shadow-neo-sm p-2 min-w-[140px]">
              <p class="text-black font-bold text-xs whitespace-nowrap">
                👆 Install the app!
              </p>
              <!-- Bubble Arrow -->
              <div class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
            </div>
            <!-- Character Emoji -->
            <div class="text-3xl">
              👨‍💻
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Hero Content -->
            <div class="fade-in-up">
              <div class="inline-block mb-4 px-4 py-2 bg-neo-pink border-3 border-black rounded-full shadow-neo-sm">
                <span class="text-black font-bold text-sm">🎓 Made for UKF CET Students</span>
              </div>
              
              <h1 class="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Print Smart.<br/>
                <span class="text-neo-cyan">Save More! 💰</span>
              </h1>
              
              <p class="text-xl text-gray-800 mb-4 leading-relaxed font-bold">
                ₹1/page for Regular Prints<br/>
                <span class="text-2xl text-neo-pink">₹0.85/page for Bulk Orders!</span>
              </p>
              
              <p class="text-lg text-gray-700 mb-8 leading-relaxed">
                Affordable, Fast, and Fun Campus Printing for Everyone.
              </p>

              <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <button id="heroGetStartedBtn" class="neo-btn-primary rounded-xl text-xl flex items-center gap-2 justify-center">
                  Get Started ↗
                </button>
                <button id="heroLearnMoreBtn" class="neo-btn-secondary rounded-xl text-xl flex items-center gap-2 justify-center">
                  Learn More ⓘ
                </button>
              </div>

              <!-- Stats -->
              <div class="flex gap-8 pt-8 border-t-4 border-black">
                <div>
                  <div class="text-3xl font-bold text-black">500+</div>
                  <div class="text-sm text-gray-700">Documents Printed</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-black">95%</div>
                  <div class="text-sm text-gray-700">Satisfaction Rate</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-black">Next Day</div>
                  <div class="text-sm text-gray-700">Pickup Time</div>
                </div>
              </div>
            </div>

            <!-- Hero Illustration -->
            <div class="fade-in-up hidden md:block">
              <div class="relative">
                <!-- Floating Badge: ₹1/page -->
                <div class="absolute -top-4 -left-8 bg-neo-cyan border-4 border-black px-4 py-3 rounded-xl shadow-neo font-bold text-lg z-10 floating-badge" style="animation-delay: 0s;">
                  💰 ₹1/page
                </div>
                
                <!-- Floating Badge: Next Day Pickup -->
                <div class="absolute -bottom-4 -right-8 bg-neo-yellow border-4 border-black px-4 py-3 rounded-xl shadow-neo font-bold text-lg z-10 floating-badge" style="animation-delay: 1s;">
                  🚀 Next Day!
                </div>
                
                <!-- Printer Mascot with Float Animation -->
                <img src="/printer-mascot.png" alt="Cute printer mascot character" class="w-full h-auto max-w-lg mx-auto floating-badge" style="animation-delay: 0.5s;" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Wavy Divider -->
      <div class="wavy-divider"></div>

      <!-- Pricing Section -->
      <section id="pricing" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
              Simple, Transparent Pricing
            </h2>
            <p class="text-xl text-gray-700 max-w-2xl mx-auto">
              No hidden fees. Pay only for what you print.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <!-- Regular Pricing Card -->
            <div class="fade-in-up bg-neo-yellow rounded-2xl p-8 border-6 border-black relative shadow-neo-lg">
              <div class="text-center text-black">
                <h3 class="text-2xl font-bold mb-2">Regular Print</h3>
                <div class="text-5xl font-bold mb-4">₹1.00<span class="text-xl opacity-75">/page</span></div>
                <ul class="text-left space-y-3 mb-6">
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">Black & White Printing</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">Double-Sided (Duplex)</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">Free Stapling</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">Perfect for Assignments</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Bulk Pricing Card -->
            <div class="fade-in-up bg-neo-pink rounded-2xl p-8 border-6 border-black relative shadow-neo-lg">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-neo-cyan border-4 border-black px-4 py-1 rounded-full text-sm font-bold shadow-neo-sm">
                BEST VALUE
              </div>
              <div class="text-center text-black">
                <h3 class="text-2xl font-bold mb-2">Bulk Print with Friends</h3>
                <div class="text-5xl font-bold mb-4">₹0.85<span class="text-xl opacity-75">/page</span></div>
                <ul class="text-left space-y-3 mb-6">
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">Everything in Regular</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">15% Discount Applied</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">10+ Copies Required</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-2xl">✓</span>
                    <span class="font-bold">Save More Together!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Additional Services -->
          <div class="fade-in-up bg-neo-cream rounded-xl p-8 max-w-2xl mx-auto border-4 border-black shadow-neo">
            <h3 class="text-xl font-bold text-black mb-4 text-center">Additional Services</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-900 font-bold">📎 Stapling</span>
                <span class="font-bold text-black bg-neo-cyan px-3 py-1 border-2 border-black rounded">Free</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-900 font-bold">📘 Spiral Binding</span>
                <span class="font-bold text-black bg-neo-cyan px-3 py-1 border-2 border-black rounded">₹25/document</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-900 font-bold">📑 Multiple Copies</span>
                <span class="font-bold text-black bg-neo-cyan px-3 py-1 border-2 border-black rounded">Same Rate × Copies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Wavy Divider -->
      <div class="wavy-divider bg-white"></div>

      <!-- Features Section -->
      <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
              Why Students Love Port Print
            </h2>
            <p class="text-xl text-gray-700 max-w-2xl mx-auto">
              We've designed the perfect printing solution for busy college students
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="fade-in-up neo-card rounded-xl p-8 rotate-slight-left transition-all duration-300">
              <div class="neo-icon-badge bg-neo-cyan mb-6">
                <span>⚡</span>
              </div>
              <h3 class="text-2xl font-bold text-black mb-4">Lightning Fast</h3>
              <p class="text-gray-700 leading-relaxed">
                Upload your PDF in seconds. We guarantee next-day pickup at your college campus. No more last-minute printing stress!
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="fade-in-up neo-card rounded-xl p-8 transition-all duration-300">
              <div class="neo-icon-badge bg-neo-yellow mb-6">
                <span>💰</span>
              </div>
              <h3 class="text-2xl font-bold text-black mb-4">Super Affordable</h3>
              <p class="text-gray-700 leading-relaxed">
                Starting at just ₹1/page for double-sided prints. Transparent pricing with no hidden fees. Perfect for student budgets!
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="fade-in-up neo-card rounded-xl p-8 rotate-slight-right transition-all duration-300">
              <div class="neo-icon-badge bg-neo-pink mb-6">
                <span>📍</span>
              </div>
              <h3 class="text-2xl font-bold text-black mb-4">Campus Convenient</h3>
              <p class="text-gray-700 leading-relaxed">
                Pick up your prints right at UKF CET campus. No need to travel to printing shops. Save time and focus on studies!
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Wavy Divider -->
      <div class="wavy-divider bg-white"></div>

      <!-- How It Works Section -->
      <section id="how-it-works" class="py-20 px-4 sm:px-6 lg:px-8 bg-neo-cyan">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
              How Port Print Works
            </h2>
            <p class="text-xl text-gray-900 max-w-2xl mx-auto">
              Get your documents printed in 4 simple steps
            </p>
          </div>

          <div class="grid md:grid-cols-4 gap-8">
            <!-- Step 1 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-black border-4 border-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-neo-yellow shadow-neo">
                1
              </div>
              <h3 class="text-xl font-bold mb-3 text-black">Sign Up</h3>
              <p class="text-gray-900">Create your free account with your college email</p>
            </div>

            <!-- Step 2 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-black border-4 border-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-neo-yellow shadow-neo">
                2
              </div>
              <h3 class="text-xl font-bold mb-3 text-black">Upload PDF</h3>
              <p class="text-gray-900">Upload your document and choose print options</p>
            </div>

            <!-- Step 3 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-black border-4 border-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-neo-yellow shadow-neo">
                3
              </div>
              <h3 class="text-xl font-bold mb-3 text-black">Pay & Submit</h3>
              <p class="text-gray-900">Make secure payment and submit your request</p>
            </div>

            <!-- Step 4 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-black border-4 border-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-neo-yellow shadow-neo">
                4
              </div>
              <h3 class="text-xl font-bold mb-3 text-black">Pick Up</h3>
              <p class="text-gray-900">Collect your prints next day at campus</p>
            </div>
          </div>

          <div class="text-center mt-12">
            <button id="howItWorksCTA" class="neo-btn-secondary rounded-xl text-xl">
              Start Printing Now →
            </button>
          </div>
        </div>
      </section>

      <!-- Wavy Divider -->
      <div class="wavy-divider bg-neo-cyan"></div>

      <!-- Pricing Section -->
      <!-- FAQ Section -->
      <section id="faq" class="py-20 px-4 sm:px-6 lg:px-8 bg-neo-cream">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-black mb-4">
              Frequently Asked Questions
            </h2>
            <p class="text-xl text-gray-700">
              Got questions? We've got answers.
            </p>
          </div>

          <div class="space-y-6">
            <!-- FAQ Item -->
            <div class="fade-in-up bg-white rounded-xl p-6 border-4 border-black shadow-neo">
              <h3 class="text-lg font-bold text-black mb-2">📦 When can I pick up my prints?</h3>
              <p class="text-gray-700">
                We guarantee next-day pickup! Upload your document today, and it'll be ready for collection at the campus tomorrow.
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 border-4 border-black shadow-neo">
              <h3 class="text-lg font-bold text-black mb-2">💳 What payment methods do you accept?</h3>
              <p class="text-gray-700">
                We currently accept Cash on Delivery (COD). You can pay when you pick up your prints at campus. Online payment options coming soon!
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 border-4 border-black shadow-neo">
              <h3 class="text-lg font-bold text-black mb-2">📄 What file formats do you support?</h3>
              <p class="text-gray-700">
                Currently, we only accept PDF files. Make sure to convert your Word documents, presentations, or images to PDF before uploading.
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 border-4 border-black shadow-neo">
              <h3 class="text-lg font-bold text-black mb-2">📏 Is there a page limit?</h3>
              <p class="text-gray-700">
                No page limit! Whether you need 5 pages or 500 pages printed, we've got you covered. File size limit is 300MB.
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 border-4 border-black shadow-neo">
              <h3 class="text-lg font-bold text-black mb-2">🎓 Is this only for UKF CET students?</h3>
              <p class="text-gray-700">
                Currently, yes! Port Print is exclusively for UKF CET students. You'll need to sign up with your college email.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-neo-pink">
        <div class="max-w-4xl mx-auto text-center text-black">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 fade-in-up">
            Ready to Print Smart?
          </h2>
          <p class="text-xl mb-8 fade-in-up">
            Join hundreds of students who've made printing hassle-free with Port Print
          </p>
          <button id="finalCTA" class="fade-in-up neo-btn-secondary rounded-xl text-xl">
            Get Started Free →
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-black text-white py-12 px-4 sm:px-6 lg:px-8 border-t-6 border-black">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <!-- Brand -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-neo-cyan border-4 border-white rounded-lg flex items-center justify-center text-black font-bold text-xl">P</div>
                <h3 class="text-2xl font-bold">Port Print</h3>
              </div>
              <p class="text-gray-300 mb-4">
                Fast, affordable, and hassle-free campus printing service for UKF CET students.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h4 class="font-bold text-lg mb-4 text-neo-yellow">Quick Links</h4>
              <ul class="space-y-2">
                <li><a href="#features" class="text-gray-300 hover:text-neo-cyan transition-colors">Features</a></li>
                <li><a href="#pricing" class="text-gray-300 hover:text-neo-cyan transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" class="text-gray-300 hover:text-neo-cyan transition-colors">How It Works</a></li>
                <li><a href="#faq" class="text-gray-300 hover:text-neo-cyan transition-colors">FAQ</a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="font-bold text-lg mb-4 text-neo-yellow">Contact</h4>
              <ul class="space-y-2 text-gray-300">
                <li><a href="mailto:ershadpersonal123@gmail.com" class="hover:text-neo-cyan transition-colors">📧 ershadpersonal123@gmail.com</a></li>
                <li><a href="https://wa.me/917994238524" target="_blank" rel="noopener noreferrer" class="hover:text-neo-cyan transition-colors">📱 WhatsApp: +91 7994238524</a></li>
                <li>📍 UKF CET Campus</li>
              </ul>
            </div>
          </div>

          <div class="border-t-4 border-neo-yellow pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Port Print. All rights reserved. Made with ❤️ for UKF CET students. Developed by Ershad.</p>
          </div>
        </div>
      </footer>
      </div>
      <!-- End Content Wrapper -->
    </div>
    <!-- End Paper Container -->
  `;

  // Add scroll animation observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  setTimeout(() => {
    document.querySelectorAll('.fade-in-up').forEach(el => {
      observer.observe(el);
    });
  }, 100);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Glassmorphism effect on scroll
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('shadow-neo');
    } else {
      nav.classList.remove('shadow-neo');
    }
  });

  // CTA Button Handlers - connected to router
  const loginBtn = document.getElementById('navLoginBtn');
  const signupBtns = [
    document.getElementById('heroGetStartedBtn'),
    document.getElementById('howItWorksCTA'),
    document.getElementById('finalCTA')
  ];

  loginBtn.addEventListener('click', () => {
    console.log('[Landing] Navigating to login');
    navigateTo('/login');
  });

  signupBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        console.log('[Landing] Navigating to signup');
        navigateTo('/signup');
      });
    }
  });

  // Learn More button - smooth scroll to features
  const learnMoreBtn = document.getElementById('heroLearnMoreBtn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      document.querySelector('#features').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  // PWA Install Button Handler
  const pwaInstallBtn = document.getElementById('pwa-install-button');
  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', () => {
      showInstallPrompt();
    });
  }

  // Hide install character on scroll to prevent overlap
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const character = document.getElementById('install-character');
    if (character && window.scrollY > 50) {
      character.classList.add('hidden');

      // Show again after user stops scrolling and is at top
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY <= 50 && !character.classList.contains('hidden')) {
          character.classList.remove('hidden');
        }
      }, 1000);
    } else if (character && window.scrollY <= 50) {
      // Only show if install button is visible
      const installBtn = document.getElementById('pwa-install-button');
      if (installBtn && installBtn.style.display === 'flex') {
        character.classList.remove('hidden');
      }
    }
  });
};
