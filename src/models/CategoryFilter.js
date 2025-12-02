//Code for the category search feature, assisted by AI
const {prismaClient} = require('./prismaClient');
const prisma = prismaClient;

//get all in prisma client to get all categories, 
//get by id in prisma client to get category by id
module.exports ={
    getAll: async () => prisma.category.findMany(),
    getById: async (id) => prisma.category.findUnique({where: {id}}),
};