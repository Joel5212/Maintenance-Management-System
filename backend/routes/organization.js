const express = require('express')
const { registerOrganization, isOrganizationRegistered } = require('../controllers/organizationController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.post('/', registerOrganization)

router.get('/', isOrganizationRegistered)

module.exports = router