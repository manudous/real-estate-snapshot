import { CONTENT_ISLAND_ACCESS_TOKEN } from "astro:env/server";
import { createClient } from "@content-island/api-client";

export const client = createClient({
  accessToken: CONTENT_ISLAND_ACCESS_TOKEN,
});
