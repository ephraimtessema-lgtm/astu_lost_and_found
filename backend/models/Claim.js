const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item', 
        required: true 
    },
    itemName: { 
        type: String, 
        required: true 
    },
    claimerUsername: { 
        type: String, 
        required: true 
    },
    claimerEmail: { 
        type: String, 
        required: true 
    },
    // Verification details from claimer - only admin sees, used to match with item's adminNote
    claimDetails: { 
        type: String, 
        default: '' 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    dateRequested: { 
        type: Date, 
        default: Date.now 
    },
    // Optional: track admin who approved/rejected the claim
    processedBy: { 
        type: String, 
        default: null 
    },
    dateProcessed: { 
        type: Date 
    }
});

// Optional: create a virtual to quickly check if claim is approved
claimSchema.virtual('isApproved').get(function() {
    return this.status === 'Approved';
});

module.exports = mongoose.model('Claim', claimSchema);