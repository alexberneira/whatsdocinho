import FormData from 'form-data';
import fetch from 'node-fetch';

async function testHalloAPI() {
  console.log('🧪 Testando API Hallo diretamente...');
  
  const formData = new FormData();
  formData.append("fLogin", "OW6N-000969-716u-6c5t-1MOEXNWKYXSO");
  formData.append("ACTION", "TEXT");
  formData.append("destination", "5551994005252");
  formData.append("text", "Teste direto da API Hallo");

  try {
    const response = await fetch(
      "https://app.hallo-api.com/v1/instance/OW6N-000969-716u-6c5t-1MOEXNWKYXSO/token/GQAL5UGT-F2xd-XTzJ-QfyH-WDGH3S92HEW5/message",
      {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      }
    );

    console.log('📥 Status:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Response length:', responseText.length);
    console.log('📄 Response:', responseText);
    
    if (responseText) {
      try {
        const json = JSON.parse(responseText);
        console.log('✅ JSON parsed:', json);
      } catch (e) {
        console.log('❌ Not JSON:', e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testHalloAPI(); 