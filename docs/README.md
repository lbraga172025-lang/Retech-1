# ReTech — Logística reversa de lixo eletrônico

Projeto acadêmico da equipe **EcoTech**, da disciplina de Front-End (UNICID), orientado pelo Prof. Paulo Fratta. O ReTech é um **site educativo** sobre descarte correto e logística reversa de resíduos eletroeletrônicos. Não é uma ONG constituída, não opera coleta e não deve ser apresentado como prestador de serviço de recolhimento.

## Publicação e repositório

- Site: https://www.retech.tec.br
- Repositório: https://github.com/lbraga172025-lang/Retech-1
- Front-end: GitHub Pages, com domínio personalizado e HTTPS.
- API: serviço Node.js no Render: `https://retech-api-xxb7.onrender.com`.
- Banco central: PostgreSQL conectado à API por `DATABASE_URL`.
- E-mail transacional: Resend, remetente `ReTech <confirmacao@retech.tec.br>`.

## Páginas do site

O site possui dez páginas principais interligadas: `index.html`, `sobre.html`, `projetos.html`, `impacto.html`, `acessibilidade.html`, `galeria.html`, `midia.html`, `noticias.html`, `contato.html` e `orcamento_hospedagem.html`. A página `confirmar-email.html` é uma página auxiliar do fluxo de confirmação.

## Equipe e divisão registrada no escopo

| Integrante | RGM | Responsabilidade registrada |
|---|---:|---|
| Pedro Henrique de Oliveira Medeiros | 47656247 | `index.html`, `sobre.html`, CSS base |
| Davi Cabral Paixão | 47752980 | `index.html`, `sobre.html`, CSS base |
| Lucas dos Santos Vicente Braga | 47901624 | `projetos.html`, `impacto.html`, `galeria.html` |
| Laura Moreti | 47746301 | `acessibilidade.html`, `midia.html`, `noticias.html` |
| Pietro Tavares | 47658649 | `acessibilidade.html`, `midia.html`, `noticias.html` |
| Rodrigo Seriaco Lovato | 48117722 | `contato.html`, `orcamento_hospedagem.html`, documentação `/docs` |

A divisão acima é a divisão documentada no escopo. A participação efetiva no Git deve ser comprovada pelo histórico de commits de cada integrante.

## Tecnologias e arquitetura

- **Front-end:** HTML5 semântico, CSS3 e JavaScript puro, sem framework.
- **CSS:** `css/base.css`, com variáveis visuais, Flexbox, Grid, media queries, foco visível, transições e suporte a `prefers-reduced-motion`.
- **JavaScript:** `js/menu.js` (menu responsivo e navegação direcional entre links do menu), `js/acessibilidade.js` (A−/A+ e leitura em voz alta), `js/contato.js` (validação, mensagens, envio e rascunho local), `js/confirmar-email.js` (retorno do fluxo de confirmação) e `js/api-config.js` (URL pública da API; nunca guardar segredos aqui).
- **Back-end:** Node.js 20+, Express, Helmet, `express-rate-limit`, `pg` e SDK Resend. Código principal em `server/src/server.js`.
- **Banco:** PostgreSQL. A tabela `pending_confirmations` guarda solicitações aguardando confirmação e o hash do token; `confirmed_contacts` guarda os contatos confirmados.
- **E-mail:** Resend, chamado exclusivamente pelo back-end.

## Funcionalidades

- Dez páginas principais com menu comum, links internos, `lang="pt-BR"`, estrutura semântica e link para pular ao conteúdo.
- Layout responsivo e identidade visual compartilhada.
- Barra de acessibilidade com alteração de tamanho do texto e leitura em voz alta pelo navegador.
- Navegação do foco entre links do menu usando as setas; `Tab`, `Shift+Tab` e `Enter` permanecem disponíveis.
- Página de mídia com vídeo, áudio e mapa incorporado.
- Formulário com validação no navegador e no servidor, mensagens acessíveis e destaque de campos inválidos.
- Rascunho de formulário salvo em `localStorage` no navegador do visitante. **LocalStorage não é o banco central**.
- API envia link real de confirmação por e-mail; token aleatório é representado no banco somente por seu hash e expira em 30 minutos.
- Verificação DNS do domínio do e-mail (MX e, quando necessário, A/AAAA), incluindo bloqueio de Null MX. Isso não comprova que uma caixa postal específica existe.
- Após confirmação, os dados são inseridos em `confirmed_contacts` no PostgreSQL.

