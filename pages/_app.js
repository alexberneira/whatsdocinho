import Head from 'next/head';
import '../lib/hallo';
import '../lib/supabase';
import './App.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <title>WhatsDocinho - Gerenciador de Contatos e Mensagens WhatsApp</title>
        <meta name="description" content="Gerencie seus contatos e mensagens do WhatsApp de forma simples e eficiente" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
} 