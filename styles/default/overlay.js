function update(data) {
  const overlay = document.getElementById("overlay");

  const teamScore = data.teamScore !== null ? ` (${data.teamScore})` : "";
  const ptsAhead = data.ptsAhead !== null ? `+${data.ptsAhead} ` : "";
  const ptsBehind = data.ptsBehind !== null ? ` -${data.ptsBehind}` : "";
  const tag = data.tag !== null ? ` | Tag ${data.tag}` : "";

  const elements = [
    `${data.format}${tag}`,
    `Races: ${data.races}`,
    `Score ${data.score}${teamScore}`,
    `${ptsAhead}${data.position}${ptsBehind}`,
  ];

  document.getElementById("overlay").innerHTML = "";
  Object.entries(elements.filter((n) => n)).forEach(([i, element]) => {
    if (i != 0) {
      overlay.appendChild(document.createElement("br"));
    }
    const span = document.createElement("span");
    span.textContent = element;
    overlay.appendChild(span);
  });
}
