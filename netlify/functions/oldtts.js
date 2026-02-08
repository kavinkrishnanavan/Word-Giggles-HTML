import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body || "{}");

    if (!text) {
      return {
        statusCode: 400,
        body: "Text is required"
      };
    }

    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "canopylabs/orpheus-v1-english",
        voice: "troy",
        input: text,
        response_format: "wav"
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq error:", error);
      return {
        statusCode: 500,
        body: error
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/wav"
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: err.message
    };
  }
}
