<script lang="ts">
    import Card from "../../components/Card.svelte";
    import bookmarks from "./_bookmarks";

    const tools = bookmarks.filter((bookmark) => bookmark.type === "tool");
</script>

<svelte:head>
    <title>Stefan - Bookmarks (Tools)</title>
</svelte:head>

{#each tools as t, index}
    <Card title={t.title} content={t.content} link={t.link} />
    <br />
{/each}
