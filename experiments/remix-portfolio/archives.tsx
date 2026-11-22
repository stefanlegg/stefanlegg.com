import { unsafeHTML } from "remix/component";
import { posts, bookmarks, type Post } from "./content.ts";

const dateFormat = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

function published(date: Date) {
	return (
		<time class="techs" dateTime={date.toISOString().slice(0, 10)}>
			{dateFormat.format(date)}
		</time>
	);
}

export function postLink(post: Post) {
	return (
		<a class="post-link" id={"post-" + post.slug} href={post.path}>
			{published(post.date)}
			<strong>
				{post.title} <span aria-hidden="true">→</span>
			</strong>
			<span>{post.description}</span>
		</a>
	);
}

export function postIndex() {
	return (
		<section class="archive">
			<h1 tabIndex={-1}>Posts</h1>
			<div class="post-list">{posts.map(postLink)}</div>
		</section>
	);
}
export function article(post: Post) {
	return (
		<article class="reading">
			<a href="/posts/" class="return" id="back-to-posts">
				← Posts
			</a>
			<h1 tabIndex={-1}>{post.title}</h1>
			{published(post.date)}
			<div class="post" innerHTML={unsafeHTML(post.html)} />
		</article>
	);
}
export function bookmarkIndex() {
	return (
		<section class="archive">
			<h1 tabIndex={-1}>Bookmarks</h1>
			<form class="filter" role="search" hidden id="bookmark-filter">
				<label for="bookmark-query">Filter bookmarks</label>
				<input
					id="bookmark-query"
					type="search"
					placeholder="Title, description, or domain"
					autoComplete="off"
				/>
				<output id="bookmark-count" for="bookmark-query" aria-live="polite"></output>
			</form>
			<ul class="saved-links">
				{bookmarks.map((b) => (
					<li key={b.slug} data-bookmark="">
						<a class="saved-link" id={"bookmark-" + b.slug} href={b.url}>
							<strong>
								{b.title} <span aria-hidden="true">↗</span>
							</strong>
							<span class="techs">{b.domain}</span>
							<span class="entry-description">{b.description}</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
