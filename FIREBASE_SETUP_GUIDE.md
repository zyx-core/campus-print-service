# Firebase Setup Guide - PDF Upload with Firebase Storage

This guide will help you set up Firebase Storage for PDF uploads and integrate it with your Campus Print Service app.

---

## 📋 Prerequisites

- Firebase project already created (project ID: `printapp-374c1`)
- Firebase config in `src/firebase.js`

---

## Step 1: Enable Firebase Storage in Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **printapp-374c1**
3. In the left sidebar, click **Storage**
4. Click **Get Started**
5. Choose **Start in test mode** (for development)
6. Select a location (choose closest to your users)
7. Click **Done**

### Security Rules (Test Mode)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### Production Security Rules (Later)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only authenticated users can upload
    match /pdfs/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.contentType == 'application/pdf'
                   && request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

---

## Step 2: Enable Firestore Database

1. In Firebase Console, click **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode**
4. Select same location as Storage
5. Click **Enable**

### Security Rules (Test Mode)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

---

## Step 3: Update `firebase.js`

Replace the current `firebase.js` with this:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA0T8N5Z1BisO8Z8IhbS0Cyj2JJHD4shPk",
    authDomain: "printapp-374c1.firebaseapp.com",
    projectId: "printapp-374c1",
    storageBucket: "printapp-374c1.firebasestorage.app",
    messagingSenderId: "990883468146",
    appId: "1:990883468146:web:104246d4d413a4157c03eb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## Step 4: Update `student.js` - Add PDF Upload

Find the section where the payment is confirmed (around line 222-264) and replace it with this:

```javascript
confirmPaymentBtn.addEventListener('click', async () => {
    // Simulate Payment Success
    confirmPaymentBtn.disabled = true;
    confirmPaymentBtn.textContent = "Processing...";

    try {
        // 1. Upload PDF to Firebase Storage
        const fileName = `${user.uid}_${Date.now()}_${currentFile.name}`;
        const storageRef = ref(storage, `pdfs/${user.uid}/${fileName}`);
        
        // Upload file
        const uploadTask = uploadBytesResumable(storageRef, currentFile);
        
        // Monitor upload progress
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                confirmPaymentBtn.textContent = `Uploading... ${Math.round(progress)}%`;
            },
            (error) => {
                console.error("Upload error:", error);
                throw error;
            },
            async () => {
                // Upload completed successfully
                // 2. Get download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // 3. Save to Firestore with PDF URL
                await addDoc(collection(db, "requests"), {
                    userId: user.uid,
                    userEmail: user.email,
                    fileName: currentFile.name,
                    pdfUrl: downloadURL,
                    pdfPath: `pdfs/${user.uid}/${fileName}`,
                    pageCount: pageCount,
                    options: {
                        duplex: duplexSelect.value,
                        copies: parseInt(copiesInput.value),
                        finishing: finishingSelect.value
                    },
                    totalCost: calculateCost(),
                    status: 'New Request',
                    paymentStatus: 'Paid',
                    createdAt: new Date()
                });

                // Reset Form
                paymentModal.classList.add('hidden');
                alert("Order placed successfully! PDF uploaded.");

                // Reset UI
                fileInput.value = '';
                currentFile = null;
                pageCount = 0;
                fileNameDisplay.classList.add('hidden');
                pageCountDisplay.classList.add('hidden');
                optionsSection.classList.add('opacity-50', 'pointer-events-none');
                confirmPaymentBtn.disabled = false;
                confirmPaymentBtn.textContent = "Pay Now";
            }
        );

    } catch (error) {
        console.error("Error submitting request:", error);
        alert("Failed to submit request: " + error.message);
        confirmPaymentBtn.disabled = false;
        confirmPaymentBtn.textContent = "Pay Now";
    }
});
```

**Add these imports at the top of `student.js`:**

```javascript
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
```

---

## Step 5: Update `admin.js` - Add Real PDF Download

Replace the download button event listener (around line 141-148) with:

```javascript
// Add Event Listeners to Download Buttons
document.querySelectorAll('.download-pdf-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const pdfUrl = e.currentTarget.dataset.pdfurl;
        const filename = e.currentTarget.dataset.filename;
        
        if (!pdfUrl) {
            alert('PDF not available');
            return;
        }
        
        try {
            // Download the file
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download PDF");
        }
    });
});
```

**Update the button HTML in the table row (around line 105-110):**

```javascript
<td class="px-6 py-4 whitespace-nowrap">
    <button class="download-pdf-btn inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" 
            data-pdfurl="${data.pdfUrl || ''}" 
            data-filename="${data.fileName}" 
            title="Download PDF">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        PDF
    </button>
</td>
```

---

## Step 6: Switch from Mock to Real Firebase

### Option A: Keep Both (Recommended for Testing)

Create a config file to toggle between mock and real Firebase:

**Create `src/config.js`:**
```javascript
export const USE_MOCK_AUTH = false; // Set to false to use real Firebase
```

**Update imports in all files:**
```javascript
import { USE_MOCK_AUTH } from './config';

// Use conditional imports
const auth = USE_MOCK_AUTH ? mockAuth : firebaseAuth;
const db = USE_MOCK_AUTH ? mockDb : firebaseDb;
```

### Option B: Complete Switch

Simply replace all imports:
- Change `from './mockAuth'` to `from './firebase'`
- Change `from "firebase/firestore"` imports back
- Remove mock system files

---

## Step 7: Test the Setup

1. **Clear localStorage** (to remove mock data):
   ```javascript
   localStorage.clear();
   ```

2. **Reload the app** at http://localhost:5173/

3. **Sign up** with a new account (Firebase will create it)

4. **Complete profile**

5. **Upload a PDF** and submit a request

6. **Check Firebase Console**:
   - Storage → Should see uploaded PDF
   - Firestore → Should see request document

7. **Login as admin** and test download

---

## 🔧 Troubleshooting

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Go to Firebase Console → Authentication → Sign-in method
- Enable "Email/Password" provider

### Error: "storage/unauthorized"
- Check Storage security rules
- Make sure user is authenticated

### Error: "Failed to upload"
- Check file size (should be < 10MB)
- Verify file is actually a PDF
- Check browser console for detailed error

### PDFs not downloading
- Check if `pdfUrl` is saved in Firestore
- Verify Storage security rules allow read access
- Check browser's download settings

---

## 📊 Firebase Console Locations

- **Authentication**: https://console.firebase.google.com/project/printapp-374c1/authentication
- **Firestore**: https://console.firebase.google.com/project/printapp-374c1/firestore
- **Storage**: https://console.firebase.google.com/project/printapp-374c1/storage
- **Project Settings**: https://console.firebase.google.com/project/printapp-374c1/settings/general

---

## 🎯 Next Steps After Setup

1. ✅ Enable Firebase Authentication (Email/Password)
2. ✅ Enable Firestore Database
3. ✅ Enable Firebase Storage
4. ✅ Update security rules for production
5. ✅ Test upload and download
6. ✅ Add file size validation
7. ✅ Add progress indicators
8. ✅ Implement error handling

---

## 💡 Tips

- **File naming**: Use `userId_timestamp_originalname.pdf` to avoid conflicts
- **Storage structure**: Organize by user: `pdfs/{userId}/{filename}`
- **Cleanup**: Consider deleting PDFs after order completion
- **Limits**: Free tier has 1GB storage and 10GB/month download
- **Security**: Always validate file type and size on both client and server

---

Need help with any step? Let me know! 🚀
