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
 * @class Lyria.Platform
 * Gets information about the current platform
 */
Lyria.Platform = {
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
				return (is('iphone') || is('ipod') || is('ipad'));
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

			case 'mobile':
				return (is('android') || is('bada') || is('webos') || is('ios'));
				break;

			case 'desktop':
				return !(is('mobile'));
				break;
		}
	},

	isMobile: function() {
		return is('mobile');
	},

	getLanguage: function() {
		return navigator.language.split('-')[0];
	}
};

DisplayOrientation = {
	Portrait: 0,
	Landscape: 1
};

Lyria.Console = {
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
		if ($('#console').length === 0) {
			Lyria.Console.init();
		}
		
		if (!$('#console').is(':visible')) {
			Lyria.Console.show();
		}
		
		if (!className) {
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
	},
	attr: function(prop, value) {
		
	}
};

// Fallback language
Lyria.DefaultLanguage = "en"; 
Lyria.Language = Lyria.Platform.getLanguage() || Lyria.DefaultLanguage;
