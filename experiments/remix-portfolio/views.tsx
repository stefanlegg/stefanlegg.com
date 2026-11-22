import work from "../../src/data/work.ts";
import presentation from "../../src/data/presentation.ts";
import { SITE_URL } from "../../src/data/config.ts";
import { posts, type Post } from "./content.ts";
import { postIndex, article, bookmarkIndex, postLink } from "./archives.tsx";
import { example } from "./project-examples.tsx";
import { chartProjects, projects, type Project } from "./projects.ts";

const homeTitle = "Stefan Legg · Software Engineer";
export type Page =
	| { kind: "home" }
	| { kind: "project"; project: Project }
	| { kind: "posts" }
	| { kind: "bookmarks" }
	| { kind: "article"; post: Post };

function chart(selected?: Project) {
	const dx = selected ? (50 - selected.x) * 0.32 : 0;
	const dy = selected ? (50 - selected.y) * 0.22 : 0;
	const camera = `translate(${dx}%, ${dy}%) scale(${selected ? 1.14 : 1})`;
	return (
		<nav class="chart" aria-label="Featured project orbits">
			<div class="chart-plane" style={{ transform: camera }}>
				<div class="orbital-plane">
					<div class="planet" aria-hidden="true" />
					{chartProjects(selected).map((item) => (
						<div class={`orbit orbit-${item.body}`} key={item.slug}>
							<a
								id={"star-" + item.slug}
								href={item.path}
								aria-label={item.title}
								class="marker"
								aria-current={selected === item ? "page" : undefined}
							>
								<span class="orbiter" aria-hidden="true" />
								<span class="marker-label">{item.label}</span>
							</a>
						</div>
					))}
				</div>
			</div>
		</nav>
	);
}

function workHistory() {
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
								const mapped = projects.find((project) => project.title === item.title)!;
								return (
									<li key={item.title}>
										<a class="entry" href={mapped.path} id={"index-" + mapped.slug}>
											<span class="entry-heading">
												{item.title}
												<span aria-hidden="true">→</span>
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
			<p class="techs">{[project.company, ...project.techs].join(" · ")}</p>
			<a class="source" href={project.link}>
				View project ↗
			</a>
		</>
	);
}

function projectControls(project?: Project) {
	if (!project)
		return (
			<nav class="map-controls" aria-label="Browse projects">
				<span>Featured projects</span>
				<a href={projects[0].path} id="browse-projects">
					Explore all {projects.length} →
				</a>
			</nav>
		);
	const index = projects.indexOf(project);
	const previous = projects[(index + projects.length - 1) % projects.length];
	const next = projects[(index + 1) % projects.length];
	return (
		<nav class="map-controls" aria-label="Browse projects">
			<span>
				Project {index + 1} of {projects.length}
			</span>
			<div>
				<a
					id="prev-project"
					href={previous.path}
					aria-label={"Previous project: " + previous.title}
					title={previous.title}
				>
					←
				</a>
				<a
					id="next-project"
					href={next.path}
					aria-label={"Next project: " + next.title}
					title={next.title}
				>
					→
				</a>
			</div>
		</nav>
	);
}

export function documentView(assets: { script: string; css: string }, page: Page) {
	const project = page.kind === "project" ? page.project : undefined;
	const post = page.kind === "article" ? page.post : undefined;
	const section =
		page.kind === "posts" || post ? "Posts" : page.kind === "bookmarks" ? "Bookmarks" : "Home";
	const title = project?.title ?? post?.title ?? section;
	const description =
		project?.description ??
		post?.description ??
		(section === "Bookmarks"
			? "Tools and references saved by Stefan Legg."
			: presentation.description);
	const image = new URL(
		post ? "/og/" + post.slug + ".png" : "/og-image.png",
		process.env.CF_PAGES_URL || SITE_URL,
	).href;

	return (
		<html lang="en" data-rmx-preserve-attrs="data-instant">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{page.kind === "home" ? homeTitle : title + " · Stefan Legg"}</title>
				<meta name="description" content={description} />
				<meta property="og:type" content={post ? "article" : "website"} />
				<meta property="og:title" content={page.kind === "home" ? homeTitle : title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={image} />
				<meta name="twitter:card" content="summary_large_image" />
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
							{[
								["Home", "/"],
								["Posts", "/posts/"],
								["Bookmarks", "/bookmarks/"],
							].map(([name, href]) => (
								<a
									id={"nav-" + name.toLowerCase()}
									href={href}
									aria-current={
										name === section ? (project || post ? "location" : "page") : undefined
									}
								>
									{name}
								</a>
							))}
						</nav>
					</header>
					<main>
						{section === "Home" && (
							<>
								<div class="scene">
									<div
										class={project ? "identity compact-identity" : "identity copy"}
										data-rmx-key="identity"
									>
										{introduction(!project)}
									</div>
									<div class="chart-panel">
										{chart(project)}
										{projectControls(project)}
									</div>
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
								{project ? (
									<>{example(project)}</>
								) : (
									<>
										{workHistory()}
										{posts[0] && (
											<section class="section" aria-labelledby="writing-title">
												<h2 class="section-label" id="writing-title">
													Writing
												</h2>
												{postLink(posts[0])}
											</section>
										)}
									</>
								)}
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
							</>
						)}
						{page.kind === "posts" && postIndex()}
						{page.kind === "bookmarks" && bookmarkIndex()}
						{post && article(post)}
					</main>
					<footer class="site-footer">
						<span>© {new Date().getUTCFullYear()} Stefan Legg</span>
						<button
							data-rmx-key="clock"
							data-rmx-preserve-dom
							id="visit-clock"
							hidden
							type="button"
							aria-label="Mission elapsed time"
							aria-pressed="false"
						></button>
					</footer>
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
