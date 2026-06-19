import { CONTENT_ISLAND_ACCESS_TOKEN } from "astro:env/server";
import { createClient } from "@content-island/api-client";

export const client = createClient({
  accessToken: CONTENT_ISLAND_ACCESS_TOKEN,
  // dev (astro dev) -> 'api' (contenido en vivo)
  // build (astro build) -> 'snapshot' (lee de ./content-island-snapshot.json, 0 llamadas a la API)
  mode: import.meta.env.PROD ? "snapshot" : "api",
});
