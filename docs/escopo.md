# Escopo do Projeto ReTech
**Versão atualizada em 14/11/2026**

## 1. Identificação do projeto

| Item | Informação |
|---|---|
| Projeto | ReTech — Logística Reversa de Lixo Eletrônico |
| Equipe | EcoTech |
| Disciplina | Front-End — Superior de Informática |
| Instituição | Universidade Cidade de São Paulo (UNICID) |
| Professor | Prof. Paulo Fratta |

### Integrantes

- Pedro Henrique de Oliveira Medeiros — 47656247
- Davi Cabral Paixão — 47752980
- Lucas dos Santos Vicente Braga — 47901624
- Laura Moreti — 47746301
- Pietro Tavares — 47658649
- Rodrigo Seriaco Lovato — 48117722

O ReTech é um projeto acadêmico e educativo desenvolvido com o objetivo de informar e conscientizar sobre a logística reversa de resíduos eletroeletrônicos.

O projeto não constitui uma ONG, não realiza operações próprias de coleta e não mantém parcerias operacionais. As iniciativas apresentadas como propostas do ReTech são de caráter educativo e não devem ser interpretadas como ações já executadas.

## 2. Problema, justificativa e público-alvo

O descarte inadequado de equipamentos eletroeletrônicos representa um problema ambiental e social, principalmente devido à presença de materiais potencialmente perigosos e ao desperdício de componentes que poderiam ser reutilizados ou reciclados.

O site apresenta informações sobre os impactos desse descarte e orientações sobre redução, reutilização, reciclagem e destinação ambientalmente adequada.

O público-alvo compreende:

- Estudantes e instituições de ensino;
- Consumidores de equipamentos eletrônicos;
- Empresas e comerciantes;
- Pessoas interessadas em sustentabilidade e preservação ambiental.

Os dados estatísticos, informações legais e notícias devem apresentar fontes e anos de referência, permitindo a identificação e a consulta dos materiais utilizados.

## 3. Objetivo geral

Desenvolver um site educativo e informativo sobre logística reversa de lixo eletrônico, apresentando seus impactos ambientais e sociais e incentivando práticas responsáveis de descarte, reutilização e reaproveitamento de equipamentos eletroeletrônicos.

## 4. Estrutura das páginas

O projeto possui dez páginas principais:

| Página | Arquivo | Descrição |
|---|---|---|
| Início | `index.html` | Apresentação do tema e navegação principal. |
| Sobre | `sobre.html` | Contextualização do projeto, missão, visão, valores e equipe. |
| Projetos | `projetos.html` | Propostas educativas do ReTech e apresentação de iniciativas de terceiros. |
| Impacto | `impacto.html` | Dados, tabelas, informações e impactos relacionados ao lixo eletrônico. |
| Acessibilidade | `acessibilidade.html` | Recursos de acessibilidade digital disponíveis no site. |
| Galeria | `galeria.html` | Imagens, legendas e respectivas fontes. |
| Mídia | `midia.html` | Conteúdos audiovisuais, áudio e mapa incorporado. |
| Notícias | `noticias.html` | Notícias relacionadas ao tema e links para as fontes originais. |
| Contato | `contato.html` | Formulário de contato com validação e confirmação por e-mail. |
| Orçamento de hospedagem | `orcamento_hospedagem.html` | Comparação de opções de hospedagem e domínio. |

A página `confirmar-email.html` é uma página auxiliar utilizada no processo de confirmação de endereço de e-mail. Ela não substitui nenhuma das dez páginas principais.

## 5. Funcionalidades implementadas

### 5.1 Navegação e acessibilidade

- Menu de navegação compartilhado entre as páginas;
- Menu responsivo para dispositivos móveis;
- Identificação da página atualmente acessada;
- Link para pular diretamente ao conteúdo principal;
- Barra de acessibilidade com controles de aumento e diminuição de fonte;
- Recurso de leitura em voz alta utilizando a funcionalidade disponível no navegador;
- Navegação direcional entre os links do menu por meio das teclas de seta, preservando a navegação convencional com Tab, Shift + Tab e Enter.

### 5.2 Conteúdo multimídia

- Vídeo incorporado;
- Conteúdo em áudio;
- Mapa incorporado por meio de iframe;
- Galeria de imagens com legendas e referências.

### 5.3 Formulário de contato

O formulário possui validação no navegador e no servidor.

No front-end, são utilizados recursos como:

