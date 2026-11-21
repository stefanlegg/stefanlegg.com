import { projects, type Project } from "./projects.ts";

const homeTitle = "Stefan Legg · Selected work";
const intro = "I’m Stefan Legg, a software engineer building commerce tools at Shopify. Explore my work through the star map or the project index.";

function chart(selected?: Project) {
  const dx = selected ? (50 - selected.x) * 0.44 : 0;
  const dy = selected ? (50 - selected.y) * 0.44 : 0;
  const camera = `translate(${dx}%, ${dy}%) scale(${selected ? 1.14 : 1})`;
  return <nav class="chart" aria-label="Project star map">
    <div class="chart-plane" style={{ transform: camera }}>
      <div class="orbits" aria-hidden="true"><i/><i/><i/></div>
      <div class="moon" aria-hidden="true"></div>
      {projects.map(item => <a key={item.slug} id={"star-" + item.slug} href={item.path}
        class="marker" aria-current={selected === item ? "page" : undefined}
        style={{ left: item.x + "%", top: item.y + "%" }}>
        <span class="starlight" aria-hidden="true"/><span class="marker-label">{item.title}</span>
      </a>)}
    </div>
  </nav>;
}

function projectIndex(selected?: Project) {
  return <section class="index" aria-labelledby="index-title">
    <h2 id="index-title">Project index</h2>
    <ul>{projects.map(item => <li key={item.slug}><a id={"index-" + item.slug} href={item.path}
      aria-current={selected === item ? "page" : undefined}>
      <span class="index-name">{item.title}</span><span class="company">{item.company}</span>
      <span class="arrow" aria-hidden="true">→</span>
    </a></li>)}</ul>
  </section>;
}

export function documentView(assets: { script: string; css: string }, project?: Project) {
  return <html lang="en" data-rmx-preserve-attrs="data-instant"><head>
    <meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>{project ? project.title + " · Stefan Legg" : homeTitle}</title>
    <meta name="description" content={project?.description ?? intro}/>
    <link rel="icon" href="/favicon.svg"/><link rel="stylesheet" href={assets.css}/>
    <script type="module" src={assets.script}></script>
  </head><body>
    <canvas id="stars" aria-hidden="true" data-rmx-key="starfield" data-rmx-preserve-dom></canvas>
    <div class="page">
      <header class="masthead"><a class="signature" href="/" aria-label="Stefan Legg, home">
        <span class="brand-star" aria-hidden="true">✦</span>Stefan Legg</a>
        <a class="github" href="https://github.com/stefanlegg">GitHub <span aria-hidden="true">↗</span></a>
      </header>
      <main>
        <div class="scene">
          <div class="copy" data-rmx-key="scene-copy">
            {project ? <a class="eyebrow return" href="/">← Overview</a> : <span class="eyebrow">Software engineer</span>}
            <h1 tabIndex={-1}>{project ? project.title : <>Selected <em>work.</em></>}</h1>
            <p class="summary">{project?.description ?? intro}</p>
            {project && <div class="details"><p class="techs">{project.techs.join(" · ")}</p>
              <a class="source" href={project.link}>View project <span aria-hidden="true">↗</span></a></div>}
          </div>
          {chart(project)}
        </div>
        {projectIndex(project)}
      </main>
    </div>
  </body></html>;
}

export function notFound(css: string) {
  return <html lang="en" data-rmx-preserve-attrs="data-instant"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Page not found · Stefan Legg</title><link rel="stylesheet" href={css}/>
  </head><body><main class="missing"><h1>Page not found</h1><a href="/">Return to selected work</a></main></body></html>;
}
