function PlayerService(endpointPlayerUri, endpointTeamUri, endpointPositionUri, callback) {
    var self = this;
    var playerData = [];
    var teamData = [];
    var positionData = [];

    self.getAllPlayers = function() {
        return playerData;
    };

    self.getPlayersByTeam = function(teamName) {
        if (typeof teamName === 'string') {
            teamName = teamName.toLowerCase();
        }
        return playerData.filter(function(player){
            return (player.pro_team.toLowerCase() === teamName || player.place_name.toLowerCase() === teamName || player.team_name.toLowerCase() === teamName);
        });
    };

    self.getPlayersByPosition = function(position) {
        if (typeof position === 'string') {
            position = position.toLowerCase();
        }
       return playerData.filter(function(player){
            if (player.position !== '') {
                return (player.position_name.toLowerCase() === position || player.position_abbr.toLowerCase() === position);
            }
        });
    };

    function loadTeamData(secondCall) {
        // check for data in local storage, do not reload if it's already there
        var localTeamData = localStorage.getItem('teamData');
        if (localTeamData) {
            teamData = JSON.parse(localTeamData);
            return secondCall(loadPlayerData);
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var apiUrl = url + encodeURIComponent(endpointTeamUri);

        $.getJSON(apiUrl, function(data) {
            teamData = data.body.pro_teams;
            localStorage.setItem('teamData', JSON.stringify(teamData));
            console.log('team data received');
            secondCall(loadPlayerData);
        });
    }   

    function loadPositionData(thirdCall) {
        // check for data in local storage, do not reload if it's already there
        var localPositionData = localStorage.getItem('positionData');
        if (localPositionData) {
            positionData = JSON.parse(localPositionData);
            return thirdCall();
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var apiUrl = url + encodeURIComponent(endpointPositionUri);

        $.getJSON(apiUrl, function(data) {
            positionData = data.body.positions;
            localStorage.setItem('positionData', JSON.stringify(positionData));
            console.log('position data received');
            thirdCall();
        });
    }     

    function loadPlayerData() {
        // check for data in local storage, do not reload if it's already there
        var localPlayerData = localStorage.getItem('playerData');
        if (localPlayerData) {
            playerData = JSON.parse(localPlayerData);
            return callback(self);
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var apiUrl = url + encodeURIComponent(endpointPlayerUri);

        $.getJSON(apiUrl, function(data) {
            // filter data to include only players with 'active' status
            playerData = data.body.players.filter(function(player){
                return (player.pro_status === 'A');
            });
            // add team data to each player object to allow for more search options
            playerData.forEach(function(player){
                teamData.forEach(function(team){
                    if (team.abbr === player.pro_team) {
                        player.place_name = team.name;
                        player.team_name = team.nickname;
                    }
                });
            // add position data to each player object to allow for more search options
                positionData.forEach(function(position){
                    if (position.abbr === player.position) {
                        player.position_abbr = position.abbr;
                        player.position_name = position.name;
                    }
                });
            });
            localStorage.setItem('playerData', JSON.stringify(playerData));
            console.log('player data set');
            callback(self);
        });
    }
    
    // load team data, then position data, then player data
    loadTeamData(loadPositionData);
}