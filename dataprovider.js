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

DataProvider = function(){};

DataProvider.prototype.findAll = function(callback) {
  User.find({}, function (err, posts) {
    callback( null, posts )
  });
};

DataProvider.prototype.findById = function(id, callback) {
  User.findOne({name:id}, function (err, post) {
    if (!err) {
      callback(null, post);
    }
  });
};

DataProvider.prototype.putUser = function(params, callback) {
  this.findById(params['name'], function(err, user){
    if (!user){
      var post = new User({name: params['name'],
        oauthAccessToken : params['oauthAccessToken'],
        oauthAccessTokenSecret: params['oauthAccessTokenSecret'], 
        created_at: new Date()});
  
      post.save(function (err) {
        callback();
      });
    }
  });
};

exports.DataProvider = DataProvider;
exports.User = User;
