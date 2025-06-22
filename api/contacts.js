import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Inicializar banco de dados
async function getDb() {
  const db = await open({
    filename: path.join(process.cwd(), 'contacts.db'),
    driver: sqlite3.Database
  });
  
  // Criar tabela se não existir
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
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getDb();

    if (req.method === 'GET') {
      // Listar contatos
      const contacts = await db.all('SELECT * FROM contacts ORDER BY created_at DESC');
      res.status(200).json(contacts);
    } else if (req.method === 'POST') {
      // Criar contato
      const { name, phone, observation } = req.body;
      
      if (!name || !phone) {
        return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
      }

      const result = await db.run(
        'INSERT INTO contacts (name, phone, observation) VALUES (?, ?, ?)',
        [name, phone, observation]
      );

      res.status(201).json({
        id: result.lastID,
        name,
        phone,
        observation,
        active: 1,
        created_at: new Date().toISOString()
      });
    } else {
      res.status(405).json({ error: 'Método não permitido' });
    }

    await db.close();
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 