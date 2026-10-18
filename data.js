const REQUEST_TIMEOUT_MS = 10000;

export async function fetchTable(apiUrl, tableID) {
  const url = `${apiUrl.replace(/\/+$/, "")}/api/json/team_scores/${encodeURIComponent(tableID)}?style=none`;
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? `HTTP ${response.status}`);
  }
  return response.json();
}

// Every field a theme receives; all null until the first successful fetch.
export const EMPTY_STATS = {
  apiError: false,
  playerFound: null,
  format: null,
  tag: null,
  races: null,
  score: null,
  teamScore: null,
  rank: null,
  tied: null,
  position: null,
  ptsAhead: null,
  ptsBehind: null,
};

const normalizeFC = (fc) => String(fc).replace(/\D/g, "");

export function ordinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`;
}

export function computeStats(table, fc) {
  const ffa = table.format === "FFA";
  const target = normalizeFC(fc);

  // In FFA the API puts every player on one team, so split them into one team each.
  const teams = ffa
    ? Object.values(table.teams).flatMap((team) =>
        Object.entries(team.players).map(([playerFC, player]) => ({
          tag: null,
          score: Number(player.total_score),
          players: { [playerFC]: player },
        }))
      )
    : Object.entries(table.teams).map(([tag, team]) => ({
        tag,
        score: Number(team.total_score),
        players: team.players,
      }));

  let player = null;
  const team = teams.find((t) => {
    const match = Object.entries(t.players).find(([playerFC]) => normalizeFC(playerFC) === target);
    if (match) player = match[1];
    return match;
  });

  const base = { ...EMPTY_STATS, format: table.format, races: table.races_played };
  if (!team) return { ...base, playerFound: false };

  const others = teams.filter((t) => t !== team).map((t) => t.score);
  const higher = others.filter((s) => s > team.score);
  const lower = others.filter((s) => s < team.score);
  const rank = higher.length + 1;
  const tied = others.includes(team.score);

  return {
    ...base,
    playerFound: true,
    tag: team.tag,
    score: Number(player.total_score),
    teamScore: ffa ? null : team.score,
    rank,
    tied,
    position: `${tied ? "Tied " : ""}${ordinal(rank)}`,
    ptsAhead: lower.length ? team.score - Math.max(...lower) : null,
    ptsBehind: higher.length ? Math.min(...higher) - team.score : null,
  };
}
