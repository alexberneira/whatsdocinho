import { Readable } from 'stream';

export default async function handler(req, res) {
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

  const fetchOptions = {
    method: req.method,
    headers: { ...req.headers },
  };
  delete fetchOptions.headers.host;

  // Ler o body como buffer para métodos que aceitam
  if (!['GET', 'HEAD'].includes(req.method)) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    fetchOptions.body = Buffer.concat(buffers);
  }

  const response = await fetch(targetUrl, fetchOptions);
  const data = await response.arrayBuffer();

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.status(response.status);
  res.send(Buffer.from(data));
}

// Desabilitar o bodyParser do Next.js para permitir streaming do body
export const config = {
  api: {
    bodyParser: false,
  },
}; 