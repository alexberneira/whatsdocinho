# Configuração da API Hallo

## ⚠️ **IMPORTANTE: Token Expirado**

O token atual está **expirado**. Você precisa:

1. **Acessar a plataforma Hallo API**
2. **Gerar um novo token**
3. **Verificar se a instância está ativa**
4. **Atualizar o arquivo `.env.local`**

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Configuração da API Hallo (Next.js)
NEXT_PUBLIC_HALLO_API_URL=https://app.hallo-api.com/v1
NEXT_PUBLIC_HALLO_API_KEY=GQAL5UGT-F2xd-XTzJ-QfyH-WDGH3S92HEW5
NEXT_PUBLIC_HALLO_INSTANCE=OW6N-000969-716u-6c5t-1MOEXNWKYXSO
```

## Como usar

### 1. **Iniciar o Next.js app:**
```bash
npm run dev
```

### 2. **Testar o botão "Testar envio"** em qualquer contato

## Estrutura da URL

A API será chamada diretamente:
- **URL**: `https://app.hallo-api.com/v1/instance/{instance}/token/{token}/message`

## Resposta da API

Quando funcionando corretamente, a API retorna:
```json
{
    "result": {
        "message_id": "id da fila de envio"
    },
    "message": "MESSAGE_SCHEDULED",
    "isValid": true,
    "instance_id": "5",
    "instance_id_reffer": "1235"
}
```

## Métodos Disponíveis

- `sendTextMessage(phoneNumber, message)` - Envia mensagem de texto
- `sendMediaMessage(phoneNumber, mediaUrl, mediaType, caption)` - Envia mídia (imagem, vídeo, documento)
- `sendMessage(messageData)` - Método genérico para enviar qualquer tipo de mensagem
- `checkConnection()` - Verifica status da conexão
- `getQRCode()` - Obtém QR Code da instância
- `disconnect()` - Desconecta a instância

## 📋 **Como obter as credenciais:**

1. **Acesse**: [https://app.hallo-api.com](https://app.hallo-api.com)
2. **Faça login** na sua conta
3. **Vá para configurações da API**
4. **Copie seu token da API**
5. **Use o ID da sua instância**

## ⚠️ **Importante:**

- O arquivo `.env.local` não deve ser commitado no Git
- Reinicie o servidor após criar/modificar o arquivo
- **No Next.js, as variáveis devem começar com `NEXT_PUBLIC_`**
- **URL correta**: `https://app.hallo-api.com/v1`

---

**Após configurar, o botão "Testar envio" funcionará!** 🚀 