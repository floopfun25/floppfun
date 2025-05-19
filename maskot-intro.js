
document.addEventListener("DOMContentLoaded", () => {
  const introContainer = document.getElementById("maskot-intro");
  const createButton = document.getElementById("create-button");
  const jumperMaskot = document.querySelector(".jumper-on-button");

  // 5 saniye sonra intro kapanır, içerik görünür olur
  setTimeout(() => {
    if (introContainer) {
      introContainer.style.display = "none";
    }
    document.body.classList.remove("hide-content");
  }, 5000);

  // Butona tıklanırsa zıplayan maskot kaybolur
  if (createButton && jumperMaskot) {
    createButton.addEventListener("click", () => {
      jumperMaskot.classList.add("fade-out");
      setTimeout(() => {
        jumperMaskot.remove();
      }, 700);
    });
  }
});
