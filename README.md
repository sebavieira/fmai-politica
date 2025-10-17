# FMAI Política

Este repositório agrupa dois serviços principais utilizados no projeto FMAI:

- `baileys-api/`: API em Node.js/Bun responsável pela integração com o WhatsApp via Baileys.
- `chatwoot/`: Plataforma de atendimento adaptada para o projeto.

## Como está organizado

- Cada serviço mantém a mesma estrutura original.
- Arquivos sensíveis (`.env`) continuam fora do controle de versão. Copie os arquivos `*.env.example` para `.env` e ajuste conforme necessário antes de executar.

## Docker Compose

Um `docker-compose.yml` na raiz orquestra os contêineres necessários para os dois serviços.

```bash
docker compose up --build
```

> **Importante:** o Chatwoot depende de Postgres e Redis. As credenciais padrão são apenas para desenvolvimento; ajuste as variáveis em `chatwoot/.env` antes de subir em produção.

## GitHub Actions

O workflow em `.github/workflows/docker.yml` cria imagens Docker para cada serviço e publica automaticamente no GitHub Container Registry (`ghcr.io`). Configure as permissões de `GITHUB_TOKEN` com acesso de escrita em pacotes caso utilize Portainer ou outra plataforma para fazer pull das imagens.

### Tags publicadas

- `ghcr.io/<namespace>/baileys-api:latest`
- `ghcr.io/<namespace>/baileys-api:sha-<commit>`
- `ghcr.io/<namespace>/chatwoot:latest`
- `ghcr.io/<namespace>/chatwoot:sha-<commit>`

Cada push na rama `main` gera as versões `latest` e `sha-xxxxxxx`; você também pode disparar builds manualmente via *workflow dispatch*.

### Permissões do GHCR

- Em *Settings → Actions → General*, habilite `Workflow permissions → Read and write permissions` para que o `GITHUB_TOKEN` consiga publicar pacotes.
- Sem token externo, as imagens são publicadas sob `ghcr.io/<owner>/<repo>/<serviço>`, o que funciona com o `GITHUB_TOKEN` padrão.
- Se você precisa de um namespace mais curto (por exemplo, `ghcr.io/sebavieira/chatwoot`), gere um token pessoal com `write:packages`, salve-o como `GHCR_TOKEN` (e o usuário em `GHCR_USERNAME` se necessário); o workflow passará a usar esse namespace automaticamente.
- Se o pacote já existir, lembre-se de conceder acesso ao repositório em *Packages → Settings*.
