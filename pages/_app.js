import Head from 'next/head';
import '../lib/hallo';
import '../lib/supabase';
import './App.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WhatsDocinho - Gerenciador de Contatos e Mensagens WhatsApp</title>
        <meta name="description" content="Gerencie seus contatos e mensagens do WhatsApp de forma simples e eficiente" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
} 