import { db } from './firebase';
import { doc, setDoc } from "firebase/firestore";

import { renderStudentDashboard } from './student';

export const renderProfileSetup = (user) => {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        <p class="mb-4 text-sm text-gray-600">Please provide your details to continue.</p>
        <form id="profileForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="fullName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Student ID / Roll No</label>
            <input type="text" id="studentId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Class / Department</label>
            <input type="text" id="studentClass" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="tel" id="phone" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Profile</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const studentId = document.getElementById('studentId').value;
    const studentClass = document.getElementById('studentClass').value;
    const phone = document.getElementById('phone').value;

    try {
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        studentId: studentId,
        studentClass: studentClass,
        phone: phone,
        email: user.email,
        role: 'student', // Default role
        createdAt: new Date()
      });

      // After saving, redirect to dashboard
      renderStudentDashboard(user);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile: " + error.message);
    }
  });
};
