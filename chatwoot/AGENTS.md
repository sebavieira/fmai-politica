# Repository Guidelines

## Project Structure & Module Organization
- `app/` contém o núcleo Rails (models, controllers, views) e `app/javascript/` abriga o front-end Vue 3/Vite.  
- Recursos enterprise ficam em `enterprise/`, carregados automaticamente quando presente.  
- Configurações globais residem em `config/`, com destaque para `config/features.yml` e `config/installation_config.yml`.  
- Testes Ruby vivem em `spec/` (RSpec) e os testes JS/Vue em `app/javascript/__tests__/` com Vitest.  
- Scripts auxiliares estão em `bin/` e `lib/tasks/`.

## Build, Test, and Development Commands
- `bundle install && pnpm install` — instala dependências Ruby e JS.  
- `bin/rails db:setup` — cria o banco, roda migrations e seeds.  
- `bin/rails s` — sobe a API/backend em modo desenvolvimento.  
- `pnpm run dev` — compila o front-end em hot reload via Vite.  
- `bundle exec rspec` — executa a suíte Ruby.  
- `pnpm run test` — executa testes de front-end (Vitest).  
- `bundle exec rubocop` e `pnpm run lint` — linters Ruby e JS.

## Coding Style & Naming Conventions
- Ruby segue padrão Ruby Style Guide com lint via Rubocop (2 espaços, snake_case para métodos/variáveis, CamelCase para classes/módulos).  
- Vue/JS utiliza ESLint + Prettier (2 espaços, camelCase em variáveis/funções, PascalCase para componentes Vue).  
- Localize strings em `app/javascript/dashboard/i18n/` e mantenha chaves consistentes.  
- Nomeie migrations com verbos no infinitivo e mantenha services em `app/services/` ou `enterprise/app/services/`.

## Testing Guidelines
- RSpec para backend; organize specs espelhando a estrutura do código (`spec/models/account_spec.rb`, etc.).  
- Use factories (`spec/factories/`) e `rails_helper`.  
- Front-end usa Vitest + Testing Library; coloque arquivos como `ComponentName.spec.js`.  
- Cobertura: priorize cenários críticos (autenticação, billing, feature flags) e garanta que testes passem antes de abrir PR.

## Commit & Pull Request Guidelines
- Commits curtos em inglês, voz imperativa (“Add SLA toggle guard”), agrupando mudanças coesas.  
- Inclua referência a issues Jira/GitHub quando aplicável (`CW-123`).  
- Pull requests devem trazer resumo claro, passos de teste, screenshots/GIFs para mudanças visuais e checklist de validação (lint/tests).  
- Solicite revisão de pelo menos um maintainer e aguarde CI verde antes do merge.
