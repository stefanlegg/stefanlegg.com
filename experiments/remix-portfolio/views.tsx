import work from "../../src/data/work.ts";
import presentation from "../../src/data/presentation.ts";
import { SITE_URL } from "../../src/data/config.ts";
import { projects, type Project } from "./projects.ts";

const homeTitle = "Stefan Legg · Software Engineer";
const archive = (section: string) => new URL(section, SITE_URL).href;

function chart(selected?: Project) {
	const dx = selected ? (50 - selected.x) * 0.44 : 0;
	const dy = selected ? (50 - selected.y) * 0.44 : 0;
	const camera = `translate(${dx}%, ${dy}%) scale(${selected ? 1.14 : 1})`;
	return (
		<nav class="chart" aria-label="Project star map">
			<div class="chart-plane" style={{ transform: camera }}>
				<div class="orbits" aria-hidden="true">
					<i />
					<i />
					<i />
				</div>
				<div class="moon" aria-hidden="true"></div>
				{projects.map((item) => (
					<a
						key={item.slug}
						id={"star-" + item.slug}
						href={item.path}
						class={item.x > 62 ? "marker label-left" : "marker"}
						aria-current={selected === item ? "page" : undefined}
						style={{ left: item.x + "%", top: item.y + "%" }}
					>
						<span class="starlight" aria-hidden="true" />
						<span class="marker-label">{item.title}</span>
					</a>
				))}
			</div>
		</nav>
	);
}

function workHistory(selected?: Project) {
	return (
		<section class="section" aria-labelledby="work-title">
			<h2 class="section-label" id="work-title">
				Work
			</h2>
			{[...new Set(work.map((item) => item.company))].map((company) => (
				<div class="company-group" key={company}>
					<h3 class="company">{company}</h3>
					<ul class="entries">
						{work
							.filter((item) => item.company === company)
							.map((item) => {
								const mapped = projects.find((project) => project.title === item.title);
								return (
									<li key={item.title}>
										<a
											class="entry"
											href={mapped?.path ?? item.link}
											id={mapped && "index-" + mapped.slug}
											aria-current={mapped && mapped === selected ? "page" : undefined}
										>
											<span class="entry-heading">
												{item.title}
												<span aria-hidden="true">{mapped ? "→" : "↗"}</span>
											</span>
											<span class="entry-description">{item.description}</span>
											<span class="techs">{item.techs.join(" · ")}</span>
										</a>
									</li>
								);
							})}
					</ul>
				</div>
			))}
		</section>
	);
}

function introduction(onOverview: boolean) {
	const Name = onOverview ? "h1" : "p";
	return (
		<>
			<Name class="name" tabIndex={onOverview ? -1 : undefined}>
				<strong>Stefan</strong> Legg
			</Name>
			<p class="role">Software Engineer</p>
			<p class="hero-sub">
				15+ years building for the web — currently at <a href="https://shopify.com">Shopify</a>
			</p>
		</>
	);
}

function projectOverview(project: Project) {
	return (
		<>
			<a class="return" href="/">
				← Overview
			</a>
			<h1 tabIndex={-1}>{project.title}</h1>
			<p class="project-summary">{project.description}</p>
			<p class="techs">{project.techs.join(" · ")}</p>
			<a class="source" href={project.link}>
				View project ↗
			</a>
		</>
	);
}

export function documentView(assets: { script: string; css: string }, project?: Project) {
	return (
		<html lang="en" data-rmx-preserve-attrs="data-instant">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{project ? project.title + " · Stefan Legg" : homeTitle}</title>
				<meta name="description" content={project?.description ?? presentation.description} />
				<link rel="icon" href="/favicon.svg" />
				<link rel="stylesheet" href={assets.css} />
				<script type="module" src={assets.script}></script>
			</head>
			<body>
				<canvas
					id="stars"
					aria-hidden="true"
					data-rmx-key="starfield"
					data-rmx-preserve-dom
				></canvas>
				<div class="page">
					<header>
						<nav class="nav" aria-label="Main navigation">
							<a href="/" aria-current={project ? undefined : "page"}>
								Home
							</a>
							<a href={archive("posts/")}>Posts</a>
							<a href={archive("bookmarks/")}>Bookmarks</a>
						</nav>
					</header>
					<main>
						<div class="scene">
							<div
								class={project ? "identity compact-identity" : "identity copy"}
								data-rmx-key="identity"
							>
								{introduction(!project)}
							</div>
							{chart(project)}
							{project && (
								<div class="project-copy copy" data-rmx-key="project-copy">
									{projectOverview(project)}
								</div>
							)}
						</div>
						{!project && (
							<section class="section" aria-labelledby="about-title">
								<h2 class="section-label" id="about-title">
									About
								</h2>
								<p class="about-text">
									I've been building for the web for <strong>over 15 years</strong> — everything
									from scrappy experiments to tools used by{" "}
									<strong>millions around the world</strong>. These days, I'm focused on React,
									TypeScript, and making commerce better for everyone.
								</p>
							</section>
						)}
						{workHistory(project)}
						<section class="section" aria-labelledby="connect-title">
							<h2 class="section-label" id="connect-title">
								Connect
							</h2>
							<div class="socials">
								{presentation.socials.map((social) => (
									<a key={social.link} href={social.link}>
										{social.label} / @stefanlegg
									</a>
								))}
							</div>
						</section>
					</main>
				</div>
			</body>
		</html>
	);
}

export function notFound(css: string) {
	return (
		<html lang="en" data-rmx-preserve-attrs="data-instant">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Page not found · Stefan Legg</title>
				<link rel="stylesheet" href={css} />
			</head>
			<body>
				<main class="missing">
					<h1>Page not found</h1>
					<a href="/">Return to selected work</a>
				</main>
			</body>
		</html>
	);
}
