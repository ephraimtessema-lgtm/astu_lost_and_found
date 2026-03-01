const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Optional virtual to populate user's reported items
userSchema.virtual('reportedItems', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'reportedBy.userId'
});

// Optional virtual to populate user's claims
userSchema.virtual('claims', {
    ref: 'Claim',
    localField: 'email',
    foreignField: 'claimerEmail'
});

module.exports = mongoose.model('User', userSchema);