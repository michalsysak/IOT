const express = require('express');
const bodyParser = require('body-parser');
const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

initDB().then(() => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});
