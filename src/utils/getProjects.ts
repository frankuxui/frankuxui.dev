export async function getProjects() {
  const isProd = import.meta.env.MODE === "production";
  const site = isProd ? import.meta.env.SITE : "http://localhost:4312";
  const apiUrl = new URL("/api/projects", site).href;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Error en fetch: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Error al obtener proyectos:", err);
    return [];
  }
}