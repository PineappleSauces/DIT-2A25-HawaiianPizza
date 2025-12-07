const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all cars
async function getAllCars() {
  return prisma.cars.findMany({
    orderBy: { id: 'asc' }
  });
}

// Get one car by carsid (frontend identifier)
async function getCarByCarsId(carsid) {
  return prisma.cars.findUnique({
    where: { carsid: carsid }
  });
}

// Create a new car
async function createCar(data) {
  return prisma.cars.create({
    data: data
  });
}

module.exports = {
  getAllCars,
  getCarByCarsId,
  createCar
};
