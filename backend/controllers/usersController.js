const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET)
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: 'Incorrect email/password' })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(400).json({ error: 'Incorrect email/password' })
        }

        const name = user.name

        const role = user.role

        const token = createToken(user._id)

        const admin = await User.findOne({ role: 'Admin' })

        const organizationName = admin.organization.orgName

        res.status(200).json({ email, name, role, organizationName, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getUsers = async (req, res) => {
    // const excludeCriteria = { role: { $ne: 'Admin' } }

    const users = await User.find({}).sort({ createdAt: -1 })

    res.status(200).json(users)
}


const addUser = async (req, res) => {
    try {
        const { email, password, name, phoneNumber, role } = req.body

        const exists = await User.findOne({ email })

        if (exists) {
            return res.status(400).json({ error: 'Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await User.create({ email, password: hash, name, phoneNumber, role })

        res.status(200).json({ user });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No Such User' })
    }

    const user = await User.findOneAndDelete({ _id: id })

    if (!user) {
        return res.status(404).json({ error: 'No Such User' })
    }

    res.status(200).json(user)
}

const updateUser = async (req, res) => {
    try {

        const { id } = req.params

        const { email, oldEmail, password, name, phoneNumber, role } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No Such User' })
        }

        const excludeCriteria = { email: { $ne: oldEmail } }

        const exists = await User.find({ excludeCriteria }, { id }).excludeCriteria

        if (exists) {
            return res.status(400).json({ error: 'Email already exists' })
        }

        const newUser = { email, password, name, phoneNumber, role }

        const user = await User.findOneAndUpdate({ _id: id }, { ...newUser }, { new: true })

        if (!user) {
            return res.status(404).json({ error: 'No Such User' })
        }

        res.status(200).json(user)

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// const createUser = async (req, res) => {

//     await client.connect();

//     const session = client.startSession();

//     try {
//         await session.withTransaction(async () => {

//             const db = client.db(dbName);

//             const { email, password, name, phoneNumber, role } = req.body

//             const salt = await bcrypt.genSalt(10)
//             const hash = await bcrypt.hash(password, salt)

//             const newUser = new User({
//                 email: email,
//                 password: hash,
//                 name: name,
//                 phoneNumber: phoneNumber,
//                 role: role
//             })

//             const organization = await Organization.findById('6584b7b230f079af1d0d1c2d').populate('users');

//             if (!organization) {
//                 throw new Error('Organization not found');
//             }

//             const exists = organization.users.some((user) => user.email === email);

//             if (exists) {
//                 throw new Error('Email already in use');
//             }

//             const user = await db.collection('users').insertOne(newUser)
//             const userId = user.insertedId;

//             // if (true) {
//             //     throw new Error('hahahaha');
//             // }

//             await db.collection('organizations').updateOne(
//                 { _id: ObjectId('6584b7b230f079af1d0d1c2d') },
//                 { $push: { users: ObjectId(userId) } }
//             );

//             await session.commitTransaction();

//             session.endSession();

//             res.status(200).json({ email });

//         });
//     }
//     catch (error) {
//         session.endSession();
//         res.status(400).json({ error: error.message });
//     }
// }



module.exports = { loginUser, addUser, getUsers, deleteUser, updateUser }