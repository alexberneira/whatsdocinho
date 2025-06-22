import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function getDb() {
  const db = await open({
    filename: path.join(process.cwd(), 'contacts.db'),
    driver: sqlite3.Database
  });
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      observation TEXT,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  return db;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  try {
    const db = await getDb();

    if (req.method === 'PUT' && req.url.includes('/toggle')) {
      // Alternar status
      const contact = await db.get('SELECT active FROM contacts WHERE id = ?', [id]);
      if (!contact) {
        return res.status(404).json({ error: 'Contato não encontrado.' });
      }
      
      const newStatus = contact.active ? 0 : 1;
      await db.run('UPDATE contacts SET active = ? WHERE id = ?', [newStatus, id]);
      
      res.status(200).json({ id: parseInt(id), active: newStatus });
    } else if (req.method === 'PUT') {
      // Editar contato
      const { name, phone, observation } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
      }

      const result = await db.run(
        'UPDATE contacts SET name = ?, phone = ?, observation = ? WHERE id = ?',
        [name, phone, observation, id]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Contato não encontrado.' });
      }

      res.status(200).json({ id: parseInt(id), name, phone, observation });
    } else if (req.method === 'DELETE') {
      // Deletar contato
      const result = await db.run('DELETE FROM contacts WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Contato não encontrado.' });
      }

      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }

    await db.close();
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 