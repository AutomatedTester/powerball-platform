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
    }
    var browseridReq = https.request(options, function(vres){
      var body = "";
      vres.on('data', function(chunk) {body+=chunk;})
      vres.on('end', function(){
        var returnedData = JSON.parse(body);
        if (returnedData.status === 'failure'){
          req.session.browserid = returnedData.email
          var params = {
            "name": req.session.browserid,
          }
          dataProvider.putUser(params, function(error) {
            console.error(error);
          }); 
      
          res.redirect('/');
        } else {
          //TODO(David) Lets send back something meaningful
        }
      });
    });


    var data = querystring.stringify({
      assertion: req.body.assertion,
      audience: 'http://localhost:3000'
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
}
