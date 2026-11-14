# Testes: procedimentos, resultados e pendências

## Atualização funcional — 14/11/2026

Foram implementados após a revisão anterior:

- **Validação JavaScript:** o formulário usa `preventDefault()`, verifica os campos com a API de validade HTML, mostra mensagens específicas, aplica borda de erro e leva o foco ao primeiro campo inválido.
- **LocalStorage:** o rascunho é salvo durante o preenchimento e restaurado quando a página é aberta novamente no mesmo navegador. O botão de limpeza remove os dados locais. A página informa claramente que os dados não são enviados a servidor nem por e-mail.
- **Navegação por setas:** com foco em um link do menu principal, `←`, `→`, `↑` e `↓` movem o foco entre os links. `Enter`, `Tab` e `Shift+Tab` continuam disponíveis.

**Validação HTML concluída:** as 10 páginas principais e a página auxiliar `confirmar-email.html` foram verificadas pelo W3C Markup Validator. Todas apresentaram **0 erros e 0 avisos**.

Os testes interativos em navegador ainda precisam ser concluídos conforme a lista abaixo. A validação HTML, por si só, não comprova o funcionamento de todas as funcionalidades.

## Validação HTML — W3C Markup Validator

| Página | Resultado |
|---|---|
| `index.html` | 0 erros e 0 avisos |
| `sobre.html` | 0 erros e 0 avisos |
| `projetos.html` | 0 erros e 0 avisos |
| `impacto.html` | 0 erros e 0 avisos |
| `acessibilidade.html` | 0 erros e 0 avisos |
| `contato.html` | 0 erros e 0 avisos |
| `galeria.html` | 0 erros e 0 avisos |
| `midia.html` | 0 erros e 0 avisos |
| `noticias.html` | 0 erros e 0 avisos |
| `orcamento_hospedagem.html` | 0 erros e 0 avisos |
| `confirmar-email.html` | 0 erros e 0 avisos |

**Resultado geral:** 11 documentos HTML validados, sem erros ou avisos.

## Roteiro de testes da versão atualizada

| Funcionalidade | Procedimento | Resultado esperado | Status |
|---|---|---|---|
| Validação vazia | Em `contato.html`, clique em “Validar e salvar rascunho” sem preencher | Mensagem geral, mensagens nos campos obrigatórios, bordas em destaque e foco no primeiro erro | Pendente de teste em navegador |
| E-mail | Informe `abc` e tente validar | Mensagem de e-mail inválido e borda destacada | Pendente de teste em navegador |
| Telefone | Informe letras ou número fora do padrão | Mensagem com o formato esperado | Pendente de teste em navegador |
| Validação correta | Preencha os campos obrigatórios corretamente e aceite o aviso | Confirmação de validação e rascunho salvo localmente | Pendente de teste em navegador |
| LocalStorage | Preencha parte do formulário, recarregue a página | Os campos preenchidos são recuperados | Pendente de teste em navegador |
| Limpeza | Clique em “Limpar campos e rascunho”, recarregue | Campos vazios e rascunho removido | Pendente de teste em navegador |
| Setas | Use `Tab` até o menu e teste as quatro setas | O foco se move entre os links do menu na direção indicada, com foco visível | Pendente de teste em navegador |
| Navegação convencional | Teste `Tab`, `Shift+Tab` e `Enter` | Navegação convencional continua funcionando | Pendente de teste em navegador |

## Histórico da revisão anterior — 03/11/2026
