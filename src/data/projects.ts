import ShopifyLogo from "@/components/logos/Shopify.astro";

export type Project = {
  title: string;
  techs: string[];
  link: string;
  logo?: ((props: Record<string, any>) => any) | string;
};

const projects: Project[] = [
  {
    title: "Shopify Admin",
    techs: ["React", "TypeScript", "Rails"],
    link: "https://shopify.com",
    logo: ShopifyLogo,
  },
  {
    title: "Cart Transform Function API",
    techs: ["TypeScript", "Rust"],
    link: "https://shopify.dev/docs/api/functions/latest/cart-transform",
    logo: ShopifyLogo,
  },
  {
    title: "Polaris",
    techs: ["React", "TypeScript"],
    link: "https://polaris.shopify.com/",
    logo: ShopifyLogo,
  },
  {
    title: "LanSchool Air",
    techs: ["TypeScript", "Angular"],
    link: "https://lanschool.com/solutions/lanschool-air",
    logo: "/logos/lanschool.png",
  },
];

export default projects;
