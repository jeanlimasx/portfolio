import { useRef } from 'react'
import type { Projeto } from '../dados/projetos'

type Props = {
  projeto: Projeto
  invertido: boolean
  prioridade: boolean
  onAbrir: (id: string, origem: HTMLElement) => void
}

export default function ProjetoCard({ projeto, invertido, prioridade, onAbrir }: Props) {
  const { capa } = projeto
  const botao = useRef<HTMLButtonElement>(null)

  return (
    <article className={`cartao${invertido ? ' invertido' : ''}`} aria-labelledby={`titulo-${projeto.id}`}>
      {/* Atalho de mouse/toque: o botão abaixo é o caminho acessível para a mesma ação */}
      <div className="cartao-capa" onClick={() => botao.current && onAbrir(projeto.id, botao.current)}>
        <img
          src={capa.src}
          alt={capa.alt}
          width={capa.largura}
          height={capa.altura}
          loading={prioridade ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>

      <div className="cartao-corpo">
        <h3 id={`titulo-${projeto.id}`}>
          {projeto.nome}
          {projeto.status && <span className="selo">{projeto.status}</span>}
        </h3>
        <p className="frase">{projeto.frase}</p>
        <ul className="destaques">
          {projeto.destaques.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <ul className="chips" aria-label="Tecnologias">
          {projeto.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="cartao-acoes">
          <button
            type="button"
            ref={botao}
            className="abrir-caso"
            onClick={(e) => onAbrir(projeto.id, e.currentTarget)}
          >
            Ler estudo de caso <span aria-hidden="true">→</span>
          </button>
          <div className="links">
            {projeto.links.map((l) => (
              <a key={l.url} href={l.url} {...(l.url.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}>
                {l.rotulo}
              </a>
            ))}
            {projeto.codigoPrivado && <span className="privado">{projeto.codigoPrivado}</span>}
          </div>
        </div>
      </div>
    </article>
  )
}
