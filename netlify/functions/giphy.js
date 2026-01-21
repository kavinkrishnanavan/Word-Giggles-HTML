export const handler = async (event) => {
  try {
    const { query } = JSON.parse(event.body || "{}");

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Query is required" })
      };
    }

    const apiKey = process.env.GIPHY_API_KEY;
    if (!apiKey) {
      throw new Error("GIPHY_API_KEY missing");
    }

    const url =
      `https://api.giphy.com/v1/gifs/search` +
      `?api_key=${apiKey}` +
      `&q=${encodeURIComponent(query)}` +
      `&limit=100&rating=g`;

    const response = await fetch(url);
    const data = await response.json();

    // ✅ Allow small tolerance (recommended)
    const tolerance = 0.05; // 5%

    const squareGif = data.data.find(gif => {
      const w = Number(gif.images.original.width);
      const h = Number(gif.images.original.height);
      return Math.abs(w / h - 1) <= tolerance;
    });

    if (!squareGif) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No GIF found" })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gif: squareGif.images.original.url,
        width: squareGif.images.original.width,
        height: squareGif.images.original.height
      })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
