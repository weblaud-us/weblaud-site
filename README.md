# WebLaud Site

This is the official website for WebLaud, built with React Router v7.

## SEO Implementation

The website includes several built-in SEO features to ensure optimal search engine visibility:

### 1. Dynamic Sitemap & Robots.txt

- **Sitemap**: Automatically generated at `/sitemap.xml`. It lists all static routes (`/`, `/aboutUs`, `/services`, etc.) with `lastmod` and `priority` tags.
- **Robots.txt**: Served at `/robots.txt`, directing crawlers to the sitemap and allowing full access.

### 2. Structured Data (JSON-LD)

- **Organization Schema**: Implemented in `app/root.tsx`. It provides search engines with structured information about WebLaud, including:
  - Name and Logo
  - Social Media Links (Facebook, Instagram, LinkedIn)
  - Contact Information

### 3. Meta Tags

- **Page-Level SEO**: Each route (e.g., `home.tsx`, `aboutUs.tsx`) exports a `meta` function defining:
  - Title and Description
  - Open Graph (OG) tags for social sharing
  - Twitter Card tags
  - Keywords specific to the page content

### 4. Canonical URLs

- **Canonical Tags**: (Planned/In-progress) Ensures search engines know the preferred version of each page.

## 🔍 For SEO Experts

### Technical Architecture

- **Rendering**: Server-Side Rendering (SSR) via React Router v7 ensures crawlers receive fully rendered HTML, optimizing for crawl budget and indexing speed.
- **Status Codes**:
  - `404` pages return proper 404 HTTP status codes (handled in `app/root.tsx` ErrorBoundary).
  - `200` for valid pages.

### Verification & Testing

- **Rich Results**: Validate structured data using [Google Rich Results Test](https://search.google.com/test/rich-results).
- **Sitemap**: Validate XML syntax at `/sitemap.xml`.
- **Robots**: Verify directives at `/robots.txt`.

### How to Modify

- **Update Sitemap**: Edit `app/routes/sitemap.xml.ts` to add new dynamic routes or change priorities.
- **Update Global Schema**: Edit `app/root.tsx` -> `Layout` component -> `jsonLd` object.
- **Page Meta**: Edit the `meta` export in individual route files (e.g., `app/routes/home.tsx`).

## Development

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
