define(['path'], function(Path) {
  'use strict';

  /**
   * @exports lyria/resource
   * @requires path 
   */
  
  var Resource = {
    /**
     * @member {Object} module:lyria/resource.path
     */
    path: {
      /**
       * @member {String} module:lyria/resource.path.assets=assets
       * @member {String} module:lyria/resource.path.audio=audio
       * @member {String} module:lyria/resource.path.data=data
       * @member {String} module:lyria/resource.path.image=images
       * @member {String} module:lyria/resource.path.scene=scenes
       * @member {String} module:lyria/resource.path.video=video
       * @member {String} module:lyria/resource.path.prefab=prefabs
       */
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
     * @param {String} filename The filename
     * @param {String} type The type of the asset
     * @returns {String}
     * 
     * @example
     * Resource.name('mything.json'); // => "assets/mything.json"
     * 
     * @example
     * Resource.name('myimage.png', 'image'); // => "assets/images/myimage.png"
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