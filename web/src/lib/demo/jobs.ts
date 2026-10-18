import type { JobDto, JobPlan, JobType, PaginationMeta } from "@/lib/types";

// Vagas e empresas fictícias do modo demonstração (NEXT_PUBLIC_DEMO_MODE=true).
// As datas são relativas ao momento atual, para a demo nunca ficar com vagas
// vencidas.

const DAY = 24 * 60 * 60 * 1000;
const PLAN_DAYS: Record<JobPlan, number> = { BASIC: 7, FEATURED: 15 };

type DemoJobSeed = {
  id: string;
  title: string;
  company: string;
  area: string;
  type: JobType;
  plan: JobPlan;
  salary: string | null;
  description: string;
  requirements: string | null;
  benefits: string | null;
  application_link: string;
  // Dias desde a publicação
  publishedDaysAgo: number;
};

const seeds: DemoJobSeed[] = [
  {
    id: "demo-operador-de-caixa",
    title: "Operador(a) de Caixa",
    company: "Supermercado Sertão Forte",
    area: "operador de caixa",
    type: "CLT",
    plan: "FEATURED",
    salary: "R$ 1.650,00 + benefícios",
    description:
      "O Supermercado Sertão Forte está contratando operadores(as) de caixa para a loja do Centro de Patos.\n\nAtividades: atendimento ao cliente no caixa, recebimento em dinheiro, cartão e PIX, conferência e fechamento do caixa ao fim do turno.\n\nEscala 6x1, com uma folga no domingo por mês.",
    requirements:
      "Ensino médio completo.\nBoa comunicação e facilidade com números.\nDisponibilidade para trabalhar em escala, inclusive aos fins de semana.\nExperiência como operador(a) de caixa será um diferencial.",
    benefits: "Vale-transporte\nVale-alimentação de R$ 300,00\nDesconto em compras na loja\nRefeição no local",
    application_link: "rh@sertaoforte.example",
    publishedDaysAgo: 0,
  },
  {
    id: "demo-auxiliar-administrativo",
    title: "Auxiliar Administrativo",
    company: "Contabilidade Espinharas",
    area: "auxiliar administrativo",
    type: "CLT",
    plan: "BASIC",
    salary: "R$ 1.800,00",
    description:
      "Escritório de contabilidade no bairro Brasília procura auxiliar administrativo para rotinas de departamento pessoal e atendimento a clientes.\n\nAtividades: organização de documentos, lançamentos em planilhas, emissão de guias e contato com clientes por telefone e WhatsApp.",
    requirements:
      "Ensino médio completo; cursando Administração ou Ciências Contábeis é um diferencial.\nPacote Office (principalmente Excel).\nOrganização e atenção aos detalhes.",
    benefits: "Vale-transporte\nPlano odontológico\nHorário comercial, de segunda a sexta",
    application_link: "vagas@contabilidadeespinharas.example",
    publishedDaysAgo: 1,
  },
  {
    id: "demo-vendedor-externo",
    title: "Vendedor(a) Externo",
    company: "Distribuidora Vale do Piancó",
    area: "vendedor externo",
    type: "CLT",
    plan: "FEATURED",
    salary: "R$ 1.650,00 + comissão",
    description:
      "Distribuidora de alimentos e bebidas busca vendedor(a) externo para atender mercadinhos e restaurantes de Patos e cidades vizinhas (São Mamede, Santa Teresinha e Malta).\n\nAtividades: visita à carteira de clientes, prospecção de novos pontos de venda, emissão de pedidos pelo aplicativo e acompanhamento das entregas.",
    requirements:
      "Experiência com vendas externas ou atacado.\nCNH categoria A ou B e veículo próprio.\nConhecimento da região do Sertão.",
    benefits: "Comissão sem teto\nAjuda de custo com combustível\nCelular corporativo",
    application_link: "https://forms.example.com/vale-do-pianco-vendedor",
    publishedDaysAgo: 2,
  },
  {
    id: "demo-tecnico-em-informatica",
    title: "Técnico(a) em Informática",
    company: "Patos Net Telecom",
    area: "técnico em informática",
    type: "CLT",
    plan: "BASIC",
    salary: "R$ 2.100,00",
    description:
      "Provedor de internet de Patos procura técnico(a) em informática para suporte aos clientes e manutenção da rede.\n\nAtividades: atendimento remoto e presencial, configuração de roteadores e ONUs, diagnóstico de problemas de conexão e apoio às equipes de instalação.",
    requirements:
      "Curso técnico em Informática, Redes ou áreas afins.\nNoções de redes (TCP/IP, Wi-Fi, fibra óptica).\nCNH categoria A.",
    benefits: "Vale-alimentação\nPlano de saúde após o período de experiência\nInternet residencial gratuita",
    application_link: "talentos@patosnet.example",
    publishedDaysAgo: 3,
  },
  {
    id: "demo-garcom",
    title: "Garçom / Garçonete",
    company: "Restaurante Sabor do Sertão",
    area: "garçom",
    type: "TEMPORARY",
    plan: "BASIC",
    salary: "R$ 80,00 por noite + gorjetas",
    description:
      "Contratação temporária para o período da Festa de Nossa Senhora da Guia. Restaurante na Avenida Epitácio Pessoa precisa de garçons e garçonetes para o turno da noite.\n\nAtividades: atendimento às mesas, anotação de pedidos, serviço de bebidas e organização do salão.",
    requirements: "Experiência com atendimento em bares ou restaurantes.\nDisponibilidade à noite, de quinta a domingo.",
    benefits: "Jantar no local\nGorjetas divididas entre a equipe",
    application_link: "https://forms.example.com/sabor-do-sertao-garcom",
    publishedDaysAgo: 1,
  },
  {
    id: "demo-auxiliar-de-enfermagem",
    title: "Auxiliar de Enfermagem",
    company: "Clínica Vida Plena",
    area: "auxiliar de enfermagem",
    type: "CLT",
    plan: "FEATURED",
    salary: "R$ 1.900,00 + insalubridade",
    description:
      "Clínica de especialidades no bairro Santo Antônio contrata auxiliar de enfermagem para o turno da manhã.\n\nAtividades: triagem e aferição de sinais vitais, preparo de pacientes para consultas e exames, organização dos consultórios e controle de materiais.",
    requirements: "Curso de Auxiliar ou Técnico de Enfermagem.\nRegistro ativo no COREN-PB.\nBoa comunicação com pacientes.",
    benefits: "Adicional de insalubridade\nVale-transporte\nPlano de saúde",
    application_link: "curriculos@clinicavidaplena.example",
    publishedDaysAgo: 4,
  },
  {
    id: "demo-designer-grafico",
    title: "Designer Gráfico",
    company: "Agência Mandacaru Digital",
    area: "designer gráfico",
    type: "PJ",
    plan: "BASIC",
    salary: "R$ 2.500,00 a R$ 3.000,00",
    description:
      "Agência de marketing digital procura designer gráfico para criar peças para redes sociais de clientes do comércio local.\n\nAtividades: criação de posts, stories e carrosséis, adaptação de identidades visuais e produção de materiais impressos (panfletos e banners).\n\nModelo híbrido: dois dias por semana no escritório, no Centro.",
    requirements:
      "Portfólio com trabalhos para redes sociais.\nDomínio de Photoshop, Illustrator ou Figma.\nNoções de edição de vídeo curto (Reels) são um diferencial.",
    benefits: "Trabalho híbrido\nHorário flexível",
    application_link: "https://forms.example.com/mandacaru-designer",
    publishedDaysAgo: 5,
  },
  {
    id: "demo-motorista-entregador",
    title: "Motorista Entregador",
    company: "Casa & Obra Materiais de Construção",
    area: "motorista entregador",
    type: "CLT",
    plan: "BASIC",
    salary: "R$ 1.950,00",
    description:
      "Loja de materiais de construção contrata motorista entregador para entregas em Patos e na zona rural.\n\nAtividades: conferência e carregamento das mercadorias, entregas aos clientes e preenchimento dos comprovantes de entrega.",
    requirements: "CNH categoria C.\nExperiência com caminhão 3/4 ou toco.\nConhecimento das ruas de Patos.",
    benefits: "Vale-alimentação\nCesta básica\nPremiação por assiduidade",
    application_link: "rh@casaeobra.example",
    publishedDaysAgo: 2,
  },
  {
    id: "demo-professor-de-ingles",
    title: "Professor(a) de Inglês",
    company: "Escola de Idiomas Speak Sertão",
    area: "professor de inglês",
    type: "PJ",
    plan: "BASIC",
    salary: "R$ 35,00 por hora-aula",
    description:
      "Escola de idiomas busca professor(a) de inglês para turmas infantis e de adultos, nos turnos da tarde e da noite.\n\nAtividades: planejamento e aplicação das aulas com o material da escola, acompanhamento dos alunos e participação nas reuniões pedagógicas.",
    requirements: "Inglês avançado ou fluente.\nExperiência com sala de aula.\nGraduação em Letras é um diferencial.",
    benefits: "Curso de espanhol gratuito\nCapacitação no método da escola",
    application_link: "contato@speaksertao.example",
    publishedDaysAgo: 6,
  },
  {
    id: "demo-auxiliar-de-cozinha",
    title: "Auxiliar de Cozinha",
    company: "Restaurante Sabor do Sertão",
    area: "auxiliar de cozinha",
    type: "CLT",
    plan: "BASIC",
    salary: "R$ 1.650,00",
    description:
      "Restaurante self-service no Centro de Patos contrata auxiliar de cozinha para o horário do almoço.\n\nAtividades: pré-preparo dos alimentos, higienização de utensílios e da cozinha e apoio ao cozinheiro na montagem do buffet.",
    requirements: "Experiência em cozinha será um diferencial.\nAgilidade e cuidado com a higiene.",
    benefits: "Refeição no local\nVale-transporte",
    application_link: "https://forms.example.com/sabor-do-sertao-cozinha",
    publishedDaysAgo: 3,
  },
  {
    id: "demo-auxiliar-de-farmacia",
    title: "Auxiliar de Farmácia",
    company: "Drogaria do Jatobá",
    area: "auxiliar de farmácia",
    type: "CLT",
    plan: "BASIC",
    salary: "R$ 1.700,00",
    description:
      "Farmácia de bairro no Jatobá procura auxiliar de farmácia para atendimento no balcão e organização da loja.\n\nAtividades: atendimento aos clientes, reposição e conferência de produtos, controle de validade e apoio ao farmacêutico.",
    requirements: "Ensino médio completo.\nCurso de auxiliar de farmácia é um diferencial.\nDisponibilidade para escala 12x36.",
    benefits: "Vale-transporte\nDesconto em medicamentos",
    application_link: "rh@drogariajatoba.example",
    publishedDaysAgo: 5,
  },
  {
    id: "demo-eletricista",
    title: "Eletricista Freelancer",
    company: "Solar Sertão Energia",
    area: "eletricista",
    type: "FREELANCER",
    plan: "BASIC",
    salary: "Pagamento por instalação",
    description:
      "Empresa de energia solar procura eletricistas para apoiar a instalação de sistemas fotovoltaicos residenciais em Patos e região.\n\nAtividades: passagem de cabos, montagem de quadros elétricos e ligação de inversores, sempre com o acompanhamento do engenheiro responsável.",
    requirements: "Curso de NR-10 válido.\nNR-35 (trabalho em altura) é um diferencial.\nFerramentas próprias.",
    benefits: "EPIs fornecidos pela empresa\nDemanda constante de instalações",
    application_link: "https://forms.example.com/solar-sertao-eletricista",
    publishedDaysAgo: 4,
  },
];

