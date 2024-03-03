const mongoose = require('mongoose')
const Category = require('../models/categoryModel')
const { MongoClient, ObjectId } = require('mongodb');

const getCategories = async (req, res) => {

    const categories = await Category.find({}).sort({ createdAt: -1 })

    res.status(200).json(categories)
}

const addCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body

        const category = await Category.create({ name: categoryName, description: categoryDescription, createdAt: Date.now() })

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

        const { categoryName, categoryDescription } = req.body

        const categoryExists = await Category.findOne({ _id: ObjectId(id) })

        if (!categoryExists) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const category = { name: categoryName, description: categoryDescription }

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

const addRepairProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const { repairProcedureName, repairProcedureDescirption } = req.body

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const repairProcedure = { repairProcedureName, repairProcedureDescirption }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $push: { repairProcedures: repairProcedure } },
            { new: true }
        )


        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {

    }
}

const addPreventiveMaintenanceProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const { preventiveMaintenanceProcedureName, preventiveMaintenanceProcedureDescirption } = req.body

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const repairProcedure = { preventiveMaintenanceProcedureName, preventiveMaintenanceProcedureDescirption }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $push: { repairProcedures: repairProcedure } },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {

    }
}

module.exports = { getCategories, addCategory, deleteCategory, updateCategory, addRepairProcedure, addPreventiveMaintenanceProcedure }