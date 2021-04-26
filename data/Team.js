class Team {
  constructor(
    name,
    rating,
    played,
    points,
    players,
    colorAccent,
    colorPrimary,
    cards
  ) {
    this.name = name;
    this.rating = rating;
    this.played = played;
    this.points = points;
    this.players = players;
    this.colorAccent = colorAccent;
    this.colorPrimary = colorPrimary;
    this.cards = cards;
  }
}

allTeams = [
  new Team(
    "Manchester City",
    "1",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#97c1e7",
    cloneCards()
  ),
  new Team(
    "Liverpool",
    "2",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#dd0000",
    cloneCards()
  ),
  new Team(
    "Manchester United",
    "3",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#ffe500",
    "#e80909",
    cloneCards()
  ),
  new Team(
    "Chelsea",
    "4",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#034694",
    cloneCards()
  ),
  new Team(
    "Leicester",
    "5",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#0101e8",
    cloneCards()
  ),
  new Team(
    "Tottenham",
    "6",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#132257",
    "#fff",
    cloneCards()
  ),
  new Team(
    "Wolverhampton",
    "7",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#000000",
    "#fdbc02",
    cloneCards()
  ),
  new Team(
    "Arsenal",
    "8",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#ff0000",
    cloneCards()
  ),
  new Team(
    "Sheffield United",
    "9",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#ec2227",
    "#fff",
    cloneCards()
  ),
  new Team(
    "Burnley",
    "10",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer4, position: "mid:3" },
      { player: myPlayer, position: "mid:4" },
      { player: myPlayer2, position: "top:4" },
      { player: myPlayer3, position: "bottom:4" },
    ],
    "#80bfff",
    "#800000",
    cloneCards()
  ),
  new Team(
    "Southampton",
    "11",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#ff0000",
    cloneCards()
  ),
  new Team(
    "Everton",
    "12",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#0d00e9",
    cloneCards()
  ),
  new Team(
    "Newcastle",
    "13",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#000000",
    "#fff",
    cloneCards()
  ),
  new Team(
    "Crystal Palace",
    "14",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#c4122e",
    "#27409b",
    cloneCards()
  ),
  new Team(
    "Brighton",
    "15",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#005daa",
    cloneCards()
  ),
  new Team(
    "West Ham",
    "16",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#2dafe5",
    "#7c2c3b",
    cloneCards()
  ),
  new Team(
    "Aston Villa",
    "17",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#7b003a",
    "#a3c5e9",
    cloneCards()
  ),
  new Team(
    "Leeds United",
    "18",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#1b449c",
    "#fff",
    cloneCards()
  ),
  new Team(
    "Fulham",
    "19",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#fff",
    "#000000",
    cloneCards()
  ),
  new Team(
    "West Brom",
    "20",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#091453",
    "#fff",
    cloneCards()
  ),
];

function cloneCards() {
  return [
    $.extend(true, {}, PushUpCard),
    $.extend(true, {}, PushUpCard),
    $.extend(true, {}, PushUpCard),
    $.extend(true, {}, ShortPassCard),
    $.extend(true, {}, ShortPassCard),
    $.extend(true, {}, ShootCard),
    $.extend(true, {}, CrossCard),
    $.extend(true, {}, LoseYourManCard),
    $.extend(true, {}, TacticianCard),
  ];
}
