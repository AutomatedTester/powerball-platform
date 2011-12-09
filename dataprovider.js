var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//Schemas
var User = new Schema({
    name: String
 // , email: {type: String, unique: true}
  , website: String
  , qmo: String
  , key : String
  , created_at : Date
});

User.index({ first: 1, last: 1 }, { unique: true })

var Score = new Schema({
    user : String
  , game : String
  , points : Number 
  , created_at : Date
});

var Games = new Schema({
    name : { type: String, unique: true, default: "l10n" }
});


// Models
mongoose.model('user', User);
var User = mongoose.model('user');

mongoose.model('score', Score);
var Score = mongoose.model('score');

mongoose.model('games', Games);
var Games = mongoose.model('games'); 

// DataProvider
var DataProvider = function(){
  mongoose.connect('mongodb://localhost/powerball');
};

DataProvider.prototype.findUser= function(user, callback) {
  console.log("DataProvider.findUser has been called");
  User.findOne({name:user}, function (err, ruser) {
    if (!err) {
      callback(null, ruser);
    } else {
      callback(err, null);
    }
  });
};

DataProvider.prototype.findUserById = function(userid, callback){
  console.log("DataProvider.findUserById has been called");
  User.findOne({_id: userid}, function (err, ruserid){
    if (!err) {
      callback(null, ruserid);
    } else {
      callback(err, null);
    }
  });
};

DataProvider.prototype.putUser = function(params, callback) {
  console.log("DataProvider.putUser has been called");
    
      var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
      post.save(function (err) {
        callback(err, post._id);
      });
};

DataProvider.prototype.putScore = function(params, callback){
  console.log("DataProvider.putScore has been called");
  var score = new Score({ 
    user : params.user
    , game : params.game 
    , points : params.points
    , created_at : new Date() });

  score.save(function(err){
    callback(err);
  });
};

DataProvider.prototype.getScore = function(name, callback){
  Score.where('user', name).
        select('points').
        run(callback);
};

DataProvider.prototype.getGame = function(game, callback){
  console.log("DataProvider.getGame has been called");
  Games.findOne({name: game}, function (err, gameName){
    console.log(err);
    if (!err) {
      callback(null, gameName);
    } else {
      callback(err, null);
    }
  });
};

DataProvider.prototype.disconnect = function(){
  mongoose.disconnect();
};


//Exports
exports.DataProvider = DataProvider;
exports.User = User;
exports.Score = Score;
exports.Games = Games;
