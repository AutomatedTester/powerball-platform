var DataProvider = require('../dataprovider').DataProvider;
var User = require('../dataProvider').User;
var mongoose = require('mongoose');

var dataProvider = new DataProvider('localhost', 27017);

mongoose.connect('mongodb://localhost/powerball');

exports.testThatMultiplePostsOfSameUserOnlyHasOneUser = function(beforeExit, assert){
  params = {
            'name': 'tests',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

  dataProvider.putUser(params, function(error) {
    assert.isUndefined(error);
    User.count({name: 'tests'}, function(err, count){
        assert.eql(count, 1, count);
        
        dataProvider.putUser(params, function(error) {
          assert.isUndefined(error);
          User.count({name: 'tests'}, function(err, count){
            assert.isNull(err);
            assert.eql(count, 1, count);
            User.remove({});
          }); 
        });
    }); 
  });
};

exports.testThatWeCanFindUserinDataStore = function(beforeExit, assert){
  params = {
            'name': 'userdetails',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

  dataProvider.putUser(params, function(error) {
    dataProvider.findUser("userdetails", function(err, user){
      assert.isDefined(user);
    }); 
  });
}
