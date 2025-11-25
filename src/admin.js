import { auth, db } from './firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { supabase } from './supabase';
import { formatCurrency, formatDate } from './utils';
import { navigateTo } from './router.js';

export const renderAdminDashboard = (user) => {
  // Auto-delete requests older than 7 days
  const cleanupOldRequests = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const q = query(collection(db, "requests"), where("createdAt", "<", sevenDaysAgo));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnapshot) => {
        const data = docSnapshot.data();
        console.log("Deleting old request:", docSnapshot.id);

        // Delete files
        const pathsToDelete = [];
        if (data.pdfPath) pathsToDelete.push(data.pdfPath);
        if (data.files) data.files.forEach(f => pathsToDelete.push(f.path));

        if (pathsToDelete.length > 0) {
          await supabase.storage.from('pdfs').remove(pathsToDelete);
        }

        // Delete doc
        await deleteDoc(doc(db, "requests", docSnapshot.id));
      });
    } catch (error) {
      console.error("Error cleaning up old requests:", error);
    }
  };

  // Run cleanup on load
  cleanupOldRequests();

  const app = document.querySelector('#app');
  app.innerHTML = `
  <div class="min-h-screen bg-gray-100">
      <nav class="bg-[#043873] shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-6">
              <a href="#/" id="homeLink" class="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
                <div class="w-8 h-8 bg-[#4F9CF9] rounded flex items-center justify-center text-white font-bold">A</div>
                <h1 class="text-xl font-bold text-white tracking-tight">Port Print Admin</h1>
              </a>
              <span class="text-gray-300 text-sm hidden sm:inline">→ Dashboard</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-200 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">Admin Mode</span>
              <button id="logoutBtn" class="text-sm bg-[#4F9CF9] text-white px-3 py-1.5 rounded hover:bg-[#2F7ACF] transition-colors">Logout</button>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
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

      <!-- Student Details Modal -->
      <div id="studentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Student Details</h3>
            <button id="closeModalBtn" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-4" id="modalContent">
            <!-- Content injected via JS -->
          </div>
        </div>
      </div>
      
      <!-- Files Modal -->
      <div id="filesModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Attached Files</h3>
            <button id="closeFilesModalBtn" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 grid grid-cols-2 gap-4" id="filesModalContent">
            <!-- File tiles injected here -->
          </div>
        </div>
      </div>
    </div>
  `;

  // Logout Handler
  document.getElementById('logoutBtn').addEventListener('click', () => {
    console.log('[Admin] Logging out...');
    auth.signOut();
    // Auth state change will handle navigation to landing page
  });

  // Home link handler
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('[Admin] Navigating to home');
    navigateTo('/');
  });

  // Real-time Requests Listener
  const q = query(
    collection(db, "requests"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, async (snapshot) => {
    const tbody = document.getElementById('requestsTableBody');
    const countBadge = document.getElementById('requestCount');

    countBadge.textContent = `${snapshot.size} Requests`;
    tbody.innerHTML = '';

    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">No requests found.</td></tr>';
      return;
    }

    // Use for...of loop to handle async user fetching
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const requestId = docSnapshot.id;
      const date = data.createdAt?.toDate ? formatDate(data.createdAt.toDate()) : 'Just now';

      // Fetch user profile
      let userProfile = {
        name: 'Unknown',
        year: '-',
        studentClass: '-',
        department: '-',
        phone: '-'
      };

      try {
        if (data.userId) {
          const userDoc = await getDoc(doc(db, "users", data.userId));
          if (userDoc.exists()) {
            userProfile = { ...userProfile, ...userDoc.data() };
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }

      const statusOptions = ['New Request', 'Printing', 'Ready for Pickup', 'Completed', 'Rejected'];

      const tr = document.createElement('tr');
      // Store profile data as JSON string in data attribute
      const profileData = encodeURIComponent(JSON.stringify(userProfile));

      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="text-sm font-medium text-gray-900 mr-2">${userProfile.name}</div>
            <button class="info-btn text-blue-600 hover:text-blue-800 focus:outline-none" data-profile="${profileData}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="text-xs text-gray-500">${data.userEmail}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900 max-w-xs truncate" title="${data.fileName}">${data.fileName}</div>
          <div class="text-xs text-gray-500">${data.pageCount} Pages</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${(() => {
          if (data.files && data.files.length > 1) {
            const filesData = encodeURIComponent(JSON.stringify(data.files));
            return `
                <button class="view-files-btn inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" data-files="${filesData}">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  View ${data.files.length} Files
                </button>
              `;
          } else {
            const url = data.files ? data.files[0].url : data.pdfUrl;
            const name = data.files ? data.files[0].originalName : data.fileName;
            return `
                <button class="download-pdf-btn inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" data-pdfurl="${url || ''}" data-filename="${name}" title="Download PDF">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  PDF
                </button>
              `;
          }
        })()}
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
              data.status === 'Rejected' ? 'bg-red-100 text-red-800' :
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
    }

    // Add Event Listeners for Info Buttons
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const profile = JSON.parse(decodeURIComponent(e.currentTarget.dataset.profile));
        const modal = document.getElementById('studentModal');
        const content = document.getElementById('modalContent');

        const fields = [
          { label: 'Full Name', value: profile.name },
          { label: 'Year', value: profile.year },
          { label: 'Class', value: profile.studentClass },
          { label: 'Department', value: profile.department },
          { label: 'Phone', value: profile.phone },
          { label: 'Email', value: profile.email }
        ];

        content.innerHTML = fields.map(field => `
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p class="text-xs text-gray-500 uppercase">${field.label}</p>
              <p class="text-sm font-medium text-gray-900">${field.value || '-'}</p>
            </div>
            <button class="copy-btn text-gray-400 hover:text-blue-600 p-1" data-value="${field.value || ''}" title="Copy ${field.label}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        `).join('');

        // Add Copy Functionality
        content.querySelectorAll('.copy-btn').forEach(copyBtn => {
          copyBtn.addEventListener('click', (ev) => {
            const value = ev.currentTarget.dataset.value;
            if (value) {
              navigator.clipboard.writeText(value);

              // Visual feedback
              const originalHTML = ev.currentTarget.innerHTML;
              ev.currentTarget.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`;
              setTimeout(() => {
                ev.currentTarget.innerHTML = originalHTML;
              }, 1500);
            }
          });
        });

        modal.classList.remove('hidden');
      });
    });

    // Close Modal Handler
    const closeModal = () => {
      document.getElementById('studentModal').classList.add('hidden');
    };

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('studentModal').addEventListener('click', (e) => {
      if (e.target.id === 'studentModal') closeModal();
    });

    // View Files Button Handler
    document.querySelectorAll('.view-files-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const files = JSON.parse(decodeURIComponent(e.currentTarget.dataset.files));
        const modal = document.getElementById('filesModal');
        const content = document.getElementById('filesModalContent');

        content.innerHTML = files.map(file => `
          <a href="${file.url}" target="_blank" class="block p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all text-center group">
            <div class="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <p class="text-sm font-medium text-gray-900 truncate" title="${file.originalName}">${file.originalName}</p>
            <p class="text-xs text-gray-500 mt-1">${file.pages} Pages</p>
          </a>
        `).join('');

        modal.classList.remove('hidden');
      });
    });

    // Close Files Modal
    const closeFilesModal = () => {
      document.getElementById('filesModal').classList.add('hidden');
    };
    document.getElementById('closeFilesModalBtn').addEventListener('click', closeFilesModal);
    document.getElementById('filesModal').addEventListener('click', (e) => {
      if (e.target.id === 'filesModal') closeFilesModal();
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

          // Delete PDF from Supabase if status is "Completed" or "Rejected"
          if ((newStatus === 'Completed' || newStatus === 'Rejected') && pdfPath) {
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
          let emailType = 'status_update';
          if (newStatus === 'Rejected') emailType = 'request_rejected';

          fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: emailType,
              data: {
                userEmail: userEmail,
                fileName: fileName,
                newStatus: newStatus
              }
            })
          }).catch(err => console.error("Failed to send email:", err));

        } catch (error) {
          console.error("Error updating status:", error);
          alert("Failed to update status.");
        }
      });
    });
  });

};
