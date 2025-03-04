document.addEventListener("DOMContentLoaded", () => {
  // Back button functionality
  document.querySelector(".back-btn").addEventListener("click", () => {
    window.history.back();
  });

  // Toggle order details
  const toggleButton = document.querySelector(".toggle-details");
  const orderItems = document.querySelector(".items-list");

  toggleButton.addEventListener("click", () => {
    const isOpen = orderItems.style.maxHeight;
    if (isOpen) {
      orderItems.style.maxHeight = null;
      toggleButton.textContent = "View Details";
    } else {
      orderItems.style.maxHeight = orderItems.scrollHeight + "px";
      toggleButton.textContent = "Hide Details";
    }
  });

  // Dynamic delivery date calculation
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

  // Order cancellation confirmation
  document.querySelector(".cancel-order").addEventListener("click", (e) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      e.preventDefault();
    }
  });

  // Progress tracker animation
  document.querySelectorAll(".progress-step").forEach((step, index) => {
    step.addEventListener("click", () => {
      document.querySelectorAll(".progress-step").forEach((s, i) => {
        s.classList.toggle("current", i <= index);
      });
    });
  });
});
