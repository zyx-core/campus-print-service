import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, data } = req.body;

    try {
        if (type === 'new_request') {
            await handleNewRequest(data);
        } else if (type === 'status_update') {
            await handleStatusUpdate(data);
        } else {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: error.message });
    }
}

async function handleNewRequest(data) {
    const adminHtml = `
    <h2>🖨️ New Print Request</h2>
    <p><strong>Student:</strong> ${data.userEmail}</p>
    <p><strong>File:</strong> ${data.fileName}</p>
    <p><strong>Pages:</strong> ${data.pageCount}</p>
    <p><strong>Total Cost:</strong> ${data.totalCost}</p>
    <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
    <p><strong>Payment Status:</strong> ${data.paymentStatus}</p>
  `;

    const studentHtml = `
    <h2>✅ Request Received</h2>
    <p>Your print request for <strong>${data.fileName}</strong> has been received.</p>
    <p>Status: ${data.status}</p>
    <p>We will notify you when it is ready.</p>
  `;

    // Send to Admin
    if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
            from: 'Campus Print Service <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL,
            subject: `New Print Request: ${data.fileName}`,
            html: adminHtml,
        });
    }

    // Send to Student
    await resend.emails.send({
        from: 'Campus Print Service <onboarding@resend.dev>',
        to: data.userEmail,
        subject: 'Print Request Received',
        html: studentHtml,
    });
}

async function handleStatusUpdate(data) {
    const html = `
    <h2>🔔 Status Update</h2>
    <p>Your print request for <strong>${data.fileName}</strong> has been updated.</p>
    <h3>New Status: ${data.newStatus}</h3>
    ${data.newStatus === 'Ready for Pickup' ? '<p><strong>Please come to collect your documents.</strong></p>' : ''}
  `;

    await resend.emails.send({
        from: 'Campus Print Service <onboarding@resend.dev>',
        to: data.userEmail,
        subject: `Status Update: ${data.newStatus}`,
        html: html,
    });
}
