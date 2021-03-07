<script>
    export let href;
    export let active = false;
</script>

<a {href} class:active>
    <span>
        <slot />
    </span>
</a>

<style>
    a {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        flex: 1 1 auto;
        border-color: var(--fg);
        border-bottom-width: 2px;
        color: var(--fg);
        box-shadow: none;
        border-bottom: 2px solid currentColor;
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
        transition: all 0.2s ease-in-out;
    }

    a:hover {
        color: var(--primary-light);
    }

    .active,
    .active:hover {
        border-color: var(--primary);
        color: var(--primary);
        border-bottom: 2px solid var(--primary);
    }

    span {
        font-weight: 600;
        box-sizing: border-box;
        border: 0 solid #e4e4e7;
        display: flex;
        align-items: center;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
    }
</style>
