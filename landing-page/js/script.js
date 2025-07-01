// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  mobileMenuBtn.innerHTML = mobileMenu.classList.contains("active")
    ? '<i class="ri-close-line"></i>'
    : '<i class="ri-menu-line"></i>';
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".mobile-nav .nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    mobileMenuBtn.innerHTML = '<i class="ri-menu-line"></i>';
  });
});

// Header scroll effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Fleet navigation tabs
const fleetButtons = document.querySelectorAll(".fleet-nav button");
fleetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    fleetButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    // Here you would typically filter the fleet grid
    // This is just UI for the demo
  });
});

// Set min date for pickup and return dates
const today = new Date().toISOString().split("T")[0];
document.getElementById("pickup-date").min = today;
document.getElementById("return-date").min = today;

// Update return date min when pickup date changes
document.getElementById("pickup-date").addEventListener("change", function () {
  document.getElementById("return-date").min = this.value;
});
