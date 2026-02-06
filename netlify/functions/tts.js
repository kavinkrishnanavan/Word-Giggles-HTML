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

    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramKey) {
      return {
        statusCode: 500,
        body: "Deepgram API key not configured"
      };
    }

    const response = await fetch(
      "https://api.deepgram.com/v1/text-to-speech",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${deepgramKey}:`
          ).toString("base64")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          voice: "alloy",        // example voice
          format: "wav"          // request WAV output
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Deepgram error:", error);
      return {
        statusCode: response.status,
        body: error
      };
    }

    // Deepgram returns the audio as binary
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
