const Repair = require('../models/repairModel')
const mongoose = require('mongoose')

// CREATE new repair
const createRepair = async (req, res) => {
    const {title, asset, startDate, dueDate, priority, servicers, status, cost, description} = req.body
    
    // adding doc to db
    try {
        const repair = await Repair.create({title: title, asset: asset, cost: cost, priority: priority, startDate: startDate, dueDate: dueDate, servicers: servicers, status: status, description: description})
        res.status(200).json(repair)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// READ all repairs
const getRepairs = async (req, res) => {
    const repairs = await Repair.find({}).sort({createdAt: -1})

    res.status(200).json(repairs)
}

// READ single repair
const getRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such repair'})
    }

    const repair = await Repair.findById(id)

    if (!repair) {
        return res.status(400).json({error: 'No such repair'})
    }

    res.status(200).json(repair)
}

// UPDATE a repair
const updateRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such repair'})
    }

    const repair = await Repair.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!repair) {
        return res.status(400).json({error: 'No such repair'})
    }

    res.status(200).json(repair)
}

// DELETE repair
const deleteRepair = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such repair'})
    }

    const repair = await Repair.findOneAndDelete({_id: id})

    if (!repair) {
        return res.status(400).json({error: 'No such repair'})
    }
    
    res.status(200).json(repair)
}

module.exports = {
    createRepair,
    getRepairs,
    getRepair,
    updateRepair,
    deleteRepair
}