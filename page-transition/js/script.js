const rafa3l = {
  0: ["XXX__", "X__X_", "XXX__", "X__X_", "X__X_", "X__XX"],
  1: ["_XXX_", "X___X", "____X", "_XXXX", "X___X", "_XX_X"],
  2: ["_XXXX", "X___X", "XXX__", "X____", "X____", "X____"],
  3: ["_XXX_", "X___X", "____X", "_XXXX", "X___X", "_XX_X"],
  4: ["_XXX_", "X___X", "__XX_", "____X", "X___X", "_XXX_"],
  5: ["XX___", "_X___", "_X___", "_X___", "_X__X", "XXXXX"],
};
const cod3p3n = {
  0: ["_XXX_", "XXX_X", "XXX__", "XXX_X", "XXXXX", "_XXX_"],
  1: ["_XXX_", "XX_XX", "XX_XX", "XX_XX", "XX_XX", "_XXX_"],
  2: ["XXXX_", "XX_XX", "XX_XX", "XX_XX", "XX_XX", "XXXX_"],
  3: ["_XXXX", "XX__X", "XXX__", "XX__X", "XXXXX", "XXXXX"],
  4: ["XXXX_", "XX_XX", "XX_XX", "XXXX_", "XX___", "XX___"],
  5: ["_XXXX", "XX__X", "XXX__", "XX__X", "XXXXX", "XXXXX"],
  6: ["_XXX_", "XXXXX", "XX_XX", "XX_XX", "XX_XX", "XX_XX"],
};
const block = ["XXXXX", "XXXXX", "XXXXX", "XXXXX", "XXXXX", "XXXXX"];

/* ///////////////////////////////////////////////////// */
/* Logo unit builder */
/* ///////////////////////////////////////////////////// */
function createUnits(containerId, n, fillUnits) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const unit = document.createElement("div");
    unit.classList.add("unit");
    const layout = fillUnits[i] || [];
    layout.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        const block = document.createElement("div");
        block.setAttribute("data-x", x + 1);
        block.setAttribute("data-y", y + 1);
        if (cell === "X") {
          block.classList.add("fill");
        }
        unit.appendChild(block);
      });
    });
    container.appendChild(unit);
  }
}
createUnits("unitContainer", Object.keys(cod3p3n).length, cod3p3n);
document.addEventListener("click", (e) => {
  if (e.target.matches(".unit div")) {
    e.target.classList.toggle("fill");
  }
});

/* ///////////////////////////////////////////////////// */
/* Button handling */
/* ///////////////////////////////////////////////////// */
const resetBtn = document.querySelector(".reset");
let blocks = block;
document.querySelector(".smooth-sharp").addEventListener("click", () => {
  document.querySelector("#unitContainer").classList.toggle("sharp");
});
document.querySelector(".add-spot").addEventListener("click", () => {
  if (resetBtn.dataset.blocks < 8) {
    resetBtn.dataset.blocks++;
  }
});
document.querySelector(".remove-spot").addEventListener("click", () => {
  if (resetBtn.dataset.blocks > 1) {
    resetBtn.dataset.blocks--;
  }
});
resetBtn.addEventListener("click", () => {
  const numBlocks = parseInt(resetBtn.dataset.blocks, 10);
  const blocks = Array.from({ length: numBlocks }, () => block);
  createUnits("unitContainer", numBlocks, blocks);
});
document.querySelector(".rafa3l").addEventListener("click", () => {
  resetBtn.dataset.blocks = 6;
  createUnits("unitContainer", Object.keys(rafa3l).length, rafa3l);
});
document.querySelector(".codepen").addEventListener("click", () => {
  resetBtn.dataset.blocks = 7;
  createUnits("unitContainer", Object.keys(cod3p3n).length, cod3p3n);
});

const downloadBtn = document.querySelector("#downloadBtn");
const ledBarText = document.querySelector(".led-bar .text");
document.getElementById("downloadBtn").addEventListener("click", () => {
  ledBarText.innerHTML = "Downloading  ---  Please Wait  ---  ";
  ledBarText.style.translate = "0 300px";
  ledBarText.style.animation = "scroll 10s linear infinite";
  downloadBtn.classList.add("downloading");

  const container = document.getElementById("unitContainer");
  const clone = container.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.top = "-9999px";
  document.body.appendChild(clone);
  clone.style.background = "transparent";
  clone.classList.add("bgwhite");
  const units = clone.querySelectorAll(".unit > div");
  units.forEach((unit) => {
    unit.style.background = "#000";
  });

  html2canvas(clone, { scale: 14 }).then((canvas) => {
    document.body.removeChild(clone);
    const reduceScaleFactor = 2;
    const resizedCanvas = document.createElement("canvas");
    const context = resizedCanvas.getContext("2d");
    const targetWidth = canvas.width / reduceScaleFactor;
    const targetHeight = canvas.height / reduceScaleFactor;
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;
    context.drawImage(canvas, 0, 0, targetWidth, targetHeight);
    const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
    const pixels = imageData.data;
    const threshold = 128;
    for (let i = 0; i < pixels.length; i += 4) {
      const grayscale =
        0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      const value = grayscale > threshold ? 255 : 0;
      pixels[i] = value;
      pixels[i + 1] = value;
      pixels[i + 2] = value;
    }
    context.putImageData(imageData, 0, 0);
    resizedCanvas.toBlob(
      (blob) => {
        const link = document.createElement("a");
        link.download = "logo-factory_by_rafa3l.jpg";
        link.href = URL.createObjectURL(blob);
        link.click();

        ledBarText.innerHTML = "Download  Done";
        setTimeout(() => {
          ledBarText.innerHTML = "";
        }, 5000);
        ledBarText.style.animation = "none";
        ledBarText.style.translate = "0 16px";
        downloadBtn.classList.remove("downloading");
      },
      "image/jpeg",
      0.2
    );
  });
});

