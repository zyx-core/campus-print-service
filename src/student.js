import { auth, db, storage } from './firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { supabase } from './supabase';
import { PDFDocument } from 'pdf-lib';
import { formatCurrency, formatDate, sanitizeFileName } from './utils';
import { navigateTo } from './router.js';

export const renderStudentDashboard = (user) => {
  const app = document.querySelector('#app');
  app.innerHTML = `
  <div class="min-h-screen bg-gray-50">

      <nav class="bg-[#043873] shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-6">
              <a href="#/" id="homeLink" class="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                <div class="w-8 h-8 bg-[#4F9CF9] rounded flex items-center justify-center text-white font-bold">P</div>
                <h1 class="text-xl font-bold text-white tracking-tight">Port Print</h1>
              </a>
              <span class="text-gray-300 text-sm hidden sm:inline">→ Dashboard</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-200 text-sm hidden sm:block">${user.email}</span>
              <button id="logoutBtn" class="text-sm bg-[#4F9CF9] text-white px-3 py-1.5 rounded hover:bg-[#2F7ACF] transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- New Request Section -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium text-[#043873] mb-4">New Print Request</h2>
              
              <!-- File Upload -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Upload PDF</label>
                <div class="flex items-center justify-center w-full">
                  <label for="file-upload" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                      <p class="text-xs text-gray-500">PDF only</p>
                    </div>
                    <input id="file-upload" type="file" class="hidden" accept="application/pdf" multiple />
                  </label>
                </div>
                <div id="fileList" class="mt-2 space-y-1 hidden"></div>
                <p id="pageCountDisplay" class="mt-1 text-sm font-medium text-blue-600 hidden"></p>
              </div>

              <!-- Options -->
              <div id="optionsSection" class="space-y-4 opacity-50 pointer-events-none transition-opacity duration-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Print Mode</label>
                    <select id="printMode" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                      <option value="bw">Black & White</option>
                      <option value="color" disabled>Color (Unavailable)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Sides</label>
                    <select id="duplex" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                      <option value="simplex">Single-sided (Simplex)</option>
                      <option value="duplex" selected>Double-sided (Duplex)</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Copies</label>
                    <input type="number" id="copies" min="1" value="1" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Finishing</label>
                    <select id="finishing" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                      <option value="none">None</option>
                      <option value="staple">Staple (Free)</option>
                      <option value="spiral">Spiral Binding (₹25)</option>
                    </select>
                  </div>
                </div>

                <!-- Quote -->
                <div class="bg-[#043873] bg-opacity-5 p-4 rounded-md mt-6 border border-[#043873] border-opacity-10">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-[#043873] font-medium">Total Cost:</span>
                    <span id="totalCost" class="text-2xl font-bold text-[#043873]">₹0.00</span>
                  </div>
                  <div id="costBreakdown" class="text-xs text-gray-500 text-right space-y-1">
                    <!-- Formula will be injected here -->
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
    // Auth state change will handle navigation to landing page
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
  const totalCostDisplay = document.getElementById('totalCost');
  const payBtn = document.getElementById('payBtn');

  // Inputs
  const duplexSelect = document.getElementById('duplex');
  const copiesInput = document.getElementById('copies');
  const finishingSelect = document.getElementById('finishing');

  // Calculate Cost
  // Calculate Cost
  const calculateCost = () => {
    if (!totalPageCount) return { total: 0, discount: 0, printCost: 0, bindingCost: 0 };

    const isDuplex = duplexSelect.value === 'duplex';
    const rate = isDuplex ? 1.00 : 1.50;
    const copies = parseInt(copiesInput.value) || 1;
    const finishingFee = finishingSelect.value === 'spiral' ? 25.00 : 0.00;

    const printCost = totalPageCount * rate * copies;
    const bindingCost = finishingFee; // Per document binding fee logic might need clarification, assuming flat fee for now or per set? 
    // "The discount is applied to the Print Cost only, not the Binding fee."

    // Discount Logic
    let discount = 0;
    if (copies > 10 && printCost > 500) {
      discount = printCost * 0.15;
    }

    const total = (printCost - discount) + bindingCost;
    return { total, discount, printCost, bindingCost };
  };

  const updateCostDisplay = () => {
    const { total, discount, printCost, bindingCost } = calculateCost();
    totalCostDisplay.textContent = formatCurrency(total);

    // Update Breakdown
    const isDuplex = duplexSelect.value === 'duplex';
    const rate = isDuplex ? 1.00 : 1.50;
    const copies = parseInt(copiesInput.value) || 1;

    const costBreakdown = document.getElementById('costBreakdown');
    let breakdownHtml = `
      <p>${totalPageCount} pages × ${formatCurrency(rate)} × ${copies} copies = ${formatCurrency(printCost)}</p>
      ${bindingCost > 0 ? `<p>+ Binding: ${formatCurrency(bindingCost)}</p>` : ''}
    `;

    if (discount > 0) {
      breakdownHtml += `<p class="text-green-600 font-bold">Discount (15% off print): -${formatCurrency(discount)}</p>`;
    }

    costBreakdown.innerHTML = breakdownHtml;
  };

  // Event Listeners for Options
  [duplexSelect, copiesInput, finishingSelect].forEach(el => {
    el.addEventListener('change', updateCostDisplay);
    el.addEventListener('input', updateCostDisplay);
  });

  // File Upload Handler
  // File Upload Handler
  fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Reset state
    currentFiles = [];
    totalPageCount = 0;
    fileListDisplay.innerHTML = '';
    fileListDisplay.classList.add('hidden');

    const loadingModal = document.getElementById('loadingModal');
    loadingModal.classList.remove('hidden');

    try {
      let validFiles = [];
      let totalPages = 0;

      for (const file of files) {
        if (file.type !== 'application/pdf') {
          console.warn(`Skipping non-PDF file: ${file.name}`);
          continue;
        }

        const maxSize = 300 * 1024 * 1024; // 300MB
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Skipping.`);
          continue;
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();

        validFiles.push({ file, pages });
        totalPages += pages;

        // Add to display list
        const fileItem = document.createElement('div');
        fileItem.className = 'text-sm text-gray-600 flex justify-between';
        fileItem.innerHTML = `<span>${file.name}</span> <span class="text-gray-400">(${pages} pages)</span>`;
        fileListDisplay.appendChild(fileItem);
      }

      if (validFiles.length === 0) {
        alert("No valid PDF files found.");
        loadingModal.classList.add('hidden');
        return;
      }

      currentFiles = validFiles;
      totalPageCount = totalPages;

      fileListDisplay.classList.remove('hidden');
      pageCountDisplay.textContent = `${totalPageCount} Total Pages detected`;
      pageCountDisplay.classList.remove('hidden');

      // Enable Options
      optionsSection.classList.remove('opacity-50', 'pointer-events-none');
      updateCostDisplay();

    } catch (error) {
      console.error("Error reading PDFs:", error);
      alert("Failed to read PDF files.");
      currentFiles = [];
      totalPageCount = 0;
      optionsSection.classList.add('opacity-50', 'pointer-events-none');
    } finally {
      loadingModal.classList.add('hidden');
    }
  });

  // Reusable function to submit request
  // Confirmation Modal Logic
  const showConfirmationModal = () => {
    const { total } = calculateCost();
    document.getElementById('confirmAmount').textContent = formatCurrency(total);
    document.getElementById('confirmModal').classList.remove('hidden');
  };

  document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.add('hidden');
  });

  document.getElementById('proceedConfirmBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.add('hidden');
    processSubmission('Cash on Delivery', 'Pending');
  });

  // Process Submission
  const processSubmission = async (paymentMethod, paymentStatus) => {
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.classList.remove('hidden');

    try {
      const submitBtn = document.getElementById('payBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = "Uploading PDFs...";

      const uploadedFiles = [];

      // Upload all files
      for (const item of currentFiles) {
        const file = item.file;
        const fileInfo = sanitizeFileName(file.name);
        const storagePath = `${user.uid}/${Date.now()}_${fileInfo.safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('pdfs')
          .getPublicUrl(storagePath);

        uploadedFiles.push({
          originalName: file.name,
          sanitizedName: fileInfo.safeFileName,
          path: storagePath,
          url: publicUrl,
          pages: item.pages
        });
      }

      submitBtn.textContent = "Saving Request...";

      const { total, discount } = calculateCost();
      const fileNames = uploadedFiles.map(f => f.originalName);

      // Save to Firestore
      await addDoc(collection(db, "requests"), {
        userId: user.uid,
        userEmail: user.email,
        fileNames: fileNames, // Array of file names
        fileName: fileNames.join(', '), // For backward compatibility/display
        files: uploadedFiles, // Detailed file info
        pageCount: totalPageCount,
        options: {
          duplex: duplexSelect.value,
          copies: parseInt(copiesInput.value),
          finishing: finishingSelect.value
        },
        totalCost: total,
        discountApplied: discount,
        status: 'New Request',
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        createdAt: new Date()
      });

      // Reset Form
      alert(`Request submitted successfully! Please pay ${formatCurrency(total)} when you collect your prints.`);

      // Reset UI
      fileInput.value = '';
      currentFiles = [];
      totalPageCount = 0;
      document.getElementById('fileList').innerHTML = '';
      document.getElementById('fileList').classList.add('hidden');
      pageCountDisplay.classList.add('hidden');
      optionsSection.classList.add('opacity-50', 'pointer-events-none');
      updateCostDisplay();

      // Send Email
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_request',
          data: {
            userEmail: user.email,
            fileName: fileNames.join(', '),
            pageCount: totalPageCount,
            totalCost: total,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            status: 'New Request'
          }
        })
      }).catch(err => console.error("Failed to send email notifications:", err));

    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request: " + error.message);
    } finally {
      loadingModal.classList.add('hidden');
      const submitBtn = document.getElementById('payBtn');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
    }
  };

  // Payment Flow
  payBtn.addEventListener('click', () => {
    showConfirmationModal();
  });

  // Delete Request Handler
  window.deleteRequest = async (requestId) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      await deleteDoc(doc(db, "requests", requestId));
      // UI updates automatically via onSnapshot
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request.");
    }
  };


  // Real-time Requests Listener
  const q = query(
    collection(db, "requests"),
    where("userId", "==", user.uid)
  );

  onSnapshot(q, (snapshot) => {
    const requestsList = document.getElementById('requestsList');
    requestsList.innerHTML = '';

    if (snapshot.empty) {
      requestsList.innerHTML = '<p class="text-gray-500 text-sm text-center">No requests yet.</p>';
      return;
    }

    // Sort manually to avoid needing a composite index
    const docs = snapshot.docs.sort((a, b) => {
      const dateA = a.data().createdAt?.toDate ? a.data().createdAt.toDate() : new Date(0);
      const dateB = b.data().createdAt?.toDate ? b.data().createdAt.toDate() : new Date(0);
      return dateB - dateA;
    });

    docs.forEach((doc) => {
      const data = doc.data();
      const date = data.createdAt?.toDate ? formatDate(data.createdAt.toDate()) : 'Just now';

      const statusColors = {
        'New Request': 'bg-yellow-100 text-yellow-800',
        'Printing': 'bg-blue-100 text-blue-800',
        'Ready for Pickup': 'bg-green-100 text-green-800',
        'Completed': 'bg-gray-100 text-gray-800'
      };
      const statusClass = statusColors[data.status] || 'bg-gray-100 text-gray-800';

      const item = document.createElement('div');
      item.className = 'border rounded-md p-4 hover:bg-gray-50 transition-colors relative group';

      // Delete Button Logic
      const now = new Date();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      const diffMins = (now - createdAt) / 1000 / 60;
      const canDelete = diffMins < 20 && data.status === 'New Request';

      let deleteBtnHtml = '';
      if (canDelete) {
        deleteBtnHtml = `
          <button onclick="deleteRequest('${doc.id}')" class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Delete Request">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        `;
      }

      item.innerHTML = `
        ${deleteBtnHtml}
        <div class="flex justify-between items-start mb-2 pr-6">
          <div>
            <h3 class="font-medium text-gray-900 truncate max-w-[150px]" title="${data.fileName}">${data.fileName}</h3>
            <p class="text-xs text-gray-500">${date}</p>
          </div>
          <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${data.status}</span>
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <div class="flex justify-between">
            <span>Pages: ${data.pageCount}</span>
            <span>${data.options.duplex === 'duplex' ? 'Duplex' : 'Simplex'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs ${data.paymentMethod === 'Cash on Delivery' ? 'text-orange-600' : 'text-green-600'}">${data.paymentMethod || 'Online Payment'}</span>
            <span class="text-xs text-gray-500">${data.paymentStatus || 'Paid'}</span>
          </div>
          <div class="flex justify-between font-medium text-gray-900 pt-2 border-t mt-2">
            <span>Total</span>
            <span>${formatCurrency(data.totalCost)}</span>
          </div>
          ${data.discountApplied > 0 ? `<div class="text-xs text-green-600 text-right">Saved: ${formatCurrency(data.discountApplied)}</div>` : ''}
        </div>
`;
      requestsList.appendChild(item);
    });
  }, (error) => {
    console.error("Error loading requests:", error);
    const requestsList = document.getElementById('requestsList');
    requestsList.innerHTML = '<p class="text-red-500 text-sm text-center">Error loading requests. Please refresh the page.</p>';
  });

};
