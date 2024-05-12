const RepairProcedure = require('../models/repairProcedureModel')
const { ObjectId } = require('mongodb');

const getRepairProceduresOfCategory = async (req, res) => {
    const { categoryId } = req.params

    const procedures = await RepairProcedure.find({ category: categoryId }).sort({ createdAt: -1 })

    res.status(200).json(procedures)
}

const getRepairProcedure = async (req, res) => {
    const { id } = req.params

    const procedure = await RepairProcedure.findOne({ _id: id }).sort({ createdAt: -1 })

    res.status(200).json(procedure)
}

const addRepairProcedure = async (req, res) => {
    try {
        const { title, description, category } = req.body

        const procedure = await RepairProcedure.create({ title: title, description: description, category: category })

        if (!procedure) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(procedure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteRepairProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const procedure = await RepairProcedure.findOne({ _id: ObjectId(id) })

        if (!procedure) {
            return res.status(404).json({ error: 'No Such Procedure' })
        }

        const deletedProcedure = await RepairProcedure.findOneAndDelete({ _id: ObjectId(id) })

        if (!deletedProcedure) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(deletedProcedure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateRepairProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const { category, title, description } = req.body

        const procedureExists = await RepairProcedure.findOne({ _id: ObjectId(id) })

        if (!procedureExists) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const procedure = { category: category, title: title, description: description }

        const updatedProcedure = await RepairProcedure.findOneAndUpdate({ _id: id }, { ...procedure }, { new: true })

        if (!updatedProcedure) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedProcedure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getRepairProceduresOfCategory, getRepairProcedure, addRepairProcedure, updateRepairProcedure, deleteRepairProcedure }