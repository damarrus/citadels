module.exports = class Player 
{
    constructor(socket, name) 
    {
        this.socket = socket;
        this.key = false;
        this.name = name;
        this.roles = [];
        this.money = 4;
    }
}

