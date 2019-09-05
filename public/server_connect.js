var request = require('request');
var options = {
    url: '',
    prefix: 'http://localhost:5000/getstate',
    suffix: '',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SerafimC'
    }
};

exports.getGameState = (req, res) => {
    return new Promise(resolve => {
        options.suffix = 'users?since=' + req.query.since
        options.url = options.prefix + options.suffix
        request(options, function(error, response, body) {
            resolve(response)
        });
    });
}