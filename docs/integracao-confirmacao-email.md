# Integração de confirmação de e-mail — ReTech

## 1. Objetivo

A integração permite que os contatos enviados pelo formulário do ReTech passem por um processo de confirmação de endereço de e-mail antes de serem registrados como contatos confirmados.

O sistema utiliza uma API própria, um serviço de envio de e-mails e um banco de dados PostgreSQL.

## 2. Tecnologias utilizadas

- **Front-end:** HTML, CSS e JavaScript.
- **Back-end:** Node.js e Express.
- **Hospedagem da API:** Render.
- **Banco de dados:** PostgreSQL.
- **Serviço de e-mail:** Resend.
- **Repositório:** GitHub.
- **Domínio:** www.retech.tec.br.

## 3. Funcionamento da integração

1. O usuário preenche o formulário de contato no site.
2. O navegador realiza as validações dos campos.
3. Os dados são enviados à API por meio de uma requisição HTTP.
4. O servidor realiza novas validações, incluindo a verificação da configuração DNS do domínio do endereço informado.
5. Quando as validações são aprovadas, o sistema inicia o processo de confirmação e utiliza o Resend para enviar o e-mail.
6. O usuário acessa o link recebido para confirmar o endereço.
7. Após a confirmação válida, os dados são registrados como contato confirmado no banco de dados PostgreSQL.

**Observação:** a validação DNS verifica a configuração do domínio para recebimento de e-mails, mas não garante que uma caixa postal específica exista.

## 4. Configuração e publicação

A aplicação utiliza variáveis de ambiente para armazenar configurações e credenciais necessárias ao funcionamento do serviço.

Entre as configurações utilizadas estão:

- `RESEND_API_KEY`: chave de acesso ao Resend.
- `RESEND_FROM`: endereço remetente configurado no serviço de e-mail.
- `PUBLIC_BASE_URL`: endereço público utilizado na geração dos links.
- `FRONTEND_ORIGIN`: origem autorizada do front-end.
- `DATABASE_URL`: conexão com o banco de dados PostgreSQL.
- `ADMIN_API_KEY`: chave de proteção da rota administrativa.

As credenciais devem permanecer exclusivamente no ambiente do servidor, sem serem inseridas nos arquivos públicos do front-end ou no repositório.

## 5. Segurança e privacidade

A integração utiliza medidas para proteger o processo de confirmação:

- Credenciais armazenadas em variáveis de ambiente.
- Validação dos dados no navegador e no servidor.
- Verificação DNS do domínio informado.
- Limitação de tentativas nas rotas da API.
- Proteção das rotas administrativas por chave de acesso.
- Registro dos contatos confirmados no banco de dados.
- Separação entre o front-end público e o back-end.

A confirmação demonstra acesso ao endereço de e-mail utilizado no processo, mas não comprova a identidade civil do usuário.

## 6. Publicação e situação atual

O projeto está publicado com domínio personalizado:

**https://www.retech.tec.br**

O front-end está hospedado no GitHub Pages, enquanto a API está implantada no Render. O banco de dados utilizado é PostgreSQL, e o envio de mensagens de confirmação utiliza o Resend.

A integração foi configurada para funcionar no ambiente publicado, utilizando as credenciais e configurações necessárias no servidor.

## 7. Melhorias futuras

- Implementar e validar notificações de falha ou devolução de e-mails por meio de webhooks do Resend.
- Aprimorar os registros de auditoria sem armazenar informações pessoais desnecessárias.
- Desenvolver uma interface administrativa para consulta dos contatos confirmados.
- Ampliar os testes de segurança, funcionamento e compatibilidade entre navegadores.
