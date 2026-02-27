const form = document.getElementById("form");
const image = document.getElementById("output");
const loading = document.getElementById("loading");

const REQUEST_TIMEOUT_MS = 30000;

function setStatus(message) {
  loading.textContent = message;
  loading.style.display = "block";
}

function hideStatus() {
  loading.style.display = "none";
}

function loadImageWithTimeout(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const preview = new Image();

    const timeoutId = setTimeout(() => {
      preview.src = "";
      reject(new Error("Image generation timed out. Please try again."));
    }, timeoutMs);

    preview.onload = () => {
      clearTimeout(timeoutId);
      resolve(url);
    };

    preview.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Could not load generated image. Please retry."));
    };

    preview.src = url;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userPrompt = document.getElementById("prompt").value.trim();
  if (!userPrompt) return;

  image.style.display = "none";
  setStatus("Generating image...");

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
    "realistic",
  ].join(", ");

  const seed = Math.floor(Math.random() * 100000);

  const imgUrl =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(finalPrompt) +
    `?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;

  try {
    setStatus("Generating image... this can take up to 30 seconds.");
    await loadImageWithTimeout(imgUrl, REQUEST_TIMEOUT_MS);
    image.src = imgUrl;
    image.style.display = "block";
    hideStatus();
  } catch (error) {
    setStatus(error.message);
  }
});
