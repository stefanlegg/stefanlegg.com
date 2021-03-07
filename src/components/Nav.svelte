<script lang="ts">
    export let segment: string;
</script>

<header>
    <div class="container">
        <div class="nav-wrapper">
            <nav>
                <div class="nav-content">
                    <ul>
                        <li>
                            <a aria-current={segment === undefined ? "page" : undefined} href="/">Home</a>
                        </li>
                        <!-- <li>
                            <a aria-current={segment === "posts" ? "page" : undefined} href="posts">Posts</a>
                        </li> -->
                        <li>
                            <a aria-current={segment === "bookmarks" ? "page" : undefined} href="bookmarks">Bookmarks</a>
                        </li>
                        <li>
                            <a aria-current={segment === "contact" ? "page" : undefined} href="contact">Contact</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</header>

<style>
    header {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        box-sizing: inherit;
        display: block;
        padding: 3.125rem 0;
        flex: none;
    }

    .container {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        box-sizing: inherit;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    @media (max-width: 800px) {
        .container {
            justify-content: center;
        }
    }

    .nav-wrapper {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        box-sizing: inherit;
        display: flex;
        align-items: center;
    }

    nav {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        box-sizing: inherit;
        display: flex;
        align-items: center;
    }

    .nav-content {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        box-sizing: inherit;
    }

    ul {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        box-sizing: inherit;
        padding: 0;
        margin: 0;
        list-style-type: none;
        display: flex;
    }

    li {
        font-size: 1rem;
        line-height: 1.625;
        color: var(--fg);
        list-style-type: none;
        box-sizing: inherit;
        position: relative;
    }

    a {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
        margin: 0.75rem 1.25rem;
        white-space: nowrap;
        transition: color 0.2s linear;
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
        transition: all 0.2s ease-in-out;
        color: var(--color-text);

        box-shadow: none;
        border-bottom: 2px solid currentColor;
    }

    a:hover {
        color: var(--primary-light);
        border-bottom: 2px solid var(--primary-light);
    }

    [aria-current],
    [aria-current]:hover {
        border-bottom-color: var(--primary);
    }
</style>
