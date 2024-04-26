const express = require('express')
const { getAssets, addAsset, deleteAsset, deleteAssetAndChildren, updateAsset } = require('../controllers/assetsController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/', addAsset)

router.delete('/delete-asset/:id', deleteAsset)

router.delete('/delete-asset-and-children/:id', deleteAssetAndChildren)

router.patch('/:id', updateAsset)

router.get('/', getAssets)

module.exports = router