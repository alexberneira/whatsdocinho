import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  // Configurar CORS para Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Aceitar tanto GET quanto POST para compatibilidade
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      allowed: ['GET', 'POST', 'OPTIONS'],
      received: req.method 
    });
  }

  try {
    // Extrair parâmetros da query string ou body
    const { instance, token, action = 'message' } = req.query;
    
    if (!instance || !token) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['instance', 'token'],
        received: { instance, token, action }
      });
    }
    
    // Construir a URL da API Hallo
    const targetUrl = `https://app.hallo-api.com/v1/instance/${instance}/token/${token}/${action}`;
    
    console.log('🎯 Target URL:', targetUrl);
    console.log('📋 Request method:', req.method);
    console.log('📋 Request headers:', req.headers);
    
    // Criar FormData com os dados recebidos
    const formData = new FormData();
    
    // Se for POST, processar o body
    if (req.method === 'POST') {
      // Parsear o FormData recebido
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('multipart/form-data')) {
        const boundary = contentType.split('boundary=')[1];
        const body = req.body.toString();
        const parts = body.split(`--${boundary}`);
        
        for (const part of parts) {
          if (part.includes('Content-Disposition: form-data')) {
            const lines = part.split('\r\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes('Content-Disposition: form-data; name=')) {
                const nameMatch = lines[i].match(/name="([^"]+)"/);
                if (nameMatch) {
                  const name = nameMatch[1];
                  const value = lines[i + 2]; // O valor está 2 linhas depois
                  console.log(`📦 Form field: ${name} = ${value}`);
                  formData.append(name, value);
                }
              }
            }
          }
        }
      } else {
        // Se não for multipart, usar o body diretamente
        Object.keys(req.body).forEach(key => {
          console.log(`📦 Body field: ${key} = ${req.body[key]}`);
          formData.append(key, req.body[key]);
        });
      }
    }
    
    // Fazer a requisição para a API Hallo
    const response = await axios.post(targetUrl, formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxRedirects: 5,
      timeout: 30000
    });
    
    console.log('📥 API Response status:', response.status);
    console.log('📄 API Response data:', response.data);
    
    // Retornar a resposta da API
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ API error:', error.message);
    console.error('❌ Error details:', error);
    
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error('❌ No response received');
      res.status(500).json({ 
        error: 'No response from API', 
        details: error.message 
      });
    } else {
      console.error('❌ Request setup error');
      res.status(500).json({ 
        error: 'Request setup error', 
        details: error.message 
      });
    }
  }
} 