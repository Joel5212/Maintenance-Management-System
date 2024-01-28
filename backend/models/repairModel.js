const mongoose = require ('mongoose')

const Schema = mongoose.Schema

const repairSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    asset: {
        type: String,
        required: false
    },
    
    //will change to date type when front end is set
    /*
    startDate: { 
        type: String,
        required: false
    },
    */

    dueDate: {
        type: String,
        required: false
    },

    priority: {
        type: String,
        required: false
    },
    /*
    servicers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    */
    servicers: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Repair', repairSchema)

