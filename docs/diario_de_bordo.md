# Diário de bordo — ReTech

> Atualizar esta tabela com os responsáveis reais e eventuais reuniões. Não atribuir trabalho a um integrante sem confirmação dele.

| Data | Registro | Evidência | Responsável |
|---|---|---|---|
| 22/09/2026 | Escopo e estrutura inicial do projeto acadêmico | `docs/escopo.md`, páginas e histórico do projeto | Equipe EcoTech — confirmar responsáveis |
| 14–15/10/2026 | Pesquisa de fontes, notícias, preços de hospedagem/domínio e revisão de conteúdo | `docs/fontes.md`, `docs/hospedagem.md` | Equipe — preencher nomes |
| 20/10/2026 | Produção/integração do vídeo narrado | `assets/media/` | Equipe — preencher nome |
| 03/11/2026 | Revisões de conteúdo, página de mídia, barra de acessibilidade e ajustes de responsividade | `docs/testes.md`, `docs/acessibilidade.md`, capturas em `docs/evidencias/` | Equipe — preencher nomes |
| 12/11/2026 | Implementação da validação JS, rascunho LocalStorage e navegação direcional no menu | `js/contato.js`, `js/menu.js`, `docs/melhorias-entrega-final.md` | Equipe — preencher nomes |
| 13/11/2026 | Integração da API Node/Express, configuração do Resend, domínio remetente e publicação do front-end e da API | `server/src/server.js`, `js/api-config.js`, `docs/publicacao-github-pages.md` | Equipe — preencher nomes |
| 13/11/2026 | Migração do armazenamento do servidor para PostgreSQL | `server/src/server.js`, `server/package.json`, histórico de commits `c763931` | Equipe — preencher nomes |
| 14/11/2026 | Verificação DNS para domínio de e-mail, com bloqueio de domínios sem rota e Null MX | `server/src/server.js`, commits `e60883c`, `7417ffc`, `400a6ca` | Equipe — preencher nomes |
| 14/11/2026 | Teste em produção: domínio HTTPS, envio para endereço válido, confirmação pelo link e rejeição de domínio fictício sem rota | Testes manuais relatados pela equipe; registrar capturas sem expor dados pessoais | Equipe — preencher nomes |

## Uso de Inteligência Artificial

A equipe utilizou ChatGPT como apoio para explicação técnica, revisão e depuração. O uso deve ser apresentado como assistência, não como substituição do entendimento dos integrantes.

| Data aproximada | Prompt/objetivo (resumido) | Sugestão aproveitada | Revisão/teste realizado pela equipe |
|---|---|---|---|
| 12–14/11/2026 | Analisar o JavaScript do formulário e explicar validação, LocalStorage e envio para API | Explicação do fluxo, leitura de `preventDefault`, `checkValidity`, `setItem` e `getItem` | Código existente foi lido; testes do rascunho ainda devem ser demonstrados na apresentação |
| 13/11/2026 | Integrar confirmação de e-mail real sem expor chave no front-end | Uso de API Node/Express, Resend, token aleatório e hash no PostgreSQL | Equipe configurou o serviço, recebeu e-mail de teste e confirmou pelo link |
| 14/11/2026 | Identificar por que endereços de domínio inexistente eram aceitos | Consulta DNS MX e fallback A/AAAA, tratamento de Null MX | Equipe publicou o commit `400a6ca` e testou domínio inexistente e endereço válido |
| 14/11/2026 | Auditar requisitos acadêmicos e comparar com repositório | Matriz de status e identificação de documentação defasada, validação W3C pendente e PR ausente | Conferência do repositório, arquivos, árvore e commits; pendências listadas em `docs/testes.md` |

### Limites e decisões críticas sobre IA

- A equipe não deve apresentar código que não consiga explicar linha a linha.
- A validação DNS não é apresentada como verificação da caixa postal; apenas verifica se o domínio aparenta ter rota de e-mail.
- LocalStorage não foi tratado como banco central: os contatos confirmados ficam no PostgreSQL.
- As credenciais de Resend, banco e administrador permanecem nas variáveis de ambiente, não em arquivos públicos.
- A equipe deve acrescentar ao diário qualquer sugestão da IA que tenha sido recusada ou alterada, explicando o motivo real. Não inventar uma decisão recusada.

## Próximas ações

1. Atualizar documentação que ainda descrevia a versão estática/SQLite.
2. Validar as dez páginas com W3C e guardar relatórios da versão atual.
3. Testar todo o formulário com teclado e LocalStorage em ambiente publicado.
4. Criar branch e Pull Request; cada integrante deve registrar commits próprios e reais.
5. Definir se o painel administrativo será incluído como funcionalidade extra e implementar autenticação antes de expor dados.
