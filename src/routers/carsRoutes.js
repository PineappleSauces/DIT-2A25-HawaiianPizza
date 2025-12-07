const express = require('express');
const router = express.Router();

// IMPORT CONTROLLER (matches your file name!)
const carsControllers = require('../controllers/carsControllers.js');

// GET all cars
router.get('/', carsControllers.getAllCars);

// GET one car by productId
router.get('/:productId', carsControllers.getCarByProductId);

// POST new car
router.post('/', carsControllers.createCar);

module.exports = router;
