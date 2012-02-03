/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): 
 *  David Burns 
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


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

User.index({ unique: true, dropDups: true });

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

DataProvider.prototype.getAllScores = function(callback){
	var self = this;
  Score.where('user').
        select('user', 'points').
				limit(25).
        run(function(error, docs){
						if (error) throw error;
            callback(self._sortUsers(docs));
          });
};

DataProvider.prototype.getAllScoresForSevenDays = function(callback){
	var self = this
		, now = Date.now()
		, sevenDays = 1000*60*60*24*7;
  Score.where('user').
        select('user', 'points').
				where("created_at").gte(new Date(now.valueOf() - sevenDays)).
				limit(25).
        run(function(error, docs){
						if (error) throw error;
            callback(self._sortUsers(docs));
          });
};

DataProvider.prototype._sortUsers = function(docs){
	var users = {};
	for(var i=0; i < docs.length; i++){
		users[docs[i].user] = users[docs[i].user] + docs[i].points || 1;
	}
	var sortable = [];
	for (var user in users)
		sortable.push([user, users[user]])
		sortable.sort(function(a, b) {return a[1] - b[1]})
	sortable.reverse();

	var sortedUsers = {}
	for (var i=0; i < sortable.length; i++){
		sortedUsers[sortable[i][0]] = sortable[i][1];
	}
	return sortedUsers
}

DataProvider.prototype.getGame = function(game, callback){
  console.log("DataProvider.getGame has been called");
  Games.findOne({name: game}, function (err, gameName){
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

