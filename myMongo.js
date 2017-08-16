var mongodb = require('mongodb');
var exports = module.exports = {};

var MongoClient = mongodb.MongoClient;
var dbUrl = process.env.MONGOLAB_URI;


function findUrl(url, callback) {
    MongoClient.connect(dbUrl, (err, db) => {
        if (err) throw err;

        db.collection('shortUrls').find({
            original_url: url
        }).toArray((err, docs) => {
            if (err) throw err;

            db.close();
            callback(null, docs);
        })
    })
}

function findId(id, callback) {
    MongoClient.connect(dbUrl, (err, db) => {
        if (err) throw err;

        db.collection('shortUrls').find({
            id: Number(id)
        }).toArray((err, docs) => {
            if (err) throw err;

            db.close();
            callback(null, docs);
        })
    })
}

function idList(callback) {
    MongoClient.connect(dbUrl, (err, db) => {
        if (err) throw err;

        db.collection('shortUrls').find({

        }).toArray((err, docs) => {
            if (err) throw err;
            var newDocs = [];
            for(var i=0; i< docs.length; i++){
              newDocs.push(docs[i]["id"]);
            }
            db.close();
            callback(null, newDocs);
        })
    })
}

function addUrl(url, callback) {

    idList((err, data) => {
        var isPresent = true;
        var _id;
        while(isPresent){
          _id = Math.floor(1000 + Math.random() * 9000);
          if(data.indexOf(_id) <= -1){
            isPresent = false;
          }
        }
        var main = {
            original_url: url,
            id: _id
        }

        MongoClient.connect(dbUrl, (err, db) => {
            if (err) throw err;

            db.collection('shortUrls').insert(main, (err, data) => {
                if (err) throw err;

                db.close();
                callback(null, main);
            })
        })
    })

}

exports.addNewUrl = function (url, callback) {

    findUrl(url, (err, data) => {
        if (err) throw err;

        if (data.length === 0) {
            console.log("url not found");
            addUrl(url, (err, obj) => {
                if (err) throw err;

                callback(null, obj);
            })
        } else {
            console.log("url found");
            callback(null, data[0]);
        }
    })
}

exports.findUrlById = function (id, callback) {

    findId(id, (err, data) => {
        if (err) throw err;

        if (data.length === 0) {
            console.log("id not found");
            callback(null, "No URL found with that ID");
        } else {
            console.log("id found!");
            callback(null, data[0]);
        }
    })
}