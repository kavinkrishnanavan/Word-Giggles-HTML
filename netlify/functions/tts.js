import { Putter } from "puter.js";

export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body || "{}");

    if (!text) return { statusCode: 400, body: "Text is required" };

    // Initialize puter.js TTS engine
    const tts = new Putter({ voice: "alloy" }); // example voice
    const audioBuffer = await tts.speak(text);  // returns ArrayBuffer or Uint8Array

    const buffer = Buffer.from(audioBuffer);

    return {
      statusCode: 200,
      headers: { "Content-Type": "audio/wav" },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: err.message };
  }
}
