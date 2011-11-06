var Oauth = OAuth = require('oauth').OAuth
  , fs = require('fs')
  , DataProvider = require('../dataprovider').DataProvider;


module.exports = function(app){

var conkey
  , consecret;

fileContents = fs.readFileSync("secret.txt", "UTF-8")
detail = fileContents.split('\n');
conkey = detail[0];
consecret = detail[1];

var dataProvider = new DataProvider('localhost', 27017);

var oa= new OAuth("https://twitter.com/oauth/request_token",
                 "https://twitter.com/oauth/access_token", 
                 conkey, consecret, 
                 "1.0A", 'http://powerball.theautomatedtester.co.uk/sessions/callback', "HMAC-SHA1");

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
      oa.get("http://twitter.com/account/verify_credentials.json", 
        req.session.oauthAccessToken, 
        req.session.oauthAccessTokenSecret, 
        function (error, data, response) {
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

            dataProvider.putUser(params, function(error) {
            });
          
            req.session.twitterScreenName = data1["screen_name"];
            res.redirect('/');
          }
        });
      }
  });
});

app.post('/twitter', function(req, res){
  console.log(req.body)
  if (req.session.twitterScreenName){
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

}
