import { getApiUrl } from "./config.js";
import { fetchTable, computeStats, EMPTY_STATS } from "./data.js";
import { THEMES } from "./themes/themes.js";

const BASE_INTERVAL_MS = 10000;
const MAX_INTERVAL_MS = 60000;

const root = document.getElementById("overlay");
const params = new URLSearchParams(location.search);
const fc = params.get("fc");
const tableID = params.get("tableID");

let themeName = params.get("theme") ?? "default";
if (!THEMES.includes(themeName)) {
  console.warn(`Unknown theme "${themeName}", using default`);
  themeName = "default";
}

function loadStylesheet(href) {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = link.onerror = resolve;
    document.head.appendChild(link);
  });
}

async function loadTheme(name) {
  const dir = `./themes/${name}`;
  const [, html] = await Promise.all([
    loadStylesheet(`${dir}/theme.css`),
    fetch(`${dir}/theme.html`)
      .then((r) => (r.ok ? r.text() : ""))
      .catch(() => ""),
  ]);
  root.innerHTML = html;
  const theme = await import(`${dir}/theme.js`);
  theme.init?.(root);
  return theme;
}

function render(theme, data) {
  try {
    theme.update(data);
  } catch (err) {
    console.error("Theme update failed", err);
  }
}

async function start() {
  if (!fc || !tableID) {
    root.textContent = "Missing fc or tableID. Open the setup page (index.html) to create an overlay link.";
    return;
  }

  const theme = await loadTheme(themeName);
  const apiUrl = getApiUrl();
  let last = null;
  let lastJSON = null;
  let failures = 0;

  async function poll() {
    try {
      const stats = { ...computeStats(await fetchTable(apiUrl, tableID), fc), apiError: false };
      failures = 0;
      last = stats;
      const json = JSON.stringify(stats);
      if (json !== lastJSON) {
        lastJSON = json;
        render(theme, stats);
      }
    } catch (err) {
      console.error(err);
      failures++;
      lastJSON = null; // re-render once the API recovers
      render(theme, { ...(last ?? EMPTY_STATS), apiError: true });
    }
    // Schedule after completion so requests never overlap; back off on repeated errors.
    const delay = Math.min(BASE_INTERVAL_MS * 2 ** failures, MAX_INTERVAL_MS);
    setTimeout(poll, delay);
  }

  poll();
}

start();
