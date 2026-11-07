import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isNetlifyBuild = process.env.WEBLAUD_DEPLOY_TARGET === "netlify";

export default defineConfig(async () => ({
  define: {
    // Read through app/lib/review-build.ts: noindex headers on the review copy only.
    __WEBLAUD_REVIEW_BUILD__: JSON.stringify(isNetlifyBuild),
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    // Manual team-review builds only. Imported lazily so the Node/PM2 release
    // builds without @netlify/vite-plugin-react-router installed.
    isNetlifyBuild && (await import("@netlify/vite-plugin-react-router")).default(),
  ],
}));
