/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

/**
 * 
 */
Lyria.Preloader = {
	maxAssets: 0,
	assetsLoaded: 0,
	percentLoaded: 0,
	init: function(assetArray, options) {
		var defaultOptions = {
			showLoadingScreen: true,
			loadingScreenClass: 'loading-screen',
			loadingBarClass: 'loading-bar'
		};
		options = $.extend(true, defaultOptions, options);
		
		
		function loadingProgress() {

			Lyria.Preloader.percentLoaded = Lyria.Preloader.assetsLoaded / Lyria.Preloader.maxAssets;
			if (Lyria.Preloader.onProgressChange) {
				Lyria.Preloader.onProgressChange(Lyria.Preloader.percentLoaded);
			}

			if (options.showLoadingScreen) {
				
			}

			if(Lyria.Preloader.assetsLoaded === Lyria.Preloader.maxAssets) {
				if (options.showLoadingScreen) {
					
				}
				
				if(Lyria.Preloader.complete && ( typeof Lyria.Preloader.complete === "function")) {
					// Callback
					Lyria.Preloader.complete();
				}
			}
		}

		// Check if it's an array
		if(assetArray.length) {
			Lyria.Preloader.maxAssets = assetArray.length;

			$.each(assetArray, function(key, value) {
				Lyria.Utils.isObjectOrString(value, function(arg) {
					if(value.src && value.type) {
						switch (value.type) {
							default:
								break;
						}
					}

				}, function(arg) {
					var img = new Image();
					img.onload = function() {
						Lyria.Preloader.assetsLoaded++;
						
						loadingProgress();
					};
					img.src = Lyria.Resource.name(arg, 'image');
				});
			});
		}
	},
	/**
	 * 
	 */
	onProgressChange: function(value) {
		
	},
	/**
	 * 
	 */
	complete: function() {

	}
};
