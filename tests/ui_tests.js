var webdriver = require('./support/webdriver');
var app = require('../app'),
    assert = assert = require('assert');

describe('UI Functions',function(){
  var driver;
  before(function(){
    driver =  new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities({
      'browserName': 'firefox',
      'version': '',
      'platform': 'ANY',
      'javascriptEnabled': true
    }).
    build();
  });

  describe('login', function(){
    it('should show that the browserid icon is gone', function(done){
      driver.get('http://localhost:3000').then(function(){
        return driver.findElement(webdriver.By.id('browserid')).click().then(function(){
          return driver.findElements(webdriver.By.linkText("browserid")).then(function(elements){
            assert.equal(0, elements.length);
            done();
          });
        });
      });
    });
  });

  after(function(){
    driver.quit();
  });
});
