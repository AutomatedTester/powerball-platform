var http = require('http')
  , assert = require('assert')
  , server = require('../app')
  , User = require('../dataprovider').User
  , Games = require('../dataprovider').Games;

describe('server', function(){
  
  beforeEach(function(){
    //
  });
  
  it('should allow access to /', function(done){
      http.get({ path: '/', port: 3000 }, function(res){
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("Welcome") >= 0);
        done();
      });
    });
  });
  
  it('should allow access to /robots.txt', function(done){
      http.get({ path: '/robots.txt', port: 3000 }, function(res){
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        done();
      });
    });
  });

  it('Shouldnt Be Able To Post To Root', function(done){
    var req = http.request({ path: '/', port: 3000, method: "POST" }, function(res) {
      assert.ok(res.statusCode === 405);
      done();
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
  });

  it('should get a 404 when URL doesnt exist', function(done){
      http.get({ path: '/omgThisWontExist', port: 3000 }, function(res){
      assert.ok(res.statusCode === 404);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("I couldnt find") >= 0);
        done();
      });
    });
  });

  it('should load main games page', function(done){
      http.get({ path: '/games', port: 3000 }, function(res){
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("The following games are available") >= 0);
        done();
      });
    });
  });

  it('should load main games page by accessing a game that doesnt exist', function(done){
      http.get({ path: '/game/omgthiswontexist', port: 3000 }, function(res){
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("The following games are available") >= 0);
        done();
      });
    });
  });

  it('should load main game', function(done){
      http.get({ path: '/game/l10n', port: 3000 }, function(res){
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("Are the following the same?") >= 0);
        done();
      });
    });
  });

  it('should load health page', function(done){
      http.get({ path: '/healthcheck', port: 3000 }, function(res){
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("we are healthy") >= 0);
        done();
      });
    });
  });

  it('should get 404 if user is not found', function(done){
      http.get({ path: '/user/omgthiswontexist', port: 3000 }, function(res){
      assert.ok(res.statusCode === 404);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("I couldnt find /user/omgthiswontexist", buf) >= 0);
        done();
      });
    });
  });

  it('should find the user by name', function(done){

    var params = {
              'name': 'testsUserWillExist',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/powerball');

    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
    post.save(function (err) {
      var req = http.get({ path: '/user/testsUserWillExist', port: 3000 }, function(res) {
        assert.ok(res.statusCode === 200);
        var buf = '';
        res.on('data', function(chunk){
          buf += chunk
        });
        res.on('end', function(){
          assert.ok(buf.indexOf("testsUserWillExist"));
          done();
        });
      });
    }); 
  });

  it('should find a user if we access /user/id/:userID', function(done){
    var params = {
              'name': 'testsSearchById',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/powerball');

    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
    post.save(function (err) {
      var req = http.get({ path: '/user/id/' + post._id, port: 3000 }, function(res) {
        assert.ok(res.statusCode === 301, res.statusCode);
        var buf = '';
        res.on('data', function(chunk){
          buf += chunk
        });
        res.on('end', function(){
          assert.ok(buf.indexOf("testsUserWillExist"));
          done();
        });
      });
    }); 
  });

  it('should find not user if we access /user/id/:userID and the user ID does exist', function(done){
    var params = {
              'name': 'testsSearchById',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/powerball');

    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
    post.save(function (err) {
      var req = http.get({ path: '/user/id/' + post._id + "1", port: 3000 }, function(res) {
        assert.ok(res.statusCode === 404, res.statusCode);
        var buf = '';
        res.on('data', function(chunk){
          buf += chunk
        });
        res.on('end', function(){
          assert.ok(buf.indexOf("testsUserWillExist"));
          done();
        });
      });
    }); 
  });

  it('should get 200 and a message saying it failed when calling /score', function(done){
    var req = http.request({ path: '/score', port: 3000, method: "POST" }, function(res) {
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){
        buf += chunk
      });
      res.on('end', function(){
        var result = JSON.parse(buf);
        assert.ok(result.result === "failure");
        done();
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
  });

  it('should get a 200 and a message saying failure when calling /score/foo', function(done){
    var req = http.request({ path: '/score/foo', port: 3000, method: "POST" }, function(res) {
      assert.ok(res.statusCode === 200);
      var buf = '';
      res.on('data', function(chunk){
        buf += chunk
      });
      res.on('end', function(){
        var result = JSON.parse(buf);
        assert.ok(result.result === "failure");
        done();
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();
  });

  it('should error if it cant find the id in datastore', function(done){
    var params = {
              'name': 'tests2',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/powerball');

    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
    post.save(function (err) {
      var req = http.request({ path: '/score/foo/l10n', port: 3000, method: "POST" }, function(res) {
        assert.ok(res.statusCode === 200);
        var buf = '';
        res.on('data', function(chunk){
          buf += chunk
        });
        res.on('end', function(){
          var result = JSON.parse(buf);
          console.log(result);
          assert.ok(result.result === "failure");
          done();
        });
      });

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      // write data to request body
      req.write('data\n');
      req.write('data\n');
      req.end();
    }); 
  });

  it('should error if it cant find the id in datastore when passed a value similar to an id', function(done){
    var params = {
              'name': 'tests2',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/powerball');

    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
    post.save(function (err) {
      var req = http.request({ path: '/score/4ef1ea4feb3ba9ab99000001/l10n', port: 3000, method: "POST" }, function(res) {
        assert.ok(res.statusCode === 200);
        var buf = '';
        res.on('data', function(chunk){
          buf += chunk
        });
        res.on('end', function(){
          var result = JSON.parse(buf);
          assert.ok(result.result === "failure");
          done();
        });
      });

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      // write data to request body
      req.write('data\n');
      req.write('data\n');
      req.end();
    }); 
  });

  it('should pass and look the game up in the datastore', function(done){
    var params = {
              'name': 'tests123',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    
    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
    post.save(function (err) {
      var games = new Games();
      games.save(function(err2){
        var path = '/score/' + post._id + '/l10n'
        , req = http.request({ path: path , port: 3000, method: "POST" }, function(res) {
            assert.ok(res.statusCode === 200);
          
          var buf = '';
          res.on('data', function(chunk){
            buf += chunk
          });
          res.on('end', function(){
            var result = JSON.parse(buf);
            assert.ok(result.result === "success");
            done();
          });
        });
  
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });
          // write data to request body
        req.write('data\n');
        req.write('data\n');
        req.end();
      });
    });
  });

  it('should fail when I look the game up in the datastore and its not there', function(done){
    var params = {
              'name': 'tests13',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    
    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
    post.save(function (err) {
      var games = new Games();
      games.save(function(err2){
        var path = '/score/' + post._id + '/foobar'
        , req = http.request({ path: path , port: 3000, method: "POST" }, function(res) {
            assert.ok(res.statusCode === 200);
          
          var buf = '';
          res.on('data', function(chunk){
            buf += chunk
          });
          res.on('end', function(){
            var result = JSON.parse(buf);
            assert.ok(result.result === "failure");
            done();
          });
        });
  
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });
          // write data to request body
        req.write('data\n');
        req.write('data\n');
        req.end();
      });
    });
  });

  it('should insert a score into the datastore ', function(done){
    var params = {
              'name': 'tests173',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    
    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
    post.save(function (err) {
      var games = new Games();
      games.save(function(err2){
        var path = '/score/' + post._id + '/l10n'
        , req = http.request({ path: path , port: 3000, method: "POST" }, function(res) {
            assert.ok(res.statusCode === 200);
          
          var buf = '';
          res.on('data', function(chunk){
            buf += chunk
          });
          res.on('end', function(){
            var result = JSON.parse(buf);
            assert.ok(result.result === "success");
            assert.ok(result.message === "score locked away in the datastore");
            done();
          });
        });
  
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });
          // write data to request body
        req.write('{"points":"1"}');
        req.end();
      });
    });
  });
  
  it('should load the leaderboard page', function(done){
    var params = {
              'name': 'testingLeadboard',
              'oauthAccessToken': 'req.session.oauthAccessToken',
              'oauthAccessTokenSecret': 'req.session.oauthAccessTokenSecret',
              };
    
    var post = new User({
        name: params.name
        , oauthAccessToken : params.oauthAccessToken
        , oauthAccessTokenSecret: params.oauthAccessTokenSecret
        , created_at: new Date()});
  
    post.save(function (err) {
      var games = new Games();
      games.save(function(err2){
        var path = '/score/' + post._id + '/l10n'
        , req = http.request({ path: path , port: 3000, method: "POST" }, function(res) {
            assert.ok(res.statusCode === 200);
          
          var buf = '';
          res.on('data', function(chunk){
            buf += chunk
          });
          res.on('end', function(){
            var result = JSON.parse(buf);
            assert.ok(result.result === "success");
            assert.ok(result.message === "score locked away in the datastore");
            http.get({ path: '/leaderboards', port: 3000 }, function(res){
              assert.ok(res.statusCode === 200);
              var buf = '';
                res.on('data', function(chunk){buf += chunk});
                res.on('end', function(){
                  assert.ok(buf.indexOf("The Leaderboard of who has been scoring the most.") >= 0);
                  done();
                });
              });
          });
        });
        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });
          // write data to request body
        req.write('{"points":"1"}');
        req.end();
      });
    });
  });

  it('should load the main leaderboard when the game doesnt exist', function(done){
    http.get({ path: '/leaderboards/omgthiswontexist', port: 3000 }, function(res){
      assert.ok(res.statusCode === 301);
      var buf = '';
      res.on('data', function(chunk){buf += chunk});
      res.on('end', function(){
        assert.ok(buf.indexOf("Redirecting to ") >= 0);
        done();
      });
    });
  });
});
