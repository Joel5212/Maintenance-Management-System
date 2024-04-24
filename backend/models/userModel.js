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
            required: false
        },
        orgCity: {
            type: String,
            required: false,
        },
        orgState: {
            type: String,
            required: false,
        },
        orgZipCode: {
            type: String,
            required: false,
        },
        orgCountry: {
            type: String,
            required: false,
        },
        orgPhoneNumber: {
            type: String,
            required: false,
        },
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User