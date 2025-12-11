const express = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, address FROM users WHERE id=$1', [req.userId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) return res.status(400).json({ error: 'All fields required' });

  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2, address=$3, updated_at=NOW() WHERE id=$4 RETURNING id, name, email, address',
      [name, email, address, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
