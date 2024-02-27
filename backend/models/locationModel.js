const mongoose = require ('mongoose')


const locationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {timestamps: false})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location



