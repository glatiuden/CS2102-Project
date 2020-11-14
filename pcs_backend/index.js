var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var bodyParser = require('body-parser');
var query_model = require('./query_model');
var createSubscriber = require('pg-listen');
const { cn } = require('./connection');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// NOTIFICATION CODE
let map = new Map();
const subscriber = createSubscriber(cn);
subscriber.connect();
subscriber.listenTo("accepted_channel");
subscriber.notifications.on("accepted_channel", (bid) => {
    console.log("Received notification", bid);

    if (map.has(bid.po_email)) {
        map.get(bid.po_email).push(bid.pet_name);
    } else {
        map.set(bid.po_email, [bid.pet_name]);
    }
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.get("/notification/:poemail", function (req, res) {
    const po_email = req.params.poemail;
    let arr = map.get(po_email);
    if (arr && arr.length > 0) {
        let petname = arr.pop();
        let message = `Your bid for ${petname} has been accepted!`
        res.status(200).send(message);
    } else {
        res.status(200).send("none");
    }
})

app.post("/procedure/:statement", function (req, res) {
    const statement = req.params.statement;
    const { body } = req;
    console.log(body);
    query_model.callProcedure(statement, body ? body : []).then(response => {
        res.status(200).send(response);
    })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.post("/function/:statement", function (req, res) {
    const statement = req.params.statement;
    const { body } = req;
    console.log(body);
    query_model.callFunction(statement, body ? body : []).then(response => {
        res.status(200).send(response);
    })
        .catch(error => {
            res.status(500).send(error.message);
        })
});

app.post("/query", function (req, res) {
    const { body } = req;
    const { command, table_name, columns, values } = body;
    query_model.callQuery(command, table_name, columns, values).then(response => {
        res.status(200).send(response);
    })
        .catch(error => {
            res.status(500).send(error);
        })
});

app.get('/', function (request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});
