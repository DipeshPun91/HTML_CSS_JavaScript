document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".back-btn").addEventListener("click", () => {
    window.history.back();
  });

  const toggleButton = document.querySelector(".toggle-details");
  const detailsContent = document.querySelector(".details-content");

  toggleButton.addEventListener("click", () => {
    const isOpen = detailsContent.classList.contains("active");

    if (isOpen) {
      detailsContent.classList.remove("active");
      toggleButton.textContent = "View Details";
    } else {
      detailsContent.classList.add("active");
      toggleButton.textContent = "Hide Details";
    }
  });

  function updateDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    document.querySelector(".delivery-date").textContent =
      deliveryDate.toLocaleDateString("en-US", options);
    document.querySelector(".delivery-day").textContent =
      deliveryDate.toLocaleDateString("en-US", { weekday: "long" });
  }
  updateDeliveryDate();

  document.querySelector(".cancel-order").addEventListener("click", (e) => {
    e.preventDefault();
    const isConfirmed = confirm("Are you sure you want to cancel this order?");

    if (isConfirmed) {
      alert("Your order cancellation request has been submitted.");
    } else {
      alert("Order cancellation request canceled.");
    }
  });

  document.querySelectorAll(".progress-step").forEach((step, index) => {
    step.addEventListener("click", () => {
      document.querySelectorAll(".progress-step").forEach((s, i) => {
        s.classList.toggle("current", i <= index);
      });
    });
  });
});
