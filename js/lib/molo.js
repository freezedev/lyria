(function() {
  'use strict';
  var hasExtension, hasModule, isJavaScriptFile, pathSep, _ref,
    __hasProp = {}.hasOwnProperty;

  Object.keys || (Object.keys = function(o) {
    var name, _results;
    _results = [];
    for (name in o) {
      if (!__hasProp.call(o, name)) continue;
      _results.push(name);
    }
    return _results;
  });

  Array.isArray || (Array.isArray = function(a) {
    return a.push === Array.prototype.push && (a.length != null);
  });

  hasModule = (typeof module !== "undefined" && module !== null ? module.exports : void 0) != null;

  hasExtension = function(filename, extension) {
    if (filename == null) {
      return void 0;
    }
    return filename.lastIndexOf(extension) === filename.length - extension;
  };

  isJavaScriptFile = function(filename) {
    return hasExtension(filename, '.js');
  };

  pathSep = '/';

  (function(root) {
    var appendScriptPath, cache, loadScriptFile, mainHasBeenCalled, plugins, queue;
    loadScriptFile = function(filename, callback) {
      var firstScriptElem, locHref, prePath, scriptElem;
      if (!hasModule) {
        scriptElem = root.document.createElement('script');
        scriptElem.async = true;
        scriptElem.type = 'text/javascript';
        if (filename.indexOf('http://') === 0 || filename.indexOf('https://') === 0 || filename.indexOf('//') === 0) {
          scriptElem.src = filename;
        } else {
          locHref = root.location.href;
          prePath = locHref.slice(0, locHref.lastIndexOf('/') + 1);
          scriptElem.src = prePath + filename;
        }
        if (callback) {
          scriptElem.onload = scriptElem.onreadystatechange = function() {
            var rs;
            rs = this.readyState;
            if (rs && rs !== 'complete' && rs !== 'loaded') {
              return void 0;
            }
            return callback();
          };
        }
        firstScriptElem = root.document.getElementsByTagName('script')[0];
        return firstScriptElem.parentNode.insertBefore(scriptElem, firstScriptElem);
      } else {
        if (typeof require !== "undefined" && require !== null) {
          require(filename);
          return callback();
        }
      }
    };
    appendScriptPath = function(name) {
      var p, pathArray, prePath, scriptPath, _i, _len;
      if (isJavaScriptFile(root.molo.paths[name])) {
        return scriptPath = root.molo.paths[name];
      } else {
        prePath = root.molo.basePath ? "" + basePath : '';
        pathArray = Object.keys(root.molo.paths);
        for (_i = 0, _len = pathArray.length; _i < _len; _i++) {
          p = pathArray[_i];
          if (root.molo.paths[p] && name.indexOf("" + root.molo.paths[p] + pathSep) === 0) {
            prePath = root.molo.paths[p];
          }
        }
        return scriptPath = prePath ? "" + prePath + pathSep + name + ".js" : "" + name + ".js";
      }
    };
    cache = {};
    queue = {};
    plugins = {};
    root.molo = {};
    root.molo.basePath = '';
    root.molo.paths = {};
    root.molo.defaultContext = root;
    root.molo.define = root.define = function(name, dependencies, factory) {
      var _ref1;
      if (cache[name]) {
        throw new TypeError("A module called " + name + " has already been evaluated. Please choose a different name.");
      }
      if (cache[name]) {
        throw new TypeError("A module called " + name + " has already been defined. Please choose a different name.");
      }
      if (!Array.isArray(dependencies)) {
        if (typeof dependencies === 'object' || typeof dependencies === 'function') {
          _ref1 = [factory, dependencies], dependencies = _ref1[0], factory = _ref1[1];
        }
      }
      if (!dependencies) {
        dependencies = [];
      }
      if (dependencies.length === 0) {
        if (typeof factory === 'function') {
          cache[name] = factory.call(root.molo.defaultContext);
        } else {
          cache[name] = factory;
        }
        return;
      }
      return queue[name] = {
        dependencies: dependencies,
        factory: factory
      };
    };
    root.molo.require = root.require = function(name, callback, context) {
      var executeCallback, i, num, reqArgIndex, reqArgs, waitQueue, walkThroughQueue, _fn, _i, _len;
      if (context == null) {
        context = root.molo.defaultContext;
      }
      if (typeof name === 'string') {
        name = [name];
      }
      if (!Array.isArray(name)) {
        return;
      }
      reqArgs = [];
      reqArgIndex = 0;
      executeCallback = function() {
        if (callback) {
          if (reqArgIndex === name.length) {
            return callback.apply(this, reqArgs);
          }
        }
      };
      _fn = function(i, num) {
        var cacheDeps, dep, depIndex, depLength, depsLoaded, updateDeps, _j, _len1, _ref1, _results;
        if (cache[i]) {
          reqArgs[num] = cache[i];
          reqArgIndex++;
          executeCallback();
          return;
        }
        cacheDeps = [];
        if (queue[i]) {
          depIndex = 0;
          depLength = queue[i].dependencies.length;
          depsLoaded = function() {
            if (depIndex === depLength) {
              cache[i] = queue[i].factory.apply(context, cacheDeps);
              return delete queue[i];
            }
          };
          updateDeps = function(item) {
            if (item) {
              cacheDeps.push(item);
              depIndex++;
              return depsLoaded();
            }
          };
          _ref1 = queue[i].dependencies;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            dep = _ref1[_j];
            if (Object.hasOwnProperty.call(cache, dep)) {
              _results.push(updateDeps(cache[dep]));
            } else {
              _results.push(root.molo.require(dep, updateDeps, context));
            }
          }
          return _results;
        } else {
          return loadScriptFile(appendScriptPath(i), function() {
            return root.molo.require(i);
          });
        }
      };
      for (num = _i = 0, _len = name.length; _i < _len; num = ++_i) {
        i = name[num];
        _fn(i, num);
      }
      waitQueue = {};
      walkThroughQueue = function(queueObj) {
        var dep, depLength, key, resolveDeps, value, _j, _len1, _ref1;
        resolveDeps = [];
        if (Object.keys(queueObj).length > 0) {
          for (key in queueObj) {
            value = queueObj[key];
            if (!(key && value)) {
              return;
            }
            console.log('walkThroughQueue');
            console.log(key);
            console.log(value);
            depLength = value.dependencies.length;
            _ref1 = value.dependencies;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              dep = _ref1[_j];
              if (cache[dep]) {
                resolveDeps.push(cache[dep]);
                if (depLength === resolveDeps.length) {
                  cache[key] = value.factory.apply(context, resolveDeps);
                  if (queueObj[key]) {
                    delete queueObj[key];
                  }
                  if (waitQueue[key]) {
                    delete waitQueue[key];
                  }
                } else {
                  waitQueue[key] = queueObj[key];
                  console.log(resolveDeps);
                }
              }
            }
          }
        }
      };
      walkThroughQueue(queue);
      walkThroughQueue(waitQueue);
      console.log('Queue & Cache & waitQueue');
      console.log(queue);
      console.log(cache);
      return console.log(waitQueue);
    };
    root.molo["delete"] = root.molo.invalidate = function(name) {
      if (cache[name]) {
        delete cache[name];
      }
      if (queue[name]) {
        return delete queue[name];
      }
    };
    root.molo.plugins = {
      add: function(pluginName, pluginFunc) {
        return plugins[pluginName] = pluginFunc;
      },
      "delete": function(p) {
        if (plugins[p]) {
          return delete plugins[p];
        }
      }
    };
    root.molo.clear = function() {
      cache = {};
      return queue = {};
    };
    mainHasBeenCalled = false;
    root.molo.main = function(name, callback) {
      var moloHasBeenCalled, _ref1;
      if (typeof name === 'function' || (name == null)) {
        _ref1 = ['main', name], name = _ref1[0], callback = _ref1[1];
      }
      if (mainHasBeenCalled) {
        throw new TypeError('molo.main can only be called once.');
      }
      root.molo.require(name, callback);
      return moloHasBeenCalled = true;
    };
    root.unit = function(name, body) {
      var defines, requires;
      requires = body.requires, defines = body.defines;
      return root.molo.define(name, requires, defines);
    };
    return root.molo.define('root', function() {
      return root;
    });
  })((_ref = typeof module !== "undefined" && module !== null ? module.exports : void 0) != null ? _ref : this);

}).call(this);
