// Seção "Como eu desenvolvo com IA": o processo e exemplos reais dos projetos deste site

const PASSOS = [
  {
    titulo: 'Defino o problema e o plano',
    texto:
      'Antes de qualquer código, escrevo o que precisa ser feito, para quem e o que não pode quebrar. O plano é revisado e aprovado antes da implementação.',
  },
  {
    titulo: 'Dou contexto para a IA',
    texto:
      'Nos projetos maiores, mantenho um arquivo de regras (CLAUDE.md) com stack, decisões de arquitetura e armadilhas conhecidas, para o Claude Code não reinventar o que já foi decidido.',
  },
  {
    titulo: 'A IA implementa em etapas pequenas',
    texto:
      'Peço uma parte de cada vez, com build e lint rodando a cada etapa. Assim cada mudança é pequena o suficiente para eu ler e entender.',
  },
  {
    titulo: 'Eu reviso, testo e decido',
    texto:
      'Leio o que foi escrito, testo no navegador e no celular, questiono escolhas e corrijo o rumo. A responsabilidade pelo que vai ao ar é minha.',
  },
]

const EXEMPLOS = [
  {
    projeto: 'Alvorada',
    texto:
      'O Next.js 16 trocou o middleware.ts por proxy.ts e tornou cookies() assíncrono. Documentei isso no CLAUDE.md do projeto para a IA não usar padrões antigos.',
  },
  {
    projeto: 'Qualificador',
    texto:
      'A IA às vezes devolvia texto sem acento. Chamei a API direto, descartei a hipótese de erro nos critérios e corrigi a causa: uma regra explícita no prompt.',
  },
]

export default function ComIA() {
  return (
    <section className="faixa-escura com-ia" id="ia" aria-labelledby="ia-titulo">
      <div className="pagina">
        <div className="com-ia-topo">
          <div>
            <p className="rotulo-secao">02 — Desenvolvimento com IA</p>
            <h2 id="ia-titulo">
              Desenvolvo com IA. <span className="marca-texto">Decido como engenheiro.</span>
            </h2>
          </div>
          <p className="com-ia-intro">
            Uso o Claude Code no dia a dia para planejar, escrever e revisar código. A IA acelera; o
            entendimento do problema, as decisões de arquitetura e a revisão continuam comigo.
          </p>
        </div>

        <ol className="passos-ia">
          {PASSOS.map((p, i) => (
            <li key={p.titulo}>
              <span className="passo-numero" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="exemplos-ia">
          <h3>Exemplos reais</h3>
          <ul>
            {EXEMPLOS.map((e) => (
              <li key={e.projeto}>
                <strong>{e.projeto}</strong>
                <p>{e.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
