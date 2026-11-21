import { unsafeHTML } from "remix/component";
import presentation from "../../src/data/presentation.ts";
import { itemPath, moonsPerOrbit, orbitPath, planets, type Planet, type Scene } from "./system.ts";

const moonPositions = [
	[23, 23],
	[78, 29],
	[74, 76],
	[22, 72],
];
const qty = (p: Planet) => `${p.items.length} ${p.unit}${p.items.length === 1 ? "" : "s"}`;

function sky(scene: Scene) {
	const { planet, orbit, item } = scene;
	const moons = planet?.items.slice(orbit * moonsPerOrbit, (orbit + 1) * moonsPerOrbit) ?? [];
	const selectedIndex = moons.findIndex((moon) => moon === item);
	const point = moonPositions[selectedIndex];
	const pan = point
		? `translate(${(50 - point[0]) * 0.07}%,${(50 - point[1]) * 0.07}%) scale(1.025)`
		: "none";
	return (
		<nav
			class="sky"
			aria-label={planet ? planet.name + " moons" : "Solar system"}
			data-focused={planet?.id}
		>
			<div class="camera" style={{ transform: pan }} data-rmx-key="camera">
				<div class="tracks system-tracks" aria-hidden="true">
					<i />
					<i />
					<i />
				</div>
				<div class="sun" aria-hidden="true"></div>
				{planets.map((p) => {
					const selected = p === planet,
						hidden = !!planet && !selected;
					const style = {
						left: p.x + "%",
						top: p.y + "%",
						transform: selected ? `translate(${50 - p.x}cqw,${50 - p.y}cqh)` : "none",
					};
					return (
						<div
							class={"anchor " + p.id}
							data-rmx-key={"body-" + p.id}
							data-selected={selected || undefined}
							data-away={hidden || undefined}
							style={style}
							inert={hidden || undefined}
						>
							<a
								class="planet-link"
								id={"planet-" + p.id}
								href={orbitPath(p)}
								aria-label={p.name + ", " + qty(p)}
								aria-current={selected && !item && !orbit ? "page" : undefined}
							>
								<span class="surface" aria-hidden="true">
									<i class="satellite-specks" />
								</span>
								<span class="planet-tag">{p.name}</span>
							</a>
						</div>
					);
				})}
				{planet && (
					<div class="moon-field" data-rmx-key="moons">
						<div class="tracks moon-tracks" aria-hidden="true">
							<i />
							<i />
						</div>
						{moons.map((moon, i) => (
							<a
								class="moon-link"
								id={"moon-" + moon.slug}
								key={moon.slug}
								aria-current={moon === item ? "page" : undefined}
								style={{ left: moonPositions[i][0] + "%", top: moonPositions[i][1] + "%" }}
								href={itemPath(planet, moon)}
							>
								<span class="lunar-rock" aria-hidden="true" />
								<span class="moon-tag">{moon.title}</span>
							</a>
						))}
					</div>
				)}
			</div>
		</nav>
	);
}

function orbitControls({ planet, orbit }: Scene) {
	if (!planet) return <p class="map-hint">Choose a planet to explore.</p>;
	const total = planet.items.length;
	const pages = Math.ceil(total / moonsPerOrbit);
	return (
		<div class="orbit-controls">
			<a href="/" id="leave-orbit">
				← Solar system
			</a>
			<span>
				{pages > 1
					? `Moons ${orbit * moonsPerOrbit + 1}–${Math.min((orbit + 1) * moonsPerOrbit, total)} of ${total}`
					: qty(planet)}
			</span>
			{pages > 1 && (
				<nav class="orbit-pages" aria-label="Browse moons">
					{orbit > 0 && (
						<a href={orbitPath(planet, orbit - 1)} id="previous-orbit" aria-label="Previous moons">
							←
						</a>
					)}
					{orbit + 1 < pages && (
						<a href={orbitPath(planet, orbit + 1)} id="next-orbit" aria-label="Next moons">
							→
						</a>
					)}
				</nav>
			)}
		</div>
	);
}

