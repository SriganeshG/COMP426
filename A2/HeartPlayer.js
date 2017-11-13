var HeartPlayer = function (name, ui_div, wrapper, scoreboard, console, player_hand, name, north, south, east, west) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var card_source = {
        "Two of Clubs": "cardClubs2",
        "Two of Diamonds": "cardDiamonds2",
        "Two of Hearts": "cardHearts2",
        "Two of Spades": "cardSpades2",
        "Three of Clubs": "cardClubs3",
        "Three of Diamonds": "cardDiamonds3",
        "Three of Hearts": "cardHearts3",
        "Three of Spades": "cardSpades3",
        "Four of Clubs": "cardClubs4",
        "Four of Diamonds": "cardDiamonds4",
        "Four of Hearts": "cardHearts4",
        "Four of Spades": "cardSpades4",
        "Five of Clubs": "cardClubs5",
        "Five of Diamonds": "cardDiamonds5",
        "Five of Hearts": "cardHearts5",
        "Five of Spades": "cardSpades5",
        "Six of Clubs": "cardClubs6",
        "Six of Diamonds": "cardDiamonds6",
        "Six of Hearts": "cardHearts6",
        "Six of Spades": "cardSpades6",
        "Seven of Clubs": "cardClubs7",
        "Seven of Diamonds": "cardDiamonds7",
        "Seven of Hearts": "cardHearts7",
        "Seven of Spades": "cardSpades7",
        "Eight of Clubs": "cardClubs8",
        "Eight of Diamonds": "cardDiamonds8",
        "Eight of Hearts": "cardHearts8",
        "Eight of Spades": "cardSpades8",
        "Nine of Clubs": "cardClubs9",
        "Nine of Diamonds": "cardDiamonds9",
        "Nine of Hearts": "cardHearts9",
        "Nine of Spades": "cardSpades9",
        "Ten of Clubs": "cardClubs10",
        "Ten of Diamonds": "cardDiamonds10",
        "Ten of Hearts": "cardHearts10",
        "Ten of Spades": "cardSpades10",
        "Jack of Clubs": "cardClubsJ",
        "Jack of Diamonds": "cardDiamondsJ",
        "Jack of Hearts": "cardHeartsJ",
        "Jack of Spades": "cardSpadesJ",
        "Queen of Clubs": "cardClubsQ",
        "Queen of Diamonds": "cardDiamondsQ",
        "Queen of Hearts": "cardHeartsQ",
        "Queen of Spades": "cardSpadesQ",
        "King of Clubs": "cardClubsK",
        "King of Hearts": "cardHeartsK",
        "King of Diamonds": "cardDiamondsK",
        "King of Spades": "cardSpadesK",
        "Ace of Clubs": "cardClubsA",
        "Ace of Diamonds": "cardDiamondsA",
        "Ace of Hearts": "cardHeartsA",
        "Ace of Spades": "cardSpadesA",
    }
    var ui_message_log = $("<div class='text_player_message_log'></div>");
    var ui_input_form = $("<form class='text_player_input_form'><input type='text' class='text_player_input'></form>");

    var ui_show_dealt = $("<button id='show_dealt' type='button' class = 'test'>Start Game!</button>");
    var ui_pass = $("<button id='pass_button' type='button' class='test'>Pass 3</button>");
    var ui_play_card = $("<button id='play_button' type='button' class='test'>Play Card</button>");

    var ui_username = $("<form id='console' class='name_input'><input type='text' class='name_input' value='NAME HERE'></form>");
    var ui_scoreboard_north = $("<tr><td id='north_winner'>You!</td> <td id='player_score'>0</td><tr>");
    var ui_scoreboard_east = $("<tr><td id='east_winner'>East</td> <td id='east_score'>0</td><tr>");
    var ui_scoreboard_west = $("<tr><td id='west_winner'>West</td> <td id='west_score'>0</td><tr>");
    var ui_scoreboard_south = $("<tr><td id='south_winner'>South</td> <td id='south_score'>0</td><tr>");

    $("#scoreboard").append(ui_scoreboard_north).append(ui_scoreboard_east).append(ui_scoreboard_south).append(ui_scoreboard_west);

    var ui_north_cards = $("<div id='player_played'></div>");
    var ui_west_cards = $("<div id='west'></div>");
    var ui_east_cards = $("<div id='east'></div>");
    var ui_south_cards = $("<div id='south'></div>");
    $("#wrapper").append(ui_north_cards).append(ui_west_cards).append(ui_east_cards).append(ui_south_cards);

    $(ui_div).append(ui_message_log).append(ui_input_form).append(ui_show_dealt).append(ui_pass).append(ui_play_card);
    $(ui_play_card).hide();
    $("#console").append(ui_username);

    document.getElementById('show_dealt').onclick = function () {
        var dealt = current_game.getHand(player_key).getDealtCards(player_key);
        var dealt_message = $("<div class='text_player_message'>Dealt cards:</div>");
        var dealt_list = $("<ul></ul>");
        $("#player_hand").empty();
        dealt.forEach(function (c) {
            dealt_list.append($("<li>" + c.toString() + "</li>"));
        });
        firstHand();
        dealt_message.append(dealt_list);
        message_log_append(dealt_message);
        $(this).hide();
    }

    document.getElementById('pass_button').onclick = function () {
        var cardsPassed = [];
        var selected = [];

        var currentHand = current_game.getHand(player_key).getUnplayedCards(player_key);

        var currentHandString = currentHand.map(c => c.toString());

        Array.from($(".selected")).forEach(c => selected.push(c.id));

        for (var i = 0; i < currentHand.length; i++) {
            for (var j = 0; j < selected.length; j++) {
                if (card_source[currentHandString[i]] === selected[j]) {
                    cardsPassed.push(currentHand[i]);
                    window.console.log(currentHand[i]);
                }
            }
        }

        if (current_game.getStatus() === Hearts.PASSING) {
            if (!current_game.passCards(cardsPassed, player_key)) {
                alert("Please choose 3 cards to pass!");
                cardPassing();
            } else {
                $("#player").find((".selected")).removeClass("selected");
                current_game.passCards(cardsPassed, player_key);
                cardsPassed = [];
                $("#pass_button").hide();
                $(ui_play_card).show();
            }
        }
    }

    document.getElementById('play_button').onclick = function () {
        var playableCards = current_game.getHand(player_key).getPlayableCards(player_key);
        // playableCards = playableCards.map(c => c.toString())

        var cardSelectedToPlay = $("#player_hand").find(".selected").attr("id"); // grab name of png

        var cardToPlay = playableCards.filter(function (c) {
            return cardSelectedToPlay === card_source[c.toString()];
        })

        if (!current_game.playCard(cardToPlay[0], player_key)) {
            alert("Please select one card to play!");
        } else {
            current_game.playCard(cardToPlay[0], player_key);
        }
    }

    this.setupMatch = function (hearts_match, pos) {
        match = hearts_match;
        position = pos;
    }

    this.getName = function () {
        return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
        var sb = match.getScoreboard();
        $("#player_score").html(sb[Hearts.EAST]);
        $("#east_score").html(sb[Hearts.NORTH]);
        $("#south_score").html(sb[Hearts.SOUTH]);
        $("#west_score").html(sb[Hearts.WEST]);
        ui_username.on('submit', function (e) {
            e.preventDefault();
            var cmd = $(this).find('.name_input').val();
            $("#name").html(cmd);
            //$(players_name).html(cmd);
            $(this).find('.name_input').val("").hide();
        });
        current_game = game_of_hearts;
        player_key = pkey;
        $("#north_winner").css('border-color', 'white');
        $("#south_winner").css('border-color', 'white');
        $("#east_winner").css('border-color', 'white');
        $("#west_winner").css('border-color', 'white');




        game_of_hearts.registerEventHandler(Hearts.ALL_EVENTS, function (e) {
            message_log_append($("<div class='text_player_message'>" + e.toString() + "</div>"));
            //refreshHand();
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
            refreshHand();
            showPlayable();
            userTurnStart(e);
        });

        game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
            refreshHand();
            cardPassing();
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
            if (e.getNextPos() === position) {
                refreshHand();
                showPlayable();
                userTurnContinue(e);
            }
        });

        game_of_hearts.registerEventHandler(Hearts.CARD_PLAYED_EVENT, function (e) {
            card_played(e);
        });

        game_of_hearts.registerEventHandler(Hearts.PASSING_COMPLETE_EVENT, function (e) {
            refreshHand();
        });

        game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
            trickWinner(e);
        });

        game_of_hearts.registerEventHandler(Hearts.GAME_OVER_EVENT, function (e) {
            //alert();
            //window.location.reload(false);
        });
    }

    var card_played = function (e) {
        if (e.getPosition == "North") {
            $('#player_hand').empty();
            $('#player_hand').append("<th><img id='" + card_source[e.toString()] + "' class='cards' src='boardgamepack/PNG/Cards/" + card_source[e.toString()] + ".png'></th>");
        } else if (e.getPosition == "South") {
            $('#south').empty();
            $('#south').append("<img id='player_played' class='cards' src='boardgamepack/PNG/Cards/" + card_source[e.getCard()] + "'>");
        } else if (e.getPosition == "West") {
            $('#west').empty();
            $('#west').append("<img id='player_played' class='cards' src='boardgamepack/PNG/Cards/" + card_source[e.getCard()] + "'>");
        } else if (e.getPosition == "East") {
            $('#east').empty();
            $('#east').append("<img id='player_played' class='cards' src='boardgamepack/PNG/Cards/" + card_source[e.getCard()] + "'>");
        }
    }
    var userTurnStart = function (e) {
        if (e.getStartPos() == "North") {
            $(".name_input").html("Your turn!").css('background', 'yellow');
        } else {
            $(".name_input").html(" ").css('background', 'white');
        }
    }

    var userTurnContinue = function (e) {
        if (e.getNextPos() == "North") {
            $(".name_input").html("Your turn!").css('background', 'yellow');
        } else {
            $(".name_input").html(" ").css('background', 'white');
        }

    }

    var trickWinner = function (e) {
        $("#north_winner").css('border-color', 'white');
        $("#south_winner").css('border-color', 'white');
        $("#east_winner").css('border-color', 'white');
        $("#west_winner").css('border-color', 'white');
        if (e.getTrick().getWinner() == "North") {
            $("#north_winner").css('border-color', 'black');
        }
        if (e.getTrick().getWinner() == "South") {
            $("#south_winner").css('border-color', 'black');
        }
        if (e.getTrick().getWinner() == "East") {
            $("#east_winner").css('border-color', 'black');
        }
        if (e.getTrick().getWinner() == "West") {
            $("#west_winner").css('border-color', 'black');
        }

    }

    var firstHand = function (e) {
        $("#player_hand").empty();
        var current_hand = current_game.getHand(player_key).getUnplayedCards(player_key);
        current_hand.forEach(function (c) {
            $("#player_hand").append("<th><img id='" + card_source[c.toString()] + "' class='cards' src='boardgamepack/PNG/Cards/" + card_source[c.toString()] + ".png'></th>");
        });

        if (current_game.getStatus() === Hearts.PASSING) {
            $(".cards").on('click', cardPassing);
            cardsPassed = [];
            $("button#show-dealt").hide();
        }

    }

    var refreshHand = function (e) {
        $("#player_hand").empty();
        var current_hand = current_game.getHand(player_key).getUnplayedCards(player_key);
        current_hand.forEach(function (c) {
            $("#player_hand").append("<th><img id='" + card_source[c.toString()] + "' class='cards' src='boardgamepack/PNG/Cards/" + card_source[c.toString()] + ".png'></th>");
        });
    }

    var showPlayable = function () {
        if (current_game.getStatus() === Hearts.TRICK_IN_PROGRESS) {
            var playableCards = current_game.getHand(player_key).getPlayableCards(player_key);
            //playableCards = playableCards.map(c => c.toString());
            playableCards.forEach(function (c) {
                //  var cardPng = "boardgamepack/PNG/Cards/" + card_source[c] + ".png"
                //window.console.log(cardPng);
                $('#player_hand').find("#" + card_source[c] + "").addClass("playable").on("click", function () {
                    if ($(".selected").length === 1) {
                        if ($(this).hasClass("selected")) { // unselect
                            $(this).toggleClass("selected")
                        } else {
                            $(".selected").first().toggleClass("selected")
                            $(this).toggleClass("selected")
                        }
                    } else {
                        $(this).toggleClass("selected")
                    }
                });
            });
        }
    }

    var cardPassing = function (e) {
        if ($(".selected").length === 3) {
            if ($(this).hasClass("selected")) { // unselect
                $(this).toggleClass("selected");
            } else {
                $(".selected").first().toggleClass("selected");
                $(this).toggleClass("selected");
            }
        } else {
            $(this).toggleClass("selected");
        }
    }

    var message_log_append = function (msg) {
        ui_message_log.append($(msg));
        ui_message_log.scrollTop(ui_message_log.prop("scrollHeight") - ui_message_log.height());
    }

    ui_input_form.on('submit', function (e) {
        e.preventDefault();
        var cmd = $(this).find('.text_player_input').val().split(" ");
        action = cmd[0];
        if (action == "pass") {
            var cards = [new Card(Card.parseRank(cmd[1]), Card.parseSuit(cmd[2])),
			 new Card(Card.parseRank(cmd[3]), Card.parseSuit(cmd[4])),
			 new Card(Card.parseRank(cmd[5]), Card.parseSuit(cmd[6]))];
            if (!current_game.passCards(cards, player_key)) {
                message_log_append($("<div class='text_player_message error'>Card pass failed!</div>"));
            } else {
                message_log_append($("<div class='text_player_message'>Cards passed. Waiting for first trick to start.</div>"));
            }
        } else if (action == "showPlayable") {
            var playable = current_game.getHand(player_key).getPlayableCards(player_key);
            var playable_message = $("<div class='text_player_message'>Playable cards:</div>");
            var playable_list = $("<ul></ul>");
            playable.forEach(function (c) {
                playable_list.append($("<li>" + c.toString() + "</li>"));
            });
            playable_message.append(playable_list);
            message_log_append(playable_message);
        } else if (action == "showDealt") {
            var dealt = current_game.getHand(player_key).getDealtCards(player_key);
            var dealt_message = $("<div class='text_player_message'>Dealt cards:</div>");
            var dealt_list = $("<ul></ul>");
            dealt.forEach(function (c) {
                dealt_list.append($("<li>" + c.toString() + "</li>"));
            });
            dealt_message.append(dealt_list);
            message_log_append(dealt_message);
        } else if (action == "play") {
            var card_to_play = new Card(Card.parseRank(cmd[1]), Card.parseSuit(cmd[2]));
            if (!current_game.playCard(card_to_play, player_key)) {
                message_log_append($("<div class='text_player_message error'>Attempt to play " +
                    card_to_play.toString() + " failed!</div>"));
            }
        } else if (action == "autoplay") {
            var autoplay_handler = function (e) {
                if (current_game.getNextToPlay() == position) {
                    current_game.playCard(current_game.getHand(player_key).getPlayableCards(player_key)[0],
                        player_key);
                }
            }

            current_game.registerEventHandler(Hearts.TRICK_START_EVENT, autoplay_handler);
            current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, autoplay_handler);
            autoplay_handler();
        } else if (action == "scoreboard") {
            var sb = match.getScoreboard();
            message_log_append($("<div class='text_player_message'>Scoreboard:<ul>" +
                "<li>" + match.getPlayerName(Hearts.NORTH) + ": " +
                sb[Hearts.NORTH] + "</li>" +
                "<li>" + match.getPlayerName(Hearts.EAST) + ": " +
                sb[Hearts.EAST] + "</li>" +
                "<li>" + match.getPlayerName(Hearts.SOUTH) + ": " +
                sb[Hearts.SOUTH] + "</li>" +
                "<li>" + match.getPlayerName(Hearts.WEST) + ": " +
                sb[Hearts.WEST] + "</li>" +
                "</ul></div>"));
        } else {
            message_log_append($("<div class='text_player_message error'>Unknown action: " + action + "</div>"));
        }
        // Clear text input
        $(this).find('.text_player_input').val("")
    });
}
