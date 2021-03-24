userData = {
  players: [
    { team: "player1", player: myPlayer5, position: "" },
    { team: "player1", player: myPlayer, position: "mid:0" },
    { team: "player1", player: myPlayer2, position: "top:1" },
    { team: "player1", player: myPlayer3, position: "bottom:1" },
    { team: "player1", player: myPlayer4, position: "mid:2" },
  ],
  //need to make clones of the cards or im using the orignal object
  cards: [
    $.extend(true, {}, PushUpCard),
    $.extend(true, {}, PushUpCard),
    $.extend(true, {}, PushUpCard),
    $.extend(true, {}, ShortPassCard),
    $.extend(true, {}, ShortPassCard),
    $.extend(true, {}, ShootCard),
    $.extend(true, {}, CrossCard),
    $.extend(true, {}, LoseYourManCard),
    $.extend(true, {}, TacticianCard),
    $.extend(true, {}, MoraleBoostCard),
  ]
};
