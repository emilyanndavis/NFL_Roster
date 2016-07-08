/* UPDATE ROSTER DYNAMICALLY WITH CBS SPORTS API */

$(document).ready(function(){

    var loading = true;
    var playerApiUrl = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=baseball&response_format=json";
    var teamApiUrl = "http://api.cbssports.com/fantasy/pro-teams?version=3.0&SPORT=baseball&response_format=json";
    var positionApiUrl = "http://api.cbssports.com/fantasy/positions?version=3.0&SPORT=baseball&response_format=json";
    var playerService = new PlayerService(playerApiUrl, teamApiUrl, positionApiUrl, ready);


    function ready(playerService) {
        console.log('ready');
        loading = false;
        
        var sourcePlayers = playerService.getAllPlayers();

        var resultsDisplay = $('.search-results');

        $('#findByTeam').on('click', function(event){
            event.preventDefault();
            var teamName = $('#query').val();
            sourcePlayers = playerService.getPlayersByTeam(teamName);
            console.log(sourcePlayers);
            update(resultsDisplay, sourcePlayers);
        });

        $('#findByPosition').on('click', function(event){
            event.preventDefault();
            var position = $('#query').val();
            sourcePlayers = playerService.getPlayersByPosition(position);
            console.log(sourcePlayers);
            update(resultsDisplay, sourcePlayers);
        });

        var myRoster = $('.player-roster');

        $(resultsDisplay).on('click', '.btn-add', function(){
            var playerCard = $(this).closest('.player-card');
            var button = playerCard.find('button');
            button.removeClass('btn-add').addClass('btn-remove').removeClass('btn-success').addClass('btn-danger');
            button.text('Remove');
            // this only updates the DOM... 
            // it should also be updating a dataset... 
            // give each button an id that matches the player's id
            myRoster.append(playerCard);
        });

        $(myRoster).on('click', '.btn-remove', function(){
            var playerCard = $(this).closest('.player-card');
            playerCard.remove();     
        })

        function update(display, list) {
            display.empty();

            list.forEach(function(player){
                var template = 
                '<div class="player-card text-center">' + 
                    '<button type="button" class="btn btn-success btn-add">Add</button>' + 
                    '<img src="' + player.photo + '" alt="' + player.fullname + '" />' +
                    '<h3>' + player.fullname + '</h3>' + 
                    '<p>' + player.pro_team + '</p>' + 
                    '<p>#' + player.jersey + '</p>' + 
                    '<p>' + player.position + '</p>' + 
                '</div>';
                display.append(template);
            });
        }

        update(resultsDisplay, sourcePlayers);

    }

});    
