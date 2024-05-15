const express = require('express')
const { getRepairStatusStats, getRepairPriorityStats, getRepairFailureReport, getUsersPerformanceReportForRepairs, getTeamsPerformanceReportForRepairs } = require('../controllers/dashboardController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/get-repair-status-stats', getRepairStatusStats)

router.get('/get-repair-priority-stats', getRepairPriorityStats)

router.get('/get-repair-failure-report', getRepairFailureReport)

router.get('/get-users-performance-report', getUsersPerformanceReportForRepairs)

router.get('/get-teams-performance-report', getTeamsPerformanceReportForRepairs)

// router.patch('/ getPreventiveMaintenanceStats', getPreventiveMaintenanceStats)

module.exports = router