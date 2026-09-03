export const swaggerDocs = {
    openapi: "3.0.0",

    info: {
        title: "API de Gestão de Estoque",
        version: "1.0.0",
        description: "API para gerenciamento de produtos e movimentações de estoque.",
    },

    paths: {
        "/categorias": {
            get: {
                summary: "Listar categorias",

                responses: {
                    "200": {
                        description: "Lista de categorias",
                    },
                    "400": {
                        description: "Requisição inválida",
                    },
                },
            },
        },

        "/produtos/{id}": {
            get: {
                summary: "Buscar produto por ID",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                    },
                ],

                responses: {
                    "200": {
                        description: "Produto encontrado",
                    },
                    "400": {
                        description: "Requisição inválida",
                    },
                    "404": {
                        description: "Produto não encontrado",
                    },
                },
            },
        },

        "/movimentacoes": {
            get: {
                summary: "Listar movimentações",

                responses: {
                    "200": {
                        description: "Lista de movimentações",

                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",

                                    items: {
                                        type: "object",

                                        properties: {
                                            id: {
                                                type: "string",
                                            },

                                            tipo: {
                                                type: "string",
                                                enum: ["ENTRADA", "SAIDA"],
                                            },

                                            quantidade: {
                                                type: "number",
                                            },

                                            createdAt: {
                                                type: "string",
                                                format: "date-time",
                                            },

                                            produto: {
                                                type: "object",

                                                properties: {
                                                    id: {
                                                        type: "string",
                                                    },

                                                    nome: {
                                                        type: "string",
                                                    },

                                                    sku: {
                                                        type: "string",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },

                    "400": {
                        description: "Requisição inválida",
                    },
                },
            },

            post: {
                summary: "Criar movimentação",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: [
                                    "produtoId",
                                    "tipo",
                                    "quantidade",
                                ],

                                properties: {
                                    tipo: {
                                        type: "string",
                                        enum: ["ENTRADA", "SAIDA"],
                                    },

                                    quantidade: {
                                        type: "number",
                                    },

                                    produtoId: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },

                responses: {
                    "201": {
                        description: "Movimentação criada",
                    },

                    "400": {
                        description: "Requisição inválida",
                    },
                },
            },
        },
    },
};