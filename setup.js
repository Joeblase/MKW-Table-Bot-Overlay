import { DEFAULT_API_URL, getApiUrl, setApiUrl } from "./config.js";
import { THEMES } from "./themes/themes.js";

const form = document.getElementById("setupForm");
const themeSelect = document.getElementById("theme");
const apiUrlInput = document.getElementById("apiUrl");

for (const name of THEMES) {
  themeSelect.add(new Option(name, name));
}

apiUrlInput.value = getApiUrl();
document.getElementById("resetApiUrl").onclick = () => {
  apiUrlInput.value = DEFAULT_API_URL;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setApiUrl(apiUrlInput.value.trim());

  const url = new URL("overlay.html", location.href);
  url.searchParams.set("fc", document.getElementById("fc").value.trim());
  url.searchParams.set("tableID", document.getElementById("tableID").value.trim());
  url.searchParams.set("theme", themeSelect.value);
  location.href = url.toString();
});
