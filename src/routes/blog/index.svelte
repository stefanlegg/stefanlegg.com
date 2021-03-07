<script context="module" lang="ts">
    export function preload() {
        return this.fetch(`blog.json`)
            .then((r: { json: () => any }) => r.json())
            .then((posts: { slug: string; title: string; excerpt: string; printDate: string; html: any }[]) => {
                return { posts };
            });
    }
</script>

<script lang="ts">
    export let posts: { slug: string; title: string; excerpt: string; printDate: string; html: any }[];
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<h1>Recent posts</h1>

<div class="container">
    <h1>Blog</h1>
    {#each posts as post, index}
        {#if index}
            <hr />
        {/if}
        <div class="post-item">
            <h3>
                <a rel="prefetch" href="blog/{post.slug}">{post.title}</a>
            </h3>
            <p>{post.excerpt}</p>
            <div class="post-item-footer">
                <span class="post-item-date">— {post.printDate}</span>
            </div>
        </div>
    {/each}
</div>

<style>
    ul {
        margin: 0 0 1em 0;
        line-height: 1.5;
    }
</style>
