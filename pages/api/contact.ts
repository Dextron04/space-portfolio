import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // SMTP config from .env.local
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // true for port 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify(); // Ensure SMTP config is valid
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #eee; width: 120px;">Name:</td>
                      <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; padding: 8px; border-bottom: 1px solid #eee;">Email:</td>
                      <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
                    </tr>
                  </table>
                  <div style="margin-bottom: 8px; font-weight: bold; color: #7c3aed;">Message:</div>
                  <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; color: #222; white-space: pre-line;">${message}</div>
                </div>
            `,
            replyTo: email,
        });
        return res.status(200).json({ success: true });
    } catch {
        return res.status(500).json({ error: 'Failed to send email' });
    }
} 