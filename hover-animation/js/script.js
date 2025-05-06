import { Pane } from "https://cdn.skypack.dev/tweakpane@4.0.4";

const config = {
  theme: "system",
};

const ctrl = new Pane({
  title: "Config",
  expanded: true,
});

const update = () => {
  document.documentElement.dataset.theme = config.theme;
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== "Theme"
  )
    return update();
  document.startViewTransition(() => update());
};

ctrl.addBinding(config, "theme", {
  label: "Theme",
  options: {
    System: "system",
    Light: "light",
    Dark: "dark",
  },
});

ctrl.on("change", sync);
update();

const list = document.querySelector("ul");
const items = list.querySelectorAll("li");
const setIndex = (event) => {
  const closest = event.target.closest("li");
  if (!closest) return;

  const index = [...items].indexOf(closest);

  requestAnimationFrame(() => {
    items.forEach((item, i) => {
      item.dataset.active = (index === i).toString();
    });

    const cols = [...items]
      .map((_, i) => (index === i ? "10fr" : "1fr"))
      .join(" ");

    list.style.setProperty("grid-template-columns", cols);
  });
};
list.addEventListener("pointerenter", setIndex, { passive: true });
list.addEventListener("focus", setIndex, true);
list.addEventListener("click", setIndex);
let resizeTimeout;
const resync = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const w = Math.max(...[...items].map((i) => i.offsetWidth));
    list.style.setProperty("--article-width", w);
  }, 100);
};

window.addEventListener("resize", resync);
resync();
