let lines;

export function init(root) {
  lines = Object.fromEntries([...root.querySelectorAll("[data-line]")].map((el) => [el.dataset.line, el]));
}

export function update(data) {
  const set = (name, text) => (lines[name].textContent = text || "");
  const hasData = data.playerFound === true;

  set("header", data.format && `${data.format}${data.tag ? ` | Tag ${data.tag}` : ""}`);
  set("races", data.races != null && `Races: ${data.races}`);
  set("score", hasData && `Score ${data.score}${data.teamScore != null ? ` (${data.teamScore})` : ""}`);
  set(
    "position",
    hasData &&
      `${data.ptsAhead != null ? `+${data.ptsAhead} ` : ""}${data.position}${data.ptsBehind != null ? ` -${data.ptsBehind}` : ""}`
  );
  set("status", data.apiError ? "⚠ API error" : data.playerFound === false ? "Player not found" : "");
}
