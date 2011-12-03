module.exports = function(app){
  
  var games = {'l10n':1};

  app.get('/games', function(req, res){
    res.render('games', {
        user: req.session.twitterScreenName || req.session.browserid || false,
        title: 'Powerball',
        games: Object.keys(games),
      });
  });

  app.get('/game/:gamename', function(req, res){
    var gameName = req.params.gamename;
    if (!(games.hasOwnProperty(gameName))){ 
      res.render('games', {
        user: req.session.twitterScreenName || req.session.browserid || false,
        title: 'Powerball',
        games: games
      });
    } else {
      res.render('game', {
        user: req.session.twitterScreenName || req.session.browserid || false,
        title: 'Powerball',
        game: gameName,
      });
    }
  });
};
