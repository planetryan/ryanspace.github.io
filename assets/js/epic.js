 document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://epic.gsfc.nasa.gov/api/natural");
    const data = await response.json();
    if (!data.length) return;

    const imageInfo = data[0];
    const [year, month, day] = imageInfo.date.split(" ")[0].split("-");
    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${imageInfo.image}.jpg`;

    const figure = document.createElement("figure");
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.target = "_blank";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `NASA EPIC - ${imageInfo.caption}`;
    img.classList.add("gallery-img");

    const caption = document.createElement("figcaption");
    caption.textContent = `NASA EPIC – ${imageInfo.caption}`;

    anchor.appendChild(img);
    figure.appendChild(anchor);
    figure.appendChild(caption);

    document.querySelector(".gallery")?.appendChild(figure);
  } catch (err) {
    console.error("Failed to load NASA EPIC image", err);
  }
});
