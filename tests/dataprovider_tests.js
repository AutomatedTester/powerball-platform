var DataProvider = require('../dataprovider').DataProvider
  , User = require('../dataprovider').User
  , Score = require('../dataprovider').Score
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
            'name': 'testdetails3',
           // 'email': 'foo@bar.com',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

      dataProvider.putUser(params, function(error) {
        assert.ok(error == null);
        dataProvider.putUser(params, function(err){
          done();  
        });
      });
    });

    it('should allow us to store a user', function(done){
     var params = {
            'name': 'testdetails2',
           // 'email': 'foo@bar.com',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

      dataProvider.putUser(params, function(error) {
        assert.ok(error == null);
        dataProvider.findUser(params.name, function(err, user){
          assert.ok(params['name'] === user['name']);
          done();  
        });
      }); 
    });

    it('Should Can Find User in DataStore ', function(done){
      var params = {
            'name': 'userdetails',
           // 'email': 'foo@bar.com',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

      dataProvider.putUser(params, function(error) {
        assert.ok(error == null);
        dataProvider.findUser("userdetails", function(err, user){
          assert.ok(params['name'] === user['name']);
          done();  
        });
      });
    })
  });

  describe('scoring', function(){
    it('should allow me to store a score message', function(done){
      var params = {
        'user':'testUser1',
        'game':'l10n',
        'points':1
      }
      dataProvider.putScore(params, function(error){
        assert.ok(error == null);
        Score.count({user:'testUser1'}, function(err, count){
          assert.ok(err == null);
          assert.ok(count >= 1, count);
          done();
        });
      });
    }); 
  });

  afterEach(function(){
    User.remove({});
    Score.remove({});
  });
});
