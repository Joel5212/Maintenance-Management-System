const express = require('express')
const { getRepairProceduresOfCategory, addRepairProcedure, deleteRepairProcedure, updateRepairProcedure } = require('../controllers/repairProceduresController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/:categoryId', getRepairProceduresOfCategory)

router.post('/', addRepairProcedure)

router.delete('/:id', deleteRepairProcedure)

router.patch('/:id', updateRepairProcedure)

module.exports = router