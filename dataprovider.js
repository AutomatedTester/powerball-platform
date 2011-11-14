var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/powerball');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var User = new Schema({
    name: String
  , token : String
  , key : String
  , created_at : Date
});

mongoose.model('user', User);
var User = mongoose.model('user');

var DataProvider = function(){};

DataProvider.prototype.findUser= function(user, callback) {
  console.log("DataProvider.findUser has been called");
  User.findOne({name:user}, function (err, user) {
    if (!err) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

DataProvider.prototype.putUser = function(params, callback) {
  console.log("DataProvider.putUser has been called");
  this.findUser(params['name'], function(err, user){
    if (!user){
      var post = new User({name: params['name'],
        oauthAccessToken : params['oauthAccessToken'],
        oauthAccessTokenSecret: params['oauthAccessTokenSecret'], 
        created_at: new Date()});
  
      post.save(function (err) {
        callback();
      });
    } else {
      callback();
    }
  });
};

DataProvider.prototype.disconnect = function(){
  mongoose.disconnect();
};

exports.DataProvider = DataProvider;
exports.User = User;
