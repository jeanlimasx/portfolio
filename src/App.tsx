import { useEffect, useRef, useState } from 'react'
import ComIA from './components/ComIA'
import Demo from './components/Demo'
import EstudoDeCaso from './components/EstudoDeCaso'
import ProjetoCard from './components/ProjetoCard'
import { GITHUB_URL, LINKEDIN_URL, PROJETOS } from './dados/projetos'

const PREFIXO = '#caso-'

function projetoDaUrl() {
  const hash = window.location.hash
  if (!hash.startsWith(PREFIXO)) return null
  return PROJETOS.find((p) => p.id === hash.slice(PREFIXO.length))?.id ?? null
}

export default function App() {
  // O estudo aberto vive na URL (#caso-<id>): dá para mandar o link e o "voltar" fecha
  const [aberto, setAberto] = useState<string | null>(projetoDaUrl)
  const origem = useRef<HTMLElement | null>(null)
  const abertoPorClique = useRef(false)

  useEffect(() => {
    const aoMudarHash = () => {
      const id = projetoDaUrl()
      // Fechado pelo "voltar" do navegador: não há mais entrada para desfazer
      if (!id) abertoPorClique.current = false
      setAberto(id)
    }
    window.addEventListener('hashchange', aoMudarHash)
    return () => window.removeEventListener('hashchange', aoMudarHash)
  }, [])

  // Devolve o foco ao botão que abriu o estudo
  useEffect(() => {
    if (!aberto && origem.current) {
      origem.current.focus({ preventScroll: true })
      origem.current = null
    }
  }, [aberto])

  function abrir(id: string, elemento: HTMLElement) {
    origem.current = elemento
    abertoPorClique.current = true
    window.location.hash = `caso-${id}`
  }

  function fechar() {
    if (abertoPorClique.current) {
      // Desfaz a entrada que o clique criou no histórico
      abertoPorClique.current = false
      window.history.back()
    } else {
      // Chegou por link direto: limpa a URL sem sair do site
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setAberto(null)
    }
  }

  const projetoAberto = PROJETOS.find((p) => p.id === aberto) ?? null

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <div className="faixa-escura abertura-faixa">
        <div className="pagina">
          <header className="topo">
            <a className="marca" href="#conteudo" aria-label="Jean Lima, ir para o conteúdo">
              Jean <span>Lima</span>
            </a>
            <nav aria-label="Principal">
              <a className="ancora" href="#projetos">Projetos</a>
              <a className="ancora" href="#ia">IA</a>
              <a className="ancora" href="#demo">Demo</a>
              <a className="ancora" href="#sobre">Sobre</a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
            </nav>
          </header>

          <section className="abertura" aria-labelledby="titulo-principal">
            <div className="intro">
              <p className="status">
                <span className="status-ponto" aria-hidden="true" />
                Disponível para vaga de desenvolvedor júnior
              </p>
              <h1 id="titulo-principal">
                Construo software que resolve <span className="marca-texto">problemas reais</span> de
                negócio.
              </h1>
              <p>
                Sou Jean Lima, estudante de Engenharia de Software. Antes de programar, passei anos em
                vendas consultivas, com mais de R$ 1,4 milhão vendidos. Hoje construo aplicações web,
                APIs e soluções com IA, do banco de dados ao deploy, usando o Claude Code como parceiro
                de desenvolvimento.
              </p>
              <ul className="chips" aria-label="Tecnologias que uso">
                {['Python', 'FastAPI', 'React', 'TypeScript', 'Next.js', 'Supabase', 'Claude Code'].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="chamadas">
                <a className="botao" href="#projetos">
                  Ver projetos
                </a>
                <a className="botao secundario" href="#ia">
                  Como uso IA
                </a>
              </div>
            </div>

            {/* Vitrine decorativa: os mesmos prints aparecem nos cartões com texto alternativo */}
            <div className="vitrine" aria-hidden="true">
              {['caderneta', 'alvorada', 'qualificador'].map((id) => {
                const capa = PROJETOS.find((p) => p.id === id)!.capa
                return (
                  <img
                    key={id}
                    className={`vitrine-${id}`}
                    src={capa.src}
                    alt=""
                    width={capa.largura}
                    height={capa.altura}
                    decoding="async"
                  />
                )
              })}
            </div>
          </section>
        </div>
      </div>

      <main id="conteudo">
        <div className="pagina">
          <section className="projetos" id="projetos" aria-labelledby="projetos-titulo">
            <p className="rotulo-secao">01 — Projetos</p>
            <h2 id="projetos-titulo">Do problema ao deploy.</h2>
            <p className="subtitulo">
              Quatro projetos reais, um deles para cliente. Abra um estudo de caso para ver telas,
              fluxo e as decisões técnicas por trás de cada um.
            </p>

            {PROJETOS.map((p, i) => (
              <ProjetoCard
                key={p.id}
                projeto={p}
                invertido={i % 2 === 1}
                prioridade={i === 0}
                onAbrir={abrir}
              />
            ))}
          </section>
        </div>

        <ComIA />

        <div className="pagina">
          <section className="laboratorio" id="demo" aria-labelledby="demo-titulo">
            <div className="laboratorio-texto">
              <p className="rotulo-secao">03 — Demo ao vivo</p>
              <h2 id="demo-titulo">Teste o qualificador de leads</h2>
              <p>
                Projeto em andamento: um SDR de IA que estou desenvolvendo para o setor de vendas da
                empresa onde trabalho e, no futuro, para academias. Cole a mensagem de alguém
                interessado na academia e veja como a IA classificaria esse contato.
              </p>
              <ul className="destaques">
                <li>Temperatura do lead (frio, morno ou quente) e nota de 0 a 100</li>
                <li>O que a pessoa já contou e o que ainda falta perguntar</li>
                <li>Sugestão da próxima mensagem do vendedor</li>
              </ul>
              <p className="laboratorio-nota">
                Também funciona para o mercado imobiliário: troque o tipo de negócio na demo.
              </p>
            </div>

            <Demo />
          </section>

          <section className="sobre" id="sobre" aria-labelledby="sobre-titulo">
            <p className="rotulo-secao">04 — Sobre</p>
            <h2 id="sobre-titulo">Vendas e engenharia, do mesmo lado.</h2>
            <div className="pilares">
              <div>
                <h3>Entendo o problema.</h3>
                <p>
                  Anos de vendas consultivas me ensinaram a ouvir o cliente antes de propor qualquer
                  solução.
                </p>
              </div>
              <div>
                <h3>Construo a solução.</h3>
                <p>
                  Do banco de dados ao deploy: APIs em Python, interfaces em React e TypeScript,
                  Postgres com Supabase.
                </p>
              </div>
              <div>
                <h3>Aplico IA com cuidado.</h3>
                <p>
                  Saída estruturada, validação e plano B quando o modelo falha, porque IA em produção
                  precisa ser previsível.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="faixa-escura" id="contato">
        <div className="pagina rodape">
          <div>
            <p className="rodape-titulo">
              Vamos <span className="marca-texto">conversar?</span>
            </p>
            <p className="rodape-texto">Estou buscando minha primeira vaga como desenvolvedor júnior.</p>
          </div>
          <div className="links">
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>

      <EstudoDeCaso projeto={projetoAberto} onFechar={fechar} />
    </>
  )
}
