export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path = [] } = req.query;
  const { instance, token, action } = req.query;
  
  let targetUrl;
  
  // Se temos query parameters, construir URL com eles
  if (instance && token) {
    if (action) {
      targetUrl = `https://app.hallo-api.com/v1/instance/${instance}/token/${token}/${action}`;
    } else {
      targetUrl = `https://app.hallo-api.com/v1/instance/${instance}/token/${token}/message`;
    }
  } else {
    // Caso contrário, usar path parameters
    targetUrl = `https://app.hallo-api.com/v1/${path.join('/')}`;
  }

  console.log('🎯 Target URL:', targetUrl);
  console.log('📋 Request method:', req.method);
  console.log('📋 Content-Type:', req.headers['content-type']);

  const fetchOptions = {
    method: req.method,
    headers: {},
  };

  // Copiar headers relevantes, excluindo host
  Object.keys(req.headers).forEach(key => {
    if (key.toLowerCase() !== 'host') {
      fetchOptions.headers[key] = req.headers[key];
    }
  });

  // Adicionar body para métodos que aceitam
  if (!['GET', 'HEAD'].includes(req.method) && req.body) {
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Para FormData, usar o body diretamente
      fetchOptions.body = req.body;
    } else if (contentType.includes('application/json')) {
      // Para JSON, stringificar
      fetchOptions.body = JSON.stringify(req.body);
    } else {
      // Para outros tipos, usar como está
      fetchOptions.body = req.body;
    }
  }

  try {
    console.log('🚀 Making request to:', targetUrl);
    console.log('📦 Fetch options:', {
      method: fetchOptions.method,
      headers: fetchOptions.headers,
      hasBody: !!fetchOptions.body
    });

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    console.log('📥 Response status:', response.status);
    console.log('📄 Response data:', data);

    // Copiar headers da resposta
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    res.status(response.status);
    res.send(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      details: error.message,
      targetUrl,
      method: req.method
    });
  }
} 