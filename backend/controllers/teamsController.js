const Team = require('../models/teamModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');

const getTeams = async (req, res) => {
    const teams = await Team.find({}).sort({ createdAt: -1 })
    res.status(200).json(teams)
}

const addTeam = async (req, res) => {
    try {
        const { name, assignTo, description } = req.body

        for (const user of assignTo) {
            const userId = user._id

            const userExists = await User.findOne({ _id: ObjectId(userId) })

            if (!userExists) {
                return res.status(400).json({ error: 'One of the Users do not exist' })
            }
        }

        const team = await Team.create({ name: name, assignedTo: assignTo, description: description })

        res.status(200).json(team);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No Such Team' })
        }

        const team = await Team.findOneAndDelete({ _id: ObjectId(id) })

        if (!team) {
            return res.status(404).json({ error: 'No Such Team' })
        }

        res.status(200).json(team)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateTeam = async (req, res) => {
    try {
        const { id } = req.params

        const { name, assignTo } = req.body

        const teamExists = await Team.findOne({ _id: ObjectId(id) })

        if (!teamExists) {
            return res.status(404).json({ error: 'No Team Exists' })
        }

        const team = { name: name, assignedTo: assignTo }

        const updatedTeam = await Team.findOneAndUpdate({ _id: id }, { ...team }, { new: true })

        if (!updatedTeam) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedTeam);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getTeams,
    addTeam,
    deleteTeam,
    updateTeam
}