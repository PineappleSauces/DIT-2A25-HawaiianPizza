const express = require('express');
const router = express.Router();
const carsControllers = require('../controllers/carsControllers');

// GET all cars
router.get('/', carsControllers.getAllCars);

// GET car by carsid
router.get('/:carsid', carsControllers.getCar);

// POST create new car
router.post('/', carsControllers.createCar);

module.exports = router;
