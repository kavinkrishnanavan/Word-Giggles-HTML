const button = document.getElementById("askBtn");
const output = document.getElementById("output");
const input = document.getElementById("prompt");

button.addEventListener("click", async () => {
  output.textContent = "Thinking...";

  try {
    const res = await fetch("/.netlify/functions/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: input.value
      })
    });

    const data = await res.json();

    if (data.answer) {
      output.textContent = data.answer;
    } else {
      output.textContent = "No response";
    }

  } catch (err) {
    console.error(err);
    output.textContent = "Request failed";
  }
});
