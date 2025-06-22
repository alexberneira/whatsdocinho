# 🔐 Segurança - WhatsDocinho

## Sistema de Autenticação

O WhatsDocinho agora possui uma camada de segurança que requer senha para acessar a aplicação.

### 📋 Configuração de Segurança

**Senha de Acesso:** [Configurada no código - não exposta publicamente]

### 🔒 Como Funciona

1. **Tela de Login**: Ao acessar a aplicação, o usuário é apresentado com uma tela de login
2. **Validação de Senha**: A senha é validada localmente no navegador
3. **Sessão Persistente**: Após login bem-sucedido, a sessão é mantida usando `sessionStorage`
4. **Logout**: Botão "Sair" no header permite encerrar a sessão

### 🛡️ Características de Segurança

- ✅ **Senha Hardcoded**: Senha definida no código (não exposta em variáveis de ambiente)
- ✅ **Sessão Local**: Autenticação mantida apenas na sessão do navegador
- ✅ **Logout Manual**: Usuário pode encerrar a sessão a qualquer momento
- ✅ **Redirecionamento**: Acesso direto às rotas é bloqueado sem autenticação

### 🔄 Fluxo de Autenticação

```
Usuário acessa → Tela de Login → Digita senha → Validação → Acesso Liberado
     ↓              ↓              ↓           ↓           ↓
   Bloqueado    Interface     Senha      Senha      Aplicação
                de Login    Digitada   Correta    Completa
```

### 🚪 Como Usar

1. **Acesse** `http://localhost:3000` (local) ou sua URL de produção
2. **Digite** a senha configurada
3. **Clique** em "Entrar"
4. **Use** a aplicação normalmente
5. **Clique** em "Sair" quando terminar

### ⚠️ Limitações

- **Senha Local**: A senha está no código frontend (não é 100% segura)
- **Sessão Temporária**: A sessão é perdida ao fechar o navegador
- **Sem Criptografia**: A senha não é criptografada no storage

### 🔧 Para Produção

Para maior segurança em produção, considere:

1. **Backend de Autenticação**: Implementar autenticação no servidor
2. **JWT Tokens**: Usar tokens JWT para sessões
3. **HTTPS**: Sempre usar HTTPS em produção
4. **Rate Limiting**: Limitar tentativas de login
5. **Logs de Acesso**: Registrar tentativas de acesso

### 📝 Notas Importantes

- A senha está configurada no código fonte
- A sessão persiste até o usuário clicar em "Sair" ou fechar o navegador
- Não há recuperação de senha implementada
- A autenticação é apenas uma camada básica de proteção

---

**Implementado em:** Dezembro 2024  
**Versão:** 1.0  
**Status:** ✅ Ativo 