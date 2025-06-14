const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM \`${process.env.DB_NAME}\`.users WHERE username = ? AND password = ?`,
      [username, password]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    // Prosty system – user ID w response (normalnie token JWT)
    res.json({ userId: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
