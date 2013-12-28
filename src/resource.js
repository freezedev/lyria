/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define(['path'], function(Path) {
  'use strict';
  
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
      var typePath = (Resource.path[type]) ? (Resource.path[type]) : type;
      
      return Path.resolve(assetPath, [Path.dotToPath(typePath), filename]);
    }
    
  };
  
  return Resource;
}); 