$(function () {
    var socket = io.connect('http://localhost:3000');
    socket.emit('translator', true);
    var players = 0;

    socket.on('state', function(game){
        console.log(game);
        $('body').html('');

        var table_players = 
            '<table id="players" class="table table-dark">' +
                '<thead>' +
                    '<tr>' +
                        '<th>Имя</th>' +
                        '<th>💀 Деньги</th>' +
                        '<th>🃏 Карты</th>' +
                        '<th>🏆 Трофеи</th>' +
                        '<th>🍪 Фишки</th>'
                    '</tr>' +
                '</thead>' +
                '<tbody>';

        game.players.forEach(function(player, i, arr){
            table_players +=
                '<tr>' +
                    '<td id="p' + 1 + '_name">' + player.name + '</td>' +
                    '<td id="p' + 1 + '_money">' + player.money + '</td>' +
                    '<td id="p' + 1 + '_cards">' + player.cards + '</td>' +
                    '<td id="p' + 1 + '_trophy">' + player.trophy + '</td>' +
                    '<td id="p' + 1 + '_company_chips">' + player.company_chips + '</td>'
                '</tr>';
        });

        table_players += '</tbody></table>';

        var fields = [];

        game.fields.forEach(function(field, i, arr) {
            var companies = '';

            var i = 0;

            field.companies.forEach(function(company) {
                console.log(company.player);
                ++i;
                companies += '<span class="field-company badge badge-' + player_classes[company.player] + '">🏭</span>';
            });

            for (; i < field.max_companies; i++) {
                companies += '<span class="field-company badge badge-secondary">🏭</span>';
            }


            if (field.number_dice == 2) {
                field.number_dice = '2/12';
            }

            var probability = field.probability;
            field.probability = '';
            for (var i = 0; i < probability; i++) {
                field.probability += '⭐';
            }

            //🎲
            
            fields.push(
                '<td id="f' + i + '">' + 
                    '<div class="card text-center field">' +
                        '<div class="card-header">' +
                            '<div>' +
                                '<span class="field-number_dice badge badge-light">' + field.number_dice + '</span>' +
                                '<br><span class="field-probability">' + field.probability + '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="card-body">' +
                            '<h5 class="card-title">' + field.name + '</h5>' +
                            '<p class="card-text"></p>' +
                            '<span class="field-cost badge badge-secondary">' + field.cost + '💀</span>' +
                            '<span class="field-profit badge badge-' + (field.profit > 0 ? 'success' : 'danger') + '">' + 
                                (field.profit > 0 ? '+' + field.profit : field.profit) + '💀</span>' +
                        '</div>' +
                        '<div class="card-footer text-muted">' +
                            companies +
                        '</div>' +
                    '</div>' +
                '</td>'
            );
        });

        $('body').append(
            
        );

        
                
        var fields_html = '<table id="fields"><tr>';
        fields_html += fields[0] + fields[1] + fields[2] + fields[3] + '</tr><tr>';
        fields_html += fields[9] + '<td id="center" colspan="2">' + table_players + '</td>' + fields[4] + '</tr><tr>';
        fields_html += fields[8] + fields[7] + fields[6] + fields[5] + '</tr></table>';

        $('body').append(fields_html);
    });

    socket.on('new_player', function(name){
        console.log('new_player ' + name);
        ++players;
        newPlayer(name, players);
    });

    socket.on('set_fields', function(fields){
        fields.forEach(function(item, i, arr) {
            $('#f' + (i + 1)).text(item.name);
        });
    });
});