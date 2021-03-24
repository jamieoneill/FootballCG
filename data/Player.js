class Player {
  constructor(name, position, rarity, attack, defence, passing, ability) {
    this.name = name;
    this.position = position;
    this.rarity = rarity;
    this.attack = attack;
    this.defence = defence;
    this.passing = passing;
    this.ability = ability;
  }
}

allPlayers = [
  (myPlayer = new Player(
    "Pele De'Ball",
    "Defender",
    "Starter",
    20,
    40,
    20,
    null
  )),
  (myPlayer2 = new Player(
    "P2",
    "MidField",
    "Starter",
    30,
    30,
    30,
    engineAbility
  )),
  (myPlayer3 = new Player(
    "P3",
    "MidField",
    "Starter",
    20,
    30,
    40,
    engineAbility
  )),
  (myPlayer4 = new Player(
    "P4",
    "Striker",
    "Starter",
    40,
    20,
    30,
    null
  )),
  (myPlayer5 = new Player(
    "Stop De'Ball",
    "Goalkeeper",
    "Starter",
    0,
    30,
    0,
    null
  )),
];
