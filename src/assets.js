/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
define('lyria/resource', {
  /**
   *
   */
  path: {
    assets: "assets",
    audio: "audio",
    data: "data",
    image: "images",
    scene: "scenes",
    video: "video",
    prefab: "prefabs"
  },

  /**
   *
   *
   */
  name: function(filename, type) {
    if (!filename) {
      return;
    }

    var assetPath = Lyria.Resource.path['assets'];
    var typePath = "";

    if (Lyria.Resource.path[type]) {
      typePath = Lyria.Resource.path[type];
    } else {
      typePath = type;
    }

    if (typePath) {
      return [assetPath, typePath.split('.').join('/'), filename].join('/');
    } else {
      return [assetPath, filename].join('/');
    }
  }
}); 