;(function(window, undefined) {
  // frameRate is only used if requestAnimFrame is not available
  window.frameRate = 60;
  
  /* shim layer with setTimeout fallback
    http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  
   http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  */
  
  var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimFrame) {
      window.requestAnimFrame = function( callback ){
          window.setTimeout(callback, ~~(1000 / window.frameRate));
        };
    }
    
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    } 
})(this);

/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(global, Lyria, undefined) {
	'use strict';
	
	
	
	/**
	 * @class Lyria.Platform
	 * Gets information about the current platform
	 */
	Lyria.Platform = Lyria.Base.extend({
		Browser: {
			get: function() {
				return global.navigator.userAgent;
			},
			get name() {
				return global.navigator.appName;
			},
			get version() {
				return global.navigator.appVersion;
			}
		},
	
		get name() {
			return global.navigator.platform;
		},
	
		is: function(value) {
			if( typeof (value) === "undefined")
				return;
	
			switch (value.toLowerCase()) {
				case '32bit':
				case '32-bit':
					return !(Lyria.Platform.is('64bit'));
	
				case '64bit':
				case '64-bit':
					return (global.navigator.platform.match(/x86_64/i));
	
				case 'win':
				case 'windows':
					break;
	
				case 'linux':
					break;
	
				case 'mac':
				case 'macos':
				case 'macosx':
				case 'mac os x':
					break;
	
				case 'ios':
					return (Lyria.Platform.is('iphone') || Lyria.Platform.is('ipod') || Lyria.Platform.is('ipad'));
	
				case 'iphone':
					return global.navigator.userAgent.match(/iPhone/i);
	
				case 'ipod':
					return global.navigator.userAgent.match(/iPod/i);
	
				case 'ipad':
					return global.navigator.userAgent.match(/iPad/i);
	
				case 'android':
					return global.navigator.userAgent.match(/Android/i);
	
				case 'bada':
					return global.navigator.userAgent.match(/Bada/i);
	
				case 'webos':
					return global.navigator.userAgent.match(/webOS/i);
					
				case 'wp7':
					return global.navigator.userAgent.match(/Windows Phone OS/i);
	
				case 'mobile':
					return (Lyria.Platform.is('android') || Lyria.Platform.is('bada') || Lyria.Platform.is('webos') || Lyria.Platform.is('ios'));
	
				case 'desktop':
					return !(Lyria.Platform.is('mobile'));
			}
		},
	
		isMobile: function() {
			return Lyria.Platform.is('mobile');
		},
	
		get language() {
			var language = global.navigator.language || global.navigator.systemLanguage;
			
			return language.split('-')[0];
		}
	});
	
	Lyria.DisplayOrientation = {
		Portrait: 0,
		Landscape: 1
	};
	
	// Fallback language
	Lyria.defaultLanguage = "en";
	Lyria.Language = Lyria.Platform.language || Lyria.defaultLanguage;
	
})(this, this.Lyria = this.Lyria || {});
