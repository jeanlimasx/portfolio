import { useEffect, useState } from 'react'
import { API_URL } from '../dados/projetos'

type Segmento = 'academia' | 'imobiliario'

type Analise = {
  classificacao: string
  pontuacao: number
  informacoes: { campo: string; valor: string }[]
  faltando: string[]
  resumo: string
  proxima_acao: string
}

const LIMITE = 2000
const TEMPO_MAXIMO = 90_000

// A ordem das chaves define a ordem dos botões: academia primeiro
const SEGMENTOS: Record<Segmento, { nome: string; rotulo: string; exemplos: string[] }> = {
  academia: {
    nome: 'Academia',
    rotulo: 'Mensagem de um aluno em potencial',
    exemplos: [
      'Boa noite! Quero perder uns 8kg até o verão, nunca treinei direito. Consigo ir de manhã cedo. Quanto custa o plano?',
      'Oi, moro aqui perto da unidade do centro. Treinava antes da pandemia e quero voltar, de preferência à noite depois das 19h. Vocês têm plano anual? Posso fazer uma aula experimental essa semana?',
    ],
  },
  imobiliario: {
    nome: 'Imobiliário',
    rotulo: 'Mensagem de um cliente interessado em imóvel',
    exemplos: [
      'Oi! Vi o anúncio do apartamento na Vila Mariana. Tenho uns 600 mil, vou usar FGTS e queria me mudar até o fim do ano. Dá pra visitar no sábado?',
      'Boa tarde. Estou pesquisando casas de 3 quartos na zona sul, mas ainda não sei quanto o banco vai aprovar. Sem pressa, talvez ano que vem.',
    ],
  },
}

function corDaClassificacao(classificacao: string) {
  const c = classificacao.toLowerCase()
  if (c.includes('quente')) return 'quente'
  if (c.includes('morno')) return 'morno'
  return 'frio'
}

function ehAnalise(dados: unknown): dados is Analise {
  const a = dados as Analise
  return (
    typeof a?.classificacao === 'string' &&
    typeof a.pontuacao === 'number' &&
    Array.isArray(a.informacoes) &&
    Array.isArray(a.faltando)
  )
}

// Traduz a resposta de erro da API (que pode nem ser JSON) numa frase para o visitante
async function mensagemDeErro(resposta: Response) {
  let detalhe: unknown
  try {
    detalhe = (await resposta.json()).detail
  } catch {
    // Página HTML do Render enquanto a API acorda ou reinicia
    return 'A API está acordando. Tente de novo em alguns segundos.'
  }
  if (resposta.status === 404 && typeof detalhe === 'string') return detalhe
  if (resposta.status === 422) return 'A mensagem não pôde ser processada. Confira o texto e tente de novo.'
  if (resposta.status >= 500) return 'A IA está instável agora. Tente de novo em alguns segundos.'
  return 'A API respondeu com erro. Tente de novo em alguns segundos.'
}

