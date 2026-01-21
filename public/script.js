const button = document.getElementById("askBtn");
const output = document.getElementById("output");
const word = document.getElementById("word");
const meaning = document.getElementById("meaning");
const one = document.getElementById("joke1");
const two = document.getElementById("joke2");
const wt = document.getElementById("wt");
const mt = document.getElementById("mt");
const jt = document.getElementById("jt");
const input = document.getElementById("prompt");
const gifImg = document.getElementById("gif");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

button.addEventListener("click", async () => {
  output.textContent = "Making...";

  try {
    const res = await fetch("/.netlify/functions/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: "You are a childrens Joke Maker AI. Your Job is to create a joke for the word entered. If the word doesn't exist, tell this Wrong Word. The format I want the answered to be returned is in a list which is [word , meaning of word , joke] (only if the word has a correct spelling). Here is the word : " + input.value
      })
    });

    const data = await res.json();

    console.log(data.answer)

    if (data.answer) {
      let answer = JSON.parse(data.answer);
      output.textContent = "";
      word.textContent = capitalize(answer[0]);
      meaning.textContent = capitalize(answer[1]);
      let joke = answer[2].match(/[^.!?]+[.!?]/g);
      one.textContent = capitalize(joke[0].trim());
      two.textContent = capitalize(joke[1].trim());
      wt.textContent = "Word";
      mt.textContent = "Meaning";
      jt.textContent = "Joke";
      const query = input.value.trim();
      if (!query) return;

      gifImg.style.display = "none";

      try {
        const res = await fetch("/.netlify/functions/giphy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query })
        });

        const data = await res.json();

        if (data.gif) {
          gifImg.src = data.gif;
          gifImg.style.display = "block";
        } else {
          //alert(data.error || "No GIF found");
        }

      } catch (err) {
        console.error(err);
        //alert("Failed to load GIF");
      }
    } else {
      output.textContent = "Please Try again or Recheck your spelling !";
    }

  } catch (err) {
    console.error(err);
    output.textContent = "Please Try again or Recheck your spelling !";
  }
});

