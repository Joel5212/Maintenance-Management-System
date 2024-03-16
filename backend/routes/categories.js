const express = require('express')
const { getCategories, addCategory, deleteCategory, updateCategory, addRepairProcedure, addPreventiveMaintenanceProcedure, deleteRepairProcedure, deletePreventiveMaintenanceProcedure, updateRepairProcedure, updatePreventiveMaintenanceProcedure } = require('../controllers/categoriesController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getCategories)

router.post('/', addCategory)

router.delete('/:id', deleteCategory)

router.patch('/:id', updateCategory)

router.patch('/addRepairProcedure/:id', addRepairProcedure)

router.patch('/addPreventiveMaintenanceProcedure/:id', addPreventiveMaintenanceProcedure)

router.patch('/deleteRepairProcedure/:id', deleteRepairProcedure)

router.patch('/deletePreventiveMaintenanceProcedure/:id', deletePreventiveMaintenanceProcedure)

router.patch('/updateRepairProcedure/:id', updateRepairProcedure)

router.patch('/updatePreventiveMaintenanceProcedure/:id', updatePreventiveMaintenanceProcedure)

module.exports = router