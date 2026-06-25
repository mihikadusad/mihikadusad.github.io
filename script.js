const imagePairs = {
  light: {
    home: ["assets/light_ny_1.jpg", "assets/light_ny_2.jpeg"],
    research: ["assets/light_ny_3.jpg", "assets/light_ny_4.jpg"],
    projects: ["assets/light_ny_5.jpeg", "assets/light_ny_6.jpeg"],
    sidequests: ["assets/light_ny_2.jpeg", "assets/light_ny_5.jpeg"],
    "media-consumption": ["assets/light_ny_4.jpg", "assets/light_ny_6.jpeg"],
  },
  dark: {
    home: ["assets/dark_ny_1.webp", "assets/dark_ny_2.png"],
    research: ["assets/dark_ny_3.png", "assets/dark_ny_4.jpeg"],
    projects: ["assets/dark_ny_5.jpg", "assets/dark_ny_6.jpg"],
    sidequests: ["assets/dark_ny_2.png", "assets/dark_ny_5.jpg"],
    "media-consumption": ["assets/dark_ny_4.jpeg", "assets/dark_ny_6.jpg"],
  },
};

const root = document.documentElement;
const panels = Array.from(document.querySelectorAll(".view-panel"));
const links = Array.from(document.querySelectorAll(".tab-link"));
const themeToggle = document.querySelector("#themeToggle");
const coverLeft = document.querySelector("#coverLeft");
const coverRight = document.querySelector("#coverRight");

const validViews = new Set(panels.map((panel) => panel.id));

function getPreferredTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {
    saved = null;
  }

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getActiveView() {
  const id = window.location.hash.replace("#", "");
  return validViews.has(id) ? id : "home";
}

function setBackground(view) {
  const theme = root.dataset.theme === "dark" ? "dark" : "light";
  const pair = imagePairs[theme][view] || imagePairs[theme].home;
  coverLeft.style.backgroundImage = `url("${pair[0]}")`;
  coverRight.style.backgroundImage = `url("${pair[1]}")`;
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Some local file contexts block storage; the theme still applies for the page view.
  }
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  setBackground(getActiveView());
}

function showView(view) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === view);
  });

  links.forEach((link) => {
    const isCurrent = link.dataset.view === view;
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  setBackground(view);
}

function preloadImages() {
  Object.values(imagePairs).forEach((themePairs) => {
    Object.values(themePairs).forEach((pair) => {
      pair.forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    });
  });
}

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

window.addEventListener("hashchange", () => {
  showView(getActiveView());
});

setTheme(getPreferredTheme());
showView(getActiveView());
preloadImages();
