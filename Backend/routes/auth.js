const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Log przy załadowaniu pliku
console.log('Router AUTH załadowany');

router.post('/login', async (req, res) => {
  console.log('Odebrano żądanie POST /login');
  console.log('request.body:', req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    console.warn('Brakuje username lub password w danych logowania');
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    console.log(`Szukanie użytkownika: ${username}`);
    const [rows] = await pool.query(
      `SELECT * FROM \`${process.env.DB_NAME}\`.users WHERE username = ? AND password = ?`,
      [username, password]
    );

    console.log(`Wynik zapytania SQL:`, rows);

    if (rows.length === 0) {
      console.log(`Nieudane logowanie – brak użytkownika lub błędne hasło dla "${username}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    console.log(`Użytkownik "${user.username}" zalogowany. ID: ${user.id}`);
    res.json({ userId: user.id });
  } catch (err) {
    console.error(`Błąd zapytania SQL dla użytkownika "${username}":`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
