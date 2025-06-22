// Configuração do Hallo API para integração com WhatsDocinho
// Documentação: https://hallo.com.br/api

class HalloAPI {
  constructor() {
    // Configurações base da API - sempre usar API Route local
    this.baseURL = '/api/hallo'; // API Route do Next.js
    this.apiKey = process.env.NEXT_PUBLIC_HALLO_API_KEY || '';
    this.instanceName = process.env.NEXT_PUBLIC_HALLO_INSTANCE || '';
    
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
      // Construir URL para a API Route com path parameters
      const apiUrl = `${this.baseURL}/instance/${this.instanceName}/token/${this.apiKey}/message`;
      
      console.log('=== DEBUG HALLO API ===');
      console.log('URL da requisição:', apiUrl);
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
      
      const response = await fetch(apiUrl, {
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

  // Método para enviar mídia (imagem, vídeo, documento) com a estrutura correta da API
  async sendMediaMessage(phoneNumber, mediaUrl, mediaType, caption = '') {
    if (!this.isConfigured()) {
      throw new Error('Hallo API não está configurada. Verifique as variáveis de ambiente.');
    }

    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    // Mapear tipos de mídia para os tipos corretos da API Hallo
    const actionMap = {
      'photo': 'IMAGE',
      'image': 'IMAGE', 
      'video': 'VIDEO',
      'file': 'DOCUMENT',
      'document': 'DOCUMENT'
    };

    const action = actionMap[mediaType.toLowerCase()] || 'IMAGE';

    try {
      // Construir URL para a API Route com path parameters
      const apiUrl = `${this.baseURL}/instance/${this.instanceName}/token/${this.apiKey}/message`;
      
      console.log('=== DEBUG HALLO API (MÍDIA) ===');
      console.log('URL da requisição:', apiUrl);
      console.log('Número formatado:', formattedNumber);
      console.log('Tipo de mídia original:', mediaType);
      console.log('Tipo de mídia mapeado:', action);
      console.log('URL da mídia:', mediaUrl);
      console.log('Legenda:', caption);
      
      // Para imagens, converter URL para base64
      let imageBase64 = null;
      let imageName = null;
      
      if (action === 'IMAGE' && mediaUrl) {
        try {
          console.log('🔄 Convertendo imagem para base64...');
          imageBase64 = await this.urlToBase64(mediaUrl);
          imageName = this.extractFileName(mediaUrl);
          console.log('✅ Imagem convertida para base64');
        } catch (error) {
          console.error('❌ Erro ao converter imagem para base64:', error);
          throw new Error('Erro ao processar imagem: ' + error.message);
        }
      }
      
      // Criar FormData conforme documentação da API
      const formData = new FormData();
      formData.append("fLogin", "5NPMZJ9J-paDryH-Fcf08AMJ-EZNEHYYUCWHW"); // Login da instância
      formData.append("ACTION", action);
      formData.append("destination", formattedNumber);
      
      // Para imagens, usar base64; para outros tipos, usar URL
      if (action === 'IMAGE' && imageBase64) {
        formData.append("image_base64", imageBase64);
        if (imageName) {
          formData.append("image_name", imageName);
        }
        // Adicionar texto como legenda
        if (caption && caption.trim() !== '') {
          formData.append("text", caption);
        }
      } else {
        // Para vídeos e documentos, usar URL
        formData.append("url", mediaUrl);
        if (caption && caption.trim() !== '') {
          formData.append("caption", caption);
        }
      }
      
      console.log('📦 FormData criado:', {
        fLogin: "5NPMZJ9J-paDryH-Fcf08AMJ-EZNEHYYUCWHW",
        ACTION: action,
        destination: formattedNumber,
        ...(action === 'IMAGE' ? {
          image_base64: imageBase64 ? 'data:image/...' : 'N/A',
          image_name: imageName || 'N/A',
          text: caption || 'N/A'
        } : {
          url: mediaUrl,
          caption: caption || 'N/A'
        })
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      });

      console.log('=== RESPOSTA DA API (MÍDIA) ===');
      console.log('Status da resposta:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Erro da API (mídia):', errorText);
        throw new Error(`Erro na API: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Verificar se a resposta tem conteúdo
      const responseText = await response.text();
      console.log('📄 Resposta da API (mídia):', responseText);
      console.log('📏 Tamanho da resposta:', responseText.length);
      
      if (!responseText || responseText.trim() === '') {
        console.log('✅ Resposta vazia - considerando sucesso');
        return { success: true, message: 'Mídia enviada com sucesso' };
      }

      // Tentar fazer parse do JSON
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Resposta da API (JSON):', jsonResponse);
        
        // Verificar se a mensagem foi agendada com sucesso
        if (jsonResponse.isValid && jsonResponse.message === "MESSAGE_SCHEDULED") {
          return { 
            success: true, 
            message: 'Mídia agendada com sucesso!',
            messageId: jsonResponse.result?.message_id,
            instanceId: jsonResponse.instance_id
          };
        } else {
          console.log('⚠️ Resposta da API indica problema:', jsonResponse);
          return { 
            success: false, 
            message: `Erro ao enviar mídia: ${jsonResponse.message || 'Erro desconhecido'}`,
            details: jsonResponse
          };
        }
      } catch (jsonError) {
        console.log('⚠️ Erro ao fazer parse do JSON:', jsonError);
        console.log('📄 Conteúdo que não é JSON:', responseText);
        return { success: true, message: 'Mídia enviada com sucesso', rawResponse: responseText };
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mídia:', error);
      throw error;
    }
  }

  // Método auxiliar para converter URL em base64
  async urlToBase64(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Erro ao converter URL para base64: ${error.message}`);
    }
  }

  // Método auxiliar para extrair nome do arquivo da URL
  extractFileName(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop();
      return fileName || 'image.jpg';
    } catch (error) {
      return 'image.jpg';
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