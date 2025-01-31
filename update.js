const tablebotAPI = "https://mkw-table-bot-api.jprq.site";

async function getTable(id) {
  try {
    const response = await fetch(
      tablebotAPI + "/api/json/team_scores/" + id + "?style=none"
    );
    if (!response.ok) {
      const error = await response.json();
      console.error(error.detail);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateOverlay(fc, tableID) {
  getTable(tableID).then((table) => {
    const ffa = table.format === "FFA";
    let teams;
    if (ffa) {
      // The table bot API stores all players on one team in FFA, so this code
      // changes that so each player in the ffa is on their own team
      teams = [];
      for (let [fc, player] of Object.entries(table.teams["No Tag"].players)) {
        teams.push({
          total_score: player.total_score,
          players: { [fc]: player },
        });
      }
    } else {
      teams = Object.values(table.teams);
    }

    const teamIdx = teams.findIndex((team) =>
      Object.keys(team.players).includes(fc)
    );

    if (teamIdx == -1) {
      console.error(`FC not found on table with id: ${tableID}`);
      return;
    }

    const positions = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
    ];
    let posIdx = teamIdx;
    const teamScore = teams[teamIdx].total_score;

    const tied =
      teams?.[teamIdx + 1]?.total_score === teamScore ||
      teams?.[teamIdx - 1]?.total_score === teamScore;

    let i = teamIdx + 1;
    let ptsAhead = null;
    while (true) {
      let nextTeam = teams?.[i];
      if (nextTeam === undefined) {
        break;
      } else if (nextTeam.total_score === teamScore) {
        i++;
      } else {
        ptsAhead = `${
          parseInt(teams[teamIdx].total_score) - parseInt(nextTeam.total_score)
        }`;
        break;
      }
    }

    i = teamIdx - 1;
    let ptsBehind = null;
    while (true) {
      let nextTeam = teams?.[i];
      if (nextTeam === undefined) {
        break;
      } else if (nextTeam.total_score === teamScore) {
        i--;
        posIdx--; // move the position index to the highest tied pos
      } else {
        ptsBehind = `${
          parseInt(nextTeam.total_score) - parseInt(teams[teamIdx].total_score)
        }`;
        break;
      }
    }

    const elements = {
      tag: !ffa ? Object.keys(table.teams)[teamIdx] : null,
      format: table.format,
      races: table.races_played,
      score: teams[teamIdx].players[fc].total_score,
      teamScore: !ffa ? teamScore : null,
      position: `${tied ? "Tied " : ""}${positions[posIdx]}`,
      ptsAhead: ptsAhead,
      ptsBehind: ptsBehind,
    };

    update(elements);
  });
}

export async function startOverlay(fc, tableID, refreshInterval) {
  function startAutoRefresh(refreshInterval) {
    setTimeout(function () {
      updateOverlay(fc, tableID);
      startAutoRefresh(refreshInterval);
    }, refreshInterval);
  }
  updateOverlay(fc, tableID);
  startAutoRefresh(refreshInterval);
}
