/* MANUALLY ADD PLAYERS WITH FORM */

$(document).ready(function(){

    function Player(name, position, jersey){
        this.name = name;
        this.position = position;
        this.jersey = jersey;
    }

    var players = [];

    $('form').on('submit', function(event){
        event.preventDefault();
        var form = this;
        var newPlayer = new Player(form.playerName.value, form.playerPosition.value, form.playerJersey.value);
        players.push(newPlayer);
        updateRoster();
        clearForm(form);
    });

    $('.player-roster').on('click', '.btn-remove', function(){
        var playerName = $(this).parent().find('h3').text();
        var remove = confirm('Are you sure you want to remove ' + playerName + ' from your team?');
        if (remove === true) {
            removePlayerByName(playerName);
            updateRoster();
        }
    });

    function updateRoster(){
        var rosterElem = $('.player-roster');
        rosterElem.empty();
        for (var i = 0; i < players.length; i++) {
            var currentPlayer = players[i];
            rosterElem.append('<div class="player-card text-center">' + 
            '<img src="https://dafb3cv85j5xj.cloudfront.net/blog/wp-content/uploads/2015/03/Football.jpg" alt="aaugh!" />' + 
            '<h3>' + currentPlayer.name + '</h3>' + 
            '<p>' + currentPlayer.position + '</p>' +
            '<p>' + '# ' + currentPlayer.jersey + '</p>' +
            '<button type="button" class="btn btn-warning btn-remove">Remove</button>' + 
            '</div>');
        }
    }

    function clearForm(form) {
        form.playerName.value = '';
        form.playerPosition.value = '';
        form.playerJersey.value = '';    
    }

    function removePlayerByName(name){
        for (var i = 0; i < players.length; i++){
            var player = players[i];
            if (player.name === name){
                return players.splice(i, 1);
            }
        }
    }

});




