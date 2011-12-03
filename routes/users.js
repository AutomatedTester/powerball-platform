var DataProvider = require('../dataprovider').DataProvider;

module.exports = function(app){
  var dataProvider = new DataProvider();

  app.get('/user/:name', function(req, res, next){
    dataProvider.findUser(req.params.name, function(error, user) {
      if (user){
        res.render('user', {
          user: req.session.twitterScreenName || req.session.browserid || false,
          userProf : user.name,
          title: 'Powerball'
        });
      } else {
        next();
      }
    });
  });
};
