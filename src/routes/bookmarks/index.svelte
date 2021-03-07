<script lang="ts">
    import Card from "../../components/Card.svelte";
    import bookmarks from "./_bookmarks";
</script>

<svelte:head>
    <title>Stefan - Bookmarks (All)</title>
</svelte:head>

{#each bookmarks as b, index}
    <Card title={b.title} content={b.content} link={b.link} />
    <br />
{/each}
