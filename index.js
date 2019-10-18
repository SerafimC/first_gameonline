const app = require('./config/appConfig.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
sv = require('./public/game_server.js');
st = require('./public/state.js');
var server = new sv.GameServer();
const port_default = process.env.PORT || 5000 ;
var port_ = port_default;
var devMode = false;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/peers', function(req, res) {
    res.status(200).send(server.others);
});

app.get('/getstate', function(req, res) {
    res.status(200).send(server);
});

app.post('/sendstate', function(req, res) {
    server = req.body;
    res.status(200).send("Sucesso!");
});
app.post('/merge_status', function(req, res) {  
    var otherServer =  req.body;   
    if(devMode){
        console.log("Fazendo merge dos servidores!");
        console.log("this > ", server);
        console.log("------------------------------");
        console.log("otherServer > ", otherServer);
        console.log("------------------------------");
    }
    if(JSON.stringify(req.body) != "{}"){
        var other = req.body;
        if(other.others.length > server.others.length)
            server.others = other.others;
        for (let i = 0; i < other.players.length; i++) {
            index = server.players.map((el) => { return el.id }).indexOf(other.players[i].id);
            if(index != null && index >= 0){
                var id_state = parseInt(server.players[index].states[server.players[index].states.length-1].id);
                var id_state_other = parseInt(other.players[i].states[other.players[i].states.length-1].id);
                //console.log('id_state > ', id_state);
                //console.log('id_state_other > ', id_state_other);
                if(id_state < id_state_other){
                    server.players[index].states = other.players[i].states;
                }
                //console.log('server.players[index].states.length > ', server.players[index].states.length);
                //console.log('other.players[i].states.length > ', other.players[i].states.length);
            }else{
                if(server.players!=null){
                    server.players.push(other.players[i]);
                }else{
                    server.players = Array(0);
                    server.players.push(other.players[i]);
                }          
                //mergeServers();
            }
        }
        if(devMode){
            printServerStatus();
            console.log("Merge feito!");
            console.log("this > ", server);
            console.log("------------------------------");
            console.log("otherServer > ", otherServer);
            console.log("------------------------------");
        }
        res.status(200).send(server);
    }else{
        res.status(404).send("Não chegou nada aqui.");
    }
});
app.post('/updateplayer', function(req, res) {
    var player =  req.body;
    index = server.players.map((el) => { return el.id }).indexOf(player.id);
    server.players[index] = player;
    res.status(200).send(server)
});
app.post('/sendmystate', function(req, res){
    var player =  req.body;
    if(player.removed){
        removePlayer(player);
    }else{
        id = server.players.map((el) => { return el.id }).indexOf(player.id);
        if(id != -1){
            updatePlayer(player, id);
        }else{
            addPlayer(player);
        }
    }
    res.status(200).send(server)
});
function getPeers(){
    var peersUrl = 'http://localhost:' + port_ + '/peers';
    if(devMode)
        console.log('Tentando conexao em :  ' + peersUrl);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // retornou corretamente, analisa qual a porta vai usar.
            server.others = JSON.parse(this.responseText);
            if(server.others==null)
                port_ = port_default;
            else {
                server.others.sort(function(a, b) {
                        return a - b;
                    });
                    var next_port = port_default;
                    var port = port_default;
                    for (let i = 0; i < server.others.length; i++) {
                        if(server.others[i] > port){
                            next_port =  server.others[i] - 1;
                            return;
                        }
                        else
                        port =  server.others[i];
                    }
                    if(next_port === port_default)
                        next_port = port + 1;
                    port_ = next_port;

                    listen(port_);
            }
        }else{
            if(this.statusText.code === "ECONNREFUSED"){
                if((port_) < port_default){
                    port_ = port_+1;
                    getPeers();
                }else{
                    port_ = port_default;
                    listen(port_);
                }
            }
        }
    };
    xhttp.open("GET", peersUrl, false);
    xhttp.send();    
}

function listen(port){
    server.others.push(port);
    const server_listen = app.listen(port);
    console.log('Server running on port ' + port);
    console.log('Server others : ' + JSON.stringify(server.others));
    
    this.interval = setInterval(mergeServers, 5000);
}
function mergeServers()
{
    for (let i = 0; i < server.others.length; i++) {
        if(server.others[i] != port_){
            var mergesUrl = 'http://localhost:' + server.others[i] + '/merge_status';
            if(devMode)
                console.log('Tentando merge em :  ' + mergesUrl);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) { 
                    server = JSON.parse(this.responseText); 
                    if(devMode){
                        console.log("Deu boa o merge.");        
                        console.log("this > ", server);
                        console.log("------------------------------");             
                    }
                    
                    printServerStatus();
                }else{     
                    if(this.statusText!=null && this.statusText.code === "ECONNREFUSED"){
                        
                    }else{
                        console.log("Deu ruim o merge. Erro: " + this.responseText);
                    }
                }
            };           
            xhttp.open("POST", mergesUrl, false);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(server));
        }
    }
}
getPeers();

function addPlayer(player){
    player.state_id = 0;
    var state = new st.State(player.state_id, "ADD", player);
    player.states.push(state);
    
    if(server.players!=null){
        server.players.push(player);
    }else{
        server.players = Array(0);
        server.players.push(player);
    }

    if(devMode)
        printServerStatus(); 
    //printAttPlayer(player);
    //mergeServers();
}
function updatePlayer(player, index){    
    server.players[index] = player;
    //printAttPlayer(player); 
    //mergeServers();
}
function removePlayer(player){
    player.state_id++;
    var state = new st.State((player.state_id), "REMOVE", player);
    player.states.push(state);
    

    server.players.splice(player, 1);

    //mergeServers();

    printAttPlayer(player);   
    if(devMode)
        printServerStatus();
}

function printAttPlayer(player){
    console.log("------ atulização player --------");
    console.log("uuid: " + player.id);
    console.log("type: " + player.type);
    console.log("------ estados player --------");
    player.states.forEach((el) => { 
        console.log("     " + el.id + " -> " + el.action + " - " + " x: "+el.x + " y: "+el.y + " heigth: "+el.height+ " width: "+el.width);
    });
    console.log("------ ----------- --------");
}
function printServerStatus(){
    console.log(" ");
    console.log("------ SERVER STATUS ["+port_+"] --------");
    console.log("Others  : " + JSON.stringify(server.others));
    console.log("Players Online : " + server.players.length);
    if(server.players!=null)
    {
       server.players.forEach((el) => { console.log(el.type + " : " + el.id) });
    }
    console.log("------ ----------- --------");
}