## Executar localmente

### Front-end

Na raiz do repositório, execute:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. O formulário publicado usa a URL configurada em `js/api-config.js`; para testes locais, configure uma API local ou use a API de teste autorizada pela equipe.

### Back-end

Requisitos: Node.js 20 ou superior e acesso a um PostgreSQL. Dentro de `server/`:

```bash
npm install
npm start
```

Configure as variáveis indicadas em `server/.env.example` no ambiente local ou no Render. Nunca publique o arquivo `.env` nem copie valores secretos para arquivos JavaScript.

## Variáveis de ambiente do back-end

- `PORT`: porta fornecida pela plataforma (ou `3000` em desenvolvimento).
- `DATABASE_URL`: URL privada de conexão com o PostgreSQL.
- `ADMIN_API_KEY`: chave de proteção da rota administrativa existente. Não colocar no front-end.
- `RESEND_API_KEY`: chave privada do Resend.
- `RESEND_FROM`: remetente pertencente ao domínio verificado.
- `PUBLIC_BASE_URL`: endereço HTTPS usado nos links de confirmação (`https://www.retech.tec.br`).
- `FRONTEND_ORIGIN`: origem autorizada pelo CORS (`https://www.retech.tec.br`).

## Rotas atuais da API

- `GET /api/health`: verifica API e conexão com PostgreSQL.
- `POST /api/confirmacao`: valida os dados, verifica o domínio, cria solicitação pendente e envia e-mail.
- `GET /api/confirmar?token=...`: valida o token e registra o contato confirmado.
- `GET /api/admin/contatos`: lista os últimos contatos confirmados, protegida pelo cabeçalho `X-Admin-Key`.

**Limitação administrativa atual:** existe uma rota de API protegida por chave, mas ainda não há uma página de painel com login/sessão para os criadores. Não divulgar a chave nem tentar colocá-la no JavaScript público. A construção do painel administrativo é uma pendência separada do requisito principal de publicação do site.

## Privacidade e limites

O rascunho fica no navegador do visitante; os contatos confirmados ficam no PostgreSQL. Não coletar dados sensíveis desnecessários. O formulário deve explicar sua finalidade e a equipe deve definir retenção e processo de exclusão dos registros. A validação DNS identifica domínio sem rota de e-mail, mas não verifica a existência de uma caixa postal específica. O vídeo atual tem texto de apoio dos slides, mas ainda não possui faixa de legendas sincronizadas (CC).

## Documentação relacionada

- `docs/escopo.md`: objetivos, páginas, tecnologias e arquitetura atual.
- `docs/diario_de_bordo.md`: evolução e uso de IA.
- `docs/testes.md`: matriz de testes e resultados conhecidos.
- `docs/acessibilidade.md`: recursos e limites de acessibilidade.
- `docs/hospedagem.md`: pesquisa de hospedagem/domínio e ambiente escolhido.
- `docs/integracao-confirmacao-email.md`: fluxo de confirmação.
- `docs/publicacao-github-pages.md`: publicação e variáveis de ambiente.
- `docs/melhorias-entrega-final.md`: principais melhorias desde o MVP.

## Antes da entrega acadêmica

1. Rodar W3C Nu Validator nas dez páginas HTML atuais e guardar evidências atualizadas.
2. Concluir testes com teclado (incluindo setas, Tab, Shift+Tab e Enter) e demonstrar LocalStorage.
3. Atualizar o diário com decisões reais e divisão efetiva do trabalho.
4. Garantir commits de todos os integrantes e pelo menos uma branch com Pull Request.
5. Gerar o ZIP com exatamente a versão publicada, sem `.env`, `node_modules`, dados pessoais, `.git` ou arquivos temporários.
6. Preparar os 14 slides (fonte mínima de 20 pt) e ensaiar 10 min de slides + 5 min de demonstração + 5 min de perguntas.
