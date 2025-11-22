import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { SMTP_USER, SMTP_PASS, ADMIN_EMAIL, APP_URL } = process.env;

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Using Gmail service for simplicity
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Helper to send mail
async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Campus Print Service" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// 1. Notify Admin about New Request
async function notifyAdminNewRequest(data) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🖨️ New Print Request</h2>
      <p>A new print request has been submitted.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Student:</strong> ${data.userEmail}</p>
        <p><strong>File:</strong> ${data.fileName}</p>
        <p><strong>Pages:</strong> ${data.pageCount}</p>
        <p><strong>Total Cost:</strong> ${data.totalCost}</p>
        <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
        <p><strong>Payment Status:</strong> <span style="color: ${data.paymentStatus === 'Paid' ? 'green' : 'orange'}">${data.paymentStatus}</span></p>
      </div>

      <a href="${APP_URL || 'http://localhost:5173'}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Admin Dashboard</a>
    </div>
  `;

  if (ADMIN_EMAIL) {
    await sendMail(ADMIN_EMAIL, `New Print Request: ${data.fileName}`, html);
  }
}

// 2. Notify Student Confirmation
async function notifyStudentConfirmation(data) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">✅ Request Received</h2>
      <p>Hi there,</p>
      <p>Your print request has been successfully received.</p>
      
      <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>File:</strong> ${data.fileName}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Amount:</strong> ${data.totalCost}</p>
      </div>

      <p>We will notify you when your print is ready.</p>
    </div>
  `;

  await sendMail(data.userEmail, 'Print Request Confirmation', html);
}

// 3. Notify Student Status Change
async function notifyStudentStatusChange(data) {
  const statusColors = {
    'Printing': '#2563eb', // Blue
    'Ready for Pickup': '#16a34a', // Green
    'Completed': '#4b5563', // Gray
    'Rejected': '#dc2626' // Red
  };

  const color = statusColors[data.newStatus] || '#000000';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${color};">🔔 Status Update</h2>
      <p>Your print request status has changed.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #6b7280; font-size: 0.9em;">New Status</p>
        <h3 style="margin: 10px 0; color: ${color}; font-size: 1.5em;">${data.newStatus}</h3>
        <p style="margin: 0; font-size: 0.9em;">File: ${data.fileName}</p>
      </div>

      ${data.newStatus === 'Ready for Pickup' ? '<p><strong>Please come to the print shop to collect your documents.</strong></p>' : ''}
    </div>
  `;

  await sendMail(data.userEmail, `Status Update: ${data.newStatus}`, html);
}

export {
  notifyAdminNewRequest,
  notifyStudentConfirmation,
  notifyStudentStatusChange
};
