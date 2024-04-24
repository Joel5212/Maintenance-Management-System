const express = require('express')
const { getCategories, addCategory, deleteCategory, updateCategory } = require('../controllers/categoriesController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getCategories)

router.post('/', addCategory)

router.delete('/:id', deleteCategory)

router.patch('/:id', updateCategory)

module.exports = router