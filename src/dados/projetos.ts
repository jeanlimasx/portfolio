export const API_URL = 'https://qualificador-leads-ia-846p.onrender.com'
export const GITHUB_URL = 'https://github.com/jeanlimasx'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/jeanlimasx/'

export type Print = {
  src: string
  alt: string
  largura: number
  altura: number
}

export type Link = { rotulo: string; url: string }

export type Projeto = {
  id: string
  nome: string
  // Selo exibido ao lado do nome (ex.: "Em andamento")
  status?: string
  frase: string
  destaques: string[]
  stack: string[]
  links: Link[]
  // Texto exibido no lugar do link de código quando o repositório é privado
  codigoPrivado?: string
  capa: Print
  prints: { computador: Print[]; celular: Print[] }
  // Projetos feitos para celular abrem o estudo já na aba Celular
  telaInicial?: 'computador' | 'celular'
  oQueE: string
  comoFunciona: string[]
  comoFoiFeito: { titulo: string; texto: string }[]
  desafiosTitulo: string
  desafios: string[]
  observacao?: string
}

// Prints de computador são 1600x1000 e de celular 780x1688 (ver PLANO-PORTFOLIO.md)
const computador = (src: string, alt: string): Print => ({ src, alt, largura: 1600, altura: 1000 })
const celular = (src: string, alt: string): Print => ({ src, alt, largura: 780, altura: 1688 })

const qualificadorDemo = computador(
  '/projetos/qualificador/demo-academia.webp',
  'Demo do qualificador analisando a mensagem de um aluno de academia: lead classificado com nota, termômetro, dados extraídos e próxima ação',
)

const cadernetaVisao = computador(
  '/projetos/caderneta/visao-geral.webp',
  'Visão geral da Caderneta em tema escuro: patrimônio, receitas e despesas do mês, gráfico de seis meses e gastos por categoria',
)

const capa = (id: string, alt: string) => computador(`/projetos/${id}/capa.webp`, alt)

const fluxoAtendimento = computador(
  '/projetos/atendimento/fluxo.webp',
  'Diagrama do fluxo da assistente: o paciente manda mensagem no WhatsApp, o n8n organiza a conversa, a IA responde com as regras da clínica e urgências são encaminhadas para a equipe',
)

const alvoradaLogin = computador(
  '/projetos/alvorada/login.webp',
  'Tela de login do Alvorada em azul-marinho e dourado, com o versículo do dia',
)

