import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { postImage } from "../../lib/post-image";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.isDraft);

  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };

  return new Response(await postImage(title, description), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
