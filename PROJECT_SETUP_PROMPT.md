# PROMPT PARA CRIAR PROJETO REACT INICIAL - STACK MODERNA

## CONTEXTO
Crie um projeto React inicial e vazio usando uma stack moderna de desenvolvimento web. O projeto deve estar pronto para desenvolvimento com todas as dependências e configurações necessárias, mas sem nenhuma funcionalidade implementada.

## TECNOLOGIAS E DEPENDÊNCIAS

### Frontend Principal
- **React 18.2.0** - Framework principal
- **React DOM 18.2.0** - Renderização React
- **React Scripts 5.0.1** - Scripts de desenvolvimento Create React App
- **TypeScript** - Para tipagem estática
- **Tailwind CSS** - Framework CSS utilitário

### Backend e Banco de Dados
- **Supabase** - Backend as a Service (BaaS)
- **@supabase/supabase-js 2.50.0** - Cliente JavaScript do Supabase
- **Express 5.1.0** - Framework Node.js (para APIs se necessário)
- **CORS 2.8.5** - Middleware para Cross-Origin Resource Sharing

### Banco de Dados Local (Opcional)
- **SQLite 5.1.1** - Banco de dados local
- **SQLite3 5.1.7** - Driver SQLite para Node.js

### Testes
- **@testing-library/react 16.3.0** - Biblioteca de testes React
- **@testing-library/dom 10.4.0** - Utilitários de teste DOM
- **@testing-library/jest-dom 6.6.3** - Matchers customizados para Jest
- **@testing-library/user-event 13.5.0** - Simulação de eventos do usuário

### Performance e Monitoramento
- **Web Vitals 2.1.4** - Métricas de performance web

### Desenvolvimento
- **Concurrently 9.1.2** - Executar múltiplos comandos simultaneamente

## ESTRUTURA DE ARQUIVOS REQUERIDA

```
projeto-inicial/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── logo192.png (opcional)
├── src/
│   ├── components/ (pasta vazia)
│   ├── pages/ (pasta vazia)
│   ├── hooks/ (pasta vazia)
│   ├── utils/ (pasta vazia)
│   ├── types/ (pasta vazia)
│   ├── lib/
│   │   └── supabase.ts (configuração básica)
│   ├── App.tsx (componente principal vazio)
│   ├── App.css (estilos básicos)
│   ├── index.tsx (ponto de entrada)
│   ├── index.css (estilos globais)
│   └── reportWebVitals.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .gitignore
├── README.md
├── vercel.json (para deploy)
└── supabase-setup.sql (estrutura básica do banco)
```

## CONFIGURAÇÕES ESPECÍFICAS

### TypeScript (tsconfig.json)
- Configuração para React com TypeScript
- Suporte a JSX
- Path mapping configurado
- Strict mode habilitado
- Compatibilidade com Next.js (para futuras migrações)

### Tailwind CSS (tailwind.config.ts)
- Configuração TypeScript
- Cores primárias personalizadas
- Suporte a páginas, componentes e app directory
- Plugins vazios (pronto para extensão)

### Vercel (vercel.json)
- Configuração para Create React App
- Build command: npm run build
- Output directory: build
- Framework: create-react-app

### Supabase (src/lib/supabase.ts)
- Cliente configurado com variáveis de ambiente
- URL e chave anônima do Supabase
- Exportação do cliente para uso em toda aplicação

## ARQUIVOS INICIAIS

### App.tsx
- Componente funcional React com TypeScript
- Estrutura básica com header e main
- Pronto para receber componentes filhos
- Sem funcionalidades específicas

### index.tsx
- Ponto de entrada da aplicação
- Renderização do App component
- Configuração do React.StrictMode
- Importação do reportWebVitals

### index.css
- Reset CSS básico
- Importação do Tailwind CSS
- Fontes do sistema configuradas
- Estilos globais mínimos

### App.css
- Estilos específicos do componente App
- Layout responsivo básico
- Gradientes e cores do tema
- Animações CSS básicas

## SCRIPTS DO PACKAGE.JSON

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## CONFIGURAÇÕES DE DESENVOLVIMENTO

### ESLint
- Configuração padrão do Create React App
- Extensões: react-app e react-app/jest

### Browserslist
- Suporte a navegadores modernos
- Configuração para produção e desenvolvimento

### PostCSS
- Configuração para Tailwind CSS
- Autoprefixer habilitado

## ESTRUTURA DO BANCO SUPABASE

### Tabelas Básicas (supabase-setup.sql)
- Estrutura inicial para contatos
- Estrutura inicial para mensagens
- Políticas de segurança básicas
- Row Level Security (RLS) habilitado

## INSTRUÇÕES DE IMPLEMENTAÇÃO

1. **Criar projeto base**: Use Create React App com TypeScript
2. **Instalar dependências**: Todas as dependências listadas acima
3. **Configurar Tailwind CSS**: Instalação e configuração completa
4. **Configurar Supabase**: Cliente e estrutura básica do banco
5. **Criar estrutura de pastas**: Organização modular para escalabilidade
6. **Configurar TypeScript**: Configuração otimizada para React
7. **Configurar deploy**: Vercel configurado para produção
8. **Documentação**: README com instruções de setup e desenvolvimento

## VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Criar arquivo `.env.local` com:
```
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## COMANDOS DE INSTALAÇÃO

```bash
# Criar projeto
npx create-react-app projeto-inicial --template typescript

# Instalar dependências principais
npm install @supabase/supabase-js express cors sqlite sqlite3

# Instalar dependências de desenvolvimento
npm install -D tailwindcss postcss autoprefixer concurrently

# Instalar dependências de teste
npm install @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event

# Configurar Tailwind CSS
npx tailwindcss init -p
```

## RESULTADO ESPERADO

Um projeto React completamente funcional e vazio, com:
- ✅ Todas as dependências instaladas
- ✅ TypeScript configurado
- ✅ Tailwind CSS funcionando
- ✅ Supabase conectado
- ✅ Estrutura de pastas organizada
- ✅ Configuração de deploy pronta
- ✅ Testes configurados
- ✅ Sem funcionalidades específicas implementadas
- ✅ Pronto para desenvolvimento

## OBSERVAÇÕES IMPORTANTES

- O projeto deve estar 100% funcional após a criação
- Todas as configurações devem estar corretas
- O projeto deve rodar com `npm start` sem erros
- Deve estar pronto para receber novas funcionalidades
- Manter padrões modernos de desenvolvimento
- Documentação clara e completa
- Estrutura escalável para crescimento futuro

---

**Este prompt gera um projeto inicial com stack moderna de desenvolvimento web, completamente vazio e pronto para desenvolvimento.** 