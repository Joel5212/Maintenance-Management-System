const mongoose = require('mongoose')

const preventiveMaintenanceProcedureSchema = new mongoose.Schema({
    preventiveMaintenanceProcedureTitle: {
        type: String,
        required: true
    },
    preventiveMaintenanceProcedureDescription: {
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
    repairProcedureTitle: {
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
    categoryName: {
        type: String,
        required: true
    },
    categoryDescription: {
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