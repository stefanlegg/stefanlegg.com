import bookmarks from "./_bookmarks.ts";

const contents = JSON.stringify(bookmarks);

export function get(req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
    });

    res.end(contents);
}
