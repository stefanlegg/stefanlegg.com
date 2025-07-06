# stefanlegg.com - Personal Portfolio 🚀

A modern, fast portfolio website built with Astro, TypeScript, and Tailwind CSS.

Based on the [original theme/template](https://github.com/MaeWolff/astro-portfolio-template) designed by [Maxence Wolff](https://www.maxencewolff.com).

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) v5.7
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Bun
- **Linting/Formatting**: Biome

## 📁 Project Structure

```
src/
├── components/      # Reusable Astro components
├── content/         # Blog posts and bookmarks (Markdown)
├── data/           # Site configuration and projects data
├── layouts/        # Page layouts
├── pages/          # Route-based pages
├── styles/         # Global styles
└── utils/          # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

This starts the development server at `http://localhost:4321`

## 🧞 Commands

All commands are run from the root of the project:

| Command | Action |
| :------ | :----- |
| `bun install` | Install dependencies |
| `bun run dev` | Start local dev server at `localhost:4321` |
| `bun run build` | Build your production site to `./dist/` |
| `bun run preview` | Preview your build locally |
| `bun run check` | Check TypeScript and Astro errors |
| `bunx @biomejs/biome check` | Lint and format check |
| `bunx @biomejs/biome check --write` | Auto-fix linting and formatting |

## ✏️ Content & Data

All content and data can be found in two main locations:

- **Content** (`src/content/`): Markdown for blog posts and bookmarks
- **Data** (`src/data/`): Site configuration, projects, and personal information

## 🎨 Customization

- Modify site information in `src/data/` folder:
  - `config.ts` - Site URL
  - `presentation.ts` - Personal info and social links
  - `projects.ts` - Portfolio projects
  - `theme.ts` - Theme configuration

## 📄 License

This project is licensed under the MIT License.