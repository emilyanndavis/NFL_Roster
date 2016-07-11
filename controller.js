/* UPDATE ROSTER DYNAMICALLY WITH CBS SPORTS API */

$(document).ready(function(){

    var loading = true;
    var playerApiUrl = "https://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=baseball&response_format=json";
    var teamApiUrl = "https://api.cbssports.com/fantasy/pro-teams?version=3.0&SPORT=baseball&response_format=json";
    var positionApiUrl = "https://api.cbssports.com/fantasy/positions?version=3.0&SPORT=baseball&response_format=json";
    var playerService = new PlayerService(playerApiUrl, teamApiUrl, positionApiUrl, ready);


    function ready(playerService) {
        console.log('ready');
        loading = false;
        
        var sourcePlayers = playerService.getAllPlayers();
        var resultsDisplay = $('.search-results');

        /* on-click events for each button to alter sourcePlayers based on search query 
        and update the corresponding resultsDisplay */

        $('#findByTeam').on('click', function(event){
            event.preventDefault();
            var teamName = $('#query').val();
            sourcePlayers = playerService.getPlayersByTeam(teamName);
            update(resultsDisplay, sourcePlayers);
        });

        $('#findByPosition').on('click', function(event){
            event.preventDefault();
            var position = $('#query').val();
            sourcePlayers = playerService.getPlayersByPosition(position);
            update(resultsDisplay, sourcePlayers);
        });

        $('#clearFilter').on('click', function(event){
            event.preventDefault();
            sourcePlayers = playerService.getAllPlayers();
            update(resultsDisplay, sourcePlayers);
        });

        var myPlayers = [];
        var myRoster = $('.player-roster');

        $(resultsDisplay).on('click', '.btn-add', function(){
            // update myPlayers dataset
            var id = this.id;
            var selected = sourcePlayers.find(function(player){
                return player.id === id;
            });
            myPlayers.push(selected);
            // update myRoster display
            var playerCard = $(this).closest('.player-card');
            var button = playerCard.find('button');
            button.removeClass('btn-add').addClass('btn-remove').removeClass('btn-success').addClass('btn-danger');
            button.text('Remove');
            myRoster.append(playerCard);
        });

        $(myRoster).on('click', '.btn-remove', function(){
            // update myPlayers dataset 
            var id = this.id;
            myPlayers = myPlayers.filter(function(player){
                return player.id !== id;
            });
            // update myRoster display
            var playerCard = $(this).closest('.player-card');
            playerCard.remove();     
        })

        function update(display, list) {
            display.empty();
            
            var resultsHeading = '<h3>Showing ' + list.length + ' of ' + playerService.getAllPlayers().length + ' active players</h3>';
            display.append(resultsHeading);

            list.forEach(function(player){
                var template = 
                '<div class="player-card text-center">' + 
                    '<button type="button" class="btn btn-success btn-add" id="' + player.id + '">Add</button>' + 
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
