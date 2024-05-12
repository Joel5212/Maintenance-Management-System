const express = require('express')
const { getRepairProceduresOfCategory, getRepairProcedure, addRepairProcedure, deleteRepairProcedure, updateRepairProcedure } = require('../controllers/repairProceduresController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/:categoryId', getRepairProceduresOfCategory)

router.get('/get-repair-procedure/:id', getRepairProcedure)

router.post('/', addRepairProcedure)

router.delete('/:id', deleteRepairProcedure)

router.patch('/:id', updateRepairProcedure)

module.exports = router