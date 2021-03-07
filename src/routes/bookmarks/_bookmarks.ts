enum BookmarkType {
    tweet = "tweet",
    tool = "tool",
    other = "other",
}

interface Bookmark {
    type: BookmarkType;
    title: string;
    content: string;
    link: string;
}

const bookmarks: Bookmark[] = [
    {
        type: BookmarkType.tweet,
        title: "@addyosmani",
        content:
            "How Spotify makes text on images more readable: a CSS linear-gradient overlay. More common these days, but still an effective technique for better color contrast.",
        link: "https://twitter.com/addyosmani/status/1365735686838493187",
    },
    {
        type: BookmarkType.tweet,
        title: "@BenLesh",
        content:
            "I'm not sure who needs to know this: But if you want to build a URL, or just get the parts of a URL, the `URL` object isn't half bad. (and it exists in both the DOM and Node).",
        link: "https://twitter.com/BenLesh/status/1366776104942452737",
    },
    {
        type: BookmarkType.tweet,
        title: "@sarah_edo",
        content: "A small thread on why JS devs might find Go interesting (this thread is not for Go devs, it is intentionally 101) 🧵",
        link: "https://twitter.com/sarah_edo/status/1366068234370256897",
    },
    {
        type: BookmarkType.tool,
        title: "Cloudflare Pages",
        content:
            "Cloudflare Pages is a JAMstack platform for frontend developers to collaborate and deploy websites. Unlimited sites, unlimited requests, unlimited bandwidth... wow!",
        link: "https://pages.cloudflare.com/",
    },
];

export default bookmarks;
