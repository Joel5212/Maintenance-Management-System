const express = require('express')
const{createPreventiveMaintenance,getPreventiveMaintenances,getPreventiveMaintenance,getCompletedPreventiveMaintenances, updatePreventiveMaintenance,deletePreventiveMaintenance} = require('../controllers/preventiveMaintenanceController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()


// CREATE new PreventiveMaintenance
router.post('/', createPreventiveMaintenance)

// READ all PreventiveMaintenances
router.get('/', getPreventiveMaintenances)

router.get('/completed', getCompletedPreventiveMaintenances)

// READ single PreventiveMaintenance
router.get('/:id', getPreventiveMaintenance)

// UPDATE a PreventiveMaintenance
router.patch('/:id', updatePreventiveMaintenance)

// DELETE PreventiveMaintenance
router.delete('/:id', deletePreventiveMaintenance)

module.exports = router