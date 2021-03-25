class Team {
  constructor(name, rating, played, points, players, colorAccent , colorPrimary) {
    this.name = name;
    this.rating = rating;
    this.played = played;
    this.points = points;
    this.players = players;
    this.colorAccent = colorAccent;
    this.colorPrimary = colorPrimary;
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
    "#97c1e7"
  ),
  new Team("Liverpool", "2", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#fff",
    "#dd0000",
  ]),
  new Team("Manchester United", "3", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#ffe500",
    "#e80909",
  ]),
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
    "#034694"
  ),
  new Team("Leicester", "5", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#fff",
    "#0101e8",
  ]),
  new Team("Tottenham", "6", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#132257",
    "#fff",
  ]),
  new Team("Wolverhampton", "7", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#000000",
    "#fdbc02",
  ]),
  new Team("Arsenal", "8", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#fff",
    "#ff0000",
  ]),
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
    "#fff"
  ),
  new Team(
    "Burnley",
    "10",
    0,
    0,
    [
      { player: myPlayer5, position: "" },
      { player: myPlayer, position: "mid:3" },
      { player: myPlayer2, position: "mid:4" },
      { player: myPlayer3, position: "top:4" },
      { player: myPlayer4, position: "bottom:4" },
    ],
    "#80bfff",
    "#800000"
  ),
  new Team("Southampton", "11", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#fff",
    "#ff0000",
  ]),
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
    "#0d00e9"
  ),
  new Team("Newcastle", "13", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#000000",
    "#fff",
  ]),
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
    "#27409b"
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
    "#005daa"
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
    "#7c2c3b"
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
    "#a3c5e9"
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
    "#fff"
  ),
  new Team("Fulham", "19", 0, 0, [
    { player: myPlayer5, position: "" },
    { player: myPlayer, position: "mid:3" },
    { player: myPlayer2, position: "mid:4" },
    { player: myPlayer3, position: "top:4" },
    { player: myPlayer4, position: "bottom:4" },
    "#fff",
    "#000000",
  ]),
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
    "#fff"
  ),
];
