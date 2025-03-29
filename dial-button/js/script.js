class VolumeDial {
  constructor(element, options = {}) {
    this.element = element;
    this.ticks = 16;
    this.volume = options.volume || 0;
    this.color = options.color || "";
    this.label = options.label || "Volume";
    this.clockwise = options.clockwise !== false;

    this.minAngle = -135;
    this.maxAngle = 135;
    this.angleSpan = this.maxAngle - this.minAngle;
    this.dotSectorAngle = this.angleSpan / this.ticks;
    this.dotSectorAngleOffset = this.minAngle + this.dotSectorAngle / 2;

    this.dial = this.element.querySelector(".volume__dial");
    this.control = this.element.querySelector(".volume__control");

    this.currentRotation = this.minAngle + this.volume * this.angleSpan;
    this.lastAngle = null;
    this.init();
  }

  init() {
    this.createDots();
    this.setRotation(this.currentRotation);
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
    this.currentRotation = angle;

    const rotationAngle = this.clockwise ? angle : -angle;
    this.dial.style.setProperty("--rotation", `${rotationAngle}deg`);

    const currentTick = Math.floor(
      ((angle - this.minAngle) / this.angleSpan) * this.ticks
    );
    const dots = this.element.querySelectorAll(".volume__dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("volume__dot--filled", index < currentTick);
    });

    const percent = Math.round(
      ((angle - this.minAngle) / this.angleSpan) * 100
    );
    this.dial.setAttribute("aria-description", `${percent}%`);
  }

  setupDrag() {
    let isDragging = false;
    let startRotation;

    const getAngleFromEvent = (clientX, clientY) => {
      const rect = this.dial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = clientX - centerX;
      const y = clientY - centerY;
      return Math.atan2(y, x) * (180 / Math.PI);
    };

    const startDrag = (clientX, clientY) => {
      isDragging = true;
      startRotation = this.currentRotation;
      this.lastAngle = getAngleFromEvent(clientX, clientY);
      this.dial.style.cursor = "grabbing";
    };

    const doDrag = (clientX, clientY) => {
      if (!isDragging) return;

      const currentAngle = getAngleFromEvent(clientX, clientY);

      let angleDelta = currentAngle - this.lastAngle;

      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;

      const direction = this.clockwise ? 1 : -1;
      const newRotation = this.currentRotation + angleDelta * direction;

      this.setRotation(newRotation);
      this.lastAngle = currentAngle;
    };

    const endDrag = () => {
      isDragging = false;
      this.dial.style.cursor = "grab";
      this.lastAngle = null;
    };

    this.dial.addEventListener("mousedown", (e) => {
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      doDrag(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", endDrag);

    this.dial.addEventListener("touchstart", (e) => {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
      doDrag(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    });

    document.addEventListener("touchend", endDrag);
  }

  setupKeyboard() {
    this.dial.addEventListener("keydown", (e) => {
      const up = e.code === "ArrowUp" || e.code === "ArrowRight";
      const down = e.code === "ArrowDown" || e.code === "ArrowLeft";
      if (up || down) {
        e.preventDefault();
        const step = this.angleSpan / this.ticks;
        const direction = this.clockwise ? 1 : -1;
        let newRotation =
          this.currentRotation + (up ? step : -step) * direction;
        this.setRotation(newRotation);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new VolumeDial(document.getElementById("dial1"), {
    color: "blue",
    volume: 0,
    clockwise: false,
  });

  new VolumeDial(document.getElementById("dial2"), {
    color: "green",
    volume: 0,
  });

  new VolumeDial(document.getElementById("dial3"), {
    color: "red",
    volume: 0,
  });
});
