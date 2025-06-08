// src/mock/statisticsMock.js

function generateRandomReport(id) {
  const players = ["Thorin", "Eowyn", "Gimli", "Faramir", "Aragorn", "Legolas"];
  const opponents = ["Elrond", "Saruman", "Boromir", "Gollum", "Sauron", "Witch King"];
  const maps = [
  "Clearwater Springs",
  "Ancient Fortifications",
  "Dormant Caldera",
  "Abandoned Settlement",
  "Historic Battlefield",
  "Mountainous Crags",
];

  const deployments = [
    "Frontline Clash",
    "Refused Flank",
    "Spearhead",
    "Mutual Encroachment",
    "Cornerstone",
    "Bottleneck",
  ];
  const missions = [
    "Spoils of War",
    "Breakthrough",
    "Hold the Centre",
    "Forage and Plunder",
    "Secure Target",
    "Hidden Agendas",
  ];
  const secondaries = [
    "Capture the Flags",
    "Stand Firm",
    "Slay the Beast",
    "Work as One",
    "Forbid Trespass",
    "Demonstrate Superiority",
  ];

  const playerName = players[Math.floor(Math.random() * players.length)];
  const opponentName = opponents[Math.floor(Math.random() * opponents.length)];
  const map = maps[Math.floor(Math.random() * maps.length)];
  const deployment = deployments[Math.floor(Math.random() * deployments.length)];
  const primaryMission = missions[Math.floor(Math.random() * missions.length)];
  const secondaryPlayer = secondaries[Math.floor(Math.random() * secondaries.length)];
  const secondaryOpponent = secondaries[Math.floor(Math.random() * secondaries.length)];

  // Random points (simulate normal results around 4000 total points)
  const pointsPlayer = Math.floor(Math.random() * 4000);
  const pointsOpponent = Math.floor(Math.random() * 4000);

  let finalScore = calculateFinalScore(pointsPlayer, pointsOpponent);

  const primaryResult = ["player", "opponent", "both", "none"][Math.floor(Math.random() * 4)];

  return {
    id,
    date: randomDate(),
    player: { name: playerName },
    opponent: { name: opponentName },
    map,
    deployment,
    primaryMission,
    primaryResult,
    secondaryPlayer,
    secondaryOpponent,
    pointsPlayer,
    pointsOpponent,
    finalScore,
  };
}

function calculateFinalScore(playerPoints, opponentPoints) {
  const diff = Math.abs(playerPoints - opponentPoints);
  let playerScore = 10;
  let opponentScore = 10;

  if (diff <= 200) {
    playerScore = 10;
    opponentScore = 10;
  } else if (diff <= 400) {
    playerScore = 11;
    opponentScore = 9;
  } else if (diff <= 800) {
    playerScore = 12;
    opponentScore = 8;
  } else if (diff <= 1200) {
    playerScore = 13;
    opponentScore = 7;
  } else if (diff <= 1600) {
    playerScore = 14;
    opponentScore = 6;
  } else if (diff <= 2000) {
    playerScore = 15;
    opponentScore = 5;
  } else {
    playerScore = 16;
    opponentScore = 4;
  }

  if (playerPoints < opponentPoints) {
    [playerScore, opponentScore] = [opponentScore, playerScore];
  }

  return `${playerScore}-${opponentScore}`;
}

function randomDate() {
  const start = new Date(2024, 0, 1); // 1 Jan 2024
  const end = new Date(2025, 5, 7);   // 7 Jun 2025
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

const mockReports = Array.from({ length: 100 }, (_, index) => generateRandomReport(index + 1));

export default mockReports;
