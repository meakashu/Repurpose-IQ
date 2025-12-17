import express from 'express';

const router = express.Router();

// Handle contact form submissions
router.post('/', async (req, res) => {
    try {
        const { name, email, company, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Import db dynamically to avoid circular dependencies
        const { default: db } = await import('../database/db.js');

        // Insert into database
        const stmt = db.prepare(`
      INSERT INTO contact_submissions (name, email, company, message, status)
      VALUES (?, ?, ?, ?, 'new')
    `);

        const result = stmt.run(name, email, company || null, message);

        // ==========================================
        // EMAIL NOTIFICATION (NOT YET IMPLEMENTED)
        // ==========================================
        // To enable email notifications for contact form submissions:
        // 
        // 1. Install nodemailer: npm install nodemailer
        // 2. Configure SMTP settings in .env (see .env.example)
        // 3. Uncomment and update the code below:
        //
        // import nodemailer from 'nodemailer';
        // const transporter = nodemailer.createTransport({
        //   host: process.env.SMTP_HOST,
        //   port: process.env.SMTP_PORT,
        //   auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASS,
        //   },
        // });
        // await transporter.sendMail({
        //   from: process.env.SMTP_FROM,
        //   to: 'admin@repurposeiq.com',
        //   subject: `New Contact Form: ${name}`,
        //   text: `From: ${name} (${email})\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`,
        // });
        //
        // Alternative: Use SendGrid, Mailgun, or AWS SES API
        // ==========================================

        res.json({
            success: true,
            message: 'Thank you for contacting us. We will get back to you soon!',
            submissionId: result.lastInsertRowid,
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to process contact form submission' });
    }
});

// Get all contact submissions (admin only - would need auth middleware)
router.get('/', async (req, res) => {
    try {
        const { default: db } = await import('../database/db.js');

        const submissions = db.prepare(`
      SELECT id, name, email, company, message, status, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT 100
    `).all();

        res.json({ submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch contact submissions' });
    }
});

export default router;
