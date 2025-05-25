export type Project = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "Shopify: Web Admin",
    techs: ["React", "TypeScript", "Rails"],
    link: "https://shopify.com",
  },
  {
    title: "Shopify: Cart Transform Function API",
    techs: ["TypeScript", "Rust"],
    link: "https://shopify.dev/docs/api/functions/latest/cart-transform",
  },
  {
    title: "Shopify: Polaris",
    techs: ["React", "TypeScript"],
    link: "https://polaris.shopify.com/",
  },
  {
    title: "Lenovo: LanSchool Air",
    techs: ["TypeScript", "Angular"],
    link: "https://lanschool.com/solutions/lanschool-air",
  },
];

export default projects;
