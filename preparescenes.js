var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var UglifyJS = require('uglify-js');

var scenePath = path.join(__dirname, 'assets', 'scenes');

var sceneObject = {};
var sceneList = fs.readdirSync(scenePath);

sceneList.forEach(function(scene) {
  
  if (path.extname(scene) === '') {
    if (fs.existsSync(path.join(scenePath, scene))) {
      
      sceneObject[scene] = {};
      
      var sceneFunc = path.join(scenePath, scene, 'scene.js');
      var sceneLoc = path.join(scenePath, scene, 'localization.json');
      var sceneMarkup = path.join(scenePath, scene, 'scene.html');
      
      if (fs.existsSync(sceneLoc)) {
        try {
          sceneObject[scene]['localization'] = JSON.parse(fs.readFileSync(sceneLoc));          
        } catch (e) {
          console.log('Error while evaluating ' + sceneLoc + ' :' + e);
        }
      }
      
      if (fs.existsSync(sceneFunc)) {
        sceneObject[scene]['content'] = UglifyJS.minify(fs.readFileSync(sceneFunc, 'utf8'), {fromString: true});
      }
      
      if (fs.existsSync(sceneMarkup)) {
        sceneObject[scene]['view'] = handlebars.precompile(fs.readFileSync(sceneMarkup, 'utf8'));
      }
    }
  }
  
});

console.log(sceneObject);

fs.writeFileSync('scenes.js', JSON.stringify(sceneObject));
