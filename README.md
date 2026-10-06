# Portfólio — Jean Lima

Site pessoal publicado em https://jeanlimasx.vercel.app.

- **Demo ao vivo** do qualificador de leads com IA (segmentos academia e imobiliário), que chama a API em
  produção: https://qualificador-leads-ia-846p.onrender.com ([código](https://github.com/jeanlimasx/qualificador-leads-ia)).
- **Estudos de caso** de cada projeto (telas, fluxo e decisões técnicas), abertos num `<dialog>` nativo.
  Cada estudo tem link direto: `/#caso-qualificador`, `/#caso-caderneta`, `/#caso-alvorada`.

## Stack

React 19, TypeScript e Vite. CSS puro em `src/index.css`, sem bibliotecas de UI.
Desenvolvido com o Claude Code: o plano foi escrito e revisado antes da implementação.

## Estrutura

```
src/App.tsx                     montagem da página e estado do estudo aberto (sincronizado com o hash)
src/components/Demo.tsx         demo do qualificador
src/components/ProjetoCard.tsx  cartão de projeto
src/components/EstudoDeCaso.tsx estudo de caso em <dialog>
src/dados/projetos.ts           textos, links e prints de cada projeto
public/projetos/<projeto>/      prints (.webp, 1600x1000 computador e 780x1688 celular)
```

Para trocar um texto ou adicionar um print, edite `src/dados/projetos.ts`.

## Rodando localmente

```bash
npm install
npm run dev
```

A API só aceita chamadas das origens configuradas em `ORIGENS_PERMITIDAS` no Render
(`http://localhost:5173` é o padrão quando a variável não existe).
