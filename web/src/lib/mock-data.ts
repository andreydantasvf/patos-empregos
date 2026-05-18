import type { Job } from "./types";

export const mockJobs: Job[] = [
  {
    id: "1",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "TechPatos Soluções",
    responsibleName: "Maria Silva",
    whatsapp: "83999999999",
    position: "Desenvolvedor(a) Full Stack",
    city: "Patos-PB",
    type: "CLT",
    workMode: "Híbrido",
    salaryRange: "R$ 3.000 - R$ 5.000",
    description:
      "Buscamos um desenvolvedor full stack para integrar nosso time de tecnologia. Você irá trabalhar com projetos inovadores para clientes da região.",
    requirements:
      "Experiência com React, Node.js, conhecimento em banco de dados SQL. Desejável experiência com TypeScript.",
    benefits: "Vale alimentação, plano de saúde, horário flexível",
    status: "APROVADO",
    createdAt: new Date("2026-05-10"),
    updatedAt: new Date("2026-05-10"),
    publishedAt: new Date("2026-05-10"),
  },
  {
    id: "2",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Supermercado Bom Preço",
    responsibleName: "João Santos",
    whatsapp: "83988888888",
    position: "Operador(a) de Caixa",
    city: "Patos-PB",
    type: "CLT",
    workMode: "Presencial",
    salaryRange: "R$ 1.412 + benefícios",
    description:
      "Estamos contratando operadores de caixa para nossa nova loja no centro de Patos. Ambiente de trabalho agradável e oportunidade de crescimento.",
    requirements:
      "Ensino médio completo, boa comunicação, disponibilidade de horário.",
    benefits: "Vale transporte, desconto em compras, refeição no local",
    status: "APROVADO",
    createdAt: new Date("2026-05-09"),
    updatedAt: new Date("2026-05-09"),
    publishedAt: new Date("2026-05-09"),
  },
  {
    id: "3",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Clínica Sorriso Patos",
    responsibleName: "Dr. Pedro Oliveira",
    whatsapp: "83977777777",
    position: "Recepcionista",
    city: "Patos-PB",
    type: "CLT",
    workMode: "Presencial",
    salaryRange: "R$ 1.600",
    description:
      "Clínica odontológica busca recepcionista para atendimento ao público, agendamento de consultas e organização da recepção.",
    requirements:
      "Experiência com atendimento ao público, conhecimento básico em informática, boa apresentação.",
    benefits: "Vale transporte, tratamento odontológico gratuito",
    status: "APROVADO",
    createdAt: new Date("2026-05-08"),
    updatedAt: new Date("2026-05-08"),
    publishedAt: new Date("2026-05-08"),
  },
  {
    id: "4",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Construtora Patos",
    responsibleName: "Ana Pereira",
    whatsapp: "83966666666",
    position: "Pedreiro",
    city: "Patos-PB",
    type: "CLT",
    workMode: "Presencial",
    salaryRange: "R$ 2.200 - R$ 2.800",
    description:
      "Construtora em expansão contrata pedreiro experiente para obras residenciais na cidade de Patos e região.",
    requirements:
      "Experiência comprovada em construção civil, disponibilidade imediata.",
    benefits: "Vale transporte, alimentação na obra, ferramentas fornecidas",
    status: "APROVADO",
    createdAt: new Date("2026-05-07"),
    updatedAt: new Date("2026-05-07"),
    publishedAt: new Date("2026-05-07"),
  },
  {
    id: "5",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Agência Digital Sertão",
    responsibleName: "Lucas Mendes",
    whatsapp: "83955555555",
    position: "Designer Gráfico",
    city: "Patos-PB",
    type: "PJ",
    workMode: "Remoto",
    salaryRange: "R$ 2.500 - R$ 4.000",
    description:
      "Agência de marketing digital busca designer criativo para criação de peças para redes sociais, identidades visuais e materiais promocionais.",
    requirements:
      "Domínio de Figma, Photoshop e Illustrator. Portfólio com trabalhos anteriores.",
    benefits: "Trabalho 100% remoto, horário flexível",
    status: "APROVADO",
    createdAt: new Date("2026-05-06"),
    updatedAt: new Date("2026-05-06"),
    publishedAt: new Date("2026-05-06"),
  },
  {
    id: "6",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Restaurante Sabor do Sertão",
    responsibleName: "Francisca Lima",
    whatsapp: "83944444444",
    position: "Cozinheiro(a)",
    city: "Patos-PB",
    type: "CLT",
    workMode: "Presencial",
    salaryRange: "R$ 1.800 - R$ 2.200",
    description:
      "Restaurante tradicional busca cozinheiro(a) com experiência em comida regional nordestina.",
    requirements:
      "Experiência em cozinha profissional, conhecimento em culinária regional.",
    benefits: "Alimentação no local, vale transporte",
    status: "APROVADO",
    createdAt: new Date("2026-05-05"),
    updatedAt: new Date("2026-05-05"),
    publishedAt: new Date("2026-05-05"),
  },
  {
    id: "7",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Escritório Contábil Central",
    responsibleName: "Roberto Costa",
    whatsapp: "83933333333",
    position: "Estagiário(a) de Contabilidade",
    city: "Patos-PB",
    type: "Estágio",
    workMode: "Presencial",
    salaryRange: "R$ 800 + auxílio transporte",
    description:
      "Escritório contábil oferece oportunidade de estágio para estudantes de Ciências Contábeis ou áreas afins.",
    requirements:
      "Cursando a partir do 3º período de Ciências Contábeis, conhecimento em Excel.",
    benefits: "Bolsa auxílio, vale transporte, possibilidade de efetivação",
    status: "APROVADO",
    createdAt: new Date("2026-05-04"),
    updatedAt: new Date("2026-05-04"),
    publishedAt: new Date("2026-05-04"),
  },
  {
    id: "8",
    imgUrl:
      "https://cotia.sp.gov.br/wp-content/uploads/2025/03/card-emprego.jpeg",
    companyName: "Farmácia Popular Patos",
    responsibleName: "Carla Souza",
    whatsapp: "83922222222",
    position: "Atendente de Farmácia",
    city: "Patos-PB",
    type: "CLT",
    workMode: "Presencial",
    salaryRange: "R$ 1.500 + comissão",
    description:
      "Rede de farmácias contrata atendente para loja no centro de Patos. Treinamento completo oferecido.",
    requirements:
      "Ensino médio completo, experiência com atendimento ao público.",
    benefits: "Vale transporte, desconto em produtos, plano de carreira",
    status: "APROVADO",
    createdAt: new Date("2026-05-03"),
    updatedAt: new Date("2026-05-03"),
    publishedAt: new Date("2026-05-03"),
  },
];
