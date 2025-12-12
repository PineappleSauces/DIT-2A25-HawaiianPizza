//Car parts router for the search filter, ai assisted

const express = require('express');
const router = express.Router();
const { searchCarParts } = require('../controllers/carPartControllers');

// GET /api/carParts/search
router.get('/search', searchCarParts);

module.exports = router;