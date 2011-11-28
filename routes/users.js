var DataProvider = require('../dataprovider').DataProvider;

module.exports = function(app){
  var dataProvider = new DataProvider('localhost', 27017);

  app.get('/user/:name', function(req, res, next){
    dataProvider.findUser(req.params.name, function(error, user) {
      if (user){
        res.render('user', {
          user: user.name,
          title: 'Powerball'
        });
      } else {
        next();
      }
    });
  });
}
