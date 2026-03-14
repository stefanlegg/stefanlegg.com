import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Fetch fonts at build time
async function loadFonts() {
  const [jetbrainsMono, crimsonPro] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/crimson-pro@latest/latin-400-normal.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  return { jetbrainsMono, crimsonPro };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: {
      title: post.data.title,
      description: post.data.description,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };

  const { jetbrainsMono, crimsonPro } = await loadFonts();

  // Colors from your site
  const bg = "#08090e";
  const text = "#d0d8ea";
  const textMuted = "rgba(208, 216, 234, 0.72)";
  const accent = "#a080c4";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: bg,
          padding: "60px 80px",
          fontFamily: "Crimson Pro",
        },
        children: [
          // Top row: site name + sparkle
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      color: accent,
                      fontSize: "28px",
                      fontFamily: "JetBrains Mono",
                    },
                    children: "*",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      color: textMuted,
                      fontSize: "24px",
                      fontFamily: "JetBrains Mono",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                    },
                    children: "STEFAN LEGG",
                  },
                },
              ],
            },
          },

          // Middle: title
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      color: text,
                      fontSize: title.length > 40 ? "52px" : "64px",
                      fontWeight: 400,
                      lineHeight: 1.2,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                description
                  ? {
                      type: "p",
                      props: {
                        style: {
                          color: textMuted,
                          fontSize: "28px",
                          lineHeight: 1.5,
                          margin: 0,
                          maxWidth: "900px",
                        },
                        children:
                          description.length > 120
                            ? description.slice(0, 117) + "..."
                            : description,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },

          // Bottom: URL + accent bar
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      color: textMuted,
                      fontSize: "22px",
                      fontFamily: "JetBrains Mono",
                    },
                    children: "stefanlegg.com",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      width: "180px",
                      height: "6px",
                      backgroundColor: accent,
                      borderRadius: "3px",
                      boxShadow: `0 0 20px ${accent}`,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "JetBrains Mono",
          data: jetbrainsMono,
          weight: 500,
          style: "normal",
        },
        {
          name: "Crimson Pro",
          data: crimsonPro,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
