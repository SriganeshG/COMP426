$(document).ready(function () {
    var north = new HeartPlayer("You", $("#north_player")[0], $("#wrapper")[0], $("#scoreboard")[0], $("#console")[0], $("#player_hand")[0], $("#name")[0], $("#north")[0], $("#east")[0], $("#south")[0], $("#west")[0]);
    var east = new DumbAI("East")
    var south = new DumbAI("South");
    var west = new DumbAI("West");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});
