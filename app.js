
/**
 * Module dependencies.
 */

var express = require('express')
  , Oauth = OAuth = require('oauth').OAuth
  , sys = require('sys')
  , fs = require('fs')
  , RedisStore = require('connect-redis')
  , DataProvider = require('./dataprovider').DataProvider;

var conkey
  , consecret;

fileContents = fs.readFileSync("secret.txt", "UTF-8")
detail = fileContents.split('\n');
conkey = detail[0];
consecret = detail[1];


var app = module.exports = express.createServer();
var RedisStore = require('connect-redis')(express);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'showMeTheMoney', store: new RedisStore }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    console.error(err.stack);
    res.render('500', {title: 'Powerball',
        status: err.status || 500
      , error: err
    });
  });
  app.use(function(req, res, next){
    // the status option, or res.statusCode = 404
    // are equivalent, however with the option we
    // get the "status" local available as well
    console.error("Url " + req.url + " was not found");
    res.render('404', { title: 'Powerball', status: 404, url: req.url });
  });
});

var oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 conkey, consecret, 
                 "1.0A", 'http://myloadbalancer-1097051438.us-east-1.elb.amazonaws.com//sessions/callback', "HMAC-SHA1");

var dataProvider = new DataProvider('localhost', 27017);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
res.render('index', {
    user: req.session.twitterScreenName,
    title: 'Powerball'
  });
});

app.get('/user/:name', function(req, res){
  dataProvider.findById(req.params.name, function(error, user) {
    if (user){
      res.render('user', {
        user: user.name || '',
        title: 'Powerball'
      });
    } else {
      res.render('404', { title: 'Powerball', status: 404, url: req.url });
    }
  });
});

var games = {'l10n':1};

app.get('/games', function(req, res){
  res.render('games', {
      user: req.session.twitterScreenName,
      title: 'Powerball',
      games: games.keys()
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

app.get('/twitter', function(req, res){
  oa.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      console.error(error);
      res.redirect('/500');
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
    }
  });
})
  

app.get('/sessions/callback', function(req, res){
  oa.getOAuthAccessToken(req.session.oauthRequestToken, 
                        req.session.oauthRequestTokenSecret, 
                        req.query.oauth_verifier, 
  function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      console.error(error);
      res.redirect('/500');
    } else {
      // TODO(David) Push oauthAccessToken and oauthAccessTokenSecret to datastore for offline use
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

      // Right here is where we would write out some nice user stuff
      oa.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          console.error(error);
          res.redirect('/500');
        } else {
          data1 = JSON.parse(data);
          params = {
            'name': data1["screen_name"].toLowerCase(),
            'oauthAccessToken': req.session.oauthAccessToken,
            'oauthAccessTokenSecret': req.session.oauthAccessTokenSecret,
            };

          dataProvider.save(params, function( error, docs) {
          });
          

          req.session.twitterScreenName = data1["screen_name"];
          res.redirect('/');
        }
      });
    }
  });
});

app.get('/404', function(req, res, next){
  next();
});

app.get('/403', function(req, res, next){
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

app.get('/500', function(req, res, next){
  next(new Error('keyboard cat!'));
});

app.get('/healthcheck', function(req, res){
  res.render('healthcheck', {
    user: req.session.twitterScreenName,
    title: 'Powerball'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
