var myGamePiece;
var mousedown = -1;
var states = new State();
var gamestate = new GameState();

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);

    myGamePiece.speed = 10;
    gamestate.player = myGamePiece;
    states.update_state(gamestate);

    myGameArea.start();
}

function genLabyrinth() {
    new component(10, 100, "blue", 100, 0).update();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    const current_state = states.state[states.state.length - 1];

    myGameArea.clear();
    myGameArea.frameNo += 1;

    current_state.player.update();
    // states.update_state(gamestate);

}

document.addEventListener('keypress', (event) => {

    if (event.keyCode == '97') {
        myGamePiece.x += myGamePiece.speed * -1;
        update_gamestate();
    }

    if (event.keyCode == '100') {
        myGamePiece.x += myGamePiece.speed;
        update_gamestate();
    }

    if (event.keyCode == '119') {
        myGamePiece.y += myGamePiece.speed * -1;
        update_gamestate();
    }

    if (event.keyCode == '115') {
        myGamePiece.y += myGamePiece.speed;
        update_gamestate();
    }

});

function update_gamestate() {
    states.update_state(gamestate);
}