const form = document.getElementById("form");
const promptInput = document.getElementById("prompt");
const image = document.getElementById("output");
const loading = document.getElementById("loading");
const status = document.getElementById("status");
const submitButton = form.querySelector('button[type="submit"]');

const REQUEST_TIMEOUT_MS = 45000;
let activeObjectUrl = null;

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

async function fetchGeneratedImage(imageUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Image request failed with status ${response.status}`);
    }

    const imageBlob = await response.blob();
    if (!imageBlob.type.startsWith("image/")) {
      throw new Error("Image provider returned a non-image response");
    }

    return URL.createObjectURL(imageBlob);
  } finally {
    clearTimeout(timeoutId);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userPrompt = promptInput.value.trim();
  if (!userPrompt) return;

  setGeneratingState(true);
  setStatus("Generating image...");
  image.style.display = "none";

  // Prompt locking for fashion accuracy
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
    const generatedImageUrl = await fetchGeneratedImage(imageUrl);

    if (activeObjectUrl) {
      URL.revokeObjectURL(activeObjectUrl);
    }

    activeObjectUrl = generatedImageUrl;
    image.src = generatedImageUrl;
    image.style.display = "block";
    setStatus("");
  } catch (error) {
    const isTimeoutError = error.name === "AbortError";
    setStatus(
      isTimeoutError
        ? "Image generation timed out. Please try again."
        : "Image generation failed. Please try again.",
      true
    );
    image.style.display = "none";
  } finally {
    setGeneratingState(false);
  }
});
