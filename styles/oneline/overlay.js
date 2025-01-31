function update(data) {
  const overlay = document.getElementById("overlay");

  const teamScore = data.teamScore !== null ? ` (${data.teamScore})` : "";
  const ptsAhead = data.ptsAhead !== null ? `+${data.ptsAhead} ` : "";
  const ptsBehind = data.ptsBehind !== null ? ` -${data.ptsBehind}` : "";

  const elements = [
    data.format,
    data.tag !== null ? `Tag ${data.tag}` : null,
    `Races: ${data.races}`,
    `Score ${data.score}${teamScore}`,
    `${ptsAhead}${data.position}${ptsBehind}`,
  ];

  document.getElementById("overlay").innerHTML = "";
  Object.entries(elements.filter((n) => n)).forEach(([i, element]) => {
    if (i != 0) {
      element = "\u00A0| ".concat(element);
    }
    const span = document.createElement("span");
    span.textContent = element;
    overlay.appendChild(span);
  });
}
