/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/resource', function() {
  
  var Resource = {
    /**
     *
     */
    path: {
      assets: 'assets',
      audio: 'audio',
      data: 'data',
      image: 'images',
      scene: 'scenes',
      video: 'video',
      prefab: 'prefabs'
    },
  
    /**
     * Returns the relative filename to an asset by filename and type
     * 
     * @param {String} filename
     * @param {String} type
     */
    name: function(filename, type) {
      if (!filename) {
        return;
      }
  
      var assetPath = Resource.path['assets'];
      var typePath = '';
  
      if (Resource.path[type]) {
        typePath = Resource.path[type];
      } else {
        typePath = type;
      }
  
      if (typePath) {
        return [assetPath, typePath.split('.').join('/'), filename].join('/');
      } else {
        return [assetPath, filename].join('/');
      }
    }
    
  };
  
  return Resource;
}); 