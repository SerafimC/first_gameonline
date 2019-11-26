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
    if(JSON.stringify(req.body) != "{}"){
        var other = req.body;
        var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
        var hashServer = MD5(JSON.stringify(server));
        var hashOther = MD5(JSON.stringify(other));
        if(hashServer == hashOther){
            //console.log("hash iguais");
            res.status(200).send(other);
        }else{
            //console.log("hash diferente");
            if(devMode){
                console.log("Fazendo merge dos servidores!");
                console.log("this > ", server);
                console.log("------------------------------");
                console.log("otherServer > ", other);
                console.log("------------------------------");
            }
            if(other != null){
                // analisa a lista de servidores do server recebido
                for(let i=0; i < other.others.length ; i++){
                    index = server.others.map((el) => { return el }).indexOf(other.others[i]);
                    if(index == null || index < 0){
                        if(server.others != null){
                            server.others.push(other.others[i]);
                        }else{
                            server.others = Array(0);
                            server.others.push(other.others[i]);
                        }          
                        printServerStatus();
                    }
                }
                for (let i = 0; i < other.players.length; i++) {
                    // busca o indice no server local do player (other.players[i])
                    index = server.players.map((el) => { return el.id }).indexOf(other.players[i].id);
                    // se achou verifica os estados
                    if(index != null && index >= 0)
                    {
                        var id_state = parseInt(server.players[index].state_id);
                        var id_state_other = parseInt(other.players[i].state_id);
                        
                        if(id_state < id_state_other){
                            if(devMode){
                                console.log('player local: ' + server.players[index].id);
                                console.log('id_state > ', id_state);
                                console.log('id_state_other > ', id_state_other);
        
                                console.log("estado LOCAL desatualizado. >> atualizando...");
                            }
                            server.players[index].states = other.players[i].states;
                        }
                    }
                    // se não achar adiciona o player ao server local
                    else
                    {
                        if(!other.players[i].removed){
                            console.log("não achou o player > adicionando player");
                            if(server.players!=null){
                                server.players.push(other.players[i]);
                            }else{
                                server.players = Array(0);
                                server.players.push(other.players[i]);
                            }          
                            printServerStatus();
                        }
                        //mergeServers();
                    }
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
        }
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
    player.inativity = 0;
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
    
    console.log("SERVER ONLINE");
    printServerStatus();

    this.interval = setInterval(mergeServers, 100);
    this.inativityInterval = setInterval(inativity, 1000);
}
function inativity()
{
    for (let i = 0; i < server.players.length; i++) 
    {
        server.players[i].inativity += 1;
        if(server.players[i].inativity > 30 && !server.players[i].removed)
        {
            server.players[i].removed = true;
            server.players[i].removedStatus = "INATIVIDADE";
            removePlayer(server.players[i]);
        }
    } 
}
function mergeServers()
{
    for (let i = 0; i < server.others.length; i++) {
        if(server.others[i] != port_){
            var mergesUrl = 'http://localhost:' + server.others[i] + '/merge_status';
            if(devMode)
                console.log("["+port_+"] Tentando merge em :  " + mergesUrl);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if(this.readyState == 4)
                {
                    if (this.status == 200) { 
                        server = JSON.parse(this.responseText);      
                        if(devMode){
                            console.log("Deu boa o merge.");        
                            console.log("this > ", server);
                            console.log("readyState : "+ this.readyState);
                            console.log("------------------------------");             
                            printServerStatus();
                        } 
                    }              
                    else{  
                        if(this.statusText!= null && this.statusText.code == 'ECONNREFUSED'){
                            if(this.statusText.port == server.others[i]){
                                console.log("["+port_+"] Conexão recusada em : "+ this.statusText.port + " removendo da lista..");
                                server.others.splice(i, 1);
                                
                                printServerStatus();
                            }                            
                        }else{
                            console.log("readyState : "+ this.readyState);
                            console.log("status : "+ this.status);
                            console.log("Deu ruim o merge. Erro: " + JSON.stringify(this));
                        }
                        
                    }
                }else{
                    if(devMode){
                        switch(this.readyState){
                            case 0: 
                            console.log("request not initialized");
                            break;
                            case 1: 
                            console.log("server connection established");
                            break;
                            case 2: 
                            console.log("request received");
                            break;
                            case 3: 
                            console.log("processing request");
                            break;
                        }
                    }
                }              
            };           
            xhttp.open("POST", mergesUrl, true);
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
        printAttPlayer(player);
    printServerStatus();
}
function updatePlayer(player, index){  
    var state = new st.State((player.state_id+1), "UPDATE", player);
    player.states.push(state);
    player.state_id++;  
    server.players[index] = player;

    
    //printAttPlayer(player); 
}
function removePlayer(player){
    console.log("Removendo Player -> "+ player.id + " MOTIVO: "+player.removedStatus);
    player.state_id++;
    var state = new st.State((player.state_id), "REMOVE", player);
    player.states.push(state);
    
    index = server.players.map((el) => { return el.id }).indexOf(player.id);
    server.players[index] = player;
    
    // remove de fato o player
    //server.players.splice(player, 1);

    //mergeServers();

    printServerStatus();
    //if(devMode)
    //printAttPlayer(player); 
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
       server.players.forEach((el) => { 
            if(!el.removed)
                console.log(el.type + " : " + el.id) 
            else
                console.log(el.type + " : " + el.id + " -> [REMOVED]") 
        });
    }
    console.log("------ ----------- --------");
}