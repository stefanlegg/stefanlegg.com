export type HeadTags = {
	title?: string;
	description?: string;
	noindex?: boolean;
	canonical?: string;
	og?: {
		title?: string;
		type?: string;
		description?: string;
		image?: string;
		alt?: string;
	};
	article?: {
		publishedTime?: string;
		modifiedTime?: string;
		author?: string;
	};
};
