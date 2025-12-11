const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllCars() {
  return prisma.cars.findMany({
    orderBy: { id: 'asc' }
  });
}

async function getCarByCarsId(carsid) {
  return prisma.cars.findFirst({
    where: { carsid }
  });
}

module.exports = {
  getAllCars,
  getCarByCarsId
};
