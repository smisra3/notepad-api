const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/Tutorial";

app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/tasks/new', function (req, res) {
    mongoClient.connect(url, function (error, db) {
        if (!error) {
            let tasks = db.createCollection('tasks', function (error, data) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("tasks collection created");
                    data.insert({
                        description: req.body.description
                    });
                }
            });
        } else {
            console.log(error);
        }
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    res.end();
});

app.get('/tasks', function (req, res) {
    mongoClient.connect(url, function (error, db) {
        if(!error) {
            let tasks = db.collection('tasks');
            tasks.find({}).toArray(function(error, results) {
                res.send(JSON.stringify(results));
                console.log('data sent');
            })
        } else {
            console.log('error is :', error);
        }
    });
});

app.listen(3000);