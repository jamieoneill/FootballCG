// HOME //
$("#newGameBtn").on("click", function () {
  $("#Home").hide();
  $("#Main").show();
  $("#displayTeamName").text(userData.team.name);
  scrollToTeam();
});

$("#loadGameBtn").on("click", function () {
  //load game
  $("#Home").hide();
  $("#matchGame").show();
  startMatch({ team1: "Tottenham", team2: "Burnley" });

  /*
  new jBox("Modal", {
    title: "Load",
    content: "blah blah",
    height: "500px",
    width: "500px",
  }).open();
  */
});

$("#howToPlayBtn").on("click", function () {
  //show tutorial
  new jBox("Modal", {
    title: "How To Play",
    content: "blah blah",
    height: "500px",
    width: "500px",
  }).open();
});

$("#settingsBtn").on("click", function () {
  //open settings
  new jBox("Modal", {
    title: "Settings",
    content: "blah blah",
    height: "500px",
    width: "500px",
  }).open();
});

$("#feedbackBtn").on("click", function () {
  //open feedback
  new jBox("Modal", {
    title: "Feedback",
    content: "blah blah",
    height: "500px",
    width: "500px",
  }).open();
});

// MENU //
$("#viewPlayersBtn").on("click", function () {
  $("#overlayModalDialog").empty();

  userData.team.players.forEach((player) => {
    $(renderCard("Player", player)).appendTo("#overlayModalDialog");
  });

  new bootstrap.Modal(document.getElementById("overlayModal"), {
    backdrop: "static",
  }).show();
});

$("#viewCardsBtn").on("click", function () {
  $("#overlayModalDialog").empty();

  userData.team.cards.forEach((card) => {
    $(renderCard("Card", card)).appendTo("#overlayModalDialog");
  });

  new bootstrap.Modal(document.getElementById("overlayModal"), {
    backdrop: "static",
  }).show();
});

$("#viewFormationBtn").on("click", function () {
  $("#overlayModalDialog").empty();

  userData.team.players.forEach((player) => {
    cell = $(
      "#formation tr:eq(" +
        pitchToCell(player.position.split(":")[0]) +
        ") td:eq(" +
        player.position.split(":")[1] +
        ")"
    );
    cell.data("playerData", player);
    cell.html(getPlayerIcon(player)
    );
  });

  $("#formation").clone().appendTo("#overlayModalDialog");

  new bootstrap.Modal(document.getElementById("overlayModal"), {
    backdrop: "static",
  }).show();
});

function playMatch(opponent) {
  $("#Main").hide();
  $("#matchGame").show();
  startMatch({ team1: userData.team.name, team2: opponent });
}

allTeams.sort(function (a, b) {
  return b.points - a.points;
});

$("#leagueTable tbody").empty();

allTeams.forEach((Team, index) => {
  if (Team.name == userData.team.name) {
    var html = "<tr id='userTeamInTable' class='table-success'>";
  } else {
    var html = "<tr>";
  }

  html += "<td>" + (index + 1) + "</td>";

  html +=
    "<td> <img src='../images/teamIcons/" +
    Team.name.replace(" ", "-") +
    ".png' style='height: 24px; width: 24px;'></img> " +
    Team.name +
    "</td>";
  html += "<td>" + Team.played + "</td>";
  html += "<td>" + Team.points + "</td>";
  html += "</tr>";

  $("#leagueTable tbody").append(html);
});

function scrollToTeam() {
  var teamInTable = document.getElementById("userTeamInTable");

  teamInTable.scrollIntoView({
    behavior: "auto",
    block: "center",
    inline: "nearest",
  });
}

//load events
events.forEach((event) => {
  var html = "";
  if (event.type == "Match") {
    html +=
      `
    <li class="splide__slide">
    <div class="card text-center">
      <div class="card-header">` +
      event.date +
      `</div>
      <div class="card-body">
        <div class="part-team">
          <div class="single-team">
            <div class="logo">
              <img
                src="../images/teamIcons/` +
      userData.team.name +
      `.png"
                alt="team logo"
              />
            </div>
            <span class="team-name">` +
      userData.team.name +
      `</span>
          </div>
          <div class="match-details">
            <span class="versase">vs</span>
            <div>
              <button class="playMatchBtn" onclick="playMatch('` +
      event.data.opponent +
      `')">
                Play Match
              </button>
            </div>
          </div>
          <div class="single-team">
            <div class="logo">
              <img
                src="../images/teamIcons/` +
      event.data.opponent.replace(" ", "-") +
      `.png"
                alt="team logo"
              />
            </div>
            <span class="team-name">` +
      event.data.opponent +
      `</span>
          </div>
        </div>
      </div>
    </div>
  </li>
    `;
  }
  $("#eventsList").append(html);
});

var splide = new Splide("#events", {
  perPage: 3,
  focus: "center",
  pagination: false,
  speed: 800,
  waitForTransition: false,
}).mount();

// MATCH //
const pitch = {
  top: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
  mid: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
  bottom: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] },
};

function startMatch(options) {
  matchData = {
    gamePitch: [],
    abilityCount: 0,
    playingAbility: false,
    playerScore: 0,
    cpuScore: 0,
    turnCounter: 1,
    matchTime: 00,
    statChanges: [],
    oppositionData: {},
  };

  //set team data to players
  userData.team.players.forEach((player) => {
    player.team = userData.team.name;
    player.colorPrimary = userData.team.colorPrimary;
    player.colorAccent = userData.team.colorAccent;
  });

  //add opponents
  matchData.oppositionData = getOpposition(options.team2);
  var temp = JSON.parse(JSON.stringify(matchData.oppositionData.team.cards));
  matchData.oppositionData.draw = shuffleArray(temp);
  matchData.oppositionData.hand = [];
  matchData.oppositionData.discard = [];
  addPlayersToPitch(matchData.oppositionData.team.players);

  matchData.gamePitch.mid["2"].push({ team: "ball" }); //Add the Ball as its own team (lazy, i know)
  displayGamePitch();
  console.table(matchData.gamePitch);

  //set team names
  // prettier-ignore
  $("#playerTeamName").html("<img src='../images/teamIcons/" +userData.team.name.replace(" ", "-") +".png' style='height: 24px; width: 24px;'></img> " + userData.team.name).css("background", userData.team.colorPrimary).css("color", userData.team.colorAccent);
  // prettier-ignore
  $("#cpuTeamName").html(matchData.oppositionData.team.name + " <img src='../images/teamIcons/" +matchData.oppositionData.team.name.replace(" ", "-") +".png' style='height: 24px; width: 24px;'></img>").css("background", matchData.oppositionData.team.colorPrimary).css("color", matchData.oppositionData.team.colorAccent);

  var temp = JSON.parse(JSON.stringify(userData.team.cards)); //copy users cards to this game
  userData.draw = shuffleArray(temp);

  drawHand(userData.team.name);
}

function resetPitch() {
  addPlayersToPitch(matchData.oppositionData.team.players);
}

function drawHand(team) {
  if (matchData.turnCounter == 1) {
    var draw = `
      <div class="playingCard draw">
      <img src="https://picsum.photos/200/200" alt="Avatar" style="width:100%">
      </div>
      `;

    var drawCount = `<h3> Draw Pile: <span id="drawCount"></span> </h3>`;
    $("#drawHolder").append(draw);
    $("#drawHolder").append(drawCount);

    var discard = `
      <div class="playingCard discard">
      <img src="https://picsum.photos/200/200" alt="Avatar" style="width:100%">
      </div>
      `;
    var discardCount = `<h3> Discard Pile: <span id="discardCount"></span> </h3>`;
    $("#discardHolder").append(discard);
    $("#discardHolder").append(discardCount);
  }

  for (var i = 0; i < 3; i++) {
    drawCard(team);
  }

  UpdateCardsKeyWords(team);
}

function drawCard(team) {
  var usingData = checkPlayerTurn(team);

  if (usingData.draw.length == 0) {
    shuffleDiscardToDraw(usingData);
  }

  //add card to hand
  if (team == userData.team.name) {
    uiHolder = "handHolder";
    $("#drawCount").text(userData.draw.length);
  } else {
    uiHolder = "opponentHandHolder";
  }

  var card = usingData.draw[0];
  usingData.draw.splice(0, 1);
  usingData.hand.push(card);
  card.cardPosition = $("#" + uiHolder + " .hand").length;

  var playCardStatus = true;
  card.playable.forEach((check) => {
    var canPlayCard = checkCardIsPlayable(check, usingData.team.name);
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

  $(renderCard("Card", card, playable, usingData.team.name))
    .appendTo("#" + uiHolder)
    .hide()
    .fadeIn("slow");
  $("#" + uiHolder + " .hand")
    .last()
    .data("card", card);
}

$("#drawHolder").on("click", function () {
  //dont show draw pile in order
  console.table(shuffleArray(userData.draw));
});

$("#discardHolder").on("click", function () {
  console.table(userData.discard);
});

$(".endButton").on("click", function () {
  endTurn(userData.team.name);
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

  var playerPos = getPlayerPositions(userData.team.name);

  playerPos.forEach((position) => {
    //get players with abilities
    // prettier-ignore
    player = matchData.gamePitch[position.row][position.col].find((player) => player.team == userData.team.name && player.player.ability);

    if (player) {
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

        playCard(null, tempCard, userData.team.name);

        //ability used
        alilityButton.html("Alility has be used");
        alilityButton.css("background-color", "deepskyblue");
        alilityButton.prop("disabled", true);
      });
    }
  });

  //allow cancel
  alilityButton.css("background-color", "red");
  alilityButton.html("Cancel");
});

function activateAbility(card, teamIdentifier) {
  ability = Object.keys(card.ability)[matchData.abilityCount];
  val = Object.values(card.ability)[matchData.abilityCount];
  matchData.playingAbility = true;
  matchData.abilityCount++;
  var ballPos = getBallPosition();
  var playerPos = getPlayerPositions(teamIdentifier);

  try {
    UpdateCardsKeyWords(teamIdentifier);
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
              matchData.gamePitch[row][cellIndex] = matchData.gamePitch[row][cellIndex].filter((player) => player.team != "ball");

              //get player passing stats
              // prettier-ignore
              var player = matchData.gamePitch[row][cellIndex].find((player) => player.team == teamIdentifier);
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
                matchData.gamePitch[dirRow][dirCellIndex].push({
                  team: "ball",
                });
              } else {
                commentate("Poor pass from " + player.player.name);
                missedPassOptions = 2;

                // prettier-ignore
                markingPlayer = matchData.gamePitch[dirRow][dirCellIndex].find((player) =>{return player.team != teamIdentifier && player.team != "ball"});
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
                    matchData.gamePitch[dirRow][dirCellIndex - 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack == 0  && canGoForward && !sameCellForward) {
                    //cant go backward... going forward
                    commentate("The ball has gone ahead of it's target");
                    matchData.gamePitch[dirRow][dirCellIndex + 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack == 1 && canGoForward && !sameCellForward) {
                    //going forward
                    commentate("The ball has gone ahead of it's target");
                    matchData.gamePitch[dirRow][dirCellIndex + 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack == 1  && canGoBackward  && !sameCellBackward) {
                    //cant go forward... go backward
                    commentate("The ball has gone behind it's target");
                    matchData.gamePitch[dirRow][dirCellIndex - 1].push({
                      team: "ball",
                    });
                  } else if (forwardOrBack != 2) {
                    //cant go in random "forwardOrBack" direction.. leave it where it was
                    commentate(
                      player.player.name +
                        " couldnt get the ball out from under his feet but still has possession"
                    );
                    matchData.gamePitch[row][cellIndex].push({
                      team: "ball",
                    });
                  }

                //player was marked and lost possession
                if (forwardOrBack == 2) {
                  commentate("The ball has been intercepted by the opposition");
                  commentate("The opposition have possesion");
                  matchData.gamePitch[dirRow][dirCellIndex].push({
                    team: "ball",
                  });
                  endTurn(teamIdentifier);
                }
              }

              activateAbility(card, teamIdentifier);
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
      matchData.gamePitch[ballPos.row][ballPos.col] = matchData.gamePitch[ballPos.row][ballPos.col].filter((player) => player.team != "ball");
      //add ball to destination index
      matchData.gamePitch["mid"][ballPos.col].push({ team: "ball" });
      activateAbility(card, teamIdentifier);
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
          if(matchData.gamePitch[position.row][position.col].find((player) => player.team != teamIdentifier && player.team != "ball" )){
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
          if((cellIndex+i) <= 5 ){
              directions.push( forward = $('#pitch tr:eq('+(rowIndex)+') td:eq('+(cellIndex+i)+')'));
          }

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
          var player = matchData.gamePitch[dirRow][dirCellIndex].find((player) => {return player.team == teamIdentifier;});

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
                var player = matchData.gamePitch[row][cellIndex].find((player) =>{return player.team == teamIdentifier});
                //remove player from current index
                // prettier-ignore
                matchData.gamePitch[row][cellIndex] = matchData.gamePitch[row][cellIndex].filter((player) => player.team != teamIdentifier);

                //add playerto destination index
                var dirCellIndex = dir.closest("td")[0].cellIndex;
                var dirRowIndex = dir.closest("tr")[0].rowIndex;
                dirRow = cellToPitch(dirRowIndex);
                matchData.gamePitch[dirRow][dirCellIndex].push(player);

                //check if player has to bring the ball
                // prettier-ignore
                var hasBall = matchData.gamePitch[row][cellIndex].find((player) =>{return player.team == "ball"});
                if (hasBall) {
                  // prettier-ignore
                  matchData.gamePitch[row][cellIndex] = matchData.gamePitch[row][cellIndex].filter((player) => player.team != "ball");
                  matchData.gamePitch[dirRow][dirCellIndex].push(hasBall);
                }

                activateAbility(card, teamIdentifier);
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
        drawCard(teamIdentifier);
      }
      activateAbility(card, teamIdentifier);
      break;
    case "Discard":
      if (val == 100) {
        discardHand(card, teamIdentifier);
      } else {
        //discard val amount of cards cards
        for (var i = 0; i < val; i++) {
          //TODO: make for random discard and selected discard
        }
      }
      activateAbility(card, teamIdentifier);
      break;
    case "Shoot":
      var randGoalChance = Math.floor(Math.random() * 100);
      var goalSuccess = getGoalChance(teamIdentifier);

      if (goalSuccess >= randGoalChance) {
        commentate("Shoots... GOAL");

        player = matchData.gamePitch[ballPos.row][ballPos.col].find(
          (player) => player.team == teamIdentifier
        );
        var goalModal = new jBox("Modal", {
          title: "GOAL!",
          content: player.player.name + " scores!",
          animation: "tada",
          autoClose: "2500",
        });
        goalModal.open();

        endTurn(teamIdentifier);

        //players move back to formation & give opponent
        resetPitch();
        if (teamIdentifier == userData.team.name) {
          matchData.playerScore++;
          $("#playerScore").html(matchData.playerScore);
          matchData.gamePitch.mid["3"].push({ team: "ball" });
        } else {
          matchData.cpuScore++;
          $("#cpuScore").html(matchData.cpuScore);
          matchData.gamePitch.mid["2"].push({ team: "ball" });
        }
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
              matchData.gamePitch[ballPos.row][ballPos.col] = matchData.gamePitch[ballPos.row][ballPos.col].filter((player) => player.team != "ball");

              //add ball to destination index
              matchData.gamePitch[punchRow][punchCol].push({
                team: "ball",
              });
              break;
            case 1:
              //players stay in same possition (loss of possesion / end turn)
              commentate("Shoots... Saved \nThe opposition have possession.");

              //give ball to goalkeeper
              // prettier-ignore
              matchData.gamePitch[ballPos.row][ballPos.col] = matchData.gamePitch[ballPos.row][ballPos.col].filter((player) => player.team != "ball");

              if (teamIdentifier == userData.team.name) {
                matchData.gamePitch.mid["5"].push({ team: "ball" });
              } else {
                matchData.gamePitch.mid["0"].push({ team: "ball" });
              }

              endTurn(teamIdentifier);
              break;
            default:
              break;
          }
        } else {
          //goalkick
          //players move back to formation
          commentate("Shoots... Missed \nGoalkick");
          resetPitch();

          if (teamIdentifier == userData.team.name) {
            matchData.gamePitch.mid["5"].push({ team: "ball" });
          } else {
            matchData.gamePitch.mid["0"].push({ team: "ball" });
          }

          endTurn(teamIdentifier);
        }
      }

      activateAbility(card, teamIdentifier);
      break;
    case "StatChange":
      //Stat changing card
      //for each change
      val.forEach((change) => {
        updateStatChange(change, teamIdentifier);
      });

      activateAbility(card, teamIdentifier);
      break;
    default:
      //finished running card abilities
      //console.log("no ability: ", ability);
      matchData.playingAbility = false;
      break;
  }
}

function playCard(elem, setCard, teamIdentifier) {
  if (!matchData.playingAbility) {
    var card;
    if (elem) {
      card = $(elem).data("card");
    } else {
      card = setCard;
    }

    var playCardStatus = true;
    card.playable.forEach((check) => {
      var canPlayCard = checkCardIsPlayable(check, teamIdentifier);
      if (canPlayCard.reason) {
        playCardStatus = canPlayCard.reason;
      }
    });

    if (playCardStatus == true) {
      if (elem) {
        //animate card removal
        $(elem).fadeOut("slow", function () {
          waitForCardToPlay(card, teamIdentifier);
        });
      } else {
        waitForCardToPlay(card, teamIdentifier);
      }
    } else {
      alert("This card is unplayable. \n" + playCardStatus);
    }
  }

  function waitForCardToPlay(card, teamIdentifier) {
    //trigger card's abilities
    matchData.abilityCount = 0;
    activateAbility(card, teamIdentifier);

    usingData = checkPlayerTurn();
    //move to discard pile
    if (card.name != "TempCard") {
      usingData.hand = usingData.hand.filter(
        (inhand) => inhand.cardPosition != card.cardPosition
      );
      usingData.discard.push(card);

      if (teamIdentifier == userData.team.name) {
        $("#discardCount").text(usingData.discard.length);
      }

      matchData.matchTime = matchData.matchTime + 3;
      $("#matchTime").html(matchData.matchTime);
    }

    var refreshIntervalId = setInterval(function () {
      if (matchData.abilityCount <= Object.keys(card.ability).length) {
        //ability is running, check again in 1 second
      } else {
        clearInterval(refreshIntervalId);
        //update pitch after card abilties
        displayGamePitch();
      }
    }, 1000);
  }
}

function endTurn(team) {
  matchData.turnCounter++;
  updateStatChange(null, team);
  discardHand(null, team);
  $(".alilityButton").prop("disabled", true);
  $(".endButton").prop("disabled", true);

  if (team == userData.team.name) {
    opponentTurn();
  } else {
    drawHand(userData.team.name);
    $(".alilityButton").prop("disabled", false);
    $(".endButton").prop("disabled", false);
  }
}

function shuffleDiscardToDraw(usingData) {
  //shuffle discard pile back to draw
  usingData.draw = shuffleArray(usingData.discard);
  usingData.discard = [];
  if (usingData.team.name == userData.team.name) {
    $("#drawCount").text(usingData.draw.length);
    $("#discardCount").text(usingData.discard.length);
  }
}

function discardHand(excludeCard, teamIdentifier) {
  var usingData = checkPlayerTurn(teamIdentifier);

  usingData.hand.forEach((card) => {
    if (card != excludeCard) {
      usingData.discard.push(card);
    }
  });
  usingData.hand = [];

  if (teamIdentifier == userData.team.name) {
    uiHolder = "handHolder";
    $("#discardCount").text(usingData.discard.length);
  } else {
    uiHolder = "opponentHandHolder";
  }

  $("#" + uiHolder + " .hand").fadeOut("fast");
}

function getOpposition(teamToFetch) {
  foundTeam = allTeams.find((team) => team.name == teamToFetch);
  foundTeam.players.forEach((player) => {
    player.team = foundTeam.name;
    player.colorPrimary = foundTeam.colorPrimary;
    player.colorAccent = foundTeam.colorAccent;
  });
  return { team: foundTeam };
}

function addPlayersToPitch(oppositionFormation) {
  matchData.gamePitch = $.extend(true, {}, pitch);

  //add user formation
  userData.team.players.forEach((player) => {
    if (player.player.position != "Goalkeeper") {
      pos = player.position.split(":");
      matchData.gamePitch[pos[0]][pos[1]].push(player);
    }
  });

  //add opposition formation
  oppositionFormation.forEach((player) => {
    if (player.player.position != "Goalkeeper") {
      pos = player.position.split(":");
      matchData.gamePitch[pos[0]][pos[1]].push(player);
    }
  });
}

function displayGamePitch() {
  $("#pitch").html("");

  $.each(matchData.gamePitch, function (index) {
    var html = "<tr>";
    $.each(matchData.gamePitch[index], function (key, cell) {
      sortPlayerIcons(cell);
      html += '<td class="pitchCell">';

      cell.forEach((player) => {
        html += getPlayerIcon(player);
      });

      html += "</td>";
    });
    html += "</tr>";

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

      console.log(matchData.gamePitch[row][cellIndex]);
    }
  });
}

function getPlayerIcon(player) {
  switch (player.team) {
    case "ball":
      return '<img src="https://raw.githubusercontent.com/jamieoneill/FootballCG/main/images/ball.png">';
      break;
    default:
      return (
        '<span class="playerIcon" style="background: ' +
        player.colorPrimary +
        "; color: " +
        player.colorAccent +
        ";   border: 2px solid " +
        player.colorAccent +
        ';">' +
        player.player.number +
        "</span>"
      );
      break;
  }
}

function sortPlayerIcons(cell) {
  //display icons in this order in the cell
  var ordering = {};
  var sortOrder = [
    userData.team.name,
    "ball",
    matchData.oppositionData.team.name,
  ];
  for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;

  cell.sort(function (a, b) {
    return ordering[a.team] - ordering[b.team];
  });

  return cell;
}

function UpdateCardsKeyWords(team) {
  var usingData = checkPlayerTurn(team);
  var uiHolder;

  if (team == userData.team.name) {
    uiHolder = "handHolder";
  } else {
    uiHolder = "opponentHandHolder";
  }

  //check each card in the hand for keyWords and update
  usingData.hand.forEach((card) => {
    var keyWordFound = keyWords.find((v) => card.text.includes(v));
    if (keyWordFound) {
      var cardText = $(
        $("#" + uiHolder + " .cardText")[card.cardPosition]
      ).text();

      switch (keyWordFound) {
        case "GoalChance":
          // prettier-ignore
          if(getGoalChance(team) <= 0){      
            if(/%/g.test( $($("#" + uiHolder+ " .cardText")[card.cardPosition]).text() )){ //keyword already replaced by %. update by regex instead
              $($("#" + uiHolder+ " .cardText")[card.cardPosition]).text(cardText.replace(/[0-9]+%/, "0%"))
            }else{
              $($("#" + uiHolder+ " .cardText")[card.cardPosition]).text(cardText.replace(keyWordFound, "0%"));
            }
          }else{
            if(/%/g.test( $($("#" + uiHolder+ " .cardText")[card.cardPosition]).text() )){
              $($("#" + uiHolder+ " .cardText")[card.cardPosition]).text(cardText.replace(/[0-9]+%/, getGoalChance(team) + "%"))
            }else{
              $($("#" + uiHolder+ " .cardText")[card.cardPosition]).text(cardText.replace(keyWordFound, getGoalChance(team) + "%"));
            }
          }
          break;
        default:
          break;
      }
    }

    abilitiesList.forEach((ability) => {
      var abilityFound = card.text.includes(ability);
      if (abilityFound) {
        var cardText = $(
          $("#" + uiHolder + " .cardText")[card.cardPosition]
        ).html();
        $($("#" + uiHolder + " .cardText")[card.cardPosition]).html(
          cardText.replace(
            ability,
            "<span style='color:#1769eb'>" + ability + "</span>"
          )
        );
      }
    });

    // up date playable ui indicator
    $("#" + uiHolder + " .cardText")[
      card.cardPosition
    ].parentNode.parentNode.classList.remove("playable");
    $("#" + uiHolder + " .cardText")[
      card.cardPosition
    ].parentNode.parentNode.classList.remove("unplayable");

    var playCardStatus = true;
    card.playable.forEach((check) => {
      var canPlayCard = checkCardIsPlayable(check, team);
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
    $("#" + uiHolder + " .cardText")[
      card.cardPosition
    ].parentNode.parentNode.classList.add(playable);
  });
}

/* Game functions */
function getBallPosition() {
  var ballPos;

  $.each(matchData.gamePitch, function (topKey, topValue) {
    $.each(topValue, function (key, value) {
      if (value.some((player) => player.team === "ball")) {
        ballPos = { row: topKey, col: parseInt(key) };
      }
    });
  });

  return ballPos;
}

function getPlayerPositions(teamIdentifier) {
  var playerPos = [];

  $.each(matchData.gamePitch, function (topKey, topValue) {
    $.each(topValue, function (key, value) {
      if (value.some((player) => player.team === teamIdentifier)) {
        playerPos.push({ row: topKey, col: parseInt(key) });
      }
    });
  });

  return playerPos;
}

function getGoalChance(teamIdentifier) {
  var ballPos = getBallPosition();
  var goalSuccess = 100;
  var oppositeTeam = getOppositeTeamTurn(teamIdentifier);

  // prettier-ignore
  markingPlayer = matchData.gamePitch[ballPos.row][ballPos.col].find((player) =>{return player.team == oppositeTeam.team.name});
  //player is marked
  if (markingPlayer) {
    //take defenders defend stat and remove success chance by that much.
    goalSuccess = goalSuccess - markingPlayer.player.defence;
  }

  //get the goalkeeper stats
  // prettier-ignore
  goalSuccess = goalSuccess - (oppositeTeam.team.players.find((player) =>{return player.player.position == "Goalkeeper"}).player.defence);

  // prettier-ignore
  attackingPlayer = matchData.gamePitch[ballPos.row][ballPos.col].find((player) =>{return player.team == teamIdentifier});
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
  if (teamIdentifier == userData.team.name) {
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
  } else {
    switch (ballPos.col) {
      case 5:
        goalSuccess = goalSuccess - 99;
        break;
      case 4:
        goalSuccess = goalSuccess - 90;
        break;
      case 3:
        goalSuccess = goalSuccess - 80;
        break;
      case 2:
        goalSuccess = goalSuccess - 70;
        break;
      case 1:
        goalSuccess = goalSuccess - 60;
        break;
      case 0:
        goalSuccess = goalSuccess - 50;
        break;
      default:
        break;
    }
  }

  return goalSuccess;
}

function updateStatChange(newChange, teamIdentifier) {
  var playerPos = getPlayerPositions(teamIdentifier);

  //new stat change
  if (newChange) {
    var changeTo = Object.keys(newChange)[0];
    var changeVal = Object.values(newChange)[0];
    var duration = newChange.duration;

    commentate("The manager's words seems to have influenced the game");
    playerPos.forEach((position) => {
      // prettier-ignore
      player = matchData.gamePitch[position.row][position.col].find((player) => player.team == teamIdentifier);
      if (newChange.type == "positive") {
        player.player[changeTo] = player.player[changeTo] + changeVal;
      } else {
        player.player[changeTo] = player.player[changeTo] - changeVal;
      }
    });

    newChange.endOnTurn = matchData.turnCounter + duration;
    matchData.statChanges.push(newChange);
  } else {
    //remove changes that have expired
    matchData.statChanges.forEach((oldChange) => {
      var changeTo = Object.keys(oldChange)[0];
      var changeVal = Object.values(oldChange)[0];

      if (oldChange.endOnTurn == matchData.turnCounter) {
        playerPos.forEach((position) => {
          // prettier-ignore
          player = matchData.gamePitch[position.row][position.col].find((player) => player.team == teamIdentifier);
          if (oldChange.type == "positive") {
            player.player[changeTo] = player.player[changeTo] - changeVal;
          } else {
            player.player[changeTo] = player.player[changeTo] + changeVal;
          }
        });
      }

      matchData.statChanges = matchData.statChanges.filter(
        (change) => change != oldChange
      );
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
function checkCardIsPlayable(check, teamIdentifier) {
  var ballPos = getBallPosition();

  switch (check) {
    case "PlayerHasBall":
      // prettier-ignore
      if (matchData.gamePitch[ballPos.row][ballPos.col].some(player => player.team === teamIdentifier)) {
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
      if (matchData.gamePitch[ballPos.row][ballPos.col].some(player => player.team != teamIdentifier)) {
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
      var playerPos = getPlayerPositions(teamIdentifier);
      var marked = false;

      playerPos.forEach((position) => {
        // prettier-ignore
        if(matchData.gamePitch[position.row][position.col].find((player) => player.team != teamIdentifier && player.team != "ball")){
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

function renderCard(type, data, playable, teamIdentifier) {
  html = "";

  switch (type) {
    case "Card":
      //if playable it's for the pitch view, otherwise it's for the overlay view
      if (playable) {
        html +=
          `<div class="playingCard hand ` +
          playable +
          `"  onclick="playCard(this, null, '` +
          teamIdentifier +
          `')">
          <img src="https://picsum.photos/200/200" alt="Avatar" style="width:100%">
          <div>
          <h4><b> ` +
          data.name +
          `</b></h4>
          <p class="cardText">` +
          data.text +
          `</p></div></div>`;
      } else {
        html +=
          `<div class="playingCard hand ` +
          playable +
          `">
          <img src="https://picsum.photos/200/200" alt="Avatar">
          <div>
          <h4><b> ` +
          data.name +
          `</b></h4><p>` +
          data.text +
          `</p></div></div>`;
      }
      break;
    case "Player":
      html +=
        `<div class="playingCard hand">
          <img src="https://picsum.photos/200/200" alt="Avatar">
        <div>
        <h4><b> ` +
        data.player.name +
        `</b></h4><p>` +
        data.player.position +
        `</p>
        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between align-items-center"><span>Attack:</span>` +
        data.player.attack +
        `</li>
          <li class="list-group-item d-flex justify-content-between align-items-center"><span>Defence:</span>` +
        data.player.defence +
        `</li>
          <li class="list-group-item d-flex justify-content-between align-items-center"><span>Passing:</span>` +
        data.player.passing +
        `</li>
          <li class="list-group-item d-flex justify-content-between align-items-center"><span>Ability:</span>` +
        (data.player.ability ? data.player.ability.name : "None") +
        `</li>
        </ul>`;
      break;
    default:
      break;
  }

  return html;
}

function checkPlayerTurn(teamIdentifier) {
  var usingData;
  if (teamIdentifier == userData.team.name) {
    usingData = userData;
  } else {
    usingData = matchData.oppositionData;
  }

  return usingData;
}

function getOppositeTeamTurn(teamIdentifier) {
  var usingData;
  if (teamIdentifier == userData.team.name) {
    usingData = matchData.oppositionData;
  } else {
    usingData = userData;
  }

  return usingData;
}
