import { auth, db, storage } from './firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { supabase } from './supabase';
import { PDFDocument } from 'pdf-lib';
import { formatCurrency, formatDate } from './utils';

export const renderStudentDashboard = (user) => {
  const app = document.querySelector('#app');
  app.innerHTML = `
  < div class="min-h-screen bg-gray-50" >
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-blue-600">Campus Print</h1>
            </div>
            <div class="flex items-center">
              <span class="text-gray-700 mr-4 text-sm">${user.email}</span>
              <button id="logoutBtn" class="text-sm text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- New Request Section -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">New Print Request</h2>
              
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
                    <input id="file-upload" type="file" class="hidden" accept="application/pdf" />
                  </label>
                </div>
                <p id="fileName" class="mt-2 text-sm text-gray-600 hidden"></p>
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
                      <option value="duplex">Double-sided (Duplex)</option>
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
                <div class="bg-blue-50 p-4 rounded-md mt-6">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700 font-medium">Total Cost:</span>
                    <span id="totalCost" class="text-2xl font-bold text-blue-700">₹0.00</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 text-right">Includes all fees</p>
                </div>

                <!-- Payment Method Selection -->
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                  <div class="space-y-3">
                    <label class="flex items-center p-3 border-2 border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="paymentMethod" value="online" class="w-4 h-4 text-blue-600" checked>
                      <div class="ml-3">
                        <span class="block font-medium text-gray-900">Pay Online</span>
                        <span class="block text-xs text-gray-500">Pay now via Razorpay (UPI, Cards, Net Banking)</span>
                      </div>
                    </label>
                    <label class="flex items-center p-3 border-2 border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="paymentMethod" value="cod" class="w-4 h-4 text-blue-600">
                      <div class="ml-3">
                        <span class="block font-medium text-gray-900">Cash on Delivery</span>
                        <span class="block text-xs text-gray-500">Pay when you collect your prints</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button id="payBtn" class="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm mt-6">
                  Submit Request
                </button>
              </div>
            </div>
          </div>

          <!-- My Requests Section -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow rounded-lg p-6 h-full">
              <h2 class="text-lg font-medium text-gray-900 mb-4">My Requests</h2>
              <div id="requestsList" class="space-y-4 overflow-y-auto max-h-[600px]">
                <p class="text-gray-500 text-sm text-center py-4">Loading requests...</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!--Payment Modal-->
  <div id="paymentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
      <h3 class="text-xl font-bold mb-4">Payment Gateway</h3>
      <p class="mb-6 text-gray-600">Simulating Razorpay Payment of <span id="modalAmount" class="font-bold text-black"></span></p>
      <div class="flex space-x-4 justify-center">
        <button id="cancelPayment" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
        <button id="confirmPayment" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Pay Now</button>
      </div>
    </div>
  </div>
    </div >
  `;

  // Logout Handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut();
  });

  // State
  let currentFile = null;
  let pageCount = 0;

  // Elements
  const fileInput = document.getElementById('file-upload');
  const fileNameDisplay = document.getElementById('fileName');
  const pageCountDisplay = document.getElementById('pageCountDisplay');
  const optionsSection = document.getElementById('optionsSection');
  const totalCostDisplay = document.getElementById('totalCost');
  const payBtn = document.getElementById('payBtn');
  const paymentModal = document.getElementById('paymentModal');
  const modalAmount = document.getElementById('modalAmount');
  const confirmPaymentBtn = document.getElementById('confirmPayment');
  const cancelPaymentBtn = document.getElementById('cancelPayment');

  // Inputs
  const duplexSelect = document.getElementById('duplex');
  const copiesInput = document.getElementById('copies');
  const finishingSelect = document.getElementById('finishing');

  // Calculate Cost
  const calculateCost = () => {
    if (!pageCount) return 0;

    const isDuplex = duplexSelect.value === 'duplex';
    const rate = isDuplex ? 1.00 : 1.50;
    const copies = parseInt(copiesInput.value) || 1;
    const finishingFee = finishingSelect.value === 'spiral' ? 25.00 : 0.00;

    const total = (pageCount * rate * copies) + finishingFee;
    return total;
  };

  const updateCostDisplay = () => {
    const cost = calculateCost();
    totalCostDisplay.textContent = formatCurrency(cost);
  };

  // Event Listeners for Options
  [duplexSelect, copiesInput, finishingSelect].forEach(el => {
    el.addEventListener('change', updateCostDisplay);
    el.addEventListener('input', updateCostDisplay);
  });

  // File Upload Handler
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name;
    fileNameDisplay.classList.remove('hidden');

    // Count Pages
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      pageCount = pdfDoc.getPageCount();

      pageCountDisplay.textContent = `${pageCount} Pages detected`;
      pageCountDisplay.classList.remove('hidden');

      // Enable Options
      optionsSection.classList.remove('opacity-50', 'pointer-events-none');
      updateCostDisplay();
    } catch (error) {
      console.error("Error reading PDF:", error);
      alert("Failed to read PDF. Please try another file.");
      currentFile = null;
      pageCount = 0;
      optionsSection.classList.add('opacity-50', 'pointer-events-none');
    }
  });

  // Reusable function to submit request
  const submitRequest = async (paymentMethod, paymentStatus) => {
    try {
      // Show uploading state
      const submitBtn = document.getElementById('payBtn');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Uploading PDF...";

      // 1. Upload PDF to Supabase Storage
      const fileName = `${user.uid}/${Date.now()}_${currentFile.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, currentFile);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      submitBtn.textContent = "Saving Request...";

      // 2. Save to Firestore with PDF URL
      await addDoc(collection(db, "requests"), {
        userId: user.uid,
        userEmail: user.email,
        fileName: currentFile.name,
        pdfUrl: publicUrl,
        pdfPath: fileName,
        pageCount: pageCount,
        options: {
          duplex: duplexSelect.value,
          copies: parseInt(copiesInput.value),
          finishing: finishingSelect.value
        },
        totalCost: calculateCost(),
        status: 'New Request',
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        createdAt: new Date()
      });

      // Save data for email before resetting
      const savedFileName = currentFile.name;
      const savedPageCount = pageCount;
      const savedTotalCost = calculateCost();

      // Reset Form
      paymentModal.classList.add('hidden');

      if (paymentMethod === 'Cash on Delivery') {
        alert("Request submitted successfully! Pay when you collect your prints.");
      } else {
        alert("Payment successful! Order placed.");
      }

      // Reset UI
      fileInput.value = '';
      currentFile = null;
      pageCount = 0;
      fileNameDisplay.classList.add('hidden');
      pageCountDisplay.classList.add('hidden');
      optionsSection.classList.add('opacity-50', 'pointer-events-none');
      updateCostDisplay();

      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Send Email Notifications (Async - don't block UI)
      // Use relative path '/api/email' which works both locally (via proxy/Vercel dev) and in production
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_request',
          data: {
            userEmail: user.email,
            fileName: savedFileName,
            pageCount: savedPageCount,
            totalCost: savedTotalCost,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            status: 'New Request'
          }
        })
      }).catch(err => console.error("Failed to send email notifications:", err));

    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request: " + error.message);

      // Reset button
      const submitBtn = document.getElementById('payBtn');
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Request";

      throw error; // Re-throw to allow calling handlers to catch it
    }
  };

  // Payment Flow
  payBtn.addEventListener('click', () => {
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const cost = calculateCost();

    if (selectedPaymentMethod === 'cod') {
      // Cash on Delivery - Skip payment modal, submit directly
      submitRequest('Cash on Delivery', 'Pending');
    } else {
      // Online Payment - Show payment modal
      modalAmount.textContent = formatCurrency(cost);
      paymentModal.classList.remove('hidden');
    }
  });

  cancelPaymentBtn.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
  });


  confirmPaymentBtn.addEventListener('click', async () => {
    // Simulate Online Payment Success
    confirmPaymentBtn.disabled = true;
    confirmPaymentBtn.textContent = "Processing...";

    try {
      await submitRequest('Online Payment', 'Paid');
      confirmPaymentBtn.disabled = false;
      confirmPaymentBtn.textContent = "Pay Now";
    } catch (error) {
      confirmPaymentBtn.disabled = false;
      confirmPaymentBtn.textContent = "Pay Now";
    }
  });

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
      item.className = 'border rounded-md p-4 hover:bg-gray-50 transition-colors';
      item.innerHTML = `
  < div class="flex justify-between items-start mb-2" >
          <div>
            <h3 class="font-medium text-gray-900 truncate max-w-[150px]" title="${data.fileName}">${data.fileName}</h3>
            <p class="text-xs text-gray-500">${date}</p>
          </div>
          <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${data.status}</span>
        </div >
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
