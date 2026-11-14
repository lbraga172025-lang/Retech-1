# Testes: procedimentos, resultados e pendências

## Atualização funcional — 14/11/2026

Foram implementados após a revisão anterior:

- **Validação JavaScript:** o formulário usa `preventDefault()`, verifica os campos com a API de validade HTML, mostra mensagens específicas, aplica borda de erro e leva o foco ao primeiro campo inválido.
- **LocalStorage:** o rascunho é salvo durante o preenchimento e restaurado quando a página é aberta novamente no mesmo navegador. O botão de limpeza remove os dados locais. A página informa claramente que os dados não são enviados a servidor nem por e-mail.
- **Navegação por setas:** com foco em um link do menu principal, `←`, `→`, `↑` e `↓` movem o foco entre os links. `Enter`, `Tab` e `Shift+Tab` continuam disponíveis.

**Validação HTML concluída:** as 10 páginas principais e a página auxiliar `confirmar-email.html` foram verificadas pelo W3C Markup Validator. Todas apresentaram **0 erros e 0 avisos**.

**Validação CSS concluída:** a folha de estilo foi verificada pelo W3C CSS Validator, sem erros encontrados.

Os testes interativos em navegador ainda precisam ser concluídos conforme a lista abaixo. As validações HTML e CSS, por si só, não comprovam o funcionamento de todas as funcionalidades.

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

## Validação CSS — W3C CSS Validator

| Item | Resultado |
|---|---|
| Folha de estilo do site | Nenhum erro encontrado |

**Resultado:** validação CSS concluída sem erros.

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

Os resultados abaixo pertencem à versão anterior à implementação de 12/11/2026 e não substituem os testes da versão atualizada.

| # | Teste | Status anterior | Resultado registrado |
|---|---|---|---|
| 1 | Estrutura das 10 páginas | Executado | 0 problemas no script de verificação da época |
| 2 | Links internos e arquivos locais | Executado | 0 arquivos ausentes na revisão anterior |
| 3 | Console, HTTP e responsividade | Executado | 0 erros registrados nas combinações testadas |
| 4 | Imagens | Executado | Imagens conferidas na revisão anterior |
| 5 | Vídeo | Com ressalva | Sem faixa de legendas CC |
| 6 | Áudio | Executado | Player independente, sem autoplay |
| 7 | Iframe | Com ressalva | Mapa não testado com internet |
| 8 | Formulário | Obsoleto | Antes apenas validação nativa; substituído pela validação JavaScript e LocalStorage descritos acima |
| 9 | Teclado | Parcial | Antes testado com Tab/Enter; setas do menu adicionadas nesta atualização |
| 10 | Barra de acessibilidade | Executado parcialmente | Testes anteriores descritos na documentação de acessibilidade |

## Pendências antes da entrega

1. Executar os testes interativos acima em navegador desktop e celular.
2. Repetir testes de responsividade, foco visível e zoom de 200% após as alterações.
3. Testar leitores de tela e navegação com teclado em pelo menos um navegador adicional.
4. Registrar capturas de tela reais da validação, do rascunho recuperado e da navegação pelas setas.
5. Publicar a versão final com HTTPS e confirmar todos os links.

**Observação:** a validação HTML e CSS no W3C foi concluída. As pendências acima dizem respeito aos testes funcionais, de acessibilidade e aos registros de evidências.

## Como iniciar testes locais

Na pasta raiz do projeto, execute:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/contato.html` para testar o formulário. O uso de servidor local permite verificar o comportamento de LocalStorage em uma origem HTTP estável.

## Testes funcionais — 14/11/2026

Testes realizados no formulário de contato:

- [x] Validação de campos obrigatórios.
- [x] Validação de formato de e-mail inválido.
- [x] Aceitação de e-mail válido.
- [x] Salvamento automático do rascunho no LocalStorage.
- [x] Recuperação dos dados após atualizar a página.
- [x] Persistência das últimas alterações.
- [x] Responsividade em dispositivo móvel.
- [x] Conteúdo legível com zoom de 200%.
- [x] Funcionamento em janela anônima.
- [x] Página carregada sem erros no console do navegador.

**Resultado:** todos os testes complementares foram aprovados.

- [x] Navegação por teclado com Tab.
- [x] Navegação inversa com Shift + Tab.
- [x] Ativação do botão usando Enter.
- [x] Limpeza dos campos e remoção do rascunho.

**Resultado:** todos os testes funcionais acima foram aprovados.
