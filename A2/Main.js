$(docment).ready(function () {

    var south = new HeartPlayer("You")
    var north = new DumbAI("Bob")
    var east = new DumbAI("Barol")
    var west = new DumbAI("Bavid")
    var match = new HeartsMatch(north, east, south, west);
    match.run();
})
