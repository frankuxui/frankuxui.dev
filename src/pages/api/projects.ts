import type { APIRoute } from "astro";
import projects from "@/data/projects.json";

export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(projects), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
