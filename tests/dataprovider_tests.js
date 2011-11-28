var DataProvider = require('../dataprovider').DataProvider
  , User = require('../dataprovider').User
  , mongoose = require('mongoose')
  , dataProvider
  , assert = require('assert'); 

describe('DataProvider', function(){
  beforeEach(function(){
    dataProvider = new DataProvider();
    mongoose.connect('mongodb://localhost/powerball');
  });

  describe("Users", function(){
     it('Should only have 1 user if we try post multiple times', function(done){
      var params = {
              'name': 'tests',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
      dataProvider.putUser(params, function(error) {
        assert.ok(error === undefined);
        User.count({name: 'tests'}, function(err, count){
          assert.ok(count === 1, count);
        
          dataProvider.putUser(params, function(error) {
            assert.ok(error === undefined);
            User.count({name: 'tests'}, function(err, count){
              assert.ok(err == null);
              assert.ok(count === 1, count);
              done();
            }); 
          });
        }); 
      })
    })

    it('Should Can Find User in DataStore ', function(done){
      var params = {
            'name': 'userdetails',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

      dataProvider.putUser(params, function(error) {
        dataProvider.findUser("userdetails", function(err, user){
          assert.ok(params['name'] === user['name']);
          done();  
        });
      });
    })

  });

  afterEach(function(){
    User.remove({});
  });
});
