const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/Tutorial";
const port = 3001;

app.use('/', express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/heartbeat', (req, res) => res.status(200));

app.get('/tasks', (req, res) => {
  mongoClient.connect(url, async (error, db) => {
    if (!error) {
      const results = await db.collection('tasks').find({}).toArray();
      res.send(JSON.stringify(results));
      res.end();
    } else console.log('error while getting tasks from DB :', error);
  });
});

app.get('/:id', (req, res, next) => { // this to be used by user
  if (!req.params.id) {
    const aaa = Math.random();
    res.status(300).redirect(`/${aaa}`);
  }
  mongoClient.connect(url, async (error, db) => {
    if (!error) {
      const predicate = req.params.id ? { description: req.params.id } : {};
      const results = await db.collection('tasks').find(predicate).toArray();
      res.send(JSON.stringify(results));
      res.end();
    } else console.log('error while getting tasks from DB :', error);
  });
});

app.get('/tasks/:id', (req, res) => {
  mongoClient.connect(url, async (error, db) => {
    if (!error) {
      const predicate = req.params.id ? { description: req.params.id } : {};
      const results = await db.collection('tasks').find(predicate).toArray();
      res.send(JSON.stringify(results));
      res.end();
    } else console.log('error while getting tasks from DB :', error);
  });
});

app.post('/tasks', (req, res, next) => {
  mongoClient.connect(url, (error, db) => {
    if (!error) {
      db.createCollection('tasks', (error, data) => {
        if (error) res.status(500).send(`<h1>${error}</h1>`)
        else {
          const { description, } = req.body;
          data.insert({ description });
          res.status(200).sendFile(__dirname + '/index.html')
        }
      });
    } else console.log(error);
  });
});

app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user')
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
