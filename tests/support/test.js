var webdriver = require('./webdriver');
var app = require('../../app');

var driver =  new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({
      'browserName': 'firefox',
      'version': '',
      'platform': 'ANY',
      'javascriptEnabled': true
    }).
    build();

driver.get('http://localhost:3000');
driver.findElement(webdriver.By.id('browserid')).click();
driver.findElement(webdriver.By.name('btnG')).click();
driver.getTitle().then(function(title) {
  require('assert').equal('webdriver - Google Search', title);

});

driver.quit();

