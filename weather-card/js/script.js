document.addEventListener("DOMContentLoaded", function () {
  const weatherCard = document.querySelector(".weather-card");
  const weatherBtns = document.querySelectorAll(".weather-btn");
  const temperature = document.querySelector(".temperature");
  const description = document.querySelector(".description");
  const dateElement = document.querySelector(".date");
  const sun = document.querySelector(".sun");
  const cloudsContainer = document.querySelector(".clouds");
  const rainContainer = document.querySelector(".rain");
  const snowContainer = document.querySelector(".snow");
  const lightningContainer = document.querySelector(".lightning");
  const weatherIcon = document.querySelector(".weather-icon");

  let lightningInterval;

  const weatherData = {
    sun: {
      temp: "24°C",
      desc: "Sunny",
      color: "linear-gradient(135deg, #ffd700 0%, #87ceeb 100%)",
      elements: () => {
        sun.style.display = "block";
        cloudsContainer.style.display = "none";
        rainContainer.style.display = "none";
        snowContainer.style.display = "none";
        lightningContainer.style.display = "none";
      },
    },
    rain: {
      temp: "18°C",
      desc: "Rainy",
      color: "linear-gradient(135deg, #616161 0%, #3498db 100%)",
      elements: () => {
        sun.style.display = "none";
        createClouds();
        createRain();
        cloudsContainer.style.display = "block";
        rainContainer.style.display = "block";
        snowContainer.style.display = "none";
        lightningContainer.style.display = "none";
      },
    },
    cloud: {
      temp: "20°C",
      desc: "Cloudy",
      color: "linear-gradient(135deg, #b0bec5 0%, #dfebee 100%)",
      elements: () => {
        sun.style.display = "none";
        createClouds();
        cloudsContainer.style.display = "block";
        rainContainer.style.display = "none";
        snowContainer.style.display = "none";
        lightningContainer.style.display = "none";
      },
    },
    thunder: {
      temp: "22°C",
      desc: "Stormy",
      color: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
      elements: () => {
        sun.style.display = "none";
        createClouds();
        createLightning();
        cloudsContainer.style.display = "block";
        rainContainer.style.display = "none";
        snowContainer.style.display = "none";
        lightningContainer.style.display = "block";
        animateLightning();
      },
    },
    snow: {
      temp: "-2°C",
      desc: "Snowy",
      color: "linear-gradient(135deg, #bbdefb 0%, #e1f5fe 100%)",
      elements: () => {
        sun.style.display = "none";
        createClouds();
        createSnow();
        cloudsContainer.style.display = "block";
        rainContainer.style.display = "none";
        snowContainer.style.display = "block";
        lightningContainer.style.display = "none";
      },
    },
  };

  function setDate() {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", options);
  }

  function createClouds() {
    cloudsContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const cloud = document.createElement("div");
      cloud.className = "cloud";
      cloud.style.width = `${60 + Math.random() * 40}px`;
      cloud.style.height = `${20 + Math.random() * 20}px`;
      cloud.style.top = `${30 + Math.random() * 100}px`;
      cloud.style.left = `${Math.random() * 300}px`;
      cloudsContainer.appendChild(cloud);
    }
  }

  function createRain() {
    rainContainer.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const drop = document.createElement("div");
      drop.className = "drop";
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = `${-10 + Math.random() * 20}%`;
      drop.style.height = `${5 + Math.random() * 10}px`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      rainContainer.appendChild(drop);
    }
  }

  function createSnow() {
    snowContainer.innerHTML = "";
    for (let i = 0; i < 100; i++) {
      const flake = document.createElement("div");
      flake.className = "flake";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.top = `${-10 + Math.random() * 20}%`;
      flake.style.width = flake.style.height = `${2 + Math.random() * 3}px`;
      flake.style.opacity = Math.random();
      flake.style.animationDelay = `${Math.random() * 5}s`;
      flake.style.animationDuration = `${3 + Math.random() * 5}s`;
      snowContainer.appendChild(flake);
    }
  }

  function createLightning() {
    lightningContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const bolt = document.createElement("div");
      bolt.className = "bolt";
      bolt.style.left = `${20 + Math.random() * 60}%`;
      bolt.style.top = `${10 + Math.random() * 30}%`;
      bolt.style.width = `${5 + Math.random() * 10}px`;
      bolt.style.height = `${30 + Math.random() * 50}px`;
      bolt.style.opacity = 0;
      lightningContainer.appendChild(bolt);
    }
  }

  function animateLightning() {
    if (lightningInterval) {
      clearInterval(lightningInterval);
    }

    const bolts = document.querySelectorAll(".bolt");
    bolts.forEach((bolt) => {
      setTimeout(() => {
        bolt.style.opacity = 0.8;
        setTimeout(() => {
          bolt.style.opacity = 0;
        }, 100);
      }, Math.random() * 3000);
    });

    lightningInterval = setInterval(() => {
      bolts.forEach((bolt) => {
        setTimeout(() => {
          bolt.style.opacity = 0.8;
          setTimeout(() => {
            bolt.style.opacity = 0;
          }, 100);
        }, Math.random() * 1000);
      });
    }, 3000);
  }

  function setWeather(weatherType) {
    weatherBtns.forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector(`[data-weather="${weatherType}"]`)
      .classList.add("active");

    const weather = weatherData[weatherType];
    temperature.textContent = weather.temp;
    description.textContent = weather.desc;
    weatherIcon.style.background = weather.color;

    weather.elements();

    weatherCard.style.animation = "none";
    setTimeout(() => {
      weatherCard.style.animation = "cardTransition 0.5s ease";
    }, 10);
  }

  weatherBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const weatherType = btn.getAttribute("data-weather");
      setWeather(weatherType);
    });
  });

  setTimeout(() => {
    setDate();
    setWeather("sun");
  }, 100);
});
