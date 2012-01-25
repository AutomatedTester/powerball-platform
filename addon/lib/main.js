    // This is an active module of the Mavericks Add-on
//exports.main = function() {};
var tabs = require("tabs");
const data = require("self").data;
var ss = require("simple-storage");

var pBallPanel = require("panel").Panel({
    width: 300,
    height: 120,
    contentURL: data.url("pball.html"),
    contentScript: "document.addEventListener('pbContentEvent', function (e) { self.port.emit('preferences', e.getData('userID')); });"
});

pBallPanel.port.on("preferences", function(userid) {
  if (ss.storage.userID != userid) {
      ss.storage.userID = userid;
      console.log("Set the user id: " + ss.storage.userID);
  }
})

var widgets = require("widget").Widget({
    id: "pball-icon",
    label: "Bug Filer",
	contentURL:	"http://www.mozilla.org/favicon.ico",
    panel: pBallPanel,
    onClick:function(){
        tabs.activeTab.attach({
            contentScriptFile: data.url("bug.page-mod.js")
        });
    }
});

//tabs.open(self.data.url("userid.html"));
var bugNumber = -1;

var pageMod = require("page-mod");
pageMod.PageMod({
  include: ["http://bugzilla.mozilla.org/*", "https://bugzilla.mozilla.org/*"],
  contentScriptWhen: 'end',
  contentScriptFile: data.url("bug.page-mod.js"),
  onAttach: function(worker) {
      worker.port.on("SendScoreToApi", function(bug, points){
        bugNumber = bug;
        console.log("Sending Score to Powerball: " + bug);

        var output = {"bugnumber": bugNumber, "points": points};
        
        var Request = require("request").Request;
        var sendScore = Request({
          url: "http://powerball.theautomatedtester.co.uk/score/" + ss.storage.userID + "/bugsweeper",
          onComplete: function (response) {
            console.log("Request Completed: " + response.statusText + " : " + response.status);
          },
          content: JSON.stringify(output),
          contentType: 'application/json',
        });
        sendScore.post();
        console.log("Completed sending score (" + points + ")to Powerball");

      });   }
});

