const ENDPOINT = "http://localhost:3000/bfhl";
const edgeInput = document.querySelector("#input");
const responseDisplay = document.querySelector("#output");
const alertContainer = document.querySelector("#error");
const triggerBtn = document.querySelector("#submitBtn");
triggerBtn.addEventListener("click", async () => {
  alertContainer.textContent = "";
  responseDisplay.textContent = "";
  const rawText = edgeInput.value.trim();
  if (!rawText) {
    alertContainer.textContent = "Input cannot be empty. Please provide edge data.";
    return;
  }
  const payload = rawText
    .split(",")
    .map(entry => entry.trim())
    .filter(entry => entry.length > 0);
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: payload })
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const result = await response.json();
    responseDisplay.textContent = JSON.stringify(result, null, 2);
  } catch (err) {
    alertContainer.textContent = `Request failed: ${err.message}`;
  }
});
