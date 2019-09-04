function State() {
    return {
        state: Array(0),
        update_state: function(gamestate) {
            this.state.push(gamestate)
        }
    }
}

function GameState() {
    return {
        player: {},
        players: Array(0),
    }
}