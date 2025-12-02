//Code for the item search feature, assisted by AI
const {prismaClient} = require('./prismaClient');
const prisma = prismaClient;

//get by category in prisma client to get items filtered by category
module.exports = {
    getByCategory: async (categoryId) =>
        prisma.item.findMany({ where: { categoryId } }),
};