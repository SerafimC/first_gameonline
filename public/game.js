var myGamePiece;
var mousedown = -1;
var gamestate = {}
var maze = []
var ajax = new XMLHttpRequest();
var geturl = 'http://localhost:5000/getstate'
var sendurl = 'http://localhost:5000/sendstate'
var devMode = false;

var states = new State();

function startGame() {
    myGamePiece = new component(20, 20, "red", 20, 120);
    myGamePiece.speed = 4;

    getState(geturl, responseGet);
    sendState(sendurl, doNothing);


    if (states.state.length > 0 && devMode) {
        const current_state = states.state[states.state.length - 1].players;

        players = mapPlayers(current_state);

        players.forEach((el) => { console.log("new component(" + el.width + ", " + el.height + ", 'blue', " + el.x + ", " + el.y + ");") });
    }

    createMaze();
    myGameArea.start();

}

function genLabyrinth() {
    new component(10, 100, "blue", 100, 0).update();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 1000;
        this.canvas.height = 1000;
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
    this.id = ''
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
    getState(geturl, responseGet);

    const current_state = states.state[states.state.length - 1].players;
    const player = current_state.find((el) => {
        if (el.id == myGamePiece.id) {
            return el
        }
    });

    myGameArea.clear();
    myGameArea.frameNo += 1;

    maze.forEach((el) => { el.update() });


    mapGamePiece(myGamePiece, player);
    myGamePiece.update();

    players = mapPlayers(current_state);

    players.forEach((el) => { el.update() });

}

document.addEventListener('keypress', (event) => {
    const current_state = states.state[states.state.length - 1].players;
    players = mapPlayers(current_state);

    if (event.keyCode == '97') {
        myGamePiece.x += myGamePiece.speed * -1;
        if (crash(myGamePiece, players) || crash(myGamePiece, maze)) {
            myGamePiece.x -= myGamePiece.speed * -1;
        } else {
            update_gamestate()
        }
    }

    if (event.keyCode == '100') {
        myGamePiece.x += myGamePiece.speed;
        if (crash(myGamePiece, players) || crash(myGamePiece, maze)) {
            myGamePiece.x -= myGamePiece.speed;
        } else {
            update_gamestate()
        }
    }

    if (event.keyCode == '119') {
        myGamePiece.y += myGamePiece.speed * -1;
        if (crash(myGamePiece, players) || crash(myGamePiece, maze)) {
            myGamePiece.y -= myGamePiece.speed * -1;
        } else {
            update_gamestate()
        }
    }

    if (event.keyCode == '115') {
        myGamePiece.y += myGamePiece.speed;
        if (crash(myGamePiece, players) || crash(myGamePiece, maze)) {
            myGamePiece.y -= myGamePiece.speed;
        } else {
            update_gamestate()
        }
    }

});

function update_gamestate() {
    id = gamestate.players.map((el) => { return el.id }).indexOf(myGamePiece.id);
    gamestate.players[id] = myGamePiece;
    states.update_state(gamestate);
    sendState(sendurl, doNothing);
    getState(geturl, responseGet);
}

function getState(url, cFunction) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cFunction(this);
        }
    };
    xhttp.open("POST", url, false);
    xhttp.send();
}

function responseGet(xhttp) {
    gamestate = JSON.parse(xhttp.responseText)

    if (myGamePiece.id == '') {
        myGamePiece.id = 'ply' + gamestate.players.length;
        gamestate.players.push(myGamePiece)
    }

    states.update_state(gamestate);
}

function sendState(url, cFunction) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cFunction(this);
        }
    };
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(gamestate));
}

function doNothing() {}

function mapGamePiece(gamepiece, newData) {
    gamepiece.width = newData.width;
    gamepiece.height = newData.height;
    gamepiece.speed = newData.speed;
    gamepiece.x = newData.x;
    gamepiece.y = newData.y;
}

function mapPlayers(state) {

    players = state.filter(el => el.id != myGamePiece.id).map((el) => {
        return new component(el.width, el.height, "gray", el.x, el.y);
    });

    return players
}

