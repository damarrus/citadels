const Result = require('./result.js');
const C = require('./../config.js');
const Role = require('./role.js');
const Player = require('./player.js');


module.exports = class Game 
{
    constructor()
    {
        this.phase = C.PHASE_ADD_PLAYERS;
        this.round = 0;
        this.players = [];
        this.roles = [];
        this.current_role = false;
        this.current_player = false;
    }

    start() {
        this.phase = C.PHASE_CHOOSE_ROLES;
        this.setRoles();
        this.discardRole(); // TODO дискард должен быть виден только активному игроку

        this.current_player = this.players[0];
        return new Result(true, {socket: this.current_player.socket});
    }

    addNewPlayer(socket, name) {
        if (socket.player) {return new Result(false, {}, C.ERROR_PLAYER_ALREADY_SET)}
        if (this.phase !== C.PHASE_ADD_PLAYERS) {return new Result(false, {}, C.ERROR_INVALID_PHASE)}

        var player = new Player(socket, name);
        socket.player = player;
        this.players.push(player);

        player.key = this.players.indexOf(player);

        return new Result();
    }

    chooseRole(player, role_id) {
        this.round++;
        var end = false;

        var role = this.roles[role_id - 1];
        var roles = [role_id];
        role.player = player;
        player.roles.push(role);

        this.nextPlayerChooseRole();

        if (this.round == 2 || this.round == 3) {
            var discard_role = this.discardRole();
            roles.push(discard_role.id);
        } else if (this.round == 4) {
            end = true;
        }

        return new Result(true, {
            socket: this.current_player.socket,
            roles: roles,
            end: end
        });
    }

    nextRoleTurn() {
        if (!this.current_role) {
            this.current_role = this.roles[0];
        }

        var current_role_id = this.current_role.id;
        while (!this.current_role.player) {
            this.current_role = this.roles[current_role_id];
        }
        this.current_player = this.current_role.player;
        return new Result(true, {
            socket: this.current_player.socket,
            role_id: this.current_role.id
        });
    }

    getMoney(player) {
        player.money += 2;
        return new Result();
    }

    // private

    setRoles() {
        C.ROLES.forEach(function(data) {
            this.roles.push(new Role(data));
        }, this);
    }

    discardRole() {
        var roles = [];
        this.roles.forEach(function(role) {
            if (role.player === null && role.id != 4) {
                roles.push(role);
            }
        });
        var discard_role = roles[Math.floor(Math.random() * roles.length)];
        discard_role.player = false;
        return discard_role;   
    }

    nextPlayerChooseRole() {
        var player_key = this.players.indexOf(this.current_player);
        if (player_key == this.players.length - 1) {
            this.current_player = this.players[0];
        } else {
            this.current_player = this.players[player_key + 1];
        }
    }
}