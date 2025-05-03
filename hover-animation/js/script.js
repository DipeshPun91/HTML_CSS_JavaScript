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

// the one piece we need goes here
const list = document.querySelector("ul");
const items = list.querySelectorAll("li");
const setIndex = (event) => {
  // for flex
  // if (event.target.closest('li'))
  //   for (const item of items)
  //     item.dataset.active =
  //       item === event.target.closest('li') ? 'true' : 'false'
  // for grid
  const closest = event.target.closest("li");
  if (closest) {
    const index = [...items].indexOf(closest);
    const cols = new Array(list.children.length)
      .fill()
      .map((_, i) => {
        items[i].dataset.active = (index === i).toString();
        return index === i ? "10fr" : "1fr";
      })
      .join(" ");
    list.style.setProperty("grid-template-columns", cols);
  }
};
list.addEventListener("focus", setIndex, true);
list.addEventListener("click", setIndex);
list.addEventListener("pointermove", setIndex);
const resync = () => {
  const w = Math.max(
    ...[...items].map((i) => {
      return i.offsetWidth;
    })
  );
  list.style.setProperty("--article-width", w);
};
window.addEventListener("resize", resync);
resync();
