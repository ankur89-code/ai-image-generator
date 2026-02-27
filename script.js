const form = document.getElementById("form");
const promptInput = document.getElementById("prompt");
const image = document.getElementById("output");
const loading = document.getElementById("loading");
const status = document.getElementById("status");
const submitButton = form.querySelector('button[type="submit"]');

const REQUEST_TIMEOUT_MS = 45000;

function setGeneratingState(isGenerating) {
  loading.style.display = isGenerating ? "block" : "none";
  if (submitButton) {
    submitButton.disabled = isGenerating;
  }
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.style.display = message ? "block" : "none";
  status.style.color = isError ? "#ff8a80" : "#9e9e9e";
}

function loadImageWithTimeout(imageElement, imageUrl, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("timeout"));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timeoutId);
      imageElement.onload = null;
      imageElement.onerror = null;
    }

    imageElement.onload = () => {
      cleanup();
      resolve();
    };

    imageElement.onerror = () => {
      cleanup();
      reject(new Error("load_error"));
    };

    imageElement.src = imageUrl;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return;

  setGeneratingState(true);
  setStatus("Generating image...");
  image.style.display = "none";

  const finalPrompt = [
    userPrompt,
    "fashion photography",
    "pirate gothic renaissance outfit",
    "full body portrait",
    "high detail fabric texture",
    "cinematic lighting",
    "editorial photoshoot",
    "dark fantasy aesthetic",
    "sharp focus",
    "realistic"
  ].join(", ");

  const seed = Math.floor(Math.random() * 100000);
  const imageUrl =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(finalPrompt) +
    `?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;

  try {
    await loadImageWithTimeout(image, imageUrl, REQUEST_TIMEOUT_MS);
    image.style.display = "block";
    setStatus("");
  } catch (error) {
    const isTimeoutError = error.message === "timeout";
    setStatus(
      isTimeoutError
        ? "Image generation timed out. Please try again."
        : "Image generation failed. Please try again.",
      true
    );
    image.style.display = "none";
    image.removeAttribute("src");
  } finally {
    setGeneratingState(false);
  }
});
