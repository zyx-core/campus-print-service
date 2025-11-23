import { navigateTo } from './router.js';
import { showInstallPrompt } from './install-prompt.js';

export const renderLanding = () => {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-hero">
      <!-- Navigation Header -->
      <nav class="fixed top-0 w-full z-50 transition-all duration-300" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#4F9CF9] rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
              <h1 class="text-2xl font-bold text-[#043873] tracking-tight">Port Print</h1>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-8">
              <a href="#features" class="text-gray-700 hover:text-[#4F9CF9] font-medium transition-colors">Features</a>
              <a href="#pricing" class="text-gray-700 hover:text-[#4F9CF9] font-medium transition-colors">Pricing</a>
              <a href="#how-it-works" class="text-gray-700 hover:text-[#4F9CF9] font-medium transition-colors">How It Works</a>
              <a href="#faq" class="text-gray-700 hover:text-[#4F9CF9] font-medium transition-colors">FAQ</a>
            </div>

            <!-- CTA Buttons -->
            <div class="flex items-center gap-4">
              <button id="pwa-install-button" class="hidden items-center gap-2 text-[#043873] font-semibold hover:text-[#4F9CF9] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Install
              </button>
              <button id="navLoginBtn" class="text-[#043873] font-semibold hover:text-[#4F9CF9] transition-colors">
                Login
              </button>
              <button id="navSignupBtn" class="bg-[#4F9CF9] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#2F7ACF] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>
          </div>
        </div>
        
        <!-- Install Prompt Character (Only shows when install button is visible) -->
        <div id="install-character" class="hidden fixed top-24 right-8 z-40 animate-bounce">
          <div class="relative">
            <!-- Speech Bubble -->
            <div class="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-2xl p-4 border-4 border-[#4F9CF9] min-w-[200px]">
              <p class="text-[#043873] font-bold text-sm whitespace-nowrap">
                👆 Makale, ippo thanne install cheyto!
              </p>
              <!-- Bubble Arrow -->
              <div class="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#4F9CF9]"></div>
            </div>
            <!-- Character Emoji -->
            <div class="text-6xl">
              👨‍💻
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Hero Content -->
            <div class="fade-in-up">
              <div class="inline-block mb-4 px-4 py-2 bg-[#4F9CF9] bg-opacity-10 rounded-full">
                <span class="text-[#4F9CF9] font-semibold text-sm">🎓 Students, Ithokke GOAT Stuff Aan!</span>
              </div>
              
              <h1 class="text-5xl md:text-6xl font-bold text-[#043873] mb-6 leading-tight">
                Port Print: NO CAP!<br/>
                <span class="text-gradient-blue"> Online Campus Printing Service!</span> 🔥
              </h1>
              
              <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                Ningalude document slay aakki upload cheyyu, online-il pay cheyyu, bet, next day college-il vannu collect cheyyu. 
                <span class="font-semibold text-[#043873]">Starting just ₹1/page! What a W!</span>
              </p>

              <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <button id="heroGetStartedBtn" class="bg-[#4F9CF9] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#2F7ACF] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  👉🏼 Ippo Thanney Get Started Free (Enthina Simp-aavunnath?)
                </button>
                <button id="heroLearnMoreBtn" class="border-2 border-[#043873] text-[#043873] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#043873] hover:text-white transition-all">
                  👉🏼 Kooduthal Ariyaan (Vibe Check Venamenkil)
                </button>
              </div>

              <!-- Stats -->
              <div class="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div class="text-3xl font-bold text-[#043873]">💯500+</div>
                  <div class="text-sm text-gray-500">Documents Printed (Nammal Flex Cheyyukayanu!)</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-[#043873]">⭐95%</div>
                  <div class="text-sm text-gray-500">Satisfaction Rate (Slayed!)</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-[#043873]">🚀Next Day</div>
                  <div class="text-sm text-gray-500">Pickup Time (Fast Aanu, No Cap!)</div>
                </div>
              </div>
            </div>

            <!-- Hero Image Placeholder -->
            <div class="fade-in-up hidden md:block">
              <div class="relative">
                <div class="absolute -top-4 -left-4 w-72 h-72 bg-[#4F9CF9] opacity-20 rounded-full filter blur-3xl"></div>
                <div class="absolute -bottom-4 -right-4 w-72 h-72 bg-[#FFE492] opacity-20 rounded-full filter blur-3xl"></div>
                <div class="relative bg-white rounded-2xl shadow-2xl p-8 border-8 border-[#4F9CF9] border-opacity-10">
                  <div class="text-center">
                    <div class="text-8xl mb-4">📄</div>
                    <div class="text-6xl mb-4">➡️</div>
                    <div class="text-8xl mb-4">🖨️</div>
                    <div class="text-2xl font-bold text-[#043873]">Upload → Print → Collect (The whole scene is smooth!)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-[#043873] mb-4">
              ₹1/Page: Why We STAN! (Campus Vibe Check!)
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Busy-aaya college students-nu vendi nammal fire aayitt design cheythu.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="fade-in-up hover-lift bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div class="w-16 h-16 bg-[#4F9CF9] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <span class="text-4xl">⚡</span>
              </div>
              <h3 class="text-2xl font-bold text-[#043873] mb-4">⚡ Lightning Fast (Ithinte Speed വേറെയാ!)</h3>
              <p class="text-gray-600 leading-relaxed">
                PDF seconds-ukalkullil upload cheyyam. Next-day pickup confirm! Last-minute tension-il shook aavanda.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="fade-in-up hover-lift bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div class="w-16 h-16 bg-[#4F9CF9] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <span class="text-4xl">💰</span>
              </div>
              <h3 class="text-2xl font-bold text-[#043873] mb-4">💰 Super Affordable (Moneypurse Full Aayirikkatte - Adyam Ithu Vayikku!)</h3>
              <p class="text-gray-600 leading-relaxed">
                ₹1/page-il thudangunna double-sided prints! This is not a drill—oru roopaykku oru page! Hidden fees onnum illaatha transparent pricing. Student budget-nu GOAT option!
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="fade-in-up hover-lift bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div class="w-16 h-16 bg-[#4F9CF9] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <span class="text-4xl">📍</span>
              </div>
              <h3 class="text-2xl font-bold text-[#043873] mb-4">📍 Campus Convenient (Doorstep Aanu, Almost!)</h3>
              <p class="text-gray-600 leading-relaxed">
                UKF CET Campus-il vechu thanne ningalude prints edukkam. Printing shop-ukal thedi low-key yelupanda. College students-nu vendi college-il thanne service! Time save cheyyam, Gyaan vaayikkam!
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#043873] to-[#1e3a8a] text-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              Port Print Works Cheyyunnath Ee Vidham (No Cap Scene)
            </h2>
            <p class="text-xl text-gray-200 max-w-2xl mx-auto">
              4 simple steps-il W adikkam.
            </p>
          </div>

          <div class="grid md:grid-cols-4 gap-8">
            <!-- Step 1 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-[#4F9CF9] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 class="text-xl font-bold mb-3">Sign Up (College Email Ithu Oru Rule Aanu)</h3>
              <p class="text-gray-300">College email ID vechu oru free account thudanguka.</p>
            </div>

            <!-- Step 2 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-[#4F9CF9] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 class="text-xl font-bold mb-3">Upload PDF (PDF Aayirikkanam, Periodt.)</h3>
              <p class="text-gray-300">Ningalude document upload cheyyu, print options select cheyyu.</p>
            </div>

            <!-- Step 3 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-[#4F9CF9] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 class="text-xl font-bold mb-3">Pay & Submit (Security Fire Aanu!)</h3>
              <p class="text-gray-300">Payment cheythu request submit cheyyuka.</p>
            </div>

            <!-- Step 4 -->
            <div class="fade-in-up text-center">
              <div class="w-20 h-20 bg-[#4F9CF9] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 class="text-xl font-bold mb-3">Pick Up (Big W for You!)</h3>
              <p class="text-gray-300">Next day campus-il ninnu ningalude prints collect cheyyuka. Slay!</p>
            </div>
          </div>

          <div class="text-center mt-12">
            <button id="howItWorksCTA" class="bg-white text-[#043873] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
              👉🏼 Ippo Thanney Start Printing → (Don't Be Sus! Save Money!)
            </button>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-[#043873] mb-4">
              Simple, Transparent Pricing (₹1/Page Is The Main Character!)
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Ethrayo athrayum matrame pay cheyyendu.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <!-- Pricing Card 1 -->
            <div class="fade-in-up bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-[#4F9CF9] transition-all">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-[#043873] mb-2">Single-Sided (Still a W!)</h3>
                <div class="text-5xl font-bold text-[#4F9CF9] mb-4">₹1.50<span class="text-xl text-gray-500">/page</span></div>
                <ul class="text-left space-y-3 mb-6">
                  <li class="flex items-center gap-3">
                    <span class="text-green-500">✓</span>
                    <span>Black & White Printing</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-green-500">✓</span>
                    <span>Standard Quality</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-green-500">✓</span>
                    <span>Free Stapling</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Pricing Card 2 (Recommended) -->
            <div class="fade-in-up bg-[#4F9CF9] rounded-2xl p-8 border-2 border-[#4F9CF9] relative shadow-xl">
              <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FFE492] text-[#043873] px-4 py-1 rounded-full text-sm font-bold">
                RECOMMENDED: Double-Sided (Bussin' Option!)
              </div>
              <div class="text-center text-white">
                <h3 class="text-2xl font-bold mb-2">Double-Sided</h3>
                <div class="text-5xl font-bold mb-4">₹1.00<span class="text-xl opacity-75">/page</span></div>
                <ul class="text-left space-y-3 mb-6">
                  <li class="flex items-center gap-3">
                    <span class="text-[#FFE492]">✓</span>
                    <span>The Legendary ₹1/Page Price!</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-[#FFE492]">✓</span>
                    <span>Eco-Friendly & Cheaper (Fire!)</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <span class="text-[#FFE492]">✓</span>
                    <span>Free Stapling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Additional Services -->
          <div class="fade-in-up bg-gray-50 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 class="text-xl font-bold text-[#043873] mb-4 text-center">Additional Services (Drip Vendaathavar Arellam)</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-700">📎 Stapling</span>
                <span class="font-bold text-[#043873]">Free (W!)</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700">📘 Spiral Binding</span>
                <span class="font-bold text-[#043873]">₹25/document (Final project slay cheyyan!)</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-700">📑 Multiple Copies</span>
                <span class="font-bold text-[#043873]">Same Rate × Copies (Kopikal flex cheythu edukkam!)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16 fade-in-up">
            <h2 class="text-4xl md:text-5xl font-bold text-[#043873] mb-4">
              Frequently Asked Questions (F.A.Q. - Tea Spill Cheyyaan Ready!)
            </h2>
            <p class="text-xl text-gray-600">
              Samsayam Theerkkaam.
            </p>
          </div>

          <div class="space-y-6">
            <!-- FAQ Item -->
            <div class="fade-in-up bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[#043873] mb-2">📦 When can I pick up my prints?</h3>
              <p class="text-gray-600">
                Next-day pickup guarantee! No Cap! Innu upload cheythal, naale college-il collection-nu ready aayirikkum.
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[#043873] mb-2">💳 What payment methods do you accept?</h3>
              <p class="text-gray-600">
                Ippo Cash on Delivery (COD) matrame ullu. Pick up cheyyumbol paisa kodukkam. Online options pettennu varum, bet!
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[#043873] mb-2">📄 What file formats do you support?</h3>
              <p class="text-gray-600">
                PDF files matrame support cheyyunnathullu. Word, PowerPoint okke PDF-lekku maattiyittu upload cheyyuka, illenkil Big Yikes aakum.
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[#043873] mb-2">📏 Is there a page limit?</h3>
              <p class="text-gray-600">
                Page limit illa! 5 pages venamo atho 500 venamo, chill aayi print cheythu tharam. File size limit 300MB aayirikkanam.
              </p>
            </div>

            <div class="fade-in-up bg-white rounded-xl p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[#043873] mb-2">🎓 Is this only for UKF CET students?</h3>
              <p class="text-gray-600">
                Yes, only for UKFCET students.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-animated">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 fade-in-up">
            Ready To Print Smart-aayi? (Enthu Kaanichaanu! ₹1/Page!)
          </h2>
          <p class="text-xl mb-8 fade-in-up opacity-90">
            Ningalum Port Print-inte fam-il join cheyyu!
          </p>
          <button id="finalCTA" class="fade-in-up bg-white text-[#043873] px-10 py-5 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
            👉🏼 Get Started Free → (Ithu Oru W Move Aanu!)
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-[#043873] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8 mb-8">
            <!-- Brand -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-[#4F9CF9] rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
                <h3 class="text-2xl font-bold">Port Print</h3>
              </div>
              <p class="text-gray-300 mb-4">
                Fast, affordable, and hassle-free campus printing service for UKF CET students.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h4 class="font-bold text-lg mb-4">Quick Links</h4>
              <ul class="space-y-2">
                <li><a href="#features" class="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" class="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" class="text-gray-300 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" class="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="font-bold text-lg mb-4">Contact</h4>
              <ul class="space-y-2 text-gray-300">
                <li><a href="mailto:ershadpersonal123@gmail.com" class="hover:text-white transition-colors">📧 ershadpersonal123@gmail.com</a></li>
                <li><a href="https://wa.me/917994238524" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">📱 WhatsApp: +91 7994238524</a></li>
                <li>📍 UKF CET Campus</li>
              </ul>
            </div>
          </div>

          <div class="border-t border-gray-600 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Port Print. All rights reserved. Made with ❤️ for UKF CET students.</p>
          </div>
        </div>
      </footer>
    </div>
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
      nav.classList.add('glass', 'shadow-lg');
    } else {
      nav.classList.remove('glass', 'shadow-lg');
    }
  });

  // CTA Button Handlers - connected to router
  const loginBtn = document.getElementById('navLoginBtn');
  const signupBtns = [
    document.getElementById('navSignupBtn'),
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
};