function directory({ planet, item, orbit }: Scene) {
	if (!planet)
		return (
			<>
				<section class="section">
					<h2 class="section-label">Explore</h2>
					<ul class="routes">
						{planets.map((p) => (
							<li key={p.id}>
								<a href={orbitPath(p)} id={"section-" + p.id}>
									<span class={"mini-body " + p.id} aria-hidden="true" />
									<span>
										<strong>{p.name}</strong>
										<span class="blurb">{p.summary}</span>
									</span>
									<span class="meta">
										{qty(p)} <span aria-hidden="true">→</span>
									</span>
								</a>
							</li>
						))}
					</ul>
				</section>
				<section class="section">
					<h2 class="section-label">About</h2>
					<p class="about-text">
						I've been building for the web for <strong>over 15 years</strong> — everything from
						scrappy experiments to tools used by <strong>millions around the world</strong>. These
						days, I'm focused on React, TypeScript, and making commerce better for everyone.
					</p>
				</section>
			</>
		);
	if (item)
		return (
			<section class="section reading" aria-labelledby="item-title">
				<a href={orbitPath(planet, orbit)} id="parent-planet" class="return">
					← {planet.name}
				</a>
				<h1 tabIndex={-1} id="item-title">
					{item.title}
				</h1>
				<p class="meta">{item.meta}</p>
				<p class="about-text">{item.description}</p>
				{item.article && <article class="article" innerHTML={unsafeHTML(item.article)} />}
				{item.link && (
					<a class="source" href={item.link}>
						{planet.id === "bookmarks" ? "Open bookmark" : "View project"} ↗
					</a>
				)}
			</section>
		);
	return (
		<section class="section" aria-labelledby="directory-title">
			<h2 class="section-label" id="directory-title">
				{planet.name}
			</h2>
			<ul class="routes">
				{planet.items.map((moon) => (
					<li key={moon.slug}>
						<a id={"index-" + moon.slug} href={itemPath(planet, moon)}>
							<span>
								<strong>{moon.title}</strong>
								<span class="blurb">{moon.description}</span>
							</span>
							<span class="arrow" aria-hidden="true">
								→
							</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}

export function documentView(assets: { script: string; css: string }, scene: Scene) {
	const { planet, item } = scene;
	const Heading = item ? "p" : "h1";
	const title = item?.title ?? planet?.name;
	return (
		<html lang="en" data-rmx-preserve-attrs="data-instant">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title ? title + " · Stefan Legg" : "Stefan Legg · Software Engineer"}</title>
				<meta
					name="description"
					content={item?.description ?? planet?.summary ?? presentation.description}
				/>
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
							<a id="nav-home" href="/" aria-current={!planet ? "page" : undefined}>
								Home
							</a>
							{planets.map((p) => (
								<a
									id={"nav-" + p.id}
									href={orbitPath(p)}
									aria-current={p === planet ? (item ? "location" : "page") : undefined}
								>
									{p.name}
								</a>
							))}
						</nav>
					</header>
					<main>
						<div class="scene-title">
							<div>
								<Heading class="name" tabIndex={item ? undefined : -1}>
									{planet ? (
										planet.name
									) : (
										<>
											<strong>Stefan</strong> Legg
										</>
									)}
								</Heading>
								<p class="role">{planet ? qty(planet) : "Software Engineer"}</p>
							</div>
							<p class="intro">
								{planet?.summary ?? (
									<>
										15+ years building for the web — currently at{" "}
										<a href="https://shopify.com">Shopify</a>.
									</>
								)}
							</p>
						</div>
						{sky(scene)}
						{orbitControls(scene)}
						{directory(scene)}
						<section class="section">
							<h2 class="section-label">Connect</h2>
							<div class="socials">
								{presentation.socials.map((s) => (
									<a key={s.link} href={s.link}>
										{s.label} / @stefanlegg
									</a>
								))}
							</div>
						</section>
					</main>
					<footer>
						Planet textures adapted from{" "}
						<a href="https://www.solarsystemscope.com/textures/">Solar System Scope</a> ·{" "}
						<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
					</footer>
				</div>
			</body>
		</html>
	);
}

export function notFound(css: string) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Page not found · Stefan Legg</title>
				<link rel="stylesheet" href={css} />
			</head>
			<body>
				<main class="page missing">
					<h1>Page not found</h1>
					<a href="/">Return to the solar system</a>
				</main>
			</body>
		</html>
	);
}
