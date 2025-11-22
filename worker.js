/**
 * Cloudflare Worker for Campus Print Service Email Notifications
 * Uses Resend API to send emails
 */

export default {
    async fetch(request, env, ctx) {
        // Handle CORS
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            const data = await request.json();

            if (path === "/api/request") {
                return await handleNewRequest(data, env);
            } else if (path === "/api/statusUpdate") {
                return await handleStatusUpdate(data, env);
            } else {
                return new Response("Not Found", { status: 404 });
            }
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
            });
        }
    },
};

// Helper to send email via Resend
async function sendEmail(env, to, subject, html) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "Campus Print Service <onboarding@resend.dev>", // Use verified domain in production
            to: [to],
            subject: subject,
            html: html,
        }),
    });

    const responseData = await res.json();
    if (!res.ok) {
        throw new Error(`Resend API Error: ${JSON.stringify(responseData)}`);
    }
    return responseData;
}

// Handle New Request Notification
async function handleNewRequest(data, env) {
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

    // Send to Admin (if configured)
    if (env.ADMIN_EMAIL) {
        await sendEmail(env, env.ADMIN_EMAIL, `New Print Request: ${data.fileName}`, adminHtml);
    }

    // Send to Student
    await sendEmail(env, data.userEmail, "Print Request Received", studentHtml);

    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });
}

// Handle Status Update Notification
async function handleStatusUpdate(data, env) {
    const html = `
    <h2>🔔 Status Update</h2>
    <p>Your print request for <strong>${data.fileName}</strong> has been updated.</p>
    <h3>New Status: ${data.newStatus}</h3>
    ${data.newStatus === 'Ready for Pickup' ? '<p><strong>Please come to collect your documents.</strong></p>' : ''}
  `;

    await sendEmail(env, data.userEmail, `Status Update: ${data.newStatus}`, html);

    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });
}
