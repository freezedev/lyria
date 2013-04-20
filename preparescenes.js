var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var UglifyJS = require('uglify-js');

exports.prepareScenes = function(scenePath, output, callback) {
  
  var sceneObject = '(function(Lyria) {';
  var sceneList = fs.readdirSync(scenePath);
  
  sceneList.forEach(function(scene) {
    
    if (path.extname(scene) === '') {
      if (fs.existsSync(path.join(scenePath, scene))) {
        
        sceneObject[scene] = {};
        
        sceneObject += 'Lyria.Scenes["' + scene + '"] = new Lyria.Scene("' + scene + '", function(scene) {';
        
        var sceneFunc = path.join(scenePath, scene, 'scene.js');
        var sceneLoc = path.join(scenePath, scene, 'localization.json');
        var sceneMarkup = path.join(scenePath, scene, 'scene.html');
        
        if (fs.existsSync(sceneLoc)) {
          try {
            sceneObject += 'this.localization = ' + fs.readFileSync(sceneLoc) + ';';          
          } catch (e) {
            console.log('Error while evaluating ' + sceneLoc + ' :' + e);
          }
        }
        
        if (fs.existsSync(sceneMarkup)) {
          sceneObject += 'this.template = Lyria.TemplateEngine.compile(' + handlebars.precompile(fs.readFileSync(sceneMarkup, 'utf8')) + ');';
        }
        
        
        if (fs.existsSync(sceneFunc)) {
          sceneObject += 'return ' + fs.readFileSync(sceneFunc, 'utf8') + ';';
        }
        
        
        sceneObject += '});'
      }
    }
    
  });
  
  sceneObject += '})(this.Lyria = this.Lyria || {});';
  
  fs.writeFile(output, sceneObject, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
    
    if (callback) {
      callback();      
    }
  });
}

