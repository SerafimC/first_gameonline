const app = require('./config/appConfig.js');
st = require('./public/game_states');

var gamestate = new st.GameState()

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.post('/getstate', function(req, res) {
    res.send(gamestate)
});

app.post('/sendstate', function(req, res) {
    gamestate = req.body
    res.sendStatus(200)
});