const orbitRadius = 150;
const buttonCount = 10;
const container = document.querySelector(".orbit-container");

for (let i = 0; i < buttonCount; i++) {
  const angle = (i / buttonCount) * 2 * Math.PI;
  const x = orbitRadius * Math.cos(angle);
  const y = orbitRadius * Math.sin(angle);

  const btn = document.createElement("button");
  btn.className = "orbit-button";
  btn.style.left = `calc(50% + ${x}px - 40px)`;
  btn.style.top = `calc(50% + ${y}px - 20px)`;
  btn.innerHTML = `<span>${i + 1}</span>`;
  container.appendChild(btn);
}
