<script lang="ts">
    import { TwitterIcon, BookmarkIcon, ToolIcon } from "svelte-feather-icons";
    import TabContainer from "../../components/TabContainer.svelte";
    import Tab from "../../components/Tab.svelte";

    export let segment: string;
</script>

<div class="center">
    <h1>Bookmarks</h1>
    <h3>Gems from around the internet.</h3>

    <div class="wrapper">
        <TabContainer>
            <Tab href="/bookmarks" active={segment === undefined}>
                <BookmarkIcon size="18" />
                <span>All</span>
            </Tab>
            <Tab href="/bookmarks/tweets" active={segment === "tweets"}>
                <TwitterIcon size="18" />
                <span>Tweets</span>
            </Tab>
            <Tab href="/bookmarks/tools" active={segment === "tools"}>
                <ToolIcon size="18" />
                <span>Tools</span>
            </Tab>
        </TabContainer>
    </div>

    <slot />
</div>

<style>
    h1 {
        color: white;
        margin: 0 0 0.2em 0;
    }

    span {
        margin-left: 8px;
    }

    .wrapper {
        width: 100%;
        margin: 2rem 0;
    }

    .center {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
</style>
