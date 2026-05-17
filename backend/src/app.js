const express = require('express');
const cors = require('cors');
const pokemonRoute = require('./routes/pokemonRoute');
const moveRoute = require('./routes/moveRoute');
const teambuildRoute = require('./routes/teambuildRoute');
const db = require('./database/db');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/pokemon', pokemonRoute);
app.use('/api/move', moveRoute);
app.use('/api/teambuild', teambuildRoute);

app.get('/api/items', async (req, res) => {
  try {
    res.json(await db.listItems(req.query.search));
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.get('/api/natures', async (req, res) => {
  try {
    res.json(await db.listNatures());
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

module.exports = app;
