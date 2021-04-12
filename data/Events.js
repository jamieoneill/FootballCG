class Event {
  constructor(type, date, data, status) {
    this.type = type;
    this.date = date;
    this.data = data;
    this.status = status;
  }
}

class MatchData {
  constructor(opponent, userScore, opponentScore, outcome) {
    this.opponent = opponent;
    this.userScore = userScore;
    this.opponentScore = opponentScore;
    this.outcome = outcome;
  }
}

var events = [];
var dateHolder = new Date("2021-05-16"); //week before first day of season
var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};

//add all matches to events
//start from worst opponent
allTeams.reverse().forEach((team) => {
  dateHolder = add_weeks(dateHolder, 1)

  createEvent = new Event("Match", dateHolder.toLocaleDateString("en-US", options), new MatchData(team.name));
  events.push(createEvent);
});

//set the teamlist back
allTeams.reverse();


/* Utils */
function add_weeks(dt, n) {
 var increaseDays

  //randomly choose saturday or sunday
  if(dt.getDay() == 0){
    increaseDays = randomIntFromInterval(6, 7);
  }else if(dt.getDay() == 6){
    increaseDays= randomIntFromInterval(7, 8);
  }

  return new Date(dt.setDate(dt.getDate() + n * increaseDays));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}