- `preventDefault()`;
- `checkValidity()`;
- Verificação dos campos obrigatórios;
- Mensagens específicas para campos inválidos;
- Destaque visual dos campos com erro;
- Direcionamento do foco para o primeiro campo inválido.

Após a validação no navegador, os dados são encaminhados à API para uma nova verificação no servidor.

### 5.4 Armazenamento e confirmação

- Salvamento automático de rascunhos utilizando LocalStorage;
- Recuperação dos dados salvos no navegador;
- Integração com serviço de envio de e-mails;
- Processo de confirmação de endereço de e-mail;
- Armazenamento centralizado dos contatos confirmados em banco PostgreSQL.

### 5.5 Verificação de domínio de e-mail

A API verifica a configuração DNS do domínio informado, consultando registros MX e, como alternativa, registros A e AAAA.

Domínios com Null MX ou sem uma rota DNS válida para recebimento são bloqueados antes da geração da confirmação.

Essa verificação avalia a configuração do domínio, mas não garante antecipadamente a existência de uma caixa postal específica.

## 6. Arquitetura e tecnologias utilizadas

O projeto utiliza uma arquitetura composta por front-end estático, API independente e banco de dados centralizado.

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Estrutura | HTML5 | Organização semântica das páginas. |
| Estilização | CSS3 | Identidade visual e responsividade. |
| Interatividade | JavaScript | Validações, navegação e manipulação do DOM. |
| Hospedagem do front-end | GitHub Pages | Publicação das páginas estáticas. |
| Domínio | `www.retech.tec.br` | Endereço público do projeto. |
| Back-end | Node.js 20+ e Express | Processamento das requisições da API. |
| Segurança | Helmet e express-rate-limit | Cabeçalhos de segurança e limitação de requisições. |
| Envio de e-mail | Resend | Envio das mensagens de confirmação. |
| Banco de dados | PostgreSQL | Armazenamento central dos contatos. |
| Acesso ao banco | Biblioteca `pg` | Comunicação entre a API e o PostgreSQL. |
| Hospedagem da API | Render | Disponibilização do back-end. |

### Endereços de publicação

**Site:** https://www.retech.tec.br

**API:** https://retech-api-xxb7.onrender.com

O arquivo `js/api-config.js` contém a configuração pública de endereço da API. Credenciais, chaves privadas e demais informações sensíveis devem permanecer nas variáveis de ambiente do servidor.

## 7. Persistência dos dados

O projeto utiliza dois mecanismos distintos de armazenamento.

### 7.1 LocalStorage

O LocalStorage é utilizado para conservar rascunhos e preferências no navegador do usuário.

Essas informações ficam armazenadas localmente no dispositivo e não representam um banco de dados centralizado.

### 7.2 PostgreSQL

O PostgreSQL é utilizado para armazenar os contatos que concluíram o processo de confirmação por e-mail.

A estrutura contempla:

- `pending_confirmations`: armazenamento temporário dos dados pendentes e do hash do token de confirmação;
- `confirmed_contacts`: armazenamento dos contatos após a confirmação.

O token original não deve ser armazenado em texto puro no banco de dados. O fluxo utiliza hash SHA-256 para armazenar sua representação protegida.

A persistência após reinicialização ou novo deploy deve ser verificada diretamente no banco de dados.

## 8. Segurança e limitações atuais

Foram implementadas medidas de segurança para proteger as operações realizadas pela API.

Entre elas:

- Limitação de requisições nas rotas de envio, confirmação e administração;
- Validação dos dados recebidos no servidor;
- Utilização de tokens aleatórios de confirmação;
- Armazenamento do hash do token;
- Prazo de validade de 30 minutos para a confirmação;
- Uso único do token no fluxo de confirmação;
- Utilização de variáveis de ambiente para informações sensíveis;
- Proteção da rota administrativa por chave de acesso.

### 8.1 Administração dos contatos

Existe uma rota administrativa de listagem de contatos protegida pela variável `ADMIN_API_KEY`, recebida pelo cabeçalho `X-Admin-Key`.

Entretanto, o projeto ainda não possui painel administrativo visual com tela de login e gerenciamento por sessão.

A administração está disponível somente por meio do endpoint protegido da API.

### 8.2 Confirmação por e-mail

Atualmente, a abertura do link de confirmação aciona uma rota GET que conclui a confirmação.

Como melhoria futura, recomenda-se apresentar uma página intermediária com uma ação explícita do usuário e concluir a operação por POST. Isso reduz o risco de confirmações automáticas realizadas por ferramentas de verificação de links presentes em serviços de e-mail.

### 8.3 Limitações da verificação DNS

