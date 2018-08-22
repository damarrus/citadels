module.exports = class Role 
{
    constructor(data)
    {
        this.id = data.id;
        this.name = data.name;
        this.player = null;
    }
}