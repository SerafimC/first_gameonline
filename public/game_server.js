class Server{
    constructor(obj){
        if(obj == null)
        {
            this.players = Array(0);
            this.others = Array(0);
        }
        else
        {
            this.players = obj.players;
            this.others = obj.others;
        }
    }
    insert_player(obj) {
        this.players.push(obj)
    }
    merge_states(obj){
        this.players = obj;
    }
    get_next_port(){
        if(this.others==null)
            return 5000;
        else {
            this.others.sort(function(a, b) {
                return a - b;
              });
            var next_port = 5000;
            var port_ = 5000;
            for (let i = 0; i < this.others.length; i++) {
                if(this.others[i] > port_){
                    next_port =  this.others[i] - 1;
                    return;
                }
                else
                    port_ =  this.others[i];
            }
            if(next_port === 5000)
                next_port = port_ + 1;
            return next_port;
        }
    }
}
module.exports.GameServer = function() {
    return new Server();
}