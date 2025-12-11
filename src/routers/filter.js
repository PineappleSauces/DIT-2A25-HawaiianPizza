//Code for the filter router, assisted by AI
const express = require('express');
const router = express.Router();
const Categories = require('../models/CategoryFilter');
const Items = require('../models/ItemFilter');

//get all categories
router.get('/categories', async (req, res) => {
    const categories = await Categories.getAll();
    res.json(categories);
});

//get category by id
router.get('/categories/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10); //10 is for decimal
    if (!id) return res.status(400).json({ error: 'Invalid category ID' });
    const category = await Categories.getById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
});

//get items by category id
router.get('/items', async (req, res) => {
    const categoryId = parseInt(req.query.categoryId, 10); //10 is for decimal
    if (!categoryId) return res.status(400).json({ error: 'Invalid category ID' });
    const items = await Items.getByCategory(categoryId);
    res.json(items);
});

module.exports = router;