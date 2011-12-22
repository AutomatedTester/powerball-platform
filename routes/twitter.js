var OAuth = require('oauth').OAuth
  , fs = require('fs')
  , DataProvider = require('../dataprovider').DataProvider;


module.exports = function(app){

  var conkey = ''
    , consecret = ''
    , fileContents = ''
    , detail = []
    , dataProvider = new DataProvider('localhost', 27017);

  try{
    fileContents = fs.readFileSync("secret.txt", "UTF-8");
    detail = fileContents.split('\n');
    conkey = detail[0];
    consecret = detail[1];
  } catch (e) {
    console.error(e);
  }

  app.get('/twitter', function(req, res){
    var sessionHost = req.headers.host ? 
      "http://" + req.headers.host : 'http://localhost:3000',
    oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 conkey, consecret, 
                 "1.0A", sessionHost + '/sessions/callback', "HMAC-SHA1");

    oa.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
        console.error(error);
        res.redirect('/500');
      } else {
        req.session.oauthRequestToken = oauthToken;
        req.session.oauthRequestTokenSecret = oauthTokenSecret;
        res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + 
          req.session.oauthRequestToken);
      }
    });
  });

  app.get('/sessions/callback', function(req, res){
    var sessionHost = req.headers.host ? 
      "http://" + req.headers.host : 'http://localhost:3000',
    oa = new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 conkey, consecret, 
                 "1.0A", sessionHost + '/sessions/callback', "HMAC-SHA1");

    oa.getOAuthAccessToken(req.session.oauthRequestToken, 
                        req.session.oauthRequestTokenSecret, 
                        req.query.oauth_verifier, 
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        console.error(error);
        res.redirect('/500');
      } else {
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

        // Right here is where we would write out some nice user stuff
        oa.get("http://twitter.com/account/verify_credentials.json", 
          req.session.oauthAccessToken, 
          req.session.oauthAccessTokenSecret, 
          function (error, data, response) {
            if (error) {
              console.error(error);
              res.redirect('/500');
            } else {
              var data1 = JSON.parse(data)
              , params = {
                'name': data1.screen_name.toLowerCase(),
                'oauthAccessToken': req.session.oauthAccessToken,
                'oauthAccessTokenSecret': req.session.oauthAccessTokenSecret,
              };

              dataProvider.putUser(params, function(error, userId) {
                if (error){
                  console.error("Error when putting user. Error: " + error);
                } else {
                  dataProvider.getScore(params.name, function(errors, docs){ 
                    var score = 0; 
                    for (var i=0; i < docs.length; i++){ 
                      score += docs[i].points;
                    }

                    req.session.score = score;
                    req.session.userId = userId;
                    req.session.powerballUser = data1.screen_name, 
                    res.redirect('back');
                  
                  });
                }
              });
            }
          });
        }
    });
  });

  app.post('/twitter', function(req, res){
    var sessionHost = req.headers.host ? 
      "http://" + req.headers.host : 'http://localhost:3000'
    , oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 conkey, consecret, 
                 "1.0A", sessionHost + '/sessions/callback', "HMAC-SHA1");
    if (req.session.powerballUser){
      oa.post("http://api.twitter.com/1/statuses/update.json", 
          req.session.oauthAccessToken,
          req.session.oauthAccessTokenSecret, req.body, 
          function(error, data, response){
            if(error){
              console.error(error);
              res.redirect('/500');
            }
          });
    } else {
      console.log('User not logged and tried to tweet');
      res.json({"error": "not logged in"});
    }
  });
};
