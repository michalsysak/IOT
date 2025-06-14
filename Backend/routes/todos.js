const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Middleware do walidacji userId (np. query param lub header)
router.use((req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'Missing user ID' });
  req.userId = parseInt(userId, 10);
  next();
});

router.get('/', async (req, res) => {
  const [todos] = await pool.query(
    `SELECT * FROM \`${process.env.DB_NAME}\`.todos WHERE user_id = ? ORDER BY created_at DESC`,
    [req.userId]
  );
  res.json(todos);
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  await pool.query(
    `INSERT INTO \`${process.env.DB_NAME}\`.todos (user_id, title, description) VALUES (?, ?, ?)`,
    [req.userId, title, description]
  );
  res.status(201).json({ message: 'ToDo added' });
});

router.delete('/:id', async (req, res) => {
  const todoId = req.params.id;
  await pool.query(
    `DELETE FROM \`${process.env.DB_NAME}\`.todos WHERE id = ? AND user_id = ?`,
    [todoId, req.userId]
  );
  res.json({ message: 'ToDo deleted' });
});

module.exports = router;
