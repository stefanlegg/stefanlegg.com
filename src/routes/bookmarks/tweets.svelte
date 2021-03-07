<script lang="ts">
    import Card from "../../components/Card.svelte";
    import bookmarks from "./_bookmarks";

    const tweets = bookmarks.filter((bookmark) => bookmark.type === "tweet");
</script>

<svelte:head>
    <title>Stefan - Bookmarks (Tweets)</title>
</svelte:head>

{#each tweets as t, index}
    <Card title={t.title} content={t.content} link={t.link} />
    <br />
{/each}
