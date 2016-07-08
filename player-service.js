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
            console.log(player);
            if (player.position !== '') {
                return (player.position_name.toLowerCase() === position || player.position_abbr.toLowerCase() === position);
            }
        });
    };

    function loadPlayerData() {
        var localPlayerData = localStorage.getItem('playerData');
        if (localPlayerData) {
            playerData = JSON.parse(localPlayerData);
            return callback(self);
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var apiUrl = url + encodeURIComponent(endpointPlayerUri);

        $.getJSON(apiUrl, function(data) {
            playerData = data.body.players.filter(function(player){
                return (player.pro_status === 'A');
            });
            playerData.forEach(function(player){
                teamData.forEach(function(team){
                    if (team.abbr === player.pro_team) {
                        player.place_name = team.name;
                        player.team_name = team.nickname;
                    }
                });
                positionData.forEach(function(position){
                    if (position.abbr === player.position) {
                        player.position_abbr = position.abbr;
                        player.position_name = position.name;
                    }
                });
            });
            localStorage.setItem('playerData', JSON.stringify(playerData));
            callback(self);
        });
    }

    function loadTeamData() {
        // should be able to combine this with loadPlayerData() for a generic loadData() function ...
        // with params for dataType and localStorage dataName
        // but for now I'll write this one separately and hope they both work
        var localTeamData = localStorage.getItem('teamData');
        if (localTeamData) {
            teamData = JSON.parse(localTeamData);
            return callback(self);
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var apiUrl = url + encodeURIComponent(endpointTeamUri);

        $.getJSON(apiUrl, function(data) {
            teamData = data.body.pro_teams;
            localStorage.setItem('teamData', JSON.stringify(teamData));
            callback(self);
        });
    }   

    function loadPositionData() {
        // should be able to combine this with loadPlayerData() for a generic loadData() function ...
        // with params for dataType and localStorage dataName
        // but for now I'll write this one separately and hope they all work
        var localPositionData = localStorage.getItem('positionData');
        if (localPositionData) {
            positionData = JSON.parse(localPositionData);
            return callback(self);
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var apiUrl = url + encodeURIComponent(endpointPositionUri);

        $.getJSON(apiUrl, function(data) {
            positionData = data.body.positions;
            localStorage.setItem('positionData', JSON.stringify(positionData));
            callback(self);
        });
    }     

    loadTeamData();
    loadPositionData();
    loadPlayerData();
}