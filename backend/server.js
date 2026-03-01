require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. UPLOADS FOLDER ---
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static('uploads'));

// --- 2. MULTER STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Not an image!'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// --- 3. MONGODB CONNECTION ---
mongoose.connect(process.env.DB_URI || 'mongodb://127.0.0.1:27017/astu_lost_found')
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// --- 4. MODELS ---
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');

// --- 5. EMAIL SETUP ---
const emailUser = (process.env.EMAIL_USER || '').trim();
const emailPass = (process.env.EMAIL_PASS || '').trim();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass }
});

const FROM_LABEL = `"ASTU Lost & Found" <${emailUser}>`;
const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
const isEmailConfigured = Boolean(emailUser && emailPass);

// Verify Email Configuration
if (isEmailConfigured) {
    transporter.verify((error) => {
        if (error) console.warn('⚠️ Email Config Issue:', error.message);
        else console.log('✅ Email transporter ready');
    });
}

async function sendEmail({ to, subject, text, html }) {
    if (!isEmailConfigured || !to) return;
    try {
        await transporter.sendMail({ from: FROM_LABEL, to, subject, text, html: html || text });
        console.log(`📧 Email sent to: ${to}`);
    } catch (err) {
        console.error('Email send error:', err.message);
    }
}

// --- Email content (ASTU Lost & Found - astulostandfound@gmail.com) ---
const EMAIL = {
    welcome({ username }) {
        const subject = 'Welcome to ASTU Lost & Found';
        const text = `Hi ${username},\n\nWelcome to ASTU Lost & Found! Your account has been created successfully.\n\nYou can now:\n• Report lost or found items on campus\n• Browse and search items reported by others\n• Claim items you have lost\n• Get notified when your claim is reviewed\n\nIf you have any questions, reply to this email or contact us through the app.\n\n— ASTU Lost & Found Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 560px;">
                <h2 style="color: #003366;">Welcome to ASTU Lost & Found</h2>
                <p>Hi <strong>${username}</strong>,</p>
                <p>Your account has been created successfully.</p>
                <p>You can now:</p>
                <ul>
                    <li>Report lost or found items on campus</li>
                    <li>Browse and search items reported by others</li>
                    <li>Claim items you have lost</li>
                    <li>Get notified when your claim is reviewed</li>
                </ul>
                <p>If you have any questions, reply to this email or contact us through the app.</p>
                <p style="color: #666; margin-top: 24px;">— ASTU Lost & Found Team</p>
            </div>`;
        return { subject, text, html };
    },
    newClaimToAdmin({ itemName, claimerUsername, claimerEmail }) {
        const subject = `[ASTU Lost & Found] New claim: ${itemName}`;
        const text = `A new claim has been submitted.\n\nItem: ${itemName}\nClaimed by: ${claimerUsername} (${claimerEmail})\n\nPlease review and approve or reject the claim in the admin panel.`;
        const html = `
            <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #003366;">New claim submitted</h2>
                <p><strong>Item:</strong> ${itemName}</p>
                <p><strong>Claimed by:</strong> ${claimerUsername} (${claimerEmail})</p>
                <p>Please review and approve or reject the claim in the admin panel.</p>
            </div>`;
        return { subject, text, html };
    },
    claimApproved({ itemName, claimerUsername }) {
        const subject = `Your claim was approved: ${itemName}`;
        const text = `Hi ${claimerUsername},\n\nGood news! Your claim for "${itemName}" has been approved.\n\nNext steps: Use the reporter's contact information on the item page to coordinate handover. Please be respectful and arrange a safe, public place to meet.\n\n— ASTU Lost & Found Team`;
        const html = `
            <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #28a745;">Claim approved</h2>
                <p>Hi <strong>${claimerUsername}</strong>,</p>
                <p>Your claim for "<strong>${itemName}</strong>" has been approved.</p>
                <p><strong>Next steps:</strong> Use the reporter's contact information on the item page to coordinate handover. Please arrange a safe, public place to meet.</p>
                <p style="color: #666; margin-top: 24px;">— ASTU Lost & Found Team</p>
            </div>`;
        return { subject, text, html };
    },
    claimRejected({ itemName, claimerUsername }) {
        const subject = `Update on your claim: ${itemName}`;
        const text = `Hi ${claimerUsername},\n\nYour claim for "${itemName}" has been rejected. This may be because the item did not match or another claim was approved.\n\nYou can still browse other items on ASTU Lost & Found. If you have questions, reply to this email.\n\n— ASTU Lost & Found Team`;
        const html = `
            <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #003366;">Claim status update</h2>
                <p>Hi <strong>${claimerUsername}</strong>,</p>
                <p>Your claim for "<strong>${itemName}</strong>" has been rejected. This may be because the item did not match or another claim was approved.</p>
                <p>You can still browse other items on ASTU Lost & Found. If you have questions, reply to this email.</p>
                <p style="color: #666; margin-top: 24px;">— ASTU Lost & Found Team</p>
            </div>`;
        return { subject, text, html };
    }
};

// --- 6. UTILITIES ---
function normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }

const isAdminEmail = (email) => email && adminEmails.includes(email.trim().toLowerCase());