export default function Demo() {
  const [segmento, setSegmento] = useState<Segmento>('academia')
  const [indiceExemplo, setIndiceExemplo] = useState(0)
  const [mensagem, setMensagem] = useState(SEGMENTOS.academia.exemplos[0])
  const [carregando, setCarregando] = useState(false)
  const [demorando, setDemorando] = useState(false)
  const [erro, setErro] = useState('')
  const [analise, setAnalise] = useState<Analise | null>(null)

  // Acorda a API assim que a página abre (o plano gratuito do Render "dorme")
  useEffect(() => {
    fetch(`${API_URL}/`).catch(() => {})
  }, [])

  function limpar() {
    setAnalise(null)
    setErro('')
  }

  function trocarSegmento(novo: Segmento) {
    setSegmento(novo)
    setIndiceExemplo(0)
    setMensagem(SEGMENTOS[novo].exemplos[0])
    limpar()
  }

  function outroExemplo() {
    const exemplos = SEGMENTOS[segmento].exemplos
    const proximo = (indiceExemplo + 1) % exemplos.length
    setIndiceExemplo(proximo)
    setMensagem(exemplos[proximo])
    limpar()
  }

  async function qualificar() {
    if (!mensagem.trim()) {
      setErro('Escreva a mensagem do lead para analisar.')
      return
    }
    setCarregando(true)
    setDemorando(false)
    limpar()
    const aviso = setTimeout(() => setDemorando(true), 6000)
    const controle = new AbortController()
    const limite = setTimeout(() => controle.abort(), TEMPO_MAXIMO)

    try {
      const resposta = await fetch(`${API_URL}/qualificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmento, mensagem }),
        signal: controle.signal,
      })
      if (!resposta.ok) {
        setErro(await mensagemDeErro(resposta))
        return
      }
      const dados: unknown = await resposta.json()
      if (!ehAnalise(dados)) {
        setErro('A IA devolveu uma resposta incompleta. Tente de novo.')
        return
      }
      setAnalise(dados)
    } catch (e) {
      setErro(
        e instanceof DOMException && e.name === 'AbortError'
          ? 'A API demorou demais para responder. Tente de novo.'
          : 'Não foi possível falar com a API. Tente de novo em alguns segundos.',
      )
    } finally {
      clearTimeout(aviso)
      clearTimeout(limite)
      setCarregando(false)
      setDemorando(false)
    }
  }

  const temperatura = analise ? corDaClassificacao(analise.classificacao) : null
  const config = SEGMENTOS[segmento]

  return (
    <div className="demo">
      <div className="segmentos" role="group" aria-label="Tipo de negócio">
        {(Object.keys(SEGMENTOS) as Segmento[]).map((s) => (
          <button
            key={s}
            type="button"
            className={s === segmento ? 'ativo' : ''}
            onClick={() => trocarSegmento(s)}
            aria-pressed={s === segmento}
          >
            {SEGMENTOS[s].nome}
          </button>
        ))}
      </div>

      <div className="campo-topo">
        <label htmlFor="mensagem">{config.rotulo}</label>
        <button type="button" className="texto-botao" onClick={outroExemplo}>
          Outro exemplo
        </button>
      </div>
      <textarea
        id="mensagem"
        rows={5}
        maxLength={LIMITE}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        aria-describedby="contador"
      />
      <p id="contador" className="contador">
        {mensagem.length}/{LIMITE} caracteres
      </p>

      <button type="button" className="principal" onClick={qualificar} disabled={carregando}>
        {carregando ? 'Analisando…' : 'Qualificar lead'}
      </button>

      {demorando && (
        <p className="aviso">
          A API fica em espera quando ninguém usa. A primeira análise pode levar até um minuto.
        </p>
      )}

      {/* Sempre no DOM para leitores de tela anunciarem o que mudou */}
      <p className="erro" role="alert">
        {erro}
      </p>
      <p className="so-leitor" aria-live="polite">
        {analise ? `Análise pronta: lead ${analise.classificacao}, ${analise.pontuacao} de 100.` : ''}
      </p>

      {analise && temperatura && (
        <div className={`resultado ${temperatura}`}>
          <div className="placar">
            <span className="classe">Lead {analise.classificacao}</span>
            <span className="pontos">{analise.pontuacao}/100</span>
          </div>
          <div className="termometro" aria-hidden="true">
            <span style={{ left: `${Math.min(100, Math.max(0, analise.pontuacao))}%` }} />
          </div>

          <p className="resumo">{analise.resumo}</p>

          {analise.informacoes.length > 0 && (
            <dl className="dados">
              {analise.informacoes.map((info) => (
                <div key={info.campo}>
                  <dt>{info.campo}</dt>
                  <dd>{info.valor}</dd>
                </div>
              ))}
            </dl>
          )}

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

      <p className="nota-demo">
        Esta demo chama minha API em produção (FastAPI + Gemini).{' '}
        <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer">
          Ver documentação →
        </a>
      </p>
    </div>
  )
}
