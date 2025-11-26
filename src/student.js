import { auth, db, storage } from './firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { supabase } from './supabase';
import { PDFDocument } from 'pdf-lib';
import { formatCurrency, formatDate, sanitizeFileName } from './utils';
import { navigateTo } from './router.js';

export const renderStudentDashboard = (user) => {
  const app = document.querySelector('#app');
  app.innerHTML = `
  <div class="min-h-screen bg-white p-4 md:p-8">
    
    <!-- Navigation -->
    <nav class="max-w-5xl mx-auto mb-8 flex justify-between items-center bg-white border-4 border-black p-4 shadow-neo-sm">
      <div class="flex items-center gap-4">
        <a href="#/" id="homeLink" class="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
          <div class="w-10 h-10 bg-neo-yellow border-3 border-black rounded flex items-center justify-center text-black font-bold text-xl">P</div>
          <h1 class="text-xl font-bold text-black hidden sm:block">Port Print</h1>
        </a>
        <div class="h-8 w-1 bg-black hidden sm:block"></div>
        <span class="text-gray-600 font-bold hidden sm:block">Dashboard</span>
      </div>
      
      <div class="flex items-center gap-4">
        <span class="text-sm font-bold hidden md:block bg-neo-cream px-3 py-1 border-2 border-black rounded-full">${user.email}</span>
        <button id="logoutBtn" class="neo-btn-secondary text-sm px-4 py-2 rounded-lg">Logout</button>
      </div>
    </nav>

    <main class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
      
      <!-- Left Column: Request Form -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Step 1: Upload -->
        <div class="bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden">
          <div class="bg-neo-cyan border-b-4 border-black p-4 flex justify-between items-center">
            <h2 class="text-xl font-bold text-black flex items-center gap-2">
              <span class="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Upload Files
            </h2>
            <span class="text-xs font-bold bg-white px-2 py-1 border-2 border-black rounded">PDF Only</span>
          </div>
          
          <div class="p-6">
            <div class="flex items-center justify-center w-full">
              <label for="file-upload" class="flex flex-col items-center justify-center w-full h-40 border-4 border-black border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-neo-cream transition-colors group">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <div class="mb-3 text-4xl group-hover:scale-110 transition-transform">📂</div>
                  <p class="mb-2 text-sm text-black font-bold">Click to upload or drag and drop</p>
                  <p class="text-xs text-gray-500 font-bold">Max 300MB per file</p>
                </div>
                <input id="file-upload" type="file" class="hidden" accept="application/pdf" multiple />
              </label>
            </div>
            
            <!-- File List -->
            <div id="fileList" class="mt-4 space-y-3 hidden"></div>
            <p id="pageCountDisplay" class="mt-2 text-sm font-bold text-neo-cyan hidden"></p>
          </div>
        </div>

        <!-- Step 2: Settings -->
        <div id="optionsSection" class="bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden opacity-50 pointer-events-none transition-all duration-300">
          <div class="bg-neo-yellow border-b-4 border-black p-4">
            <h2 class="text-xl font-bold text-black flex items-center gap-2">
              <span class="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Print Settings
            </h2>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-black mb-2">Print Mode</label>
                <select id="printMode" class="w-full border-4 border-black rounded-lg p-3 font-bold bg-white focus:ring-4 focus:ring-neo-cyan outline-none">
                  <option value="bw">Black & White</option>
                  <option value="color" disabled>Color (Coming Soon)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-black mb-2">Sides</label>
                <select id="duplex" class="w-full border-4 border-black rounded-lg p-3 font-bold bg-white focus:ring-4 focus:ring-neo-cyan outline-none">
                  <option value="duplex" selected>Double-sided (Save Paper! 🌱)</option>
                  <option value="simplex">Single-sided</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-black mb-2">Copies</label>
                <div class="flex items-center">
                  <button id="decCopies" class="bg-gray-200 border-4 border-black border-r-0 rounded-l-lg p-3 font-bold hover:bg-gray-300">-</button>
                  <input type="number" id="copies" min="1" value="1" class="w-full border-4 border-black p-3 text-center font-bold bg-white outline-none">
                  <button id="incCopies" class="bg-gray-200 border-4 border-black border-l-0 rounded-r-lg p-3 font-bold hover:bg-gray-300">+</button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-black mb-2">Finishing</label>
                <select id="finishing" class="w-full border-4 border-black rounded-lg p-3 font-bold bg-white focus:ring-4 focus:ring-neo-cyan outline-none">
                  <option value="none">None</option>
                  <option value="staple">Staple (Free)</option>
                  <option value="spiral">Spiral Binding (+₹25)</option>
                </select>
              </div>
            </div>
            
            <!-- Bulk Discount Badge -->
            <div id="bulkDiscountBadge" class="hidden bg-neo-pink border-4 border-black p-3 rounded-lg text-center transform rotate-1">
              <p class="font-bold text-black">🎉 Bulk Discount Applied! (₹0.85/page)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Summary & History -->
      <div class="space-y-8">
        
        <!-- Step 3: Summary (Sticky) -->
        <div class="bg-white border-4 border-black shadow-neo rounded-xl overflow-hidden sticky top-4">
          <div class="bg-neo-pink border-b-4 border-black p-4">
            <h2 class="text-xl font-bold text-black flex items-center gap-2">
              <span class="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Summary
            </h2>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center text-gray-600 font-bold">
              <span>Total Pages:</span>
              <span id="summaryPages">0</span>
            </div>
            <div class="flex justify-between items-center text-gray-600 font-bold">
              <span>Copies:</span>
              <span id="summaryCopies">1</span>
            </div>
             <div class="flex justify-between items-center text-gray-600 font-bold">
              <span>Finishing:</span>
              <span id="summaryFinishing">None</span>
            </div>
            
            <div class="border-t-4 border-black my-4"></div>
            
            <div class="flex justify-between items-end mb-2">
              <span class="text-xl font-bold text-black">Total Cost:</span>
              <span id="totalCost" class="text-4xl font-bold text-neo-cyan">₹0</span>
            </div>
            <div id="costBreakdown" class="text-xs text-gray-500 text-right font-bold"></div>
            
            <button id="submitRequestBtn" class="w-full neo-btn-primary rounded-xl text-lg py-4 mt-4 opacity-50 cursor-not-allowed" disabled>
              Submit Request 🚀
            </button>
            <p class="text-xs text-center text-gray-500 font-bold mt-2">Pay via UPI/Cash on pickup</p>
          </div>
        </div>

        <!-- My Requests Link -->
        <div class="bg-neo-cream border-4 border-black shadow-neo rounded-xl p-6 text-center">
          <h3 class="font-bold text-lg mb-2">Recent Activity</h3>
          <p class="text-sm text-gray-600 mb-4">Track your previous print jobs</p>
          <button id="viewHistoryBtn" class="neo-btn-white w-full text-sm">View My Requests</button>
        </div>
      </div>

    </main>
    
    <!-- Requests Modal (Hidden by default) -->
    <div id="requestsModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
      <div class="bg-white border-4 border-black shadow-neo-lg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-neo-yellow border-b-4 border-black p-4 flex justify-between items-center">
          <h2 class="text-xl font-bold text-black">My Requests</h2>
          <button id="closeModalBtn" class="text-black hover:text-red-600 font-bold text-xl">&times;</button>
        </div>
        <div class="p-6 overflow-y-auto flex-grow">
          <div id="requestsList" class="space-y-4">
            <!-- Requests injected here -->
            <div class="text-center py-8 text-gray-500 font-bold">Loading requests...</div>
          </div>
        </div>
      </div>
    </div>

  </div>
                </div>

                <button id="payBtn" class="w-full bg-[#4F9CF9] text-white py-3 rounded-lg font-bold hover:bg-[#2F7ACF] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-6">
                  Submit Request
                </button>
              </div>
            </div>
          </div>

          <!-- My Requests Section -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg p-6 h-full">
              <h2 class="text-lg font-medium text-[#043873] mb-4">My Requests</h2>
              <div id="requestsList" class="space-y-4 overflow-y-auto max-h-[600px]">
                <p class="text-gray-500 text-sm text-center py-4">Loading requests...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  
  <!-- Loading Modal -->
  <div id="loadingModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-xl">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Processing Request...</h3>
      <p class="text-gray-600">Uploading your file and calculating details.</p>
      <p class="text-xs text-gray-400 mt-2">Please do not close this window.</p>
    </div>
  </div>
  <!-- Confirmation Modal -->
  <div id="confirmModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
      <h3 class="text-xl font-bold text-[#043873] mb-4">Confirm Request</h3>
      
      <div class="space-y-3 mb-6">
        <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span class="font-medium text-gray-700">Amount to Pay:</span>
          <span id="confirmAmount" class="text-xl font-bold text-[#043873]">₹0.00</span>
        </div>
        
        <div class="text-sm text-gray-600 space-y-2">
          <p class="flex items-start gap-2">
            <span class="text-blue-500 mt-0.5">ℹ️</span>
            Check your Spam folder for email updates.
          </p>
          <p class="flex items-start gap-2">
            <span class="text-blue-500 mt-0.5">ℹ️</span>
            You can delete this request within 20 minutes if needed.
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <button id="cancelConfirmBtn" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
          Cancel
        </button>
        <button id="proceedConfirmBtn" class="flex-1 px-4 py-2 bg-[#4F9CF9] text-white rounded-lg hover:bg-[#2F7ACF] font-bold shadow-md">
          Proceed
        </button>
      </div>
    </div>
  </div>
    </div>

  `;

  // Logout Handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    console.log('[Student] Logging out...');
    auth.signOut();
  });

  // Home link handler
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('[Student] Navigating to home');
    navigateTo('/');
  });

  // State
  let currentFiles = [];
  let totalPageCount = 0;

  // Elements
  const fileInput = document.getElementById('file-upload');
  const fileListDisplay = document.getElementById('fileList');
  const pageCountDisplay = document.getElementById('pageCountDisplay');
  const optionsSection = document.getElementById('optionsSection');

  // Summary Elements
  const summaryPages = document.getElementById('summaryPages');
  const summaryCopies = document.getElementById('summaryCopies');
  const summaryFinishing = document.getElementById('summaryFinishing');
  const totalCostDisplay = document.getElementById('totalCost');
  const costBreakdown = document.getElementById('costBreakdown');
  const submitBtn = document.getElementById('submitRequestBtn');
  const bulkBadge = document.getElementById('bulkDiscountBadge');

  // Inputs
  const printModeSelect = document.getElementById('printMode');
  const duplexSelect = document.getElementById('duplex');
  const copiesInput = document.getElementById('copies');
  const finishingSelect = document.getElementById('finishing');
  const incCopiesBtn = document.getElementById('incCopies');
  const decCopiesBtn = document.getElementById('decCopies');

  // Modal Elements
  const requestsModal = document.getElementById('requestsModal');
  const viewHistoryBtn = document.getElementById('viewHistoryBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const requestsList = document.getElementById('requestsList');

  // Calculate Cost (Reverted to Old Logic)
  const calculateCost = () => {
    if (!totalPageCount) return { total: 0, discount: 0, printCost: 0, bindingCost: 0, isBulk: false };

    const isDuplex = duplexSelect.value === 'duplex';
    const rate = isDuplex ? 1.00 : 1.50;
    const copies = parseInt(copiesInput.value) || 1;
    const numberOfFiles = currentFiles.length || 1;

    // Binding Cost: ₹25 * Copies * Number of Files (if spiral)
    const finishingFeePerItem = finishingSelect.value === 'spiral' ? 25.00 : 0.00;
    const bindingCost = finishingFeePerItem * copies * numberOfFiles;

    const printCost = totalPageCount * rate * copies;

    // Discount Logic (Old Logic: >10 copies AND >500 cost)
    let discount = 0;
    let isBulk = false;
    if (copies > 10 && printCost > 500) {
      discount = printCost * 0.15;
      isBulk = true;
    }

    const total = (printCost - discount) + bindingCost;
    return { total, printCost, bindingCost, isBulk, discount };
  };

  const updateCostDisplay = () => {
    const { total, printCost, bindingCost, isBulk, discount } = calculateCost();

    // Update Summary
    summaryPages.textContent = totalPageCount;
    summaryCopies.textContent = copiesInput.value;
    summaryFinishing.textContent = finishingSelect.options[finishingSelect.selectedIndex].text;

    totalCostDisplay.textContent = formatCurrency(total);

    // Update Breakdown Text
    let breakdownText = `${totalPageCount} pgs × ${copiesInput.value} copies`;
    if (bindingCost > 0) breakdownText += ` + Binding`;
    if (discount > 0) breakdownText += ` (Discount Applied)`;
    costBreakdown.textContent = breakdownText;

    // Show/Hide Bulk Badge
    if (isBulk) {
      bulkBadge.classList.remove('hidden');
    } else {
      bulkBadge.classList.add('hidden');
    }

    // Enable/Disable Submit
    if (totalPageCount > 0 && currentFiles.every(f => f.url)) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.add('hover:scale-[1.02]', 'active:scale-[0.98]', 'transition-transform');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.remove('hover:scale-[1.02]', 'active:scale-[0.98]', 'transition-transform');
    }
  };

  // Event Listeners for Options
  [printModeSelect, duplexSelect, finishingSelect].forEach(el => {
    el.addEventListener('change', updateCostDisplay);
  });

  // Copies Handlers
  incCopiesBtn.addEventListener('click', () => {
    copiesInput.value = parseInt(copiesInput.value) + 1;
    updateCostDisplay();
  });

  decCopiesBtn.addEventListener('click', () => {
    if (parseInt(copiesInput.value) > 1) {
      copiesInput.value = parseInt(copiesInput.value) - 1;
      updateCostDisplay();
    }
  });

  copiesInput.addEventListener('input', () => {
    if (copiesInput.value === '') return;
    if (parseInt(copiesInput.value) < 1) copiesInput.value = 1;
    updateCostDisplay();
  });

  copiesInput.addEventListener('blur', () => {
    if (!copiesInput.value || parseInt(copiesInput.value) < 1) {
      copiesInput.value = 1;
      updateCostDisplay();
    }
  });

  // File Upload Handler (Keep new UI logic as it drives the interface)
  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Cleanup previous
    if (currentFiles.length > 0) {
      const paths = currentFiles.map(f => f.path).filter(p => p);
      if (paths.length) supabase.storage.from('pdfs').remove(paths);
    }

    currentFiles = [];
    totalPageCount = 0;
    fileListDisplay.innerHTML = '';
    fileListDisplay.classList.remove('hidden');
    pageCountDisplay.classList.add('hidden');

    // Disable submit while processing
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

    for (const file of files) {
      const tempId = Math.random().toString(36).substring(7);

      // UI Item
      const fileItem = document.createElement('div');
      fileItem.className = 'flex justify-between items-center p-3 bg-gray-50 border-2 border-black rounded-lg';
      fileItem.innerHTML = `
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="text-xl">📄</span>
          <span class="font-bold text-sm truncate max-w-[150px]">${file.name}</span>
        </div>
        <div class="flex items-center gap-2">
          <div id="spinner-${tempId}" class="animate-spin h-4 w-4 border-2 border-neo-cyan rounded-full border-t-transparent"></div>
          <span id="status-${tempId}" class="text-xs font-bold text-gray-500">Processing...</span>
        </div>
      `;
      fileListDisplay.appendChild(fileItem);

      if (file.type !== 'application/pdf') {
        document.getElementById(`status-${tempId}`).textContent = "PDF Only";
        document.getElementById(`status-${tempId}`).className = "text-xs font-bold text-red-500";
        document.getElementById(`spinner-${tempId}`).classList.add('hidden');
        continue;
      }

      try {
        // 1. Local Page Count
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();

        // Update UI
        document.getElementById(`status-${tempId}`).textContent = `${pages} pgs`;
        document.getElementById(`status-${tempId}`).className = "text-xs font-bold text-black bg-neo-yellow px-2 py-0.5 rounded border border-black";
        // Keep spinner for upload phase

        // Update Total
        totalPageCount += pages;
        pageCountDisplay.textContent = `Total Pages: ${totalPageCount}`;
        pageCountDisplay.classList.remove('hidden');

        // Show Options
        optionsSection.classList.remove('opacity-50', 'pointer-events-none');
        updateCostDisplay();

        // 2. Background Upload
        const uploadTask = async () => {
          document.getElementById(`spinner-${tempId}`).classList.remove('hidden');
          document.getElementById(`status-${tempId}`).textContent = "Uploading...";

          // sanitizeFileName returns an object with safeFileName
          const { safeFileName } = sanitizeFileName(file.name);
          const fileName = safeFileName;

          const { data, error } = await supabase.storage
            .from('pdfs')
            .upload(fileName, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('pdfs')
            .getPublicUrl(fileName);

          document.getElementById(`spinner-${tempId}`).classList.add('hidden');
          document.getElementById(`status-${tempId}`).textContent = "Ready";
          document.getElementById(`status-${tempId}`).className = "text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded border border-black";

          return {
            originalName: file.name,
            sanitizedName: fileName,
            path: fileName,
            url: publicUrl,
            pages: pages
          };
        };

        // Store promise
        const fileObj = { file, pages, uploadPromise: uploadTask() };
        currentFiles.push(fileObj);

        // Wait for upload to complete to update fileObj
        fileObj.uploadPromise.then(result => {
          Object.assign(fileObj, result);
          updateCostDisplay(); // Re-check submit button
        }).catch(err => {
          console.error("Upload failed", err);
          document.getElementById(`status-${tempId}`).textContent = "Failed";
          document.getElementById(`status-${tempId}`).className = "text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded border border-black";
        });

      } catch (err) {
        console.error(err);
        document.getElementById(`status-${tempId}`).textContent = "Error";
        document.getElementById(`spinner-${tempId}`).classList.add('hidden');
      }
    }
  });

  // Submit Handler
  submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) return;

    // Final check
    if (!currentFiles.every(f => f.url)) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    const { total, discount } = calculateCost();
    const confirmMsg = `Total Cost: ${formatCurrency(total)}\n\nProceed with request?`;

    if (!confirm(confirmMsg)) return;

    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;

    try {
      const uploadedFiles = currentFiles.map(f => ({
        originalName: f.originalName,
        sanitizedName: f.sanitizedName,
        path: f.path,
        url: f.url,
        pages: f.pages
      }));

      const fileNames = uploadedFiles.map(f => f.originalName);

      // Data structure matching OLD logic
      const requestData = {
        userId: user.uid,
        userEmail: user.email,
        fileNames: fileNames, // Array
        fileName: fileNames.join(', '), // String
        files: uploadedFiles,
        pageCount: totalPageCount,
        options: {
          duplex: duplexSelect.value,
          copies: parseInt(copiesInput.value),
          finishing: finishingSelect.value
        },
        totalCost: total,
        discountApplied: discount,
        status: 'New Request', // Old status
        paymentStatus: 'Pending',
        paymentMethod: 'COD', // Defaulting to COD as per old logic usually
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, "requests"), requestData);
      console.log("Request created with ID: ", docRef.id);

      // Send Email
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_request',
          data: {
            userEmail: user.email,
            orderId: docRef.id,
            totalCost: total,
            fileCount: uploadedFiles.length
          }
        })
      }).catch(err => console.error("Email failed", err));

      alert("Request Submitted Successfully! 🎉");

      // Reset UI
      currentFiles = [];
      totalPageCount = 0;
      fileInput.value = '';
      fileListDisplay.innerHTML = '';
      fileListDisplay.classList.add('hidden');
      pageCountDisplay.classList.add('hidden');
      optionsSection.classList.add('opacity-50', 'pointer-events-none');
      updateCostDisplay();
      submitBtn.textContent = "Submit Request 🚀";

    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Request 🚀";
    }
  });

  // History Modal Handlers
  let unsubscribeHistory = null;

  const openHistory = () => {
    requestsModal.classList.remove('hidden');

    const q = query(
      collection(db, "requests"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    unsubscribeHistory = onSnapshot(q, (snapshot) => {
      requestsList.innerHTML = '';
      if (snapshot.empty) {
        requestsList.innerHTML = '<div class="text-center py-8 text-gray-500 font-bold">No requests found. Start printing!</div>';
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt?.toDate ? formatDate(data.createdAt.toDate()) : 'Just now';

        const statusColors = {
          'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
          'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
          'Completed': 'bg-green-100 text-green-800 border-green-300',
          'Rejected': 'bg-red-100 text-red-800 border-red-300'
        };
        const statusClass = statusColors[data.status] || 'bg-gray-100';

        const item = document.createElement('div');
        item.className = 'bg-white border-2 border-black rounded-lg p-4 shadow-sm';
        item.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="text-xs font-bold text-gray-500">#${doc.id.slice(0, 8)}</span>
                        <p class="font-bold text-black">${data.files.length} File(s)</p>
                    </div>
                    <span class="px-2 py-1 rounded text-xs font-bold border ${statusClass}">
                        ${data.status}
                    </span>
                </div>
                <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600">${date}</span>
                    <span class="font-bold text-neo-cyan">${formatCurrency(data.totalCost)}</span>
                </div>
            `;
        requestsList.appendChild(item);
      });
    });
  };

  viewHistoryBtn.addEventListener('click', openHistory);

  closeModalBtn.addEventListener('click', () => {
    requestsModal.classList.add('hidden');
    if (unsubscribeHistory) unsubscribeHistory();
  });

  // Abandoned file cleanup
  window.addEventListener('beforeunload', (event) => {
    if (currentFiles.length > 0) {
      const paths = currentFiles.map(f => f.path).filter(p => p);
      if (paths.length > 0) {
        localStorage.setItem('temp_uploads', JSON.stringify(paths));
        supabase.storage.from('pdfs').remove(paths).catch(err => console.error(err));
      }
    }
  });

  const cleanupAbandonedFiles = async () => {
    const tempFilesJson = localStorage.getItem('temp_uploads');
    if (tempFilesJson) {
      try {
        const paths = JSON.parse(tempFilesJson);
        if (paths && paths.length > 0) {
          console.log("Cleaning up abandoned files:", paths);
          await supabase.storage.from('pdfs').remove(paths);
        }
      } catch (e) {
        console.error(e);
      }
      localStorage.removeItem('temp_uploads');
    }
  };
  cleanupAbandonedFiles();
};
