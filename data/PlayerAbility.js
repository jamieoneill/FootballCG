class PlayerAbility {
  constructor(name, description, ability, appliesTo) {
    this.name = name;
    this.description = description;
    this.ability = ability;
    this.appliesTo = appliesTo;
  }
}

allPlayerAbilities = [
  (engineAbility = new PlayerAbility(
    "Engine",
    "Move this player up to 3 spaces in any direction",
    { Move: 3 },
    "self"
  )),
];
