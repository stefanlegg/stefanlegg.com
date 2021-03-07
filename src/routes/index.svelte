<script>
    import Card from "../components/Card.svelte";

    const cards = [
        {
            title: "Some Title 1",
            category: "Javascript",
            hovering: false,
        },
        {
            title: "Some Title 2",
            category: "Javascript",
            hovering: false,
        },
        {
            title: "Some Title 3",
            category: "Javascript",
            hovering: false,
        },
    ];
</script>

<svelte:head>
    <title>Stefan Legg - Software Engineer</title>
</svelte:head>

<p class="pretitle">Hey there, my name is Stefan.</p>
<h1>I build things for the web.</h1>
<p class="content">I’m a Software Engineer currently working on educational tools using Angular.</p>

<!-- 
{#each cards as c, index}
    <Card title={c.title} category={c.category} let:hovering />
    <br />
{/each} -->
<style>
    .pretitle {
        order: -1;
        font-size: 1.1875rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 1px;
        margin-bottom: 1rem;
    }

    .content {
        font-size: 1.5rem;
        font-weight: 300;
        line-height: 1.4;
    }

    @media (min-width: 670px) {
        .content {
            font-size: 2rem;
        }
    }
</style>
