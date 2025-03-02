const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Set Canvas to Full Screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize Canvas when window resizes
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let fireRocketsArray = [];
let fireRocketsSparklesArray = [];

// Add gradient backgrounds
const createBackground = () => {
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#000000");
  gradient.addColorStop(1, "#000033");
  return gradient;
};

function FireRockets() {
  this.x = Math.random() * window.innerWidth;
  this.y = window.innerHeight;
  this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
  this.size = Math.random() * 3 + 2;
  this.speedY = Math.random() * 3 + 7;
  this.crackRocketY = Math.random() * (window.innerHeight / 2) + 50;
  this.trail = [];

  this.update = () => {
    this.y -= this.speedY;

    // Add trail particles
    this.trail.push({
      x: this.x,
      y: this.y,
      size: this.size * 0.8,
      alpha: 1,
    });

    // Remove old trail particles
    if (this.trail.length > 5) this.trail.shift();
  };

  this.draw = () => {
    // Draw trail
    this.trail.forEach((particle, index) => {
      context.beginPath();
      context.arc(
        particle.x,
        particle.y,
        particle.size * (0.8 - index / 10),
        0,
        Math.PI * 2
      );
      context.fillStyle = `hsla(${this.color.split("(")[1].split(")")[0]}, ${
        0.5 - index / 10
      })`;
      context.fill();
    });

    // Draw main rocket
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  };
}

function FireRocketsSparkles(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = `hsla(${color.split("(")[1].split(")")[0]}, 0.8)`;
  this.size = Math.random() * 4 + 2;
  this.angle = Math.random() * Math.PI * 2;
  this.velocity = Math.random() * 3 + 2;
  this.gravity = 0.08;
  this.alpha = 1;
  this.decay = Math.random() * 0.015 + 0.015;

  // Spread particles in all directions
  this.vx = Math.cos(this.angle) * this.velocity;
  this.vy = Math.sin(this.angle) * this.velocity;

  this.update = () => {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
    this.size *= 0.97;
  };

  this.draw = () => {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = `hsla(${this.color.split("(")[1].split(")")[0]}, ${
      this.alpha
    })`;
    context.fill();
  };
}

function renderFireRockets() {
  for (let i = 0; i < fireRocketsArray.length; i++) {
    fireRocketsArray[i].draw();
    fireRocketsArray[i].update();

    if (fireRocketsArray[i].y <= fireRocketsArray[i].crackRocketY) {
      // Create explosion effect
      const particles = Math.random() * 50 + 100;
      for (let j = 0; j < particles; j++) {
        fireRocketsSparklesArray.push(
          new FireRocketsSparkles(
            fireRocketsArray[i].x,
            fireRocketsArray[i].y,
            fireRocketsArray[i].color
          )
        );
      }
      fireRocketsArray.splice(i, 1);
      i--;
    }
  }
}

function renderFireRocketsSparkles() {
  for (let i = 0; i < fireRocketsSparklesArray.length; i++) {
    fireRocketsSparklesArray[i].draw();
    fireRocketsSparklesArray[i].update();

    if (
      fireRocketsSparklesArray[i].alpha <= 0.01 ||
      fireRocketsSparklesArray[i].size <= 0.1
    ) {
      fireRocketsSparklesArray.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  context.fillStyle = createBackground();
  context.fillRect(0, 0, canvas.width, canvas.height);

  renderFireRockets();
  renderFireRocketsSparkles();

  // Add subtle fading effect for trailing sparks
  context.fillStyle = "rgba(0, 0, 0, 0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(animate);
}

animate();

// Launch fireworks at random intervals
setInterval(() => {
  for (let i = 0; i < Math.random() * 2 + 1; i++) {
    fireRocketsArray.push(new FireRockets());
  }
}, Math.random() * 500 + 500);
