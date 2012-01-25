    //if we have a powerball whiteboard, lets post status to powerball_app;
    //if we post to powerball app, lets ask them to reproduce/verify another bug

    //if we are on an enter_bug.cgi screen (https://bugzilla.mozilla.org/enter_bug.cgi?product=Firefox&version=Trunk&component=General&status_whiteboard=powerball)
    //  filter options, hide from UI;
    
    //powerball will only upload if we actively edit a bug with powerball in the whiteboard.
    //I would rather use a hidden field or a cookie to indicate state.  
    //when enter_bug.cgi, add pending bug to be filed to the queue
    //when we get a bug listing with powerball, remove from the queue
    
    //add a skin to the toolbar, and then 'report_problem' == new tab with prefilled forms
    //one custom field would be a list of all urls that are open and the current page would be selected.
    //we would just use the raw hostname, not the params.
    
