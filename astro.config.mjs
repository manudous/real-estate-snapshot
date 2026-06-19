// @ts-check
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // GitHub Pages (project page): https://manudous.github.io/real-estate-snapshot/
  site: "https://manudous.github.io",
  base: "/real-estate-snapshot/",
  env: {
    schema: {
      CONTENT_ISLAND_ACCESS_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
        default: "INFORM_VALID_TOKEN",
      }),
    },
  },
});
