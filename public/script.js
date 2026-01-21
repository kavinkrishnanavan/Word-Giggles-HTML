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

const Gifs = {
  prerequisite: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  happy: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
  joke: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  school: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif"
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

button.addEventListener("click", async () => {
  output.textContent = "Making...";

  try {
    const res = await fetch("/.netlify/functions/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt:
          "You are a childrens Joke Maker AI. Your Job is to create a joke for the word entered. " +
          "If the word doesn't exist, tell this Wrong Word. The format I want is " +
          "[word , meaning of word , joke] (Except when the word is wrong). Remember the Format should be a proper javascript list with the things inside it in string type and the Meaning must be under 12 words. Word: " +
          input.value
      }) 
    });

    const data = await res.json();

    if (!data.answer) {
      output.textContent = "Please Try again or Recheck your spelling !";
      return;
    }

    const answer = JSON.parse(data.answer);

    output.textContent = "";
    word.textContent = capitalize(answer[0]);
    meaning.textContent = capitalize(answer[1]);

    const joke = answer[2].match(/[^.!?]+[.!?]/g);
    one.textContent = capitalize(joke[0].trim());
    two.textContent = capitalize(joke[1].trim());

    wt.textContent = "Word";
    mt.textContent = "Meaning";
    jt.textContent = "Joke";

    const query = input.value.trim();
    if (!query) return;

    if (Gifs[query]) {
      gifImg.src = Gifs[query];
      gifImg.style.display = "block";
    } else {
      gifImg.style.display = "none";

      try {
        const gifRes = await fetch("/.netlify/functions/giphy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query })
        });

        const gifData = await gifRes.json();

        if (gifData.gif) {
          gifImg.src = gifData.gif;
          gifImg.style.display = "block";
        }
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
    output.textContent = "Please Try again or Recheck your spelling !";
  }
});
