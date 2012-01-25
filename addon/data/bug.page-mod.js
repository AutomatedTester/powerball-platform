var d = document;
function onBugzillaPage(url) {
  return /bugzilla(-[a-zA-Z]+)*\.mozilla\.org/.test(url)
      || /landfill.*\.bugzilla\.org/.test(url);
}

function getBugNumber() {
  len = d.URL.length;
  ans = null;
  if(!isNaN(d.location.search.split("=")[1])){
      ans = d.location.search.split("=")[1];
  }
  return ans;
}

function detectNewBug() {
    // run on both bugzilla.m.o and bugzilla-stage-tip.m.o
    if (!onBugzillaPage(d.domain)){
        return;
    }
        
    var bug = getBugNumber();
    if ( bug == null || bug == undefined || bug == "") {
        if (/\/enter_bug.cgi.*$/.test(d.location.href)) {
            return;
//        } else if (/\/attachment.cgi.*$/.test(d.location.href)) {        
        } else {
            return;
        }
    } else {
    //var whiteboard = d.getElementById("status_whiteboard").value;
    //var foundPowerballWhiteboard = false;
    //if (/.*power.*/.test(whiteboard)) {
        //foundPowerballWhiteboard = true;
        //alert("whiteboard is: " + whiteboard);         
    //}
    
      score = -1;
      var innerText = "";
      var body = document.getElementsByTagName("body")[0];
      if (body.textContent) {
          innerText = body.textContent;
      }
      if (innerText.indexOf("has been added to the database") > 0) {
          score = 10;
      } else if (innerText.indexOf("Changes submitted for") > 0) {
          score = 3;
      } else {
          console.log("Unknown action, not posting score.");
      }
    
      if (score >= 1) {
          self.port.emit("SendScoreToApi", bug, score);    
      }
    }
    return;
}
detectNewBug();

