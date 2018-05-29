const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/tutorials";

mongoClient.connect(url, function(error,db) {
    error ? console.log(error) : console.log("DB Connected bruh!!");
})