# Tutorial Completo — API de Gestão de Estoque

> **Este documento é um guia detalhado.** Leia-o do início ao fim para entender cada parte do projeto: o que foi feito, por que foi feito, onde fica cada coisa e como rodar tudo sozinho.

---

## Índice

1. [O que é este projeto?](#1-o-que-é-este-projeto)
2. [Tecnologias utilizadas](#2-tecnologias-utilizadas)
3. [Estrutura de pastas explicada](#3-estrutura-de-pastas-explicada)
4. [Como rodar o projeto](#4-como-rodar-o-projeto)
5. [Arquitetura em camadas](#5-arquitetura-em-camadas)
6. [Fluxo de uma requisição](#6-fluxo-de-uma-requisição)
7. [Banco de dados (Prisma)](#7-banco-de-dados-prisma)
8. [Endpoints e exemplos](#8-endpoints-e-exemplos)
9. [Regras de negócio](#9-regras-de-negócio)
10. [Injeção de dependências](#10-injeção-de-dependências)
11. [Validação com Zod](#11-validação-com-zod)
12. [Tratamento de erros](#12-tratamento-de-erros)
13. [Docker explicado](#13-docker-explicado)
14. [Como testar com Postman](#14-como-testar-com-postman)
15. [Melhorias futuras](#15-melhorias-futuras)

---

## 1. O que é este projeto?

Este projeto é uma **API REST** (Application Programming Interface) que permite gerenciar o estoque de produtos de uma loja ou depósito. Com ela você pode:

- **Criar categorias** para organizar produtos (ex: "Eletrônicos", "Alimentos")
- **Cadastrar produtos** com SKU, preço e categoria
- **Registrar movimentações** de entrada (compra/recebimento) e saída (venda/perda)
- **Consultar o histórico** de todas as movimentações
- **Cancelar movimentações** revertendo o impacto no estoque

A API **não tem interface visual** — ela responde apenas com JSON. Você interage com ela via Postman, Insomnia, curl ou qualquer cliente HTTP.

---

## 2. Tecnologias utilizadas

| Tecnologia | Para que serve | Onde está no projeto |
|------------|----------------|----------------------|
| **Node.js** | Runtime JavaScript no servidor | Roda toda a aplicação |
| **TypeScript** | JavaScript com tipagem estática | Todos os arquivos em `src/` |
| **Express** | Framework HTTP (rotas, middlewares) | `src/app.ts`, `src/routes/` |
| **Prisma** | ORM — traduz código TypeScript em SQL | `prisma/schema.prisma`, `src/repositories/` |
| **PostgreSQL** | Banco de dados relacional | Container Docker `db` |
| **Zod** | Validação de dados de entrada | `src/schemas/` |
| **Docker** | Containerização da app e do banco | `Dockerfile`, `docker-compose.yml` |

### O que é um ORM?

ORM = **Object-Relational Mapping**. Em vez de escrever SQL manualmente (`SELECT * FROM produtos`), você escreve código TypeScript (`prisma.produto.findMany()`). O Prisma traduz isso para SQL automaticamente e ainda gera tipos TypeScript para você.

---

## 3. Estrutura de pastas explicada

```
api-gestao-estoque/
│
├── prisma/                          # Tudo relacionado ao banco de dados
│   ├── schema.prisma                # Definição das tabelas e relacionamentos
│   └── migrations/                  # Histórico de alterações no banco (SQL)
│
├── src/                             # Código fonte da aplicação
│   ├── config/
│   │   └── env.ts                   # Lê variáveis do .env (PORT, DATABASE_URL)
│   │
│   ├── container/
│   │   └── index.ts                 # Monta todas as dependências (DI)
│   │
│   ├── controllers/                 # Camada HTTP — recebe req, devolve res
│   │   ├── CategoriaController.ts
│   │   ├── ProdutoController.ts
│   │   └── MovimentacaoController.ts
│   │
│   ├── services/                    # Regras de negócio
│   │   ├── CategoriaService.ts
│   │   ├── ProdutoService.ts
│   │   └── MovimentacaoService.ts
│   │
│   ├── repositories/
│   │   ├── interfaces/              # Contratos (o que cada repo deve fazer)
│   │   │   ├── ICategoriaRepository.ts
│   │   │   ├── IProdutoRepository.ts
│   │   │   └── IMovimentacaoRepository.ts
│   │   └── prisma/                  # Implementações concretas com Prisma
│   │       ├── CategoriaRepository.ts
│   │       ├── ProdutoRepository.ts
│   │       └── MovimentacaoRepository.ts
│   │
│   ├── routes/                      # Mapeamento URL → Controller
│   │   ├── index.ts                 # Agrupa todas as rotas
│   │   ├── categoria.routes.ts
│   │   ├── produto.routes.ts
│   │   └── movimentacao.routes.ts
│   │
│   ├── schemas/                     # Validação Zod dos dados de entrada
│   │   ├── categoria.schema.ts
│   │   ├── produto.schema.ts
│   │   └── movimentacao.schema.ts
│   │
│   ├── middleware/                  # Funções que rodam entre req e controller
│   │   ├── validate.ts              # Valida body/params/query com Zod
│   │   └── errorHandler.ts          # Captura erros e retorna JSON
│   │
│   ├── errors/
│   │   └── AppError.ts              # Classe de erro com status HTTP
│   │
│   ├── database/
│   │   └── prisma.ts                # Instância única do Prisma Client
│   │
│   ├── app.ts                       # Configura Express (middlewares, rotas)
│   └── server.ts                    # Ponto de entrada — inicia o servidor
│
├── docker/
│   └── entrypoint.sh                # Script que roda ao iniciar o container
│
├── postman/
│   └── Gestao-Estoque.postman_collection.json  # Coleção para testes
│
├── Dockerfile                       # Receita para construir imagem da API
├── docker-compose.yml               # Orquestra API + PostgreSQL
├── package.json                     # Dependências e scripts npm
├── tsconfig.json                    # Configuração do TypeScript
├── .env.example                     # Modelo de variáveis de ambiente
├── README.md                        # Documentação resumida
├── README-EDUCATIVO.md              # Este arquivo (tutorial completo)
└── RELATORIO.md                     # Relatório de decisões técnicas
```

---

## 4. Como rodar o projeto

### Opção A: Docker (mais fácil — recomendado)

**Pré-requisito:** Docker Desktop instalado e rodando.

```bash
# 1. Entre na pasta do projeto
cd api-gestao-estoque

# 2. Suba tudo (banco + API)
docker-compose up --build -d

# 3. Aguarde ~30 segundos e teste
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{"status":"ok","timestamp":"2025-09-01T18:00:00.000Z"}
```

**Comandos úteis:**
```bash
docker-compose logs -f api    # Ver logs da API em tempo real
docker-compose down           # Parar tudo
docker-compose down -v        # Parar e APAGAR dados do banco
```

### Opção B: Local (sem Docker na API)

**Pré-requisitos:** Node.js 20+, PostgreSQL rodando.

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cp .env.example .env
# Edite o .env se seu PostgreSQL usar credenciais diferentes

# 3. Subir só o banco via Docker (ou use PostgreSQL local)
docker-compose up db -d

# 4. Gerar o Prisma Client
npx prisma generate

# 5. Criar tabelas no banco
npx prisma migrate deploy

# 6. Rodar em desenvolvimento (hot-reload)
npm run dev
```

### Scripts npm disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Desenvolvimento com recarga automática |
| `npm run build` | Compila TypeScript → JavaScript em `dist/` |
| `npm start` | Roda a versão compilada (produção) |
| `npm run prisma:studio` | Abre interface visual do banco no navegador |
| `npm run prisma:migrate:dev` | Cria nova migration em desenvolvimento |

---

## 5. Arquitetura em camadas

Imagine uma empresa com departamentos. Cada um tem uma função e não invade o trabalho do outro:

```
┌─────────────────────────────────────────────────────────┐
│  CLIENTE (Postman, Frontend, curl)                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Request
                         ▼
┌─────────────────────────────────────────────────────────┐
│  ROUTES          → "Qual URL chama qual função?"        │
├─────────────────────────────────────────────────────────┤
│  CONTROLLERS     → "Traduz HTTP para chamada de service"│
├─────────────────────────────────────────────────────────┤
│  SERVICES        → "Aplica regras de negócio"           │
├─────────────────────────────────────────────────────────┤
│  REPOSITORIES    → "Acessa o banco de dados"            │
├─────────────────────────────────────────────────────────┤
│  DATABASE        → PostgreSQL                           │
└─────────────────────────────────────────────────────────┘
```

### Por que separar em camadas?

1. **Manutenção**: Mudar o banco não afeta as regras de negócio
2. **Testes**: Pode testar o service com um repository fake
3. **Clareza**: Cada arquivo tem uma responsabilidade única
4. **Reutilização**: O mesmo service pode ser usado por REST, GraphQL, CLI, etc.

### Exemplo prático

Quando você faz `POST /produtos`:

1. **Route** (`produto.routes.ts`): Identifica que é POST `/produtos` → chama `ProdutoController.criar`
2. **Middleware** (`validate.ts`): Valida o JSON do body com Zod
3. **Controller** (`ProdutoController.ts`): Chama `produtoService.criar(req.body)`
4. **Service** (`ProdutoService.ts`): Verifica se SKU é único, se categoria existe → chama repository
5. **Repository** (`ProdutoRepository.ts`): Executa `prisma.produto.create(...)` no banco
6. Resposta sobe de volta: Repository → Service → Controller → JSON para o cliente

---

## 6. Fluxo de uma requisição

Vamos seguir passo a passo o que acontece quando você registra uma **saída de estoque**:

```
POST /movimentacoes
Body: { "tipo": "SAIDA", "quantidade": 5, "produtoId": "abc-123" }
```

```
1. Express recebe a requisição
       ↓
2. cors() e express.json() processam headers e body
       ↓
3. Route: POST /movimentacoes → MovimentacaoController.registrar
       ↓
4. Middleware validate(createMovimentacaoSchema):
   - tipo é "ENTRADA" ou "SAIDA"? ✓
   - quantidade é inteiro positivo? ✓
   - produtoId é UUID? ✓
       ↓
5. Controller chama movimentacaoService.registrar(dados)
       ↓
6. Service:
   a. Busca produto no banco → estoque atual = 10
   b. Calcula novo estoque: 10 - 5 = 5
   c. Novo estoque >= 0? ✓ (se fosse -3, lançaria AppError 400)
   d. Chama repository.createWithEstoqueUpdate(dados, 5)
       ↓
7. Repository executa TRANSAÇÃO atômica:
   a. INSERT na tabela movimentacoes
   b. UPDATE produtos SET quantidade_estoque = 5
   (Se qualquer passo falhar, AMBOS são revertidos)
       ↓
8. Controller retorna 201 + JSON da movimentação criada
```

---

## 7. Banco de dados (Prisma)

### O arquivo `prisma/schema.prisma`

Este é o "mapa" do banco. O Prisma lê este arquivo e:
- Cria as tabelas no PostgreSQL (via migrations)
- Gera um client TypeScript tipado

### As 3 entidades

#### Categoria
```prisma
model Categoria {
  id     String @id @default(uuid())  // ID automático UUID
  nome   String @unique               // Nome único
  produtos Produto[]                   // Relação: 1 categoria → N produtos
}
```

#### Produto
```prisma
model Produto {
  sku               String @unique      // Código único do produto
  quantidadeEstoque Int    @default(0)  // Sempre começa em 0
  categoria         Categoria @relation(...)  // Pertence a 1 categoria
  movimentacoes     Movimentacao[]      // Tem N movimentações
}
```

#### Movimentação
```prisma
enum TipoMovimentacao { ENTRADA SAIDA }

model Movimentacao {
  tipo      TipoMovimentacao  // ENTRADA ou SAIDA
  quantidade Int
  cancelada Boolean @default(false)  // Soft delete
  produto   Produto @relation(...)
}
```

### Migrations

Migrations são arquivos SQL versionados que alteram o banco de forma controlada.

```bash
# Em desenvolvimento, ao alterar schema.prisma:
npx prisma migrate dev --name descricao_da_mudanca

# Em produção/Docker:
npx prisma migrate deploy
```

A migration inicial está em: `prisma/migrations/20250901120000_init/migration.sql`

### Prisma Studio (interface visual)

```bash
npm run prisma:studio
# Abre http://localhost:5555 no navegador
# Você pode ver e editar dados diretamente
```

---

## 8. Endpoints e exemplos

Base URL: `http://localhost:3000`

### Categorias

#### Criar categoria
```http
POST /categorias
Content-Type: application/json

{
  "nome": "Eletrônicos"
}
```
**Resposta 201:**
```json
{
  "id": "a1b2c3d4-...",
  "nome": "Eletrônicos",
  "createdAt": "2025-09-01T18:00:00.000Z",
  "updatedAt": "2025-09-01T18:00:00.000Z"
}
```

#### Listar categorias
```http
GET /categorias
```

#### Buscar por ID
```http
GET /categorias/a1b2c3d4-...
```

#### Atualizar nome
```http
PUT /categorias/a1b2c3d4-...
Content-Type: application/json

{
  "nome": "Eletrônicos e Informática"
}
```

#### Deletar (só se não tiver produtos)
```http
DELETE /categorias/a1b2c3d4-...
```
**Resposta 204:** (sem corpo)

---

### Produtos

#### Criar produto
```http
POST /produtos
Content-Type: application/json

{
  "nome": "Mouse Gamer RGB",
  "sku": "MOUSE-001",
  "descricao": "Mouse com 7 botões",
  "preco": 149.90,
  "categoriaId": "a1b2c3d4-..."
}
```

> **Não envie** `quantidadeEstoque` — o estoque inicial é sempre 0.

**Resposta 201:**
```json
{
  "id": "x1y2z3...",
  "nome": "Mouse Gamer RGB",
  "sku": "MOUSE-001",
  "quantidadeEstoque": 0,
  "preco": "149.90",
  "categoria": { "id": "...", "nome": "Eletrônicos" }
}
```

#### Listar com paginação
```http
GET /produtos?page=1&limit=10
```

**Resposta 200:**
```json
{
  "data": [ ...array de produtos... ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### Atualizar produto
```http
PUT /produtos/x1y2z3...
Content-Type: application/json

{
  "nome": "Mouse Gamer RGB Pro",
  "preco": 199.90
}
```

> **Não envie** `quantidadeEstoque` no PUT — use movimentações.

---

### Movimentações

#### Registrar entrada (aumenta estoque)
```http
POST /movimentacoes
Content-Type: application/json

{
  "tipo": "ENTRADA",
  "quantidade": 50,
  "observacao": "Compra do fornecedor",
  "produtoId": "x1y2z3..."
}
```

#### Registrar saída (diminui estoque)
```http
POST /movimentacoes
Content-Type: application/json

{
  "tipo": "SAIDA",
  "quantidade": 10,
  "observacao": "Venda",
  "produtoId": "x1y2z3..."
}
```

> Se tentar sair mais do que tem em estoque → **400 Bad Request**

#### Listar todas
```http
GET /movimentacoes
```

#### Histórico de um produto
```http
GET /produtos/x1y2z3.../movimentacoes
```

#### Cancelar movimentação (reverte estoque)
```http
DELETE /movimentacoes/mov-id-...
```

---

## 9. Regras de negócio

| # | Regra | Onde está implementada |
|---|-------|------------------------|
| 1 | SKU deve ser único | `ProdutoService.criar()` + UNIQUE no banco |
| 2 | Estoque inicial = 0 | Default no Prisma + Zod bloqueia no POST |
| 3 | Não atualizar estoque via PUT | Zod `.strict()` em `updateProdutoSchema` |
| 4 | Saída bloqueada sem saldo | `MovimentacaoService.registrar()` |
| 5 | Movimentação atualiza estoque | `MovimentacaoRepository.createWithEstoqueUpdate()` |
| 6 | Cancelar reverte estoque | `MovimentacaoService.cancelar()` |
| 7 | Não deletar categoria com produtos | `CategoriaService.deletar()` |
| 8 | Paginação em produtos | `ProdutoRepository.findAllPaginated()` |

### Como o estoque é calculado

```
ENTRADA:  novoEstoque = estoqueAtual + quantidade
SAÍDA:    novoEstoque = estoqueAtual - quantidade

CANCELAR ENTRADA:  novoEstoque = estoqueAtual - quantidade (reverte)
CANCELAR SAÍDA:    novoEstoque = estoqueAtual + quantidade (reverte)
```

O método `calcularNovoEstoque()` em `MovimentacaoService.ts` centraliza essa lógica.

---

## 10. Injeção de dependências

Arquivo: `src/container/index.ts`

```typescript
// O container monta o grafo de dependências:

Prisma Client
    ↓
Repositories (recebem prisma)
    ↓
Services (recebem repositories)
    ↓
Controllers (recebem services)
```

**Por que interfaces?** Os services dependem de `IProdutoRepository`, não de `ProdutoRepository`. Isso significa que você pode criar um `FakeProdutoRepository` para testes sem tocar no banco real.

```typescript
// Exemplo simplificado:
class ProdutoService {
  constructor(private repo: IProdutoRepository) {}  // Interface, não classe concreta
}
```

---

## 11. Validação com Zod

Arquivos em `src/schemas/`

O Zod valida dados **antes** de chegarem ao service:

```typescript
// Exemplo: createProdutoSchema
z.object({
  nome: z.string().min(2).max(200),
  sku: z.string().min(1).toUpperCase(),
  preco: z.number().positive(),
  categoriaId: z.string().uuid(),
}).strict()  // Rejeita campos extras (como quantidadeEstoque)
```

O middleware `validate()` em `src/middleware/validate.ts` usa esses schemas:

```typescript
router.post("/", validate(createProdutoSchema), controller.criar);
//                      ↑ roda ANTES do controller
```

Se os dados forem inválidos, retorna **400** com detalhes:
```json
{
  "status": "error",
  "message": "Dados inválidos",
  "erros": [
    { "campo": "preco", "mensagem": "Preço deve ser maior que zero" }
  ]
}
```

---

## 12. Tratamento de erros

### AppError (erros de negócio)

```typescript
throw new AppError("Produto não encontrado", 404);
// → { "status": "error", "message": "Produto não encontrado" }
```

### Códigos HTTP usados

| Código | Quando |
|--------|--------|
| 200 | Sucesso (GET, PUT) |
| 201 | Criado (POST) |
| 204 | Deletado sem corpo (DELETE) |
| 400 | Dados inválidos ou regra de negócio |
| 404 | Recurso não encontrado |
| 409 | Conflito (SKU duplicado, categoria com produtos) |
| 500 | Erro interno inesperado |

O middleware `errorHandler.ts` captura TODOS os erros e formata a resposta.

---

## 13. Docker explicado

### docker-compose.yml

Define **2 serviços** que rodam juntos:

1. **db** (PostgreSQL): Banco de dados na porta 5432
2. **api** (Node.js): Aplicação na porta 3000

O `depends_on` com `healthcheck` garante que a API só inicia quando o banco está pronto.

### Dockerfile (multi-stage build)

```
Estágio 1 (builder): Instala deps → Compila TypeScript
Estágio 2 (production): Copia só o necessário → Imagem menor
```

### entrypoint.sh

Script que roda ao iniciar o container da API:
1. Aguarda o banco ficar disponível
2. Executa `prisma migrate deploy` (cria tabelas)
3. Inicia `node dist/server.js`

---

## 14. Como testar com Postman

1. Abra o Postman
2. **Import** → Selecione `postman/Gestao-Estoque.postman_collection.json`
3. Execute na ordem:
   - Health Check
   - Criar Categoria (salva o ID automaticamente)
   - Criar Produto (usa o categoriaId salvo)
   - Registrar Entrada
   - Registrar Saída
   - Listar Movimentações
   - Cancelar Movimentação

A coleção usa **variáveis** (`{{categoriaId}}`, `{{produtoId}}`) que são preenchidas automaticamente pelos scripts de teste.

### Testando com curl

```bash
# Health check
curl http://localhost:3000/health

# Criar categoria
curl -X POST http://localhost:3000/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste"}'
```

---

## 15. Melhorias futuras

Estas funcionalidades **não foram implementadas** mas podem ser adicionadas seguindo a mesma arquitetura:

### Autenticação JWT
- Criar `AuthService`, `AuthController`, middleware `authenticate`
- Proteger rotas com `router.use(authenticate)`

### Testes automatizados
```bash
npm install -D vitest @vitest/coverage-v8
# Criar src/services/__tests__/ProdutoService.test.ts
# Injetar repositories mock no service
```

### Swagger/OpenAPI
```bash
npm install swagger-ui-express swagger-jsdoc
# Documentar rotas automaticamente
```

### Filtros na listagem de produtos
- Adicionar query params `?categoriaId=...&nome=...` no `ProdutoRepository`

### Como adicionar um novo endpoint

Siga sempre esta ordem:

1. **Schema Zod** → `src/schemas/`
2. **Interface Repository** → `src/repositories/interfaces/`
3. **Implementação Repository** → `src/repositories/prisma/`
4. **Service** (regra de negócio) → `src/services/`
5. **Controller** → `src/controllers/`
6. **Route** → `src/routes/`
7. **Registrar no Container** → `src/container/index.ts`

---

## Fluxo completo de teste manual

Execute estes passos na ordem para validar tudo:

```
1. docker-compose up --build -d
2. GET  /health                          → status ok
3. POST /categorias {"nome":"Eletrônicos"} → guardar id
4. POST /produtos {nome, sku, preco, categoriaId} → estoque = 0
5. POST /movimentacoes {tipo:"ENTRADA", quantidade:100, produtoId} → estoque = 100
6. GET  /produtos/:id                    → quantidadeEstoque = 100
7. POST /movimentacoes {tipo:"SAIDA", quantidade:30, produtoId} → estoque = 70
8. POST /movimentacoes {tipo:"SAIDA", quantidade:999, produtoId} → ERRO 400
9. DELETE /movimentacoes/:id             → estoque volta para 100
10. DELETE /categorias/:id               → ERRO 409 (tem produtos)
11. DELETE /produtos/:id                 → sucesso
12. DELETE /categorias/:id               → sucesso
```

---

**Pronto.** Com este documento você tem tudo para entender, rodar, testar e evoluir o projeto. Qualquer dúvida, consulte os comentários no código-fonte — cada arquivo está documentado linha a linha.
