const labels = [
  "Send",
  "Time",
  "Scan",
  "Search",
  "Record",
  "Current",
  "Timeline",
  "Library",
  "Edit",
  "Setting",
];

const orbitRadius = 160;
const buttonCount = labels.length;
const container = document.querySelector(".orbit-container");

let delay = 0;

for (let i = 0; i < buttonCount; i++) {
  const angle = (i / buttonCount) * 2 * Math.PI;
  const x = orbitRadius * Math.cos(angle);
  const y = orbitRadius * Math.sin(angle);
  const rotation = (angle * 180) / Math.PI;

  const btn = document.createElement("button");
  btn.className = "orbit-button";
  btn.style.left = `calc(50% + ${x}px)`;
  btn.style.top = `calc(50% + ${y}px)`;
  btn.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  btn.style.transitionDelay = `${delay}ms`;

  btn.innerHTML = `<span style="transform: rotate(${-rotation}deg)">${
    labels[i]
  }</span>`;
  container.appendChild(btn);

  delay += 50;
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".orbit-button");
  buttons.forEach((btn) => {
    btn.style.opacity = "0";
    btn.style.transform = btn.style.transform + " scale(0.5)";
  });

  setTimeout(() => {
    buttons.forEach((btn) => {
      btn.style.opacity = "1";
      btn.style.transform = btn.style.transform.replace(" scale(0.5)", "");
    });
  }, 100);
});
