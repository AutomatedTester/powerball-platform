var server = require('../app.js');

exports.testWeCanLoadLandingPage = function(beforeExit, assert){
  assert.response(server, {
      url: '/',
    } , {
      status: 200,
    }, function(res){
      assert.ok(res.body.indexOf("Welcome") >= 0);
    }
  );
};

exports.testShouldntBeAbleToPostToRoot = function(beforeExit, assert){
  assert.response(server, {
      url: '/',
      method: 'POST',
    }, {
      status: 405,
    }
  );
};

exports.testShouldGet404BecauseURLDoesntExist = function(beforeExit, assert){
  assert.response(server, {
      url: '/omgthiswontexist',
    }, {
      status: 404,
    }, function(res){
      assert.ok(res.body.indexOf("I couldnt find") >= 0);
    }
  );
};

exports.testShouldLoadMainGamesPageByAccessingItDirectly = function(beforeExit, assert){
  assert.response(server, {
      url: '/games',
    }, {
      status: 200,
    }, function(res){
      assert.ok(res.body.indexOf("The following games are available"));
    }
  );
};

exports.testShouldLoadMainGamesPageByAccessingItByGameThatDoesntExist = function(beforeExit, assert){
  assert.response(server, {
      url: '/game/omgthiswontexist',
    }, {
      status: 200,
    }, function(res){
      assert.ok(res.body.indexOf("The following games are available"));
    }
  );
};

exports.testShouldLoadGamePageByAccessingItDirectly = function(beforeExit, assert){
  assert.response(server, {
      url: '/games',
    }, {
      status: 200,
    }, function(res){
      assert.ok(res.body.indexOf("Are the following the same?"));
    }
  );
}; 

exports.testShouldLoadHealthPage = function(beforeExit, assert){
  assert.response(server, {
      url: '/healthcheck',
    }, {
      status: 200,
    }, function(res){
      assert.ok(res.body.indexOf("we are healthy"));
    }
  );
}; 
