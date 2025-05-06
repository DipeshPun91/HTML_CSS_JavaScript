const elements = document.querySelectorAll("svg > *");

gsap.set(elements, {
  x: () => gsap.utils.random(-500, 500),
  y: () => gsap.utils.random(-500, 500),
  rotation: () => gsap.utils.random(-720, 720),
  scale: 0,
  opacity: 0,
});

const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 0.65,
  yoyo: true,
});

tl.to(elements, {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  rotation: 0,
  ease: "power4.inOut",
  stagger: 0.0125,
  duration: 0.75,
});

const svg = document.querySelector("svg");
svg.addEventListener("mouseenter", () => tl.timeScale(0.15));
svg.addEventListener("mouseleave", () => tl.timeScale(1));
