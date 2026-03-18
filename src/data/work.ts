export type WorkItem = {
	title: string;
	description: string;
	link: string;
	techs: string[];
	company: string;
};

const work: WorkItem[] = [
	{
		title: "Compare-at Pricing",
		description:
			"Shipped compare-at price support for catalogs, showing original vs. discounted prices per audience.",
		link: "https://shopify.dev/docs/apps/build/b2b/manage-catalogs",
		techs: ["React", "TypeScript", "GraphQL"],
		company: "Shopify",
	},
	{
		title: "Unified Markets & Catalogs Experience",
		description:
			"Helped build the catalogs side of the new Markets experience. Markets define the audience (B2B, retail, regions); catalogs control what they see and at what price.",
		link: "https://www.shopify.com/editions/summer2024#expand-across-markets",
		techs: ["React", "TypeScript"],
		company: "Shopify",
	},
	{
		title: "Cart Transform",
		description:
			"Helped build cart transformation functions for price overrides, bundle expansion, and line item customization at checkout.",
		link: "https://www.shopify.com/editions/summer2023#cart-transform-api",
		techs: ["TypeScript", "Rust"],
		company: "Shopify",
	},
	{
		title: "Quantity Rules & Volume Pricing",
		description:
			"Shipped order minimums, maximums, and increments for catalogs to support real wholesale purchasing workflows.",
		link: "https://www.shopify.com/editions/summer2023#b2b-volume-pricing",
		techs: ["React", "TypeScript", "GraphQL"],
		company: "Shopify",
	},
	{
		title: "Catalogs",
		description:
			"Helped build the catalog system that controls which products are published to which customers. Powers both B2B and international commerce.",
		link: "https://www.shopify.com/editions/winter2023#expand-with-b2b",
		techs: ["React", "TypeScript", "GraphQL"],
		company: "Shopify",
	},
	{
		title: "Price Lists",
		description:
			"Shipped the pricing primitive that lets merchants set custom prices per audience. Supports fixed prices and percentage-based adjustments on any variant.",
		link: "https://shopify.dev/docs/api/admin-graphql/latest/objects/PriceList",
		techs: ["React", "TypeScript", "GraphQL"],
		company: "Shopify",
	},
	{
		title: "Polaris & Accessibility",
		description:
			"Ongoing contributions to Shopify's open-source design system and accessibility improvements across admin.",
		link: "https://www.shopify.com/editions/summer2023#app-design-guidelines-and-polaris",
		techs: ["React", "TypeScript"],
		company: "Shopify",
	},
	{
		title: "LanSchool Air",
		description:
			"Helped build the teacher-facing web interface for a cloud classroom management platform. Joined pre-launch, shipped through the COVID-19 remote learning surge.",
		link: "https://lanschool.com/solutions/lanschool-air",
		techs: ["TypeScript", "Angular"],
		company: "Lenovo (LanSchool)",
	},
];

export default work;
