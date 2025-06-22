import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extrair instance e token da URL
    const url = req.url;
    const match = url.match(/\/instance\/([^\/]+)\/token\/([^\/]+)\/message/);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    const [, instance, token] = match;
    const targetUrl = `https://app.hallo-api.com/v1/instance/${instance}/token/${token}/message`;
    
    console.log('🎯 Target URL:', targetUrl);
    
    // Criar FormData com os dados recebidos
    const formData = new FormData();
    
    // Parsear o FormData recebido
    const boundary = req.headers['content-type'].split('boundary=')[1];
    const body = req.body.toString();
    const parts = body.split(`--${boundary}`);
    
    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data')) {
        const lines = part.split('\r\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('Content-Disposition: form-data; name=')) {
            const name = lines[i].match(/name="([^"]+)"/)[1];
            const value = lines[i + 2]; // O valor está 2 linhas depois
            console.log(`📦 Form field: ${name} = ${value}`);
            formData.append(name, value);
          }
        }
      }
    }
    
    // Fazer a requisição para a API Hallo
    const response = await axios.post(targetUrl, formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxRedirects: 5
    });
    
    console.log('📥 API Response status:', response.status);
    console.log('📄 API Response data:', response.data);
    
    // Retornar a resposta da API
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ API error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'API error', details: error.message });
    }
  }
} 