import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { Projeto } from '../dados/projetos'

type Tela = 'computador' | 'celular'

type Props = {
  projeto: Projeto | null
  onFechar: () => void
}

export default function EstudoDeCaso({ projeto, onFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const [tela, setTela] = useState<Tela>('computador')

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (projeto && !d.open) {
      // Projetos feitos para celular, ou telas pequenas, começam na versão de celular
      const pequeno = window.matchMedia('(max-width: 860px)').matches
      const temCelular = projeto.prints.celular.length > 0
      setTela(temCelular && (pequeno || projeto.telaInicial === 'celular') ? 'celular' : 'computador')
      // O foco automático do showModal rola a página de fundo; guardamos e devolvemos a posição
      const y = window.scrollY
      d.showModal()
      d.scrollTop = 0
      titulo.current?.focus({ preventScroll: true })
      window.scrollTo(0, y)
    } else if (!projeto && d.open) {
      d.close()
    }
  }, [projeto])

  // Esc fecha o <dialog> sozinho; aqui só avisamos o App para atualizar a URL
  function aoFecharNativo() {
    if (projeto) onFechar()
  }

  // Clique no fundo escurecido (fora do conteúdo) fecha
  function aoClicar(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogo.current) onFechar()
  }

  const prints = projeto ? projeto.prints[tela] : []
  const temCelular = (projeto?.prints.celular.length ?? 0) > 0

  return (
    <dialog
      ref={dialogo}
      className="caso"
      aria-labelledby="caso-titulo"
      onClose={aoFecharNativo}
      onClick={aoClicar}
    >
      {projeto && (
        <div className="caso-conteudo">
          <header className="caso-topo">
            <h2 id="caso-titulo" ref={titulo} tabIndex={-1}>
              {projeto.nome}
            </h2>
            <button type="button" className="fechar" onClick={onFechar}>
              Fechar
            </button>
          </header>

          <p className="frase">{projeto.frase}</p>
          <ul className="chips" aria-label="Tecnologias">
            {projeto.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <section className="caso-prints" aria-label="Telas do projeto">
            {temCelular && (
              <div className="segmentos" role="group" aria-label="Versão das telas">
                {(['computador', 'celular'] as Tela[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={t === tela ? 'ativo' : ''}
                    aria-pressed={t === tela}
                    onClick={() => setTela(t)}
                  >
                    {t === 'computador' ? 'Computador' : 'Celular'}
                  </button>
                ))}
              </div>
            )}
            <div className={`galeria ${tela}`}>
              {prints.map((p) => (
                <figure key={p.src}>
                  <img
                    src={p.src}
                    alt={p.alt}
                    width={p.largura}
                    height={p.altura}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </section>

          <section>
            <h3>O que é</h3>
            <p>{projeto.oQueE}</p>
          </section>

          <section>
            <h3>Como funciona</h3>
            <ol className="passos">
              {projeto.comoFunciona.map((passo) => (
                <li key={passo}>{passo}</li>
              ))}
            </ol>
          </section>

          <section>
            <h3>Como foi feito</h3>
            <dl className="decisoes">
              {projeto.comoFoiFeito.map((d) => (
                <div key={d.titulo}>
                  <dt>{d.titulo}</dt>
                  <dd>{d.texto}</dd>
                </div>
              ))}
            </dl>
          </section>

          <details className="desafios">
            <summary>{projeto.desafiosTitulo}</summary>
            <ul>
              {projeto.desafios.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>

          {projeto.observacao && <p className="observacao">{projeto.observacao}</p>}

          <div className="links caso-links">
            {projeto.links.map((l) => (
              <a key={l.url} href={l.url} {...(l.url.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}>
                {l.rotulo} {!l.url.startsWith('#') && <span aria-hidden="true">↗</span>}
              </a>
            ))}
            {projeto.codigoPrivado && <span className="privado">{projeto.codigoPrivado}</span>}
          </div>
        </div>
      )}
    </dialog>
  )
}
