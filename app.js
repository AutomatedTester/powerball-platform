
/**
 * Module dependencies.
 */

var express = require('express')
  , Oauth = OAuth = require('oauth').OAuth
  , sys = require('sys')
  , fs = require('fs')
  , RedisStore = require('connect-redis');


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
    res.render('500', {title: 'Powerball',
        status: err.status || 500
      , error: err
    });
  });
  app.use(function(req, res, next){
    // the status option, or res.statusCode = 404
    // are equivalent, however with the option we
    // get the "status" local available as well
    res.render('404', { title: 'Powerball', status: 404, url: req.url });
  });
});

var oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 'conkey', 'consecret', 
                 "1.0A", 'http://107.20.218.129/sessions/callback', "HMAC-SHA1");

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
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


// Routes

app.get('/', function(req, res){
  if(!req.session.oauthAccessToken) {
    res.redirect("/twitter");
  } else {
    res.render('index', {
      title: 'Powerball'
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
          // TODO(David) store user details to create profile
          req.session.twitterScreenName = data1["screen_name"];
          res.send('You are signed in: ' + req.session.twitterScreenName + ' or ' + data1["screen_name"]);
        }
      });
    }
  });
});

app.get('/healthcheck', function(res, req){
  res.send(200);
});
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
