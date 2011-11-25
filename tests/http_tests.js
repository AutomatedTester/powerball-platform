var server = require('../app');
var http = require('http');
var assert = require('assert');

describe('server', function(){
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
        assert.ok(buf.indexOf("I couldnt find") >= 0);
        done();
      });
    });
  });
});
