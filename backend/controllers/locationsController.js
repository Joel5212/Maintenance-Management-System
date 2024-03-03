const mongoose = require('mongoose')
const Location = require('../models/locationModel')


const createLocation = async (req,res) => {
    const {name, description} = req.body

    // adding doc to db
    try {
        const location = await Location.create({name: name, description: description})
        res.status(200).json(location)
    } catch (error) {
        res.status(400).json({error: error.message})
    }   
}

// READ all locations
const getLocations = async (req, res) => {
    const location = await Location.find({}).sort({createdAt: -1})

    res.status(200).json(location)
}

// READ single location
const getLocation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such location'})
    }

    const location = await Location.findById(id)

    if (!location) {
        return res.status(400).json({error: 'No such location'})
    }

    res.status(200).json(location)
}

// UPDATE a location
const updateLocation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such location'})
    }

    const location = await Location.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!location) {
        return res.status(400).json({error: 'No such location'})
    }

    res.status(200).json(location)
}

// DELETE location
const deleteLocation = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such location'})
    }

    const location = await Location.findOneAndDelete({_id: id})

    if (!location) {
        return res.status(400).json({error: 'No such location'})
    }
    
    res.status(200).json(location)
}

module.exports = {
    createLocation,
    getLocation,
    getLocations,
    updateLocation,
    deleteLocation
}