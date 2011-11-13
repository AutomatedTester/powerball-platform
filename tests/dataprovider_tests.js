var DataProvider = require('../dataprovider').DataProvider
  , User = require('../dataprovider').User
  , mongoose = require('mongoose')
  , dataProvider; 

module.exports = {
  setUp: function (callback) {
    dataProvider = new DataProvider('localhost', 27017);
    mongoose.connect('mongodb://localhost/powerball');
    callback();
  },

  testThatMultiplePostsOfSameUserOnlyHasOneUser : function(test){
    params = {
              'name': 'tests',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    test.expect(5);
    dataProvider.putUser(params, function(error) {
      test.equal(error, undefined);
      User.count({name: 'tests'}, function(err, count){
          test.equal(count, 1, count);
        
          dataProvider.putUser(params, function(error) {
            test.equal(error, undefined);
            User.count({name: 'tests'}, function(err, count){
              test.equal(err, null);
              test.equal(count, 1, count);
              test.done();
            }); 
          });
      }); 
    })
  },

  testThatWeCanFindUserinDataStore : function(test){
    params = {
            'name': 'userdetails',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

    dataProvider.putUser(params, function(error) {
      dataProvider.findUser("userdetails", function(err, user){
        test.equal(params['name'], user['name']);
        test.done();  
      });
    });
  },

  tearDown: function (callback) {
    User.remove({});
    mongoose.disconnect();
    dataProvider.disconnect();
    callback();
  },
}
