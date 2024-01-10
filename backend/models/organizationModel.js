const mongoose = require('mongoose')
const { Schema } = mongoose;
const User = require('./userModel')

// const userSchema = Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: true
//     },
//     role: {
//         type: String,
//         required: true
//     }
// })

const organizationSchema = mongoose.Schema({
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
        required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = Organization

