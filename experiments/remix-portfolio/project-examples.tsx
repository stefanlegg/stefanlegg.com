import type { Project } from "./projects.ts";

export function example(project: Project) {
	if (project.slug !== "cart-transform" && project.slug !== "catalogs") return null;
	const bundle = project.slug === "cart-transform";
	const choices = bundle ? ["Bundle", "Components"] : ["Retail", "Wholesale"];
	const rows = bundle
		? [
				[["1 × Writing kit", "$24"]],
				[
					["1 × Field notebook", "$16"],
					["1 × Pencil set", "$8"],
				],
			]
		: [
				[
					["Field notebook", "$16"],
					["Pencil set", "$8"],
				],
				[["Case of 12 notebooks", "$120"]],
			];
	return (
		<section class="sample" data-rmx-key={project.slug + "-example"}>
			<h2 class="section-label">{bundle ? "Bundle example" : "Catalog example"}</h2>
			<p>
				{bundle
					? "Switch between the kit and the items it expands into at checkout."
					: "Choose an audience to see its available products and prices."}
			</p>
			<fieldset>
				<legend>{bundle ? "Cart view" : "Audience"}</legend>
				{choices.map((choice, i) => (
					<label key={choice}>
						<input type="radio" name="example-view" value={String(i)} defaultChecked={i === 0} />
						<span>{choice}</span>
					</label>
				))}
			</fieldset>
			{rows.map((list, i) => (
				<dl class={"sample-lines view-" + i} key={choices[i]}>
					{list.map(([name, price]) => (
						<div key={name}>
							<dt>{name}</dt>
							<dd>{price}</dd>
						</div>
					))}
					{bundle && (
						<div class="total">
							<dt>Total</dt>
							<dd>$24</dd>
						</div>
					)}
				</dl>
			))}
		</section>
	);
}
