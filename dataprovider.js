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

//Find all posts
DataProvider.prototype.findAll = function(callback) {
  User.find({}, function (err, posts) {
    callback( null, posts )
  });
};

//Find post by ID
DataProvider.prototype.findById = function(id, callback) {
  user = id;
  User.findOne(id, function (err, post) {
    if (!err) {
      callback(null, post);
    }
  });
};

//Update post by ID
DataProvider.prototype.updateById = function(id, body, callback) {
  User.findById(id, function (err, post) {
    if (!err) {
user.title = body.title;
user.body = body.body;
user.save(function (err) {
callback();
});
}
  });
};

//Create a new post
DataProvider.prototype.save = function(params, callback) {
  var post = new User({name: params['name'],
    oauthAccessToken : params['oauthAccessToken'],
    oauthAccessTokenSecret: params['oauthAccessTokenSecret'], 
    created_at: new Date()});
  post.save(function (err) {
    callback();
  });
};



exports.DataProvider = DataProvider;

