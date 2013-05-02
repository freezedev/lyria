(function() {
  "use strict";
  (function(root) {
    var contains, defaultTests, detectCache, detectResultCache, detectr, document, globalOptions, runTest, testQueue;
    document = root.document;
    /*
      String helper functions
    */

    contains = function(bigString, smallString) {
      if (String.prototype.contains) {
        return bigString.contains(smallString);
      } else {
        return !!~bigString.indexOf(smallString);
      }
    };
    /*
      Default configuration for detectr
      
      @mixin Default tests
    */

    defaultTests = {
      tests: {
        desktop: {
          run: function() {
            return !runTest('mobile');
          },
          result: 'desktop'
        },
        mobile: {
          run: function() {
            if (contains(detectr.Browser.get(), 'mobile')) {
              return true;
            }
            return runTest('android') || runTest('ios') || runTest('bada') || runTest('webos') || runTest('wp7') || runTest('blackberry');
          },
          result: 'mobile'
        },
        macosx: {
          run: function() {
            return (contains(detectr.Browser.platform.name(), 'macosx')) && !(contains(detectr.Browser.platform.name(), 'likemacosx'));
          },
          result: 'macosx'
        },
        linux: {
          run: function() {
            return contains(detectr.Browser.platform.name(), 'linux');
          },
          result: 'linux'
        },
        roots: {
          run: function() {
            return contains(detectr.Browser.platform.name(), 'roots');
          },
          result: 'roots'
        },
        android: {
          run: function() {
            return contains(detectr.Browser.get(), 'android');
          },
          result: 'android'
        },
        ios: {
          run: function() {
            return contains(detectr.Browser.platform.name(), 'likemacosx');
          },
          result: 'ios'
        },
        ipod: {
          run: function() {
            return contains(detectr.Browser.get(), 'ipod');
          },
          result: 'ipod'
        },
        iphone: {
          run: function() {
            return (contains(detectr.Browser.get(), 'iphone')) && !runTest('ipod');
          },
          result: 'iphone'
        },
        ipad: {
          run: function() {
            return contains(detectr.Browser.get(), 'ipad');
          },
          result: 'ipad'
        },
        bada: {
          run: function() {
            return contains(detectr.Browser.get(), 'bada');
          },
          result: 'bada'
        },
        webos: {
          run: function() {
            return contains(detectr.Browser.get(), 'webos');
          },
          result: 'webos'
        },
        wp7: {
          run: function() {
            return contains(detectr.Browser.get(), 'roots phone os');
          },
          result: 'wp7'
        },
        blackberry: {
          run: function() {
            return (contains(detectr.Browser.get(), 'rim')) || (contains(detectr.Browser.get(), 'blackberry'));
          },
          result: 'blackberry'
        },
        landscape: {
          run: function() {
            return detectr.Display.pageWidth() >= detectr.Display.pageHeight();
          },
          result: 'landscape'
        },
        portrait: {
          run: function() {
            return !runTest('landscape');
          },
          result: 'portrait'
        },
        'browser-chrome': {
          run: function() {
            return contains(detectr.Browser.get(), 'chrome');
          },
          result: 'browser-chrome'
        },
        'browser-firefox': {
          run: function() {
            return contains(detectr.Browser.get(), 'firefox');
          },
          result: 'browser-firefox'
        },
        'browser-ie': {
          run: function() {
            return contains(detectr.Browser.get(), 'msie');
          },
          result: 'browser-ie'
        },
        'browser-safari': {
          run: function() {
            return (contains(detectr.Browser.get(), 'safari')) && !(contains(detectr.Browser.get(), 'chrome'));
          },
          result: 'browser-safari'
        },
        'browser-opera': {
          run: function() {
            return contains(detectr.Browser.get(), 'opera');
          },
          result: 'browser-opera'
        }
      }
    };
    detectCache = {};
    detectResultCache = {};
    globalOptions = {};
    testQueue = {};
    /*
      Runs a defined test
    */

    runTest = function(testName, testObject) {
      var htmlClassName, testResultBool, testResultString;
      if (!testName) {
        return false;
      }
      if (testQueue[testName].status === 'tested') {
        return !!detectCache[testName];
      } else {
        if (testObject) {
          if (testObject.run) {
            testResultBool = !!testObject.run();
            testResultString = testObject.result;
          }
          if ((globalOptions != null ? globalOptions.debug : void 0) != null) {
            console.log("Testing " + testName + ": Result: " + testResultBool);
          }
          if (testQueue[testName]) {
            testQueue[testName].status = 'tested';
          }
          detectCache[testName] = testResultBool;
          if (testResultBool) {
            htmlClassName = document.documentElement.className;
            htmlClassName += " " + testResultString;
            htmlClassName = htmlClassName.trim();
            document.documentElement.className = htmlClassName;
            detectResultCache[testName] = testResultString;
            return !!detectCache[testName];
          }
        } else {
          return runTest(testName, testQueue[testName]);
        }
      }
    };
    /*
      detectr constructor
      
      @method detectr
    */

    detectr = function(config, options) {
      var doOrientationChange, parsedPlatform, uaAppName, uaAppVersion, uaPlatform, uaString;
      if (!(config && config.tests)) {
        return void 0;
      }
      globalOptions = options;
      uaString = navigator.userAgent.toLowerCase();
      uaAppName = navigator.appName, uaAppVersion = navigator.appVersion, uaPlatform = navigator.platform;
      parsedPlatform = uaString.match(/(.*?)\s(.*?)\((.*?);\s(.*?)\)/);
      detectr.Browser || (detectr.Browser = {
        width: function() {
          return root.outerWidth;
        },
        height: function() {
          return root.outerHeight;
        },
        get: function() {
          return uaString;
        },
        name: function() {
          return uaAppName;
        },
        version: function() {
          return uaAppVersion;
        },
        platform: {
          name: function() {
            return parsedPlatform[4].replace(/\s/gi, '').toLowerCase();
          },
          original: function() {
            return uaPlatform;
          }
        },
        language: function() {
          var language;
          language = navigator.language || navigator.systemLanguage;
          if (language != null) {
            return language.split('-')[0];
          }
        }
      });
      document.documentElement.setAttribute('lang', detectr.Browser.language());
      detectr.Display || (detectr.Display = {
        width: function() {
          return root.screen.width;
        },
        height: function() {
          return root.screen.height;
        },
        pageWidth: function() {
          return root.innerWidth;
        },
        pageHeight: function() {
          return root.innerHeight;
        }
      });
      detectr.clear();
      detectr.add(config);
      doOrientationChange = function(condition) {
        var htmlClassName, newResult;
        if (condition()) {
          if (detectr.Display.orientation === detectResultCache['landscape']) {
            return false;
          }
          newResult = detectr.defaultTests.tests['landscape'].result;
          htmlClassName = document.documentElement.className;
          if (contains(htmlClassName, detectResultCache['portrait'])) {
            htmlClassName = htmlClassName.replace(detectResultCache['portrait'], newResult);
            document.documentElement.className = htmlClassName;
          }
          detectCache['landscape'] = true;
          detectCache['portrait'] = false;
          detectResultCache['landscape'] = newResult;
          detectResultCache['portrait'] = void 0;
        } else {
          if (detectr.Display.orientation === detectResultCache['portrait']) {
            return false;
          }
          newResult = detectr.defaultTests.tests['portrait'].result;
          htmlClassName = document.documentElement.className;
          if (contains(htmlClassName, detectResultCache['landscape'])) {
            htmlClassName = htmlClassName.replace(detectResultCache['landscape'], newResult);
            document.documentElement.className = htmlClassName;
          }
          detectCache['landscape'] = true;
          detectCache['portrait'] = false;
          detectResultCache['landscape'] = void 0;
          detectResultCache['portrait'] = newResult;
        }
        return detectr.Display.orientation = detectResultCache['landscape'] || detectResultCache['portrait'];
      };
      root.addEventListener('resize', (function() {
        return doOrientationChange(function() {
          return detectr.Display.pageWidth() >= detectr.Display.pageHeight();
        });
      }), false);
      root.addEventListener('orientationchange', (function() {
        return doOrientationChange(function() {
          return Math.abs(root.orientation) === 90;
        });
      }), false);
      detectr.Display.orientation = detectResultCache['landscape'] || detectResultCache['portrait'];
      return detectr;
    };
    /*
      Checks for a test and returns a boolean value
    */

    detectr.is = function(value) {
      if (!value) {
        return void 0;
      }
      value = value.replace(/\s/gi, '').toLowerCase();
      return !!detectCache[value];
    };
    /*
      Checks for a test and returns the result value of the test
    */

    detectr.result = function(value) {
      if (!value) {
        return void 0;
      }
      value = value.replace(/\s/gi, '').toLowerCase();
      if (detectResultCache[value]) {
        return detectResultCache[value];
      }
    };
    /*
      Clear cache
    */

    detectr.clear = function() {
      var htmlClassName, key, value;
      testQueue = {};
      detectCache = {};
      for (key in detectResultCache) {
        value = detectResultCache[key];
        htmlClassName = document.documentElement.className;
        htmlClassName = htmlClassName.replace(value, '').trim();
        document.documentElement.className = htmlClassName;
      }
      detectResultCache = {};
      return detectr;
    };
    /*
      Remove a test
    */

    detectr.remove = function(testName) {
      var htmlClassName;
      if (detectCache[testName]) {
        delete detectCache[testName];
      }
      if (detectResultCache[testName]) {
        htmlClassName = document.documentElement.className;
        htmlClassName = htmlClassName.replace(detectResultCache[testName], '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
        document.documentElement.className = htmlClassName;
        delete detectResultCache[testName];
      }
      return detectr;
    };
    /*
      Add a test
    */

    detectr.add = function(testName, testObject) {
      var key, value, _ref, _ref1;
      if (testName.tests) {
        _ref = testName.tests;
        for (key in _ref) {
          value = _ref[key];
          testQueue[key] = {
            status: 'untested',
            run: value.run,
            result: value.result
          };
        }
        _ref1 = testName.tests;
        for (key in _ref1) {
          value = _ref1[key];
          detectr.add(key, value);
        }
      } else {
        runTest(testName, testObject);
      }
      return detectr;
    };
    /*
      Expose defaultTests for those who need to re-execute the detectr function
    */

    detectr.defaultTests = defaultTests;
    /*
      Call detectr constructor with default configuration
      and set the reference to the detectr object
    */

    root.detectr = detectr(defaultTests);
    if (root.define && (typeof exports === "undefined" || exports === null)) {
      return root.define('detectr', [], function() {
        return root.detectr;
      });
    }
  })(typeof exports !== "undefined" && exports !== null ? exports : this);

}).call(this);
