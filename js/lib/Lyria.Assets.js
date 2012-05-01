/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * @class Lyria.Resource
 * Resource
 */
Lyria.Resource = Lyria.Base.extend({
	path: {
		assets: "assets",
		audio: "audio",
		data: "data",
		image: "images",
		scene: "scenes",
		video: "video"
	},

	/**
	 *
	 *
	 */
	name: function(filename, type) {
		if(!filename) {
			return;
		}

		var assetPath = Lyria.Resource.path['assets'];
		var typePath = "";

		if(Lyria.Resource.path[type]) {
			typePath = Lyria.Resource.path[type];
		} else {
			typePath = type;
		}

		if(typePath) {
			return [assetPath, typePath.split('.').join('/'), filename].join('/');
		} else {
			return [assetPath, filename].join('/');
		}
	}
});

/**
 * @class Lyria.Assets
 * Asset class
 */
Lyria.Assets = Lyria.Base.extend({
	audio: function(filename) {
		myAudio = new Lyria.Audio();
		myAudio.loadFromFile(filename);
		return myAudio;
	},
	image: function(filename) {

	},
	data: function(filename) {

	},
	video: function(filename) {

	}
});
