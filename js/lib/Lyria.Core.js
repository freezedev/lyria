/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
var Lyria = Lyria || {};

// Debug settings
Lyria.Debug = true;

// General constants
Lyria.Constants = {
	animSpeed: 300
};

/**
 *
 */
Lyria.Base = {
	extend: function(extendedObject, options) {
		var defaultOptions = {
			initParameter: null,
			createFunction: false
		};
		options = $.extend(true, defaultOptions, options);
		
		var newObject = $.extend(true, {}, Lyria.Base, extendedObject);
		
		if (!options.createFunction) {
			if (newObject.init && (typeof newObject.init === "function")) {
				newObject.init(options.initParameter);
			}
		
			return newObject;
		} else {
			return function(parameter) { 
				if (newObject.init && (typeof newObject.init === "function")) {
					newObject.init.apply(this, arguments);
				}
				
				return newObject; 
			};
		}
	},
	log: function(message) {
		Lyria.Console.log(message);
	},
	name: 'Base',
	id: 0,
	init: function() {
	},
	has: function(key) {
		if( typeof key === "string") {
			return ( typeof this[key] === "undefined") ? false : true;
		}

		return false;
	},
	attr: function(key, value) {
		if( typeof value === "undefined") {
			// Getter
			return (this.has(key)) ? this[key] : null;
		} else {
			// Setter
			this[key] = value;
		}
	},
	toJSON: function() {
		function delFunctionInObject(object) {
			$.each(object, function(key, value) {
				if( typeof value === "function") {
					delete object[key];
				} else {
					if( typeof value === "object") {
						delFunctionInObject(value);
					}
				}
			});
		}

		var JSONObject = Lyria.Utils.cloneObject(this);
		delFunctionInObject(JSONObject);

		return JSONObject;
	},
	each: function(callback) {
		
	},
	save: function(name) {
		
	},
	load: function(name) {
		
	}
}

/**
 * @class Lyria.Platform
 * Gets information about the current platform
 */
Lyria.Platform = Lyria.Base.extend({
	Browser: {
		get: function() {
			return navigator.userAgent;
		},
		getName: function() {
			return navigator.appName;
		},
		getVersion: function() {
			return navigator.appVersion;
		}
	},

	getName: function() {
		return navigator.platform;
	},

	is: function(value) {
		if( typeof (value) === "undefined")
			return;

		switch (value.toLowerCase()) {
			case '32bit':
			case '32-bit':
				return !(is('64bit'));
				break;

			case '64bit':
			case '64-bit':
				return (navigator.platform.match(/x86_64/i));
				break;

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
				break;

			case 'iphone':
				return navigator.userAgent.match(/iPhone/i);
				break;

			case 'ipod':
				return navigator.userAgent.match(/iPod/i);
				break;

			case 'ipad':
				return navigator.userAgent.match(/iPad/i);
				break;

			case 'android':
				return navigator.userAgent.match(/Android/i);
				break;

			case 'bada':
				return navigator.userAgent.match(/Bada/i);
				break;

			case 'webos':
				return navigator.userAgent.match(/webOS/i);
				break;
				
			case 'wp7':
				return navigator.userAgent.match(/Windows Phone OS/i);
				break;

			case 'mobile':
				return (Lyria.Platform.is('android') || Lyria.Platform.is('bada') || Lyria.Platform.is('webos') || Lyria.Platform.is('ios'));
				break;

			case 'desktop':
				return !(Lyria.Platform.is('mobile'));
				break;
		}
	},

	isMobile: function() {
		return Lyria.Platform.is('mobile');
	},

	getLanguage: function() {
		var language = navigator.language || navigator.systemLanguage;
		
		return language.split('-')[0];
	}
});

DisplayOrientation = {
	Portrait: 0,
	Landscape: 1
};

Lyria.Console = Lyria.Base.extend({
	/**
	 *
	 */
	init: function() {
		
		$('body').append('<div id="console"><div class="message-container"></div><div class="close-btn-24"></div></div>');

		$('#console').on('click', '.close-btn-24', function(event) {
			Lyria.Console.hide();
		});
	},
	/**
	 *
	 * @param {string} msg
	 */
	log: function(msg, className) {
		if($('#console').length === 0) {
			Lyria.Console.init();
		}

		if(!$('#console').is(':visible')) {
			Lyria.Console.show();
		}

		if(!className) {
			className = "";
		}

		$('#console .message-container').append('<span class="message">' + msg + ' ' + className + '</span>');
	},
	/**
	 *
	 */
	show: function() {
		$('#console').fadeIn(Lyria.Constants.animSpeed);
	},
	/**
	 *
	 */
	hide: function() {
		$('#console').fadeOut(Lyria.Constants.animSpeed);
	}
});

// Fallback language
Lyria.DefaultLanguage = "en";
Lyria.Language = Lyria.Platform.getLanguage() || Lyria.DefaultLanguage;


// shim layer with setTimeout fallback
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
if (!window.requestAnimFrame) {
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       || 
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     || 
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();
}


// jQuery transform plugin
(function($) {
	var vendorPrefix = ['webkit', 'o', 'ms', 'moz'];
	
	$.fn.vendorProperty = function(property, argument) {
		
		var self = this;
		
		self.css(property, argument);
		$.each(vendorPrefix, function(index, value) {
			self.css('-' + value + '-' + property, argument);
		});
		
	}
	
	$.fn.transform = function(transformArgument) {
		if (typeof transformArgument === "undefined") {
			return;
		}
		
		this.vendorProperty('transform', transformArgument);
	}
	
	$.fn.transformOrigin = function(originX, originY) {
		
		var originArgument = originX + ' ' + originY;
		
		this.vendorProperty('transform-origin', originArgument);
	}
	
	$.fn.scale = function(scaleX, scaleY) {
		if (typeof scaleY === "undefined") {
			scaleY = scaleX;
		}
		
		this.transform('scale(' + scaleX + ', ' + scaleY + ')');
	}
	
	$.fn.rotate = function(angle) {
		if (typeof angle !== "number") {
			return;
		}
		
		this.transform('rotate(' + angle + 'deg)');
	}
})(jQuery);
