const C = require('./../config.js');

const Game = require('./game.js');
const Player = require('./player.js');
const Result = require('./result.js');

module.exports = class Controller 
{
    constructor()
    {
        this.game = new Game();
    }

    addNewPlayer(socket, name) {
        if (socket.player) {return new Result(false, {}, C.ERROR_PLAYER_ALREADY_SET)}
        if (this.game.phase !== C.PHASE_ADD_PLAYERS) {return new Result(false, {}, C.ERROR_INVALID_PHASE)}

        var player = new Player(socket, name);
        socket.player = player;
        this.game.players.push(player);

        var key = this.game.players.indexOf(player);
        player.key = key;

        return new Result();
    }

    startGamePrepare() {
        this.game.phase = C.PHASE_PREPARE;
        this.game.current_player = this.game.players[0];
        return new Result(true, {socket: this.game.current_player.socket});
    }

    setStartCompany(player, field_key) {
        console.log(this.game.current_player);
        if (player != this.game.current_player) {return new Result(false, {}, false)}

        var field = this.game.fields[field_key];
        field.setCompany(player);

        // TODO Сделать обратный отсчет игроков
        if (this.game.players.indexOf(this.game.current_player) == this.game.players.length - 1) {
            this.game.current_player = this.game.players[0];
        } else {
            this.game.current_player = this.game.players[this.game.players.indexOf(this.game.current_player) + 1];
        }
        
        return new Result(true, {socket: this.game.current_player.socket});
    }
}