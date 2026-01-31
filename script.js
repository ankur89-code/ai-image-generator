const form = document.getElementById("form");
const image = document.getElementById("output");
const loading = document.getElementById("loading");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const userPrompt = document.getElementById("prompt").value.trim();
  if (!userPrompt) return;

  loading.style.display = "block";
  image.style.display = "none";

  // 🔒 Prompt locking for fashion accuracy
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

  const imgUrl =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(finalPrompt) +
    `?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;

  image.onload = () => {
    loading.style.display = "none";
    image.style.display = "block";
  };

  image.src = imgUrl;
});
