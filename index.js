var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var _ = require('lodash');

const Game = require('./classes/game.js');
var game = new Game();

app.get('/', function(req, res){res.sendFile(__dirname + '/client/client.html');});
app.get('/client/style.css', function(req, res){res.sendFile(__dirname + '/client/style.css');});
app.get('/client/app.js', function(req, res){res.sendFile(__dirname + '/client/app.js');});

//var translator = false;

io.on('connection', function(socket){
    console.log('connect');
    
    socket.on('set_player', function(name){
        var result = game.addNewPlayer(socket, name);
        if (result.status) {
            console.log('new player ' + name);
            socket.emit('set_player', true);

            var players = [];
            game.players.forEach(function(player) {
                players.push({id: player.key, name: player.name});
            });
            socket.emit('all_players', players);
            socket.broadcast.emit('new_player', {id: socket.player.key, name: socket.player.name});
        } else {
            socket.emit('set_player', false);
        }
    });

    socket.on('start_game', function(){
        console.log('start_game');
        var result = game.start();

        io.emit('set_roles', prepareRoles());
        result.data.socket.emit('res_choose_role', true);
        result.data.socket.broadcast.emit('res_choose_role', false);
    });

    socket.on('choose_role', function(role_id) {
        var result = game.chooseRole(socket.player, role_id);
        if (result.status) {
            socket.emit('res_choose_role', false);

            if (!result.data.end) {
                result.data.roles.forEach(function(role_id) {
                    io.emit('new_choose_role', role_id);
                });
                
                result.data.socket.emit('res_choose_role', true);
            } else {
                io.emit('start_players_turns');
                var result = game.nextRoleTurn();
                if (result.status) {
                    result.data.socket.emit('res_action', result.data.role_id);
                }
            }
        }
    });

    socket.on('get_money', function(){
        var result = game.getMoney(socket.player);
        if (result.status) {
            io.emit('change_money', {player_id: socket.player.key, money: socket.player.money});
        }
    });

    socket.on('end_turn', function(){
        var result = game.nextRoleTurn();
        if (result.status) {
            result.data.socket.emit('res_action', result.data.role_id);
        }
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});

function prepareRoles() {
    var roles = _.cloneDeep(game.roles);
    // roles.forEach(function(role, i, arr) {
    //     if (role.player || role.player) {
    //         role.player = true;
    //     }
    // });
    return roles;
}

function translatorData(translator) {
    if (translator) {
        var state = _.cloneDeep(c.game);
        state.players.forEach(function(player, i, arr) {
            delete player.socket;
            delete player.companies;
        });
        state.fields.forEach(function(field, i, arr) {
            field.companies.forEach(function(company, i, arr) {
                delete company.field;
                company.player = company.player.key;
            });
        });
        translator.emit('state', state);
    }
}

// socket.on('translator', function(msg){
//     console.log('translator connect');
//     translator = socket;
//     translatorData(translator);
// });

// app.get('/translator', function(req, res){res.sendFile(__dirname + '/translator/translator.html');});
// app.get('/translator/style.css', function(req, res){res.sendFile(__dirname + '/translator/style.css');});
// app.get('/translator/app.js', function(req, res){res.sendFile(__dirname + '/translator/app.js');});
// app.get('/translator/data.js', function(req, res){res.sendFile(__dirname + '/translator/data.js');});