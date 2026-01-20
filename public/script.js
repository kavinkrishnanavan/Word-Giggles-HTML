fetch("/.netlify/functions/env")
  .then(response => {
    if (!response.ok) {
      throw new Error("Function failed");
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("output").textContent =
      data.message || "No message set";
  })
  .catch(error => {
    console.error(error);
    document.getElementById("output").textContent =
      "Failed to load message";
  });
