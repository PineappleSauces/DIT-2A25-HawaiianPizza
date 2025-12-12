const express = require('express');
const router = express.Router();
const carsControllers = require('../controllers/carsControllers');

// GET all cars
router.get('/', carsControllers.getAllCars);

// GET one car by carsid
router.get('/:carsid', carsControllers.getCar);

// GET /api/cars/search
router.get('/search', searchCars);

module.exports = router;
