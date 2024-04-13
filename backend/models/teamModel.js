const mongoose = require('mongoose')

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    description: {
        type: String,
        required: false
    }
})

const User = mongoose.model('Team', teamSchema)

module.exports = User