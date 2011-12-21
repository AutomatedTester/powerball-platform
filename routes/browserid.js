var DataProvider = require('../dataprovider').DataProvider
  , https = require('https')
  , querystring = require('querystring');


module.exports = function(app){
  
  var dataProvider = new DataProvider('localhost', 27017);

  app.post('/browserid', function(req, res){
    var options = {
      host: 'browserid.org',
      port: 443,
      path: '/verify',
      method: 'POST'
    },
    browseridReq = https.request(options, function(vres){
      var body = "";
      vres.on('data', function(chunk) {body+=chunk;});
      vres.on('end', function(){
        var returnedData = JSON.parse(body);
        if (returnedData.status !== 'failure'){
          
          req.session.powerballUser = returnedData.email;
          var params = {
            "name": req.session.powerballUser,
          };

          dataProvider.putUser(params, function(error, userId) {
            if (error) {
              console.error(error.err);
              res.json({result: "failure"});
            } else {
              dataProvider.getScore(params.name, function(errors, docs){ 
                console.log(docs);
                var score = 0; 
                for (var i=0; i < docs.length; i++){ 
                  score += docs[i].points;
                }

                req.session.score = score;                 
                req.session.userId = userId;
                res.json({
                  result:"success", 
                  email: req.session.powerballUser, 
                  userId: req.session.userId,
                  score: req.session.score,
                });
              });
            }
          }); 
        } else {
          //TODO(David) Lets send back something meaningful
        }
      });
    }),
    audience = req.headers.host ? req.headers.host : 'http://localhost:3000',
    data = querystring.stringify({
      assertion: req.body.assertion,
      audience: audience,
    });
    
    browseridReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    browseridReq.setHeader('Content-Length', data.length);
    browseridReq.write(data);
    browseridReq.end();

    browseridReq.on('error', function(e) {
      console.error(e);
      res.redirect('/500');
    });
  });
};
