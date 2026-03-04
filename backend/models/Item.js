const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Lost', 'Found'], 
        required: true 
    },

    category: { 
        type: String, 
        required: true 
    },

    itemName: { 
        type: String, 
        required: true 
    },

    description: { 
        type: String, 
        required: true 
    },

    // --- NEW: SECRET VERIFICATION FIELD ---
    // This stores the private info from the reporter to help Admins verify claims
    adminNote: { 
        type: String, 
        default: '' 
    },

    location: { 
        type: String, 
        required: true 
    },

    contactEmail: { type: String },
    contactNumber: { type: String },
    telegramUsername: { type: String },

    imagePath: { type: String },

    reportedBy: {
        username: { 
            type: String, 
            required: true,
            default: 'Anonymous'
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        }
    },

    dateReported: { 
        type: Date, 
        default: Date.now 
    },

    // All claims related to this item
    claims: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Claim' 
    }],

    // Only ONE claim can be approved
    approvedClaim: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Claim', 
        default: null 
    },

    // Status tracking
    status: {
        type: String,
        enum: ['Available', 'Claimed', 'Returned'],
        default: 'Available'
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Fast lookup for user's reports
itemSchema.index({ "reportedBy.userId": 1 });

// Virtual helper to check if item is already claimed
itemSchema.virtual('hasApprovedClaim').get(function () {
    return !!this.approvedClaim;
});

module.exports = mongoose.model('Item', itemSchema);