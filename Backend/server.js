const express = require('express');
const bodyParser = require('body-parser');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

// Log przy starcie serwera
console.log('Inicjalizacja aplikacji Express');

app.use(bodyParser.json());
console.log('bodyParser.json załadowany');

app.use('/api', authRoutes);
console.log('Trasy auth załadowane pod /api');

app.use('/api', todoRoutes);
console.log('Trasy todos załadowane pod /api');

initDB().then(() => {
  console.log('Inicjalizacja bazy danych zakończona');
  app.listen(3000, () => {
    console.log('Serwer działa na http://localhost:3000');
  });
}).catch((err) => {
  console.error('Błąd inicjalizacji bazy danych:', err);
});
