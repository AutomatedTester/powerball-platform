//var DataProvider = require('../dataprovider').DataProvider;


module.exports = function(app){
  app.post('/score/:uniqueId/:games', function(req, res, next){
    if (req.params.uniqueId){
      if (req.params.games){
      
      } else {
        next(); 
      }
    } else {
      next();
    }
  }); 

  app.post('/score', function(req, res){
    res.json({
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    });
  });
};
