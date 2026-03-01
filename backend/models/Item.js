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
    location: { 
        type: String, 
        required: true 
    },
    contactEmail: { 
        type: String 
    },
    contactNumber: { 
        type: String 
    },
    telegramUsername: { 
        type: String 
    },
    imagePath: { 
        type: String 
    },
    reportedBy: {
        username: { 
            type: String, 
            required: [true, 'Username is required'],
            default: 'Anonymous'
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: [true, 'User ID is required'] // Mongoose will throw error if this is null
        }
    },
    dateReported: { 
        type: Date, 
        default: Date.now 
    },
    claims: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Claim' 
    }],
    approvedClaim: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Claim', 
        default: null 
    }
}, {
    // Enable virtuals to be included in JSON responses
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index the reportedBy.userId for fast lookups
itemSchema.index({ "reportedBy.userId": 1 });

// Optional virtual for quick lookup if item has approved claim
itemSchema.virtual('hasApprovedClaim').get(function() {
    return !!this.approvedClaim;
});

module.exports = mongoose.model('Item', itemSchema);