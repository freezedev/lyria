var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var UglifyJS = require('uglify-js');

var scenePath = path.join(__dirname, 'assets', 'scenes');

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

console.log(sceneObject);

fs.writeFileSync('scenes.js', sceneObject);
fs.writeFileSync('scenes.min.js', UglifyJS.minify(sceneObject, {fromString: true}).code);
