function Player(width, height, color, x, y, type) {


    this.uuidv4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

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

    this.update = function(id, safe, type, width, height) {
        this.id = id;
        this.safe = safe;
        this.type = type;
        this.width = width;
        this.height = height;
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

        // teste se está na safe-zone
        if (((mybottom) > 100) && ((mytop) < 180) && ((myright) > 12) && ((myleft) < 80)) {
            this.safe = true;
        } else {
            this.safe = false;
        }

        return crash;
    }

}