function toJobDto(seed: DemoJobSeed, now: number): JobDto {
  const publishedAt = new Date(now - seed.publishedDaysAgo * DAY);
  const expiresAt = new Date(publishedAt.getTime() + PLAN_DAYS[seed.plan] * DAY);
  const companyId = `demo-${normalize(seed.company).replace(/[^a-z0-9]+/g, "-")}`;

  return {
    id: seed.id,
    companyId,
    company: { id: companyId, name: seed.company, logo_url: null },
    title: seed.title,
    description: seed.description,
    area: seed.area,
    type: seed.type,
    salary: seed.salary,
    image_url: `/demo/vagas/${seed.id}.svg`,
    application_link: seed.application_link,
    plan: seed.plan,
    status: "ATIVA",
    is_featured: seed.plan === "FEATURED",
    published_at: publishedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    whatsapp_sent_at: publishedAt.toISOString(),
    suspension_reason: null,
    requirements: seed.requirements,
    benefits: seed.benefits,
    createdAt: publishedAt.toISOString(),
    updatedAt: publishedAt.toISOString(),
  };
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export type DemoJobFilters = {
  search?: string | null;
  type?: string | null;
  area?: string | null;
  page?: number;
  limit?: number;
};

// Mesmos filtros e ordem da listagem pública da API (GET /jobs)
export function listDemoJobs(filters: DemoJobFilters = {}): {
  jobs: JobDto[];
  meta: PaginationMeta;
} {
  const now = Date.now();
  const search = filters.search ? normalize(filters.search) : "";
  const area = filters.area ? normalize(filters.area) : "";

  const matches = seeds
    .map((seed) => toJobDto(seed, now))
    .filter((job) => !filters.type || job.type === filters.type)
    .filter((job) => !area || normalize(job.area).includes(area))
    .filter(
      (job) =>
        !search ||
        [job.title, job.description, job.area, job.company?.name ?? ""].some((field) =>
          normalize(field).includes(search),
        ),
    )
    .sort(
      (a, b) =>
        Number(b.is_featured) - Number(a.is_featured) ||
        new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime(),
    );

  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, filters.limit ?? 10);
  const start = (page - 1) * limit;

  return {
    jobs: matches.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: matches.length,
      totalPages: Math.ceil(matches.length / limit),
    },
  };
}

export function getDemoJob(id: string): JobDto | null {
  const seed = seeds.find((item) => item.id === id);
  return seed ? toJobDto(seed, Date.now()) : null;
}
