<div align="center">
  <img src="public/weblaud-logo.svg" alt="Weblaud Logo" width="240" />
  <br /><br />
  
  <p align="center">
    <strong>Modern Full-Cycle Software Engineering & Innovation Lab</strong><br />
    Building high-performance operations platforms, B2B SaaS applications, mobile apps, and custom AI/LLM integrations.
  </p>

  <p align="center">
    <a href="https://weblaud.com"><img src="https://img.shields.io/badge/Website-weblaud.com-0A84FF?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" /></a>
    <img src="https://img.shields.io/badge/React_Router-v7.9-E0234E?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router v7" />
    <img src="https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  </p>
</div>

---

## 🚀 Overview

**Weblaud Site** is the official web platform and administrative control panel for **Weblaud LLC**, engineered with **React Router v7** in SSR (Server-Side Rendering) mode, **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

The platform is architected for:
- ⚡ **Sub-second performance & 60fps animations** with hardware-accelerated GPU compositing and smooth scrolling.
- 🎯 **GEO (Generative Engine Optimization) & SEO Excellence** with built-in dynamic sitemaps, JSON-LD schemas, and `llms.txt` endpoints for AI crawlers.
- 🧮 **Interactive Cost Estimation** with real-time sprint calculations and project scope configurators.
- 🔒 **Restricted Administrative Control Panel** (`/cpadmin`) for managing case studies, team members, services, job postings, client reviews, and user submissions.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose / Highlights |
| :--- | :--- | :--- |
| **Framework** | [React Router v7](https://reactrouter.com/) | Server-Side Rendering (SSR), modern data loading, type-safe actions & route tree |
| **Core Library** | [React 19](https://react.dev/) | React Server Components, concurrent features, ultra-responsive UI |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict type safety and automatic route type generation |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation zero-runtime engine with custom theme tokens & CSS variables |
| **Motion & Physics** | [Framer Motion 12](https://www.framer.com/motion/) | Liquid morphing tabs, 3D card rotators, exit transitions, layout animations |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) | Inertia-based momentum smooth scrolling |
| **Icons & Media** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) | Feather, Lucide, FontAwesome, SimpleIcons, and custom SVG assets |
| **Forms & Validation**| [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | High-performance controlled forms with strict schema validation |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) | Unstyled accessible dropdowns, modals, and slot primitives |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski/) | Clean, dark-mode stacked toast notifications |
| **Build & Tooling** | [Vite 7](https://vitejs.dev/) & [Vitest](https://vitest.dev/) | Lightning-fast HMR, optimized production bundler, unit testing |

---

## 🌐 Routes Directory

### 1. 🏢 Public Experience Routes
| Route | File Path | Description |
| :--- | :--- | :--- |
| `/` | `app/routes/home.tsx` | Main landing page featuring Hero, Specialty switcher, Stats, Trusted Tech Stack marquee, and Reviews |
| `/aboutus` | `app/routes/aboutus.tsx` | Company story, core values, leadership team 3D stack, and agency culture |
| `/services` | `app/routes/services.tsx` | Comprehensive breakdown of engineering capabilities & engagement models |
| `/projects` | `app/routes/projects.tsx` | Case studies and client portfolio showcase |
| `/projects/:slug` | `app/routes/projects.$slug.tsx` | In-depth case study detail with Morphing Tabs, architecture diagrams, and metrics |
| `/calculator` | `app/routes/calculator.tsx` | Interactive software development cost estimation tool |
| `/insights` | `app/routes/insights.tsx` | Engineering blog, industry guides, and software architecture articles |
| `/insights/:slug` | `app/routes/insights.$slug.tsx` | Full article reader with author metadata and related reads |
| `/career` | `app/routes/career.tsx` | Open roles, company benefits, and remote hiring process |
| `/career/:slug` | `app/routes/career.$slug.tsx` | Job posting details, requirements, and responsibilities |
| `/career/:slug/apply`| `app/routes/career.$slug.apply.tsx` | Application form with resume upload and portfolio links |
| `/contact` | `app/routes/contactUs.tsx` | Contact inquiry form with country code selector and direct strategy booking |
| `/privacy-policy` | `app/routes/privacy-policy.tsx` | User data privacy & security policies |
| `/terms-of-service` | `app/routes/terms-of-service.tsx` | Platform terms, IP ownership, and service agreements |

---

### 2. 🤖 GEO & Intent Landing Pages (AI / SEO Content System)
| Route | File Path | Purpose |
| :--- | :--- | :--- |
| `/vs/:slug` | `app/routes/vs.$slug.tsx` | Comparison pages (e.g., Weblaud vs In-House, Weblaud vs Offshore Agencies) |
| `/solutions/:slug` | `app/routes/solutions.$slug.tsx`| Tailored solution landing pages (ERP, B2B SaaS, Custom Web/Mobile) |
| `/best-software-agency` | `app/routes/best-software-agency.tsx` | Comprehensive guide on evaluating top software development agencies |
| `/software-development-cost` | `app/routes/software-development-cost.tsx` | In-depth software pricing breakdown and sprint timeline benchmarks |
| `/for-startups` | `app/routes/for-startups.tsx` | Tailored technical partner offering for early-stage and venture-backed startups |

---

### 3. 🔍 Search Engines & LLM Endpoints
| Route | File Path | Purpose |
| :--- | :--- | :--- |
| `/robots.txt` | `app/routes/robots.txt.ts` | Crawler access directives and sitemap indexing declaration |
| `/sitemap.xml` | `app/routes/sitemap.xml.ts` | Dynamic XML sitemap containing all static, dynamic, and intent pages |
| `/llms.txt` | `app/routes/llms.txt.ts` | Standardized AI/LLM summary documentation for agentic models |
| `/llms-full.txt` | `app/routes/llms-full.txt.ts` | Exhaustive knowledge base for LLM retrieval and search grounding |

---

### 4. 🔐 Executive Admin Panel (`/cpadmin`)
| Route | File Path | Functionality |
| :--- | :--- | :--- |
| `/cpadmin/login` | `app/routes/admin/login.tsx` | Executive authentication portal with session cookie encryption |
| `/cpadmin` | `app/routes/admin/dashboard.tsx` | Key performance indicators, recent activity, and submission overview |
| `/cpadmin/projects` | `app/routes/admin/projects/index.tsx` | Case studies management table |
| `/cpadmin/projects/new` | `app/routes/admin/projects/new.tsx` | Create new case study |
| `/cpadmin/projects/:id/edit` | `app/routes/admin/projects/edit.tsx` | Edit case study content and images |
| `/cpadmin/insights` | `app/routes/admin/insights/index.tsx` | Insight/blog articles manager |
| `/cpadmin/insights/new` | `app/routes/admin/insights/new.tsx` | Publish new blog post |
| `/cpadmin/insights/:id/edit`| `app/routes/admin/insights/edit.tsx` | Edit blog post and SEO metadata |
| `/cpadmin/services` | `app/routes/admin/services/index.tsx` | Service offerings catalog manager |
| `/cpadmin/services/new` | `app/routes/admin/services/new.tsx` | Add new service |
| `/cpadmin/services/:id/edit`| `app/routes/admin/services/edit.tsx` | Update service description and deliverables |
| `/cpadmin/careers` | `app/routes/admin/careers/index.tsx` | Career openings manager |
| `/cpadmin/careers/new` | `app/routes/admin/careers/new.tsx` | Post new job opening |
| `/cpadmin/careers/:id/edit` | `app/routes/admin/careers/edit.tsx` | Edit job requirements and status |
| `/cpadmin/team` | `app/routes/admin/team.tsx` | Manage core leadership & team members |
| `/cpadmin/testimonials` | `app/routes/admin/testimonials.tsx` | Client reviews and rating management |
| `/cpadmin/faqs` | `app/routes/admin/faqs.tsx` | Global frequently asked questions manager |
| `/cpadmin/about` | `app/routes/admin/about.tsx` | Update company timeline and milestone stats |
| `/cpadmin/calculator-config`| `app/routes/admin/calculator-config.tsx` | Configure hourly/sprint rates and pricing formulas |
| `/cpadmin/contact-info` | `app/routes/admin/contact-info.tsx` | Manage global business email, phone, and address |
| `/cpadmin/contact-submissions` | `app/routes/admin/contact-submissions.tsx` | Inquiries submitted via the Contact page |
| `/cpadmin/estimate-submissions`| `app/routes/admin/estimate-submissions.tsx` | Estimates requested from the Cost Calculator |
| `/cpadmin/applicants` | `app/routes/admin/applicants.tsx` | Job applications submitted via Careers |
| `/cpadmin/applicants/export` | `app/routes/admin/applicants.export.ts` | Export applicants & resumes to CSV/spreadsheet format |

---

## 📂 Project Structure

```
weblaud-site/
├── app/
│   ├── assets/              # Logos, brand SVGs, 3D illustrations, image assets
│   ├── components/
│   │   ├── aboutUs/         # About page sections (Story, Values, Team 3D stack)
│   │   ├── admin/           # Admin layout components, sidebar, data tables
│   │   ├── contact/         # Contact forms, booking cards, contact info
│   │   ├── home/            # Hero, Specialty switcher, Stats, Tech marquee
│   │   ├── ui/              # Reusable design system (Buttons, Tabs, Badges, Portals)
│   │   ├── footer.tsx       # Global footer with navigation links & schema
│   │   └── header.tsx       # Global responsive navigation bar
│   ├── data/                # Landing catalog, comparison tables, country codes
│   ├── hooks/               # Custom hooks (blur animations, scroll triggers)
│   ├── lib/                 # Server utilities, session management, ease physics
│   ├── routes/              # React Router v7 file-based routing architecture
│   ├── root.tsx             # Root document, global SEO meta, HTML shell
│   ├── routes.ts            # Route configuration and URL mapping
│   └── app.css              # Tailwind CSS v4 entrypoint and global utilities
├── public/                  # Static assets (favicons, site logos, robots, og-images)
├── package.json             # Dependencies and build scripts
├── vite.config.ts           # Vite bundler configuration
└── tsconfig.json            # Strict TypeScript configuration
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/weblaud/weblaud-site.git

# Navigate into the project directory
cd weblaud-site

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server with HMR
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Typecheck & Testing
```bash
# Validate route type definitions and TypeScript compilation
npm run typecheck

# Run unit and integration tests
npm run test
```

### Production Build
```bash
# Compile and build server & client production bundles
npm run build

# Start the production SSR server
npm run start
```

---

## ⚡ Performance & Design Highlights

- **Hardware Acceleration**: GPU compositing with `transform-gpu`, `translate3d`, and `contain: content` rules for silky 60fps scrolling on mobile devices.
- **Liquid Morphing Tabs**: Spring physics animation that seamlessly morphs tab pills between active states.
- **3D Card Stacks**: Dynamic 3D rotation, blur reveals, and depth scaling on team and feature showcases.
- **Dark Luxury Aesthetic**: Obsidian backgrounds, curated `#0A84FF` brand accents, subtle top highlights, and glassmorphism.

---

<div align="center">
  <sub>© 2026 Weblaud LLC. All rights reserved. Built with pride for high-performance software engineering.</sub>
</div>
