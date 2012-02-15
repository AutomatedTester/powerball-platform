var notifications = require("notifications");
var pageMod = require("page-mod");
var prefs = require("api-utils/preferences-service");
var self = require("self");
var tabs = require("tabs");

const data = self.data;

// Preferences used by the extension
const PREF_USER_ID = "extensions." + self.id + ".userid";


function checkUserID(id) {
  // If no userid has been specified show a notification
  if (!id) {
    notifications.notify({
      text: "Powerball user id has not been set. Open the Add-ons Manager and check " +
            "the details page of the extension to let it report points.",
      iconURL: "http://www.mozilla.org/favicon.ico",
      onClick: function () {
        tabs.open("about:addons#extensions");
      }
    });
  }

  return id;
}

exports.main = function () {
  checkUserID(prefs.get(PREF_USER_ID, ""));

  var pBallPanel = require("panel").Panel({
      width: 110,
      height: 70,
      contentURL: data.url("pball.html")
  });
  
  var widgets = require("widget").Widget({
      id: "pball-icon",
      label: "Bug Filer",
      contentURL: "http://www.mozilla.org/favicon.ico",
      panel: pBallPanel,
      onClick:function(){
          tabs.activeTab.attach({
              contentScriptFile: data.url("bug.page-mod.js")
          });
      }
  });

  pageMod.PageMod({
    include: ["http://bugzilla.mozilla.org/*", "https://bugzilla.mozilla.org/*"],
    contentScriptWhen: 'end',
    contentScriptFile: data.url("bug.page-mod.js"),
    onAttach: function(worker) {
        worker.port.on("SendScoreToApi", function(bug, points){
          var userid = prefs.get(PREF_USER_ID, "");
          if (!checkUserID(userid)) {
            console.log("Cannot send score because user id has not been set");
            return;
          }

          var output = {"bugnumber": bug, "points": points};
          console.log("Sending " + output.points + " to Powerball for bug " + output.bugnumber);
  
          var Request = require("request").Request;
          var sendScore = Request({
            url: "http://powerball.theautomatedtester.co.uk/score/" + userid + "/bugsweeper",
            onComplete: function (response) {
              console.log("Request Completed: " + response.statusText + " : " + response.status);
            },
            content: JSON.stringify(output),
            contentType: 'application/json'
          });
          //sendScore.post();
          console.log("Completed sending score to Powerball");
  
        });
    }
  });

    
}

