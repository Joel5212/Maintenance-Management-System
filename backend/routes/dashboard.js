const express = require('express')
const { getRepairStatusStats, getRepairPriorityStats, getRepairFailureReport } = require('../controllers/dashboardController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/getRepairStatusStats', getRepairStatusStats)

router.get('/getRepairPriorityStats', getRepairPriorityStats)

router.get('/getRepairFailureReport', getRepairFailureReport)

// router.patch('/ getPreventiveMaintenanceStats', getPreventiveMaintenanceStats)

module.exports = router