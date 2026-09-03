# Relatório de Criação — API de Gestão de Estoque

## 1. Decisões de Arquitetura

### Arquitetura em Camadas

A aplicação segue o padrão **Layered Architecture** com quatro camadas bem definidas:

```
HTTP Request → Routes → Controllers → Services → Repositories → Database
```

| Camada | Responsabilidade |
|--------|------------------|
| **Routes** | Mapeia URLs para controllers e aplica validação de entrada |
| **Controllers** | Traduz HTTP (req/res) para chamadas de service |
| **Services** | Contém todas as regras de negócio |
| **Repositories** | Acesso ao banco de dados via Prisma |

### Injeção de Dependências

Utilizamos um **Container manual** (`src/container/index.ts`) que instancia e conecta todas as dependências. Cada service recebe interfaces de repository via construtor, permitindo:

- Baixo acoplamento entre camadas
- Facilidade para criar mocks em testes unitários
- Substituição de implementações sem alterar services

### Por que não usar um framework de DI (tsyringe, inversify)?

Para um projeto deste porte, um container manual é mais explícito, não adiciona dependências extras e demonstra compreensão do padrão sem "mágica" de decorators.

---

## 2. Modelagem do Banco de Dados

### Diagrama de Relacionamentos

```
Categoria (1) ──────< (N) Produto (1) ──────< (N) Movimentacao
```

### Tabela: `categorias`

| Campo | Tipo | Observação |
|-------|------|------------|
| id | UUID | Chave primária gerada automaticamente |
| nome | VARCHAR UNIQUE | Nome único da categoria |
| created_at / updated_at | TIMESTAMP | Auditoria |

### Tabela: `produtos`

| Campo | Tipo | Observação |
|-------|------|------------|
| id | UUID | Chave primária |
| sku | VARCHAR UNIQUE | Código único do produto |
| preco | DECIMAL(10,2) | Precisão para valores monetários |
| quantidade_estoque | INT DEFAULT 0 | Controlado apenas por movimentações |
| categoria_id | UUID FK | Referência à categoria |

### Tabela: `movimentacoes`

| Campo | Tipo | Observação |
|-------|------|------------|
| tipo | ENUM (ENTRADA/SAIDA) | Tipo da movimentação |
| quantidade | INT | Quantidade movimentada |
| cancelada | BOOLEAN DEFAULT false | Soft cancel — mantém histórico |
| produto_id | UUID FK | Produto afetado |

### Decisões de modelagem

1. **Soft cancel em movimentações**: Em vez de deletar o registro, marcamos `cancelada = true`. Isso preserva o histórico completo para auditoria.

2. **Estoque no produto, não calculado**: O campo `quantidade_estoque` é atualizado a cada movimentação. Alternativa seria calcular via `SUM(movimentações)`, mas isso seria mais lento e complexo para validar saídas em tempo real.

3. **Transações atômicas**: Operações que alteram movimentação + estoque usam `prisma.$transaction()` para garantir consistência.

4. **ON DELETE RESTRICT**: Impede exclusão de categoria/produto que tenha registros vinculados (camada de banco como segunda barreira).

---

## 3. Regras de Negócio Implementadas

| Regra | Implementação |
|-------|---------------|
| SKU único | Validação no service + constraint UNIQUE no banco |
| Estoque inicial = 0 | Default no Prisma + rejeição no schema Zod |
| Sem update manual de estoque | Schema Zod `.strict()` bloqueia o campo no PUT |
| Bloquear saída sem saldo | Verificação no `MovimentacaoService` antes da transação |
| Cancelar reverte estoque | Lógica inversa no `calcularNovoEstoque(reverter=true)` |
| Deletar categoria com produtos | `countProdutos()` no service retorna 409 |

---

## 4. Tratamento de Erros

- **AppError**: Classe customizada com `statusCode` para erros de negócio
- **Prisma P2002**: Unique constraint violation → 409 Conflict
- **Prisma P2025**: Record not found → 404 Not Found
- **Zod**: Validação de entrada → 400 Bad Request com detalhes por campo
- **Erros inesperados**: 500 Internal Server Error (stack trace apenas em dev)

---

## 5. Desafios Encontrados

### Consistência de estoque em concorrência

**Problema**: Duas saídas simultâneas poderiam ultrapassar o estoque.

**Solução**: Transações do Prisma garantem atomicidade. Para cenários de alta concorrência, uma melhoria futura seria usar `SELECT ... FOR UPDATE` ou filas de processamento.

### Cancelamento de movimentação

**Problema**: Cancelar uma ENTRADA antiga pode deixar estoque negativo se já houve saídas.

**Solução**: Validação antes do cancelamento verifica se `novoEstoque >= 0`.

### Paginação

Implementada com `skip/take` do Prisma e retorno de metadados (`total`, `totalPages`, `page`, `limit`).

---

## 6. Melhorias Futuras (não implementadas)

- Autenticação e autorização (JWT)
- Testes automatizados (Jest/Vitest)
- Rate limiting
- Logs estruturados (Winston/Pino)
- Documentação OpenAPI/Swagger
- Índices adicionais para consultas frequentes
