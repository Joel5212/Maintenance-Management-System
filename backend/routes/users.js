const express = require('express')
const { loginUser, addUser, getUsers, deleteUser, updateUser } = require('../controllers/usersController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()

router.post('/loginUser', loginUser)

router.use(requireAuth)

router.post('/addUser', addUser)

router.delete('/:id', deleteUser)

router.patch('/:id', updateUser)

router.get('/', getUsers)

module.exports = router