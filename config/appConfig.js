//=======================================
//        PACKAGES DEFINITION
//=======================================
const bodyParser = require("body-parser");
const express = require('express')
const port = process.env.PORT || 5000
const router = express.Router();
const app = module.exports = express();
//=======================================

const allowCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
}
app.use(allowCors);

app.disable("x-powered-by");

app.use('/', router);
app.use('/static', express.static('public'));

const server = app.listen(port);
console.log('Server running on port ' + port);