import { projects, type Project } from "./projects.ts";

export function documentView(assets: { script: string; css: string }, project?: Project) {
  return <html lang="en"><head>
    <meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>{project ? project.title + " · Stefan Legg" : "Stefan Legg · Selected work"}</title>
    <meta name="description" content={project?.description ?? "Selected engineering work by Stefan Legg."}/>
    <link rel="icon" href="/favicon.svg"/><link rel="stylesheet" href={assets.css}/>
    <script type="module" src={assets.script}></script>
  </head><body>
    <header><a href="/">Stefan Legg</a></header>
    <main><h1 tabIndex={-1}>{project?.title ?? "Selected work"}</h1>
      {project && <><p>{project.description}</p><a href={project.link}>View project</a></>}
      <nav>{projects.map(item => <a href={item.path}>{item.title}</a>)}</nav>
    </main>
  </body></html>;
}

export function notFound(css: string) {
  return <html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Page not found · Stefan Legg</title><link rel="stylesheet" href={css}/>
  </head><body><main class="missing"><h1>Page not found</h1><a href="/">Return to selected work</a></main></body></html>;
}
