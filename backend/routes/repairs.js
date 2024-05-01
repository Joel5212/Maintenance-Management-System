const express = require('express')
const{createRepair,getRepairs,getRepair,getCompletedRepairs, updateRepair,deleteRepair} = require('../controllers/repairsController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()


// CREATE new repair
router.post('/', createRepair)

// READ all repairs
router.get('/', getRepairs)

router.get('/completed', getCompletedRepairs)

// READ single repair
router.get('/:id', getRepair)

// UPDATE a repair
router.patch('/:id', updateRepair)

// DELETE repair
router.delete('/:id', deleteRepair)

module.exports = router