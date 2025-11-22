const express = require('express');
const cors = require('cors');
const { notifyAdminNewRequest, notifyStudentConfirmation, notifyStudentStatusChange } = require('./emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Campus Print Service API is running');
});

// 1. Endpoint for New Request Notifications
app.post('/api/request', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received new request notification:', data.fileName);

        // Send emails in parallel
        await Promise.all([
            notifyAdminNewRequest(data),
            notifyStudentConfirmation(data)
        ]);

        res.json({ success: true, message: 'Notifications sent' });
    } catch (error) {
        console.error('Error sending request notifications:', error);
        // Don't fail the request if email fails, just log it
        res.status(500).json({ error: error.message });
    }
});

// 2. Endpoint for Status Update Notifications
app.post('/api/statusUpdate', async (req, res) => {
    try {
        const { requestId, newStatus, userEmail, fileName } = req.body;
        console.log(`Status update for ${fileName}: ${newStatus}`);

        await notifyStudentStatusChange({
            userEmail,
            fileName,
            newStatus
        });

        res.json({ success: true, message: 'Status notification sent' });
    } catch (error) {
        console.error('Error sending status notification:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
