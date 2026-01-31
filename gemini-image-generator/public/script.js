const form = document.getElementById("form");
const image = document.getElementById("output");
const loading = document.getElementById("loading");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const promptInput = document.getElementById("prompt").value.trim();
  if (!promptInput) return;

  loading.style.display = "block";
  image.style.display = "none";

  // Fashion-optimized prompt (VERY IMPORTANT)
  const finalPrompt = `
  highly detailed fashion photography,
  ${promptInput},
  pirate goth renaissance fashion,
  cinematic lighting,
  ultra detailed fabric,
  editorial fashion shoot,
  dark fantasy aesthetic,
  4k, sharp focus
  `;

  const seed = Math.floor(Math.random() * 100000);

  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=768&height=1024&seed=${seed}&model=flux`;

  image.onload = () => {
    loading.style.display = "none";
    image.style.display = "block";
  };

  image.src = imgUrl;
});
