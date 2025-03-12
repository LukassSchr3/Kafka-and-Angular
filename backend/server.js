const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'product_recall',
  password: 'mysecretpassword',
  port: 5432,
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recalls');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
