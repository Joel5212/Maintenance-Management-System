const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    organization: {
        orgName: {
            type: String,
            required: true
        },
        orgCity: {
            type: String,
            required: true,
        },
        orgState: {
            type: String,
            required: true,
        },
        orgZipCode: {
            type: String,
            required: true,
        },
        orgCountry: {
            type: String,
            required: true,
        },
        orgPhoneNumber: {
            type: String,
            required: false,
        },
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User