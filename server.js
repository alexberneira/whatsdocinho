const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = 3001;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware para parsear FormData
app.use(express.raw({ type: 'multipart/form-data', limit: '10mb' }));

// Proxy manual para a API Hallo
app.post('/api/hallo/instance/:instance/token/:token/message', async (req, res) => {
  try {
    console.log('🚀 Proxy request received');
    console.log('📋 Headers:', req.headers);
    
    const { instance, token } = req.params;
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
    console.log('📋 API Response headers:', response.headers);
    console.log('📄 API Response data:', response.data);
    console.log('📏 API Response length:', JSON.stringify(response.data).length);
    
    // Retornar a resposta da API
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    if (error.response) {
      console.error('📥 Error response status:', error.response.status);
      console.error('📄 Error response data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Proxy error', details: error.message });
    }
  }
});

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying /api/hallo/* to https://app.hallo-api.com/v1/*`);
}); 