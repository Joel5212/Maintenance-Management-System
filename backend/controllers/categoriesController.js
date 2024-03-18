const Category = require('../models/categoryModel')
const RepairProcedure = require('../models/repairProcedureModel')
const PreventiveMaintenanceProcedure = require('../models/preventiveMaintenanceProcedureModel')
const { ObjectId } = require('mongodb');

const getCategories = async (req, res) => {

    const categories = await Category.find({}).sort({ createdAt: -1 })

    res.status(200).json(categories)
}

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        const category = await Category.create({ name: name, description: description, createdAt: Date.now() })

        res.status(200).json(category);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        await RepairProcedure.deleteMany({ category: ObjectId(id) })
        await PreventiveMaintenanceProcedure.deleteMany({ category: ObjectId(id) })

        const deletedCategory = await Category.findOneAndDelete({ _id: ObjectId(id) })

        if (!deletedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(deletedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params

        const { name, description } = req.body

        const categoryExists = await Category.findOne({ _id: ObjectId(id) })

        if (!categoryExists) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const category = { name: name, description: description }

        const updatedCategory = await Category.findOneAndUpdate({ _id: id }, { ...category }, { new: true })

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getCategories, addCategory, deleteCategory, updateCategory }