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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: false
    }
    // repairProceduresOfAsset: [{
    //     type: String,
    //     required: false
    // }],
    // preventiveMaintenanceProceduresOfAsset: [{
    //     type: String,
    //     required: false
    // }],

})

const Asset = mongoose.model('Asset', assetSchema)

module.exports = Asset