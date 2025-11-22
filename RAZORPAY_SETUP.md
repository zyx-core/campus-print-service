# Razorpay Integration Guide

Complete guide to integrate Razorpay payment gateway into your Campus Print Service.

---

## 📋 Prerequisites

1. Razorpay account (create at https://razorpay.com/)
2. Test API keys from Razorpay Dashboard
3. Your app running on http://localhost:5173/

---

## Step 1: Create Razorpay Account

1. **Sign up** at https://razorpay.com/
2. **Verify your email**
3. **Complete KYC** (for production, can skip for testing)
4. **Go to Dashboard** → Settings → API Keys
5. **Generate Test Keys**:
   - You'll get: `Key ID` and `Key Secret`
   - Keep these safe!

---

## Step 2: Install Razorpay SDK

Run this command in your project:

```bash
npm install razorpay
```

**Note:** The Razorpay npm package is for backend/server-side. For frontend, we'll use their checkout script.

---

## Step 3: Add Razorpay Script to HTML

Update `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>campus-print-service</title>
    <!-- Add Razorpay Checkout Script -->
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

## Step 4: Create Razorpay Config File

Create `src/razorpay.js`:

```javascript
// Razorpay configuration
export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID'; // Replace with your test key

export const createRazorpayOrder = (amount, currency = 'INR') => {
  return {
    amount: amount * 100, // Razorpay expects amount in paise (₹1 = 100 paise)
    currency: currency,
  };
};

export const openRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: options.currency || 'INR',
      name: 'Campus Print Service',
      description: options.description || 'Print Service Payment',
      image: '/vite.svg', // Your logo
      handler: function (response) {
        // Payment successful
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: options.customerName || '',
        email: options.customerEmail || '',
        contact: options.customerPhone || '',
      },
      notes: options.notes || {},
      theme: {
        color: '#2563eb', // Blue color matching your app
      },
      modal: {
        ondismiss: function() {
          reject({
            success: false,
            error: 'Payment cancelled by user',
          });
        },
      },
    });

    rzp.on('payment.failed', function (response) {
      reject({
        success: false,
        error: response.error.description,
        code: response.error.code,
        metadata: response.error.metadata,
      });
    });

    rzp.open();
  });
};
```

---

## Step 5: Update student.js for Razorpay

Replace the payment confirmation section in `student.js`:

**Find this code (around line 222-265):**

```javascript
confirmPaymentBtn.addEventListener('click', async () => {
  // Simulate Payment Success
  confirmPaymentBtn.disabled = true;
  confirmPaymentBtn.textContent = "Processing...";

  try {
    // Save to Firestore
    await addDoc(collection(db, "requests"), {
      // ... existing code
    });
    // ... rest of code
  } catch (error) {
    // ... error handling
  }
});
```

**Replace with:**

```javascript
import { openRazorpayCheckout, createRazorpayOrder } from './razorpay';

// ... (keep all existing code above)

confirmPaymentBtn.addEventListener('click', async () => {
  confirmPaymentBtn.disabled = true;
  confirmPaymentBtn.textContent = "Opening Payment...";

  try {
    const totalCost = calculateCost();
    const orderData = createRazorpayOrder(totalCost);

    // Get user data from auth
    const currentUser = auth.currentUser;

    // Open Razorpay Checkout
    const paymentResult = await openRazorpayCheckout({
      amount: orderData.amount,
      currency: orderData.currency,
      description: `Print: ${currentFile.name}`,
      customerName: currentUser.displayName || currentUser.email,
      customerEmail: currentUser.email,
      notes: {
        fileName: currentFile.name,
        pageCount: pageCount,
        duplex: duplexSelect.value,
        copies: copiesInput.value,
      },
    });

    // Payment successful - Save to Firestore
    await addDoc(collection(db, "requests"), {
      userId: user.uid,
      userEmail: user.email,
      fileName: currentFile.name,
      pageCount: pageCount,
      options: {
        duplex: duplexSelect.value,
        copies: parseInt(copiesInput.value),
        finishing: finishingSelect.value
      },
      totalCost: totalCost,
      status: 'New Request',
      paymentStatus: 'Paid',
      paymentId: paymentResult.paymentId,
      razorpayOrderId: paymentResult.orderId,
      createdAt: new Date()
    });

    // Reset Form
    paymentModal.classList.add('hidden');
    alert("Payment successful! Order placed.");

    // Reset UI
    fileInput.value = '';
    currentFile = null;
    pageCount = 0;
    fileNameDisplay.classList.add('hidden');
    pageCountDisplay.classList.add('hidden');
    optionsSection.classList.add('opacity-50', 'pointer-events-none');
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.textContent = "Pay Now";

  } catch (error) {
    console.error("Payment error:", error);
    
    if (error.success === false) {
      // Payment failed or cancelled
      alert(`Payment failed: ${error.error || 'Unknown error'}`);
    } else {
      // Other error (Firestore, etc.)
      alert("Failed to submit request: " + error.message);
    }
    
    confirmPaymentBtn.disabled = false;
    confirmPaymentBtn.textContent = "Pay Now";
  }
});
```

---

## Step 6: Update Your Razorpay Key

In `src/razorpay.js`, replace the key:

```javascript
export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_ACTUAL_KEY_ID';
```

Get your key from: https://dashboard.razorpay.com/app/keys

---

## Step 7: Test the Integration

1. **Refresh your app**
2. **Upload a PDF**
3. **Click "Pay & Submit Request"**
4. **Click "Pay Now"**
5. **Razorpay checkout should open**

### Test Card Details (Razorpay Test Mode):

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failure:**
- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**UPI Test:**
- UPI ID: `success@razorpay`

---

## Step 8: Verify Payment in Dashboard

After successful payment:

1. Go to https://dashboard.razorpay.com/app/payments
2. You should see the test payment
3. Check Firestore - request should have `paymentId` field

---

## 🔒 Production Checklist

Before going live:

- [ ] Replace test keys with live keys
- [ ] Complete Razorpay KYC verification
- [ ] Set up webhook for payment verification
- [ ] Add payment verification on backend
- [ ] Enable only required payment methods
- [ ] Test refund flow
- [ ] Add proper error handling
- [ ] Set up payment reconciliation

---

## 🐛 Troubleshooting

### "Razorpay is not defined"
- Make sure the script is loaded in `index.html`
- Check browser console for script loading errors

### Payment not opening
- Check if `RAZORPAY_KEY_ID` is correct
- Verify the key is a test key (starts with `rzp_test_`)
- Check browser console for errors

### Payment successful but not saving
- Check Firestore security rules
- Verify user is authenticated
- Check browser console for Firestore errors

### Amount showing wrong
- Remember: Razorpay uses paise (₹1 = 100 paise)
- Check `createRazorpayOrder` function

---

## 📊 Payment Flow

```
User clicks "Pay Now"
    ↓
Razorpay Checkout Opens
    ↓
User enters card details
    ↓
Payment processed
    ↓
Success → Save to Firestore with paymentId
    ↓
Show success message
```

---

## 🔗 Useful Links

- **Razorpay Dashboard**: https://dashboard.razorpay.com/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-upi-details/
- **Checkout Docs**: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- **API Reference**: https://razorpay.com/docs/api/

---

## 💡 Optional Enhancements

1. **Add loading spinner** during payment
2. **Show payment receipt** after success
3. **Email confirmation** with payment details
4. **Refund functionality** in admin panel
5. **Payment history** in student dashboard
6. **Webhook verification** for security

---

Need help with any step? Let me know! 🚀
