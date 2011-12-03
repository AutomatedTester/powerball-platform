
/**
 * Module dependencies.
 */

var express = require('express')
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
    res.render('404', { title: 'Powerball', user: false, status: 404, url: req.url });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('extend-index', {
    user: req.session.twitterScreenName || req.session.browserid || false,
    title: 'Powerball'
  });
});

app.post('/', function(req, res){
  res.send(405);
});

require('./routes/users')(app);
require('./routes/games')(app);
require('./routes/twitter')(app);
require('./routes/browserid')(app);

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
    user: false,
    title: 'Powerball'
  });
});

app.listen(3000);
