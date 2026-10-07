import { useState } from 'react'

// Trecho real do prompt que a API do qualificador monta para o segmento academia (main.py + segmentos.py)
const PARTES = [
  {
    titulo: 'Papel e contexto',
    porque: 'O modelo responde como um SDR daquele segmento, não como um assistente genérico.',
    linhas: ['Você é um SDR especialista no segmento: Academia.', 'Contexto do negócio: Academia de musculação e treinos, com planos mensais e anuais.'],
  },
  {
    titulo: 'Critérios vindos de configuração',
    porque:
      'Os critérios de cada segmento ficam em um arquivo de configuração e entram no prompt por template. Um nicho novo não exige reescrever o prompt.',
    linhas: ['Analise a mensagem do lead e avalie estes critérios:', '- objetivo (emagrecer, ganhar massa, saúde, performance)', '- urgência para começar', '- horários disponíveis para treinar', '- experiência anterior com treino', '- região ou distância até a unidade'],
  },
  {
    titulo: 'Regras contra invenção',
    porque: 'Só vale o que está na mensagem. O que o lead não disse vira pergunta para o vendedor, não suposição.',
    linhas: [
      'Regras:',
      '1. Use SOMENTE informações escritas na mensagem. Nunca invente dados.',
      '2. Critérios não mencionados vão na lista "faltando".',
    ],
  },
  {
    titulo: 'Saída verificável',
    porque:
      'Valores fechados, faixa definida e critério explícito de "quente". A resposta segue um schema Pydantic, então dá para validar, testar e plugar num CRM.',
    linhas: [
      '3. "classificacao" deve ser exatamente "quente", "morno" ou "frio". Um lead é quente quando: tem objetivo claro, quer começar em até 1 semana e pede valores, plano ou visita.',
      '4. "pontuacao" vai de 0 a 100.',
      '5. "proxima_acao" é a melhor próxima mensagem ou ação do vendedor, em uma frase.',
      '6. Em "informacoes", use como "campo" o nome do critério exatamente como está na lista acima.',
    ],
  },
  {
    titulo: 'Ajuste por teste + configuração',
    porque:
      'A regra de acentuação entrou depois de testes em que o modelo respondia sem acento. E o prompt não trabalha sozinho: temperatura baixa, schema obrigatório e modelo reserva quando o principal falha.',
    linhas: [
      'Responda em português do Brasil, com acentuação e ortografia corretas em todos os textos, inclusive nos nomes dos campos (ex.: "até", "verão", "região", "urgência").',
      '',
      '# chamada: response_schema=AnaliseLead, temperature=0.2, modelo reserva',
    ],
  },
]

const TECNICAS = [
  {
    projeto: 'Alvorada · especificidade',
    texto:
      'Em vez de "escreva um devocional", limites concretos: um versículo real em tradução Almeida, 2 a 3 parágrafos, o nome da pessoa no máximo uma vez e uma única aplicação prática para hoje.',
  },
  {
    projeto: 'Alvorada · contexto dinâmico',
    texto:
      'A cada geração, o app envia ao modelo as referências dos últimos devocionais da pessoa para não repetir versículos. A resposta é validada por um schema antes de ser salva.',
  },
  {
    projeto: 'Assistente da clínica · limites',
    texto:
      'Tom e informações definidos com o cliente, e uma regra clara: urgência de saúde vai para uma pessoa da equipe, nunca é resolvida pela IA.',
  },
]

export default function Prompts() {
  const [ativa, setAtiva] = useState<number | null>(null)

  return (
    <section className="prompts" id="prompts" aria-labelledby="prompts-titulo">
      <p className="rotulo-secao">03 — Engenharia de prompt</p>
      <h2 id="prompts-titulo">Prompt bom é especificação, não pergunta.</h2>
      <p className="subtitulo">
        Um prompt funcional define papel, contexto, regras verificáveis, formato de saída e limites, e é
        testado com mensagens reais até ficar previsível. Abaixo, o prompt real do qualificador de
        leads. Escolha uma técnica para ver onde ela aparece.
      </p>

      <div className="prompts-grade">
        <ol className="tecnicas-prompt">
          {PARTES.map((p, i) => (
            <li key={p.titulo}>
              <button
                type="button"
                aria-pressed={ativa === i}
                aria-controls="prompt-anotado"
                onClick={() => setAtiva(ativa === i ? null : i)}
              >
                <span className="marcador" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <strong>{p.titulo}</strong>
                  <span className="porque">{p.porque}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <figure className="prompt-cartao">
          <figcaption>
            <span>qualificador · prompt de sistema</span>
            <a
              href="https://github.com/jeanlimasx/qualificador-leads-ia/blob/main/main.py"
              target="_blank"
              rel="noreferrer"
            >
              ver no código ↗
            </a>
          </figcaption>
          <pre id="prompt-anotado" className={ativa === null ? '' : 'focado'}>
            {PARTES.map((p, i) => (
              <span key={p.titulo} className={`parte${ativa === i ? ' acesa' : ''}`}>
                <span className="marcador" aria-hidden="true">
                  {i + 1}
                </span>
                {/* Itens de lista ("1. ", "- ") ganham recuo pendurado ao quebrar linha */}
                {p.linhas.map((linha, j) => (
                  <span key={j} className={/^(\d+\.|-) /.test(linha) ? 'linha item' : 'linha'}>
                    {linha || ' '}
                  </span>
                ))}
              </span>
            ))}
          </pre>
        </figure>
      </div>

      <ul className="tecnicas-extra">
        {TECNICAS.map((t) => (
          <li key={t.projeto}>
            <strong>{t.projeto}</strong>
            <p>{t.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
