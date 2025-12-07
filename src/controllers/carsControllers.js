const carsModels = require('../models/carsModels');

async function getAllCars(req, res) {
  const cars = await carsModels.getAllCars();
  res.json(cars);
}

async function getCar(req, res) {
  const car = await carsModels.getCarByCarsId(req.params.carsid);
  res.json(car);
}

module.exports = {
  getAllCars,
  getCar
};
