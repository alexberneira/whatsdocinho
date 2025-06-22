# 🚀 Guia Rápido de Deploy na Vercel

## ✅ Pré-requisitos

- [x] Projeto configurado e funcionando localmente
- [x] Conta no GitHub/GitLab com o repositório
- [x] Conta na Vercel
- [x] Credenciais do Supabase e API Hallo

## 📋 Passo a Passo

### 1. **Preparar o Repositório**
```bash
# Verificar se tudo está commitado
git status

# Adicionar todas as alterações
git add .

# Fazer commit
git commit -m "Preparar para deploy na Vercel"

# Enviar para o repositório remoto
git push origin main
```

### 2. **Conectar na Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub/GitLab
3. Clique em **"New Project"**
4. Selecione seu repositório `whatsdocinho`
5. Clique em **"Import"**

### 3. **Configurar Variáveis de Ambiente**
Na tela de configuração do projeto:

**Framework Preset:** `Next.js` (deve ser detectado automaticamente)

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
NEXT_PUBLIC_HALLO_API_URL=https://app.hallo-api.com/v1
NEXT_PUBLIC_HALLO_API_KEY=seu_token_da_api_hallo
NEXT_PUBLIC_HALLO_INSTANCE=seu_id_da_instancia
```

### 4. **Deploy**
1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. ✅ **Pronto!** Seu app estará online

## 🔧 Configuração Pós-Deploy

### Verificar Funcionamento
1. Acesse a URL gerada pela Vercel
2. Teste o cadastro de contatos
3. Teste a criação de mensagens
4. Teste o envio via WhatsApp

### Configurações Adicionais
- **Domínio Customizado**: Vá em Settings > Domains
- **Variáveis de Ambiente**: Vá em Settings > Environment Variables
- **Analytics**: Vá em Settings > Analytics

## 🚨 Troubleshooting

### Build Falha
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o `package.json` está correto
- Verifique os logs de build na Vercel

### App Não Funciona
- Verifique se o Supabase está acessível
- Confirme se a API Hallo está ativa
- Teste as variáveis de ambiente

### Erro 500
- Verifique os logs na Vercel
- Confirme se as APIs estão respondendo
- Teste localmente primeiro

## 📞 Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Issues**: Abra uma issue no GitHub

---

**🎉 Parabéns! Seu WhatsDocinho está online!** 