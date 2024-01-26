const express = require('express')
const { getAssets, addAsset, deleteAsset, updateAsset } = require('../controllers/assetsController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/', addAsset)

router.delete('/:id', deleteAsset)

router.patch('/:id', updateAsset)

router.get('/', getAssets)

module.exports = router