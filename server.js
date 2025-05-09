const express = require('express');
const { createTransport } = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter setup
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.PASSWORD // Your Gmail password or app password
  }
});

// Test the transporter on startup
transporter.verify(function(error, success) {
  if (error) {
    console.log('Error setting up email transporter:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Rest of the code remains the same...
// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }
  
  // Email options for admin notification
  const adminMailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL, // Send to yourself
    subject: `Contact Form: ${subject || 'New Message'}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };
  
  // Email options for user confirmation
  const userMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Thank you for contacting Shalomville InnoTech Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #8B0000;">Shalomville InnoTech Academy</h2>
        </div>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Shalomville InnoTech Academy. We have received your message regarding "${subject || 'your inquiry'}".</p>
        <p>Our team will review your message and get back to you as soon as possible, usually within 24-48 business hours.</p>
        <p>If you have any urgent concerns, please call us at (123) 456-7890.</p>
        <p>Best regards,</p>
        <p>The Shalomville InnoTech Academy Team</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  };
  
  // Send emails
  // 1. Send admin notification
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.log('Error sending admin email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
    
    console.log('Admin email sent:', info.response);
    
    // 2. Send user confirmation
    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.log('Error sending user confirmation email:', error);
        // Still return success as the main message was sent
        return res.status(200).json({ success: true, message: 'Message sent successfully, but failed to send confirmation' });
      }
      
      console.log('User confirmation email sent:', info.response);
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    });
  });
});

// Registration form endpoint
app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, phone, program, startDate, experience, education, goals } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !program) {
    return res.status(400).json({ success: false, message: 'First name, last name, email, and program selection are required' });
  }
  
  // Email options for admin notification
  const adminMailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL, // Send to yourself
    subject: `New Registration: ${firstName} ${lastName}`,
    html: `
      <h3>New Student Registration</h3>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Program:</strong> ${program}</p>
      <p><strong>Preferred Start Date:</strong> ${startDate || 'N/A'}</p>
      <p><strong>Experience Level:</strong> ${experience || 'N/A'}</p>
      <p><strong>Education Level:</strong> ${education || 'N/A'}</p>
      <p><strong>Career Goals:</strong> ${goals || 'N/A'}</p>
    `
  };
  
  // Email options for user confirmation
  const userMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Registration at Shalomville InnoTech Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #8B0000;">Shalomville InnoTech Academy</h2>
        </div>
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for registering for the <strong>${program}</strong> program at Shalomville InnoTech Academy!</p>
        <p>We're excited to have you join our community of tech learners. Here's a summary of your registration:</p>
        <ul>
          <li><strong>Program:</strong> ${program}</li>
          <li><strong>Preferred Start Date:</strong> ${startDate || 'To be determined'}</li>
        </ul>
        <p>What happens next?</p>
        <ol>
          <li>Our admissions team will review your application within 2 business days.</li>
          <li>You'll receive a call from our counselor to discuss your goals and confirm your enrollment.</li>
          <li>Once confirmed, you'll receive your course materials and access to our learning platform.</li>
        </ol>
        <p>If you have any questions in the meantime, please contact our admissions office at (123) 456-7890 or reply to this email.</p>
        <p>We look forward to helping you achieve your tech career goals!</p>
        <p>Best regards,</p>
        <p>The Shalomville InnoTech Academy Team</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>This is an automated message. For questions, please contact admissions@shalomvilleinnotech.com</p>
        </div>
      </div>
    `
  };
  
  // Send emails
  // 1. Send admin notification
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.log('Error sending admin email:', error);
      return res.status(500).json({ success: false, message: 'Failed to process registration' });
    }
    
    console.log('Admin email sent:', info.response);
    
    // 2. Send user confirmation
    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.log('Error sending user confirmation email:', error);
        // Still return success as the main registration was processed
        return res.status(200).json({ success: true, message: 'Registration successful, but failed to send confirmation' });
      }
      
      console.log('User confirmation email sent:', info.response);
      res.status(200).json({ success: true, message: 'Registration successful' });
    });
  });
});

// Test route to verify server is running
app.get('/test', (req, res) => {
  res.send('Email server is running!');
});

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.send('Shalomville Email Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});