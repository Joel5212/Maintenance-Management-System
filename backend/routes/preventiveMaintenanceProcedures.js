const express = require('express')
const { getPreventiveMaintenanceProceduresOfCategory, addPreventiveMaintenanceProcedure, updatePreventiveMaintenanceProcedure, deletePreventiveMaintenanceProcedure } = require('../controllers/preventiveMaintenanceProceduresController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/:categoryId', getPreventiveMaintenanceProceduresOfCategory)

router.post('/', addPreventiveMaintenanceProcedure)

router.delete('/:id', deletePreventiveMaintenanceProcedure)

router.patch('/:id', updatePreventiveMaintenanceProcedure)

module.exports = router