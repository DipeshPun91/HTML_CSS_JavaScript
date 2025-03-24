const clockFace = document.querySelector("svg g.clock--face");
for (let i = 0; i < 12; i++) {
  const angle = 30 * (i + 1);
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

  text.setAttribute(
    "transform",
    `rotate(${angle}) translate(34 0) rotate(${-angle})`
  );

  if (i + 1 === 6 || i + 1 === 9) {
    text.setAttribute(
      "transform",
      `rotate(${angle}) translate(34 0) rotate(${-angle + 180})`
    );
  }

  text.textContent = i + 1;
  clockFace.appendChild(text);
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  const smoothSeconds = seconds + milliseconds / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = hours + smoothMinutes / 60;

  document
    .querySelector(".seconds")
    .setAttribute("transform", `rotate(${smoothSeconds * 6})`);
  document
    .querySelector(".minutes")
    .setAttribute("transform", `rotate(${smoothMinutes * 6})`);
  document
    .querySelector(".hours")
    .setAttribute("transform", `rotate(${smoothHours * 30 - 15})`);

  requestAnimationFrame(updateClock);
}

updateClock();

function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const smoothSeconds = seconds + milliseconds / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = hours + smoothMinutes / 60;

  document
    .querySelector(".seconds")
    .setAttribute("transform", `rotate(${smoothSeconds * 6})`);
  document
    .querySelector(".minutes")
    .setAttribute("transform", `rotate(${smoothMinutes * 6})`);
  document
    .querySelector(".hours")
    .setAttribute("transform", `rotate(${smoothHours * 30 - 15})`);

  document.querySelector(".time-display").textContent =
    now.toLocaleTimeString();
  document.querySelector(".day-display").textContent = days[now.getDay()];

  requestAnimationFrame(updateClock);
}

document.querySelector(".hands .seconds path").setAttribute("fill", "#3F51B5");
document
  .querySelector(".hands .seconds circle")
  .setAttribute("stroke", "#3F51B5");
