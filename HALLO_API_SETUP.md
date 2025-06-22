# Configuração do Hallo API - WhatsDocinho

## 📋 **Variáveis de Ambiente Necessárias**

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Hallo API Configuration
REACT_APP_HALLO_API_URL=https://api.hallo.com.br
REACT_APP_HALLO_API_KEY=sua_chave_api_aqui
REACT_APP_HALLO_INSTANCE=nome_da_sua_instancia
```

## 🔑 **Como obter as credenciais:**

### 1. **API Key**
- Acesse [https://hallo.com.br](https://hallo.com.br)
- Faça login na sua conta
- Vá para as configurações da API
- Copie sua chave de API

### 2. **Instance Name**
- Crie uma nova instância no painel do Hallo
- Use o nome da instância criada
- Exemplo: `minha-instancia-01`

## 🚀 **Funcionalidades Disponíveis**

### **Envio de Mensagens:**
- ✅ **Texto**: `halloAPI.sendTextMessage(phone, message)`
- ✅ **Mídia**: `halloAPI.sendMediaMessage(phone, mediaUrl, mediaType, caption)`
- ✅ **Genérico**: `halloAPI.sendMessage({ number, text, image, video, document })`

### **Gerenciamento de Conexão:**
- ✅ **Verificar Status**: `halloAPI.checkConnection()`
- ✅ **Obter QR Code**: `halloAPI.getQRCode()`
- ✅ **Desconectar**: `halloAPI.disconnect()`

## 📱 **Exemplo de Uso**

```javascript
import halloAPI from './lib/hallo';

// Verificar se está configurado
if (halloAPI.isConfigured()) {
  // Enviar mensagem de texto
  try {
    const result = await halloAPI.sendTextMessage(
      '5511999999999',
      'Olá! Esta é uma mensagem de teste.'
    );
    console.log('Mensagem enviada:', result);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
} else {
  console.log('Hallo API não está configurada');
}
```

## 🔧 **Integração com WhatsDocinho**

### **Próximos Passos:**
1. ✅ **Arquivo de configuração criado** (`src/lib/hallo.js`)
2. 🔄 **Adicionar botão de envio** nas mensagens
3. 🔄 **Integrar com lista de contatos**
4. 🔄 **Adicionar status de conexão**
5. 🔄 **Implementar envio em lote**

### **Estrutura de Integração:**
```
WhatsDocinho → Hallo API → WhatsApp
     ↓              ↓         ↓
  Interface    →  API Key  →  Mensagem
```

## ⚠️ **Observações Importantes**

- **Formato do telefone**: Use o formato internacional (ex: 5511999999999)
- **URLs de mídia**: Devem ser URLs públicas acessíveis
- **Limites da API**: Verifique os limites da sua conta Hallo
- **Testes**: Sempre teste em ambiente de desenvolvimento primeiro

## 📞 **Suporte**

- **Documentação Hallo**: [https://hallo.com.br/api](https://hallo.com.br/api)
- **Suporte Hallo**: Entre em contato com o suporte do Hallo
- **Issues do Projeto**: Use o GitHub para reportar problemas

---

**Configuração concluída!** 🎉 