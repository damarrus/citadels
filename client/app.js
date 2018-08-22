$(document).ready(function () {
    var socket = io.connect('/');

    $('#set_player').submit(function(){
        var name = $('#player_name').val();
        socket.emit('set_player', name);
        $(this).remove();
        
        return false;
    });

    socket.on('new_player', function(player){
        addPlayer(player);
    });

    socket.on('all_players', function(players){
        $('#players').html('');
        players.forEach(function(player) {
            addPlayer(player);
        });
    });


    socket.on('set_roles', function(roles){
        $('#start_game').remove();
        var role_block = $('#choose_role');
        role_block.html('');
        roles.forEach(function(role, i, arr) {
            role_block.append(
                '<button id="r' + role.id + '" class="btn btn-' + (role.player === false ? 'danger' : 'success') + '" ' + 
                    (role.player === false ? 'disabled' : '') + '>' + role.id + ' ' + role.name + 
                '</button>'
            );
        });

        role_block.show();

        $('#choose_role > button').click(function(){
            socket.emit('choose_role', $(this).attr('id').substring(1));
            $('#choose_role > button').attr('disabled', 'disabled');
        });
    });

    socket.on('res_choose_role', function(result){
        console.log('res_choose_role', result);
        if (result) {
            $('#choose_role > button:not(.btn-danger)').removeAttr('disabled');
        } else {
            $('#choose_role > button').attr('disabled','disable');
        }

    });

    socket.on('new_choose_role', function(role_id){
        var role_button = $('#r' + role_id);
        role_button.removeClass('btn-success');
        role_button.addClass('btn-danger');
        role_button.attr('disabled', 'disabled');
    });

    socket.on('start_players_turns', function(){
        $('#choose_role').html('');
        $('#choose_role').hide();
    });

    socket.on('res_action', function(role_id){
        $('#choose_role').html('');
        $('#choose_role').hide();
        $('#actions').show();
    });

    socket.on('change_money', function(data){
        $('#players > #p' + data.player_id + ' .player-money').text(data.money);
    });

    $('#get_money').click(function(){
        socket.emit('get_money');
        $(this).attr('disabled', 'disabled');
    });

    $('#end_turn').click(function(){
        socket.emit('end_turn');
    });

    $('#start_game').click(function(){
        socket.emit('start_game');
    });

    

    socket.on('connect', function(){console.log('connect');});
    socket.on('set_player', function(result){console.log('set_player ' + result);});

    function addPlayer(player) {
        $('#players').append(
            '<div id="p' + player.id + '" class="card text-center card-player">' +
                '<div class="card-header">' +
                    '<div>' +
                        '<span class="player-money badge badge-dark">' + 4 + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="card-body">' +
                    '<h5 class="card-title">' + player.name + '</h5>' +
                    '<p class="card-text"></p>' +
                '</div>' +
                '<div class="card-footer text-muted">' +
                    
                '</div>' +
            '</div>' 
        );
   }
});