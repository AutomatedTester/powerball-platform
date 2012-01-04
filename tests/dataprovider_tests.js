var DataProvider = require('../dataprovider').DataProvider
  , User = require('../dataprovider').User
  , Score = require('../dataprovider').Score
  , Games = require('../dataprovider').Games
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
          assert.ok(err == null);
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
    });

    it('should find a user by their id', function(done){
      var params = {
            'name': 'userdetails2',
           // 'email': 'foo@bar.com',
            'oauthAccessToken': 'req.session.oauthAccessToken',
            'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
            };

      dataProvider.putUser(params, function(error) {
        assert.ok(error == null);
        dataProvider.findUser(params.name, function(err, user){
          assert.ok(params['name'] === user['name']);
          dataProvider.findUserById(user._id, function(errs, iduser){
            assert.ok(params.name === iduser.name); 
            done();  
          })
        });
      });
    });
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
    
    it('should return docs of score so can reduce', function(done){
      var params = {
        'user':'testUser2',
        'game':'l10n',
        'points':1
      }
      dataProvider.putScore(params, function(error){
        assert.ok(error == null);
        dataProvider.getScore(params.user, function(err, docs){
          assert.ok(docs.length >= 1);
          assert.ok(docs[0].points == 1);
          done();
        });
      });
    });

    it('should return all users', function(done){
      var params = {
        'user':'testUserLeadboards',
        'game':'l10n',
        'points':1
      }
      dataProvider.putScore(params, function(error){
        assert.ok(error == null);
        dataProvider.getAllScores(function(err, docs){
          assert.ok(docs.length >= 1);
          assert.ok(docs[0].points >= 1);
          done();
        });
      });
    });
  });

  describe('games', function(){
    it('should return the default', function(done){
      var game = new Games();
      game.save(function(err){
        dataProvider.getGame('l10n', function(err, game){
          assert.ok(err === null);
          console.log(JSON.stringify(game));
          assert.ok(game.name === 'l10n');
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
