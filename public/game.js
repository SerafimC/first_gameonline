var myGamePiece;
var mousedown = -1;
var gameServer = {}
var maze = []
var port;
var geturl;
var sendurl;
var updateurl;
var sendStateUrl;
var devMode = false;

var server = new Server();

function printServer(server){
    console.log(" ");
    console.log("------ SERVER STATUS --------");
    console.log("Others  : " + JSON.stringify(server.others));
    console.log("Players Online : " + server.players.length);
    if(server.players!=null)
    {
        server.players.forEach((player) => { 
            console.log("------ ----------- --------");
            console.log(player.type + " : " + player.id) 
            console.log("------ estados player --------");
            player.states.forEach((el) => { 
                console.log("     " + el.id + " -> " + el.action + " - " + " x: "+el.x + " y: "+el.y + " heigth: "+el.height+ " width: "+el.width);
            });
        });
    }
    console.log("------ ----------- --------");
}
function printPlayer(player){
    console.log("------ ----------- --------");
            console.log(player.type + " : " + player.id) 
            console.log("------ estados player --------");
            player.states.forEach((el) => { 
                console.log("     " + el.id + " -> " + el.action + " - " + " x: "+el.x + " y: "+el.y + " heigth: "+el.height+ " width: "+el.width);
            });
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
function startGame() {
    port = window.location.port;
    geturl = 'http://localhost:'+port+'/getstate';
    sendurl = 'http://localhost:'+port+'/sendstate';
    updateurl = 'http://localhost:'+port+'/updateplayer';
    sendStateUrl = 'http://localhost:'+port+'/sendmystate';

    // cria novo player
    myGamePiece = new Player(20, 20, "red", 20, 120);
            
    // envia status do player novo
    sendState(sendStateUrl, responseGet, myGamePiece);

    // cria o labirinto
    createMaze();
    myGameArea.start();
}

function genLabyrinth() {
    new component(10, 100, "blue", 100, 0).update();
}

function updatePlayer(obj){
    ctx = myGameArea.context;
    if(obj.id != myGamePiece.id)
        obj.color = "black";
    if (obj.type == "text") {
        ctx.font = obj.width + " " + obj.height;
        ctx.fillStyle = obj.color;
        ctx.fillText(obj.text, obj.x, obj.y);
    } else {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}
function crashPlayer(otherobj){
    var myleft = myGamePiece.x;
        var myright = myGamePiece.x + (myGamePiece.width);
        var mytop = myGamePiece.y;
        var mybottom = myGamePiece.y + (myGamePiece.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        // teste se está no ponto inicial não da conflito
        if(((mybottom-21) >= 100) && ((mytop+21) <= 180) && ((myright-21) >= 13) && ((myleft-20) <= 83)){
            crash = false;
        }
        // teste se está na safe-zone
        if(((mybottom) > 100) && ((mytop) < 180) && ((myright) > 12) && ((myleft) < 80)){
            myGamePiece.safe = true;
        }else{
            myGamePiece.safe = false;
        }
        return crash;
}

function component(width, height, color, x, y, type) {
    this.id = ''
    this.port = ''
    this.lastUpdate = ''
    this.safe = true;
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.inativity = 0;
    this.state_id = 0;
    this.color = color;
    this.removed = false;
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
        // teste se está no ponto inicial não da conflito
        if (((mybottom - 21) >= 100) && ((mytop + 21) <= 180) && ((myright - 21) >= 13) && ((myleft - 20) <= 83)) {
            crash = false;
        }
        // teste se está na safe-zone
        if (((mybottom) > 100) && ((mytop) < 180) && ((myright) > 12) && ((myleft) < 80)) {
            this.safe = true;
        } else {
            this.safe = false;
        }

        return crash;
    }
}

function updateGameArea() {
    getState(geturl, responseGet); 

    //printServer(server);

    myGameArea.clear();
    myGameArea.frameNo += 1;

    maze.forEach((el) => { el.update() });
    
    id = server.players.map((el) => { return el.id }).indexOf(myGamePiece.id);

    if(id != -1){
        const player = server.players[id];        
    
        mapGamePiece(myGamePiece, player);
        updatePlayer(myGamePiece);
    
        server.players.forEach((el) => { updatePlayer(el) });
    
        // se ficar inativo por 1000 laços desconecta 
        if(myGamePiece.inativity > 2000){
            removeMe("Removido por inatividade.");
        }
    }

    //myGamePiece.inativity += 1;
    //console.log("myInativity: " + myGamePiece.inativity);
    sendState(updateurl, responseGet, myGamePiece); 
}

document.addEventListener('keypress', (event) => {
    //if(myGamePiece.safe)
    //    console.log("safe-zone");
    //else
    //    console.log("unsafe-zone");
    myGamePiece.inativity = 0;

    if (event.keyCode == '97') {
        myGamePiece.x += myGamePiece.speed * -1;
        if (crashPlayer(server.players) || crashPlayer(maze)) {
           myGamePiece.x -= myGamePiece.speed * -1;
        } else {
            update_gamestate()
        }
    }

    if (event.keyCode == '100') {
        myGamePiece.x += myGamePiece.speed;
        if (crashPlayer(server.players) || crashPlayer(maze)) {
           myGamePiece.x -= myGamePiece.speed;
        } else {
            update_gamestate()
        }
    }

    if (event.keyCode == '119') {
       myGamePiece.y += myGamePiece.speed * -1;
       if (crashPlayer(server.players) || crashPlayer(maze)) {
           myGamePiece.y -= myGamePiece.speed * -1;
       } else {
            update_gamestate()
       }
    }

    if (event.keyCode == '115') {
        myGamePiece.y += myGamePiece.speed;
        if (crashPlayer(server.players) || crashPlayer(maze)) {
           myGamePiece.y -= myGamePiece.speed;
        } else {
            update_gamestate()
        }
    }

});

function update_gamestate() {
    var state = new State((myGamePiece.state_id+1), "UPDATE", myGamePiece);
    myGamePiece.states.push(state);
    myGamePiece.state_id++;

    id = server.players.map((el) => { return el.id }).indexOf(myGamePiece.id);
    server.players[id] = myGamePiece;

    sendState(sendStateUrl, responseGet, myGamePiece);
    //server.merge_states(server.players);        
}
function sendState(url, cFunction, obj) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cFunction(this);
        }
    };
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(obj));
}

function getState(url, cFunction) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cFunction(this);
        }
    };
    xhttp.open("GET", url, false);
    xhttp.send();
}

function responseGet(xhttp) {
    server = JSON.parse(xhttp.responseText);
    id = server.players.map((el) => { return el.id }).indexOf(myGamePiece.id);
    if(id != -1){
        myGamePiece = server.players[id];
    }
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
function removeMe(motivo){
    myGamePiece.removed = true;
    sendState(sendStateUrl, responseGet, myGamePiece);
        
    clearInterval(myGameArea.interval);
    myGameArea.clear();
    myGameArea.frameNo += 1;

    maze.forEach((el) => { el.update() });

    alert(motivo);
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
    maze.push(new component(70, 80, "green", 13, 100));
}