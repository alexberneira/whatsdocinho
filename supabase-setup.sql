-- Criar tabela de contatos no Supabase
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  observation TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações (para desenvolvimento)
-- Em produção, você pode querer políticas mais restritivas
CREATE POLICY "Allow all operations" ON contacts
  FOR ALL USING (true);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO contacts (name, phone, observation) VALUES
  ('João Silva', '11999999999', 'Cliente VIP'),
  ('Maria Santos', '11888888888', 'Primeira compra'),
  ('Pedro Costa', '11777777777', NULL)
ON CONFLICT DO NOTHING; 