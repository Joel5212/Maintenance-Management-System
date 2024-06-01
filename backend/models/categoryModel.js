const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category