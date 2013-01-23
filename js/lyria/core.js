/**
 * @namespace Lyria
 * Lyria namespace decleration
 */
;(function(Lyria, undefined) {
	'use strict';
	
	/**
	 * @class Lyria.Platform
	 * Gets information about the current platform
	 */
	Lyria.Platform = Lyria.Base.extend({
		Browser: {
			get: function() {
				return navigator.userAgent;
			},
			get name() {
				return navigator.appName;
			},
			get version() {
				return navigator.appVersion;
			}
		},
	
		get name() {
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
	
		get language() {
			var language = navigator.language || navigator.systemLanguage;
			
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
})(window.Lyria = window.Lyria || {});
