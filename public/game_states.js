function State() {
    return {
        state: Array(0),
        update_state: function(gamestate) {
            this.state.push(gamestate)
        }
    }
}

module.exports.GameState = function() {
    return {
        players: Array(0),
    }
}