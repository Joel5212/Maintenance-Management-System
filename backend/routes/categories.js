const express = require('express')
const { getCategories, addCategory, deleteCategory, updateCategory, addRepairProcedure, addPreventiveMaintenanceProcedure } = require('../controllers/categoriesController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/', addCategory)

router.delete('/:id', deleteCategory)

router.patch('/:id', updateCategory)

router.patch('/addRepairProcedure/:id', addRepairProcedure)

router.patch('/addPreventiveMaintenanceProcedure/:id', addPreventiveMaintenanceProcedure)

router.get('/', getCategories)

module.exports = router