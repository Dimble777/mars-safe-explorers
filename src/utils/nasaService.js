
const NASA_API_URL = "https://images-api.nasa.gov/search";

export async function getMarsImages() {
  const params = new URLSearchParams({
    q: "Mars Perseverance surface",
    media_type: "image",
    page_size: "12",
  });

  const response = await fetch(
    `${NASA_API_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `NASA API request failed: ${response.status}`
    );
  }

  const result = await response.json();

  const items = result.collection?.items ?? [];

  return items
    .map((item) => {
      const metadata = item.data?.[0];

      const image = item.links?.find(
        (link) => link.render === "image"
      );

      if (!metadata || !image?.href) {
        return null;
      }

      return {
        id: metadata.nasa_id,
        title: metadata.title,
        date: metadata.date_created,
        description: metadata.description ?? "",
        center: metadata.center ?? "NASA",
        imageUrl: image.href,
        sourceUrl:
          `https://images.nasa.gov/details/` +
          encodeURIComponent(metadata.nasa_id),
      };
    })
    .filter(Boolean);
}
