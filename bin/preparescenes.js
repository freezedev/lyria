var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var UglifyJS = require('uglify-js');

exports.prepareScenes = function(scenePath, output, callback) {
  
  var sceneObject = '(function() {';
  var sceneList = fs.readdirSync(scenePath);
  
  sceneList.forEach(function(scene) {
    
    if (path.extname(scene) === '') {
      if (fs.existsSync(path.join(scenePath, scene))) {
        
        sceneObject[scene] = {};
        
        sceneObject += 'Lyria.Scenes["' + scene + '"] = new Lyria.Scene("' + scene + '", function(sender) {';
        
        var sceneFunc = path.join(scenePath, scene, 'scene.js');
        var sceneLoc = path.join(scenePath, scene, 'localization.json');
        var sceneMarkup = path.join(scenePath, scene, 'scene.html');
        
        if (fs.existsSync(sceneLoc)) {
          try {
            sceneObject += 'var localization = sender.localization = ' + fs.readFileSync(sceneLoc) + ';';          
          } catch (e) {
            console.log('Error while evaluating ' + sceneLoc + ' :' + e);
          }
        } else {
          sceneObject += 'var localization = sender.localization = {}';
        }
        
        if (fs.existsSync(sceneMarkup)) {
          sceneObject += 'sender.template = ' + handlebars.precompile(fs.readFileSync(sceneMarkup, 'utf8')) + ';';
        }
        
        
        if (fs.existsSync(sceneFunc)) {
          sceneObject += fs.readFileSync(sceneFunc, 'utf8');
        }
        
        
        sceneObject += '})();'
      }
    }
    
  });
  
  sceneObject += '})();';
  
  fs.writeFile(output, sceneObject, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
    
    if (callback) {
      callback();      
    }
  });
}

