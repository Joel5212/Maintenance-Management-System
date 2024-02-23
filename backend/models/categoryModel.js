const mongoose = require('mongoose')

const preventiveMaintenanceProcedureSchema = new mongoose.Schema({
    preventiveProcedureName: {
        type: String,
        required: true
    },
    preventiveProcedureDescription: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const repairProcedureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    repairProcedureDescription: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    preventiveMaintenanceProcedures: [preventiveMaintenanceProcedureSchema],
    repairProcedures: [repairProcedureSchema],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category