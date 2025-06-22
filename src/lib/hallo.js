// Configuração do Hallo API para integração com WhatsDocinho
// Documentação: https://hallo.com.br/api

class HalloAPI {
  constructor() {
    // Configurações base da API
    const isDevelopment = process.env.NODE_ENV === 'development';
    this.baseURL = isDevelopment 
      ? (process.env.REACT_APP_HALLO_API_URL || 'http://localhost:3001/api/hallo')
      : '/api/hallo'; // API Route do Next.js
    this.apiKey = process.env.REACT_APP_HALLO_API_KEY || '';
    this.instanceName = process.env.REACT_APP_HALLO_INSTANCE || '';
    
    // Headers padrão para requisições
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Verificar se a API está configurada
  isConfigured() {
    return this.apiKey && this.instanceName;
  }

  // Método auxiliar para formatar número de telefone
  formatPhoneNumber(phoneNumber) {
    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('55')) {
      // Se não tem 55, adiciona 55 (Brasil)
      formattedNumber = '55' + formattedNumber;
    }
    return formattedNumber;
  }

  // Método para enviar mensagem de texto
  async sendTextMessage(phoneNumber, message) {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    // Formatar número de telefone para incluir código do país
    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    try {
      console.log('=== DEBUG HALLO API ===');
      console.log('URL da requisição:', `${this.baseURL}/instance/${this.instanceName}/token/${this.apiKey}/message`);
      console.log('Número original:', phoneNumber);
      console.log('Número formatado:', formattedNumber);
      console.log('Mensagem:', message);
      
      // Criar FormData conforme documentação da API
      const formData = new FormData();
      formData.append("fLogin", "5NPMZJ9J-paDryH-Fcf08AMJ-EZNEHYYUCWHW"); // Login da instância
      formData.append("ACTION", "TEXT");
      formData.append("destination", formattedNumber);
      formData.append("text", message);
      
      console.log('📦 FormData criado:', {
        fLogin: "5NPMZJ9J-paDryH-Fcf08AMJ-EZNEHYYUCWHW",
        ACTION: "TEXT",
        destination: formattedNumber,
        text: message
      });
      
      const response = await fetch(`${this.baseURL}/instance/${this.instanceName}/token/${this.apiKey}/message`, {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      });

      console.log('=== RESPOSTA DA API ===');
      console.log('Status da resposta:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));
      console.log('URL da resposta:', response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Erro da API (texto):', errorText);
        throw new Error(`Erro na API: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Verificar se a resposta tem conteúdo
      const responseText = await response.text();
      console.log('📄 Resposta da API (texto):', responseText);
      console.log('📏 Tamanho da resposta:', responseText.length);
      
      if (!responseText || responseText.trim() === '') {
        console.log('✅ Resposta vazia - considerando sucesso');
        return { success: true, message: 'Mensagem enviada com sucesso' };
      }

      // Tentar fazer parse do JSON
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Resposta da API (JSON):', jsonResponse);
        
        // Verificar se a mensagem foi agendada com sucesso
        if (jsonResponse.isValid && jsonResponse.message === "MESSAGE_SCHEDULED") {
          return { 
            success: true, 
            message: 'Mensagem agendada com sucesso!',
            messageId: jsonResponse.result?.message_id,
            instanceId: jsonResponse.instance_id
          };
        } else {
          console.log('⚠️ Resposta da API indica problema:', jsonResponse);
          return { 
            success: false, 
            message: 'Erro ao enviar mensagem',
            details: jsonResponse
          };
        }
      } catch (jsonError) {
        console.log('⚠️ Erro ao fazer parse do JSON:', jsonError);
        console.log('📄 Conteúdo que não é JSON:', responseText);
        return { success: true, message: 'Mensagem enviada com sucesso', rawResponse: responseText };
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de texto:', error);
      throw error;
    }
  }

  // Método para enviar imagem
  async sendImageMessage(phoneNumber, imageUrl, caption = '') {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    try {
      const response = await fetch(`${this.baseURL}/message/sendImage/${this.instanceName}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          number: formattedNumber,
          image: imageUrl,
          caption: caption
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      throw error;
    }
  }

  // Método para enviar vídeo
  async sendVideoMessage(phoneNumber, videoUrl, caption = '') {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    try {
      const response = await fetch(`${this.baseURL}/message/sendVideo/${this.instanceName}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          number: formattedNumber,
          video: videoUrl,
          caption: caption
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar vídeo:', error);
      throw error;
    }
  }

  // Método para enviar documento
  async sendDocumentMessage(phoneNumber, documentUrl, filename = '') {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    try {
      const response = await fetch(`${this.baseURL}/message/sendDocument/${this.instanceName}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          number: formattedNumber,
          document: documentUrl,
          filename: filename
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      throw error;
    }
  }

  // Método para verificar status da conexão
  async checkConnection() {
    if (!this.isConfigured()) {
      return { connected: false, error: 'API não configurada' };
    }

    try {
      const response = await fetch(`${this.baseURL}/instance/connectionState/${this.instanceName}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { connected: true, data };
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      return { connected: false, error: error.message };
    }
  }

  // Método para obter QR Code (se necessário)
  async getQRCode() {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    try {
      const response = await fetch(`${this.baseURL}/instance/qrcode/${this.instanceName}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      throw error;
    }
  }

  // Método para desconectar instância
  async disconnect() {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    try {
      const response = await fetch(`${this.baseURL}/instance/logout/${this.instanceName}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      throw error;
    }
  }
}

// Criar instância única da API
const halloAPI = new HalloAPI();

// Exportar a instância
export default halloAPI;

// Exportar também a classe para uso direto se necessário
export { HalloAPI };