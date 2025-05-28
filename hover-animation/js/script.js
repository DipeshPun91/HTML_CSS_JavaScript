document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  activateCard(cards[0]);

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      cards.forEach((c) => deactivateCard(c));

      activateCard(this);
    });
  });

  function activateCard(card) {
    card.classList.add("active");
    card.style.width = "320px";

    const title = card.querySelector(".card-title");
    const details = card.querySelector(".card-details");
    const icon = card.querySelector(".card-icon");
    const image = card.querySelector(".card-image");

    title.style.opacity = "1";
    title.style.transform = "translateY(0)";
    details.style.opacity = "1";
    details.style.transform = "translateY(0)";
    icon.style.transform = "scale(0.85)";
    icon.style.marginBottom = "1rem";
    image.style.filter = "grayscale(30%) brightness(0.7)";
  }

  function deactivateCard(card) {
    card.classList.remove("active");
    card.style.width = "90px";

    const title = card.querySelector(".card-title");
    const details = card.querySelector(".card-details");
    const icon = card.querySelector(".card-icon");
    const image = card.querySelector(".card-image");

    title.style.opacity = "0";
    title.style.transform = "translateY(-20px)";
    details.style.opacity = "0";
    details.style.transform = "translateY(20px)";
    icon.style.transform = "scale(1)";
    icon.style.marginBottom = "1.5rem";
    image.style.filter = "grayscale(100%) brightness(0.4)";
  }
});