// Admin Middleware
const requireAdmin = (req, res, next) => {
    const requesterEmail = (req.header('x-user-email') || '').trim().toLowerCase();
    if (!isAdminEmail(requesterEmail)) return res.status(403).json({ message: 'Access denied. Admin only.' });
    next();
};

// --- 7. ROUTES ---

// TEST EMAIL
app.get('/api/test-email', async (req, res) => {
    try {
        const { subject, text, html } = EMAIL.welcome({ username: 'Test User' });
        await sendEmail({ to: emailUser, subject, text, html });
        res.json({ message: "Sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const cleanEmail = normalizeEmail(email);
        if (!username || !cleanEmail || !password) return res.status(400).json({ message: "All fields required" });
        const existingUser = await User.findOne({ $or: [{ username }, { email: cleanEmail }] });
        if (existingUser) return res.status(400).json({ message: "User exists" });
        const newUser = new User({ username, email: cleanEmail, password });
        await newUser.save();
        const { subject, text, html } = EMAIL.welcome({ username });
        sendEmail({ to: cleanEmail, subject, text, html });
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: normalizeEmail(email) });
        if (!user || user.password !== password) return res.status(400).json({ message: "Invalid credentials" });
        
        // --- NOTE: Make sure this sends back the userId ---
        res.status(200).json({ 
            username: user.username, 
            email: user.email, 
            userId: user._id, // This is crucial
            role: isAdminEmail(user.email) ? 'admin' : 'user' 
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// REPORT ITEM
app.post('/api/items', upload.single('itemImage'), async (req, res) => {
    try {
        const { type, category, itemName, description, location, contactEmail, contactNumber, telegramUsername, reportedBy } = req.body;
        
        // Basic validation
        if (!itemName || !description || !type || !location) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Parse reportedBy JSON string sent from frontend (FormData)
        let userData = { username: 'Anonymous', userId: null };
        if (reportedBy) {
            try {
                userData = JSON.parse(reportedBy);
            } catch (e) {
                console.error("Error parsing reportedBy:", e);
                return res.status(400).json({ message: "Invalid user data format" });
            }
        }

        // --- VALIDATION: Ensure User ID exists ---
        if (!userData.userId) {
            return res.status(401).json({ message: "You must be logged in to report an item." });
        }
        // ------------------------------------

        // Create new item
        const newItem = new Item({
            type, 
            category, 
            itemName, 
            description, 
            location,
            contactEmail,
            contactNumber,
            telegramUsername,
            imagePath: req.file ? `/uploads/${req.file.filename}` : '',
            reportedBy: {
                username: userData.username || 'Anonymous',
                userId: userData.userId // Must be valid ObjectId string
            }
        });
        
        await newItem.save();
        res.status(201).json({ message: "Item reported successfully", item: newItem });
    } catch (err) {
        console.error("Report item error:", err);
        // Handle Mongoose validation errors specifically
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: err.message });
        }
        res.status(500).json({ message: "Error submitting report", error: err.message });
    }
});

// GET ITEMS
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ dateReported: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: "Error fetching items" });
    }
});

// --- CLAIM ROUTES ---

// SUBMIT CLAIM
app.post('/api/items/:id/claim', async (req, res) => {
    try {
        const { username, email, userId } = req.body;
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        const newClaim = new Claim({ 
            itemId: item._id, 
            itemName: item.itemName, 
            claimerUsername: username, 
            claimerEmail: email,
            claimerId: userId
        });
        await newClaim.save();
        
        // Notify Admins via email
        if (adminEmails.length) {
            const { subject, text, html } = EMAIL.newClaimToAdmin({
                itemName: item.itemName,
                claimerUsername: username,
                claimerEmail: email || ''
            });
            sendEmail({ to: adminEmails.join(','), subject, text, html });
        }
        res.status(200).json({ message: "Claim submitted" });
    } catch (err) {
        console.error("Claim Error:", err);
        res.status(500).json({ message: "Failed to claim" });
    }
});

// GET CLAIMS (Admin)
app.get('/api/admin/claims', requireAdmin, async (req, res) => {
    try {
        const claims = await Claim.find().sort({ dateRequested: -1 });
        res.status(200).json(claims);
    } catch (err) {
        console.error("Claims Fetch Error:", err);
        res.status(500).json({ message: "Failed to load claims" });
    }
});

// UPDATE CLAIM STATUS (Admin)
app.put('/api/admin/claims/:id', requireAdmin, async (req, res) => {
    try {
        const { status } = req.body; // Approved or Rejected
        const claim = await Claim.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        if (!claim) return res.status(404).json({ message: "Claim not found" });

        // Notify the user via email (from astulostandfound@gmail.com)
        if (claim.claimerEmail) {
            const statusLower = (status || '').toLowerCase();
            const isApproved = statusLower === 'approved';
            const { subject, text, html } = isApproved
                ? EMAIL.claimApproved({ itemName: claim.itemName, claimerUsername: claim.claimerUsername })
                : EMAIL.claimRejected({ itemName: claim.itemName, claimerUsername: claim.claimerUsername });
            sendEmail({ to: claim.claimerEmail, subject, text, html });
        }

        res.status(200).json({ message: `Claim ${status} successfully`, claim });
    } catch (err) {
        console.error("Update Status Error:", err);
        res.status(500).json({ message: "Failed to update claim status" });
    }
});

// SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));