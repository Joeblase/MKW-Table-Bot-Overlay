let items;

export function init(root) {
  items = Object.fromEntries([...root.querySelectorAll("[data-item]")].map((el) => [el.dataset.item, el]));
}

export function update(data) {
  const set = (name, text) => (items[name].textContent = text || "");
  const hasData = data.playerFound === true;

  set("format", data.format);
  set("tag", data.tag && `Tag ${data.tag}`);
  set("races", data.races != null && `Races: ${data.races}`);
  set("score", hasData && `Score ${data.score}${data.teamScore != null ? ` (${data.teamScore})` : ""}`);
  set(
    "position",
    hasData &&
      `${data.ptsAhead != null ? `+${data.ptsAhead} ` : ""}${data.position}${data.ptsBehind != null ? ` -${data.ptsBehind}` : ""}`
  );
  set("status", data.apiError ? "⚠ API error" : data.playerFound === false ? "Player not found" : "");
}
