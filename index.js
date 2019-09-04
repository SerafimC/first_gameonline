const app = require('./config/appConfig.js');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});