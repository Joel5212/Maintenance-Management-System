const Category = require('../models/categoryModel')
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

const addRepairProcedure = async (req, res) => {
    try {

        const { id } = req.params

        const { repairProcedureTitle, repairProcedureDescription } = req.body

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const repairProcedure = { repairProcedureTitle, repairProcedureDescription }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $push: { repairProcedures: { $each: [repairProcedure], $position: 0 } } },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addPreventiveMaintenanceProcedure = async (req, res) => {
    try {

        const { id } = req.params

        const { preventiveMaintenanceProcedureTitle, preventiveMaintenanceProcedureDescription } = req.body

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const preventiveMaintenanceProcedure = { preventiveMaintenanceProcedureTitle, preventiveMaintenanceProcedureDescription }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $push: { preventiveMaintenanceProcedures: { $each: [preventiveMaintenanceProcedure], $position: 0 } } },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteRepairProcedure = async (req, res) => {
    try {
        const { id } = req.params

        const { procedureId } = req.body

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $pull: { repairProcedures: { _id: procedureId } } },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deletePreventiveMaintenanceProcedure = async (req, res) => {
    try {

        const { id } = req.params

        const { procedureId } = req.body

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id },
            { $pull: { repairProcedures: { _id: procedureId } } },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(400).json({ error: 'Error Updating Procedure' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateRepairProcedure = async (req, res) => {
    try {

        const { id } = req.params

        console.log(id)

        const { repairProcedureId, repairProcedureTitle, repairProcedureDescription } = req.body

        console.log("REPAIR PROCEDURE ID", repairProcedureId)
        console.log("REPAIR PROCEDUFRE TITLE", repairProcedureTitle)

        const category = await Category.findOne({ _id: ObjectId(id) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: id, 'repairProcedures._id': repairProcedureId },
            {
                $set: {
                    'repairProcedures.$.repairProcedureTitle': repairProcedureTitle,
                    'repairProcedures.$.repairProcedureDescription': repairProcedureDescription
                }
            },
            { new: true }
        )

        console.log(updatedCategory)

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error Updating Repair' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updatePreventiveMaintenanceProcedure = async (req, res) => {
    try {

        const { categoryId } = req.params

        const { preventiveMaintenanceProcedureTitle, preventiveMaintenanceProcedureDescription, preventiveMaintenanceProcedureId } = req.body

        const category = await Category.findOne({ _id: ObjectId(categoryId) })

        if (!category) {
            return res.status(404).json({ error: 'No Such Category' })
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, 'preventiveMaintenanceProcedures._id': preventiveMaintenanceProcedureId },
            {
                $set: {
                    'preventiveMaintenanceProcedures.$.preventiveMaintenanceProcedureTitle': preventiveMaintenanceProcedureTitle,
                    'preventiveMaintenanceProcedures.$.preventiveMaintenanceProcedureDescription': preventiveMaintenanceProcedureDescription
                }
            },
            { new: true }
        )

        if (!updatedCategory) {
            return res.status(500).json({ error: 'Error' })
        }

        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getCategories, addCategory, deleteCategory, updateCategory, addRepairProcedure, addPreventiveMaintenanceProcedure, deleteRepairProcedure, deletePreventiveMaintenanceProcedure, updateRepairProcedure, updatePreventiveMaintenanceProcedure }