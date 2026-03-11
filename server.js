import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration error:', error.message);
      console.log('⚠️  Contact form emails will not be sent');
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file');
}

// Setup multer for uploading media
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir)); // Serve static files from the uploads directory

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dramaclub');
    console.log('MongoDB connected successfully');
    await seedContent();
    await seedAdmin();
    await seedSettings();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// Settings Schema
const settingsSchema = new mongoose.Schema({
  emailRecipient: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});
const Settings = mongoose.model('Settings', settingsSchema);

// Content Schema
const contentSchema = new mongoose.Schema({
  heroText: { type: String, default: "Arts, Media & Drama Club" },
  heroDescription: { type: String, default: "A vibrant community of storytellers, performers, and creative minds dedicated to exploring the boundless world of performing and media arts." },
  heroBackgroundImage: { type: String, default: "" },
  heroContent: [{
    type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    content: String,
    url: String,
    caption: String
  }],
  aboutSubtitle: { type: String, default: "Who We Are" },
  aboutContent: [{
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    content: String, // For text blocks
    url: String, // For image blocks
    caption: String // Optional caption for images
  }],
  aboutDescription1: { type: String, default: "The Arts, Media & Drama Club at Academic City University is a vibrant community of passionate performers, creative minds, and storytelling enthusiasts. We provide a platform for students to explore theatrical arts, develop performance skills, and bring compelling stories to life on stage." },
  aboutDescription2: { type: String, default: "Through theatre, media, and visual arts, we foster artistic excellence, creative expression, and collaborative spirit." },
  productions: [{
    title: String,
    year: String,
    genre: String,
    description: String,
    image: String, // Main cover image
    content: [{ // Rich content blocks for each production
      type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
      content: String,
      url: String,
      caption: String
    }]
  }],
  gallery: [{ label: String, url: String }],
  team: [{ 
    name: String, 
    aka: String, 
    role: String, 
    description: String,
    photo: String, // Profile photo
    bio: [{ // Rich bio content blocks
      type: { type: String, enum: ['text', 'image'], default: 'text' },
      content: String,
      url: String,
      caption: String
    }]
  }],
  stats: [{ icon: String, count: Number, suffix: String, label: String }],
  tertuliaDescription: String,
  tertuliaContent: [{ // Rich content blocks for tertulia
    type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
    content: String,
    url: String,
    caption: String
  }],
  tertuliaMedia: [{ label: String, url: String }],
  // Page Titles
  pageTitle_about: { type: String, default: "About Us" },
  pageTitle_projects: { type: String, default: "Productions" },
  pageTitle_team: { type: String, default: "Our Team" },
  pageTitle_gallery: { type: String, default: "Gallery" },
  pageTitle_tertulia: { type: String, default: "Tertulia Sessions" },
  pageTitle_contact: { type: String, default: "Contact Us" },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

// Seed Initial Content
const seedContent = async () => {
  const count = await Content.countDocuments();
  if (count === 0) {
    await Content.create({
      productions: [
        { title: 'Romeo & Juliet', year: '2024', genre: 'Classic Drama', description: "Shakespeare's timeless tale of love and tragedy" },
        { title: 'The Lion King', year: '2023', genre: 'Musical', description: 'A spectacular journey to the African savanna' },
        { title: 'Hamlet', year: '2023', genre: 'Classic Drama', description: "The prince's quest for truth and justice" },
        { title: 'Mamma Mia!', year: '2023', genre: 'Musical', description: "ABBA's hits come alive on stage" },
        { title: "A Midsummer Night's Dream", year: '2022', genre: 'Comedy', description: 'Magic and mischief in the enchanted forest' },
        { title: 'Les Misérables', year: '2022', genre: 'Musical', description: 'Epic tale of redemption and revolution' },
      ],
      gallery: [
        { label: 'Opening Night', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
        { label: 'Stage Rehearsal', url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80' },
        { label: 'Curtain Call', url: 'https://images.unsplash.com/photo-1503095396549-807039045349?auto=format&fit=crop&w=800&q=80' },
        { label: 'Backstage Moments', url: 'https://images.unsplash.com/photo-1478720568477-152d9b92543f?auto=format&fit=crop&w=800&q=80' },
        { label: 'The Grand Stage', url: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=800&q=80' },
        { label: 'Drama in Motion', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80' },
      ],
      team: [
        { name: 'Nhyira Okla', aka: 'Acsah', role: 'President', description: 'Leading with vision, passion, and creativity, Nhyira continues to guide the club in building spaces where stories are told, ideas flourish, and artistic expression thrives.' },
        { name: 'Sybil Sackey', aka: '', role: 'Vice President', description: "Through dedication and collaboration, Sybil plays a vital role in strengthening the club's community and supporting the creative process behind every production and project." },
        { name: 'Mercy Akeredolu', aka: '', role: 'Head Of Drama', description: 'Mercy helps bring stories to life on stage, guiding performances with creativity, discipline, and a deep passion for theatre and storytelling.' },
        { name: 'Eyeson-Ghansah', aka: 'Lois', role: 'General Secretary', description: 'With organization, commitment, and attention to detail, Lois keeps the heartbeat of the club steady, ensuring every idea and initiative moves forward with purpose.' },
      ],
      stats: [
        { icon: 'Film', count: 20, suffix: '+', label: 'Productions' },
        { icon: 'Users', count: 100, suffix: '+', label: 'Members' },
        { icon: 'Trophy', count: 15, suffix: '+', label: 'Awards' },
      ],
      tertuliaDescription: 'Our gathering space for creative minds to share ideas, discuss art, and inspire one another.',
      tertuliaMedia: [
        { label: 'Weekly Discussion', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80' },
        { label: 'Creative Workshop', url: 'https://images.unsplash.com/photo-1574267432644-f6e0e17d8bf7?auto=format&fit=crop&w=800&q=80' },
        { label: 'Collaborative Session', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' },
      ]
    });
    console.log('Seeded initial Content data');
  }
};

const seedAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Seeded default admin user (admin / admin123)');
  }
};

const seedSettings = async () => {
  const count = await Settings.countDocuments();
  if (count === 0) {
    await Settings.create({ 
      emailRecipient: process.env.EMAIL_RECIPIENT || 'kojoben29@gmail.com'
    });
    console.log('Seeded default settings');
  }
};

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'amd_secret_key');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Create new contact submission
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        // Get email recipient from settings
        const settings = await Settings.findOne();
        const adminEmail = settings?.emailRecipient || process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER;

        // Email to admin
        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: adminEmail,
          subject: `🎭 New Contact Form Submission - AMD Club`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1c1917; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
                .content { padding: 30px; }
                .field { margin-bottom: 20px; }
                .label { color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 5px; }
                .value { color: #1c1917; font-size: 16px; padding: 10px; background-color: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 4px; }
                .message-box { background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-top: 10px; }
                .footer { background-color: #0c0a09; color: #fef3c7; text-align: center; padding: 20px; font-size: 12px; }
                .icon { font-size: 40px; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">🎭</div>
                  <h1>New Contact Form Submission</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">AMD Club Website</p>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="label">From</div>
                    <div class="value"><strong>${name}</strong></div>
                  </div>
                  <div class="field">
                    <div class="label">Email</div>
                    <div class="value"><a href="mailto:${email}" style="color: #1c1917; text-decoration: none;">${email}</a></div>
                  </div>
                  ${phone ? `
                  <div class="field">
                    <div class="label">Phone</div>
                    <div class="value">${phone}</div>
                  </div>
                  ` : ''}
                  <div class="field">
                    <div class="label">Message</div>
                    <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                  <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f4; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; color: #78716c; font-size: 14px;">
                      <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <div class="footer">
                  <p style="margin: 0;">Academic City University - AMD Club</p>
                  <p style="margin: 5px 0 0 0; opacity: 0.7;">Arts, Media & Drama Club</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        // Confirmation email to user
        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: '✅ Message Received - AMD Club',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1c1917; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
                .content { padding: 30px; color: #1c1917; line-height: 1.6; }
                .footer { background-color: #0c0a09; color: #fef3c7; text-align: center; padding: 20px; font-size: 12px; }
                .icon { font-size: 50px; margin-bottom: 10px; }
                .button { display: inline-block; background-color: #fbbf24; color: #1c1917; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="icon">✅</div>
                  <h1>Thank You for Contacting Us!</h1>
                </div>
                <div class="content">
                  <p>Hi <strong>${name}</strong>,</p>
                  <p>Thank you for reaching out to the AMD Club! We've successfully received your message and will get back to you as soon as possible.</p>
                  <div style="background-color: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px;"><strong>Your Message:</strong></p>
                    <p style="margin: 10px 0 0 0;">${message.replace(/\n/g, '<br>')}</p>
                  </div>
                  <p>Our team typically responds within 24-48 hours during weekdays.</p>
                  <p>In the meantime, feel free to explore our website and learn more about our upcoming events and productions!</p>
                  <div style="text-align: center;">
                    <a href="${process.env.WEBSITE_URL || 'https://your-domain.vercel.app'}" class="button" style="color: #1c1917;">Visit Our Website</a>
                  </div>
                </div>
                <div class="footer">
                  <p style="margin: 0;"><strong>AMD Club</strong></p>
                  <p style="margin: 5px 0;">Arts, Media & Drama Club</p>
                  <p style="margin: 5px 0; opacity: 0.7;">Academic City University</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        
        console.log(`📧 Emails sent successfully to admin and ${email}`);
      } catch (emailError) {
        console.error('❌ Error sending email:', emailError.message);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form'
    });
  }
});

// Get all contacts (optional - for admin purposes)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'amd_secret_key', { expiresIn: '1d' });
    res.json({ success: true, token, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Content API Routes
app.get('/api/content', async (req, res) => {
  try {
    const content = await Content.findOne();
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/content', authMiddleware, async (req, res) => {
  try {
    const updatedData = req.body;
    updatedData.updatedAt = Date.now();
    const content = await Content.findOneAndUpdate({}, updatedData, { new: true, upsert: true });
    res.json({ success: true, data: content, message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, message: 'Server error updating content' });
  }
});

// Settings API Routes
app.get('/api/settings', authMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ emailRecipient: process.env.EMAIL_RECIPIENT || '' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/settings', authMiddleware, async (req, res) => {
  try {
    const { emailRecipient } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { emailRecipient, updatedAt: Date.now() }, 
      { new: true, upsert: true }
    );
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
});

// === Upload Media Endpoint ===
app.post('/api/upload', authMiddleware, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
