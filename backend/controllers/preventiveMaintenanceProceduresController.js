const PreventiveMaintenanceProcedure = require('../models/preventiveMaintenanceProcedureModel')
const { ObjectId } = require('mongodb');

const getPreventiveMaintenanceProceduresOfCategory = async (req, res) => {
    const { categoryId } = req.params

    const procedures = await PreventiveMaintenanceProcedure.find({ category: categoryId }).sort({ createdAt: -1 })

    res.status(200).json(procedures)
}

const addPreventiveMaintenanceProcedure = async (req, res) => {
    try {
        const { category, title, description } = req.body

        const procedure = await PreventiveMaintenanceProcedure.create({ category: category, title: title, description: description })

        if (!procedure) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(procedure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deletePreventiveMaintenanceProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const procedure = await PreventiveMaintenanceProcedure.findOne({ _id: ObjectId(id) })

        if (!procedure) {
            return res.status(404).json({ error: 'No Such Procedure' })
        }

        const deletedProcedure = await PreventiveMaintenanceProcedure.findOneAndDelete({ _id: ObjectId(id) })

        if (!deletedProcedure) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(deletedProcedure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updatePreventiveMaintenanceProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const { category, title, description } = req.body

        const procedureExists = await PreventiveMaintenanceProcedure.findOne({ _id: ObjectId(id) })

        if (!procedureExists) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const procedure = { category: category, title: title, description: description, }

        const updatedProcedure = await PreventiveMaintenanceProcedure.findOneAndUpdate({ _id: id }, { ...procedure }, { new: true })

        if (!updatedProcedure) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedProcedure);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getPreventiveMaintenanceProceduresOfCategory, addPreventiveMaintenanceProcedure, updatePreventiveMaintenanceProcedure, deletePreventiveMaintenanceProcedure }