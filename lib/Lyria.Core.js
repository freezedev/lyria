if (typeof Lyria === 'undefined') var Lyria = {};

	

// jQuery Scale support
var rmatrix = /matrix\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\)/;

jQuery.support.scaleTransformProp = (function() {
    var div = document.createElement('div');
    return div.style.MozTransform === '' ? 'MozTransform' : 
           div.style.WebkitTransform === '' ? 'WebkitTransform' :
           div.style.OTransform === '' ? 'OTransform' :
           div.style.MsTransform === '' ? 'MsTransform' :
           false;
})();

if (jQuery.support.scaleTransformProp) {

    jQuery.cssHooks['scale'] = {
        get: function(elem, computed, extra) {
            var transform = jQuery.curCSS(elem, jQuery.support.scaleTransformProp),
                m = transform.match(rmatrix);
            return m && parseFloat(m[1]) || 1.0;
        },
        set: function(elem, val) {
            var transform = jQuery.curCSS(elem, jQuery.support.scaleTransformProp);
            if (transform.match(rmatrix)) {
                elem.style[jQuery.support.scaleTransformProp]= transform.replace(rmatrix, function(m, $1, $2, $3, $4, $5, $6) {
                    return 'matrix(' + [val, $2, $3, val, $5, $6].join(',') + ')';
                });
            } else {            
            elem.style[jQuery.support.scaleTransformProp]= 'scale(' + val + ')';
            }
        }
    };

    jQuery.fx.step.scale = function(fx) {
        jQuery.cssHooks['scale'].set(fx.elem, fx.now)
    };

}


Lyria.Platform = function()
{
	var
	Browser = 
	{
		get: function() { return navigator.userAgent; },
		getName: function() { return navigator.appName; },
		getVersion: function() { return navigator.appVersion; }
	},
	
	getName = function()
	{
		return navigator.platform;
	},
	
	is = function(value)
	{
		if (typeof(value) === "undefined") return;
		
		switch (value.toLowerCase())
		{
			case '32bit':
			case '32-bit': return !(is('64bit')); break;
			
			case '64bit':
			case '64-bit': return (navigator.platform.match(/x86_64/i)); break;
			
			case 'win':
			case 'windows': break;
			
			case 'linux': break;
			
			case 'mac':
			case 'macos':
			case 'macosx':
			case 'mac os x': break;
			
			case 'ios': return (is('iphone') || is('ipod') || is('ipad')); break; 
			
			case 'iphone': return navigator.userAgent.match(/iPhone/i); break;
			
			case 'ipod': return navigator.userAgent.match(/iPod/i); break;
			
			case 'ipad': return navigator.userAgent.match(/iPad/i); break;
			
			case 'android': return navigator.userAgent.match(/Android/i); break;
			
			case 'bada': return navigator.userAgent.match(/Bada/i); break;
			
			case 'webos': return navigator.userAgent.match(/webOS/i); break;
			
			case 'mobile': return (is('android') || is('bada') || is('webos') || is('ios')); break;
			
			case 'desktop': return !(is('mobile')); break;
		}
	},
	
	isMobile = function()
	{
		return is('mobile');
	},
	
	getLanguage = function()
	{
		return navigator.language;
	};
	
	return {
		Browser: Browser,
		getName: getName,
		is: is,
		isMobile: isMobile,
		getLanguage: getLanguage
	};
}();

DisplayOrientation = 
{
	Portrait: 0,
	Landscape: 1
};

Lyria.Screen = function()
{
	var
	orientation = DisplayOrientation.Landscape,
	
	size = function(prop, value)
	{
		switch (prop)
		{
			case 'width':
			case 'x':
			{
				if (typeof (value) === "undefined") return $(window).width();
				else $(window).width(value);
				break;
			}
			
			case 'height':
			case 'y':
			{
				if (typeof (value) === "undefined") return $(window).height();
				else $(window).height(value);
				break;
			}
			
			default:
			{
				return (size('x') + ' ' + size('y')); break;
			}
		}
	},
	
	resize = function()
	{
		
	},
	
	init = function()
	{
		resize();
	};
	
	$(document).ready(init);
	$(window).resize(resize);
	
	return {
		orientation: orientation,
		size: size
	}
};


Lyria.Cursor = function()
{
	var
	
	pos = function(prop)
	{
		switch (prop)
		{
			case 'left':
			case 'x':
			{
				break;
			}
			
			case 'top':
			case 'y':
			{
				break;
			}
			
			case 'right':
			{
				break;
			}
			
			case 'bottom':
			{
				break;
			}
			
			default:
			{
				break;
			}
		}
	};
	
	return {
		pos: pos
	};
}();


Lyria.Console = function()
{
	var
	_elementId,
	
	init = function(elementId)
	{
		if (typeof(elementId) === "undefined") _elementId = document.createElement('<div id="console"></div>');
		else _elementId = elementId;
		
		
	},
	
	resize = function()
	{
		
	},
	
	log = function(msg)
	{
		
	};
	
	$(window).resize(function()
	{
		
	});
	
	return {
		init: init,
		log: log
	};
}();
