import { useEffect, useState } from 'react'

const API_URL = 'https://qualificador-leads-ia-846p.onrender.com'
const GITHUB_URL = 'https://github.com/jeanlimasx'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jeanlimasx/'
const REPO_URL = 'https://github.com/jeanlimasx/qualificador-leads-ia'

type Segmento = 'imobiliario' | 'academia'

type Analise = {
  classificacao: string
  pontuacao: number
  informacoes: { campo: string; valor: string }[]
  faltando: string[]
  resumo: string
  proxima_acao: string
}

const EXEMPLOS: Record<Segmento, string> = {
  imobiliario:
    'Oi! Vi o anúncio do apartamento na Vila Mariana. Tenho uns 600 mil, vou usar FGTS e queria me mudar até o fim do ano. Dá pra visitar no sábado?',
  academia:
    'Boa noite! Quero perder uns 8kg até o verão, nunca treinei direito. Consigo ir de manhã cedo. Quanto custa o plano?',
}

const NOMES: Record<Segmento, string> = {
  imobiliario: 'Imobiliário',
  academia: 'Academia',
}

function corDaClassificacao(classificacao: string) {
  const c = classificacao.toLowerCase()
  if (c.includes('quente')) return 'quente'
  if (c.includes('morno')) return 'morno'
  return 'frio'
}

export default function App() {
  const [segmento, setSegmento] = useState<Segmento>('imobiliario')
  const [mensagem, setMensagem] = useState(EXEMPLOS.imobiliario)
  const [carregando, setCarregando] = useState(false)
  const [demorando, setDemorando] = useState(false)
  const [erro, setErro] = useState('')
  const [analise, setAnalise] = useState<Analise | null>(null)

  // Acorda a API assim que a página abre (o plano gratuito do Render "dorme")
  useEffect(() => {
    fetch(`${API_URL}/`).catch(() => {})
  }, [])

  function trocarSegmento(novo: Segmento) {
    setSegmento(novo)
    setMensagem(EXEMPLOS[novo])
    setAnalise(null)
    setErro('')
  }

  async function qualificar() {
    if (!mensagem.trim()) {
      setErro('Escreva a mensagem do lead para analisar.')
      return
    }
    setCarregando(true)
    setDemorando(false)
    setErro('')
    setAnalise(null)
    const aviso = setTimeout(() => setDemorando(true), 6000)

    try {
      const resposta = await fetch(`${API_URL}/qualificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmento, mensagem }),
      })
      const dados = await resposta.json()
      if (!resposta.ok) throw new Error(dados.detail ?? 'A API respondeu com erro.')
      setAnalise(dados)
    } catch (e) {
      setErro(
        e instanceof Error && e.message !== 'Failed to fetch'
          ? e.message
          : 'Não foi possível falar com a API. Tente de novo em alguns segundos.',
      )
    } finally {
      clearTimeout(aviso)
      setCarregando(false)
      setDemorando(false)
    }
  }

  const temperatura = analise ? corDaClassificacao(analise.classificacao) : null

  return (
    <div className="pagina">
      <header className="topo">
        <span className="marca">Jean Lima</span>
        <nav>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </header>

      <main>
        <section className="abertura">
          <div className="intro">
            <h1>Eu vendia para leads. Agora construo a IA que qualifica cada um deles.</h1>
            <p>
              Sou estudante de Engenharia de Software e passei os últimos anos em vendas consultivas,
              com mais de R$1,4 milhão vendidos. Hoje junto as duas coisas: crio agentes de IA e
              automações para vendas e atendimento.
            </p>
            <p className="dica">Teste agora: cole a mensagem de um lead e veja a análise da IA.</p>
          </div>

          <div className="demo">
            <div className="segmentos" role="group" aria-label="Segmento do negócio">
              {(Object.keys(NOMES) as Segmento[]).map((s) => (
                <button
                  key={s}
                  className={s === segmento ? 'ativo' : ''}
                  onClick={() => trocarSegmento(s)}
                  aria-pressed={s === segmento}
                >
                  {NOMES[s]}
                </button>
              ))}
            </div>

            <label htmlFor="mensagem">Mensagem do lead</label>
            <textarea
              id="mensagem"
              rows={5}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />

            <button className="principal" onClick={qualificar} disabled={carregando}>
              {carregando ? 'Analisando…' : 'Qualificar lead'}
            </button>

            {demorando && (
              <p className="aviso">
                A API fica em espera quando ninguém usa. A primeira análise pode levar até um minuto.
              </p>
            )}
            {erro && <p className="erro">{erro}</p>}

            {analise && temperatura && (
              <div className={`resultado ${temperatura}`} aria-live="polite">
                <div className="placar">
                  <span className="classe">Lead {analise.classificacao}</span>
                  <span className="pontos">{analise.pontuacao}/100</span>
                </div>
                <div className="termometro" aria-hidden="true">
                  <span style={{ left: `${Math.min(100, Math.max(0, analise.pontuacao))}%` }} />
                </div>

                <p className="resumo">{analise.resumo}</p>

                <dl className="dados">
                  {analise.informacoes.map((info) => (
                    <div key={info.campo}>
                      <dt>{info.campo}</dt>
                      <dd>{info.valor}</dd>
                    </div>
                  ))}
                </dl>

                {analise.faltando.length > 0 && (
                  <div className="faltando">
                    <h3>O que perguntar</h3>
                    <ul>
                      {analise.faltando.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="acao">
                  <h3>Próxima ação</h3>
                  <p>{analise.proxima_acao}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="projetos">
          <h2>Projetos</h2>

          <article className="projeto destaque">
            <h3>Qualificador de leads com IA</h3>
            <p>
              API que lê a mensagem de um lead, extrai os dados importantes e classifica o potencial de
              compra. Os critérios de cada segmento ficam separados do código, a resposta da IA segue
              um formato fixo pronto para CRM, e a API tenta de novo ou troca de modelo quando a IA fica
              instável.
            </p>
            <p className="stack">Python, FastAPI, Pydantic, Gemini, Render</p>
            <div className="links">
              <a href={REPO_URL} target="_blank" rel="noreferrer">Ver código</a>
              <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer">Documentação da API</a>
            </div>
          </article>

          <article className="projeto">
            <h3>Agente de atendimento para uma clínica</h3>
            <p>
              Agente de IA que responde pacientes e organiza o atendimento de uma clínica real. Foi
              onde aprendi a lógica de um agente: entender a mensagem, decidir e agir.
            </p>
            <p className="stack">n8n, IA generativa · em desenvolvimento</p>
          </article>

          <article className="projeto">
            <h3>Sistemas de organização financeira</h3>
            <p>Ferramentas próprias para controlar entradas, gastos e metas financeiras.</p>
            <p className="stack">Automação</p>
          </article>
        </section>
      </main>

      <footer className="rodape">
        <p>Vamos conversar?</p>
        <div className="links">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  )
}