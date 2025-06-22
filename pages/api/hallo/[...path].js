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

  // Só envie body para métodos que aceitam
  if (!['GET', 'HEAD'].includes(req.method)) {
    fetchOptions.body = req.body;
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