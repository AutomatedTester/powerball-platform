var DataProvider = require('../dataprovider').DataProvider;


module.exports = function(app){
  
  var dataProvider = new DataProvider();

  app.post('/score/:uniqueId/:games', function(req, res, next){
    var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    if (req.params.uniqueId){
      dataProvider.findUserById(req.params.uniqueId, function(err, ruser) {
        if (err) {
          res.json(FAILURE);
        } else {
          if (req.params.games){
            dataProvider.getGame(req.params.games, function(err, games){
              if (err){
                res.json(FAILURE);
              } else {
                if (games){
                  var data = req.body; 
                  dataProvider.putScore({user: ruser.name, game: games.name, points:data.points} , function(err){
                    if (!err) {
                      FAILURE.result = 'success';
                      FAILURE.message = 'score locked away in the datastore';
                      res.json(FAILURE);
                    } else {
                      res.json(FAILURE);
                    }
                  });
                } else {
                  res.json(FAILURE);
                }
              }
            });
          } else {
            res.json(FAILURE);
          }
        }
      });
    } else {
      res.json(FAILURE);
    }
  }); 

  app.post('/score/:doesntMatter', function(req, res){
    var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    res.json(FAILURE);
  });

  app.post('/score', function(req, res){
    var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    res.json(FAILURE);
  });
};