export const PROJETOS: Projeto[] = [
  {
    id: 'alvorada',
    nome: 'Alvorada',
    frase:
      'Devocional diário escrito por IA a partir do momento de vida de cada pessoa, com estudos, Bíblia completa e diário.',
    destaques: [
      'IA só no servidor, com saída validada',
      'Assinatura recorrente com webhook verificado',
    ],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Claude (Anthropic)', 'Mercado Pago', 'Vercel'],
    links: [{ rotulo: 'Ver site', url: 'https://alvorada-ten.vercel.app' }],
    codigoPrivado: 'Código privado',
    capa: capa('alvorada', 'Três telas do Alvorada no celular: login, devocional do dia e Jornada Bíblica'),
    telaInicial: 'celular',
    prints: {
      computador: [alvoradaLogin],
      celular: [
        celular(
          '/projetos/alvorada/celular-home.webp',
          'Devocional do dia no celular, com a barra de navegação inferior',
        ),
        celular('/projetos/alvorada/celular-estudos.webp', 'Jornada Bíblica no celular'),
        celular('/projetos/alvorada/login-celular.webp', 'Tela de login do Alvorada no celular'),
      ],
    },
    oQueE:
      'Um app de devocional cristão. A pessoa conta como está e recebe uma palavra para aquele momento: versículo, reflexão, oração e aplicação prática. Começou como o protótipo "Raízes" e evoluiu para o Alvorada.',
    comoFunciona: [
      'Cadastro e onboarding: nome e temas do coração.',
      'Na página inicial, o devocional do dia. No plano pago, a pessoa escolhe a área e o sentimento, e a IA gera um devocional personalizado.',
      'Abas de Estudos (quiz, plano de leitura de 90 dias e Jornada Bíblica), Diário, Bíblia e Perfil.',
    ],
    comoFoiFeito: [
      {
        titulo: 'IA segura',
        texto:
          'A chamada ao Claude acontece só no servidor. A resposta segue um schema validado com zod, e o prompt proíbe inventar referências bíblicas e trata o texto do usuário como dado, não como instrução.',
      },
      {
        titulo: 'Custo sob controle',
        texto:
          'Cache do prompt de sistema e um devocional por pessoa por dia, garantido no banco.',
      },
      {
        titulo: 'Pagamento',
        texto:
          'Integração com Mercado Pago. O webhook não confia no corpo da notificação: consulta o status real da assinatura antes de liberar o plano.',
      },
      {
        titulo: 'Dados',
        texto:
          'Supabase com RLS. "Hoje" é sempre calculado no fuso de São Paulo. A Bíblia passa por um proxy próprio para uma API pública, com cache de 30 dias.',
      },
    ],
    desafiosTitulo: 'Desafios',
    desafios: [
      'Escrever um prompt pastoral que não soe genérico.',
      'Evitar repetir versículos: o app envia ao modelo os últimos que a pessoa já recebeu.',
      'Adaptar o projeto às mudanças do Next.js 16.',
    ],
  },
  {
    id: 'atendimento',
    nome: 'Assistente virtual para clínica',
    status: 'Projeto para cliente',
    frase:
      'Chatbot com IA que atende os pacientes de uma clínica pelo WhatsApp fora do horário da secretária: tira dúvidas e encaminha os casos urgentes para a equipe.',
    destaques: ['Fluxo de automação construído no n8n', 'Regras e limites definidos com o cliente'],
    stack: ['n8n', 'IA generativa', 'WhatsApp'],
    links: [],
    codigoPrivado: 'Fluxo privado do cliente',
    capa: fluxoAtendimento,
    prints: { computador: [fluxoAtendimento], celular: [] },
    oQueE:
      'Uma clínica de ortopedia precisava responder pacientes à noite, nos fins de semana e nos feriados, quando a secretária não está. Construí no n8n uma assistente virtual que conversa pelo WhatsApp seguindo as regras da clínica.',
    comoFunciona: [
      'O paciente manda uma mensagem no WhatsApp.',
      'O fluxo no n8n recebe a mensagem e monta o contexto da conversa.',
      'A IA responde com as informações e o tom definidos pela clínica: valores, convênios, formas de pagamento, endereço e documentos.',
      'Urgências, como complicações pós-operatórias, são encaminhadas para a equipe em vez de respondidas pela IA.',
    ],
    comoFoiFeito: [
      {
        titulo: 'Levantamento com o cliente',
        texto:
          'Antes de construir, usei um formulário de implantação para coletar horários, serviços, convênios, perguntas frequentes, limites e casos de urgência. É a lógica de vendas consultivas: entender antes de propor.',
      },
      {
        titulo: 'Automação no n8n',
        texto:
          'O fluxo de mensagens e as regras ficam no n8n, o que facilita ajustar o comportamento da assistente sem reescrever código.',
      },
      {
        titulo: 'Limites claros para a IA',
        texto:
          'A assistente não substitui a equipe: urgências vão para uma pessoa, e o agendamento ficou fora da primeira versão porque o sistema de agenda da clínica não permite integração.',
      },
    ],
    desafiosTitulo: 'Desafios',
    desafios: [
      'Definir com o cliente o que a IA pode e não pode responder.',
      'Tratar urgências de saúde com segurança, sempre encaminhando para uma pessoa.',
      'Integrar a agenda da clínica numa próxima versão, se o sistema permitir.',
    ],
    observacao: 'Dados do cliente omitidos por privacidade. A imagem é um diagrama do fluxo, não uma captura de tela.',
  },
  {
    id: 'caderneta',
    nome: 'Caderneta',
    frase:
      'App de finanças pessoais para controlar contas, cartões, orçamento e metas, feito para o meu uso e instalável no celular.',
    destaques: [
      'Saldo calculado pelo banco, nunca digitado',
      'Segurança por usuário com RLS no Postgres',
    ],
    stack: ['React', 'Vite', 'Supabase', 'PWA', 'CSS puro'],
    links: [{ rotulo: 'Ver site', url: 'https://caderneta-peach.vercel.app' }],
    codigoPrivado: 'Código privado',
    capa: capa('caderneta', 'Caderneta no computador e no celular: visão geral com patrimônio, receitas, despesas e gráficos'),
    prints: {
      computador: [
        cadernetaVisao,
        computador(
          '/projetos/caderneta/novo-lancamento.webp',
          'Janela de novo lançamento da Caderneta, com valor, categoria, conta e parcelamento',
        ),
        computador(
          '/projetos/caderneta/orcamento.webp',
          'Tela de orçamento da Caderneta, com barras de gasto por categoria em verde, âmbar e vermelho',
        ),
      ],
      celular: [
        celular(
          '/projetos/caderneta/celular.webp',
          'Caderneta no celular, com a barra de navegação inferior e o botão de novo lançamento',
        ),
      ],
    },
    oQueE:
      'Planilhas não davam conta de cartão de crédito, parcelas e contas a pagar ao mesmo tempo. A Caderneta reúne tudo num só lugar: contas, cartões, parcelas, orçamento, metas e contas a pagar.',
    comoFunciona: [
      'Entrar com e-mail e senha. No primeiro acesso, o app cria as categorias e uma conta "Carteira".',
      'Cadastrar contas (com saldo inicial) e cartões (limite, dia de fechamento e de vencimento).',
      'Lançar despesas, receitas e transferências pelo botão "+", com parcelamento automático em até 24x.',
      'Compras no cartão vão para a fatura. "Pagar fatura" quita tudo com um único débito.',
      'Acompanhar orçamento por categoria, metas, contas a pagar e relatórios de 12 meses. Exportar em CSV ou backup JSON.',
    ],
    comoFoiFeito: [
      {
        titulo: 'Saldo nunca é gravado',
        texto:
          'Uma view no Postgres soma o saldo inicial e os lançamentos, então o saldo não tem como ficar desatualizado.',
      },
      {
        titulo: 'Regras no banco',
        texto:
          'Um lançamento vem de uma conta ou de um cartão, nunca dos dois, garantido por uma constraint. Transferência e pagamento de fatura são funções no banco, executadas numa chamada só.',
      },
      {
        titulo: 'Privacidade',
        texto: 'Row Level Security em todas as tabelas: cada usuário só acessa as próprias linhas.',
      },
      {
        titulo: 'Sem dependências pesadas',
        texto:
          'Gráficos em SVG feitos à mão, que medem o próprio espaço para o texto não distorcer, ícones inline e CSS puro.',
      },
      {
        titulo: 'Detalhes',
        texto:
          'Datas tratadas como texto para evitar erros de fuso, mensagens de erro traduzidas para português e tema escuro aplicado antes da página montar, sem "piscar".',
      },
    ],
    desafiosTitulo: 'Próximos passos',
    desafios: [
      'Gerar automaticamente as contas recorrentes do mês seguinte.',
      'Paginar os lançamentos quando o volume crescer.',
    ],
    observacao: 'Projeto de uso pessoal. As telas usam dados fictícios do protótipo de design.',
  },
  {
    id: 'qualificador',
    nome: 'Qualificador de leads com IA',
    status: 'Em andamento',
    frase:
      'Um SDR de IA: lê a mensagem de quem pede informação e diz quem atender primeiro, com temperatura, nota, o que já se sabe e o que perguntar em seguida. Estou desenvolvendo para apoiar o setor de vendas da empresa onde trabalho.',
    destaques: [
      'Resposta estruturada pronta para CRM',
      'Tentativas automáticas e modelo reserva quando a IA oscila',
    ],
    stack: ['Python', 'FastAPI', 'Pydantic', 'Gemini', 'Render'],
    links: [
      { rotulo: 'Testar ao vivo', url: '#demo' },
      { rotulo: 'Código', url: 'https://github.com/jeanlimasx/qualificador-leads-ia' },
      { rotulo: 'Documentação da API', url: `${API_URL}/docs` },
    ],
    capa: capa('qualificador', 'Demo do qualificador no computador e no celular, com um lead de academia classificado como quente'),
    prints: {
      computador: [
        qualificadorDemo,
        computador(
          '/projetos/qualificador/swagger.webp',
          'Documentação automática da API (Swagger) com o endpoint POST /qualificar aberto',
        ),
      ],
      celular: [
        celular(
          '/projetos/qualificador/demo-celular.webp',
          'Demo do qualificador na tela do celular, com o resultado da análise',
        ),
      ],
    },
    oQueE:
      'Em vendas, eu via leads bons esfriando porque ninguém sabia quem atender primeiro. O qualificador resolve a triagem: lê a mensagem como um SDR leria, identifica o que o lead já contou (objetivo, prazo, orçamento, região) e aponta o que falta perguntar. Hoje é uma API funcionando em produção. Estou desenvolvendo para apoiar o setor de vendas da empresa onde trabalho e, no futuro, ajudar academias a entender melhor seus leads.',
    comoFunciona: [
      'O sistema (ou a demo desta página) envia o segmento e a mensagem para POST /qualificar.',
      'A API monta as instruções com os critérios daquele segmento. Academia: objetivo, urgência, horário, experiência e distância. Imobiliário: tipo de imóvel, região, faixa de preço, pagamento e prazo.',
      'O Gemini responde num formato fixo, validado pelo Pydantic.',
      'O vendedor recebe classificação, nota, dados extraídos, perguntas pendentes e a próxima ação.',
    ],
    comoFoiFeito: [
      {
        titulo: 'Segmentos fora do código',
        texto:
          'Adicionar um nicho novo é editar um dicionário em segmentos.py, sem mexer na lógica da API.',
      },
      {
        titulo: 'Saída estruturada',
        texto:
          'O mesmo modelo Pydantic define o contrato da API e o formato que a IA precisa seguir. A resposta já sai em JSON pronto para um CRM.',
      },
      {
        titulo: 'Menos invenção',
        texto:
          'A IA só pode usar o que está na mensagem. O que o lead não disse vira pergunta para o vendedor.',
      },
      {
        titulo: 'Resiliência',
        texto:
          'Em erro 429, 500 ou 503, até 3 tentativas com espera crescente (1s, 2s, 4s). Se o problema persistir, a API troca para um modelo reserva.',
      },
      {
        titulo: 'Deploy',
        texto:
          'Render no plano gratuito, com CORS limitado aos domínios configurados por variável de ambiente. Este portfólio "acorda" a API ao carregar a página para reduzir a espera do primeiro uso.',
      },
    ],
    desafiosTitulo: 'Próximos passos',
    desafios: [
      'Garantir no schema que a classificação seja só quente, morno ou frio, e coerente com a nota.',
      'Adicionar testes automatizados com respostas simuladas da IA.',
      'Fixar as versões das dependências.',
      'Não expor a mensagem de erro interna quando a IA falha.',
    ],
  },
]
