const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Banco de dados SQLite
const db = new sqlite3.Database(path.join(__dirname, 'contacts.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      observation TEXT,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Banco de dados conectado!');
  }
});

// Listar contatos
app.get('/api/contacts', (req, res) => {
  db.all('SELECT * FROM contacts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar contato
app.post('/api/contacts', (req, res) => {
  const { name, phone, observation } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
  db.run('INSERT INTO contacts (name, phone, observation) VALUES (?, ?, ?)', [name, phone, observation], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, phone, observation, active: 1 });
  });
});

// Editar contato
app.put('/api/contacts/:id', (req, res) => {
  const { name, phone, observation } = req.body;
  const { id } = req.params;
  db.run('UPDATE contacts SET name = ?, phone = ?, observation = ? WHERE id = ?', [name, phone, observation, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name, phone, observation });
  });
});

// Deletar contato
app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Alternar status (ativo/inativo)
app.put('/api/contacts/:id/toggle', (req, res) => {
  const { id } = req.params;
  db.get('SELECT active FROM contacts WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Contato não encontrado.' });
    const newStatus = row.active ? 0 : 1;
    db.run('UPDATE contacts SET active = ? WHERE id = ?', [newStatus, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, active: newStatus });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 