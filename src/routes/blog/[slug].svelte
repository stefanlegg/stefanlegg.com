<script context="module" lang="ts">
    export async function preload({ params }) {
        // the `slug` parameter is available because
        // this file is called [slug].svelte
        const res = await this.fetch(`blog/${params.slug}.json`);
        const data = await res.json();

        if (res.status === 200) {
            return { post: data };
        } else {
            this.error(res.status, data.message);
        }
    }
</script>

<script lang="ts">
    export let post: { slug: string; title: string; excerpt: string; printDate: string; printReadingTime: string; html: any };
</script>

<svelte:head>
    <title>{post.title}</title>
    <!--  Include canonical links to your blog -->
    <!--   <link rel="canonical" href="" /> -->

    <!-- Validate your twitter card with https://cards-dev.twitter.com/validator  -->
    <!-- Update content properties with your URL   -->
    <!-- 	<meta property="og:url" content=""} /> -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content={post.title} />
    <meta name="Description" content={post.excerpt} />
    <meta property="og:description" content={post.excerpt} />

    <!--  Link to your preferred image  -->
    <!-- 	<meta property="og:image" content="" /> -->

    <meta name="twitter:card" content="summary_large_image" />

    <!--  Link to your Domain  -->
    <!-- 	<meta name="twitter:domain" value="" /> -->

    <!--  Link to your Twitter Account  -->
    <!-- 	<meta name="twitter:creator" value="" /> -->

    <meta name="twitter:title" value={post.title} />
    <meta name="twitter:description" content={post.excerpt} />

    <!--  Link to your preferred image to be displayed on Twitter (832x520px) -->
    <!-- 	<meta name="twitter:image" content="" /> -->

    <meta name="twitter:label1" value="Published on" />
    <meta
        name="twitter:data1"
        value={new Date(post.printDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })}
    />
    <meta name="twitter:label2" value="Reading Time" />
    <meta name="twitter:data2" value={post.printReadingTime} />
</svelte:head>

<header>
    <p>{post.printDate} ~ {post.printReadingTime}</p>
    <h1>{post.title}</h1>
    <hr />
</header>
<div class="container">
    <article class="content">
        {@html post.html}
    </article>
    <hr />
</div>

<style>
    /*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
    .content :global(h2) {
        font-size: 1.4em;
        font-weight: 500;
    }

    .content :global(pre) {
        background-color: #f9f9f9;
        box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
        padding: 0.5em;
        border-radius: 2px;
        overflow-x: auto;
    }

    .content :global(pre) :global(code) {
        background-color: transparent;
        padding: 0;
    }

    .content :global(ul) {
        line-height: 1.5;
    }

    .content :global(li) {
        margin: 0 0 0.5em 0;
    }
</style>
