# Testes e validação do projeto ReTech

**Data da atualização:** 14/11/2026  
**Projeto:** ReTech — Logística reversa de lixo eletrônico  
**Equipe:** EcoTech  
**Instituição:** UNICID

## 1. Validação HTML

As páginas principais foram verificadas no W3C Markup Validator.

- index.html
- sobre.html
- projetos.html
- impacto.html
- acessibilidade.html
- contato.html
- galeria.html
- midia.html
- noticias.html
- orcamento_hospedagem.html
- confirmar-email.html

**Resultado:** todas as páginas apresentaram zero erros e zero avisos na validação realizada.

## 2. Validação CSS

A folha de estilos foi submetida ao W3C CSS Validator.

**Resultado:** nenhuma ocorrência de erro na validação realizada.

## 3. Testes funcionais

Foram realizados testes no formulário de contato:

- Validação de campos obrigatórios.
- Identificação de endereço de e-mail inválido.
- Aceitação de dados válidos.
- Exibição de mensagens de validação.
- Salvamento automático de rascunho com LocalStorage.
- Recuperação dos dados após atualizar a página.
- Limpeza dos campos e do rascunho.
- Navegação por teclado com Tab e Shift+Tab.
- Ativação da validação pela tecla Enter.

**Resultado:** funcionalidades verificadas e funcionando conforme esperado.

## 4. Responsividade e acessibilidade

Foram realizados testes complementares:

- Visualização em dispositivos móveis.
- Verificação de ausência de rolagem horizontal indesejada.
- Utilização dos botões em telas menores.
- Ampliação da página em até 200%.
- Navegação em modo anônimo.
- Verificação do console do navegador.

**Resultado:** comportamento adequado nos testes realizados.

## 5. API e banco de dados

A API de confirmação de e-mail foi testada.

Resultados registrados anteriormente:

- Resposta de saúde da API com status `ok`.
- Conexão com o banco de dados PostgreSQL.
- Geração e utilização de token de confirmação.
- Envio de e-mail de confirmação.
- Confirmação real de endereço de e-mail.
- Rejeição de reutilização de token.
- Funcionamento da limitação de tentativas.

**Observação:** o tempo completo de expiração do token não foi verificado manualmente.

## 6. Integração de e-mail

O serviço Resend foi utilizado para o envio de mensagens de confirmação.

**Resultado:** envio e confirmação de e-mail realizados com sucesso.

## 7. Pendências de verificação

- Concluir a verificação do tratamento de falhas no envio pelo Resend.
- Confirmar o último deploy da API no Render.
- Realizar a revisão final do funcionamento do sistema.

## 8. Conclusão

O projeto ReTech passou por testes de validação HTML e CSS, testes funcionais, verificações de responsividade, acessibilidade e integração com serviços externos.

Os resultados registrados demonstram o funcionamento das principais funcionalidades implementadas. As pendências identificadas deverão ser verificadas antes da entrega final.
