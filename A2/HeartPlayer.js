$(document).ready(function () {
    var north = new DumbAI("Blice");
    var east = new DumbAI("Bob");
    var south = new GraphicPlayer("You", $("#hand")[0]);
    var west = new DumbAI("Bavid");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});
