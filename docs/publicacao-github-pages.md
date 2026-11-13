# Publicação do ReTech no GitHub Pages + API de confirmação

## Arquitetura
- **GitHub Pages:** publica o front-end estático (HTML, CSS, JavaScript e assets).
- **API Node.js:** deve ficar em uma hospedagem separada que execute Node.js.
- **Resend:** envia o e-mail transacional de confirmação.
- **SQLite:** exige armazenamento persistente no servidor da API. Se a hospedagem não oferecer volume persistente, migrar para PostgreSQL antes da produção.

GitHub Pages não executa `server/src/server.js`, não mantém banco de dados e não pode guardar a chave privada do Resend.

## 1. Preparar o repositório
1. Extraia o conteúdo da pasta `ReTech` para a raiz do repositório GitHub (os arquivos `index.html`, `contato.html`, `css/`, `js/`, `assets/`, `server/` e `.github/` devem ficar na raiz).
2. Confirme que `js/api-config.js` está versionado com valor vazio enquanto a URL da API ainda não existe.
3. Não envie arquivos `.env`, chaves de API, tokens, banco de produção ou dados pessoais para o GitHub. O `.gitignore` já exclui `.env` e arquivos SQLite.
4. Faça commit e push para a branch `main`.

## 2. Ativar GitHub Pages
1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. A workflow `.github/workflows/pages.yml` publica a raiz do repositório a cada push em `main`.
4. Aguarde a execução em **Actions** e abra a URL publicada.

URL típica de repositório: `https://USUARIO.github.io/NOME-DO-REPOSITORIO/`.
Se o repositório for `USUARIO.github.io`, a URL típica não inclui o nome de repositório.

## 3. Configurar o endereço público do front-end
Depois que o GitHub Pages publicar o site, ajuste as variáveis no serviço de hospedagem da API:

- `FRONTEND_ORIGIN=https://USUARIO.github.io` (somente a origem, sem caminho do repositório).
- `PUBLIC_BASE_URL=https://USUARIO.github.io/NOME-DO-REPOSITORIO` (inclua o caminho do repositório para que o link do e-mail abra `confirmar-email.html` no lugar correto).

Para um repositório de usuário `USUARIO.github.io`, use a URL sem o caminho do repositório em ambas as variáveis.

## 4. Configurar o front-end para chamar a API
Quando a API tiver uma URL HTTPS pública, edite `js/api-config.js`:

```js
window.RETECH_API_URL = 'https://SUA-API-PUBLICA';
```

Não coloque a chave do Resend nesse arquivo. Ele é público e será entregue a qualquer visitante. Faça commit e push da alteração.

## 5. Configurar a API e o Resend
Na hospedagem Node.js, configure as variáveis de ambiente descritas em `server/.env.example`:
- `RESEND_API_KEY`: chave privada criada no painel do Resend.
- `RESEND_FROM`: remetente em domínio verificado no Resend.
- `PUBLIC_BASE_URL`: URL completa do GitHub Pages, incluindo o caminho do repositório quando aplicável.
- `FRONTEND_ORIGIN`: apenas a origem do GitHub Pages, sem caminho.
- `DB_PATH`: caminho em volume persistente, por exemplo `/var/data/retech.sqlite`.
- `PORT`: normalmente fornecida automaticamente pela plataforma.

O backend deve usar HTTPS e armazenamento persistente. Não considere SQLite em disco efêmero como armazenamento de produção: reinícios ou novos deploys podem apagar os registros e os tokens.

## 6. Testes antes de divulgar
- Abrir `contato.html` pelo endereço HTTPS do GitHub Pages.
- Enviar formulário válido e verificar a resposta `202` da API.
- Conferir a chegada do e-mail, inclusive spam.
- Clicar no link e confirmar que a página `confirmar-email.html` abre sob o caminho correto do repositório.
- Verificar token expirado, token reutilizado, e-mail inválido, indisponibilidade da API e falha do Resend.
- Confirmar no banco da API que o contato só aparece em `confirmed_contacts` depois do clique.
- Conferir CORS: a API deve aceitar somente a origem exata do GitHub Pages configurada em `FRONTEND_ORIGIN`.

## Limitação atual
O workflow prepara a publicação do front-end, mas não publica nem configura automaticamente a API. A confirmação real só funciona depois que API, Resend, domínio remetente e variáveis de ambiente estiverem configurados.
