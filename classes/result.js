module.exports = class Result 
{
    constructor(status, data, error)
    {
        this.status = status || true;
        this.data = data || null;
        this.error = error || null;
    }
}