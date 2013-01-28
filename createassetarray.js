var path = require('path');
var fs = require('fs');
var es6shim = require('es6-shim');

/**
 * dir: path to the directory to explore
 * action(file, stat): called on each file or until an error occurs. file: path
 * to the file. stat: stat of the file (retrived by fs.stat)
 * done(err): called one time when the process is complete. err is undifined is
 * everything was ok. the error that stopped the process otherwise
 */
var walkFiles = function(dir, action, done) {

  // this flag will indicate if an error occured (in this case we don't want to
  // go on walking the tree)
  var dead = false;

  // this flag will store the number of pending async operations
  var pending = 0;

  var fail = function(err) {
    if (!dead) {
      dead = true;
      done(err);
    }
  };

  var checkSuccess = function() {
    if (!dead && pending == 0) {
      done();
    }
  };

  var performAction = function(file, stat) {
    if (!dead) {
      try {
        action(file, stat);
      } catch(error) {
        fail(error);
      }
    }
  };

  // this function will recursively explore one directory in the context defined
  // by the variables above
  var dive = function(dir) {
    pending++;
    // async operation starting after this line
    fs.readdir(dir, function(err, list) {
      if (!dead) {// if we are already dead, we don't do anything
        if (err) {
          fail(err);
          // if an error occured, let's fail
        } else {// iterate over the files
          list.forEach(function(file) {
            if (!dead) {// if we are already dead, we don't do anything
              var pathName = path.join(dir, file);
              pending++;
              // async operation starting after this line
              fs.stat(pathName, function(err, stat) {
                if (!dead) {// if we are already dead, we don't do anything
                  if (err) {
                    fail(err);
                    // if an error occured, let's fail
                  } else {
                    if (stat && stat.isDirectory()) {
                      dive(pathName);
                      // it's a directory, let's explore recursively
                    } else {
                      performAction(pathName, stat);
                      // it's not a directory, just perform the action
                    }
                    pending--;
                    checkSuccess();
                    // async operation complete
                  }
                }
              });
            }
          });
          pending--;
          checkSuccess();
          // async operation complete
        }
      }
    });
  };

  // start exploration
  dive(dir);
};

function getFilesRecursively(root, options, callback) {
  if ( typeof options === "function") {
    callback = options;
  }

  curFiles = [];

  walkFiles(root, function(file, stat) {
    if (!options.dotFiles) {
      if (file.contains(path.sep + '.'))
        return;
    }

    if (!options.underscoreFiles) {
      if (file.contains(path.sep + '_'))
        return;
    }

    if (options.filter) {
      if (options.filter.indexOf(path.extname(file)) === -1)
        return;
    }

    var relPath = file.split(root + path.sep)[1];

    if (path.sep === '\\') {
      relPath.split(path.sep).join('/');
    }

    curFiles.push({
      fullname: file,
      relname: relPath,
      basename: path.basename(file)
    });
  }, function() {
    callback(curFiles);
  });
}

getFilesRecursively('assets', function(curFiles) {
  var assetArray = [];

  for (var i = 0, j = curFiles.length; i < j; i++) {
    if (curFiles[i] !== 'assets.json') {
      assetArray.push('assets/' + curFiles[i].relname);
    }
  }

  console.log(assetArray);

  fs.writeFile('assets/assets.json', JSON.stringify(assetArray), function(err) {
    if (err) {     
     console.log('Error while saving asset array: ' + err);
     } else {
       console.log('Asset array successfully saved.');
     }
  });
}); 