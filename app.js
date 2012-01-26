/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): 
 *  David Burns 
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

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
  //app.use(express.logger());
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
        user: false,
        userId: '',
        status: err.status || 500
      , error: err
    });
  });
  app.use(function(req, res, next){
    // the status option, or res.statusCode = 404
    // are equivalent, however with the option we
    // get the "status" local available as well
    console.error("Url " + req.url + " was not found");
    res.render('404', { title: 'Powerball', 
        user: req.session.powerballUser || false, 
        userId: req.session.userId || '',
        score: req.session.score || 0,
        status: 404, 
        url: req.url,
    });
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
  res.render('index', {
    user: req.session.powerballUser || false,
    userId: req.session.userId || '',
    score: req.session.score || 0,
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
require('./routes/score')(app);
require('./routes/leaderboards')(app);

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
    userId: '',
    score: 0,    
    title: 'Powerball'
  });
});

app.get('/logout', function(req, res){
  req.session.destroy(function(err){
    if (err){
      console.error(err);
    }
    res.redirect('/');
  });
});

app.get('/robots.txt', function(req, res){
   res.send('User-Agent: *', { 'Content-Type': 'text/plain' }, 200);
});

app.listen(3000);
