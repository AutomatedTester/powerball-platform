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


var DataProvider = require('../dataprovider').DataProvider;


module.exports = function(app){
  
  var dataProvider = new DataProvider();

  app.post('/score/:uniqueId/:games', function(req, res, next){
    var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    if (req.params.uniqueId){
      dataProvider.findUserById(req.params.uniqueId, function(err, ruser) {
        if (err) {
          console.error("Error putting score " + err);
          res.json(FAILURE);
        } else {
          if (ruser === null){
            res.json(FAILURE);
          } else {
            if (req.params.games){
              dataProvider.getGame(req.params.games, function(err, games){
                if (err){
                  console.error("Error putting score " + err);
                  res.json(FAILURE);
              } else {
                  if (games){
                    var data = req.body; 
                    dataProvider.putScore({user: ruser.name, game: games.name, points: data.points} , function(err){
                      if (!err) {
                        req.session.score += data.points;
                        FAILURE.result = 'success';
                        FAILURE.message = 'score locked away in the datastore';
                        res.json(FAILURE);
                      } else {
                        console.error("Error putting score" + err);
                        res.json(FAILURE);
                      }
                    });
                  } else {
                    console.error("Error putting score: could not find game " + req.params.games);
                    res.json(FAILURE);
                  }
                }
              });
            } else {
              console.error("Error putting score. No game was passed in");
              res.json(FAILURE);
            }
          }
        }
      });
    } else {
      res.json(FAILURE);
    }
  }); 

  app.post('/score/:doesntMatter', function(req, res){
    var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    res.json(FAILURE);
  });

  app.post('/score', function(req, res){
    var FAILURE = {
        result: "failure"
      , message: "you need to pass in the unique id, from your profile page, and the game." +
                "Make sure the post has the points to go to the profile"
    }
    res.json(FAILURE);
  });
};
