var notifications = require("notifications");
var pageMod = require("page-mod");
var prefs = require("api-utils/preferences-service");
var self = require("self");
var tabs = require("tabs");

const data = self.data;

const POWERBALL_HOST = "http://powerball.theautomatedtester.co.uk";
const BUGZILLA_HOST = "https://bugzilla.mozilla.org";

// Preferences used by the extension
const PREF_USER_ID = "extensions." + self.id + ".userid";


function getUserID() {
  var id = prefs.get(PREF_USER_ID, "");

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
  // Display a notification if the id hasn't been set yet
  getUserID();

  var pBallPanel = require("panel").Panel({
    width: 110,
    height: 70,
    contentScriptFile: data.url("pball.js"),
    contentScriptWhen: "ready",
    contentURL: data.url("pball.html")
  });

  var widgets = require("widget").Widget({
    id: "pball-icon",
    label: "Bug Filer",
    contentURL: "http://www.mozilla.org/favicon.ico",
    panel: pBallPanel,
    onClick:function(){
      pBallPanel.port.emit("init", {
        application: require("xul-app").name,
        bugzillaHost: BUGZILLA_HOST,
        powerballHost: POWERBALL_HOST,
        userID: getUserID()
      });

      tabs.activeTab.attach({
        contentScriptFile: data.url("bug.page-mod.js")
      });
    }
  });

  pageMod.PageMod({
    include: [BUGZILLA_HOST + "/*"],
    contentScriptWhen: 'end',
    contentScriptFile: data.url("bug.page-mod.js"),
    onAttach: function(worker) {
      worker.port.on("SendScoreToApi", function(bug, points){
        var userid = getUserID();
        if (!userid) {
          console.log("Cannot send score because user id has not been set");
          return;
        }

        var output = {"bugnumber": bug, "points": points};
        console.log("Sending " + output.points + " to Powerball for bug " + output.bugnumber);

        var Request = require("request").Request;
        var sendScore = Request({
          url: POWERBALL_HOST + "/score/" + userid + "/bugsweeper",
          onComplete: function (response) {
            console.log("Request Completed: " + response.statusText + " : " + response.status);
          },
          content: JSON.stringify(output),
          contentType: 'application/json'
        });
        sendScore.post();
        console.log("Completed sending score to Powerball");
      });
    }
  });
}
