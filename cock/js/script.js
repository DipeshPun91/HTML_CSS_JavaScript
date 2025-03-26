const minuteMarks = document.querySelector(".minute-marks");
for (let i = 0; i < 60; i++) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("y1", i % 5 === 0 ? "38" : "40");
  line.setAttribute("y2", "42");
  line.setAttribute("transform", `rotate(${i * 6})`);
  line.setAttribute("stroke", "#666");
  line.setAttribute("stroke-width", i % 5 === 0 ? "0.8" : "0.3");
  minuteMarks.appendChild(line);
}

const clockFace = document.querySelector("svg g.clock--face");
const hourPositions = [
  { num: "12", angle: 0 },
  { num: "1", angle: 30 },
  { num: "2", angle: 60 },
  { num: "3", angle: 90 },
  { num: "4", angle: 120 },
  { num: "5", angle: 150 },
  { num: "6", angle: 180 },
  { num: "7", angle: 210 },
  { num: "8", angle: 240 },
  { num: "9", angle: 270 },
  { num: "10", angle: 300 },
  { num: "11", angle: 330 },
];

hourPositions.forEach((pos) => {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute(
    "transform",
    `rotate(${pos.angle}) translate(35 0) rotate(${-pos.angle})`
  );
  text.textContent = pos.num;
  clockFace.appendChild(text);
});

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
    .setAttribute("transform", `rotate(${smoothHours * 30})`);

  const timeString = now.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  document.querySelector(".time-display").textContent = timeString;
  document.querySelector(".day-display").textContent = days[now.getDay()];

  requestAnimationFrame(updateClock);
}

updateClock();
