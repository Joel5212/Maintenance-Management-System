const express = require('express')
const { addTeam, deleteTeam, getTeams, updateTeam } = require('../controllers/teamsController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/', addTeam)

router.delete('/:id', deleteTeam)

router.patch('/:id', updateTeam)

router.get('/', getTeams)

module.exports = router