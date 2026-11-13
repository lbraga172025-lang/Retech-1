# Integração de confirmação real de e-mail — ReTech

## Fluxo implementado
1. O navegador valida os campos e envia o formulário para `POST /api/confirmacao`.
2. A API valida novamente os dados, limita tentativas e gera um token aleatório de 256 bits.
3. O servidor guarda somente o hash do token e os dados pendentes no SQLite; o token original é enviado ao endereço informado pelo Resend.
4. O link expira em 30 minutos e só pode ser usado uma vez.
5. Ao abrir `confirmar-email.html`, o navegador chama `GET /api/confirmar`. A API valida o token e só então grava a mensagem em `confirmed_contacts`.

## Stack
- Front-end: HTML, CSS e JavaScript existentes.
- API: Node.js 20+, Express, Helmet e express-rate-limit.
- E-mail transacional: Resend.
- Persistência: SQLite (`better-sqlite3`). Em produção, o volume de armazenamento precisa ser persistente. Se a plataforma não oferecer disco persistente, migrar o banco para PostgreSQL gerenciado antes de publicar.

## Configuração necessária antes de funcionar em produção
1. Criar conta no Resend e verificar um domínio remetente (ou usar um remetente de teste permitido pelo provedor).
2. Criar uma API Key no Resend.
3. No ambiente do backend, configurar as variáveis do arquivo `.env.example`: `RESEND_API_KEY`, `RESEND_FROM`, `PUBLIC_BASE_URL`, `FRONTEND_ORIGIN` e `DB_PATH`.
4. Instalar dependências e iniciar: `cd server && npm install && npm start`.
5. Publicar o backend em uma plataforma Node.js com HTTPS e armazenamento persistente para `server/data`.
6. Publicar o front-end no GitHub Pages e a API Node.js separadamente. Para repositórios de projeto, `PUBLIC_BASE_URL` precisa incluir o caminho `/NOME-DO-REPOSITORIO`, enquanto `FRONTEND_ORIGIN` contém somente `https://USUARIO.github.io`. Definir `window.RETECH_API_URL` em `js/api-config.js` com a URL HTTPS da API. Consulte `docs/publicacao-github-pages.md`.
7. Testar o fluxo com caixas de e-mail reais, incluindo spam, token expirado, token reutilizado e falha do provedor.

## Segurança e privacidade
- A chave Resend fica exclusivamente no servidor; nunca no JavaScript do navegador ou no GitHub.
- O token é armazenado como SHA-256, expira em 30 minutos e é de uso único.
- Há limitação de tentativas por IP nas rotas de envio e confirmação.
- Dados do contato só são inseridos na tabela final após a confirmação.
- O SQLite contém dados pessoais. Restringir acesso, definir retenção e disponibilizar processo de exclusão. Para produção real, adicionar política de privacidade, consentimento específico, logs sem dados sensíveis e rotina de backup.
- A confirmação prova acesso à caixa de entrada naquele momento; não garante identidade civil da pessoa.

## Situação
A estrutura de integração foi adicionada ao projeto, mas o envio real permanece desativado até configurar credenciais do Resend, domínio remetente e URLs públicas. Nenhum segredo deve ser commitado.
