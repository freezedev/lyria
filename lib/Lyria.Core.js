var Lyria = Lyria || {};

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
		return navigator.language;
	}
};

DisplayOrientation = {
	Portrait: 0,
	Landscape: 1
};

Lyria.Console = function() {
	var _elementId, init = function(elementId) {
		if( typeof (elementId) === "undefined")
			_elementId = document.createElement('<div id="console"></div>');
		else
			_elementId = elementId;

	}, resize = function() {

	}, log = function(msg) {

	};

	$(window).resize(function() {

	});

	return {
		init: init,
		log: log
	};
}();