A consulta DNS permite identificar se o domínio possui configuração compatível com o recebimento de e-mails.

Entretanto, ela não comprova que a caixa postal informada existe ou está ativa. A confirmação efetiva depende do processo de envio e da resposta do serviço de e-mail.

### 8.4 Privacidade e retenção

Antes de utilizar o sistema em um ambiente real, fora da demonstração acadêmica, será necessário definir políticas de retenção, exclusão e tratamento dos dados pessoais armazenados.

## 9. Critérios de aceitação e situação atual

A tabela apresenta o estado do projeto em 14/11/2026, diferenciando funcionalidades implementadas, testes realizados e atividades ainda pendentes.

| Critério | Situação em 14/11/2026 |
|---|---|
| Dez páginas principais | Estrutura existente; revisão final da navegação publicada pendente. |
| HTML semântico, `lang="pt-BR"`, atributos alt e ARIA | Implementados conforme inspeção do código; validação W3C atual pendente. |
| CSS responsivo e identidade visual | Implementados; funcionamento em dispositivo móvel confirmado pelo usuário. |
| Indicadores de foco e navegação | Implementados; revisão final de acessibilidade pendente. |
| Validação JavaScript do formulário | Implementada; demonstração final no site publicado pendente. |
| LocalStorage | Implementado para rascunhos; demonstração de persistência e limpeza pendente. |
| Limpeza do LocalStorage após envio | Revisão do comportamento após envio bem-sucedido pendente. |
| Manipulação do DOM por eventos | Implementada em funcionalidades de navegação e acessibilidade. |
| Vídeo, áudio e iframe | Implementados; faixa CC sincronizada para o vídeo ainda pendente. |
| Publicação com HTTPS | Site publicado em `https://www.retech.tec.br`; abertura confirmada pelo usuário. |
| Envio real de e-mail | Testado pelo usuário com envio e link de confirmação. |
| Bloqueio de domínio sem rota de e-mail | Testado pelo usuário com domínio fictício inexistente. |
| Banco de dados PostgreSQL | Configurado; teste de persistência após reinício ou redeploy pendente. |
| API no Render | Publicada e operacional durante os testes realizados. |
| Painel administrativo visual | Pendente; existe somente endpoint de listagem protegido por chave. |
| Validação W3C das dez páginas | Pendente de execução e registro das evidências atualizadas. |
| Branch e Pull Request | Branch `finalizacao-retech` criada para a finalização; Pull Request para `main` pendente. |
| Commits de todos os integrantes | Pendente de conferência e comprovação no histórico do GitHub. |
| Documentação do projeto | Documentação de `/docs` atualizada; revisão final de consistência pendente. |

## 10. Entrega e demonstração

Para a entrega acadêmica, devem ser organizados os seguintes materiais:

1. Site publicado e acessível pelo domínio oficial;
2. Repositório GitHub com o código-fonte atualizado;
3. Documentação técnica atualizada na pasta `/docs`;
4. Evidências de validação e testes realizados;
5. Comprovação das contribuições dos integrantes;
6. Pull Request da branch de finalização para a branch principal;
7. Arquivo compactado com os materiais exigidos pelo professor;
8. Apresentação do projeto e demonstração das principais funcionalidades.

A demonstração deve contemplar a navegação entre as páginas, a responsividade, os recursos de acessibilidade, a validação do formulário, o envio e a confirmação de e-mail e a arquitetura utilizada.

## 11. Melhorias futuras

As seguintes melhorias podem ser consideradas para versões posteriores:

- Desenvolvimento de painel administrativo visual;
- Implementação de confirmação por POST com ação explícita do usuário;
- Integração de notificações de devolução de e-mail;
- Definição de políticas de retenção e exclusão de dados;
- Ampliação dos testes automatizados;
- Validação contínua de acessibilidade e conformidade com padrões W3C;
- Implementação de faixa de legendas sincronizadas no vídeo.

Essas melhorias não devem ser apresentadas como funcionalidades já concluídas.

## 12. Considerações finais

O ReTech foi desenvolvido como uma solução acadêmica que reúne conteúdo educativo, recursos de acessibilidade, interatividade e integração com serviços de back-end.

A implementação evoluiu de um site estático para uma aplicação com API própria, envio real de e-mails e armazenamento centralizado em PostgreSQL.

O escopo documenta tanto as funcionalidades implementadas quanto as limitações e atividades pendentes, mantendo transparência sobre o estado atual do projeto e estabelecendo uma referência para sua entrega e evolução.
