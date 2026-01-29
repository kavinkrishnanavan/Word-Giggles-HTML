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
const speak = document.getElementById("speak")
const Gifs = {
  prerequisite: "https://media1.tenor.com/m/-koXelHpdokAAAAd/before-we-begin-emma.gif",
  modesty: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTdxbGYzemxkMzg5MGs0b2NleXFvd3BoemExZTRhcnRrNmYwdWM2NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qN9KLSKynX1bNqNzFY/giphy.gif",
  tow: "https://media1.tenor.com/m/6sh061JnoIMAAAAd/tiny-car-custom-trailer.gif",
  poop: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjZ2Z3c3ZDB1d2sxaTA1dXh5eDI1Y25kZGNmanhvYjh3YnptbGtrMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WFAlxdc7O5IIg/giphy.gif",
  car: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGt0ODF2dTlvcjUyeTRnMnY2a2h5OWhobTB0NzByNDdycnFnaW9iYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ov9jWu7BuHufyLs7m/giphy.gif"
};

const audio = document.getElementById("audio");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

speak.addEventListener('click', async function() {
    const text = "[cheerful] Word: " + answer[0] + ". Meaning: " + answer[1] + ". Joke: " + answer[2];
    
    if (!text) return;

    try {
        const res = await fetch("/.netlify/functions/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        audio.src = url;
        audio.play();
    } catch (err) {
        console.error(err);
        console.log("Text-to-speech failed");
    } finally {
        // Do Nothing
    }
});


button.addEventListener("click", async () => {
  output.textContent = "Making...";

  try {
    const res = await fetch("/.netlify/functions/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "You are a childrens Joke Maker AI. Your Job is to create a joke for the word entered. If the word doesn't exist, tell this Wrong Word. The format I want the answered to be returned is in a list which is [word , meaning of word , joke] (only if the word has a correct spelling). Remember to return it in a proper list with the things inside it being a string and the meaning should be short and concise in less 12 words. Here is the word : " + input.value
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
    

    const query = input.value.trim().toLowerCase();

    

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
