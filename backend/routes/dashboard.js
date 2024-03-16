const express = require('express')
const { getUpcomingRepairs, getRepairStats } = require('../controllers/dashboardController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/getUpcomingRepairs', getUpcomingRepairs)

// router.get('/getUpcomingPreventiveMaintenances', getUpcomingPreventiveMaintenances)

router.get('/getRepairStats', getRepairStats)

// router.patch('/ getPreventiveMaintenanceStats', getPreventiveMaintenanceStats)

module.exports = router