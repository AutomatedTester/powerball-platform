var DataProvider = require('../dataprovider').DataProvider;


module.exports = function(app){
  var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    , dataProvider = new DataProvider();

  app.post('/score/:uniqueId/:games', function(req, res, next){
    if (req.params.uniqueId){
      dataProvider.findUserById(req.params.uniqueId, function(err, ruser) {
        console.log("err " + err + " ruser " + ruser);
        if (err) {
          res.json(FAILURE);
        } else {
          if (req.params.games){
            res.json(FAILURE);
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
    res.json(FAILURE);
  });

  app.post('/score', function(req, res){
    res.json(FAILURE);
  });
};
