const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Custom function to format the cost with 2 decimal places
function formatCost(cost) {
    // Ensure cost is a number
    if (typeof cost === 'number') {
        // Round the number to 2 decimal places
        return parseFloat(cost.toFixed(2));
    }
    return cost; // Return unchanged if not a number
}

const repairSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: false
    },
    startDate: {
        type: Date,
        required: false,

    },
    dueDate: {
        type: Date,
        required: false,
    },
    completedDate: {
        type: Date,
        required: false
    },
    priority: {
        type: String,
        required: false
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    assignedTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    },
    status: {
        type: String,
        required: false,
        default: function () {
            return "Incomplete";
        }
    },
    cost: {
        type: Number,
        required: false,
        set: formatCost
    },
    description: {
        type: String,
        required: false
    },

    isFailure: {
        type: Boolean,
        required: true
    },

    failure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Failure',
        required: false
    },

    procedure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RepairProcedure',
        required: false
    },

    procedureTitle: {
        type: String,
        required: false
    },

    procedureDescription: {
        type: String,
        required: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },

}, { timestamps: true })


module.exports = mongoose.model('Repair', repairSchema)

