// src/models/compareModel.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CompareModel = {
  async add(sessionId, carId) {
    carId = Number(carId);

    if (!Number.isInteger(carId)) {
      return { error: "Invalid car ID" };
    }

    const count = await prisma.comparison.count({
      where: { session_id: sessionId }
    });

    if (count >= 2) {
      return { error: "You may only compare 2 cars." };
    }

    const exists = await prisma.comparison.findFirst({
      where: {
        session_id: sessionId,
        carId: carId
      }
    });

    if (exists) {
      return { error: "Car already selected." };
    }

    await prisma.comparison.create({
      data: {
        session_id: sessionId,
        carId
      }
    });

    const selected = await prisma.comparison.findMany({
      where: { session_id: sessionId },
      include: { cars: true }
    });

    return { selected: selected.map(r => r.cars) };
  },

  async getSelected(sessionId) {
    const rows = await prisma.comparison.findMany({
      where: { session_id: sessionId },
      include: { cars: true }
    });

    return rows.map(r => r.cars);
  },

  async reset(sessionId) {
    await prisma.comparison.deleteMany({
      where: { session_id: sessionId }
    });
  },

  async getCarsByIds(ids) {
    return prisma.cars.findMany({
      where: { id: { in: ids } }
    });
  }
};

module.exports = CompareModel;
