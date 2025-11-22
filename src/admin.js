import { auth, db } from './firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { supabase } from './supabase';
import { formatCurrency, formatDate } from './utils';

export const renderAdminDashboard = (user) => {
  const app = document.querySelector('#app');
  app.innerHTML = `
  < div class="min-h-screen bg-gray-100" >
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-purple-600">Campus Print Admin</h1>
            </div>
            <div class="flex items-center">
              <span class="text-gray-700 mr-4 text-sm">Admin Mode</span>
              <button id="logoutBtn" class="text-sm text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Incoming Requests</h2>
            <span id="requestCount" class="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">0 Requests</span>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Details</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody id="requestsTableBody" class="bg-white divide-y divide-gray-200">
                <tr>
                  <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">Loading requests...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div >
  `;

  // Logout Handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut();
  });

  // Real-time Requests Listener
  const q = query(
    collection(db, "requests"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    const tbody = document.getElementById('requestsTableBody');
    const countBadge = document.getElementById('requestCount');

    countBadge.textContent = `${snapshot.size} Requests`;
    tbody.innerHTML = '';

    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">No requests found.</td></tr>';
      return;
    }

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const requestId = docSnapshot.id;
      const date = data.createdAt?.toDate ? formatDate(data.createdAt.toDate()) : 'Just now';

      const statusOptions = ['New Request', 'Printing', 'Ready for Pickup', 'Completed'];

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${data.userEmail}</div>
          <div class="text-xs text-gray-500">ID: ${data.userId.slice(0, 6)}...</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900 max-w-xs truncate" title="${data.fileName}">${data.fileName}</div>
          <div class="text-xs text-gray-500">${data.pageCount} Pages</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="download-pdf-btn inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-pdfurl="${data.pdfUrl || ''}" data-filename="${data.fileName}" title="Download PDF">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            PDF
          </button>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div>${data.options.duplex === 'duplex' ? 'Duplex' : 'Simplex'}</div>
          <div>${data.options.finishing !== 'none' ? data.options.finishing : 'No Finishing'}</div>
          <div>${data.options.copies} Copies</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${formatCurrency(data.totalCost)}</div>
          <div class="text-xs ${data.paymentMethod === 'Cash on Delivery' ? 'text-orange-600' : 'text-green-600'}">
            ${data.paymentMethod || 'Online Payment'}
          </div>
          <div class="text-xs text-gray-500">${data.paymentStatus || 'Paid'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${data.status === 'New Request' ? 'bg-yellow-100 text-yellow-800' :
          data.status === 'Printing' ? 'bg-blue-100 text-blue-800' :
            data.status === 'Ready for Pickup' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'}">
            ${data.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <select class="status-select border-gray-300 rounded-md shadow-sm text-sm focus:ring-purple-500 focus:border-purple-500" 
            data-id="${requestId}" 
            data-user-email="${data.userEmail}" 
            data-file-name="${data.fileName}"
            data-pdf-path="${data.pdfPath || ''}">

            ${statusOptions.map(status => `
              <option value="${status}" ${data.status === status ? 'selected' : ''}>${status}</option>
            `).join('')}
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Add Event Listeners to Download Buttons
    document.querySelectorAll('.download-pdf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pdfUrl = e.currentTarget.dataset.pdfurl;
        const filename = e.currentTarget.dataset.filename;

        if (!pdfUrl) {
          alert('PDF not available for this request (it might be an old request before storage was enabled).');
          return;
        }

        // Open PDF in new tab (browser will handle download/view)
        window.open(pdfUrl, '_blank');
      });
    });


    // Add Event Listeners to Status Selects
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        const requestId = e.target.dataset.id;
        const userEmail = e.target.dataset.userEmail; // Retrieve from data attribute
        const fileName = e.target.dataset.fileName;   // Retrieve from data attribute
        const pdfPath = e.target.dataset.pdfPath;

        try {
          await updateDoc(doc(db, "requests", requestId), {
            status: newStatus
          });

          // Delete PDF from Supabase if status is "Completed"
          if (newStatus === 'Completed' && pdfPath) {
            const { error: deleteError } = await supabase.storage
              .from('pdfs')
              .remove([pdfPath]);

            if (deleteError) {
              console.error('Error deleting file:', deleteError);
            } else {
              console.log('PDF deleted from storage:', pdfPath);
            }
          }

          // Send Email Notification
          fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'status_update',
              data: {
                requestId: requestId,
                newStatus: newStatus,
                userEmail: userEmail,
                fileName: fileName
              }
            })
          }).catch(err => console.error("Failed to send status email:", err));

        } catch (error) {
          console.error("Error updating status:", error);
          alert("Failed to update status");
        }
      });
    });
  });

};
