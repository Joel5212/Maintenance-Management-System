const mongoose = require('mongoose')

const preventiveMaintenanceProcedureSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const Procedure = mongoose.model('PreventiveMaintenenanceProcedure', preventiveMaintenanceProcedureSchema, 'preventiveMaintenenanceProcedures')

module.exports = Procedure