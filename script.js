const form = document.getElementById("form");
const promptInput = document.getElementById("prompt");
const image = document.getElementById("output");
const loading = document.getElementById("loading");
const status = document.getElementById("status");
const submitButton = form.querySelector('button[type="submit"]');

const REQUEST_TIMEOUT_MS = 45000;
let isGenerating = false;

function setGeneratingState(generating) {
  isGenerating = generating;
  loading.style.display = generating ? "block" : "none";

  if (submitButton) {
    submitButton.disabled = generating;
  }

  promptInput.disabled = generating;
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.style.display = message ? "block" : "none";
  status.style.color = isError ? "#ff8a80" : "#9e9e9e";
}

function buildImageUrl(finalPrompt, seed, fallback = false) {
  const baseUrl =
    "https://image.pollinations.ai/prompt/" + encodeURIComponent(finalPrompt);

  const params = new URLSearchParams({
    width: "768",
    height: "1024",
    seed: String(seed),
    nologo: "true"
  });

  if (!fallback) {
    params.set("model", "flux");
  }

  return `${baseUrl}?${params.toString()}`;
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

  if (isGenerating) {
    return;
  }

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
  const primaryUrl = buildImageUrl(finalPrompt, seed, false);
  const fallbackUrl = buildImageUrl(finalPrompt, seed, true);

  try {
    try {
      await loadImageWithTimeout(image, primaryUrl, REQUEST_TIMEOUT_MS);
    } catch (error) {
      const isRetriable = error.message === "load_error";
      if (!isRetriable) {
        throw error;
      }

      setStatus("Primary model failed, retrying...");
      await loadImageWithTimeout(image, fallbackUrl, REQUEST_TIMEOUT_MS);
    }

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
