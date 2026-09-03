# API de Gestão de Estoque

API RESTful para gerenciamento de produtos, categorias e movimentações de estoque.

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose
- Zod (validação)

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados
- **OU** Node.js 20+ e PostgreSQL 16+ para execução local

## Execução com Docker (recomendado)

```bash
# Subir banco + API
docker-compose up --build -d

# Verificar logs
docker-compose logs -f api

# Parar tudo
docker-compose down
```

A API estará disponível em: **http://localhost:3000**

## Execução local (sem Docker)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Subir apenas o PostgreSQL (ou usar instância local)
docker-compose up db -d

# 4. Rodar migrations
npx prisma migrate deploy

# 5. Iniciar em modo desenvolvimento
npm run dev
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/categorias` | Criar categoria |
| GET | `/categorias` | Listar categorias |
| GET | `/categorias/:id` | Buscar categoria |
| PUT | `/categorias/:id` | Atualizar categoria |
| DELETE | `/categorias/:id` | Deletar categoria |
| POST | `/produtos` | Criar produto |
| GET | `/produtos?page=1&limit=10` | Listar produtos (paginado) |
| GET | `/produtos/:id` | Buscar produto |
| PUT | `/produtos/:id` | Atualizar produto |
| DELETE | `/produtos/:id` | Deletar produto |
| POST | `/movimentacoes` | Registrar entrada/saída |
| GET | `/movimentacoes` | Listar movimentações |
| GET | `/produtos/:id/movimentacoes` | Histórico por produto |
| DELETE | `/movimentacoes/:id` | Cancelar movimentação |
| GET | `/health` | Health check |

## Coleção Postman

Importe o arquivo `postman/Gestao-Estoque.postman_collection.json` no Postman ou Insomnia.

## Documentação adicional

- `README-EDUCATIVO.md` — Tutorial completo e didático do projeto
- `RELATORIO.md` — Decisões de arquitetura e modelagem

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento com hot-reload |
| `npm run build` | Compila TypeScript |
| `npm start` | Produção |
| `npm run prisma:studio` | Interface visual do banco |
