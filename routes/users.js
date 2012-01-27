var DataProvider = require('../dataprovider').DataProvider;

module.exports = function(app){
  var dataProvider = new DataProvider();

  app.get('/user/:name', function(req, res, next){
    dataProvider.findUser(req.params.name, function(error, user) {
      if (user){
        dataProvider.getScore(user.name, function(error, results){
          if (error) console.error(error);
          console.log(JSON.stringify(results));
          var score = 0;
          for (var i=0;i < results.length; i++){
            score += results[i].points;
          }
          res.render('user', {
            user: req.session.powerballUser || false,
            userProf : user.name,
            userId: req.session.powerballUser === user.name ? user._id : false,
            score: req.session.score || score,
            title: 'Powerball'
          });
        });
      } else {
        next();
      }
    });
  });

  app.get('/user/id/:userId', function(req, res, next){
    dataProvider.findUserById(req.params.userId, function(err, user){
      if (err) console.error(err);
      if (user){
        res.redirect("/user/" + user.name, 301);
      } else {
        next();
      }
    });
  });
};
