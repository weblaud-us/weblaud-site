import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";

export default defineConfig({
  define: {
    // Read through app/lib/review-build.ts: noindex headers on the review copy only.
    __WEBLAUD_REVIEW_BUILD__: JSON.stringify(process.env.WEBLAUD_DEPLOY_TARGET === "netlify"),
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    // Manual team-review builds only. The Node/PM2 release never sets this.
    process.env.WEBLAUD_DEPLOY_TARGET === "netlify" && netlifyReactRouter(),
  ],
});