function crash(myGamePiece, objects) {
    for (i = 0; i < objects.length; i += 1) {
        if (myGamePiece.crashWith(objects[i])) {
            return true;
        }
    }
    return false;
}

function updateMyGamePiece() {
    console.log('OK')
    var w = document.getElementById("w").value;
    var h = document.getElementById("h").value;
    var s = document.getElementById("s").value;

    myGamePiece.width = w;
    myGamePiece.height = h;

    update_gamestate();
}

function createMaze() {
    maze.push(new component(1000, 15, 'blue', -2, 0));
    maze.push(new component(1000, 15, 'blue', -6, 984));
    maze.push(new component(15, 1000, 'blue', 982, 0));
    maze.push(new component(15, 1000, 'blue', -2, 12));
    maze.push(new component(30, 30, 'blue', 10, 180));
    maze.push(new component(30, 30, 'blue', 10, 72));
    maze.push(new component(30, 30, 'blue', 762, 956));
    maze.push(new component(30, 30, 'blue', 890, 956));
    maze.push(new component(150, 30, 'blue', 34, 180));
    maze.push(new component(150, 30, 'blue', 38, 72));
    maze.push(new component(30, 30, 'blue', 226, 72));
    maze.push(new component(30, 30, 'blue', 222, 180));
    maze.push(new component(30, 150, 'blue', 154, 208));
    maze.push(new component(30, 150, 'blue', 222, 204));
    maze.push(new component(30, 30, 'blue', 226, 44));
    maze.push(new component(30, 60, 'blue', 158, 20));
    maze.push(new component(30, 30, 'blue', 158, 8));
    maze.push(new component(30, 30, 'blue', 290, 180));
    maze.push(new component(30, 30, 'blue', 354, 180));
    maze.push(new component(30, 30, 'blue', 418, 180));
    maze.push(new component(30, 150, 'blue', 290, 204));
    maze.push(new component(30, 150, 'blue', 354, 204));
    maze.push(new component(30, 150, 'blue', 418, 204));
    maze.push(new component(90, 30, 'blue', 154, 348));
    maze.push(new component(30, 30, 'blue', 222, 348));
    maze.push(new component(40, 30, 'blue', 278, 352));
    maze.push(new component(30, 30, 'blue', 290, 352));
    maze.push(new component(30, 70, 'blue', 154, 376));
    maze.push(new component(30, 150, 'blue', 354, 296));
    maze.push(new component(300, 30, 'blue', 82, 416));
    maze.push(new component(30, 150, 'blue', 418, 348));
    maze.push(new component(200, 30, 'blue', 186, 480));
    maze.push(new component(30, 200, 'blue', 82, 436));
    maze.push(new component(30, 150, 'blue', 146, 480));
    maze.push(new component(30, 70, 'blue', 354, 508));
    maze.push(new component(150, 30, 'blue', 82, 664));
    maze.push(new component(30, 30, 'blue', 50, 672));
    maze.push(new component(30, 30, 'blue', 54, 664));
    maze.push(new component(30, 30, 'blue', 50, 664));
    maze.push(new component(30, 300, 'blue', 50, 688));
    maze.push(new component(30, 30, 'blue', 122, 912));
    maze.push(new component(30, 30, 'blue', 130, 728));
    maze.push(new component(30, 30, 'blue', 122, 920));
    maze.push(new component(30, 210, 'blue', 122, 728));
    maze.push(new component(30, 30, 'blue', 170, 480));
    maze.push(new component(90, 32, 'blue', 6, 604));
    maze.push(new component(30, 300, 'blue', 354, 576));
    maze.push(new component(30, 300, 'blue', 418, 496));
    maze.push(new component(30, 30, 'blue', 386, 684));
    maze.push(new component(30, 30, 'blue', 270, 664));
    maze.push(new component(30, 200, 'blue', 270, 692));
    maze.push(new component(130, 30, 'blue', 158, 728));
    maze.push(new component(30, 30, 'blue', 418, 832));
    maze.push(new component(30, 150, 'blue', 418, 840));
    maze.push(new component(250, 30, 'blue', 134, 920));
    maze.push(new component(30, 150, 'blue', 270, 532));
    maze.push(new component(500, 30, 'blue', 228, 44));
    maze.push(new component(437, 30, 'blue', 292, 104));
    maze.push(new component(30, 30, 'blue', 696, 16));
    maze.push(new component(30, 30, 'blue', 696, 12));
    maze.push(new component(30, 200, 'blue', 484, 128));
    maze.push(new component(100, 30, 'blue', 728, 44));
    maze.push(new component(150, 30, 'blue', 868, 44));
    maze.push(new component(170, 30, 'blue', 764, 104));
    maze.push(new component(30, 150, 'blue', 832, 120));
    maze.push(new component(170, 30, 'blue', 764, 308));
    maze.push(new component(30, 70, 'blue', 904, 120));
    maze.push(new component(30, 100, 'blue', 904, 224));
    maze.push(new component(200, 30, 'blue', 632, 172));
    maze.push(new component(30, 30, 'blue', 560, 120));
    maze.push(new component(30, 150, 'blue', 560, 104));
    maze.push(new component(30, 100, 'blue', 632, 188));
    maze.push(new component(150, 30, 'blue', 512, 288));
    maze.push(new component(30, 150, 'blue', 736, 244));
    maze.push(new component(250, 30, 'blue', 488, 364));
    maze.push(new component(70, 30, 'blue', 444, 300));
    maze.push(new component(30, 630, 'blue', 488, 376));
    maze.push(new component(430, 30, 'blue', 556, 432));
    maze.push(new component(150, 30, 'blue', 832, 380));
    maze.push(new component(420, 30, 'blue', 516, 500));
    maze.push(new component(200, 30, 'blue', 556, 568));
    maze.push(new component(200, 30, 'blue', 792, 568));
    maze.push(new component(420, 30, 'blue', 516, 644));
    maze.push(new component(30, 60, 'blue', 580, 588));
    maze.push(new component(150, 30, 'blue', 556, 720));
    maze.push(new component(100, 30, 'blue', 744, 720));
    maze.push(new component(100, 30, 'blue', 884, 720));
    maze.push(new component(430, 30, 'blue', 560, 788));
    maze.push(new component(30, 60, 'blue', 756, 660));
    maze.push(new component(30, 60, 'blue', 600, 736));
    maze.push(new component(30, 130, 'blue', 560, 808));
    maze.push(new component(30, 130, 'blue', 624, 860));
}
function createMaze2() {
    new component(1000, 15, 'blue', -2, 0).update();
    new component(1000, 15, 'blue', -6, 984).update();
    new component(15, 1000, 'blue', 982, 0).update();
    new component(15, 1000, 'blue', -2, 12).update();
    new component(30, 30, 'blue', 10, 180).update();
    new component(30, 30, 'blue', 10, 72).update();
    new component(30, 30, 'blue', 762, 956).update();
    new component(30, 30, 'blue', 890, 956).update();
    new component(150, 30, 'blue', 34, 180).update();
    new component(150, 30, 'blue', 38, 72).update();
    new component(30, 30, 'blue', 226, 72).update();
    new component(30, 30, 'blue', 222, 180).update();
    new component(30, 150, 'blue', 154, 208).update();
    new component(30, 150, 'blue', 222, 204).update();
    new component(30, 30, 'blue', 226, 44).update();
    new component(30, 60, 'blue', 158, 20).update();
    new component(30, 30, 'blue', 158, 8).update();
    new component(30, 30, 'blue', 290, 180).update();
    new component(30, 30, 'blue', 354, 180).update();
    new component(30, 30, 'blue', 418, 180).update();
    new component(30, 150, 'blue', 290, 204).update();
    new component(30, 150, 'blue', 354, 204).update();
    new component(30, 150, 'blue', 418, 204).update();
    new component(90, 30, 'blue', 154, 348).update();
    new component(30, 30, 'blue', 222, 348).update();
    new component(40, 30, 'blue', 278, 352).update();
    new component(30, 30, 'blue', 290, 352).update();
    new component(30, 70, 'blue', 154, 376).update();
    new component(30, 150, 'blue', 354, 296).update();
    new component(300, 30, 'blue', 82, 416).update();
    new component(30, 150, 'blue', 418, 348).update();
    new component(200, 30, 'blue', 186, 480).update();
    new component(30, 200, 'blue', 82, 436).update();
    new component(30, 150, 'blue', 146, 480).update();
    new component(30, 70, 'blue', 354, 508).update();
    new component(150, 30, 'blue', 82, 664).update();
    new component(30, 30, 'blue', 50, 672).update();
    new component(30, 30, 'blue', 54, 664).update();
    new component(30, 30, 'blue', 50, 664).update();
    new component(30, 300, 'blue', 50, 688).update();
    new component(30, 30, 'blue', 122, 912).update();
    new component(30, 30, 'blue', 130, 728).update();
    new component(30, 30, 'blue', 122, 920).update();
    new component(30, 210, 'blue', 122, 728).update();
    new component(30, 30, 'blue', 170, 480).update();
    new component(90, 32, 'blue', 6, 604).update();
    new component(30, 300, 'blue', 354, 576).update();
    new component(30, 300, 'blue', 418, 496).update();
    new component(30, 30, 'blue', 386, 684).update();
    new component(30, 30, 'blue', 270, 664).update();
    new component(30, 200, 'blue', 270, 692).update();
    new component(130, 30, 'blue', 158, 728).update();
    new component(30, 30, 'blue', 418, 832).update();
    new component(30, 150, 'blue', 418, 840).update();
    new component(250, 30, 'blue', 134, 920).update();
    new component(30, 150, 'blue', 270, 532).update();
    new component(300, 30, 'blue', 292, 104).update();
    new component(100, 30, 'blue', 292, 44).update();
    new component(30, 100, 'blue', 424, 16).update();
    new component(200, 30, 'blue', 488, 44).update();
    new component(120, 30, 'blue', 632, 104).update();
    new component(30, 90, 'blue', 724, 44).update();
    new component(200, 30, 'blue', 744, 104).update();
    new component(30, 50, 'blue', 788, 16).update();
    new component(30, 60, 'blue', 856, 52).update();
    new component(50, 30, 'blue', 932, 44).update();
    new component(100, 30, 'blue', 448, 180).update();
    new component(100, 30, 'blue', 600, 180).update();
    new component(100, 30, 'blue', 756, 180).update();
    new component(100, 30, 'blue', 900, 180).update();
    new component(30, 100, 'blue', 488, 252).update();
    new component(50, 30, 'blue', 516, 320).update();
    new component(100, 30, 'blue', 569, 248).update();
    new component(30, 150, 'blue', 668, 208).update();
    new component(30, 200, 'blue', 604, 276).update();
    new component(30, 580, 'blue', 668, 404).update();
    new component(120, 30, 'blue', 448, 384).update();
    new component(120, 30, 'blue', 488, 448).update();
    new component(30, 100, 'blue', 488, 476).update();
    new component(30, 200, 'blue', 488, 748).update();
    new component(105, 30, 'blue', 516, 920).update();
    new component(30, 200, 'blue', 600, 748).update();
    new component(190, 30, 'blue', 484, 668).update();
    new component(100, 50, 'blue', 416, 748).update();
    new component(30, 60, 'blue', 484, 696).update();
    new component(15, 180, 'blue', 552, 696).update();
    new component(150, 30, 'blue', 488, 600).update();
    new component(30, 30, 'blue', 488, 572).update();
    new component(150, 30, 'blue', 548, 528).update();
    new component(300, 30, 'blue', 692, 328).update();
    new component(30, 100, 'blue', 756, 192).update();
    new component(150, 40, 'blue', 788, 252).update();
    

    new component(30, 585, 'blue', 736, 328).update();
    new component(30, 600, 'blue', 808, 396).update();
    new component(100, 30, 'blue', 884, 396).update();
    new component(30, 500, 'blue', 884, 396).update();


    // partida
    new component(30, 30, 'red', 20, 120).update();
    // destino
    new component(30, 30, 'green', 936, 444).update();
  
}
