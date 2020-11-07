var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var query_model = require('./query_model');
var createSubscriber = require('pg-listen');
const { cn } = require('./connection');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const subscriber = createSubscriber(cn);
subscriber.notifications.on("accepted_channel", (payload) => {
    console.log("Received notification", payload);
});
subscriber.connect();
subscriber.listenTo("accepted_channel");

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.post("/procedure/:statement", function (req, res) {
    const statement = req.params.statement;
    const { body } = req;
    console.log(body);
    query_model.callProcedure(statement, body ? body : []).then(response => {
        res.status(200).send(response);
    })
        .catch(error => {
            res.status(500).send(false);
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
            console.log(error);
            res.status(500).send(false);
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
