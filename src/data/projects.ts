export type Project = {
	title: string;
	techs: string[];
	link: string;
};

const projects: Project[] = [
	{
		title: "Shopify Admin",
		techs: ["React", "TypeScript", "Rails"],
		link: "https://shopify.com",
	},
	{
		title: "Cart Transform Function API",
		techs: ["TypeScript", "Rust"],
		link: "https://shopify.dev/docs/api/functions/latest/cart-transform",
	},
	{
		title: "Polaris",
		techs: ["React", "TypeScript"],
		link: "https://polaris.shopify.com/",
	},
	{
		title: "LanSchool Air",
		techs: ["TypeScript", "Angular"],
		link: "https://lanschool.com/solutions/lanschool-air",
	},
];

export default projects;
