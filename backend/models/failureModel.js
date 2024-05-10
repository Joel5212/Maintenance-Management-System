const mongoose = require('mongoose')

const Schema = mongoose.Schema

const failureSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    observation: {
        type: String,
        required: true
    },

    denseVectorOfObservation: [
        Number
    ],

    cause: {
        type: String,
        required: true
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

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },

},)

module.exports = mongoose.model('Failure', failureSchema)

