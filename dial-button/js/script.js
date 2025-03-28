class VolumeDial {
  constructor(element, options = {}) {
    this.element = element;
    this.ticks = options.ticks || 16;
    this.volume = options.volume || 0;
    this.color = options.color || "";
    this.label = options.label || "Volume";

    this.minAngle = -135;
    this.maxAngle = 135;
    this.angleSpan = this.maxAngle - this.minAngle;
    this.dotSectorAngle = this.angleSpan / this.ticks;
    this.dotSectorAngleOffset = -this.angleSpan / 2 + this.dotSectorAngle / 2;

    this.dial = this.element.querySelector(".volume__dial");
    this.control = this.element.querySelector(".volume__control");

    this.init();
  }

  init() {
    this.createDots();

    this.setRotation(this.minAngle + this.volume * this.angleSpan);

    this.setupDrag();
    this.setupKeyboard();
  }

  createDots() {
    for (let i = 0; i < this.ticks; i++) {
      const angle = this.dotSectorAngle * i + this.dotSectorAngleOffset;
      const dot = document.createElement("div");
      dot.className = "volume__dot";
      dot.style.transform = `rotate(${angle}deg)`;

      if (i < Math.floor(this.volume * this.ticks)) {
        dot.classList.add("volume__dot--filled");
      }

      this.control.insertBefore(dot, this.control.firstChild);
    }
  }

  setRotation(angle) {
    angle = Math.max(this.minAngle, Math.min(this.maxAngle, angle));
    this.dial.style.setProperty("--rotation", `${angle}deg`);

    const currentTick = Math.floor(
      ((angle - this.minAngle) / this.angleSpan) * this.ticks
    );
    const dots = this.element.querySelectorAll(".volume__dot");

    dots.forEach((dot, index) => {
      if (index < currentTick) {
        dot.classList.add("volume__dot--filled");
      } else {
        dot.classList.remove("volume__dot--filled");
      }
    });

    const percent = Math.round(
      ((angle - this.minAngle) / this.angleSpan) * 100
    );
    this.dial.setAttribute("aria-description", `${percent}%`);
  }

  setupDrag() {
    let isDragging = false;
    let startAngle = 0;
    let startRotation = 0;

    const getAngle = (clientX, clientY) => {
      const rect = this.dial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = clientX - centerX;
      const y = clientY - centerY;
      let angle = Math.atan2(y, x) * (180 / Math.PI);

      if (angle < -90) angle += 360;

      angle = Math.max(this.minAngle, Math.min(this.maxAngle, angle));

      return angle;
    };

    this.dial.addEventListener("mousedown", (e) => {
      isDragging = true;
      const currentRotation = parseFloat(
        this.dial.style.getPropertyValue("--rotation") || "0"
      );
      startRotation = isNaN(currentRotation) ? this.minAngle : currentRotation;
      startAngle = getAngle(e.clientX, e.clientY) - startRotation;
      this.dial.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const angle = getAngle(e.clientX, e.clientY) - startAngle;
      this.setRotation(angle);
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      this.dial.style.cursor = "grab";
    });

    this.dial.addEventListener("touchstart", (e) => {
      isDragging = true;
      const touch = e.touches[0];
      const currentRotation = parseFloat(
        this.dial.style.getPropertyValue("--rotation") || "0"
      );
      startRotation = isNaN(currentRotation) ? this.minAngle : currentRotation;
      startAngle = getAngle(touch.clientX, touch.clientY) - startRotation;
      this.dial.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const angle = getAngle(touch.clientX, touch.clientY) - startAngle;
      this.setRotation(angle);
      e.preventDefault();
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
      this.dial.style.cursor = "grab";
    });
  }

  setupKeyboard() {
    this.dial.addEventListener("keydown", (e) => {
      const up = e.code === "ArrowUp" || e.code === "ArrowRight";
      const down = e.code === "ArrowDown" || e.code === "ArrowLeft";

      if (up || down) {
        e.preventDefault();
        const currentRotation = parseFloat(
          this.dial.style.getPropertyValue("--rotation") || `${this.minAngle}`
        );
        const step = this.angleSpan / this.ticks;
        let newRotation = currentRotation;

        if (up) newRotation = Math.min(this.maxAngle, currentRotation + step);
        if (down) newRotation = Math.max(this.minAngle, currentRotation - step);

        this.setRotation(newRotation);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new VolumeDial(document.getElementById("dial1"), {
    ticks: 31,
    color: "blue",
    volume: 0,
  });

  new VolumeDial(document.getElementById("dial2"), {
    ticks: 16,
    color: "green",
    volume: 0.5,
  });

  new VolumeDial(document.getElementById("dial3"), {
    ticks: 10,
    color: "red",
    volume: 0.2,
  });
});
