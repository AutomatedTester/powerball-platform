module.exports = function(app){
  
  var games = {'l10n':1};

  app.get('/games', function(req, res){
    res.render('games', {
        user: req.session.twitterScreenName,
        title: 'Powerball',
        games: Object.keys(games),
      });
  });

  app.get('/game/:gamename', function(req, res){
    var gameName = req.params.gamename;
    if (!(gameName in games)){ 
      res.render('games', {
        user: req.session.twitterScreenName,
        title: 'Powerball',
        games: games
      });
    } else {
      res.render('game', {
        user: req.session.twitterScreenName,
        title: 'Powerball',
        game: gameName,
      });
    }
  });
}
