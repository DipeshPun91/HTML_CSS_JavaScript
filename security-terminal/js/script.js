const PIN_LENGTH = 4;
const MAX_ATTEMPTS = 5;
const CORRECT_PIN = (() => {
  const digits = new Set();
  while (digits.size < 4) {
    digits.add(Math.floor(Math.random() * 10));
  }
  return Array.from(digits).join("");
})();

const pinDots = document.querySelectorAll(".pin-dot");
const keys = document.querySelectorAll(".key");
const attemptsCounter = document.querySelector(".attempts-number");
const logContent = document.getElementById("log-content");
const container = document.querySelector(".container");

let currentPin = "";
let attemptsRemaining = MAX_ATTEMPTS;
let isLocked = false;

function init() {
  addEventListeners();
  animateElements();
}

function addEventListeners() {
  keys.forEach((key) => {
    key.addEventListener("click", () => handleKeyPress(key));

    key.addEventListener("mouseenter", () => {
      playSound("hover");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      toggleBackgroundAudio();
    }
  });
}

function handleKeyPress(key) {
  if (isLocked) return;

  key.classList.add("clicked");
  setTimeout(() => key.classList.remove("clicked"), 300);

  playSound("keypress");

  const keyValue = key.getAttribute("data-key");

  switch (keyValue) {
    case "delete":
      deleteLastDigit();
      break;
    case "unlock":
      attemptUnlock();
      break;
    default:
      if (currentPin.length < PIN_LENGTH) {
        addDigit(keyValue);
      }
  }
}

function addDigit(digit) {
  if (currentPin.length < PIN_LENGTH) {
    currentPin += digit;
    updatePinDisplay();

    if (currentPin.length === PIN_LENGTH) {
      setTimeout(attemptUnlock, 500);
    }
  }
}

function deleteLastDigit() {
  if (currentPin.length > 0) {
    currentPin = currentPin.slice(0, -1);
    updatePinDisplay();
  }
}

function updatePinDisplay() {
  pinDots.forEach((dot, index) => {
    if (index < currentPin.length) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function attemptUnlock() {
  if (currentPin.length !== PIN_LENGTH) {
    shakeEffect(".pin-display");
    playSound("error");
    return;
  }

  attemptsRemaining--;
  attemptsCounter.textContent = attemptsRemaining;

  const isCorrect = checkPin(currentPin);

  if (isCorrect) {
    handleSuccessfulUnlock();
  } else {
    handleFailedAttempt();
  }

  currentPin = "";
  updatePinDisplay();
}

function checkPin(pin) {
  return pin === CORRECT_PIN;
}

function getPinFeedback(enteredPin) {
  const feedback = [];

  for (let i = 0; i < PIN_LENGTH; i++) {
    if (i < enteredPin.length) {
      const digit = enteredPin[i];

      if (digit === CORRECT_PIN[i]) {
        feedback.push("correct");
      } else if (CORRECT_PIN.includes(digit)) {
        feedback.push("wrong-position");
      } else {
        feedback.push("wrong");
      }
    } else {
      feedback.push("empty");
    }
  }

  return feedback;
}

function handleSuccessfulUnlock() {
  playSound("success");

  addLogEntry({
    message: "ACCESS GRANTED - DECRYPTION SUCCESSFUL",
    pin: currentPin,
    feedback: getPinFeedback(currentPin),
    type: "success",
  });

  container.classList.add("access-granted");

  document.body.style.animation = "pulseSuccess 0.5s 3";

  setTimeout(() => {
    alert("Access granted! System unlocked.");
    resetSystem();
  }, 1500);
}

function handleFailedAttempt() {
  playSound("error");
  shakeEffect(".keypad-container");

  addLogEntry({
    message: `INVALID PIN - ATTEMPT ${
      MAX_ATTEMPTS - attemptsRemaining
    } OF ${MAX_ATTEMPTS}`,
    pin: currentPin,
    feedback: getPinFeedback(currentPin),
    type: "error",
  });

  if (attemptsRemaining <= 0) {
    setTimeout(lockSystem, 500);
  }
}

function lockSystem() {
  isLocked = true;

  const lockMessage = "SECURITY BREACH DETECTED - SYSTEM LOCKED";
  addLogEntry({
    message: lockMessage,
    type: "error",
    isLockout: true,
  });

  playSound("lockdown");

  shakeEffect(".keypad-container", 10);
  shakeEffect(".log-container", 10);

  container.classList.add("system-locked");

  setTimeout(() => {
    alert("Too many failed attempts. System locked!");
    resetSystem();
  }, 3000);
}

function resetSystem() {
  currentPin = "";
  attemptsRemaining = MAX_ATTEMPTS;
  isLocked = false;

  updatePinDisplay();
  attemptsCounter.textContent = attemptsRemaining;
  container.classList.remove("system-locked", "access-granted");

  if (logContent.querySelector(".log-placeholder")) {
    return;
  }

  logContent.innerHTML = `
        <div class="log-placeholder">
            <div class="scanner-line"></div>
            <p>ENTER ACCESS CODE</p>
            <p>5 ATTEMPTS BEFORE SECURITY LOCKDOWN</p>
        </div>
    `;

  playSound("reset");
}

function addLogEntry(entry) {
  const placeholder = logContent.querySelector(".log-placeholder");
  if (placeholder) {
    logContent.removeChild(placeholder);
  }

  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${entry.type || ""}`;

  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, "0")}`;

  let logHTML = `<div class="timestamp">[${timestamp}]</div>`;
  logHTML += `<div class="message">${entry.message}</div>`;

  if (entry.pin && entry.feedback) {
    logHTML += '<div class="code">';

    for (let i = 0; i < PIN_LENGTH; i++) {
      if (i < entry.pin.length) {
        const digitClass = entry.feedback[i];
        logHTML += `<div class="digit ${digitClass}">${entry.pin[i]}</div>`;
      } else {
        logHTML += `<div class="digit">-</div>`;
      }
    }

    logHTML += "</div>";
  }

  if (entry.isLockout) {
    logHTML += `
            <div class="lockout-animation">
                <div class="lockout-text">SYSTEM LOCKDOWN</div>
            </div>
        `;
  }

  logEntry.innerHTML = logHTML;
  logContent.appendChild(logEntry);

  logContent.scrollTop = logContent.scrollHeight;
}

function shakeEffect(selector, intensity = 5) {
  const element = document.querySelector(selector);
  element.style.animation = `shake 0.5s cubic-bezier(.36,.07,.19,.97) both`;
  element.style.transform = `translate3d(0, 0, 0)`;

  const keyframes = `
        @keyframes shake {
            10%, 90% { transform: translate3d(${-intensity}px, 0, 0); }
            20%, 80% { transform: translate3d(${intensity * 2}px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(${-intensity * 2}px, 0, 0); }
            40%, 60% { transform: translate3d(${intensity * 2}px, 0, 0); }
        }
    `;

  let style = document.getElementById("shake-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "shake-style";
    document.head.appendChild(style);
  }

  style.innerHTML = keyframes;

  setTimeout(() => {
    element.style.animation = "";
  }, 500);
}

function playSound(type) {
  if (!window.audioContext) {
    window.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }

  const context = window.audioContext;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.connect(gain);
  gain.connect(context.destination);

  switch (type) {
    case "keypress":
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        440,
        context.currentTime + 0.1
      );
      gain.gain.setValueAtTime(0.2, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
      break;

    case "error":
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(300, context.currentTime);
      oscillator.frequency.setValueAtTime(280, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(260, context.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
      break;

    case "success":
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      oscillator.frequency.setValueAtTime(554, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(659, context.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
      break;

    case "lockdown":
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(180, context.currentTime);
      oscillator.frequency.setValueAtTime(150, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(120, context.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(100, context.currentTime + 0.3);
      gain.gain.setValueAtTime(0.4, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.4);
      break;

    case "hover":
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1760, context.currentTime);
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.05);
      break;

    case "reset":
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(659, context.currentTime);
      oscillator.frequency.setValueAtTime(554, context.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(440, context.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
      break;
  }
}

let backgroundAudio = null;

function createBackgroundAudio() {
  if (!window.audioContext) {
    window.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }

  const context = window.audioContext;

  const bufferSize = 2 * context.sampleRate;
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;

  const gain = context.createGain();
  gain.gain.value = 0.03;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  noise.start(0);

  return {
    noise,
    gain,
    filter,
    isPlaying: true,
  };
}

function toggleBackgroundAudio() {
  if (!backgroundAudio) {
    backgroundAudio = createBackgroundAudio();
  } else {
    if (backgroundAudio.isPlaying) {
      backgroundAudio.gain.gain.value = 0;
      backgroundAudio.isPlaying = false;
    } else {
      backgroundAudio.gain.gain.value = 0.03;
      backgroundAudio.isPlaying = true;
    }
  }
}

function animateElements() {
  const glow = document.querySelector(".glow");
  setInterval(() => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0, 255, 213, 0.1), transparent 70%)`;
  }, 3000);

  document.addEventListener(
    "click",
    () => {
      if (!backgroundAudio) {
        backgroundAudio = createBackgroundAudio();
      }
    },
    { once: true }
  );
}

init();
