# stefanlegg.com - Personal Portfolio 🚀

A modern, fast portfolio website built with Astro, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) v7.4
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
- Node.js 22.23.5 (see `.nvmrc`)

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

## 📄 License

This project is licensed under the MIT License.
