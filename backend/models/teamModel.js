const mongoose = require('mongoose')

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    description: {
        type: String,
        required: true
    }
})

const User = mongoose.model('Team', teamSchema)

module.exports = User