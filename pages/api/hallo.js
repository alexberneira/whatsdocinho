export default async function handler(req, res) {
  console.log('🔍 Test route accessed');
  console.log('📋 Method:', req.method);
  console.log('📋 Headers:', req.headers);
  console.log('📋 Body:', req.body);
  
  // Aceitar todos os métodos para teste
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Retornar informações de debug
  res.status(200).json({
    message: 'Test route working',
    method: req.method,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
} 