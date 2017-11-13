$(document).ready(function () {
    var north = new HeartPlayer("Alice", $("#north_player")[0], $("#wrapper")[0], $("#scoreboard")[0], $("#console")[0], $("#player_hand")[0], $("#name")[0], $("#north")[0], $("#east")[0], $("#south")[0], $("#west")[0]);
    var east = new DumbAI("Bob")
    var south = new DumbAI("Carol");
    var west = new DumbAI("David");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});

