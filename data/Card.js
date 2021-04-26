class Card {
  constructor(name, type, rarity, text, ability, playable) {
    this.name = name;
    this.type = type;
    this.rarity = rarity;
    this.text = text;
    this.ability = ability;
    this.playable = playable;
  }
}

const keyWords = ["GoalChance"];
const abilitiesList = [
  "Move",
  "Draw",
  "Pass",
  "Cross",
  "Shoot",
  "Draw",
  "Discard",
  "StatChange",
];

allCards = [
  (PushUpCard = new Card(
    "Push Up",
    "Movement",
    "Common",
    "Move 1 player 1 position, Draw 1 card",
    { Move: 1, Draw: 1 },
    []
  )),
  (ShortPassCard = new Card(
    "Short pass",
    "Attack",
    "Common",
    "Pass the ball 1 space",
    { Pass: 1 },
    ["PlayerHasBall"]
  )),
  (ShootCard = new Card(
    "Shoot",
    "Attack",
    "Common",
    "Shoot, GoalChance for success",
    { Shoot: 1 },
    ["PlayerHasBall"]
  )),
  (CrossCard = new Card(
    "Cross",
    "Attack",
    "Common",
    "Cross 1 space, Will always pass accurately",
    { Cross: 1 },
    ["PlayerHasBall", "PlayerOnWing"]
  )),
  (LoseYourManCard = new Card(
    "Lose your man",
    "Movement",
    "Common",
    "If marked move 1 space",
    { Move: 1 },
    ["Marked"]
  )),
  (TacticianCard = new Card(
    "Tactician",
    "Manager",
    "Common",
    "Discard your hand, Draw 2 cards",
    { Discard: 100, Draw: 2 },
    []
  )),
  (MoraleBoostCard = new Card(
    "Morale Boost",
    "Manager",
    "Common",
    "+10 passing this turn to all players",
    { StatChange: [{ passing: 10, type: "positive", duration: 1 }] },
    []
  )),
  (TempCard = new Card("TempCard", "None", "None", "None", {}, [])),
];
