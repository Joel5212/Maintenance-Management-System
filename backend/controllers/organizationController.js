const mongoose = require('mongoose')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET)
}

const registerOrganization = async (req, res) => {

    try {
        const { email, password, name, phoneNumber, orgName, orgCity, orgState, orgZipCode, orgCountry, orgPhoneNumber } = req.body;

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const organization = { orgName, orgCity, orgState, orgZipCode, orgCountry, orgPhoneNumber }

        const adminUser = await User.create({ email, password: hash, name, phoneNumber, role: 'Admin', organization })

        const token = createToken(adminUser._id)

        const organizationName = organization.orgName

        res.status(200).json({ email, name, role: "Admin", organizationName, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const isOrganizationRegistered = async (req, res) => {

    try {
        const adminExists = await User.findOne({ role: 'Admin' })

        if (adminExists) {
            return res.status(200).json(true);
        }
        return res.status(200).json(false);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { registerOrganization, isOrganizationRegistered }