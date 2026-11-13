# Diário de bordo

Registra só o que pode ser comprovado pelos arquivos do projeto. **Datas, reuniões e responsáveis que não constam aqui devem ser preenchidos pela equipe**; nada foi inventado.

| Data | Registro | Fonte da informação | Responsável |
|---|---|---|---|
| 22/09/2026 | Escopo da disciplina datado | `README.md`, `sobre.html` | a preencher |
| 14/10/2026 | Primeira consulta de fontes, notícias e preços; produção da versão anterior do vídeo | `fontes.md`, `hospedagem.md`, data dos arquivos | a preencher |
| 15/10/2026 | Reconferência de fontes e preços; primeira rodada de testes e correções (erro de HTML no iframe, rolagem horizontal, WebM) | `testes.md` anterior | a preencher |
| 20/10/2026 | Chegada do vídeo com narração integrada (`retech-logistica-reversa-narrado.mp4`) | data do arquivo | a preencher |
| 03/11/2026 | Revisão técnica: áudio MP3 independente, pôster e WebM do vídeo narrado, novos campos do formulário, seção "Como nasceu o ReTech", comparação de sustentabilidade, correção da documentação | este diário, `testes.md` | a preencher |
| 03/11/2026 | Barra de acessibilidade (A−, A+, Ler página) e correção de rolagem horizontal com texto a 200% em `index`, `contato` e `orcamento_hospedagem` | `testes.md` | a preencher |

## Divergências corrigidas em 03/11/2026

- `guia-descarte.mp3` aparecia na documentação, mas nunca existiu nos arquivos: referência removida; criado `retech-logistica-reversa-narracao.mp3` a partir do vídeo.
- Legendas `.vtt` documentadas para o vídeo atual: o arquivo é da versão anterior (56 s) e não corresponde ao vídeo de 64,7 s. Documentação corrigida.
- Créditos da narração (eSpeak NG x ElevenLabs): o vídeo em uso é creditado ao ElevenLabs pela equipe; eSpeak ficou como crédito da versão anterior, sem uso.

## Para a equipe preencher

Reuniões, divisão real de cada etapa, decisões de design e datas de entrega.


## 12/11/2026 — Melhorias para a entrega final

- Implementada validação do formulário com JavaScript, `preventDefault()`, mensagens por campo, destaque visual e foco no primeiro erro.
- Implementado salvamento automático e recuperação de rascunho com LocalStorage, incluindo ação para apagar os dados.
- Implementada navegação pelas quatro setas direcionais nos links do menu principal, preservando Tab, Shift+Tab e Enter.
- Atualizadas as orientações de privacidade do formulário: esta versão estática não envia dados por e-mail nem para servidor.
- Próxima etapa: executar testes reais em navegador, validar HTML/CSS e registrar evidências da nova versão.


### 13/11/2026 — Estrutura de confirmação de e-mail
Foi iniciada a integração real de confirmação de endereço: front-end envia solicitação à API; backend Node/Express gera token seguro, envia link pelo Resend e confirma o endereço antes de registrar a mensagem. Adicionados endpoint de envio e confirmação, página de retorno, rate limit, hash de token e persistência SQLite. Envio real pendente de configurar domínio/credenciais e hospedar API com banco persistente.


### 13/11/2026 — Preparação da publicação no GitHub Pages
- Definida a arquitetura de publicação: front-end estático no GitHub Pages e API Node.js hospedada separadamente.
- Adicionada workflow do GitHub Actions para publicar a raiz do repositório na branch `main`.
- Documentadas as configurações de `FRONTEND_ORIGIN`, `PUBLIC_BASE_URL`, `RETECH_API_URL`, Resend e armazenamento persistente.
- Publicação e testes reais ainda dependem da URL do repositório e da configuração do serviço de API/e-mail.
