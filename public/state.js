class State {
    constructor(id, action, player) {
        this.id = id;
        this.action = action;

        this.width = player.width;
        this.height = player.height;
        this.x = player.x;
        this.y = player.y;
    }
}
module.exports.State = function(id, action, player) {
    return new State(id, action, player);
}