self.port.on("init", function (data) {
  // Initialize Bugzilla item
  var node = document.querySelector("#bugzilla a");
  node.href = data.bugzillaHost + "/enter_bug.cgi?product=" + data.application +
              "&status_whiteboard=[powerball]";

  // Initialize about item
  node = document.querySelector("#about a");
  node.href = data.powerballHost;

  // Initialize account item
  node = document.querySelector("#account a");
  if (data.userID) {
    node.href = data.powerballHost + "/user/id/" + data.userID;
    node.textContent = "Account";
  } else {
    node.href = data.powerballHost;
    node.textContent = "New Account";
  }
});