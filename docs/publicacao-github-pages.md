# Publicação do ReTech — GitHub Pages, Render e domínio personalizado

## 1. Arquitetura de publicação

O projeto ReTech utiliza serviços separados para disponibilizar o site e processar suas funcionalidades de back-end.

- **GitHub Pages:** hospedagem do front-end estático, incluindo HTML, CSS, JavaScript e arquivos de mídia.
- **Render:** hospedagem da API desenvolvida em Node.js e Express.
- **PostgreSQL:** banco de dados utilizado pelo back-end.
- **Resend:** serviço responsável pelo envio dos e-mails de confirmação.
- **GitHub:** versionamento e armazenamento do código-fonte.
- **Domínio personalizado:** www.retech.tec.br.

O GitHub Pages disponibiliza os arquivos estáticos, enquanto as operações que dependem do servidor são executadas pela API hospedada no Render.

## 2. Publicação do front-end

O front-end é disponibilizado pelo GitHub Pages.

O processo utiliza o repositório GitHub do projeto e a configuração de publicação existente no próprio repositório.

Os arquivos do site incluem:

- Páginas HTML.
- Folhas de estilo CSS.
- Scripts JavaScript.
- Imagens e demais recursos da pasta de assets.

As atualizações do código são versionadas no GitHub e publicadas conforme a configuração de implantação do projeto.

## 3. Domínio personalizado e HTTPS

O site utiliza o domínio personalizado:

**https://www.retech.tec.br**

A configuração do domínio permite acessar o projeto por um endereço próprio, sem depender exclusivamente do endereço padrão do GitHub Pages.

O HTTPS protege a comunicação entre o navegador e o site por meio de uma conexão criptografada.

A emissão e a aplicação do certificado dependem da configuração correta dos registros DNS e da validação do domínio pela plataforma.

## 4. Publicação do back-end

A API do ReTech é desenvolvida com Node.js e Express e está hospedada no Render.

O servidor é responsável por:

- Receber as solicitações enviadas pelo front-end.
- Validar os dados recebidos.
- Processar as solicitações de confirmação de e-mail.
- Integrar o sistema ao Resend.
- Registrar os contatos confirmados no PostgreSQL.
- Disponibilizar rotas de consulta e administração protegidas.

A API funciona separadamente do GitHub Pages, pois a hospedagem estática não executa aplicações Node.js.

## 5. Banco de dados

O projeto utiliza PostgreSQL para persistir os dados processados pelo servidor.

A conexão com o banco é configurada por meio de variáveis de ambiente no serviço de hospedagem.

Essa separação permite que os dados sejam armazenados no banco de dados, independentemente dos arquivos estáticos publicados no GitHub Pages.

## 6. Integração de e-mail

O envio de mensagens de confirmação utiliza o Resend.

A chave privada do serviço fica armazenada nas configurações de ambiente do back-end, sem exposição no código público do navegador.

O fluxo de confirmação é processado pela API e utiliza o banco de dados para registrar os contatos após a conclusão da confirmação.

## 7. Segurança e configurações

Para manter a aplicação segura:

- Não publicar arquivos `.env` no GitHub.
- Não inserir chaves privadas no JavaScript do front-end.
- Utilizar HTTPS nas comunicações públicas.
- Manter as credenciais nas variáveis de ambiente do servidor.
- Restringir as origens autorizadas nas configurações de CORS.
- Proteger as rotas administrativas com autenticação.
- Manter o banco de dados separado dos arquivos públicos do site.

## 8. Situação da publicação

O ReTech está publicado e utiliza domínio personalizado.

A arquitetura implantada é composta por:

| Componente | Serviço utilizado | Situação |
|---|---|---|
| Front-end | GitHub Pages | Publicado |
| Domínio personalizado | retech.tec.br | Configurado |
| HTTPS | Certificado SSL | Configurado para o domínio |
| API | Render | Implantada |
| Banco de dados | PostgreSQL | Integrado |
| Envio de e-mail | Resend | Integrado |

**Endereço público:** https://www.retech.tec.br

## 9. Melhorias futuras

- Ampliar os testes de disponibilidade da API.
- Implementar monitoramento de erros e falhas de envio de e-mail.
- Melhorar os registros de auditoria e o acompanhamento das solicitações.
- Desenvolver uma interface administrativa para consulta dos contatos confirmados.
- Realizar verificações periódicas de segurança, acessibilidade e desempenho.
