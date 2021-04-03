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
        type: BookmarkType.tool,
        title: "Squoosh",
        content: "An open source web app for compressing and resizing images.",
        link: "https://squoosh.app/",
    },
    {
        type: BookmarkType.tool,
        title: "Spline",
        content: "A design tool for creating 3D web experiences.",
        link: "https://spline.design/",
    },
    {
        type: BookmarkType.tool,
        title: "CodeTour",
        content: "CodeTour is a VS Code extension which allows you to record and view guided walkthroughs of your code.",
        link: "https://github.com/microsoft/codetour",
    },
    {
        type: BookmarkType.tool,
        title: "Baserow",
        content: "A no-code platform for building databases in an excel-like web interface. Essentially an open source alternative to Airtable.",
        link: "https://baserow.io/",
    },
    {
        type: BookmarkType.tool,
        title: "Microsoft PowerToys",
        content:
            "Microsoft PowerToys is a set of free utilities for users to customize and improve their Windows 10 experience. Some of its best features include a color picker, image resizer, and the ability to create custom snap zones.",
        link: "https://github.com/microsoft/PowerToys",
    },
    {
        type: BookmarkType.tool,
        title: "Cloudflare Pages",
        content:
            "Cloudflare Pages is a JAMstack platform for frontend developers to collaborate and deploy websites. Unlimited sites, unlimited requests, unlimited bandwidth... wow!",
        link: "https://pages.cloudflare.com/",
    },
    {
        type: BookmarkType.tweet,
        title: "@sarah_edo",
        content: "A small thread on why JS devs might find Go interesting (this thread is not for Go devs, it is intentionally 101) 🧵",
        link: "https://twitter.com/sarah_edo/status/1366068234370256897",
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
        title: "@addyosmani",
        content:
            "How Spotify makes text on images more readable: a CSS linear-gradient overlay. More common these days, but still an effective technique for better color contrast.",
        link: "https://twitter.com/addyosmani/status/1365735686838493187",
    },
];

export default bookmarks;
