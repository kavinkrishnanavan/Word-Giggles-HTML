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
        prompt: "You are a childrens Joke Maker AI. Your Job is to create a joke for the word entered. The format I want the answered to be returned is in a list which is [word , meaning of word , joke]. Here is the word : " + input.value
      })
    });

    const data = await res.json();

    if (data.answer) {
      let answer = JSON.parse(data.answer);
      output.textContent = answer[2];
    } else {
      output.textContent = "No response";
    }

  } catch (err) {
    console.error(err);
    output.textContent = "Request failed";
  }
});
