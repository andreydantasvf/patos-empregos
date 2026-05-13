// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OpenAPIObject = Record<string, any>;

export const openApiSpec: OpenAPIObject = {
  openapi: '3.0.3',
  info: {
    title: 'Patos Empregos API',
    version: '1.0.0',
    description:
      'API REST da plataforma regional de empregos Patos Empregos. ' +
      'Gerencie vagas, autenticação de administradores e aprovação de publicações.',
    contact: {
      name: 'Genesis Web',
      email: 'contato@patosempregos.com.br',
    },
  },
  servers: [
    { url: 'http://localhost:3333', description: 'Desenvolvimento local' },
    { url: 'https://api.patosempregos.com.br', description: 'Produção' },
  ],
  tags: [
    { name: 'Health', description: 'Status da API' },
    { name: 'Auth', description: 'Autenticação de administradores' },
    { name: 'Jobs', description: 'Vagas públicas' },
    { name: 'Admin', description: 'Painel administrativo — requer JWT' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      CreateJob: {
        type: 'object',
        required: ['title', 'companyName', 'responsibleName', 'whatsapp', 'city', 'type', 'description', 'requirements'],
        properties: {
          title: { type: 'string', example: 'Desenvolvedor Web' },
          companyName: { type: 'string', example: 'Empresa XPTO Ltda' },
          responsibleName: { type: 'string', example: 'João Silva' },
          whatsapp: { type: 'string', example: '(83) 99999-9999' },
          city: { type: 'string', example: 'Patos' },
          type: { type: 'string', enum: ['CLT', 'PJ', 'FREELANCER', 'INTERNSHIP', 'TEMPORARY'] },
          salary: { type: 'string', example: 'R$ 2.000,00', nullable: true },
          description: { type: 'string', example: 'Descrição detalhada da vaga...' },
          requirements: { type: 'string', example: 'Experiência com Node.js...' },
          benefits: { type: 'string', example: 'Vale refeição, plano de saúde', nullable: true },
          applicationLink: { type: 'string', format: 'uri', nullable: true },
        },
      },
      Job: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          companyName: { type: 'string' },
          responsibleName: { type: 'string' },
          whatsapp: { type: 'string' },
          city: { type: 'string' },
          type: { type: 'string' },
          salary: { type: 'string', nullable: true },
          description: { type: 'string' },
          requirements: { type: 'string' },
          benefits: { type: 'string', nullable: true },
          applicationLink: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer' },
          message: { type: 'string' },
          errors: { type: 'object' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check da API',
        responses: {
          '200': { description: 'API online' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login do administrador',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@patosempregos.com.br' },
                  password: { type: 'string', example: 'admin123' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login realizado com sucesso' },
          '401': { description: 'Credenciais inválidas' },
          '422': { description: 'Dados inválidos' },
        },
      },
    },
    '/jobs': {
      get: {
        tags: ['Jobs'],
        summary: 'Listar vagas aprovadas',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'city', schema: { type: 'string' } },
          { in: 'query', name: 'type', schema: { type: 'string', enum: ['CLT', 'PJ', 'FREELANCER', 'INTERNSHIP', 'TEMPORARY'] } },
          { in: 'query', name: 'company', schema: { type: 'string' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista paginada de vagas aprovadas' } },
      },
      post: {
        tags: ['Jobs'],
        summary: 'Cadastrar nova vaga (público, sem autenticação)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { '$ref': '#/components/schemas/CreateJob' } } },
        },
        responses: {
          '201': { description: 'Vaga cadastrada — aguardando aprovação' },
          '422': { description: 'Dados inválidos' },
        },
      },
    },
    '/jobs/{id}': {
      get: {
        tags: ['Jobs'],
        summary: 'Detalhes de uma vaga aprovada',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Detalhes da vaga' },
          '404': { description: 'Vaga não encontrada' },
        },
      },
    },
    '/admin/jobs': {
      get: {
        tags: ['Admin'],
        summary: 'Listar todas as vagas (qualquer status)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } },
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de vagas' },
          '401': { description: 'Não autorizado' },
          '403': { description: 'Acesso negado' },
        },
      },
    },
    '/admin/jobs/{id}/approve': {
      patch: {
        tags: ['Admin'],
        summary: 'Aprovar vaga',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Vaga aprovada' },
          '404': { description: 'Vaga não encontrada' },
        },
      },
    },
    '/admin/jobs/{id}/reject': {
      patch: {
        tags: ['Admin'],
        summary: 'Rejeitar vaga',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Vaga rejeitada' } },
      },
    },
    '/admin/jobs/{id}': {
      delete: {
        tags: ['Admin'],
        summary: 'Remover vaga permanentemente',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Vaga removida' } },
      },
    },
  },
};
