fetch("/.netlify/functions/env")
  .then(res => res.json())
  .then(data => {
    document.getElementById("output").textContent = data.message;
  })
  .catch(() => {
    document.getElementById("output").textContent = "Error loading message";
  });
