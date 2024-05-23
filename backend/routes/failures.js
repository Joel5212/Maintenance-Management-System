const express = require('express')
const { createFailure, getSimilarFailures, getFailures, getFailure, deleteFailure, updateFailure } = require('../controllers/failuresController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/', createFailure)

router.post('/get-similar-failures', getSimilarFailures)

router.get('/:id', getFailures)

router.get('/get-failure/:id', getFailure)

router.delete('/:id', deleteFailure)

router.patch('/:id', updateFailure)

module.exports = router