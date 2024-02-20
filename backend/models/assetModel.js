const mongoose = require('mongoose')

const assetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    parentAsset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: false
    },
    repairs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repair',
        required: false
    }],
    preventiveMaintenances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PreventiveMaintenance',
        required: false
    }],
    repairDetails: [{
        type: String,
        required: false
    }],
    preventiveMaintenanceDetails: [{
        type: String,
        required: false
    }],

})

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset