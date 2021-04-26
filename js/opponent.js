function opponentTurn() {
  drawHand(matchData.oppositionData);
  playOpponentCard();
}

function playOpponentCard() {
  var ballPos = getBallPosition();
  var playerPos = getPlayerPositions(matchData.oppositionData.team.name);
  var useableCards = getUseableCards(matchData.oppositionData);
  var priorities = getPriorities(ballPos);
  var currentPriority = null;
  var playingCard = false;

  for (let priority of priorities) {
    topPriorityCard = useableCards.find((card) =>
      Object.keys(card.ability).includes(priority)
    );

    if (topPriorityCard) {
      currentPriority = priority;
      playingCard = true;
      break;
    }
  }

  if (!playingCard) {
    endTurn(matchData.oppositionData.name);
    return;
  }

  switch (currentPriority) {
    case "Move":
      //move the opponent towards the ball
      var playersInRow = playerPos.filter(
        (player) => player.row == ballPos.row
      );

      // prettier-ignore
      var closestToBall = playersInRow.reduce(function(prev, curr) {
      return (Math.abs(curr.col - ballPos.col) < Math.abs(prev.col - ballPos.col) ? curr : prev);
    });

      //ensure opponent doesnt move when at goal
      if (closestToBall.col != 0) {
        playCard(
          $("#opponentHandHolder .playingCard")[topPriorityCard.cardPosition],
          null,
          matchData.oppositionData.team.name
        );

        // prettier-ignore
        var playerCell = $("#pitch tr:eq(" +pitchToCell(closestToBall.row)+") td:eq(" +closestToBall.col+")");
        var waitForPlayer = setInterval(function () {
          playerCell.click(); //select this player
          clearInterval(waitForPlayer);
        }, 2000);

        //check which direction to move
        var moveToCol;
        if (ballPos.col > closestToBall.col) {
          moveToCol = closestToBall.col + 1;
        } else {
          moveToCol = closestToBall.col - 1;
        }

        // prettier-ignore
        var moveCell = $("#pitch tr:eq(" +pitchToCell(ballPos.row) +") td:eq(" +moveToCol +")");
        var waitForMove = setInterval(function () {
          moveCell.click(); //select position to move player
          clearInterval(waitForMove);
        }, 3000);
      } else {
        playingCard = false;
        endTurn(matchData.oppositionData.name);
      }
      break;
    case "Pass":
      playingCard = false;
      endTurn(matchData.oppositionData.name);
    case "Shoot":
      playingCard = false; //shoot function has it's own end turn function so dont allow playNextCard here or it will be called twice
      playCard(
        $("#opponentHandHolder .playingCard")[topPriorityCard.cardPosition],
        null,
        matchData.oppositionData.team.name
      );
    case null:
      break;
    default:
      //no AI input needed just play the card
      playCard(
        $("#opponentHandHolder .playingCard")[topPriorityCard.cardPosition],
        null,
        matchData.oppositionData.team.name
      );
      break;
  }

  //play next card
  if (playingCard) {
    var playNextCard = setInterval(function () {
      playOpponentCard();
      clearInterval(playNextCard);
    }, 5500);
  }
}

function getPriorities(ballPos) {
  var priorities = ["StatChange", "Move", "Shoot", "Draw", "Pass", "Cross"];
  var playerWithBall = matchData.gamePitch[ballPos.row][ballPos.col].some(
    (player) => player.team === matchData.oppositionData.team.name
  );

  //opponent has the ball. get it
  playerWithBall ? "" : setTopPriority(priorities, "Move");

  //at goal. shoot
  if (ballPos.col == 0 && playerWithBall) {
    setTopPriority(priorities, "Shoot");
  }

  return priorities;
}

function setTopPriority(priorities, priority) {
  priorities.unshift(priorities.splice(priorities.indexOf(priority), 1)[0]);
}

function getUseableCards(usingData) {
  var playableCards = [];

  usingData.hand.forEach((card) => {
    var playCardStatus = true;
    card.playable.forEach((check) => {
      var canPlayCard = checkCardIsPlayable(check, usingData.team.name);
      if (canPlayCard.reason) {
        playCardStatus = canPlayCard.reason;
      }
    });

    if (playCardStatus == true) {
      playableCards.push(card);
    }
  });

  return playableCards;
}
