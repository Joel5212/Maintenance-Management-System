const express = require('express')
const{createLocation ,getLocations ,getLocation,updateLocation,deleteLocation} = require('../controllers/locationsController')
const requireAuth = require('../middleware/requiredAuth')

const router = express.Router()


// CREATE new location
router.post('/', createLocation)

// READ all locations
router.get('/', getLocations)

// READ single location
router.get('/:id', getLocation)

// UPDATE a location
router.patch('/:id', updateLocation)

// DELETE location
router.delete('/:id', deleteLocation)

module.exports = router