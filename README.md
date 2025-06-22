# WhatsDocinho 🚀

Gerenciador de contatos e mensagens WhatsApp integrado com Supabase e API Hallo.

## ✨ Funcionalidades

- 📱 **Gerenciamento de Contatos**: Cadastro, edição e exclusão de contatos
- 💬 **Templates de Mensagens**: Criação de mensagens com texto e mídia
- 📤 **Envio via WhatsApp**: Integração com API Hallo para envio de mensagens
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS
- ☁️ **Backend Cloud**: Supabase para persistência de dados

## 🚀 Deploy na Vercel

### 1. **Preparar o Repositório**
```bash
# Fazer commit das alterações
git add .
git commit -m "Preparar para deploy na Vercel"
git push origin main
```

### 2. **Conectar na Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub/GitLab
3. Clique em "New Project"
4. Importe seu repositório
5. Configure as variáveis de ambiente (veja abaixo)

### 3. **Variáveis de Ambiente**
Configure no painel da Vercel:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Hallo API
NEXT_PUBLIC_HALLO_API_URL=https://app.hallo-api.com/v1
NEXT_PUBLIC_HALLO_API_KEY=seu_token_da_api_hallo
NEXT_PUBLIC_HALLO_INSTANCE=seu_id_da_instancia
```

### 4. **Deploy Automático**
- A Vercel detectará automaticamente que é um projeto Next.js
- O deploy será feito automaticamente a cada push
- URL será gerada automaticamente

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta na API Hallo

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/whatsdocinho.git
cd whatsdocinho

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env.local
# Editar .env.local com suas credenciais

# Executar em desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run proxy        # Proxy local para API Hallo
```

## 📋 Configuração das APIs

### Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o SQL em `supabase-setup.sql`
4. Copie as credenciais para `.env.local`

### API Hallo
1. Acesse [app.hallo-api.com](https://app.hallo-api.com)
2. Crie uma conta e instância
3. Copie o token e ID da instância
4. Configure no `.env.local`

## 🏗️ Estrutura do Projeto

```
whatsdocinho/
├── pages/                 # Páginas Next.js
│   ├── index.js          # Página principal
│   ├── _app.js           # App wrapper
│   └── api/              # API Routes
├── lib/                  # Utilitários
│   ├── hallo.js          # Cliente API Hallo
│   └── supabase.js       # Cliente Supabase
├── public/               # Arquivos estáticos
├── tailwind.config.js    # Configuração Tailwind
├── next.config.js        # Configuração Next.js
└── vercel.json           # Configuração Vercel
```

## 🔧 Tecnologias

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), API Hallo
- **Deploy**: Vercel
- **Estilização**: Tailwind CSS

## 📱 Como Usar

1. **Cadastrar Contatos**
   - Adicione nome, telefone e observações
   - Telefones são validados automaticamente

2. **Criar Mensagens**
   - Escolha entre texto, imagem, vídeo ou documento
   - Preview em tempo real da mensagem
   - Ative a mensagem que deseja usar

3. **Enviar Mensagens**
   - Clique em "Testar envio" em qualquer contato
   - A mensagem ativa será enviada automaticamente
   - Suporte a mídia com legenda

## 🚨 Troubleshooting

### Erro de Build
- Verifique se todas as variáveis de ambiente estão configuradas
- Certifique-se de que o Supabase está acessível
- Confirme se a API Hallo está ativa

### Erro de Envio
- Verifique se a instância Hallo está conectada
- Confirme se o número está no formato correto
- Teste a API Hallo diretamente

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de contatos e mensagens WhatsApp**
