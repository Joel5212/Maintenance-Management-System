const mongoose = require('mongoose')

const Schema = mongoose.Schema

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

    isFailure: {
        type: Boolean,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    completedDate: {
        type: Date,
        required: true
    },

    dueDate: {
        type: Date,
        required: false
    },

    priority: {
        type: String,
        required: false
    },

    servicers: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Repair', repairSchema)

