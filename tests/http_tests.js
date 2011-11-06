var server = require('../app.js');

exports.testWeCanLoadLandingPage = function(beforeExit, assert){
  assert.response(server, {
      url: '/',
    }, function(res){
      assert.ok(res.statusCode === 200);
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
    }, function(res){
      assert.ok(res.statusCode === 404);
      assert.ok(res.body.indexOf("I couldnt find") >= 0);
    }
  );
};

exports.testShouldLoadMainGamesPageByAccessingItDirectly = function(beforeExit, assert){
  assert.response(server, {
      url: '/games',
    }, function(res){
      assert.ok(res.statusCode === 200); 
      assert.ok(res.body.indexOf("The following games are available"));
    }
  );
};

exports.testShouldLoadMainGamesPageByAccessingItByGameThatDoesntExist = function(beforeExit, assert){
  assert.response(server, {
      url: '/game/omgthiswontexist',
    }, function(res){
      assert.ok(res.statusCode === 200);
      assert.ok(res.body.indexOf("The following games are available"));
    }
  );
};

exports.testShouldLoadGamePageByAccessingItDirectly = function(beforeExit, assert){
  assert.response(server, {
      url: '/games',
    }, function(res){
      assert.ok(res.statusCode === 200);
      assert.ok(res.body.indexOf("Are the following the same?"));
    } 
  );
}; 

exports.testShouldLoadHealthPage = function(beforeExit, assert){
  assert.response(server, {
      url: '/healthcheck',
    }, function(res){
      assert.ok(res.statusCode === 200);
      assert.ok(res.body.indexOf("we are healthy"));
    }
  );
}; 

exports.testShouldGet404IfUserNotFound = function(beforeExit, assert){
  assert.response(server, {
      url: '/user/omgthiswontexist',
    }, function(res){
      assert.ok(res.statusCode === 404);
      assert.ok(res.body.indexOf("I couldnt find"));
    }
  );
}; 
