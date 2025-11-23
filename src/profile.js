import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";
import { navigateTo } from './router.js';

export const renderProfileSetup = (user) => {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        <p class="mb-4 text-sm text-gray-600">Please provide your details to continue.</p>
        <form id="profileForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name <span class="text-red-500">*</span></label>
            <input type="text" id="fullName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value="${user.displayName || ''}" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Year <span class="text-red-500">*</span></label>
            <select id="year" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Class <span class="text-red-500">*</span></label>
            <input type="text" id="studentClass" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 3rd Year" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Department <span class="text-red-500">*</span></label>
            <select id="department" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number <span class="text-red-500">*</span></label>
            <input type="tel" id="phone" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 9876543210" pattern="[0-9]{10}" required>
            <p class="mt-1 text-xs text-gray-500">10-digit mobile number</p>
          </div>
          <button type="submit" id="saveProfileBtn" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Profile</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const year = document.getElementById('year').value;
    const studentClass = document.getElementById('studentClass').value;
    const department = document.getElementById('department').value;
    const phone = document.getElementById('phone').value;

    try {
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        year: year,
        studentClass: studentClass,
        department: department,
        phone: phone,
        email: user.email,
        role: 'student', // Default role
        createdAt: new Date()
      });

      // After saving, redirect to dashboard using router
      console.log('[Profile] Profile saved, redirecting to dashboard');
      navigateTo('/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile: " + error.message);
    }
  });
};
