document.addEventListener("DOMContentLoaded", function () {
  const data = generateFakeData();
  const viewersOfWeek = data.slice(-7);
  const mostViewers = Math.max(...viewersOfWeek.map((item) => item.viewers));
  const viewersMax = Math.ceil(mostViewers / 1e4) * 1e4;
  const [groupA, groupB] = viewersOfWeek.slice(-2).reverse();

  updateSummary(groupA.viewers, groupB?.viewers || 0);

  createGraphBars(viewersOfWeek, viewersMax);

  animateBars();
});

function generateFakeData() {
  const items = [];
  const minViewers = 7000;
  const maxViewers = 50000;

  for (let i = 0; i < 7; ++i) {
    const today = new Date();
    const date = today.setDate(today.getDate() - i);
    items.unshift({
      date: new Date(date),
      viewers:
        Math.round(Math.random() * (maxViewers - minViewers)) + minViewers,
    });
  }

  return items;
}

function updateSummary(groupA, groupB) {
  const currentViewersEl = document.getElementById("current-viewers");
  const changePercentageEl = document.getElementById("change-percentage");

  currentViewersEl.textContent = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(groupA);

  let change = groupA / groupB - 1;
  if (change === Infinity) change = 1;
  else if (isNaN(change)) change = 0;

  const changeFormatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(Math.abs(change));

  const changeIsLess = groupA < groupB;
  const noChange = groupA === groupB;
  const arrowDirection = changeIsLess
    ? "down-right"
    : noChange
    ? "right"
    : "up-right";
  const iconColor = changeIsLess ? "danger" : noChange ? "neutral" : "success";

  changePercentageEl.innerHTML = `
        ${changeFormatted}
        <svg class="icon icon--${iconColor}" width="16px" height="16px" aria-hidden="true">
            <use href="#arrow-${arrowDirection}" />
        </svg>
    `;
}

function createGraphBars(data, max) {
  const graphContainer = document.getElementById("activity-graph");
  const shortDateFormat = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "numeric",
  });

  graphContainer.innerHTML = "";

  if (data.length === 0) {
    graphContainer.innerHTML =
      '<div class="activity__graph-empty"><em>No data</em></div>';
    return;
  }

  data.forEach((item, i) => {
    const { date, viewers } = item;
    const shortDate = shortDateFormat.format(date);
    const value = Math.min(viewers, max);
    const fraction = value / max;
    const fractionInvert = 1 - fraction;

    const firstLevel = { hue: 3, percent: 0 };
    const levelMap = [
      firstLevel,
      { hue: 33, percent: 0.2 },
      { hue: 253, percent: 0.4 },
      { hue: 223, percent: 0.6 },
      { hue: 193, percent: 0.8 },
    ];
    const level =
      levelMap.reverse().find((item) => fraction > item.percent) || firstLevel;
    const { hue } = level;

    const knobWidth = 0.75;
    const translateStart = `translateY(calc(100% - ${knobWidth}em))`;
    const translateEnd = `translateY(calc(${fractionInvert * 100}% - ${
      fractionInvert * knobWidth
    }em))`;

    const valueFormatted = new Intl.NumberFormat("en-US").format(viewers);
    const tipHash = Math.round(Math.random() * 0xffff).toString(16);

    const barElement = document.createElement("div");
    barElement.className = "activity__graph-bar";
    barElement.innerHTML = `
            <div class="activity__graph-bar-outer">
                <div class="activity__graph-bar-inner">
                    <svg class="activity__graph-bar-svg" viewBox="0 0 2 24" width="2px" height="24px" role="img" aria-label="Bar filled at ${(
                      fraction * 100
                    ).toFixed(1)}%" style="transform: ${translateStart}">
                        <defs>
                            <linearGradient id="bar-fill-${hue}-${i}" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stop-color="hsl(${hue},90%,50%)" />
                                <stop offset="1" stop-color="hsl(${hue},90%,70%)" />
                            </linearGradient>
                        </defs>
                        <g stroke-linecap="round" stroke-width="2">
                            <line x1="1" y1="1" x2="1" y2="23" />
                            <line x1="1.0001" y1="1" x2="1" y2="23" stroke="url(#bar-fill-${hue}-${i})" />
                        </g>
                    </svg>
                    <div class="activity__graph-bar-knob-track" style="transform: ${translateStart}">
                        <button type="button" class="activity__graph-bar-knob" aria-labelledby="tip-${tipHash} tip-${tipHash}-label" style="background-color: hsl(${hue},90%,90%)"></button>
                    </div>
                </div>
                <div class="activity__tip-wrapper" style="transform: ${translateStart}">
                    <div id="tip-${tipHash}" class="activity__tip">
                        <small>${valueFormatted}</small>
                    </div>
                </div>
            </div>
            <small id="tip-${tipHash}-label" class="activity__graph-label">${shortDate}</small>
        `;

    graphContainer.appendChild(barElement);
  });
}

function animateBars() {
  setTimeout(() => {
    const bars = document.querySelectorAll(
      ".activity__graph-bar-svg, .activity__graph-bar-knob-track"
    );
    bars.forEach((bar) => {
      const currentTransform = bar.style.transform;
      bar.style.transform = currentTransform.replace(
        /translateY\([^)]+\)/,
        "translateY(100%)"
      );

      setTimeout(() => {
        bar.style.transform = currentTransform;
      }, 50);
    });
  }, 100);
}
