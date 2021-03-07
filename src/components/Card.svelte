<script lang="ts">
    import { TwitterIcon, BookmarkIcon, ToolIcon, ExternalLinkIcon } from "svelte-feather-icons";

    export let title: string;
    export let content: string;
    export let link: string;
</script>

<article itemscope itemtype="http://schema.org/CreativeWork">
    <div>
        <header>
            <h4 itemprop="name">
                {title}
            </h4>
        </header>
        <div class="content">
            {content}
        </div>
        <div class="footer">
            <a href={link}>Link <ExternalLinkIcon size="14" /></a>
        </div>
    </div>
</article>

<!-- 
    Ex for conditional slot usage: 

    {#if $$slots.content}
        <slot name="content" />
    {/if}

    {#if $$slots.footer}
        <div class="footer">
            <slot name="footer" />
        </div>
    {/if} 
-->
<style>
    article {
        position: relative;
        --bg-opacity: 1;
        background-color: rgba(34, 45, 61, 0.3);
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
        transition: all 0.2s ease-in-out;
        width: 100%;
        height: 100%;
        min-height: inherit;
        padding: 40px;
    }

    article:hover {
        background-color: rgba(34, 45, 61, 0.7);
    }

    article:focus {
        outline: -webkit-focus-ring-color auto 1px;
        background-color: rgba(34, 45, 61, 0.7);
    }

    @media (min-width: 992px) {
        article:hover {
            opacity: 1 !important;
            border: rgb(56 138 252);
        }
    }

    h4 {
        letter-spacing: 2px;
        text-transform: uppercase;
        --text-opacity: 1;
        color: #fff;
        color: rgba(255, 255, 255, var(--text-opacity));
    }

    .content {
        margin-bottom: 0.5em;
    }

    .footer {
        display: flex;
        justify-content: flex-end;
    }
</style>
