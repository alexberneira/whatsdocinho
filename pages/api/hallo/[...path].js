import { Readable } from 'stream';

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const targetUrl = `https://app.hallo-api.com/v1/${path.join('/')}`;

  // Montar opções para o fetch
  const fetchOptions = {
    method: req.method,
    headers: { ...req.headers },
    // Não envie o host original
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

  // Fazer proxy para a API Hallo
  const response = await fetch(targetUrl, fetchOptions);
  const data = await response.arrayBuffer();

  // Repasse todos os headers da resposta
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