const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/Tutorial";
const port = 3000;

app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/heartbeat', (req, res) => res.status(200));

app.post('/tasks/new', (req, res, next) => {
  mongoClient.connect(url, (error, db) => {
    if (!error) {
      db.createCollection('tasks', (error, data) => {
        if (error) res.status(500).send(`<h1>${error}</h1>`)
        else {
          data.insert({ description: req.body.description });
          res.status(200).sendFile(__dirname + '/index.html')
        }
      });
    } else console.log(error);
  });
});

app.get('/tasks', (req, res) => {
  mongoClient.connect(url, (error, db) => {
    if (!error) {
      db.collection('tasks').find({}).toArray((error, results) => {
        if (error) return false;
        res.send(JSON.stringify(results));
        res.end();
      });
    } else console.log('error while getting tasks from DB :', error);
  });
});

app.post('/tasks/update/:id', (req, res) => {
  mongoClient.connect(url, (error, db) => {
    db.collection('tasks').update({ _id: new ObjectId(req.params.id) }, { $set: { description: req.body.description } });
  });
});

app.get('*', (req, res) => {
  res.status(200).sendFile(__dirname + '/index.html');
});

app.listen(port, (err) => {
  if (err) return console.error(`Server is not getting up :`, err);
  return console.log(
    `Server up and running on http://localhost:${port} 😎`,
  );
});
