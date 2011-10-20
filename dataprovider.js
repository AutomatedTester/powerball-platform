var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


var DataProvider = function(host, port){
  this.db = new Db('powerball', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

DataProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, userCollection) {
    if( error ){
      callback(error);
    }
    else {
      callback(null, userCollection);
    }
  });
};

DataProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({
          _id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)
          }, function(error, result) {
          if( error ) {
            callback(error)
          }
          else { 
            callback(null, result)
          }
        });
      }
    });
};

DataProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          article.created_at = new Date();
          if( article.comments === undefined ) article.comments = [];
          for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
          }
        }

        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};


exports.DataProvider = DataProvider;