/* ///////////////////////////////////////////////////// */
/* electrodes script */
/* ///////////////////////////////////////////////////// */
var particleLength = 224; // Length of particle
var turnProbability = 0.024; // Turning probability
var maxParticles = 6; // Max particles
var particleWidth = 1; // Width of particle
var particleLifespan = 3200; // Lifespan of particle
var particleSpeed = 80; // Speed in pixels/second
/* ///////////////////////////////////////////////////// */
var electrodes = document.getElementById("electrodes");
var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
electrodes.appendChild(canvas);
function resizeCanvas() {
  canvas.width = electrodes.offsetWidth;
  canvas.height = electrodes.offsetHeight;
}
resizeCanvas();
var particleSpawnInterval = particleLifespan / maxParticles;
var lastParticleSpawnTime = Date.now();
var directions = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = 0;
  this.direction = "down";
  this.path = [{ x: this.x, y: this.y }];
  this.birthTime = Date.now();
  this.length = particleLength;
  this.width = particleWidth;
  this.speed = particleSpeed;
  this.dead = false;
}
Particle.prototype.update = function (deltaTime) {
  if (Math.random() < turnProbability) {
    var turns = ["left", "right", "down"];
    if (this.direction === "left") {
      turns = turns.filter((dir) => dir !== "right");
    } else if (this.direction === "right") {
      turns = turns.filter((dir) => dir !== "left");
    }
    this.direction = turns[Math.floor(Math.random() * turns.length)];
  }
  var distance = this.speed * (deltaTime / 1000);
  this.x += directions[this.direction].x * distance;
  this.y += directions[this.direction].y * distance;
  this.x = Math.max(0, Math.min(this.x, canvas.width));
  this.y = Math.min(this.y, canvas.height);
  this.path.push({ x: this.x, y: this.y });
  if (this.path.length > this.length) {
    this.path.shift();
  }
  var age = Date.now() - this.birthTime;
  if (age >= particleLifespan) {
    this.dead = true;
  } else {
    this.opacity = 1 - age / particleLifespan;
  }
};
Particle.prototype.draw = function (ctx) {
  if (this.path.length < 2) return;

  ctx.lineWidth = this.width;

  for (var i = 1; i < this.path.length; i++) {
    var segmentOpacity = this.opacity * (i / this.path.length);
    ctx.strokeStyle = "rgba(255, 255, 255," + segmentOpacity + ")";

    ctx.beginPath();
    ctx.moveTo(this.path[i - 1].x, this.path[i - 1].y);
    ctx.lineTo(this.path[i].x, this.path[i].y);
    ctx.stroke();
  }
};
var particles = [];
var lastTime = Date.now();
function animate() {
  var now = Date.now();
  var deltaTime = now - lastTime;
  lastTime = now;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].update(deltaTime);
    particles[i].draw(ctx);
    if (particles[i].dead) {
      particles.splice(i, 1);
    }
  }
  if (
    now - lastParticleSpawnTime >= particleSpawnInterval &&
    particles.length < maxParticles
  ) {
    particles.push(new Particle());
    lastParticleSpawnTime = now;
  }
  requestAnimationFrame(animate);
}
let resizeTimeout;
window.addEventListener("resize", () => {
  canvas.style.transition = "opacity 0s";
  canvas.style.opacity = "0";
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
    canvas.style.transition = "opacity 1s ease-in 0.6s";
    canvas.style.opacity = "1";
    particles.forEach((particle) => {
      particle.x = Math.random() * canvas.width;
      particle.y = Math.random() * canvas.height * 0.5;
    });
  }, 200);
});
animate();

/* ///////////////////////////////////////////////////// */
/* active ring animation */
/* ///////////////////////////////////////////////////// */
document.addEventListener("DOMContentLoaded", () => {
  const ring = document.querySelector(".ring");
  const dotCount = parseInt(ring.getAttribute("data-count"), 10);
  const dotSize = parseInt(ring.getAttribute("data-size"), 10);
  const radius = parseInt(ring.getAttribute("data-radius"), 10);
  const vertical = parseInt(ring.getAttribute("data-vertical"), 10);
  const time = ring.getAttribute("data-time");

  const opTarget = 0.2;
  const szTarget = 0.8;
  const vertTarget = 0.8;

  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.transform = `translate(${x}px, ${y / 12}px)`;
    dot.style.width = `${dotSize}px`;
    dot.style.height = `${dotSize}px`;
    dot.style.animation = `vert ${time}s ease-in-out infinite`;
    dot.style.animationDelay = `${(i / dotCount) * (-1 * time) * 2}s`;
    dot.style.setProperty("--vert", `${vertical}px`);

    let p;
    if (i >= dotCount / 2) {
      const norm = (i - dotCount / 2) / (dotCount / 2);
      p = norm <= 0.5 ? 1 - 2 * norm : 2 * norm - 1;
    } else {
      p = 1;
    }

    dot.style.opacity = `${opTarget + p * (1 - opTarget)}`;
    dot.style.width = `${dotSize * (szTarget + p * (1 - szTarget))}px`;
    dot.style.height = `${dotSize * (szTarget + p * (1 - szTarget))}px`;
    dot.style.setProperty(
      "--vert",
      `${vertical * (vertTarget + p * (1 - vertTarget))}px`
    );

    ring.appendChild(dot);
  }
});
