import { startOverlay } from "./update.js";

const urlParams = new URLSearchParams(window.location.search);

const fc = urlParams.get("fc");
const style = urlParams.get("style");
const tableID = urlParams.get("tableID");

if (!fc || !tableID) {
  document.getElementById("setupButton").onclick = () => {
    const fc = document.getElementById("fc").value;
    const style = document.getElementById("style").value;
    const tableID = document.getElementById("tableID").value;
    let url = new URL(window.location);
    url.searchParams.set("fc", fc);
    url.searchParams.set("tableID", tableID);
    url.searchParams.set("style", style);
    window.location.href = url.toString();
  };
} else {
  if (style !== "None") {
    // This code injects an html file for a style into the overlay div.
    // This can be uncommented if a style is ever made that wants to use this feature
    // fetch(`styles/${style}/overlay.html`).then((response) => {
    //   if (response.ok) {
    //     response.text().then((htmlContent) => {
    //       document.getElementById("overlay").innerHTML = htmlContent;
    //     });
    //   }
    // });

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = `styles/${style}/style.css`;
    document.head.appendChild(styleLink);

    const scriptLink = document.createElement("script");
    scriptLink.type = "text/javascript";
    scriptLink.src = `styles/${style}/overlay.js`;
    document.head.appendChild(scriptLink);
  }
  document.getElementById("setupHelper").remove();
  startOverlay(fc, tableID, 7500);
}
