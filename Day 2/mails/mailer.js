const express = require('express');
const nodemailer = require('nodemailer');
const mail = express();

mail.use(express.json());

require('dotenv').config();

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});
// const mailTransporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'augusta.brakus@ethereal.email',
//         pass: 'VhMVN6MM2brHpwMHWG'
//     }
// });
mail.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        if (!to || !subject || !text) {
            return res.status(400).json({ message: "All fields (to, subject, text) are required" });
        }

        const mailDetails = {
            from: 'jospenngumk@gmail.com', 
            to,
            subject,
            text
        };

        mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
                console.error("Error occurred while sending email:", err);
                return res.status(500).json({ message: "Failed to send email", error: err.message });
            }
            console.log('Email sent successfully');
            res.status(200).json({
                message: "Email sent successfully",
                info: data
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending mail', error: error.message });
    }
});

module.exports = mail;
