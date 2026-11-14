# Escopo do projeto ReTech — versão atualizada em 14/11/2026

## 1. Identificação

| Item | Informação |
|---|---|
| Projeto | ReTech — logística reversa de lixo eletrônico |
| Equipe | EcoTech |
| Disciplina | Front-End, Superior de Informática, UNICID |
| Professor | Prof. Paulo Fratta |
| Integrantes | Pedro Henrique de Oliveira Medeiros (47656247); Davi Cabral Paixão (47752980); Lucas dos Santos Vicente Braga (47901624); Laura Moreti (47746301); Pietro Tavares (47658649); Rodrigo Seriaco Lovato (48117722) |

O ReTech é um protótipo acadêmico e educativo. Não é uma ONG formal, não opera coleta e não mantém parceria operacional. As propostas próprias são apresentadas como propostas, não como ações já executadas.

## 2. Problema, justificativa e público

O site explica os impactos do descarte inadequado de equipamentos eletroeletrônicos e apresenta caminhos de redução, reutilização, reciclagem e destinação correta. O público inclui estudantes, consumidores, empresas, comerciantes e instituições de ensino. O conteúdo deve manter fontes e ano de referência para números e notícias.

## 3. Objetivo geral

Informar e conscientizar sobre a logística reversa de lixo eletrônico, seus impactos ambientais e sociais e os caminhos para o descarte e reaproveitamento adequados.

## 4. Páginas

1. `index.html` — apresentação do tema e navegação principal.
2. `sobre.html` — contexto, missão, visão, valores e equipe.
3. `projetos.html` — propostas educativas do ReTech e iniciativas de terceiros.
4. `impacto.html` — dados, tabelas, impactos e fontes.
5. `acessibilidade.html` — recursos de acessibilidade digital.
6. `galeria.html` — imagens, legendas e fontes.
7. `midia.html` — vídeo, áudio e iframe de mapa.
8. `noticias.html` — notícias e links para as fontes originais.
9. `contato.html` — formulário de contato com validação JS e envio para confirmação por e-mail.
10. `orcamento_hospedagem.html` — comparação de opções de hospedagem e domínio.

`confirmar-email.html` é uma página auxiliar para o fluxo de confirmação e não substitui nenhuma das dez páginas principais.

## 5. Funcionalidades implementadas

- Menu comum, menu responsivo, estado da página atual e link para pular ao conteúdo.
- Barra A−/A+ e leitura em voz alta pelo navegador.
- Navegação direcional do foco entre links do menu por setas, sem retirar o suporte a Tab/Shift+Tab/Enter.
- Vídeo, áudio e iframe na página de mídia.
- Formulário com validação JavaScript (`preventDefault`, `checkValidity`, mensagens por campo, borda de erro, foco no primeiro campo inválido) e validação repetida no servidor.
- Rascunho automático no LocalStorage do navegador.
- API Node/Express no Render, Resend para envio real de e-mail e PostgreSQL para armazenamento central dos contatos confirmados.
- Verificação DNS do domínio de e-mail (MX e, como fallback, A/AAAA), bloqueando domínios sem rota e Null MX.
- Tokens aleatórios de confirmação com hash SHA-256 armazenado no banco, validade de 30 minutos e uso único pelo fluxo atual.

## 6. Arquitetura e tecnologias

- Front-end estático: HTML5, CSS3 e JavaScript puro; GitHub Pages.
- Domínio público: `https://www.retech.tec.br`.
- Back-end: Node.js 20+, Express, Helmet, express-rate-limit, Resend e `pg`.
- API: `https://retech-api-xxb7.onrender.com`.
- Banco central: PostgreSQL via `DATABASE_URL`.
- Configuração pública do front-end: `js/api-config.js` contém apenas a URL da API, nunca credenciais.

## 7. Persistência

O LocalStorage conserva rascunhos e preferências no navegador individual. Os contatos oficiais só são inseridos na tabela `confirmed_contacts` do PostgreSQL depois da confirmação por e-mail. A tabela `pending_confirmations` guarda os dados pendentes e o hash do token. A persistência deve ser verificada novamente no banco após reinício/redeploy.

## 8. Segurança e limites atuais

- As rotas de envio, confirmação e administração possuem rate limit.
- A rota administrativa existente usa `ADMIN_API_KEY` recebida pelo cabeçalho `X-Admin-Key`; a chave deve permanecer no servidor.
- **Ainda não existe painel HTML com login e sessão.** O endpoint de listagem existe, mas a interface administrativa é pendente.
- O link de confirmação atualmente aciona uma rota GET que conclui a confirmação ao abrir o link. A evolução recomendada é exibir uma ação explícita e concluir por POST para reduzir risco de confirmação automática por scanners de e-mail.
- A verificação DNS não confirma se a caixa postal existe; isso só pode ser avaliado por entrega/devolução do provedor, sem garantia antecipada.
- Definir prazo de retenção e procedimento de exclusão de dados antes de uso real fora da demonstração acadêmica.

## 9. Critérios de aceitação e pendências

| Critério | Estado em 14/11/2026 |
|---|---|
| 10 páginas principais interligadas | Estrutura encontrada no repositório; fazer revisão final de navegação online |
| HTML semântico, `lang="pt-BR"`, alt e ARIA | Implementado em inspeção de código; validação W3C atual ainda pendente |
| CSS responsivo, identidade visual, foco e transições | Implementado; usuário confirmou teste no celular |
| Validação JavaScript e mensagens | Implementado; realizar demonstração final no site publicado |
| LocalStorage | Implementado para rascunho; demonstrar persistência e limpeza; revisar limpeza após envio bem-sucedido |
| Interação DOM por evento | Implementado em menu e barra de acessibilidade |
| Vídeo, áudio e iframe | Implementados; vídeo ainda sem faixa CC sincronizada |
| Deploy HTTPS | Publicado em `www.retech.tec.br`; usuário confirmou abertura |
| E-mail real | Testado pelo usuário com envio e link de confirmação |
| Bloqueio de domínio sem rota de e-mail | Testado pelo usuário com domínio fictício inexistente |
| PostgreSQL central | Configurado; confirmar persistência após reinício/redeploy |
| Painel visual administrativo | Pendente; há apenas rota de API protegida por chave |
| W3C nas dez páginas | Pendente na versão atual |
| Branch e Pull Request | Pendente; no momento da auditoria somente `main` foi encontrada e não havia PR |
| Commits de todos os integrantes | Pendente de comprovação no histórico |
| Documentação /docs | Existe, mas versões antigas precisam ser substituídas pela documentação atualizada |

