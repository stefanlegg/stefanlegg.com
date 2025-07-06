# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Type checking
bun run check
```

### Linting & Formatting
```bash
# Format code with Biome
bunx @biomejs/biome format --write .

# Lint code with Biome
bunx @biomejs/biome lint .

# Check formatting and linting
bunx @biomejs/biome check .
```

Note: There are typos in package.json lines 7-8 that need fixing for proper script execution.

## Architecture

This is an Astro-based portfolio website with the following structure:

### Content Collections
- **Blog Posts** (`src/content/posts/`): Markdown files with frontmatter containing `title`, `publishedAt`, `description`, `isPublish`, and `isDraft`
- **Bookmarks** (`src/content/bookmarks/`): External links with `title`, `publishedAt`, `description`, and `url`
- **Projects** (`src/data/projects.ts`): TypeScript array defining portfolio projects

### Core Components
- **Layout** (`src/layouts/Layout.astro`): Main page wrapper with SEO setup
- **Pages** (`src/pages/`): Route-based pages using file-system routing
- **Components** (`src/components/`): Reusable UI components organized by function

### Configuration
- **Site Config** (`src/data/config.ts`): Site URL configuration
- **Personal Info** (`src/data/presentation.ts`): Profile data and social links
- **Content Schema** (`src/content/config.ts`): Zod schemas for content validation

### Styling
- Tailwind CSS with custom font variable `--font-open-sans`
- Component-scoped styles in Astro files
- Global styles in `src/styles/`

### TypeScript
- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- Type definitions in `src/utils/types/`

## Key Development Notes

1. **Adding Blog Posts**: Create new `.md` files in `src/content/posts/` with required frontmatter
2. **Adding Projects**: Update the array in `src/data/projects.ts`
3. **Component Development**: Follow existing Astro component patterns, use TypeScript interfaces for props
4. **URL Handling**: Use the `removeTrailingSlash` utility for consistent URL formatting
5. **Date Formatting**: Use the `formatDate` utility for consistent date display
6. **Content Processing**: The `convertAsteriskToStrongTag` utility handles markdown emphasis conversion

## Build Output
Static site builds to `./dist/` directory, ready for deployment to any static hosting service.