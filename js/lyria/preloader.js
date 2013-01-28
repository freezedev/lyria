/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, $, undefined) {
	'use strict';

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
					  if (arg.contains(Lyria.Resource.path.image)) {
					    var img = new Image();
              img.onload = function() {
                Lyria.Preloader.assetsLoaded++;
                
                loadingProgress();
              };
              img.src = arg;
					  } else {
					    $.ajax({url: arg, dataType: 'text'}).done(function() {
					      Lyria.Preloader.assetsLoaded++;
                
                loadingProgress();
					    });
					  }
					  
						
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
	
})(this.Lyria = this.Lyria || {}, this.jQuery);
