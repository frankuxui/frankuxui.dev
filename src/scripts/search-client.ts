import Fuse from "fuse.js";
import DOMPurify from "dompurify";

// Define el tipo base de los ítems buscables
type SearchItem = {
  type: "movement" | "artist" | "work";
  title: string;
  description: string;
  slug: string;
};

export async function initSearch() {
  const input = document.getElementById("search-input") as HTMLInputElement | null;
  const resultsDiv = document.getElementById("results");

  if (!input || !resultsDiv) {
    console.warn("Search input or results container not found in DOM.");
    return;
  }

  try {
    const response = await fetch("/api/search.json");
    if (!response.ok) throw new Error("No se pudo obtener los datos de búsqueda");
    const data = await response.json();
    console.log(data, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const searchableItems: SearchItem[] = [];

    data.forEach((movement: any) => {
      searchableItems.push({
        type: "movement",
        title: movement.title,
        description: movement.description,
        slug: movement.slug,
      });

      movement.artists?.forEach((artist: any) => {
        searchableItems.push({
          type: "artist",
          title: artist.name,
          description: artist.description,
          slug: artist.slug,
        });
      });

      movement.works?.forEach((work: any) => {
        searchableItems.push({
          type: "work",
          title: work.title,
          description: work.description,
          slug: work.slug,
        });
      });
    });

    const fuse = new Fuse(searchableItems, {
      keys: ["title", "description"],
      threshold: 0.3,
    });

    // Evento de entrada
    input.addEventListener("input", () => {
      const query = input.value.trim();
      resultsDiv.innerHTML = "";

      if (query.length < 2) return;

      const results = fuse.search(query).slice(0, 10);

      if (results.length === 0) {
        resultsDiv.innerHTML = `<p class="text-gray-500">Sin resultados</p>`;
        return;
      }
      console.log(results, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      results.forEach(({ item }) => {
        const cleanTitle = DOMPurify.sanitize(item.title);
        const cleanDesc = DOMPurify.sanitize(item.description || "");
        const link = `/${item.type}s/${item.slug}`;

        const resultHTML = `
          <div class="p-2 border-b">
            <a href="${link}" class="text-blue-600 font-semibold hover:underline">${cleanTitle}</a>
            <p class="text-sm text-gray-700">${cleanDesc}</p>
            <span class="text-xs text-gray-500 uppercase">${item.type}</span>
          </div>
        `;

        resultsDiv.innerHTML += resultHTML;
      });
    });

    // Limpiar resultados si haces clic fuera del input
    document.addEventListener("click", (event) => {
      if (event.target !== input && !resultsDiv.contains(event.target as Node)) {
        resultsDiv.innerHTML = "";
      }
    });

  } catch (error) {
    console.error("Error loading or processing search data:", error);
    if (resultsDiv) {
      resultsDiv.innerHTML = `<p class="text-red-500">Error al cargar resultados.</p>`;
    }
  }
}
