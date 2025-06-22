-- Criar tabela de contatos no Supabase
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  observation TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de mensagens/templates (sem título)
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  media_type TEXT CHECK (media_type IN ('photo', 'video', 'file', 'text')),
  media_url TEXT,
  text_content TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações (para desenvolvimento)
-- Em produção, você pode querer políticas mais restritivas
CREATE POLICY "Allow all operations on contacts" ON contacts
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO contacts (name, phone, observation) VALUES
  ('João Silva', '11999999999', 'Cliente VIP'),
  ('Maria Santos', '11888888888', 'Primeira compra'),
  ('Pedro Costa', '11777777777', NULL)
ON CONFLICT DO NOTHING;

-- Inserir mensagens de exemplo (sem título)
INSERT INTO messages (media_type, media_url, text_content) VALUES
  ('text', NULL, 'Olá! Bem-vindo ao nosso serviço. Como posso ajudar?'),
  ('photo', 'https://exemplo.com/promo.jpg', 'Confira nossa promoção especial! 🎉'),
  ('video', 'https://exemplo.com/demo.mp4', 'Veja como funciona nosso produto:')
ON CONFLICT DO NOTHING;

-- IMPORTANTE: Criar bucket de storage para upload de arquivos
-- Execute no SQL Editor do Supabase:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('whatsapp-media', 'whatsapp-media', true); 