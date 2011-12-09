var DataProvider = require('../dataprovider').DataProvider;

module.exports = function(app){
  var dataProvider = new DataProvider();

  app.get('/user/:name', function(req, res, next){
    dataProvider.findUser(req.params.name, function(error, user) {
      if (user){
        res.render('user', {
          user: req.session.powerballUser || false,
          userProf : user.name,
          userId: req.session.powerballUser === user.name ? user._id : false,
          score: req.session.score || 0,
          title: 'Powerball'
        });
      } else {
        next();
      }
    });
  });
};
