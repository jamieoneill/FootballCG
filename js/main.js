const pitch = {
  top: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
  mid: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
  bottom: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
};
const cards = {};
const keyWords = ["GoalChance"];
var gamePitch;
var abilityCount;
var playingAbility;
var playerScore;
var cpuScore;
var turnCounter;
var matchTime;
var statChanges;

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
allPlayers = [
  (myPlayer = new Player(
    "Pele De'Ball",
    "Defender",
    "Starter",
    20,
    40,
    20,
    engineAbility
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
    engineAbility
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
allCards = [
  (PushUp = new Card(
    "Push Up",
    "Movement",
    "Common",
    "Move 1 player 1 position, Draw 1 card",
    { Move: 1, Draw: 1 },
    []
  )),
  (ShortPass = new Card(
    "Short pass",
    "Attack",
    "Common",
    "Pass the ball 1 space",
    { Pass: 1 },
    ["PlayerHasBall"]
  )),
  (Shoot = new Card(
    "Shoot",
    "Attack",
    "Common",
    "Shoot, GoalChance for success",
    { Shoot: 1 },
    ["PlayerHasBall"]
  )),
  (Cross = new Card(
    "Cross",
    "Attack",
    "Common",
    "Cross 1 space, Will always pass accurately",
    { Cross: 1 },
    ["PlayerHasBall", "PlayerOnWing"]
  )),
  (LoseYourMan = new Card(
    "Lose your man",
    "Movement",
    "Common",
    "If marked move 1 space",
    { Move: 1 },
    ["Marked"]
  )),
  (Tactician = new Card(
    "Tactician",
    "Manager",
    "Common",
    "Discard your hand, Draw 2 cards",
    { Discard: 100, Draw: 2 },
    []
  )),
  (MoraleBoost = new Card(
    "Morale Boost",
    "Manager",
    "Common",
    "+10 passing this turn to all players",
    { StatChange: [{ passing: 10, type: "positive", duration: 1 }] },
    []
  )),
  (TempCard = new Card("TempCard", "None", "None", "None", {}, [])),
];

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
    $.extend(true, {}, PushUp),
    $.extend(true, {}, PushUp),
    $.extend(true, {}, ShortPass),
    $.extend(true, {}, ShortPass),
    $.extend(true, {}, Shoot),
    $.extend(true, {}, Cross),
    $.extend(true, {}, LoseYourMan),
    $.extend(true, {}, Tactician),
    $.extend(true, {}, MoraleBoost),
  ],
  draw: [],
  hand: [],
  discard: [],
};

startMatch();

/*
  console.table(myPlayer);
  console.table(allPlayers)
  */
console.table(gamePitch);

function startMatch(options) {
  abilityCount = 0;
  playingAbility = false;
  playerScore = 0;
  cpuScore = 0;
  turnCounter = 1;
  matchTime = 00;
  statChanges = [];

  oppositionData = getOpposition();
  addPlayersToPitch(oppositionData.players);
  gamePitch.mid["2"].push({ team: "ball" }); //Add the Ball as its own team (lazy, i know)
  displayGamePitch();
  userData.draw = shuffleArray(userData.cards);

  drawHand();
}

function resetPitch() {
  oppositionData = getOpposition();
  addPlayersToPitch(oppositionData.players);
}

function drawHand() {
  var draw = `
      <div class="card draw">
      <img src="https://picsum.photos/200/200" alt="Avatar" style="width:100%">
      </div>
      `;

  var drawCount = `<h3> Draw Pile: <span id="drawCount"></span> </h3>`;
  $("#drawHolder").append(draw);
  $("#drawHolder").append(drawCount);

  var discard = `
      <div class="card discard">
      <img src="https://picsum.photos/200/200" alt="Avatar" style="width:100%">
      </div>
      `;
  var discardCount = `<h3> Discard Pile: <span id="discardCount"></span> </h3>`;
  $("#discardHolder").append(discard);
  $("#discardHolder").append(discardCount);

  for (var i = 0; i < 3; i++) {
    drawCard();
  }
  UpdateCardsKeyWords();
}

function drawCard() {
  if (userData.draw.length == 0) {
    shuffleDiscardToDraw();
  }

  var card = userData.draw[0];
  card.cardPosition = $(".hand").length;

  //add card to hand
  userData.draw.splice(0, 1);
  userData.hand.push(card);

  var playCardStatus = true;
  card.playable.forEach((check) => {
    var canPlayCard = checkCardIsPlayable(check);
    if (canPlayCard.reason) {
      playCardStatus = canPlayCard.reason;
    }
  });

  var playable = "";
  if (playCardStatus == true) {
    playable = "playable";
  } else {
    playable = "unplayable";
  }

  var html =
    `
      <div class="card hand ` +
    playable +
    `"  onclick="playCard(this)">
      <img src="https://picsum.photos/200/200" alt="Avatar" style="width:100%">
      <div>
        <h4><b> ` +
    card.name +
    `</b></h4>
        <p class="cardText">` +
    card.text +
    `</p>
      </div>
      </div>
      `;

  $(html).appendTo("#handHolder").hide().fadeIn("slow");
  $(".hand").last().data("card", card);
  $("#drawCount").text(userData.draw.length);
}

$(".draw").on("click", function () {
  //dont show draw pile in order
  console.table(shuffleArray(userData.draw));
});

$(".discard").on("click", function () {
  console.table(userData.discard);
});

$(".endButton").on("click", function () {
  endTurn();
});

$(".alilityButton").on("click", function () {
  var alilityButton = $(this);

  //cancel
  if (alilityButton.html() == "Cancel") {
    alilityButton.css("background-color", "deepskyblue");
    alilityButton.html("Activate Alility");
    displayGamePitch();
    return;
  }

  var playerPos = getPlayerPositions();

  playerPos.forEach((position) => {
    //get players with abilities
    // prettier-ignore
    player = gamePitch[position.row][position.col].find((player) => player.team == "player1" && player.player.ability );

    // prettier-ignore
    cell = $("#pitch tr:eq(" +pitchToCell(position.row) +") td:eq(" +position.col +")");
    cell.css("background-color", "lightgreen");
    cell.data("playerData", player);
    //show ability on hover
    cell.jBox("Tooltip", {
      content: player.player.ability,
    });

    //run player ability
    cell.on("click", function () {
      $(".pitchCell").css("color", "black");
      var name = Object.keys(
        $(this).data("playerData").player.ability.ability
      )[0];
      var value = Object.values(
        $(this).data("playerData").player.ability.ability
      )[0];
      var appliesTo = $(this).data("playerData").player.ability.appliesTo;

      //create a temp card that holds the player's ability
      var tempCard = $.extend(true, {}, TempCard);
      tempCard.ability[name] = value;

      //set ability to correct cells
      if (appliesTo == "self") {
        cell = $(this);
        var cellIndex = cell.closest("td")[0].cellIndex;
        var rowIndex = cell.closest("tr")[0].rowIndex;
        tempCard.appliesTo = [rowIndex, cellIndex];
      }

      playCard(null, tempCard);

      //ability used
      alilityButton.html("Alility has be used");
      alilityButton.css("background-color", "deepskyblue");
      alilityButton.prop("disabled", true);
    });
  });

  //allow cancel
  alilityButton.css("background-color", "red");
  alilityButton.html("Cancel");
});

function activateAbility(card) {
  ability = Object.keys(card.ability)[abilityCount];
  val = Object.values(card.ability)[abilityCount];
  playingAbility = true;
  abilityCount++;
  var ballPos = getBallPosition();
  var playerPos = getPlayerPositions();

  try {
    UpdateCardsKeyWords();
  } catch {}

  switch (ability) {
    case "Pass":
      // prettier-ignore
      ballCell =  $('#pitch tr:eq('+ pitchToCell(ballPos.row) +') td:eq('+ (ballPos.col)+')')

      //wait for input to move ball
      ballCell.css("background-color", "lightgreen");

      ballCell.on("click", function () {
        ballElem = $(this);
        //get position
        var cellIndex = ballElem.closest("td")[0].cellIndex;
        var rowIndex = ballElem.closest("td")[0].parentNode.rowIndex;
        var directions = [];

        for (var i = 1; i < val + 1; i++) {
          // prettier-ignore
          directions.push( forward = $('#pitch tr:eq('+(rowIndex)+') td:eq('+(cellIndex+i)+')'));

          // prettier-ignore
          if((rowIndex+i) <= 2 ){
              directions.push( down = $('#pitch tr:eq('+(rowIndex+i)+') td:eq('+(cellIndex)+')'));
            }

          // prettier-ignore
          if((cellIndex-i)  >= 0){
              directions.push( back = $('#pitch tr:eq('+(rowIndex)+') td:eq('+(cellIndex-i)+')'));
            }
          // prettier-ignore
          if((rowIndex-i) >= 0 ){
              directions.push( up = $('#pitch tr:eq('+(rowIndex-i)+') td:eq('+(cellIndex)+')'));
            }
        }

        directions.forEach((dir) => {
          //add effets
          dir.css("background", "yellow");
          dir.hover(
            function () {
              $(this).css("box-shadow", "0px 0px 14px 0px cyan");
            },
            function () {
              $(this).css("box-shadow", "");
            }
          );

          //move to position
          if (!ballElem.data().clickSet) {
            dir.on("click", function () {
              //remove ball from current index
              row = cellToPitch(rowIndex);
              // prettier-ignore
              gamePitch[row][cellIndex] = gamePitch[row][cellIndex].filter((player) => player.team != "ball");

              //get player passing stats
              // prettier-ignore
              var player = gamePitch[row][cellIndex].find((player) => player.team == "player1");
              var randPassChance = Math.floor(Math.random() * 100);

              //move the ball
              var dirCellIndex = dir.closest("td")[0].cellIndex;
              var dirRowIndex = dir.closest("td")[0].parentNode.rowIndex;
              dirRow = cellToPitch(dirRowIndex);

              //console.log("chance of passing | ", "value needed to pass");
              //console.log(player.player.passing, randPassChance);

              if (player.player.passing >= randPassChance) {
                commentate("Good pass");
                //add ball to destination index
                gamePitch[dirRow][dirCellIndex].push({ team: "ball" });
              } else {
                commentate("Poor pass from " + player.player.name);
                missedPassOptions = 2;

                // prettier-ignore
                markingPlayer = gamePitch[dirRow][dirCellIndex].find((player) =>{return player.team == "cpu"});
                //player is marked
                if (markingPlayer) {
                  missedPassOptions = 3;
                }

                //add ball to nearby index from destination
                forwardOrBack = Math.floor(Math.random() * missedPassOptions);

                // prettier-ignore
                var canGoBackward = ( ( (dirCellIndex - 1)  >= 0 && (dirCellIndex - 1) != cellIndex ) ? true : false);
                // prettier-ignore
                var canGoForward =  ( ( (dirCellIndex + 1) <= 5 && (dirCellIndex + 1) != cellIndex ) ? true : false);
                // prettier-ignore
                var sameCellBackward =  ( ( (dirCellIndex + 1) <= 5 && dirRowIndex  == pitchToCell(ballPos.row) && (dirCellIndex - 1) == ballPos.col ) ? true : false);
                // prettier-ignore
                var sameCellForward =  ( ( (dirCellIndex + 1) <= 5 && dirRowIndex  == pitchToCell(ballPos.row) && (dirCellIndex + 1) == ballPos.col ) ? true : false);

                // prettier-ignore
                if (forwardOrBack == 0 && canGoBackward && !sameCellBackward) {
                    //going backward
                    commentate("The ball has gone behind it's target");
                    gamePitch[dirRow][dirCellIndex - 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack == 0  && canGoForward && !sameCellForward) {
                    //cant go backward... going forward
                    commentate("The ball has gone ahead of it's target");
                    gamePitch[dirRow][dirCellIndex + 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack == 1 && canGoForward && !sameCellForward) {
                    //going forward
                    commentate("The ball has gone ahead of it's target");
                    gamePitch[dirRow][dirCellIndex + 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack == 1  && canGoBackward  && !sameCellBackward) {
                    //cant go forward... go backward
                    commentate("The ball has gone behind it's target");
                    gamePitch[dirRow][dirCellIndex - 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack != 2) {
                    //cant go in random "forwardOrBack" direction.. leave it where it was
                    commentate(
                      player.player.name +
                        " couldnt get the ball out from under his feet but still has possession"
                    );
                    gamePitch[row][cellIndex].push({
                      team: "ball",
                    });
                  }

                //player was marked and lost possession
                if (forwardOrBack == 2) {
                  commentate("The ball has been intercepted by the opposition");
                  commentate("The opposition have possesion");
                  gamePitch[dirRow][dirCellIndex].push({ team: "ball" });
                  endTurn();
                }
              }

              activateAbility(card);
            });
          }
        });
        //click set stops function from running unnecessary times
        ballElem.data("clickSet", true);
      });
      break;
    case "Cross":
      commentate("Crossed to the center");
      // prettier-ignore
      //remove ball
      gamePitch[ballPos.row][ballPos.col] = gamePitch[ballPos.row][ballPos.col].filter((player) => player.team != "ball");
      //add ball to destination index
      gamePitch["mid"][ballPos.col].push({ team: "ball" });
      activateAbility(card);
      break;
    case "Move":
      if (card.appliesTo) {
        //only apply movement to target
        // prettier-ignore
        cell = $("#pitch tr:eq(" +card.appliesTo[0] +") td:eq(" +card.appliesTo[1] +")");
        cell.css("background-color", "lightgreen");
        moveClick(cell);
      } else if ($.inArray("Marked", card.playable) > -1) {
        //only apply movement to marked players
        playerPos.forEach((position) => {
          // prettier-ignore
          if(gamePitch[position.row][position.col].find((player) => player.team == "cpu")){
              // prettier-ignore
              cell = $("#pitch tr:eq(" +pitchToCell(position.row) +") td:eq(" +position.col +")");
              cell.css("background-color", "lightgreen");
              cell.on("click", function (e) {
                moveClick(e.target);
              });
            }
        });
      } else {
        //apply movement function to all user players
        playerPos.forEach((position) => {
          // prettier-ignore
          cell = $("#pitch tr:eq(" +pitchToCell(position.row) +") td:eq(" +position.col +")");
          cell.css("background-color", "lightgreen");
          cell.on("click", function (e) {
            moveClick(e.target);
          });
        });
      }

      function moveClick(e) {
        $("td").css("background", "white");
        playerElem = $(e);

        //get position
        var cellIndex = playerElem.closest("td")[0].cellIndex;
        var rowIndex = playerElem.closest("td")[0].parentNode.rowIndex;

        var directions = [];

        for (var i = 1; i < val + 1; i++) {
          // prettier-ignore
          directions.push( forward = $('#pitch tr:eq('+(rowIndex)+') td:eq('+(cellIndex+i)+')'));

          // prettier-ignore
          if((rowIndex+i) <= 2 ){
              directions.push( down = $('#pitch tr:eq('+(rowIndex+i)+') td:eq('+(cellIndex)+')'));
            }

          // prettier-ignore
          if((cellIndex-i)  >= 0){
              directions.push( back = $('#pitch tr:eq('+(rowIndex)+') td:eq('+(cellIndex-i)+')'));
            }
          // prettier-ignore
          if((rowIndex-i) >= 0 ){
              directions.push( up = $('#pitch tr:eq('+(rowIndex-i)+') td:eq('+(cellIndex)+')'));
            }
        }

        directions.forEach((dir) => {
          dir.unbind("click");

          var dirCellIndex = dir.closest("td")[0].cellIndex;
          var dirRowIndex = dir.closest("tr")[0].rowIndex;
          dirRow = cellToPitch(dirRowIndex);

          //make sure space has no teammate in it
          // prettier-ignore
          var player = gamePitch[dirRow][dirCellIndex].find((player) => {return player.team == "player1";});

          if (!player) {
            //add effets
            dir.css("background", "yellow");
            dir.hover(
              function () {
                $(this).css("box-shadow", "0px 0px 14px 0px cyan");
              },
              function () {
                $(this).css("box-shadow", "");
              }
            );

            //move to position
            if (!playerElem.data().clickSet) {
              dir.on("click", function () {
                row = cellToPitch(rowIndex);

                //get player
                // prettier-ignore
                var player = gamePitch[row][cellIndex].find((player) =>{return player.team == "player1"});
                //remove player from current index
                // prettier-ignore
                gamePitch[row][cellIndex] = gamePitch[row][cellIndex].filter((player) => player.team != "player1");

                //add playerto destination index
                var dirCellIndex = dir.closest("td")[0].cellIndex;
                var dirRowIndex = dir.closest("tr")[0].rowIndex;
                dirRow = cellToPitch(dirRowIndex);
                gamePitch[dirRow][dirCellIndex].push(player);

                //check if player has to bring the ball
                // prettier-ignore
                var hasBall = gamePitch[row][cellIndex].find((player) =>{return player.team == "ball"});
                if (hasBall) {
                  // prettier-ignore
                  gamePitch[row][cellIndex] = gamePitch[row][cellIndex].filter((player) => player.team != "ball");
                  gamePitch[dirRow][dirCellIndex].push(hasBall);
                }

                activateAbility(card);
              });
            }
          }
        });
        //click set stops function from running unnecessary times
        playerElem.data("clickSet", true);
      }
      break;
    case "Draw":
      //draw val amount of cards cards
      for (var i = 0; i < val; i++) {
        drawCard();
      }
      activateAbility(card);
      break;
    case "Discard":
      if (val == 100) {
        discardHand();
      } else {
        //discard val amount of cards cards
        for (var i = 0; i < val; i++) {
          //TODO: make for random discard and selected discard
        }
      }
      activateAbility(card);
      break;
    case "Shoot":
      var randGoalChance = Math.floor(Math.random() * 100);
      var goalSuccess = getGoalChance();
      //console.log("chance of scoring | ", "value needed to score");
      //console.log(goalSuccess, randGoalChance);

      if (goalSuccess >= randGoalChance) {
        commentate("Shoots... GOAL");
        playerScore++;
        $("#playerScore").html(playerScore);

        player = gamePitch[ballPos.row][ballPos.col].find(
          (player) => player.team == "player1"
        );
        var goalModal = new jBox("Modal", {
          title: "GOAL!",
          content: player.player.name + " scores!",
          animation: "tada",
          autoClose: "2500",
        });
        goalModal.open();

        endTurn();

        //players move back to formation & give opponent
        resetPitch();
        gamePitch.mid["3"].push({ team: "ball" });
      } else {
        if (goalSuccess > 50) {
          //if success chance was better than 50
          //decide where the ball goes
          missState = Math.floor(Math.random() * 2);

          switch (missState) {
            case 0:
              //ball is pushed to random square within a rang of 2 from goal
              commentate("Punched away \nThe ball is lose!");
              var punchRange = [getRndInteger(0, 3), getRndInteger(4, 6)];
              console.log(punchRange);
              punchRow = cellToPitch(punchRange[0]);
              punchCol = punchRange[1];

              //remove ball from current index
              // prettier-ignore
              gamePitch[ballPos.row][ballPos.col] = gamePitch[ballPos.row][ballPos.col].filter((player) => player.team != "ball");

              //add ball to destination index
              gamePitch[punchRow][punchCol].push({
                team: "ball",
              });
              break;
            case 1:
              //players stay in same possition (loss of possesion / end turn)
              commentate("Shoots... Saved \nThe opposition have possession.");

              //give ball to goalkeeper
              // prettier-ignore
              gamePitch[ballPos.row][ballPos.col] = gamePitch[ballPos.row][ballPos.col].filter((player) => player.team != "ball");
              gamePitch.mid["5"].push({ team: "ball" });

              endTurn();
              break;
            default:
              break;
          }
        } else {
          //goalkick
          //players move back to formation
          commentate("Shoots... Missed \nGoalkick");
          resetPitch();
          gamePitch.mid["5"].push({ team: "ball" });
          endTurn();
        }
      }

      activateAbility(card);
      break;
    case "StatChange":
      //Stat changing card
      //for each change
      val.forEach((change) => {
        updateStatChange(change);
      });

      activateAbility(card);
      break;
    default:
      //finished running card abilities
      //console.log("no ability: ", ability);
      playingAbility = false;
      break;
  }
}

function playCard(elem, setCard) {
  if (!playingAbility) {
    var card;
    if (elem) {
      card = $(elem).data("card");
    } else {
      card = setCard;
    }

    var playCardStatus = true;
    card.playable.forEach((check) => {
      var canPlayCard = checkCardIsPlayable(check);
      if (canPlayCard.reason) {
        playCardStatus = canPlayCard.reason;
      }
    });

    if (playCardStatus == true) {
      if (elem) {
        //animate card removal
        $(elem).fadeOut("slow", function () {
          waitForCardToPlay();
        });
      } else {
        waitForCardToPlay();
      }
    } else {
      alert("This card is unplayable. \n" + playCardStatus);
    }
  }

  function waitForCardToPlay() {
    //trigger card's abilities
    abilityCount = 0;
    activateAbility(card);

    //move to discard pile
    if (card.name != "TempCard") {
      userData.hand.splice(card.cardPosition, 1);
      userData.discard.push(card);

      $("#discardCount").text(userData.discard.length);
      matchTime = matchTime + 4;
      $("#matchTime").html(matchTime);
    }

    var refreshIntervalId = setInterval(function () {
      if (abilityCount <= Object.keys(card.ability).length) {
        //ability is running, check again in 1 second
      } else {
        clearInterval(refreshIntervalId);
        //update pitch after card abilties
        displayGamePitch();
      }
    }, 1000);
  }
}

function endTurn() {
  console.log("end turn");
  turnCounter++;
  updateStatChange();
  discardHand();
  $(".endButton").prop("disabled", true);
}

function shuffleDiscardToDraw() {
  //shuffle discard pile back to draw
  userData.draw = shuffleArray(userData.discard);
  userData.discard = [];
  $("#drawCount").text(userData.draw.length);
  $("#discardCount").text(userData.discard.length);
}

function discardHand() {
  $(".hand").fadeOut("slow", function () {
    userData.hand.forEach((card) => {
      userData.discard.push(card);
    });
    userData.hand = [];
    $("#discardCount").text(userData.discard.length);
  });
}

//TODO: generate new opposition for each match
function getOpposition() {
  return {
    players: [
      { team: "cpu", player: myPlayer5, position: "" },
      { team: "cpu", player: myPlayer4, position: "mid:3" },
      { team: "cpu", player: myPlayer2, position: "mid:4" },
      { team: "cpu", player: myPlayer3, position: "top:4" },
      { team: "cpu", player: myPlayer, position: "bottom:4" },
    ],
    cards: {},
  };
}

function addPlayersToPitch(oppositionFormation) {
  gamePitch = $.extend(true, {}, pitch);

  //add user formation
  userData.players.forEach((player) => {
    if (player.player.position != "Goalkeeper") {
      pos = player.position.split(":");
      gamePitch[pos[0]][pos[1]].push(player);
    }
  });

  //add opposition formation
  oppositionFormation.forEach((player) => {
    if (player.player.position != "Goalkeeper") {
      pos = player.position.split(":");
      gamePitch[pos[0]][pos[1]].push(player);
    }
  });
}

function displayGamePitch() {
  $("#pitch").html("");

  $.each(gamePitch, function (index) {
    var html = "<tr>";
    $.each(gamePitch[index], function (key, cell) {
      sortPlayerIcons(cell);
      html += '<td class="pitchCell">';

      cell.forEach((player) => {
        html += getPlayerIcon(player);
      });

      html += "</td>";
    });
    html += "</tr>";
    //$("#pitch").last().data("card", card);
    $("#pitch").append(html);
  });

  //display cell info on shift click
  $(".pitchCell").click(function (e) {
    if (e.shiftKey) {
      cell = $(this);
      //get position
      var cellIndex = cell.closest("td")[0].cellIndex;
      var rowIndex = cell.closest("tr")[0].rowIndex;
      row = cellToPitch(rowIndex);

      console.log(gamePitch[row][cellIndex]);
    }
  });
}

function getPlayerIcon(player) {
  switch (player.team) {
    case "player1":
      return '<img src="https://raw.githubusercontent.com/jamieoneill/FootballCG/main/images/blue.png">';
      break;
    case "cpu":
      return '<img src="https://raw.githubusercontent.com/jamieoneill/FootballCG/main/images/red.png">';
      break;
    case "ball":
      return '<img src="https://raw.githubusercontent.com/jamieoneill/FootballCG/main/images/ball.png">';
      break;
    default:
      return "";
      break;
  }
}

function sortPlayerIcons(cell) {
  //display icons in this order in the cell
  var ordering = {};
  var sortOrder = ["player1", "ball", "cpu"];
  for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;

  cell.sort(function (a, b) {
    return ordering[a.team] - ordering[b.team];
  });

  return cell;
}

function UpdateCardsKeyWords() {
  //check each card in the hand for keyWords and update
  userData.hand.forEach((card) => {
    var keyWordFound = keyWords.find((v) => card.text.includes(v));
    if (keyWordFound) {
      switch (keyWordFound) {
        case "GoalChance":
          // prettier-ignore
          if(getGoalChance() <= 0){
              $($(".cardText")[card.cardPosition]).text(card.text.replace(keyWordFound, "0%"));
            }else{
              $($(".cardText")[card.cardPosition]).text(card.text.replace(keyWordFound, getGoalChance() + "%"));
            }
          break;
        default:
          break;
      }
    }
  });
}

/* Game functions */
function getBallPosition() {
  var ballPos;

  $.each(gamePitch, function (topKey, topValue) {
    $.each(topValue, function (key, value) {
      if (value.some((player) => player.team === "ball")) {
        ballPos = { row: topKey, col: parseInt(key) };
      }
    });
  });

  return ballPos;
}

function getPlayerPositions() {
  var playerPos = [];

  $.each(gamePitch, function (topKey, topValue) {
    $.each(topValue, function (key, value) {
      if (value.some((player) => player.team === "player1")) {
        playerPos.push({ row: topKey, col: parseInt(key) });
      }
    });
  });

  return playerPos;
}

function getGoalChance() {
  var ballPos = getBallPosition();
  var goalSuccess = 100;

  // prettier-ignore
  markingPlayer = gamePitch[ballPos.row][ballPos.col].find((player) =>{return player.team == "cpu"});
  //player is marked
  if (markingPlayer) {
    //take defenders defend stat and remove success chance by that much.
    goalSuccess = goalSuccess - markingPlayer.player.defence;
  }

  //get the goalkeeper stats
  // prettier-ignore
  goalSuccess = goalSuccess - (oppositionData.players.find((player) =>{return player.player.position == "Goalkeeper"}).player.defence);

  // prettier-ignore
  attackingPlayer = gamePitch[ballPos.row][ballPos.col].find((player) =>{return player.team == "player1"});
  if (attackingPlayer) {
    //take attackers attack stat and add success chance by that much.
    goalSuccess = goalSuccess + attackingPlayer.player.attack;
  } else {
    goalSuccess = 0;
    return goalSuccess;
  }

  //player is not centered
  if (ballPos.row != "mid") {
    goalSuccess = goalSuccess - 20;
  }

  //player distance
  switch (ballPos.col) {
    case 0:
      goalSuccess = goalSuccess - 99;
      break;
    case 1:
      goalSuccess = goalSuccess - 90;
      break;
    case 2:
      goalSuccess = goalSuccess - 80;
      break;
    case 3:
      goalSuccess = goalSuccess - 70;
      break;
    case 4:
      goalSuccess = goalSuccess - 60;
      break;
    case 5:
      goalSuccess = goalSuccess - 50;
      break;
    default:
      break;
  }

  return goalSuccess;
}

function updateStatChange(newChange) {
  var playerPos = getPlayerPositions();

  //new stat change
  if (newChange) {
    var changeTo = Object.keys(newChange)[0];
    var changeVal = Object.values(newChange)[0];
    var duration = newChange.duration;

    commentate("The manager's words seems to have influenced the game");
    playerPos.forEach((position) => {
      // prettier-ignore
      player = gamePitch[position.row][position.col].find((player) => player.team == "player1");
      if (newChange.type == "positive") {
        player.player[changeTo] = player.player[changeTo] + changeVal;
      } else {
        player.player[changeTo] = player.player[changeTo] - changeVal;
      }
    });

    newChange.endOnTurn = turnCounter + duration;
    statChanges.push(newChange);
  } else {
    //remove changes that have expired
    statChanges.forEach((oldChange) => {
      var changeTo = Object.keys(oldChange)[0];
      var changeVal = Object.values(oldChange)[0];

      if (oldChange.endOnTurn == turnCounter) {
        playerPos.forEach((position) => {
          // prettier-ignore
          player = gamePitch[position.row][position.col].find((player) => player.team == "player1");
          if (oldChange.type == "positive") {
            player.player[changeTo] = player.player[changeTo] - changeVal;
          } else {
            player.player[changeTo] = player.player[changeTo] + changeVal;
          }
        });
      }

      statChanges = statChanges.filter((change) => change != oldChange);
    });
  }
}

function cellToPitch(index) {
  switch (index) {
    case 0:
      return "top";
      break;
    case 1:
      return "mid";
      break;
    case 2:
      return "bottom";
      break;
    default:
      break;
  }
}

function pitchToCell(index) {
  switch (index) {
    case "top":
      return 0;
      break;
    case "mid":
      return 1;
      break;
    case "bottom":
      return 2;
      break;
    default:
      break;
  }
}

function commentate(message) {
  $("#commentary").append(message + "\n");
  $("#commentary").scrollTop($("#commentary")[0].scrollHeight);
}

/* Playablity functions */
function checkCardIsPlayable(check) {
  var ballPos = getBallPosition();

  switch (check) {
    case "PlayerHasBall":
      // prettier-ignore
      if (gamePitch[ballPos.row][ballPos.col].some(player => player.team === 'player1')) {
          return { status: true };
        } else {
            return {
              status: false,
              reason: "You do not have possession of the ball",
            };
        }
      break;
    case "PlayerNotHaveBall":
      // prettier-ignore
      if (gamePitch[ballPos.row][ballPos.col].some(player => player.team != 'player1')) {
          return { status: true };
        } else {
            return {
              status: false,
              reason: "You cannot play this card while you have possession of the ball",
            };
        }
      break;
    case "PlayerOnWing":
      // prettier-ignore
      if (ballPos.row == 'top' || ballPos.row == 'bottom') {
          return { status: true };
        } else {
            return {
              status: false,
              reason: "The ball is not on the wing",
            };
        }
      break;
    case "Marked":
      var playerPos = getPlayerPositions();
      var marked = false;

      playerPos.forEach((position) => {
        // prettier-ignore
        if(gamePitch[position.row][position.col].find((player) => player.team == "cpu")){
          marked = true;
          }
      });

      if (marked) {
        return { status: true };
      } else {
        return {
          status: false,
          reason: "No players are being marked.",
        };
      }

      break;
    default:
      return { status: true };
  }
}

/* UTILS */
function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}