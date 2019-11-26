class Player {
    constructor(width, height, color, x, y){
        this.id = this.uuidv4();
        this.safe = true;
        this.type = 'player';
        this.width = width;
        this.height = height;
        this.speed = 4;
        this.inativity = 0;
        this.state_id = 0;
        this.color = color;
        this.removed = false;
        this.x = x;
        this.y = y;
        this.states = Array(0);
    }
    // gera um UUID para o player
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        });
    }
}
