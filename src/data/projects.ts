export type Project = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "Shopify Admin",
    techs: ["React", "TypeScript", "Rails"],
    link: "https://shopify.com",
  },
  {
    title: "Polaris",
    techs: ["React", "TypeScript"],
    link: "https://polaris.shopify.com/",
  },
  {
    title: "Shopify Functions",
    techs: ["TypeScript", "Rust"],
    link: "https://github.com/shopify/function-examples",
  },
];

export default projects;
