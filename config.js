module.exports = {
    PHASE_ADD_PLAYERS :    1,
    PHASE_CHOOSE_ROLES :   2,
    PHASE_START_TURN :     3,
    PHASE_PROFIT :         4,
    PHASE_AUCTION :        5,
    PHASE_FATE_STARTUPS :  6,
    PHASE_BUILD_STARTUPS : 7,
    PHASE_END_TURN :       8,
    PHASE_WINTER :         9,
    
    ERROR_INVALID_PHASE : {code: 1,message: 'Неправильная фаза'},
    ERROR_PLAYER_ALREADY_SET : {code: 2,message: 'Игрок уже установлен'},

    ROLES: [
        {id: 1,  name: 'Ассасин',          profit: -3, max_companies: 3, number_dice: 2,  probability: 2},
        {id: 2,  name: 'Вор',    profit:  3, max_companies: 3, number_dice: 3,  probability: 2},
        {id: 3,  name: 'Чародей',           profit:  3, max_companies: 3, number_dice: 4,  probability: 3},
        {id: 4,  name: 'Король',       profit:  3, max_companies: 4, number_dice: 5,  probability: 4},
        {id: 5,  name: 'Епископ',        profit: -2, max_companies: 3, number_dice: 6,  probability: 5},
        {id: 6,  name: 'Купец',       profit:  1, max_companies: 2, number_dice: 7,  probability: 6},
        {id: 7,  name: 'Зодчий',   profit:  1, max_companies: 3, number_dice: 8,  probability: 5},
        {id: 8,  name: 'Кондотьер', profit:  2, max_companies: 4, number_dice: 9,  probability: 4},
    ]
};

